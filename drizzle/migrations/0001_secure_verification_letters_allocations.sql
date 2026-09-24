ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS content_hash TEXT;
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS mime_type TEXT;
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS supersedes_id UUID REFERENCES public.documents(id) ON DELETE SET NULL;
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS reviewed_by UUID;
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;

ALTER TABLE public.approvals ADD COLUMN IF NOT EXISTS signature_digest TEXT;
ALTER TABLE public.approvals ADD COLUMN IF NOT EXISTS signed_at TIMESTAMPTZ;

ALTER TABLE public.appointment_letters ADD COLUMN IF NOT EXISTS pdf_path TEXT;
ALTER TABLE public.appointment_letters ADD COLUMN IF NOT EXISTS pdf_hash TEXT;
ALTER TABLE public.appointment_letters ADD COLUMN IF NOT EXISTS previous_letter_id UUID REFERENCES public.appointment_letters(id) ON DELETE SET NULL;
ALTER TABLE public.appointment_letters ADD COLUMN IF NOT EXISTS signature_digest TEXT;
ALTER TABLE public.appointment_letters ADD COLUMN IF NOT EXISTS revoked_by UUID;
ALTER TABLE public.appointment_letters ADD COLUMN IF NOT EXISTS revoked_at TIMESTAMPTZ;
ALTER TABLE public.appointment_letters ADD COLUMN IF NOT EXISTS revocation_reason TEXT;

CREATE TABLE public.document_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE RESTRICT,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE RESTRICT,
  decision TEXT NOT NULL CHECK (decision IN ('Verified','Correction','Rejected')),
  reason_code TEXT,
  comment TEXT,
  checklist JSONB NOT NULL DEFAULT '{}'::jsonb,
  duplicate_matches JSONB NOT NULL DEFAULT '[]'::jsonb,
  reviewed_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.document_reviews TO authenticated;
GRANT ALL ON public.document_reviews TO service_role;
ALTER TABLE public.document_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff read document reviews" ON public.document_reviews FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

CREATE TABLE public.letter_lifecycle (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  letter_id UUID NOT NULL REFERENCES public.appointment_letters(id) ON DELETE RESTRICT,
  event TEXT NOT NULL CHECK (event IN ('Issued','Reissued','Superseded','Revoked')),
  from_status TEXT,
  to_status TEXT NOT NULL,
  reason TEXT,
  actor_id UUID NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.letter_lifecycle TO authenticated;
GRANT ALL ON public.letter_lifecycle TO service_role;
ALTER TABLE public.letter_lifecycle ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff read letter lifecycle" ON public.letter_lifecycle FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

CREATE TABLE public.partner_territories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  territory_id UUID NOT NULL REFERENCES public.territories(id) ON DELETE RESTRICT,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'Active',
  allocated_by UUID NOT NULL,
  allocated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  released_at TIMESTAMPTZ,
  UNIQUE (partner_id, territory_id, status)
);
GRANT SELECT, INSERT, UPDATE ON public.partner_territories TO authenticated;
GRANT ALL ON public.partner_territories TO service_role;
ALTER TABLE public.partner_territories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff read partner territories" ON public.partner_territories FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

CREATE OR REPLACE FUNCTION public.block_immutable_change()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'Immutable records cannot be changed';
END;
$$;

CREATE TRIGGER audit_logs_immutable BEFORE UPDATE OR DELETE ON public.audit_logs FOR EACH ROW EXECUTE FUNCTION public.block_immutable_change();
CREATE TRIGGER document_reviews_immutable BEFORE UPDATE OR DELETE ON public.document_reviews FOR EACH ROW EXECUTE FUNCTION public.block_immutable_change();
CREATE TRIGGER letter_lifecycle_immutable BEFORE UPDATE OR DELETE ON public.letter_lifecycle FOR EACH ROW EXECUTE FUNCTION public.block_immutable_change();

REVOKE UPDATE, DELETE ON public.audit_logs FROM authenticated;
REVOKE UPDATE, DELETE ON public.document_reviews FROM authenticated;
REVOKE UPDATE, DELETE ON public.letter_lifecycle FROM authenticated;

CREATE OR REPLACE FUNCTION public.record_document_review(
  _document_id UUID, _decision TEXT, _reason_code TEXT, _comment TEXT,
  _checklist JSONB DEFAULT '{}'::jsonb, _duplicate_matches JSONB DEFAULT '[]'::jsonb
) RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _doc public.documents%ROWTYPE; _review_id UUID;
BEGIN
  IF auth.uid() IS NULL OR NOT (public.has_role(auth.uid(),'verification_officer') OR public.has_role(auth.uid(),'super_admin')) THEN
    RAISE EXCEPTION 'Not authorized to review documents';
  END IF;
  IF _decision NOT IN ('Verified','Correction','Rejected') THEN RAISE EXCEPTION 'Invalid review decision'; END IF;
  IF _decision IN ('Correction','Rejected') AND (coalesce(trim(_reason_code),'')='' OR coalesce(trim(_comment),'')='') THEN
    RAISE EXCEPTION 'A reason and reviewer comment are required';
  END IF;
  SELECT * INTO _doc FROM public.documents WHERE id=_document_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Document not found'; END IF;
  INSERT INTO public.document_reviews(document_id,lead_id,decision,reason_code,comment,checklist,duplicate_matches,reviewed_by)
  VALUES(_document_id,_doc.lead_id,_decision,_reason_code,_comment,coalesce(_checklist,'{}'::jsonb),coalesce(_duplicate_matches,'[]'::jsonb),auth.uid()) RETURNING id INTO _review_id;
  UPDATE public.documents SET status=_decision, reviewer_comment=_comment, reviewed_by=auth.uid(), reviewed_at=now() WHERE id=_document_id;
  UPDATE public.leads SET status=CASE WHEN _decision='Correction' THEN 'Correction' WHEN _decision='Rejected' THEN 'Rejected' ELSE status END, updated_at=now() WHERE id=_doc.lead_id;
  INSERT INTO public.audit_logs(actor_id,actor_name,action,module,entity_id,before_data,after_data,reason)
  SELECT auth.uid(),p.full_name,'Document '||lower(_decision),'Verification',_document_id::text,jsonb_build_object('status',_doc.status),jsonb_build_object('status',_decision,'review_id',_review_id),_comment FROM public.profiles p WHERE p.id=auth.uid();
  RETURN _review_id;
END;
$$;
GRANT EXECUTE ON FUNCTION public.record_document_review(UUID,TEXT,TEXT,TEXT,JSONB,JSONB) TO authenticated;

CREATE OR REPLACE FUNCTION public.decide_application(
  _lead_id UUID, _decision TEXT, _reason TEXT, _conditions TEXT, _signature TEXT, _territory_ids UUID[] DEFAULT ARRAY[]::UUID[]
) RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _lead public.leads%ROWTYPE; _approval_id UUID; _territory UUID; _partner_id UUID; _digest TEXT;
BEGIN
  IF auth.uid() IS NULL OR NOT (public.has_role(auth.uid(),'approver') OR public.has_role(auth.uid(),'super_admin')) THEN RAISE EXCEPTION 'Not authorized to approve applications'; END IF;
  IF _decision NOT IN ('Approved','Correction','Rejected') THEN RAISE EXCEPTION 'Invalid approval decision'; END IF;
  IF coalesce(trim(_reason),'')='' THEN RAISE EXCEPTION 'Decision reason is required'; END IF;
  SELECT * INTO _lead FROM public.leads WHERE id=_lead_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Lead not found'; END IF;
  IF _lead.created_by=auth.uid() THEN RAISE EXCEPTION 'Separation of duties: creator cannot approve'; END IF;
  IF EXISTS(SELECT 1 FROM public.verifications WHERE lead_id=_lead_id AND verified_by=auth.uid()) THEN RAISE EXCEPTION 'Separation of duties: verifier cannot approve'; END IF;
  IF _decision='Approved' THEN
    IF NOT EXISTS(SELECT 1 FROM public.documents WHERE lead_id=_lead_id) OR EXISTS(SELECT 1 FROM public.documents d WHERE d.lead_id=_lead_id AND d.version=(SELECT max(d2.version) FROM public.documents d2 WHERE d2.lead_id=d.lead_id AND d2.doc_type=d.doc_type) AND d.status<>'Verified') THEN RAISE EXCEPTION 'All current document versions must be verified'; END IF;
    IF NOT EXISTS(SELECT 1 FROM public.due_diligence WHERE lead_id=_lead_id AND recommendation IN ('Pass','Conditional pass')) THEN RAISE EXCEPTION 'Due diligence must be complete'; END IF;
    FOREACH _territory IN ARRAY _territory_ids LOOP
      IF NOT EXISTS(SELECT 1 FROM public.territories WHERE id=_territory AND occupied+reserved<capacity FOR UPDATE) THEN RAISE EXCEPTION 'Selected territory has no available capacity'; END IF;
    END LOOP;
  END IF;
  _digest:=encode(digest(_lead_id::text||'|'||_decision||'|'||coalesce(_signature,'')||'|'||clock_timestamp()::text,'sha256'),'hex');
  INSERT INTO public.approvals(lead_id,decision,remarks,conditions,signature,signature_digest,signed_at,decided_by)
  VALUES(_lead_id,_decision,_reason,_conditions,_signature,_digest,now(),auth.uid()) RETURNING id INTO _approval_id;
  UPDATE public.leads SET status=_decision,updated_at=now() WHERE id=_lead_id;
  IF _decision='Approved' THEN
    INSERT INTO public.partners(lead_id,name,partner_type,territory_id,status,activated_on)
    VALUES(_lead_id,_lead.applicant_name,_lead.lead_type,_territory_ids[1],'Approved',current_date)
    ON CONFLICT DO NOTHING RETURNING id INTO _partner_id;
    IF _partner_id IS NULL THEN SELECT id INTO _partner_id FROM public.partners WHERE lead_id=_lead_id ORDER BY created_at DESC LIMIT 1; END IF;
    FOREACH _territory IN ARRAY _territory_ids LOOP
      INSERT INTO public.partner_territories(partner_id,territory_id,lead_id,allocated_by) VALUES(_partner_id,_territory,_lead_id,auth.uid());
      UPDATE public.territories SET occupied=occupied+1,status=CASE WHEN occupied+reserved+1>=capacity THEN 'Filled' ELSE 'Partial' END WHERE id=_territory;
      UPDATE public.reservations SET status='Allocated' WHERE territory_id=_territory AND lead_id=_lead_id AND status='Active';
    END LOOP;
  END IF;
  INSERT INTO public.audit_logs(actor_id,actor_name,action,module,entity_id,before_data,after_data,reason)
  SELECT auth.uid(),p.full_name,'Application '||lower(_decision),'Approvals',_lead_id::text,jsonb_build_object('status',_lead.status),jsonb_build_object('status',_decision,'approval_id',_approval_id,'signature_digest',_digest),_reason FROM public.profiles p WHERE p.id=auth.uid();
  RETURN _approval_id;
END;
$$;
GRANT EXECUTE ON FUNCTION public.decide_application(UUID,TEXT,TEXT,TEXT,TEXT,UUID[]) TO authenticated;

CREATE OR REPLACE FUNCTION public.bulk_reserve_territories(_territory_ids UUID[], _lead_id UUID)
RETURNS INT LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE _territory UUID; _count INT:=0;
BEGIN
  IF auth.uid() IS NULL OR NOT (public.has_role(auth.uid(),'super_admin') OR public.has_role(auth.uid(),'state_manager') OR public.has_role(auth.uid(),'district_manager')) THEN RAISE EXCEPTION 'Not authorized to reserve territory'; END IF;
  IF coalesce(array_length(_territory_ids,1),0)=0 THEN RAISE EXCEPTION 'Select at least one block'; END IF;
  FOREACH _territory IN ARRAY _territory_ids LOOP
    IF NOT EXISTS(SELECT 1 FROM public.territories WHERE id=_territory AND occupied+reserved<capacity FOR UPDATE) THEN RAISE EXCEPTION 'A selected block has no available capacity'; END IF;
  END LOOP;
  FOREACH _territory IN ARRAY _territory_ids LOOP
    INSERT INTO public.reservations(territory_id,lead_id,reserved_by) VALUES(_territory,_lead_id,auth.uid());
    UPDATE public.territories SET reserved=reserved+1,status=CASE WHEN occupied+reserved+1>=capacity THEN 'Reserved' ELSE 'Partial' END WHERE id=_territory;
    _count:=_count+1;
  END LOOP;
  INSERT INTO public.audit_logs(actor_id,actor_name,action,module,entity_id,after_data)
  SELECT auth.uid(),p.full_name,'Bulk territory reservation','Territory',coalesce(_lead_id::text,'unassigned'),jsonb_build_object('territory_ids',_territory_ids,'count',_count) FROM public.profiles p WHERE p.id=auth.uid();
  RETURN _count;
END;
$$;
GRANT EXECUTE ON FUNCTION public.bulk_reserve_territories(UUID[],UUID) TO authenticated;

CREATE OR REPLACE FUNCTION public.release_reservation(_reservation_id UUID, _reason TEXT)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE _r public.reservations%ROWTYPE;
BEGIN
  IF auth.uid() IS NULL OR NOT (public.has_role(auth.uid(),'super_admin') OR public.has_role(auth.uid(),'state_manager') OR public.has_role(auth.uid(),'district_manager')) THEN RAISE EXCEPTION 'Not authorized to release territory'; END IF;
  SELECT * INTO _r FROM public.reservations WHERE id=_reservation_id FOR UPDATE;
  IF NOT FOUND OR _r.status<>'Active' THEN RAISE EXCEPTION 'Active reservation not found'; END IF;
  UPDATE public.reservations SET status='Released' WHERE id=_reservation_id;
  UPDATE public.territories SET reserved=greatest(0,reserved-1),status=CASE WHEN occupied>=capacity THEN 'Filled' WHEN occupied>0 OR reserved-1>0 THEN 'Partial' ELSE 'Vacant' END WHERE id=_r.territory_id;
  INSERT INTO public.audit_logs(actor_id,action,module,entity_id,reason,before_data,after_data) VALUES(auth.uid(),'Reservation released','Territory',_reservation_id::text,_reason,jsonb_build_object('status','Active'),jsonb_build_object('status','Released'));
END;
$$;
GRANT EXECUTE ON FUNCTION public.release_reservation(UUID,TEXT) TO authenticated;

CREATE OR REPLACE FUNCTION public.issue_appointment_letter(
  _lead_id UUID, _template_id UUID, _signatory TEXT, _effective_date DATE, _expiry_date DATE,
  _snapshot JSONB, _pdf_path TEXT, _pdf_hash TEXT, _qr_token TEXT, _previous_letter_id UUID DEFAULT NULL
) RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE _partner_id UUID; _letter_id UUID; _old_status TEXT;
BEGIN
  IF auth.uid() IS NULL OR NOT (public.has_role(auth.uid(),'letter_issuer') OR public.has_role(auth.uid(),'super_admin')) THEN RAISE EXCEPTION 'Not authorized to issue letters'; END IF;
  IF coalesce(trim(_signatory),'')='' OR _effective_date IS NULL OR _expiry_date<=_effective_date THEN RAISE EXCEPTION 'Valid signatory and dates are required'; END IF;
  IF NOT EXISTS(SELECT 1 FROM public.approvals WHERE lead_id=_lead_id AND decision='Approved') THEN RAISE EXCEPTION 'Application is not approved'; END IF;
  SELECT id INTO _partner_id FROM public.partners WHERE lead_id=_lead_id ORDER BY created_at DESC LIMIT 1;
  IF _partner_id IS NULL OR NOT EXISTS(SELECT 1 FROM public.partner_territories WHERE partner_id=_partner_id AND status='Active') THEN RAISE EXCEPTION 'Partner requires an active territory allocation'; END IF;
  IF _previous_letter_id IS NOT NULL THEN
    SELECT status INTO _old_status FROM public.appointment_letters WHERE id=_previous_letter_id AND lead_id=_lead_id FOR UPDATE;
    IF _old_status<>'Issued' THEN RAISE EXCEPTION 'Only an issued letter can be reissued'; END IF;
    UPDATE public.appointment_letters SET status='Superseded' WHERE id=_previous_letter_id;
  END IF;
  INSERT INTO public.appointment_letters(lead_id,partner_id,template_id,signatory,effective_date,expiry_date,status,snapshot,qr_token,issued_by,issued_at,pdf_path,pdf_hash,previous_letter_id,signature_digest)
  VALUES(_lead_id,_partner_id,_template_id,_signatory,_effective_date,_expiry_date,'Issued',_snapshot,_qr_token,auth.uid(),now(),_pdf_path,_pdf_hash,_previous_letter_id,encode(digest(_pdf_hash||'|'||auth.uid()::text||'|'||_signatory,'sha256'),'hex')) RETURNING id INTO _letter_id;
  IF _previous_letter_id IS NOT NULL THEN INSERT INTO public.letter_lifecycle(letter_id,event,from_status,to_status,actor_id,metadata) VALUES(_previous_letter_id,'Superseded','Issued','Superseded',auth.uid(),jsonb_build_object('replacement_id',_letter_id)); END IF;
  INSERT INTO public.letter_lifecycle(letter_id,event,to_status,actor_id,metadata) VALUES(_letter_id,CASE WHEN _previous_letter_id IS NULL THEN 'Issued' ELSE 'Reissued' END,'Issued',auth.uid(),jsonb_build_object('pdf_hash',_pdf_hash,'previous_letter_id',_previous_letter_id));
  INSERT INTO public.audit_logs(actor_id,action,module,entity_id,after_data) VALUES(auth.uid(),CASE WHEN _previous_letter_id IS NULL THEN 'Appointment letter issued' ELSE 'Appointment letter reissued' END,'Letters',_letter_id::text,jsonb_build_object('pdf_hash',_pdf_hash,'qr_token',_qr_token));
  RETURN _letter_id;
END;
$$;
GRANT EXECUTE ON FUNCTION public.issue_appointment_letter(UUID,UUID,TEXT,DATE,DATE,JSONB,TEXT,TEXT,TEXT,UUID) TO authenticated;

CREATE OR REPLACE FUNCTION public.revoke_appointment_letter(_letter_id UUID, _reason TEXT)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE _status TEXT;
BEGIN
  IF auth.uid() IS NULL OR NOT (public.has_role(auth.uid(),'letter_issuer') OR public.has_role(auth.uid(),'super_admin')) THEN RAISE EXCEPTION 'Not authorized to revoke letters'; END IF;
  IF coalesce(trim(_reason),'')='' THEN RAISE EXCEPTION 'Revocation reason is required'; END IF;
  SELECT status INTO _status FROM public.appointment_letters WHERE id=_letter_id FOR UPDATE;
  IF _status<>'Issued' THEN RAISE EXCEPTION 'Only an issued letter can be revoked'; END IF;
  UPDATE public.appointment_letters SET status='Revoked',revoked_by=auth.uid(),revoked_at=now(),revocation_reason=_reason WHERE id=_letter_id;
  INSERT INTO public.letter_lifecycle(letter_id,event,from_status,to_status,reason,actor_id) VALUES(_letter_id,'Revoked','Issued','Revoked',_reason,auth.uid());
  INSERT INTO public.audit_logs(actor_id,action,module,entity_id,reason,before_data,after_data) VALUES(auth.uid(),'Appointment letter revoked','Letters',_letter_id::text,_reason,jsonb_build_object('status','Issued'),jsonb_build_object('status','Revoked'));
END;
$$;
GRANT EXECUTE ON FUNCTION public.revoke_appointment_letter(UUID,TEXT) TO authenticated;

CREATE OR REPLACE FUNCTION public.guard_issued_letter()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.status IN ('Issued','Superseded','Revoked') AND (NEW.snapshot IS DISTINCT FROM OLD.snapshot OR NEW.pdf_path IS DISTINCT FROM OLD.pdf_path OR NEW.pdf_hash IS DISTINCT FROM OLD.pdf_hash OR NEW.qr_token IS DISTINCT FROM OLD.qr_token OR NEW.issued_by IS DISTINCT FROM OLD.issued_by OR NEW.issued_at IS DISTINCT FROM OLD.issued_at) THEN RAISE EXCEPTION 'Issued letter evidence is immutable'; END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER appointment_letter_evidence_immutable BEFORE UPDATE ON public.appointment_letters FOR EACH ROW EXECUTE FUNCTION public.guard_issued_letter();

CREATE INDEX document_reviews_lead_idx ON public.document_reviews(lead_id,created_at DESC);
CREATE INDEX document_versions_idx ON public.documents(lead_id,doc_type,version DESC);
CREATE INDEX letter_lifecycle_letter_idx ON public.letter_lifecycle(letter_id,created_at DESC);
CREATE INDEX partner_territories_partner_idx ON public.partner_territories(partner_id,status);
CREATE INDEX reservations_active_idx ON public.reservations(territory_id,status,expires_at);
-- Roles
CREATE TYPE public.app_role AS ENUM ('super_admin','state_manager','district_manager','lead_executive','verification_officer','approver','letter_issuer','auditor');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY,
  full_name TEXT NOT NULL DEFAULT 'New user',
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  assigned_state TEXT,
  assigned_district TEXT,
  mfa_enabled BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id)
$$;

CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "roles readable" ON public.user_roles FOR SELECT TO authenticated USING (true);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)), NEW.email)
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, COALESCE((NEW.raw_user_meta_data->>'role')::public.app_role, 'lead_executive'))
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Master data
CREATE TABLE public.companies (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, code TEXT, is_active BOOLEAN NOT NULL DEFAULT true, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE public.banks (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, code TEXT, is_active BOOLEAN NOT NULL DEFAULT true, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE public.programs (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, bank_id UUID REFERENCES public.banks(id) ON DELETE SET NULL, description TEXT, is_active BOOLEAN NOT NULL DEFAULT true, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE public.geographies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level TEXT NOT NULL,
  name TEXT NOT NULL,
  parent_id UUID REFERENCES public.geographies(id) ON DELETE CASCADE,
  code TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.territories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state TEXT NOT NULL, district TEXT NOT NULL, block TEXT NOT NULL,
  capacity INT NOT NULL DEFAULT 1,
  occupied INT NOT NULL DEFAULT 0,
  reserved INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Vacant',
  lat NUMERIC, lng NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_code TEXT NOT NULL UNIQUE DEFAULT 'LD-' || to_char(now(),'YYYY') || '-' || lpad((floor(random()*99999))::text, 5, '0'),
  applicant_name TEXT NOT NULL,
  father_name TEXT, dob DATE, gender TEXT, entity_type TEXT,
  mobile TEXT, alt_mobile TEXT, email TEXT,
  education TEXT, experience TEXT, consent BOOLEAN NOT NULL DEFAULT false,
  lead_type TEXT NOT NULL DEFAULT 'Distributor',
  program_id UUID REFERENCES public.programs(id) ON DELETE SET NULL,
  bank_id UUID REFERENCES public.banks(id) ON DELETE SET NULL,
  source TEXT, priority TEXT NOT NULL DEFAULT 'Medium',
  status TEXT NOT NULL DEFAULT 'Draft',
  owner_id UUID,
  res_address TEXT, res_state TEXT, res_district TEXT, res_block TEXT, res_village TEXT, res_pin TEXT,
  outlet_name TEXT, outlet_address TEXT, outlet_state TEXT, outlet_district TEXT, outlet_block TEXT, outlet_pin TEXT,
  outlet_lat NUMERIC, outlet_lng NUMERIC, landmark TEXT,
  territory_id UUID REFERENCES public.territories(id) ON DELETE SET NULL,
  lead_score INT NOT NULL DEFAULT 0,
  completeness INT NOT NULL DEFAULT 0,
  next_follow_up TIMESTAMPTZ,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX leads_status_idx ON public.leads(status);
CREATE INDEX leads_owner_idx ON public.leads(owner_id);

CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL,
  file_name TEXT, file_path TEXT,
  version INT NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'Uploaded',
  reviewer_comment TEXT,
  expires_on DATE,
  uploaded_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.follow_ups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  task_type TEXT NOT NULL DEFAULT 'Call',
  scheduled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes TEXT,
  outcome TEXT,
  completed BOOLEAN NOT NULL DEFAULT false,
  assigned_to UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  checklist JSONB NOT NULL DEFAULT '{}'::jsonb,
  decision TEXT, remarks TEXT,
  verified_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.due_diligence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  visit_date DATE, inspector TEXT, lat NUMERIC, lng NUMERIC,
  electricity TEXT, internet TEXT, computer TEXT, printer TEXT, biometric TEXT, security TEXT,
  risk TEXT, recommendation TEXT, notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  decision TEXT NOT NULL,
  remarks TEXT, conditions TEXT, signature TEXT,
  decided_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  partner_code TEXT NOT NULL UNIQUE DEFAULT 'PT-' || lpad((floor(random()*999999))::text, 6, '0'),
  name TEXT NOT NULL,
  partner_type TEXT NOT NULL DEFAULT 'Distributor',
  parent_id UUID REFERENCES public.partners(id) ON DELETE SET NULL,
  territory_id UUID REFERENCES public.territories(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'Active',
  activated_on DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  territory_id UUID NOT NULL REFERENCES public.territories(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  reserved_by UUID,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT now() + interval '7 days',
  status TEXT NOT NULL DEFAULT 'Active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.letter_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, body TEXT NOT NULL DEFAULT '', is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.appointment_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  partner_id UUID REFERENCES public.partners(id) ON DELETE SET NULL,
  letter_number TEXT NOT NULL UNIQUE DEFAULT 'AL/' || to_char(now(),'YYYY') || '/' || lpad((floor(random()*99999))::text, 5, '0'),
  template_id UUID REFERENCES public.letter_templates(id) ON DELETE SET NULL,
  signatory TEXT, effective_date DATE, expiry_date DATE,
  status TEXT NOT NULL DEFAULT 'Draft',
  snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  qr_token TEXT NOT NULL DEFAULT encode(gen_random_bytes(12),'hex'),
  issued_by UUID, issued_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  title TEXT NOT NULL, body TEXT, category TEXT NOT NULL DEFAULT 'General',
  priority TEXT NOT NULL DEFAULT 'Normal',
  link TEXT, is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID, actor_name TEXT,
  action TEXT NOT NULL, module TEXT NOT NULL, entity_id TEXT,
  before_data JSONB, after_data JSONB, reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.saved_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  module TEXT NOT NULL DEFAULT 'leads',
  name TEXT NOT NULL,
  filters JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.import_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL, module TEXT NOT NULL DEFAULT 'leads',
  total_rows INT NOT NULL DEFAULT 0, valid_rows INT NOT NULL DEFAULT 0, error_rows INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Draft', errors JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_by UUID, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['companies','banks','programs','geographies','territories','leads','documents','follow_ups','verifications','due_diligence','approvals','partners','reservations','letter_templates','appointment_letters','notifications','audit_logs','saved_views','import_batches']
  LOOP
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY "staff read %1$s" ON public.%1$I FOR SELECT TO authenticated USING (public.is_staff(auth.uid()))', t);
    EXECUTE format('CREATE POLICY "staff write %1$s" ON public.%1$I FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()) AND NOT public.has_role(auth.uid(), ''auditor''))', t);
    EXECUTE format('CREATE POLICY "staff update %1$s" ON public.%1$I FOR UPDATE TO authenticated USING (public.is_staff(auth.uid()) AND NOT public.has_role(auth.uid(), ''auditor''))', t);
    EXECUTE format('CREATE POLICY "admin delete %1$s" ON public.%1$I FOR DELETE TO authenticated USING (public.has_role(auth.uid(), ''super_admin''))', t);
  END LOOP;
END $$;

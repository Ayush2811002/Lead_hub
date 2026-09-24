import { createServerFn } from "@tanstack/react-start";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const reviewSchema = z.object({
  documentId: z.string().uuid(),
  decision: z.enum(["Verified", "Correction", "Rejected"]),
  reasonCode: z.string().max(120).optional().default(""),
  comment: z.string().max(2000).optional().default(""),
  checklist: z.record(z.boolean()),
  duplicateMatches: z.array(z.object({ leadId: z.string(), code: z.string(), confidence: z.number() })).default([]),
});

export const recordDocumentReview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => reviewSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: reviewId, error } = await context.supabase.rpc("record_document_review", {
      _document_id: data.documentId,
      _decision: data.decision,
      _reason_code: data.reasonCode,
      _comment: data.comment,
      _checklist: data.checklist,
      _duplicate_matches: data.duplicateMatches,
    });
    if (error) throw new Error(error.message);
    return { reviewId };
  });

const approvalSchema = z.object({
  leadId: z.string().uuid(),
  decision: z.enum(["Approved", "Correction", "Rejected"]),
  reason: z.string().min(3).max(2000),
  conditions: z.string().max(2000).optional().default(""),
  signature: z.string().min(2).max(160),
  territoryIds: z.array(z.string().uuid()).default([]),
});

export const decideApplication = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => approvalSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: approvalId, error } = await context.supabase.rpc("decide_application", {
      _lead_id: data.leadId,
      _decision: data.decision,
      _reason: data.reason,
      _conditions: data.conditions,
      _signature: data.signature,
      _territory_ids: data.territoryIds,
    });
    if (error) throw new Error(error.message);
    return { approvalId };
  });

const reserveSchema = z.object({ territoryIds: z.array(z.string().uuid()).min(1), leadId: z.string().uuid().nullable() });

export const reserveTerritories = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => reserveSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: count, error } = await context.supabase.rpc("bulk_reserve_territories", {
      _territory_ids: data.territoryIds,
      _lead_id: (data.leadId ?? null) as never,
    });
    if (error) throw new Error(error.message);
    return { count };
  });

export const releaseReservation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ reservationId: z.string().uuid(), reason: z.string().min(3).max(500) }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.rpc("release_reservation", { _reservation_id: data.reservationId, _reason: data.reason });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

type LetterSnapshot = {
  letterNumber: string; applicantName: string; outletName: string; partnerType: string; partnerCode: string;
  territories: string; signatory: string; effectiveDate: string; expiryDate: string; pdfHashPlaceholder: string;
};

function wrapText(text: string, max = 78) {
  const words = text.split(/\s+/); const lines: string[] = []; let line = "";
  for (const word of words) { const next = line ? `${line} ${word}` : word; if (next.length > max) { lines.push(line); line = word; } else line = next; }
  if (line) lines.push(line); return lines;
}

async function makeLetterPdf(snapshot: LetterSnapshot, qrUrl: string) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  page.drawText("LEADHUB NETWORK SERVICES", { x: 48, y: 790, size: 16, font: bold, color: rgb(0.12, 0.28, 0.65) });
  page.drawText("APPOINTMENT LETTER", { x: 205, y: 730, size: 15, font: bold });
  page.drawText(snapshot.letterNumber, { x: 430, y: 790, size: 8, font: regular });
  let y = 680;
  const paragraphs = [
    `To: ${snapshot.applicantName}, ${snapshot.outletName}`,
    `We are pleased to appoint you as an authorized ${snapshot.partnerType} for ${snapshot.territories}, subject to the approved program conditions.`,
    `This appointment is effective from ${snapshot.effectiveDate} through ${snapshot.expiryDate}. The document is valid only while its QR verification status remains Issued.`,
  ];
  for (const paragraph of paragraphs) { for (const line of wrapText(paragraph)) { page.drawText(line, { x: 60, y, size: 11, font: regular }); y -= 17; } y -= 18; }
  page.drawText(snapshot.signatory, { x: 60, y: 185, size: 16, font: bold, color: rgb(0.12, 0.28, 0.65) });
  page.drawText("Digitally signed authorized signatory", { x: 60, y: 166, size: 8, font: regular });
  page.drawText(`Verify: ${qrUrl}`, { x: 60, y: 105, size: 8, font: regular });
  page.drawText(`Document digest: ${snapshot.pdfHashPlaceholder}`, { x: 60, y: 88, size: 7, font: regular, color: rgb(0.35, 0.4, 0.5) });
  return pdf.save({ useObjectStreams: false });
}

const issueSchema = z.object({
  leadId: z.string().uuid(), templateId: z.string().uuid(), signatory: z.string().min(2).max(160),
  effectiveDate: z.string(), expiryDate: z.string(), previousLetterId: z.string().uuid().nullable().default(null),
});

export const issueAppointmentLetter = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => issueSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: lead, error: leadError } = await context.supabase.from("leads")
      .select("id,lead_code,applicant_name,lead_type,outlet_name,partners(id,partner_code,partner_territories(territories(state,district,block)))")
      .eq("id", data.leadId).single();
    if (leadError || !lead) throw new Error(leadError?.message ?? "Lead not found");
    const qrToken = crypto.randomUUID().replaceAll("-", "");
    const qrUrl = `/verify/${qrToken}`;
    const partner = Array.isArray(lead.partners) ? lead.partners[0] : lead.partners;
    const allocations = partner?.partner_territories ?? [];
    const territories = allocations.map((a) => {
      const t = Array.isArray(a.territories) ? a.territories[0] : a.territories;
      return t ? `${t.block}, ${t.district}, ${t.state}` : "";
    }).filter(Boolean).join("; ");
    const letterNumber = `AL/${new Date().getFullYear()}/${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const snapshot = {
      letterNumber, applicantName: lead.applicant_name, outletName: lead.outlet_name ?? lead.applicant_name,
      partnerType: lead.lead_type, partnerCode: partner?.partner_code ?? "Pending", territories,
      signatory: data.signatory, effectiveDate: data.effectiveDate, expiryDate: data.expiryDate,
      pdfHashPlaceholder: "Calculated from immutable PDF bytes",
    };
    const bytes = await makeLetterPdf(snapshot, qrUrl);
    const digestBuffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
    const digest = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", digestBuffer))).map((b) => b.toString(16).padStart(2, "0")).join("");
    const pdfPath = `appointment-letters/${digest}.pdf`;
    const { data: letterId, error } = await context.supabase.rpc("issue_appointment_letter", {
      _lead_id: data.leadId, _template_id: data.templateId, _signatory: data.signatory,
      _effective_date: data.effectiveDate, _expiry_date: data.expiryDate, _snapshot: { ...snapshot, pdfHash: digest },
      _pdf_path: pdfPath, _pdf_hash: digest, _qr_token: qrToken, _previous_letter_id: (data.previousLetterId ?? null) as never,
    });
    if (error) throw new Error(error.message);
    return { letterId, pdfBase64: Buffer.from(bytes).toString("base64"), fileName: `${letterNumber.replaceAll("/", "-")}.pdf`, qrDataUrl: await QRCode.toDataURL(qrUrl), digest };
  });

export const revokeAppointmentLetter = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ letterId: z.string().uuid(), reason: z.string().min(3).max(1000) }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.rpc("revoke_appointment_letter", { _letter_id: data.letterId, _reason: data.reason });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getLetterVerification = createServerFn({ method: "GET" })
  .inputValidator((input) => z.object({ token: z.string().min(20).max(100) }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: letter } = await supabaseAdmin.from("appointment_letters")
      .select("letter_number,status,effective_date,expiry_date,issued_at,signatory,pdf_hash,snapshot")
      .eq("qr_token", data.token).maybeSingle();
    if (!letter) return { valid: false as const };
    const snapshot = letter.snapshot as Record<string, unknown>;
    return { valid: letter.status === "Issued", letterNumber: letter.letter_number, status: letter.status, effectiveDate: letter.effective_date, expiryDate: letter.expiry_date, issuedAt: letter.issued_at, signatory: letter.signatory, digest: letter.pdf_hash, appointee: String(snapshot["applicantName"] ?? ""), territory: String(snapshot["territories"] ?? "") };
  });
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle, Bell, Check, ChevronRight, Download, FileSpreadsheet, FileText, Loader2, Network,
  Search, Sparkles, Star, Timer, Upload, UserCog, X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ROLE_LABELS, useAuth, type AppRole } from "@/hooks/useAuth";
import { duplicateConfidence, exportCsv, exportExcel, exportPdf, scoreLead, type Row } from "@/lib/leadhub-export";

/* ------------------------------ Role switcher ----------------------------- */

export function RoleSwitcher() {
  const { activeRole, setActiveRole, roles } = useAuth();
  const [open, setOpen] = useState(false);
  const list = (Object.keys(ROLE_LABELS) as AppRole[]);
  return (
    <div className="relative">
      <Button variant="outline" size="sm" onClick={() => setOpen(!open)} className="gap-2">
        <UserCog size={15} /><span className="hidden sm:inline">{ROLE_LABELS[activeRole]}</span>
      </Button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <Card className="absolute right-0 z-50 mt-2 w-64 p-2 shadow-modal">
            <div className="px-2 py-1.5 text-[10px] font-semibold uppercase text-muted-foreground">View the portal as</div>
            {list.map((r) => (
              <button key={r} onClick={() => { setActiveRole(r); setOpen(false); }}
                className={cn("flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm hover:bg-secondary", r === activeRole && "bg-secondary font-semibold text-primary")}>
                <span>{ROLE_LABELS[r]}</span>
                {roles.includes(r) && <span className="text-[10px] font-semibold text-success">assigned</span>}
                {r === activeRole && <Check size={14} />}
              </button>
            ))}
          </Card>
        </>
      )}
    </div>
  );
}

export function PermissionGate({ permission, children }: { permission: Parameters<ReturnType<typeof useAuth>["can"]>[0]; children: React.ReactNode }) {
  const { can } = useAuth();
  if (!can(permission)) return null;
  return <>{children}</>;
}

/* ----------------------------- Notifications ------------------------------ */

type Notification = { id: string; title: string; body: string | null; category: string; priority: string; is_read: boolean; created_at: string };

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data, error } = await supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(50);
      if (error) throw error;
      return (data ?? []) as Notification[];
    },
  });
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { data = [] } = useNotifications();
  const qc = useQueryClient();
  const unread = data.filter((n) => !n.is_read).length;

  const markAll = useMutation({
    mutationFn: async () => { await supabase.from("notifications").update({ is_read: true }).eq("is_read", false); },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });

  return (
    <div className="relative">
      <Button size="icon" variant="ghost" aria-label="Notifications" className="relative" onClick={() => setOpen(!open)}>
        <Bell />{unread > 0 && <span className="absolute right-1.5 top-1.5 grid min-w-4 place-items-center rounded-full bg-error px-1 text-[9px] font-bold text-error-foreground">{unread}</span>}
      </Button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <Card className="absolute right-0 z-50 mt-2 w-[340px] overflow-hidden p-0 shadow-modal">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="text-sm font-semibold">Notifications</div>
              <button className="text-xs font-semibold text-primary hover:underline" onClick={() => markAll.mutate()}>Mark all read</button>
            </div>
            <div className="max-h-[360px] overflow-y-auto">
              {data.length === 0 && <div className="p-6 text-center text-xs text-muted-foreground">You are all caught up.</div>}
              {data.map((n) => (
                <div key={n.id} className={cn("border-b px-4 py-3 last:border-0", !n.is_read && "bg-primary-soft/40")}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-sm font-medium">{n.title}</div>
                    <span className="shrink-0 text-[10px] uppercase text-muted-foreground">{n.category}</span>
                  </div>
                  {n.body && <div className="mt-1 text-xs text-muted-foreground">{n.body}</div>}
                  <div className="mt-1 text-[10px] text-muted-foreground">{new Date(n.created_at).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

/* ---------------------------- Command palette ----------------------------- */

const COMMANDS: Array<{ label: string; to: string; hint: string }> = [
  { label: "Executive dashboard", to: "/dashboard", hint: "Overview" },
  { label: "All leads", to: "/leads", hint: "Leads" },
  { label: "Create lead", to: "/leads/new", hint: "Leads" },
  { label: "Follow-up calendar", to: "/follow-ups", hint: "Leads" },
  { label: "Document verification", to: "/verification", hint: "Verification" },
  { label: "Due diligence", to: "/due-diligence", hint: "Verification" },
  { label: "Approval queue", to: "/approvals", hint: "Approvals" },
  { label: "Territory coverage", to: "/territory", hint: "Territory" },
  { label: "Territory heatmap", to: "/territory/heatmap", hint: "Territory" },
  { label: "GIS territory map", to: "/territory/map", hint: "Territory" },
  { label: "Capacity management", to: "/territory/capacity", hint: "Territory" },
  { label: "Partner directory", to: "/partners", hint: "Network" },
  { label: "Partner network tree", to: "/partners/network", hint: "Network" },
  { label: "Generate appointment letter", to: "/letters/generate", hint: "Letters" },
  { label: "Letter register", to: "/letters", hint: "Letters" },
  { label: "Import wizard", to: "/import", hint: "Data" },
  { label: "Notifications", to: "/notifications", hint: "Data" },
  { label: "Reports & analytics", to: "/reports", hint: "Intelligence" },
  { label: "Audit log", to: "/audit", hint: "Intelligence" },
  { label: "Users", to: "/admin/users", hint: "Admin" },
  { label: "Roles & permissions", to: "/admin/roles", hint: "Admin" },
  { label: "Settings", to: "/settings", hint: "Admin" },
];

export function CommandPalette({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen(true); }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setOpen]);

  if (!open) return null;
  const results = COMMANDS.filter((c) => c.label.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center bg-overlay p-4 pt-[12vh]" onClick={() => setOpen(false)}>
      <Card className="w-full max-w-lg overflow-hidden p-0 shadow-modal" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b px-4">
          <Search size={16} className="text-muted-foreground" />
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search screens, leads and actions…"
            className="h-12 flex-1 bg-transparent text-sm outline-none" />
          <kbd className="text-[10px] text-muted-foreground">ESC</kbd>
        </div>
        <div className="max-h-[320px] overflow-y-auto p-2">
          {results.length === 0 && <div className="p-6 text-center text-xs text-muted-foreground">No matches.</div>}
          {results.map((c) => (
            <button key={c.to} onClick={() => { setOpen(false); navigate({ to: c.to }); }}
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-secondary">
              <span>{c.label}</span>
              <span className="flex items-center gap-2 text-[10px] uppercase text-muted-foreground">{c.hint}<ChevronRight size={12} /></span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ------------------------------- Saved views ------------------------------ */

type SavedView = { id: string; name: string; module: string; filters: Record<string, unknown> };

export function SavedViews({ module, current, onApply }: { module: string; current: Record<string, unknown>; onApply: (f: Record<string, unknown>) => void }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const { data = [] } = useQuery({
    queryKey: ["saved-views", module],
    queryFn: async () => {
      const { data, error } = await supabase.from("saved_views").select("*").eq("module", module).order("created_at");
      if (error) throw error;
      return (data ?? []) as SavedView[];
    },
  });
  const save = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Sign in required");
      const { error } = await supabase.from("saved_views").insert({ user_id: user.id, module, name, filters: current as never });
      if (error) throw error;
    },
    onSuccess: () => { setName(""); qc.invalidateQueries({ queryKey: ["saved-views", module] }); },
  });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold text-muted-foreground">Saved views</span>
      {data.map((v) => (
        <Button key={v.id} size="sm" variant="outline" onClick={() => onApply(v.filters)}><Star size={13} />{v.name}</Button>
      ))}
      <div className="flex items-center gap-1">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name this view" className="h-8 w-40 text-xs" />
        <Button size="sm" disabled={!name || save.isPending} onClick={() => save.mutate()}>Save</Button>
      </div>
    </div>
  );
}

/* ------------------------------- Export menu ------------------------------ */

export function ExportMenu({ title, rows }: { title: string; rows: Row[] }) {
  const [open, setOpen] = useState(false);
  const { can } = useAuth();
  if (!can("export")) return null;
  return (
    <div className="relative">
      <Button variant="outline" onClick={() => setOpen(!open)}><Download />Export</Button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <Card className="absolute right-0 z-50 mt-2 w-48 p-2 shadow-modal">
            <button className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-secondary" onClick={() => { exportExcel(title, rows); setOpen(false); }}><FileSpreadsheet size={15} />Excel (.xls)</button>
            <button className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-secondary" onClick={() => { exportCsv(title, rows); setOpen(false); }}><FileText size={15} />CSV</button>
            <button className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-secondary" onClick={() => { exportPdf(title, rows); setOpen(false); }}><FileText size={15} />PDF</button>
          </Card>
        </>
      )}
    </div>
  );
}

/* --------------------------- AI score + duplicates ------------------------ */

export function LeadScoreBadge({ lead }: { lead: Record<string, unknown> }) {
  const { score, band, completeness } = scoreLead(lead);
  const tone = band === "Hot" ? "text-success" : band === "Warm" ? "text-warning" : "text-muted-foreground";
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-semibold", tone)} title={`Completeness ${completeness}%`}>
      <Sparkles size={12} />{score} · {band}
    </span>
  );
}

export function DuplicatePanel({ draft }: { draft: Record<string, unknown> }) {
  const { data = [] } = useQuery({
    queryKey: ["leads-duplicates"],
    queryFn: async () => {
      const { data, error } = await supabase.from("leads").select("id, lead_code, applicant_name, mobile, outlet_name, outlet_address, status").limit(200);
      if (error) throw error;
      return data ?? [];
    },
  });
  const matches = useMemo(() => data
    .map((r) => ({ row: r, confidence: duplicateConfidence(draft, r as Record<string, unknown>) }))
    .filter((m) => m.confidence >= 55)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 4), [data, draft]);

  if (!matches.length) return null;
  return (
    <Card className="border-warning/40 bg-warning-soft/40 p-4 shadow-panel">
      <div className="flex items-center gap-2 text-sm font-semibold text-warning"><AlertTriangle size={16} />Possible duplicates detected</div>
      <div className="mt-3 space-y-2">
        {matches.map(({ row, confidence }) => (
          <div key={row.id} className="flex items-center justify-between rounded-md border bg-surface px-3 py-2 text-xs">
            <div><b>{row.lead_code}</b> · {row.applicant_name} · {row.mobile ?? "no mobile"}</div>
            <span className="font-semibold">{confidence}% match</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground">You can override and continue — the override is recorded in the audit trail.</p>
    </Card>
  );
}

/* ------------------------------ Import wizard ----------------------------- */

type ParsedRow = { row: number; values: Record<string, string>; errors: string[] };

export function ImportWizard() {
  const [step, setStep] = useState(1);
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [committed, setCommitted] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  const required = ["applicant_name", "mobile", "lead_type"];

  function parse(text: string, name: string) {
    const lines = text.trim().split(/\r?\n/);
    const headers = (lines.shift() ?? "").split(",").map((h) => h.trim());
    const parsed: ParsedRow[] = lines.map((line, i) => {
      const cells = line.split(",");
      const values: Record<string, string> = {};
      headers.forEach((h, idx) => { values[h] = (cells[idx] ?? "").trim(); });
      const errors: string[] = [];
      required.forEach((r) => { if (!values[r]) errors.push(`${r} is required`); });
      if (values["mobile"] && !/^\+?\d[\d\s-]{7,}$/.test(values["mobile"])) errors.push("mobile is not valid");
      return { row: i + 2, values, errors };
    });
    setFileName(name); setRows(parsed); setStep(2);
  }

  const valid = rows.filter((r) => !r.errors.length);
  const invalid = rows.filter((r) => r.errors.length);

  async function commit() {
    setBusy(true);
    const payload = valid.map((r) => ({
      applicant_name: r.values["applicant_name"]!,
      mobile: r.values["mobile"] ?? null,
      lead_type: r.values["lead_type"] || "Distributor",
      res_state: r.values["state"] ?? null,
      res_district: r.values["district"] ?? null,
      outlet_name: r.values["outlet_name"] ?? null,
      status: "New",
    }));
    const { error } = await supabase.from("leads").insert(payload);
    await supabase.from("import_batches").insert({
      file_name: fileName, module: "leads", total_rows: rows.length, valid_rows: valid.length,
      error_rows: invalid.length, status: error ? "Failed" : "Committed",
      errors: invalid.map((r) => ({ row: r.row, errors: r.errors })),
    });
    setBusy(false);
    setCommitted(error ? 0 : payload.length);
    setStep(4);
  }

  const steps = ["Upload", "Validation", "Preview", "Commit"];
  return (
    <div className="space-y-6">
      <Card className="flex flex-wrap gap-4 p-4 shadow-panel">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2 text-xs font-semibold">
            <span className={cn("grid size-7 place-items-center rounded-full border", step > i + 1 ? "border-success bg-success text-success-foreground" : step === i + 1 ? "border-primary bg-primary text-primary-foreground" : "text-muted-foreground")}>{step > i + 1 ? <Check size={13} /> : i + 1}</span>
            <span className={step === i + 1 ? "text-primary" : "text-muted-foreground"}>{s}</span>
          </div>
        ))}
      </Card>

      {step === 1 && (
        <Card className="p-8 text-center shadow-panel">
          <Upload className="mx-auto text-muted-foreground" />
          <h3 className="mt-3 text-sm font-semibold">Upload a CSV of leads</h3>
          <p className="mt-1 text-xs text-muted-foreground">Required columns: applicant_name, mobile, lead_type. Optional: state, district, outlet_name.</p>
          <input type="file" accept=".csv,text/csv" className="mx-auto mt-5 block text-xs"
            onChange={async (e) => { const f = e.target.files?.[0]; if (f) parse(await f.text(), f.name); }} />
        </Card>
      )}

      {(step === 2 || step === 3) && (
        <Card className="overflow-hidden shadow-panel">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3 text-sm">
            <div><b>{fileName}</b> · {rows.length} rows · <span className="text-success">{valid.length} valid</span> · <span className="text-error">{invalid.length} with errors</span></div>
            <div className="flex gap-2">
              {invalid.length > 0 && <Button size="sm" variant="outline" onClick={() => exportCsv("import-errors", invalid.map((r) => ({ row: r.row, ...r.values, errors: r.errors.join("; ") })))}><Download />Error report</Button>}
              <Button size="sm" onClick={() => { if (step === 2) setStep(3); else void commit(); }} disabled={!valid.length}>{step === 2 ? "Preview valid rows" : "Commit import"}</Button>
            </div>
          </div>
          <div className="max-h-[420px] overflow-auto">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-secondary text-muted-foreground"><tr><th className="px-4 py-2">Row</th><th className="px-4 py-2">Applicant</th><th className="px-4 py-2">Mobile</th><th className="px-4 py-2">Type</th><th className="px-4 py-2">Issues</th></tr></thead>
              <tbody>
                {(step === 2 ? rows : valid).map((r) => (
                  <tr key={r.row} className={cn("border-t", r.errors.length && "bg-error-soft/40")}>
                    <td className="px-4 py-2">{r.row}</td>
                    <td className={cn("px-4 py-2", !r.values["applicant_name"] && "font-semibold text-error")}>{r.values["applicant_name"] || "—"}</td>
                    <td className="px-4 py-2">{r.values["mobile"] || "—"}</td>
                    <td className="px-4 py-2">{r.values["lead_type"] || "—"}</td>
                    <td className="px-4 py-2 text-error">{r.errors.join("; ") || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {step === 4 && (
        <Card className="p-8 text-center shadow-panel">
          {busy ? <Loader2 className="mx-auto animate-spin" /> : (
            <>
              <div className="mx-auto grid size-12 place-items-center rounded-full bg-success-soft text-success"><Check /></div>
              <h3 className="mt-3 text-sm font-semibold">{committed ? `${committed} leads imported` : "Import finished with errors"}</h3>
              <p className="mt-1 text-xs text-muted-foreground">The batch and any row errors are stored in import history.</p>
              <Button className="mt-5" variant="outline" onClick={() => { setStep(1); setRows([]); setCommitted(null); }}>Start another import</Button>
            </>
          )}
        </Card>
      )}

      <ImportHistory />
    </div>
  );
}

function ImportHistory() {
  const { data = [] } = useQuery({
    queryKey: ["import-batches"],
    queryFn: async () => {
      const { data, error } = await supabase.from("import_batches").select("*").order("created_at", { ascending: false }).limit(10);
      if (error) throw error;
      return data ?? [];
    },
  });
  if (!data.length) return null;
  return (
    <Card className="overflow-hidden shadow-panel">
      <div className="border-b px-5 py-3 text-sm font-semibold">Batch history</div>
      <table className="w-full text-left text-xs">
        <thead className="bg-secondary text-muted-foreground"><tr><th className="px-4 py-2">File</th><th className="px-4 py-2">Rows</th><th className="px-4 py-2">Valid</th><th className="px-4 py-2">Errors</th><th className="px-4 py-2">Status</th><th className="px-4 py-2">When</th></tr></thead>
        <tbody>{data.map((b) => (
          <tr key={b.id} className="border-t"><td className="px-4 py-2">{b.file_name}</td><td className="px-4 py-2">{b.total_rows}</td><td className="px-4 py-2 text-success">{b.valid_rows}</td><td className="px-4 py-2 text-error">{b.error_rows}</td><td className="px-4 py-2">{b.status}</td><td className="px-4 py-2">{new Date(b.created_at).toLocaleString()}</td></tr>
        ))}</tbody>
      </table>
    </Card>
  );
}

/* --------------------------- Territory heatmap ---------------------------- */

export function TerritoryHeatmap() {
  const { data = [] } = useQuery({
    queryKey: ["territories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("territories").select("*").order("state");
      if (error) throw error;
      return data ?? [];
    },
  });

  const states = useMemo(() => Array.from(new Set(data.map((t) => t.state))), [data]);
  const metrics = ["Capacity", "Occupied", "Reserved", "Available"] as const;
  const valueFor = (state: string, metric: string) => {
    const rows = data.filter((t) => t.state === state);
    const cap = rows.reduce((s, r) => s + r.capacity, 0);
    const occ = rows.reduce((s, r) => s + r.occupied, 0);
    const res = rows.reduce((s, r) => s + r.reserved, 0);
    return metric === "Capacity" ? cap : metric === "Occupied" ? occ : metric === "Reserved" ? res : Math.max(0, cap - occ - res);
  };
  const max = Math.max(1, ...states.flatMap((s) => metrics.map((m) => valueFor(s, m))));

  return (
    <Card className="overflow-x-auto p-5 shadow-panel">
      <div className="mb-4">
        <h2 className="text-base font-semibold">Territory occupancy heatmap</h2>
        <p className="mt-1 text-xs text-muted-foreground">Darker cells indicate higher counts across each state.</p>
      </div>
      <table className="w-full min-w-[520px] text-left text-xs">
        <thead><tr><th className="py-2 pr-4 font-semibold">State</th>{metrics.map((m) => <th key={m} className="px-2 py-2 text-center font-semibold">{m}</th>)}</tr></thead>
        <tbody>
          {states.map((s) => (
            <tr key={s}>
              <td className="whitespace-nowrap py-1.5 pr-4 font-medium">{s}</td>
              {metrics.map((m) => {
                const v = valueFor(s, m);
                return <td key={m} className="px-1 py-1.5">
                  <div className="grid h-9 place-items-center rounded-md font-semibold text-primary"
                    style={{ background: `color-mix(in oklab, var(--primary) ${Math.round((v / max) * 70) + 6}%, transparent)` }}>{v}</div>
                </td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

/* --------------------------- Reservations panel --------------------------- */

export function ReservationsPanel() {
  const qc = useQueryClient();
  const { can } = useAuth();
  const { data = [] } = useQuery({
    queryKey: ["reservations"],
    queryFn: async () => {
      const { data, error } = await supabase.from("reservations").select("*, territories(state, district, block)").order("expires_at");
      if (error) throw error;
      return data ?? [];
    },
  });
  const { data: territories = [] } = useQuery({
    queryKey: ["territories"],
    queryFn: async () => (await supabase.from("territories").select("*").order("state")).data ?? [],
  });

  const act = useMutation({
    mutationFn: async ({ id, action }: { id: string; action: "extend" | "release" }) => {
      if (action === "release") await supabase.from("reservations").update({ status: "Released" }).eq("id", id);
      else await supabase.from("reservations").update({ expires_at: new Date(Date.now() + 7 * 864e5).toISOString() }).eq("id", id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reservations"] }),
  });

  const create = useMutation({
    mutationFn: async (territory_id: string) => { await supabase.from("reservations").insert({ territory_id }); },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reservations"] }),
  });

  return (
    <Card className="p-5 shadow-panel">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Territory reservations</h2>
          <p className="mt-1 text-xs text-muted-foreground">Reservations hold a block for 7 days and can be extended or released.</p>
        </div>
        {can("capacity.edit") && (
          <select className="h-9 rounded-md border bg-surface px-3 text-xs" defaultValue=""
            onChange={(e) => { if (e.target.value) { create.mutate(e.target.value); e.target.value = ""; } }}>
            <option value="">Reserve a block…</option>
            {territories.map((t) => <option key={t.id} value={t.id}>{t.block}, {t.district} ({t.state})</option>)}
          </select>
        )}
      </div>
      <div className="space-y-2">
        {data.length === 0 && <div className="rounded-md border border-dashed p-6 text-center text-xs text-muted-foreground">No active reservations.</div>}
        {data.map((r) => {
          const days = Math.ceil((new Date(r.expires_at).getTime() - Date.now()) / 864e5);
          const terr = r.territories as { state: string; district: string; block: string } | null;
          return (
            <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm">
              <div>
                <div className="font-medium">{terr ? `${terr.block}, ${terr.district}` : "Territory"}</div>
                <div className="text-xs text-muted-foreground">{terr?.state} · {r.status}</div>
              </div>
              <div className={cn("flex items-center gap-1.5 text-xs font-semibold", days <= 2 ? "text-error" : "text-muted-foreground")}>
                <Timer size={14} />{days > 0 ? `${days} day${days === 1 ? "" : "s"} left` : "Expired"}
              </div>
              {can("capacity.edit") && r.status === "Active" && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => act.mutate({ id: r.id, action: "extend" })}>Extend</Button>
                  <Button size="sm" variant="ghost" onClick={() => act.mutate({ id: r.id, action: "release" })}><X size={14} />Release</Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

/* ---------------------------- Partner network ----------------------------- */

type Partner = { id: string; name: string; partner_type: string; parent_id: string | null; status: string; partner_code: string };

export function PartnerNetwork() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["partners"],
    queryFn: async () => {
      const { data, error } = await supabase.from("partners").select("id, name, partner_type, parent_id, status, partner_code").order("partner_type");
      if (error) throw error;
      return (data ?? []) as Partner[];
    },
  });

  const roots = data.filter((p) => !p.parent_id);
  const childrenOf = (id: string) => data.filter((p) => p.parent_id === id);

  if (isLoading) return <Card className="h-40 animate-pulse shadow-panel" />;
  if (!data.length) return (
    <Card className="p-10 text-center shadow-panel">
      <Network className="mx-auto text-muted-foreground" />
      <h3 className="mt-3 text-sm font-semibold">No partners activated yet</h3>
      <p className="mt-1 text-xs text-muted-foreground">Approved leads become distributors, retailers and CSPs, and appear here as a network tree.</p>
    </Card>
  );

  const Node = ({ p, depth }: { p: Partner; depth: number }) => (
    <div style={{ marginLeft: depth * 24 }} className="mt-2">
      <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-surface px-4 py-3 text-sm shadow-panel">
        <span className="rounded-md bg-primary-soft px-2 py-0.5 text-[10px] font-bold uppercase text-primary">{p.partner_type}</span>
        <span className="font-semibold">{p.name}</span>
        <span className="text-xs text-muted-foreground">{p.partner_code}</span>
        <span className="ml-auto text-xs font-semibold">{p.status}</span>
      </div>
      {childrenOf(p.id).map((c) => <Node key={c.id} p={c} depth={depth + 1} />)}
    </div>
  );

  return <div>{roots.map((p) => <Node key={p.id} p={p} depth={0} />)}</div>;
}

export type Row = Record<string, string | number | null | undefined>;

function escapeCsv(v: unknown) {
  const s = v === null || v === undefined ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
}

function download(name: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}

export function exportCsv(name: string, rows: Row[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]!);
  const body = [headers.join(","), ...rows.map((r) => headers.map((h) => escapeCsv(r[h])).join(","))].join("\n");
  download(`${name}.csv`, body, "text/csv;charset=utf-8");
}

export function exportExcel(name: string, rows: Row[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]!);
  const esc = (v: unknown) => String(v ?? "").replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c] as string));
  const html = `<table><thead><tr>${headers.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${rows
    .map((r) => `<tr>${headers.map((h) => `<td>${esc(r[h])}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
  download(`${name}.xls`, `<html><head><meta charset="utf-8"/></head><body>${html}</body></html>`, "application/vnd.ms-excel");
}

export function exportPdf(title: string, rows: Row[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]!);
  const w = window.open("", "_blank", "width=1000,height=700");
  if (!w) return;
  w.document.write(`<html><head><title>${title}</title><style>
    body{font-family:Inter,system-ui,sans-serif;padding:32px;color:#0f172a}
    h1{font-size:20px;margin:0 0 4px}p{color:#64748b;font-size:12px;margin:0 0 20px}
    table{width:100%;border-collapse:collapse;font-size:11px}
    th{text-align:left;background:#f1f5f9;padding:8px;border-bottom:1px solid #e2e8f0}
    td{padding:8px;border-bottom:1px solid #eef2f7}
  </style></head><body><h1>${title}</h1><p>LeadHub · generated ${new Date().toLocaleString()}</p>
  <table><thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
  <tbody>${rows.map((r) => `<tr>${headers.map((h) => `<td>${r[h] ?? ""}</td>`).join("")}</tr>`).join("")}</tbody></table>
  </body></html>`);
  w.document.close();
  w.focus();
  w.print();
}

/** Lead completeness + AI-style scoring used across create, list and detail. */
export function scoreLead(lead: Record<string, unknown>) {
  const weights: Array<[string, number]> = [
    ["applicant_name", 10], ["mobile", 10], ["email", 5], ["dob", 5], ["entity_type", 5],
    ["res_address", 10], ["res_district", 5], ["outlet_name", 10], ["outlet_address", 10],
    ["outlet_lat", 10], ["program_id", 10], ["consent", 10],
  ];
  const completeness = weights.reduce((sum, [k, w]) => (lead[k] ? sum + w : sum), 0);
  const priorityBoost = lead["priority"] === "High" ? 8 : lead["priority"] === "Low" ? -5 : 0;
  const score = Math.max(0, Math.min(100, Math.round(completeness * 0.8 + priorityBoost + 10)));
  const band = score >= 75 ? "Hot" : score >= 50 ? "Warm" : "Cold";
  return { completeness, score, band };
}

/** Fuzzy duplicate confidence between a draft lead and an existing record. */
export function duplicateConfidence(a: Record<string, unknown>, b: Record<string, unknown>) {
  let hits = 0, total = 0;
  const cmp = (k: string, weight: number) => {
    const x = String(a[k] ?? "").trim().toLowerCase();
    const y = String(b[k] ?? "").trim().toLowerCase();
    if (!x || !y) return;
    total += weight;
    if (x === y) hits += weight;
    else if (x.length > 3 && (x.includes(y) || y.includes(x))) hits += weight * 0.6;
  };
  cmp("mobile", 40); cmp("applicant_name", 25); cmp("outlet_name", 20); cmp("outlet_address", 15);
  return total ? Math.round((hits / total) * 100) : 0;
}

import { isAdmin } from "@/lib/admin/auth";
import { getDb } from "@/lib/admin/store";
import { filterEnquiries } from "@/lib/admin/query";
import { getRange, periodBounds } from "@/lib/admin/metrics";

export const dynamic = "force-dynamic";

// Quote every cell and neutralise spreadsheet formulas (=, +, -, @) so a hostile
// form submission can't execute when the CSV is opened in Excel or Sheets.
function cell(v) {
  let s = v == null ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}
const toCsv = (cols, rows) => [cols.map((c) => cell(c.label)).join(","), ...rows.map((r) => cols.map((c) => cell(c.get(r))).join(","))].join("\r\n");

const ENQUIRY_COLS = [
  { label: "Received", get: (e) => e.createdAt },
  { label: "Type", get: (e) => e.intent },
  { label: "Status", get: (e) => e.status },
  { label: "Full name", get: (e) => e.fullName },
  { label: "Company / channel", get: (e) => e.company },
  { label: "Role / platform", get: (e) => e.role },
  { label: "Email", get: (e) => e.email },
  { label: "Phone", get: (e) => e.phone },
  { label: "Preferred contact", get: (e) => e.contactMethod },
  { label: "Service", get: (e) => e.service },
  { label: "Campaign type", get: (e) => e.campaignType },
  { label: "Budget", get: (e) => e.budget },
  { label: "Message", get: (e) => e.message },
  { label: "Notes", get: (e) => (e.notes || []).map((n) => `[${n.at}] ${n.text}`).join("\n") },
  { label: "Sample", get: (e) => (e.sample ? "yes" : "") },
];
const SUBSCRIBER_COLS = [
  { label: "Email", get: (s) => s.email },
  { label: "Subscribed", get: (s) => s.createdAt },
  { label: "Sample", get: (s) => (s.sample ? "yes" : "") },
];

export async function GET(request) {
  if (!(await isAdmin())) return new Response("Unauthorised", { status: 401 });
  const params = Object.fromEntries(new URL(request.url).searchParams);
  const db = await getDb();
  const stamp = new Date().toISOString().slice(0, 10);

  let csv;
  let name;
  if (params.type === "subscribers") {
    const q = (params.q || "").toLowerCase();
    csv = toCsv(SUBSCRIBER_COLS, db.subscribers.filter((s) => !q || s.email.includes(q)));
    name = `vga-subscribers-${stamp}.csv`;
  } else {
    let rows = filterEnquiries(db.enquiries, params);
    if (params.range) {
      const { start } = periodBounds(getRange(params.range));
      rows = rows.filter((e) => new Date(e.createdAt).getTime() > start);
    }
    csv = toCsv(ENQUIRY_COLS, rows);
    name = `vga-enquiries-${params.intent || "all"}-${stamp}.csv`;
  }

  return new Response(`﻿${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${name}"`,
      "Cache-Control": "no-store",
    },
  });
}

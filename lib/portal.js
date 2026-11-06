// Portal data access with ownership checks. Pages and actions call these, never the Grade client
// directly, so a client only ever sees the campaigns VGA linked to them and a creator only
// their own records (looked up by their verified email or the Grade email VGA set).
import "server-only";

import * as grade from "./grade/client";

export const creatorEmail = (user) => (user.grade_email || user.email).toLowerCase();

export function ownsCampaign(user, campaignId) {
  return user.type === "client" && (user.campaignIds || []).includes(campaignId);
}

// Normalise an approval row: Grade's list shape isn't fully documented, so read defensively.
export function normaliseApproval(a) {
  return {
    id: a.id || a.approvalId,
    status: a.status,
    campaignId: a.campaignId,
    creatorName: a.creatorName || a.recipientName || a.creatorEmail || a.email || "Creator",
    creatorEmail: a.creatorEmail || a.email || "",
    amount: Number(a.amount ?? a.payoutAmount ?? a.value ?? 0),
    currency: a.currency || "USD",
    description: a.description || a.lineItemDescription || "",
    invoiceId: a.invoiceId || a.agencyInvoiceId || null,
    createdAt: a.createdAt,
    decidedAt: a.decidedAt,
  };
}

export async function clientCampaigns(user) {
  const results = await Promise.allSettled((user.campaignIds || []).map((id) => grade.getCampaign(id)));
  return results.filter((r) => r.status === "fulfilled" && r.value).map((r) => r.value);
}

export async function clientApprovals(user, status = "PENDING") {
  const lists = await Promise.all((user.campaignIds || []).map((campaignId) => grade.listApprovals({ campaignId, status })));
  return lists
    .flatMap((l) => l.approvals)
    .map(normaliseApproval)
    .filter((a) => ownsCampaign(user, a.campaignId))
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

export async function canDownloadInvoice(user, invoiceId) {
  if (!invoiceId) return false;
  if (user.type === "client") {
    const approved = await clientApprovals(user, "APPROVED");
    return approved.some((a) => a.invoiceId === invoiceId);
  }
  const { receipts } = await grade.creatorReceipts(creatorEmail(user), { limit: 100 });
  return receipts.some((r) => r.invoiceId === invoiceId);
}

export function money(value, currency = "USD") {
  try {
    const n = Number(value || 0);
    return new Intl.NumberFormat(currency === "NGN" ? "en-NG" : "en-US", { style: "currency", currency, maximumFractionDigits: Math.abs(n) >= 1000 ? 0 : 2 }).format(n);
  } catch {
    return `${currency} ${Number(value || 0).toLocaleString("en-NG")}`;
  }
}

export const compact = (n) => new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(Number(n || 0));

export function date(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

// Views for the client's own campaigns: the latest `days` as a daily series, plus the change
// against the `days` before (one 2×days request, split in two). Top posts for the same window.
export async function clientPerformance(user, { days = 30 } = {}) {
  const ids = user.type === "client" ? user.campaignIds || [] : [];
  const [series, top] = await Promise.all([
    grade.analyticsSeries(ids, { metric: "views", days: days * 2 }),
    grade.analyticsTop(ids, { metric: "views", days, limit: 5 }),
  ]);
  const current = series.slice(-days);
  const previous = series.slice(0, Math.max(series.length - days, 0));
  const total = current.reduce((t, p) => t + p.value, 0);
  const before = previous.reduce((t, p) => t + p.value, 0);
  return {
    series: current,
    total,
    change: before > 0 ? (total - before) / before : null,
    top,
  };
}

// Paid receipts grouped into the last `months` calendar months (oldest first), zero-filled.
export function earningsByMonth(receipts, { months = 6 } = {}) {
  const now = new Date();
  const buckets = Array.from({ length: months }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1);
    return { key: `${d.getFullYear()}-${d.getMonth()}`, label: new Intl.DateTimeFormat("en-GB", { month: "short" }).format(d), value: 0 };
  });
  const byKey = Object.fromEntries(buckets.map((b) => [b.key, b]));
  for (const r of receipts) {
    if (!r.payoutDate) continue;
    const d = new Date(r.payoutDate);
    const b = byKey[`${d.getFullYear()}-${d.getMonth()}`];
    if (b) b.value += Number(r.earningsValue || 0);
  }
  return buckets.map(({ label, value }) => ({ label, value }));
}

// "Good morning" in Lagos time, whatever the server's timezone.
export function greeting() {
  const hour = Number(new Intl.DateTimeFormat("en-GB", { hour: "numeric", hourCycle: "h23", timeZone: "Africa/Lagos" }).format(new Date()));
  return hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
}

export const percent = (n, digits = 1) => `${(n * 100).toFixed(digits)}%`;

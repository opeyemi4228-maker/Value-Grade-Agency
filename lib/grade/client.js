// Grade (usegrade.com) SDK API client. Server-only: the API key must never reach the browser.
// Docs: https://api-docs.usegrade.com
//
// Set GRADE_BASE_URL, GRADE_APP_ID and GRADE_API_KEY to go live. Without them the portal runs
// in demo mode (lib/grade/mock.js) so it can be reviewed before Grade access is in place.
// Scopes the key needs: campaigns:read, analytics:read, payouts:read, approvals:read, approvals:write, KYC.
import "server-only";

import { randomUUID } from "node:crypto";
import * as mock from "./mock";

export const gradeConfigured = () => Boolean(process.env.GRADE_BASE_URL && process.env.GRADE_APP_ID && process.env.GRADE_API_KEY);
export const demoMode = () => !gradeConfigured();

export class GradeError extends Error {
  constructor(status, message, code) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

async function request(method, path, { query, body, idempotencyKey, raw = false } = {}) {
  const url = new URL(path, process.env.GRADE_BASE_URL);
  for (const [k, v] of Object.entries(query || {})) if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
  const headers = {
    "X-Application-Id": process.env.GRADE_APP_ID,
    "X-Api-Key": process.env.GRADE_API_KEY,
    Accept: raw ? "application/pdf" : "application/json",
  };
  if (body) headers["Content-Type"] = "application/json";
  if (idempotencyKey) headers["X-Idempotency-Key"] = idempotencyKey;

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  if (raw) {
    if (!res.ok) throw new GradeError(res.status, `Grade returned ${res.status}`);
    return res;
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) {
    throw new GradeError(res.status, json.message || json.error || `Grade returned ${res.status}`, json.code);
  }
  return json;
}

const list = (json) => json.data || json.items || json.approvals || json.results || [];

// ---- Campaigns -------------------------------------------------------------

export async function listCampaigns({ page = 1, limit = 100, search } = {}) {
  if (demoMode()) return mock.listCampaigns({ search });
  const json = await request("GET", "/sdk/v1/campaigns", { query: { page, limit, search } });
  return { campaigns: list(json), metrics: json.metrics || null, pagination: json.pagination };
}

export async function getCampaign(campaignId) {
  if (demoMode()) return mock.getCampaign(campaignId);
  const json = await request("GET", `/sdk/v1/campaigns/${encodeURIComponent(campaignId)}`);
  return json.data; // { campaign, analytics }
}

export async function listCampaignCreators(campaignId, { page = 1, limit = 200, sortBy = "totalViews", sortOrder = "desc" } = {}) {
  if (demoMode()) return mock.listCampaignCreators(campaignId);
  const json = await request("GET", `/sdk/v2/campaigns/${encodeURIComponent(campaignId)}/creators`, {
    query: {
      page,
      limit,
      sortBy,
      sortOrder,
      fields: "campaignCreatorRecordId,creatorName,creatorEmail,isVerified,pendingValue,currency,payoutType,totalPosts,totalViews,totalLikes,totalComments,totalShares,lastCalculatedAt",
    },
  });
  return { creators: list(json), pagination: json.pagination };
}

// ---- Analytics (scoped to campaigns) -------------------------------------------
// GET /sdk/v1/analytics/series and /top with scope=campaigns. Needs analytics:read + campaigns:read.
// Grade defaults to the latest 30 days; we pass explicit YYYY-MM-DD dates so periods line up.

const ymd = (d) => d.toISOString().slice(0, 10);

function rangeQuery(campaignIds, days) {
  const end = new Date();
  const start = new Date(end.getTime() - (days - 1) * 86_400_000);
  return { scope: "campaigns", campaignIds: campaignIds.join(","), startDate: ymd(start), endDate: ymd(end), includeHidden: "false" };
}

// Daily values for one metric. mode "delta" = change during each day.
export async function analyticsSeries(campaignIds, { metric = "views", days = 30, mode = "delta" } = {}) {
  if (!campaignIds.length) return [];
  if (demoMode()) return mock.analyticsSeries(campaignIds, { metric, days });
  const json = await request("GET", "/sdk/v1/analytics/series", { query: { ...rangeQuery(campaignIds, days), metric, mode } });
  const rows = Array.isArray(json.data) ? json.data : json.data?.series || json.series || list(json);
  return rows.map((r) => ({
    date: String(r.date || r.day || r.bucket || r.timestamp || "").slice(0, 10),
    value: Number(r.value ?? r[metric] ?? r.delta ?? r.total ?? 0),
  }));
}

// Best-performing posts across the campaigns.
export async function analyticsTop(campaignIds, { metric = "views", days = 30, limit = 5 } = {}) {
  if (!campaignIds.length) return [];
  if (demoMode()) return mock.analyticsTop(campaignIds, { limit });
  const json = await request("GET", "/sdk/v1/analytics/top", { query: { ...rangeQuery(campaignIds, days), type: "videos", metric, mode: "delta", page: 1, limit } });
  return list(json).map((r, i) => ({
    id: r.trackedMediaId || r.campaignCreatorMediaId || r.id || String(i),
    title: r.title || r.captionText || "Untitled post",
    author: r.authorDisplayName || r.authorUsername || r.creatorName || "",
    handle: r.authorUsername ? `@${String(r.authorUsername).replace(/^@/, "")}` : "",
    platform: r.platform || "",
    url: r.url || r.normalizedUrl || null,
    value: Number(r.value ?? r.metricValue ?? r[metric] ?? r.views ?? 0),
  }));
}

// ---- Payout approvals (client sign-off) ---------------------------------------

export async function listApprovals({ campaignId, status = "PENDING", page = 1, pageSize = 100 } = {}) {
  if (demoMode()) return mock.listApprovals({ campaignId, status });
  const json = await request("GET", "/sdk/v1/payout-approvals", { query: { campaignId, status, page, pageSize, sortBy: "createdAt", sortOrder: "desc" } });
  return { approvals: list(json), pagination: json.pagination };
}

export async function getApproval(approvalId) {
  if (demoMode()) return mock.getApproval(approvalId);
  const json = await request("GET", `/sdk/v1/payout-approvals/${encodeURIComponent(approvalId)}`);
  return json.data || json.approval || json;
}

export async function decideApproval(approvalId, decision, { note } = {}) {
  if (demoMode()) return mock.decideApproval(approvalId, decision, note);
  const path = `/sdk/v1/payout-approvals/${encodeURIComponent(approvalId)}/${decision === "approve" ? "approve" : "reject"}`;
  return request("POST", path, {
    body: decision === "approve" ? {} : { rejectionNote: note || "Rejected by client" },
    idempotencyKey: `vga-${decision}-${approvalId}`,
  });
}

// ---- Creators (looked up by email) --------------------------------------------

export async function creatorTotalPaid(email) {
  if (demoMode()) return mock.creatorTotalPaid(email);
  const json = await request("GET", "/sdk/v1/creators/total-paid", { query: { email } });
  return json.data;
}

export async function creatorReceipts(email, { page = 1, limit = 50 } = {}) {
  if (demoMode()) return mock.creatorReceipts(email);
  const json = await request("GET", "/sdk/v1/creators/receipts", { query: { email, page, limit, sortBy: "payoutDate", sortOrder: "desc" } });
  return { receipts: list(json), pagination: json.pagination };
}

export async function creatorPayouts(email, { page = 1, limit = 50 } = {}) {
  if (demoMode()) return mock.creatorPayouts(email);
  const json = await request("GET", "/sdk/v1/creators/payouts", { query: { email, page, limit, sortOrder: "desc" } });
  return { payouts: list(json), pagination: json.pagination, meta: json.meta };
}

// ---- KYC ----------------------------------------------------------------------

export async function kycStatus(email) {
  if (demoMode()) return mock.kycStatus(email);
  const target = email.toLowerCase();
  for (let page = 1; page <= 20; page++) {
    const json = await request("GET", "/sdk/v1/kyc/recipients", { query: { page, limit: 100 } });
    const hit = list(json).find((c) => String(c.email).toLowerCase() === target);
    if (hit) return hit;
    if (!json.pagination || page >= json.pagination.totalPages) break;
  }
  return null;
}

export async function kycInvite(email) {
  if (demoMode()) return mock.kycInvite(email);
  const json = await request("POST", "/sdk/v1/kyc/invite", { body: { email, idempotencyKey: `vga-kyc-${email}-${new Date().toISOString().slice(0, 10)}` } });
  return json.data || json;
}

// ---- Invoices -----------------------------------------------------------------

export async function invoicePdf(invoiceId) {
  if (demoMode()) return mock.invoicePdf(invoiceId);
  return request("GET", "/sdk/v1/invoice/pdf", { query: { invoiceId }, raw: true });
}

export const newIdempotencyKey = () => `vga-${randomUUID()}`;

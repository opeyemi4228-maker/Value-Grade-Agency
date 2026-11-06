// Server-only helpers shared by the form API routes.
import "server-only";

import { BUDGET_OPTIONS, CAMPAIGN_OPTIONS, CONTACT_METHODS, INTENTS, SERVICE_OPTIONS } from "./formOptions";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Best-effort, per-instance rate limit. Use a shared store (e.g. Upstash) if traffic grows.
const hits = new Map();
export function rateLimited(ip, limit = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > limit;
}

export function clientIp(request) {
  return request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
}

export function clean(value, max = 200) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function isEmail(value) {
  return EMAIL_RE.test(value);
}

export function validateEnquiry(body) {
  const data = {
    intent: INTENTS.includes(body.intent) ? body.intent : "general",
    fullName: clean(body.fullName, 120),
    company: clean(body.company, 160),
    role: clean(body.role, 120),
    email: clean(body.email, 160).toLowerCase(),
    phone: clean(body.phone, 40),
    service: clean(body.service, 120),
    campaignType: clean(body.campaignType, 120),
    message: clean(body.message, 4000),
    contactMethod: clean(body.contactMethod, 20),
    budget: clean(body.budget, 60),
  };

  // Only brand-side requests need company and service details; phone only when that's how we should reply.
  const brief = data.intent === "proposal" || data.intent === "call";
  const errors = {};
  if (data.fullName.length < 2) errors.fullName = "Please enter your full name.";
  if (data.intent !== "general" && data.company.length < 2) errors.company = "Please enter your company or channel name.";
  if (data.intent === "creator" && data.role.length < 2) errors.role = "Please tell us your main platform and niche.";
  if (!isEmail(data.email)) errors.email = "Please enter a valid email address.";
  if (!CONTACT_METHODS.includes(data.contactMethod)) errors.contactMethod = "Please choose how we should contact you.";
  if ((data.phone || data.contactMethod !== "Email") && !/^[+()\d\s-]{7,20}$/.test(data.phone)) errors.phone = "Please enter a valid phone number.";
  if (brief ? !SERVICE_OPTIONS.includes(data.service) : data.service && !SERVICE_OPTIONS.includes(data.service)) errors.service = "Please choose a service.";
  if (data.campaignType && !CAMPAIGN_OPTIONS.includes(data.campaignType)) errors.campaignType = "Please choose a campaign type.";
  if (data.message.length < 10) errors.message = "Please tell us a little more (at least 10 characters).";
  if (data.budget && !BUDGET_OPTIONS.includes(data.budget)) errors.budget = "Please choose a budget range.";

  return { data, errors };
}

export function looksLikeBot(body) {
  if (body.company_website) return true; // honeypot
  const started = Number(body._t);
  return Number.isFinite(started) && Date.now() - started < 2500; // submitted implausibly fast
}

export async function verifyTurnstile(token, ip) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const data = await res.json();
    return Boolean(data.success);
  } catch {
    return false;
  }
}

const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export async function sendMail({ subject, fields, replyTo }) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.FORMS_TO_EMAIL;
  const from = process.env.FORMS_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[forms] Email not configured. Would send "${subject}":`, fields);
      return true;
    }
    console.error("[forms] RESEND_API_KEY, FORMS_TO_EMAIL and FORMS_FROM_EMAIL must be set in production.");
    return false;
  }

  const rows = Object.entries(fields)
    .map(([k, v]) => `<tr><td style="padding:6px 12px;color:#555;vertical-align:top">${escapeHtml(k)}</td><td style="padding:6px 12px;white-space:pre-wrap">${escapeHtml(v || "—")}</td></tr>`)
    .join("");
  const text = Object.entries(fields).map(([k, v]) => `${k}: ${v || "—"}`).join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: to.split(",").map((s) => s.trim()),
      reply_to: replyTo,
      subject,
      text,
      html: `<table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">${rows}</table>`,
    }),
  });
  if (!res.ok) console.error("[forms] Resend error", res.status, await res.text().catch(() => ""));
  return res.ok;
}

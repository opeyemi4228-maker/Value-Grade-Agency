// Single-use email tokens for verification and password reset, plus the emails that carry them.
import "server-only";

import { one, query } from "../db";
import { site } from "../site";
import { newToken, sha256 } from "./crypto";

const TTL = { verify: 48 * 3_600_000, reset: 60 * 60_000 };

export async function issueToken(userId, kind) {
  await query("UPDATE auth_tokens SET used_at = now() WHERE user_id = $1 AND kind = $2 AND used_at IS NULL", [userId, kind]);
  const token = newToken();
  await query("INSERT INTO auth_tokens (id_hash, user_id, kind, expires_at) VALUES ($1, $2, $3, $4)", [
    sha256(token),
    userId,
    kind,
    new Date(Date.now() + TTL[kind]),
  ]);
  return token;
}

// Marks the token used and returns its user id, or null if invalid / expired / used.
export async function consumeToken(token, kind) {
  if (!token || typeof token !== "string" || token.length > 100) return null;
  const row = await one(
    `UPDATE auth_tokens SET used_at = now()
     WHERE id_hash = $1 AND kind = $2 AND used_at IS NULL AND expires_at > now()
     RETURNING user_id`,
    [sha256(token), kind],
  );
  return row?.user_id || null;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

const COPY = {
  verify: {
    subject: "Confirm your email for Value Grade Agency",
    lead: "Confirm your email to finish setting up your Value Grade Agency account.",
    button: "Confirm email",
    note: "This link expires in 48 hours.",
    path: "/verify-email",
  },
  reset: {
    subject: "Reset your Value Grade Agency password",
    lead: "We received a request to reset your password. If it wasn't you, you can ignore this email.",
    button: "Reset password",
    note: "This link expires in 1 hour and can be used once.",
    path: "/reset-password",
  },
};

export async function sendTokenEmail({ to, name, kind, token }) {
  const c = COPY[kind];
  const url = `${site.url.replace(/\/$/, "")}${c.path}?token=${encodeURIComponent(token)}`;
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.FORMS_FROM_EMAIL;

  if (!apiKey || !from) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[auth] Email not configured. ${kind} link for ${to}: ${url}`);
      return true;
    }
    console.error("[auth] RESEND_API_KEY and FORMS_FROM_EMAIL must be set in production.");
    return false;
  }

  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#002F1F;max-width:480px">
  <p style="font-weight:bold;letter-spacing:2px">VALUE GRADE AGENCY</p>
  <p>Hi ${escapeHtml(name || "there")},</p>
  <p>${c.lead}</p>
  <p><a href="${url}" style="display:inline-block;background:#FF6A00;color:#011C13;padding:12px 22px;border-radius:999px;text-decoration:none;font-weight:bold">${c.button}</a></p>
  <p style="color:#557">${c.note}</p>
  <p style="color:#557;font-size:12px">Or paste this link into your browser:<br>${escapeHtml(url)}</p>
</div>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject: c.subject, html, text: `${c.lead}\n\n${c.button}: ${url}\n\n${c.note}` }),
  });
  if (!res.ok) console.error("[auth] Resend error", res.status, await res.text().catch(() => ""));
  return res.ok;
}

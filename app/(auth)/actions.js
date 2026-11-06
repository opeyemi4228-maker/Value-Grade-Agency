"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { one, query } from "@/lib/db";
import { burnTime, hashPassword, verifyPassword } from "@/lib/auth/crypto";
import { createSession, destroyAllSessions, destroySession, getUser, requireUser } from "@/lib/auth/session";
import { consumeToken, issueToken, sendTokenEmail } from "@/lib/auth/tokens";
import { clean, isEmail, rateLimited, sendMail } from "@/lib/forms";

const MIN_PASSWORD = 10;

async function ip() {
  const h = await headers();
  return h.get("cf-connecting-ip") || h.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
}

function safeNext(value) {
  const v = typeof value === "string" ? value : "";
  return v.startsWith("/") && !v.startsWith("//") && !v.startsWith("/\\") ? v : "/dashboard";
}

function passwordProblem(pw) {
  if (pw.length < MIN_PASSWORD) return `Use at least ${MIN_PASSWORD} characters.`;
  if (pw.length > 200) return "That password is too long.";
  if (!/[a-zA-Z]/.test(pw) || !/[0-9\W_]/.test(pw)) return "Mix letters with numbers or symbols.";
  return null;
}

export async function signUp(_prev, form) {
  if (form.get("company_website")) return { ok: true }; // honeypot
  if (rateLimited(`signup:${await ip()}`, 5, 60 * 60_000)) return { error: "Too many attempts. Please try again later." };

  const type = form.get("type") === "creator" ? "creator" : "client";
  const name = clean(form.get("name"), 120);
  const email = clean(form.get("email"), 254).toLowerCase();
  const company = clean(form.get("company"), 160);
  const password = String(form.get("password") || "");
  const values = { type, name, email, company, terms: form.get("terms") === "on" };

  const errors = {};
  if (name.length < 2) errors.name = "Please enter your full name.";
  if (!isEmail(email)) errors.email = "Please enter a valid email address.";
  if (type === "client" && company.length < 2) errors.company = "Please enter your company name.";
  const pwErr = passwordProblem(password);
  if (pwErr) errors.password = pwErr;
  if (form.get("terms") !== "on") errors.terms = "Please accept the terms and privacy policy.";
  if (Object.keys(errors).length) return { errors, values };

  if (await one("SELECT 1 FROM users WHERE email = $1", [email])) {
    return { errors: { email: "An account with this email already exists. Log in or reset your password." }, values };
  }

  const user = await one(
    `INSERT INTO users (email, password_hash, name, company, type) VALUES ($1, $2, $3, $4, $5)
     RETURNING id`,
    [email, await hashPassword(password), name, company || null, type],
  );
  const token = await issueToken(user.id, "verify");
  await sendTokenEmail({ to: email, name, kind: "verify", token });
  // Let VGA know someone is waiting to be linked.
  sendMail({
    subject: `New ${type} account: ${company || name}`,
    fields: { Type: type, Name: name, Email: email, Company: company, Next: "Link this account in /admin/accounts" },
    replyTo: email,
  }).catch(() => {});

  await createSession(user.id);
  redirect("/dashboard?welcome=1");
}

export async function logIn(_prev, form) {
  const email = clean(form.get("email"), 254).toLowerCase();
  const password = String(form.get("password") || "");
  const next = safeNext(form.get("next"));
  const addr = await ip();
  if (rateLimited(`login:${addr}`, 10, 10 * 60_000) || rateLimited(`login:${email}`, 8, 10 * 60_000)) {
    return { error: "Too many attempts. Please wait a few minutes and try again.", email };
  }
  const user = isEmail(email) ? await one("SELECT id, password_hash, status FROM users WHERE email = $1", [email]) : null;
  if (!user) {
    await burnTime(password);
    return { error: "That email and password don't match.", email };
  }
  if (!(await verifyPassword(password, user.password_hash))) return { error: "That email and password don't match.", email };
  if (user.status === "disabled") return { error: "This account has been disabled. Contact Value Grade Agency.", email };

  await createSession(user.id);
  redirect(next);
}

export async function logOut() {
  await destroySession();
  redirect("/login");
}

export async function requestPasswordReset(_prev, form) {
  const email = clean(form.get("email"), 254).toLowerCase();
  if (!isEmail(email)) return { error: "Please enter a valid email address.", email };
  if (rateLimited(`reset:${await ip()}`, 5, 30 * 60_000)) return { error: "Too many attempts. Please try again later.", email };
  const user = await one("SELECT id, name FROM users WHERE email = $1 AND status <> 'disabled'", [email]);
  if (user) {
    const token = await issueToken(user.id, "reset");
    await sendTokenEmail({ to: email, name: user.name, kind: "reset", token });
  }
  // Same answer either way, so the form can't be used to discover accounts.
  return { sent: true, email };
}

export async function resetPassword(_prev, form) {
  const token = String(form.get("token") || "");
  const password = String(form.get("password") || "");
  const pwErr = passwordProblem(password);
  if (pwErr) return { errors: { password: pwErr } };
  if (password !== String(form.get("confirm") || "")) return { errors: { confirm: "Passwords don't match." } };
  const userId = await consumeToken(token, "reset");
  if (!userId) return { error: "This reset link is invalid or has expired. Request a new one." };
  await query("UPDATE users SET password_hash = $2, email_verified_at = COALESCE(email_verified_at, now()), updated_at = now() WHERE id = $1", [
    userId,
    await hashPassword(password),
  ]);
  await destroyAllSessions(userId);
  await createSession(userId);
  redirect("/dashboard");
}

export async function verifyEmail(_prev, form) {
  const userId = await consumeToken(String(form.get("token") || ""), "verify");
  if (!userId) return { error: "This link is invalid or has expired. Log in to get a new one." };
  await query("UPDATE users SET email_verified_at = COALESCE(email_verified_at, now()), updated_at = now() WHERE id = $1", [userId]);
  const current = await getUser();
  if (!current || current.id !== userId) await createSession(userId);
  redirect("/dashboard?verified=1");
}

export async function resendVerification() {
  const user = await requireUser();
  if (user.email_verified_at) return { ok: true };
  if (rateLimited(`resend:${user.id}`, 3, 30 * 60_000)) return { error: "Please wait a little before requesting another email." };
  const token = await issueToken(user.id, "verify");
  await sendTokenEmail({ to: user.email, name: user.name, kind: "verify", token });
  return { ok: true, message: `We sent a new link to ${user.email}.` };
}

export async function updateProfile(_prev, form) {
  const user = await requireUser();
  const name = clean(form.get("name"), 120);
  const company = clean(form.get("company"), 160);
  if (name.length < 2) return { errors: { name: "Please enter your full name." } };
  if (user.type === "client" && company.length < 2) return { errors: { company: "Please enter your company name." } };
  await query("UPDATE users SET name = $2, company = $3, updated_at = now() WHERE id = $1", [user.id, name, company || null]);
  return { ok: true, message: "Profile saved." };
}

export async function changePassword(_prev, form) {
  const user = await requireUser();
  const current = String(form.get("current") || "");
  const next = String(form.get("password") || "");
  const row = await one("SELECT password_hash FROM users WHERE id = $1", [user.id]);
  if (!(await verifyPassword(current, row.password_hash))) return { errors: { current: "That's not your current password." } };
  const pwErr = passwordProblem(next);
  if (pwErr) return { errors: { password: pwErr } };
  await query("UPDATE users SET password_hash = $2, updated_at = now() WHERE id = $1", [user.id, await hashPassword(next)]);
  await destroyAllSessions(user.id);
  await createSession(user.id);
  return { ok: true, message: "Password changed. Other devices have been signed out." };
}

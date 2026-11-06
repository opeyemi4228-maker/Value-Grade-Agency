// Admin sign-in: one shared password (ADMIN_PASSWORD) and a signed, HTTP-only session cookie.
// Every admin page, server action and admin API route calls requireAdmin() / isAdmin();
// proxy.js only does a fast "is there a cookie at all" redirect in front of that.
import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const SESSION_COOKIE = "vga_admin";
const SESSION_HOURS = 12;

function secret() {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  // A dedicated secret is preferred; deriving from the password still means
  // changing the password signs everyone out.
  return process.env.ADMIN_SESSION_SECRET || createHash("sha256").update(`vga-admin:${pw}`).digest("hex");
}

export const adminConfigured = () => Boolean(process.env.ADMIN_PASSWORD);

const sign = (payload, key) => createHmac("sha256", key).update(payload).digest("base64url");

function safeEqual(a, b) {
  const ha = createHash("sha256").update(String(a)).digest();
  const hb = createHash("sha256").update(String(b)).digest();
  return timingSafeEqual(ha, hb);
}

export function checkPassword(input) {
  const pw = process.env.ADMIN_PASSWORD;
  return Boolean(pw) && safeEqual(input, pw);
}

export function createSessionToken() {
  const key = secret();
  const exp = Date.now() + SESSION_HOURS * 3_600_000;
  const payload = Buffer.from(JSON.stringify({ exp })).toString("base64url");
  return { token: `${payload}.${sign(payload, key)}`, expires: new Date(exp) };
}

export function verifySessionToken(token) {
  const key = secret();
  if (!key || !token || !token.includes(".")) return null;
  const [payload, sig] = token.split(".");
  if (!safeEqual(sig, sign(payload, key))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    return data.exp > Date.now() ? data : null;
  } catch {
    return null;
  }
}

export async function getSession() {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

export async function isAdmin() {
  return Boolean(await getSession());
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function startSession() {
  const { token, expires } = createSessionToken();
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  });
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

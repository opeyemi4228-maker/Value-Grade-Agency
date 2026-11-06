// Account sessions for the client / creator portal.
// The browser holds a random token in an HTTP-only cookie; only its SHA-256 is stored, so a
// database leak can't be replayed as a session. Sessions last 30 days and are revocable.
import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { one, query } from "../db";
import { newToken, sha256 } from "./crypto";

export const SESSION_COOKIE = "vga_session";
const DAYS = 30;

export async function createSession(userId) {
  const token = newToken();
  const expires = new Date(Date.now() + DAYS * 86_400_000);
  await query("INSERT INTO sessions (id_hash, user_id, expires_at) VALUES ($1, $2, $3)", [sha256(token), userId, expires]);
  await query("UPDATE users SET last_login_at = now() WHERE id = $1", [userId]);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  });
}

export async function destroySession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) await query("DELETE FROM sessions WHERE id_hash = $1", [sha256(token)]);
  store.delete(SESSION_COOKIE);
}

export async function destroyAllSessions(userId) {
  await query("DELETE FROM sessions WHERE user_id = $1", [userId]);
}

const USER_FIELDS = "u.id, u.email, u.name, u.company, u.type, u.status, u.grade_email, u.email_verified_at, u.created_at";

// The signed-in user, or null. Cached per request.
export const getUser = cache(async () => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const user = await one(
    `SELECT ${USER_FIELDS} FROM sessions s JOIN users u ON u.id = s.user_id
     WHERE s.id_hash = $1 AND s.expires_at > now() AND u.status <> 'disabled'`,
    [sha256(token)],
  );
  if (!user) return null;
  if (user.type === "client") {
    const rows = await query("SELECT campaign_id FROM client_campaigns WHERE user_id = $1 ORDER BY campaign_id", [user.id]);
    user.campaignIds = rows.map((r) => r.campaign_id);
  }
  return user;
});

export async function requireUser() {
  const user = await getUser();
  if (!user) redirect("/login");
  return user;
}

// Signed in, email verified and linked by VGA: may see Grade data.
export function canSeeData(user) {
  if (!user || user.status !== "active" || !user.email_verified_at) return false;
  return user.type === "client" ? user.campaignIds?.length > 0 : true;
}

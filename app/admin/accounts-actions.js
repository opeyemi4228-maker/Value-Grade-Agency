"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { query, transaction } from "@/lib/db";
import { destroyAllSessions } from "@/lib/auth/session";
import { clean, isEmail } from "@/lib/forms";

const UUID = /^[0-9a-f-]{36}$/i;

// Link a client to Grade campaigns, or a creator to a Grade email, and set the account status.
export async function saveAccount(_prev, form) {
  await requireAdmin();
  const id = String(form.get("id") || "");
  if (!UUID.test(id)) return { error: "Unknown account." };
  const status = ["pending", "active", "disabled"].includes(form.get("status")) ? form.get("status") : "pending";
  const type = form.get("type") === "creator" ? "creator" : "client";

  if (type === "client") {
    const ids = [...new Set(form.getAll("campaigns").map((v) => clean(v, 100)).filter(Boolean))];
    const extra = clean(form.get("extraCampaigns"), 1000).split(/[\s,]+/).filter((v) => /^[\w-]{1,100}$/.test(v));
    const all = [...new Set([...ids, ...extra])];
    await transaction(async (tx) => {
      await tx.query("UPDATE users SET status = $2, updated_at = now() WHERE id = $1", [id, status]);
      await tx.query("DELETE FROM client_campaigns WHERE user_id = $1", [id]);
      for (const c of all) await tx.query("INSERT INTO client_campaigns (user_id, campaign_id) VALUES ($1, $2)", [id, c]);
    });
  } else {
    const gradeEmail = clean(form.get("gradeEmail"), 254).toLowerCase();
    if (gradeEmail && !isEmail(gradeEmail)) return { error: "Enter a valid Grade email, or leave it blank to use their login email." };
    await query("UPDATE users SET status = $2, grade_email = $3, updated_at = now() WHERE id = $1", [id, status, gradeEmail || null]);
  }
  if (status === "disabled") await destroyAllSessions(id);
  revalidatePath("/admin/accounts");
  return { ok: true, message: "Saved." };
}

export async function deleteAccount(form) {
  await requireAdmin();
  const id = String(form.get("id") || "");
  if (!UUID.test(id)) return;
  await query("DELETE FROM users WHERE id = $1", [id]);
  revalidatePath("/admin/accounts");
}

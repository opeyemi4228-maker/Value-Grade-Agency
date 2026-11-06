"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { adminConfigured, checkPassword, endSession, requireAdmin, startSession } from "@/lib/admin/auth";
import { rateLimited } from "@/lib/forms";
import {
  STATUS_IDS,
  addEnquiryNote,
  clearSampleData,
  deleteEnquiry,
  deleteEnquiryNote,
  loadSampleData,
  removeSubscriber,
  setEnquiryStatus,
} from "@/lib/admin/store";

// Only allow same-site relative paths after login.
const safeNext = (v) => (typeof v === "string" && /^\/admin(\/|\?|$)/.test(v) && !v.startsWith("//") ? v : "/admin");

export async function login(_prev, formData) {
  if (!adminConfigured()) return { error: "Admin access isn't set up yet. Add ADMIN_PASSWORD to the environment and restart." };
  const h = await headers();
  const ip = h.get("cf-connecting-ip") || h.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (rateLimited(`admin-login:${ip}`, 8, 15 * 60 * 1000)) return { error: "Too many attempts. Wait 15 minutes and try again." };
  if (!checkPassword(String(formData.get("password") || ""))) return { error: "That password isn't right." };
  await startSession();
  redirect(safeNext(formData.get("next")));
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

export async function updateStatus(id, status) {
  await requireAdmin();
  if (!STATUS_IDS.includes(status)) return { error: "Unknown status" };
  await setEnquiryStatus(String(id), status);
  revalidatePath("/admin", "layout");
  return { ok: true };
}

export async function bulkStatus(ids, status) {
  await requireAdmin();
  if (!STATUS_IDS.includes(status) || !Array.isArray(ids)) return { error: "Invalid request" };
  for (const id of ids.slice(0, 500)) await setEnquiryStatus(String(id), status);
  revalidatePath("/admin", "layout");
  return { ok: true };
}

export async function addNote(id, _prev, formData) {
  await requireAdmin();
  const text = String(formData.get("note") || "").trim().slice(0, 2000);
  if (!text) return { error: "Write a note first." };
  await addEnquiryNote(String(id), text);
  revalidatePath(`/admin/enquiries/${id}`);
  return { ok: true, at: Date.now() };
}

export async function removeNote(id, noteId) {
  await requireAdmin();
  await deleteEnquiryNote(String(id), String(noteId));
  revalidatePath(`/admin/enquiries/${id}`);
}

export async function removeEnquiry(id, backTo = "/admin/enquiries") {
  await requireAdmin();
  await deleteEnquiry(String(id));
  revalidatePath("/admin", "layout");
  redirect(safeNext(backTo));
}

export async function deleteSubscriber(id) {
  await requireAdmin();
  await removeSubscriber(String(id));
  revalidatePath("/admin", "layout");
}

export async function seedSample() {
  await requireAdmin();
  await loadSampleData();
  revalidatePath("/admin", "layout");
}

export async function clearSample() {
  await requireAdmin();
  await clearSampleData();
  revalidatePath("/admin", "layout");
}

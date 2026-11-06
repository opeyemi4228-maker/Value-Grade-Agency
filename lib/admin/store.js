// Store for form submissions, read by the admin dashboard.
//
// The whole admin dataset (enquiries, subscribers, activity) is one JSON document in the
// database's \`kv\` table (Postgres in production, embedded PGlite locally; see lib/db.js).
// Writes run in a transaction with a row lock, so concurrent submissions can't overwrite
// each other. A legacy ./data/vga-admin.json file is imported automatically the first time.
import "server-only";

import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { one, query, transaction, usingEmbeddedDb } from "../db";
import { sampleData } from "./sample";

const KEY = "admin_store";
const LEGACY_FILE = path.join(process.env.ADMIN_DATA_DIR || path.join(process.cwd(), "data"), "vga-admin.json");

export const STATUSES = [
  { id: "new", label: "New" },
  { id: "contacted", label: "Contacted" },
  { id: "qualified", label: "Qualified" },
  { id: "converted", label: "Converted" },
  { id: "archived", label: "Archived" },
];
export const STATUS_IDS = STATUSES.map((s) => s.id);

const empty = () => ({ version: 1, enquiries: [], subscribers: [], activity: [] });

async function legacy() {
  try {
    return JSON.parse(await readFile(LEGACY_FILE, "utf8"));
  } catch {
    return null;
  }
}

async function load() {
  const row = await one("SELECT value FROM kv WHERE key = $1", [KEY]);
  if (row) return { ...empty(), ...row.value };
  const old = await legacy();
  if (old) {
    await query("INSERT INTO kv (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING", [KEY, JSON.stringify(old)]);
    return { ...empty(), ...old };
  }
  return empty();
}

async function mutate(fn) {
  await load(); // make sure the row exists (and legacy data is imported) before locking it
  await query("INSERT INTO kv (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING", [KEY, JSON.stringify(empty())]);
  return transaction(async (tx) => {
    const res = await tx.query("SELECT value FROM kv WHERE key = $1 FOR UPDATE", [KEY]);
    const db = { ...empty(), ...res.rows[0].value };
    const result = await fn(db);
    await tx.query("UPDATE kv SET value = $2, updated_at = now() WHERE key = $1", [KEY, JSON.stringify(db)]);
    return result;
  });
}

function log(db, type, text, ref) {
  db.activity.unshift({ id: randomUUID(), at: new Date().toISOString(), type, text, ref });
  db.activity.length = Math.min(db.activity.length, 200);
}

const byNewest = (a, b) => b.createdAt.localeCompare(a.createdAt);

// ---- Reads ---------------------------------------------------------------

export async function getDb() {
  const db = await load();
  db.enquiries.sort(byNewest);
  db.subscribers.sort(byNewest);
  return db;
}

export async function getEnquiry(id) {
  const db = await load();
  return db.enquiries.find((e) => e.id === id) || null;
}

export async function storageStatus() {
  try {
    await one("SELECT 1 AS ok");
    return { writable: true, file: usingEmbeddedDb() ? "Embedded database (./data/pglite)" : "Postgres (DATABASE_URL)" };
  } catch (err) {
    return { writable: false, file: usingEmbeddedDb() ? "Embedded database" : "Postgres", error: err.code || err.message };
  }
}

// ---- Writes from the public forms ------------------------------------------

export function addEnquiry(data, { emailed }) {
  return mutate((db) => {
    const now = new Date().toISOString();
    const enquiry = { id: randomUUID(), createdAt: now, updatedAt: now, status: "new", emailed, notes: [], ...data };
    db.enquiries.push(enquiry);
    log(db, "enquiry", `New ${data.intent} enquiry from ${data.company || data.fullName}`, enquiry.id);
    return enquiry;
  });
}

export function addSubscriber(email) {
  return mutate((db) => {
    const existing = db.subscribers.find((s) => s.email === email);
    if (existing) {
      if (existing.unsubscribedAt) {
        delete existing.unsubscribedAt;
        log(db, "subscriber", `${email} re-subscribed`);
      }
      return existing;
    }
    const sub = { id: randomUUID(), email, createdAt: new Date().toISOString() };
    db.subscribers.push(sub);
    log(db, "subscriber", `${email} joined the newsletter`);
    return sub;
  });
}

// ---- Writes from the admin ---------------------------------------------------

export function setEnquiryStatus(id, status) {
  if (!STATUS_IDS.includes(status)) throw new Error("Unknown status");
  return mutate((db) => {
    const e = db.enquiries.find((x) => x.id === id);
    if (!e || e.status === status) return e;
    const from = STATUSES.find((s) => s.id === e.status)?.label;
    e.status = status;
    e.updatedAt = new Date().toISOString();
    if (status !== "new" && !e.firstResponseAt) e.firstResponseAt = e.updatedAt;
    log(db, "status", `${e.company || e.fullName}: ${from} → ${STATUSES.find((s) => s.id === status).label}`, e.id);
    return e;
  });
}

export function addEnquiryNote(id, text) {
  return mutate((db) => {
    const e = db.enquiries.find((x) => x.id === id);
    if (!e) return null;
    const note = { id: randomUUID(), at: new Date().toISOString(), text };
    e.notes = [...(e.notes || []), note];
    e.updatedAt = note.at;
    log(db, "note", `Note added to ${e.company || e.fullName}`, e.id);
    return note;
  });
}

export function deleteEnquiryNote(id, noteId) {
  return mutate((db) => {
    const e = db.enquiries.find((x) => x.id === id);
    if (e) e.notes = (e.notes || []).filter((n) => n.id !== noteId);
  });
}

export function deleteEnquiry(id) {
  return mutate((db) => {
    const e = db.enquiries.find((x) => x.id === id);
    db.enquiries = db.enquiries.filter((x) => x.id !== id);
    if (e) log(db, "delete", `Deleted enquiry from ${e.company || e.fullName}`);
  });
}

export function removeSubscriber(id) {
  return mutate((db) => {
    const s = db.subscribers.find((x) => x.id === id);
    db.subscribers = db.subscribers.filter((x) => x.id !== id);
    if (s) log(db, "delete", `Removed subscriber ${s.email}`);
  });
}

export function loadSampleData() {
  return mutate((db) => {
    db.enquiries = db.enquiries.filter((e) => !e.sample);
    db.subscribers = db.subscribers.filter((s) => !s.sample);
    const { enquiries, subscribers } = sampleData();
    db.enquiries.push(...enquiries);
    db.subscribers.push(...subscribers);
    log(db, "system", `Loaded sample data (${enquiries.length} enquiries, ${subscribers.length} subscribers)`);
  });
}

export function clearSampleData() {
  return mutate((db) => {
    const before = db.enquiries.length + db.subscribers.length;
    db.enquiries = db.enquiries.filter((e) => !e.sample);
    db.subscribers = db.subscribers.filter((s) => !s.sample);
    db.activity = db.activity.filter((a) => !a.ref || db.enquiries.some((e) => e.id === a.ref));
    log(db, "system", `Removed ${before - db.enquiries.length - db.subscribers.length} sample records`);
  });
}

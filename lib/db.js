// Database access for accounts, sessions and the admin store.
//
// Production: Postgres via DATABASE_URL (e.g. Neon / Vercel Postgres; use the pooled URL).
// Local development without DATABASE_URL: an embedded Postgres (PGlite) stored in ./data/pglite,
// so the site runs with zero setup. The schema is created automatically on first use.
import "server-only";

import path from "node:path";

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email           text NOT NULL UNIQUE,
  password_hash   text NOT NULL,
  name            text NOT NULL,
  company         text,
  type            text NOT NULL CHECK (type IN ('client', 'creator')),
  status          text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'disabled')),
  grade_email     text,
  email_verified_at timestamptz,
  last_login_at   timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS client_campaigns (
  user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  campaign_id text NOT NULL,
  PRIMARY KEY (user_id, campaign_id)
);

CREATE TABLE IF NOT EXISTS sessions (
  id_hash     text PRIMARY KEY,
  user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at  timestamptz NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS sessions_user_idx ON sessions(user_id);

CREATE TABLE IF NOT EXISTS auth_tokens (
  id_hash     text PRIMARY KEY,
  user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind        text NOT NULL CHECK (kind IN ('verify', 'reset')),
  expires_at  timestamptz NOT NULL,
  used_at     timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS kv (
  key         text PRIMARY KEY,
  value       jsonb NOT NULL,
  updated_at  timestamptz NOT NULL DEFAULT now()
);
`;

async function connect() {
  if (process.env.DATABASE_URL) {
    const { Pool } = await import("pg");
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: Number(process.env.DATABASE_POOL_MAX || 5),
      ssl: /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL) ? false : { rejectUnauthorized: false },
    });
    return {
      query: (text, params) => pool.query(text, params),
      async transaction(fn) {
        const client = await pool.connect();
        try {
          await client.query("BEGIN");
          const out = await fn({ query: (t, p) => client.query(t, p) });
          await client.query("COMMIT");
          return out;
        } catch (err) {
          await client.query("ROLLBACK").catch(() => {});
          throw err;
        } finally {
          client.release();
        }
      },
    };
  }

  if (process.env.NODE_ENV === "production" && process.env.VERCEL) {
    throw new Error("DATABASE_URL must be set in production on Vercel.");
  }
  const { PGlite } = await import("@electric-sql/pglite");
  const dir = path.join(process.env.ADMIN_DATA_DIR || path.join(process.cwd(), "data"), "pglite");
  const lite = new PGlite(dir);
  await lite.waitReady;
  return {
    query: (text, params) => lite.query(text, params),
    transaction: (fn) => lite.transaction((tx) => fn({ query: (t, p) => tx.query(t, p) })),
  };
}

async function init() {
  const db = await connect();
  await db.query("CREATE EXTENSION IF NOT EXISTS pgcrypto").catch(() => {}); // gen_random_uuid on older Postgres
  for (const stmt of SCHEMA.split(";").map((s) => s.trim()).filter(Boolean)) {
    await db.query(stmt);
  }
  return db;
}

// Survive dev hot-reloads without opening a new connection each time.
function getDb() {
  const g = globalThis;
  if (!g.__vgaDb) g.__vgaDb = init().catch((err) => { g.__vgaDb = undefined; throw err; });
  return g.__vgaDb;
}

export async function query(text, params = []) {
  const db = await getDb();
  const res = await db.query(text, params);
  return res.rows;
}

export async function one(text, params = []) {
  return (await query(text, params))[0] || null;
}

export async function transaction(fn) {
  const db = await getDb();
  return db.transaction(fn);
}

export const usingEmbeddedDb = () => !process.env.DATABASE_URL;

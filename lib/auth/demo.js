// Demo accounts for reviewing the portal before Grade is connected.
//
// Enabled only while the portal runs on sample data (no GRADE_* keys), and in production builds
// only when ENABLE_DEMO_LOGIN=true is set explicitly. With real Grade keys in place it is always
// off, so demo credentials can never open live client data.
import "server-only";

import { one, transaction } from "../db";
import { demoMode } from "../grade/client";
import { hashPassword } from "./crypto";

export const DEMO_ACCOUNTS = {
  client: {
    email: "demo.client@valuegradeagency.test",
    password: "VGA-demo-client-2026",
    name: "Ada Nwankwo",
    company: "Demo Brand Ltd",
    // The sample campaigns in lib/grade/mock.js.
    campaignIds: ["demo_q4_launch", "demo_wallet_drive", "demo_fmcg_sampling"],
  },
  creator: {
    email: "demo.creator@valuegradeagency.test",
    password: "VGA-demo-creator-2026",
    name: "Tobi Kolade",
    company: null,
    campaignIds: [],
  },
};

export function demoLoginEnabled() {
  if (!demoMode()) return false;
  if (process.env.NODE_ENV !== "production") return true;
  return process.env.ENABLE_DEMO_LOGIN === "true";
}

// Create the account if missing, or reset it to a known-good state (active, verified, linked,
// known password) so the demo always works even after someone changed it.
export async function ensureDemoAccount(type) {
  const acct = DEMO_ACCOUNTS[type];
  if (!acct) throw new Error(`Unknown demo account type: ${type}`);
  const hash = await hashPassword(acct.password);
  return transaction(async (tx) => {
    const { rows } = await tx.query(
      `INSERT INTO users (email, password_hash, name, company, type, status, email_verified_at)
       VALUES ($1, $2, $3, $4, $5, 'active', now())
       ON CONFLICT (email) DO UPDATE SET
         password_hash = EXCLUDED.password_hash, name = EXCLUDED.name, company = EXCLUDED.company,
         type = EXCLUDED.type, status = 'active',
         email_verified_at = COALESCE(users.email_verified_at, now()), updated_at = now()
       RETURNING id`,
      [acct.email, hash, acct.name, acct.company, type],
    );
    const id = rows[0].id;
    for (const campaignId of acct.campaignIds) {
      await tx.query("INSERT INTO client_campaigns (user_id, campaign_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [id, campaignId]);
    }
    return id;
  });
}

export const isDemoEmail = (email) => Object.values(DEMO_ACCOUNTS).some((a) => a.email === email);

// Used by logIn so the typed credentials work even before the accounts exist.
export async function prepareDemoLogin(email) {
  if (!demoLoginEnabled() || !isDemoEmail(email)) return;
  const type = Object.entries(DEMO_ACCOUNTS).find(([, a]) => a.email === email)[0];
  if (!(await one("SELECT 1 FROM users WHERE email = $1", [email]))) await ensureDemoAccount(type);
}


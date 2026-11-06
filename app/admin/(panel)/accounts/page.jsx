import { Trash2, UserCog } from "lucide-react";
import { Card, EmptyState, PageHeader } from "@/components/admin/ui";
import AccountEditor from "@/components/admin/AccountEditor";
import { fmtDateTime } from "@/components/admin/format";
import { requireAdmin } from "@/lib/admin/auth";
import { query } from "@/lib/db";
import { demoMode, listCampaigns } from "@/lib/grade/client";
import { deleteAccount } from "@/app/admin/accounts-actions";

export const metadata = { title: "Portal accounts" };

const STATUS_STYLE = {
  pending: "bg-orange/10 text-[#9A3412]",
  active: "bg-emerald-50 text-emerald-700",
  disabled: "bg-forest/5 text-forest/50",
};

export default async function AccountsPage({ searchParams }) {
  await requireAdmin();
  const { filter = "all" } = await searchParams;
  const users = await query(
    `SELECT u.id, u.email, u.name, u.company, u.type, u.status, u.grade_email, u.email_verified_at, u.last_login_at, u.created_at,
            COALESCE(array_agg(c.campaign_id) FILTER (WHERE c.campaign_id IS NOT NULL), '{}') AS campaign_ids
     FROM users u LEFT JOIN client_campaigns c ON c.user_id = u.id
     GROUP BY u.id ORDER BY (u.status = 'pending') DESC, u.created_at DESC LIMIT 500`,
  );
  const rows = users.filter((u) => filter === "all" || u.status === filter || u.type === filter);
  let campaigns = [];
  try {
    campaigns = (await listCampaigns({ limit: 200 })).campaigns;
  } catch (err) {
    console.error("[admin] Grade campaigns", err);
  }
  const counts = { pending: users.filter((u) => u.status === "pending").length };
  const tabs = [["all", "All"], ["pending", `Pending (${counts.pending})`], ["client", "Clients"], ["creator", "Creators"], ["disabled", "Disabled"]];

  return (
    <>
      <PageHeader
        title="Portal accounts"
        description={`People who signed up at /signup. Link clients to their Grade campaigns and set creators to active so they can see their data.${demoMode() ? " Grade is in demo mode: the campaigns below are sample data." : ""}`}
      />
      <nav className="mb-4 flex flex-wrap gap-2" aria-label="Filter accounts">
        {tabs.map(([id, label]) => (
          <a key={id} href={`/admin/accounts?filter=${id}`} aria-current={filter === id ? "page" : undefined} className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold ${filter === id ? "bg-forest text-soft" : "bg-white text-forest/70 ring-1 ring-line hover:text-forest"}`}>
            {label}
          </a>
        ))}
      </nav>
      {rows.length ? (
        <div className="space-y-4">
          {rows.map((u) => (
            <Card key={u.id}>
              <div className="flex flex-col gap-5 lg:flex-row">
                <div className="lg:w-72 lg:shrink-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold uppercase ${STATUS_STYLE[u.status]}`}>{u.status}</span>
                    <span className="rounded-full bg-soft px-2 py-0.5 text-[11px] font-bold text-forest/60 uppercase">{u.type}</span>
                    {!u.email_verified_at && <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-bold text-red-700">Email not confirmed</span>}
                  </div>
                  <p className="mt-2 text-[15px] font-bold text-forest">{u.name}</p>
                  <p className="text-[13px] text-forest/60">{u.company || "—"}</p>
                  <a href={`mailto:${u.email}`} className="text-[13px] font-semibold text-forest underline decoration-orange underline-offset-2">{u.email}</a>
                  <p className="mt-2 text-[11.5px] text-forest/45">Joined {fmtDateTime(u.created_at)}{u.last_login_at ? ` · last login ${fmtDateTime(u.last_login_at)}` : ""}</p>
                  <form action={deleteAccount} className="mt-3">
                    <input type="hidden" name="id" value={u.id} />
                    <button type="submit" className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-red-700 hover:underline"><Trash2 className="size-3.5" /> Delete account</button>
                  </form>
                </div>
                <div className="min-w-0 flex-1">
                  <AccountEditor account={{ id: u.id, type: u.type, status: u.status, email: u.email, grade_email: u.grade_email, campaignIds: u.campaign_ids || [] }} campaigns={campaigns} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card><EmptyState icon={UserCog} title="No accounts here yet">New sign-ups appear here. You also get an email for each one.</EmptyState></Card>
      )}
    </>
  );
}

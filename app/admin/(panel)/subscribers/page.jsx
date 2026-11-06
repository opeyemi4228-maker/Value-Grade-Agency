import { Download, MailPlus } from "lucide-react";
import FilterBar from "@/components/admin/FilterBar";
import { Sparkline } from "@/components/admin/charts";
import { fmtDateTime, fmtNum, timeAgo } from "@/components/admin/format";
import { Card, DeltaPill, EmptyState, PageHeader, SampleTag, btn } from "@/components/admin/ui";
import SubscriberRemove from "@/components/admin/SubscriberRemove";
import { requireAdmin } from "@/lib/admin/auth";
import { buildMetrics } from "@/lib/admin/metrics";
import { getDb } from "@/lib/admin/store";

export const metadata = { title: "Subscribers" };

export default async function SubscribersPage({ searchParams }) {
  await requireAdmin();
  const params = await searchParams;
  const db = await getDb();
  const m = buildMetrics(db, "90d");
  const q = (params.q || "").trim().toLowerCase();
  let rows = db.subscribers.filter((s) => !q || s.email.includes(q));
  if (params.sort === "oldest") rows = [...rows].reverse();
  const shown = rows.slice(0, 200);
  const last30 = buildMetrics(db, "30d").kpis.subscribers;

  return (
    <>
      <PageHeader title="Subscribers" description="People who joined the newsletter from the website footer.">
        <a href={`/api/admin/export?type=subscribers${q ? `&q=${encodeURIComponent(q)}` : ""}`} className={btn("secondary")}>
          <Download className="size-4" aria-hidden="true" /> Export CSV
        </a>
      </PageHeader>

      <div className="mb-4 grid gap-4 lg:grid-cols-[repeat(2,minmax(0,1fr))_minmax(0,2fr)]">
        <Card>
          <p className="text-[13.5px] font-semibold text-forest/75">Total subscribers</p>
          <p className="mt-3 text-[1.85rem] leading-none font-extrabold tracking-[-0.03em] text-forest tabular-nums">{fmtNum(db.subscribers.length)}</p>
          <p className="mt-2.5 text-xs text-forest/50">All time</p>
        </Card>
        <Card>
          <p className="text-[13.5px] font-semibold text-forest/75">Joined in the last 30 days</p>
          <div className="mt-3 flex items-center gap-2.5">
            <p className="text-[1.85rem] leading-none font-extrabold tracking-[-0.03em] text-forest tabular-nums">{fmtNum(last30.value)}</p>
            <DeltaPill delta={last30.delta} />
          </div>
          <p className="mt-2.5 text-xs text-forest/50">vs. {fmtNum(last30.prev)} the 30 days before</p>
        </Card>
        <Card>
          <p className="text-[13.5px] font-semibold text-forest/75">Growth, last 90 days</p>
          <div className="mt-4">
            <Sparkline data={m.subsTrend} height={64} />
          </div>
        </Card>
      </div>

      <div className="rounded-2xl border border-line/80 bg-white shadow-[0_1px_2px_rgb(1_28_19/0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3">
          <p className="text-[15px] font-bold text-forest">
            {q ? `${fmtNum(rows.length)} matching` : "All subscribers"}
          </p>
          <FilterBar params={params} showStatus={false} placeholder="Search by email…" />
        </div>
        {shown.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-[13px]">
              <thead>
                <tr className="text-[10.5px] font-bold tracking-[0.1em] text-forest/45 uppercase">
                  <th className="px-5 py-3 font-bold">Email</th>
                  <th className="py-3 font-bold">Subscribed</th>
                  <th className="px-5 py-3 text-right font-bold">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {shown.map((s) => (
                  <tr key={s.id} className="group border-t border-line/70 hover:bg-soft/60">
                    <td className="px-5 py-3">
                      <span className="flex items-center gap-2 font-semibold text-forest">
                        <a href={`mailto:${s.email}`} className="hover:underline">
                          {s.email}
                        </a>
                        {s.sample && <SampleTag />}
                      </span>
                    </td>
                    <td className="py-3 text-forest/60" title={fmtDateTime(s.createdAt)}>
                      {timeAgo(s.createdAt)}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <SubscriberRemove id={s.id} email={s.email} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length > shown.length && <p className="border-t border-line px-5 py-3 text-xs text-forest/50">Showing the first 200. Export the CSV for the full list.</p>}
          </div>
        ) : (
          <EmptyState icon={MailPlus} title={q ? "No matching subscribers" : "No subscribers yet"}>
            {q ? "Try a different search." : "Sign-ups from the newsletter form in the footer will appear here."}
          </EmptyState>
        )}
      </div>
    </>
  );
}

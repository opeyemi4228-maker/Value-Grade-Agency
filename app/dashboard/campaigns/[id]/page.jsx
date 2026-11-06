import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeCheck, Eye, Heart, MessageCircle, Share2, Users } from "lucide-react";
import { requirePortal } from "../../guard";
import * as grade from "@/lib/grade/client";
import { compact, date, money, ownsCampaign } from "@/lib/portal";
import { Badge, Card, GradeUnavailable, PageTitle, Stat, Table } from "@/components/portal/ui";
import { AreaChart } from "@/components/portal/charts";

export const metadata = { title: "Campaign" };

export default async function CampaignPage({ params }) {
  const user = await requirePortal("client");
  const { id } = await params;
  const campaignId = decodeURIComponent(id);
  if (!ownsCampaign(user, campaignId)) notFound();

  let detail, creators, series, top;
  try {
    [detail, { creators }, series, top] = await Promise.all([
      grade.getCampaign(campaignId),
      grade.listCampaignCreators(campaignId),
      grade.analyticsSeries([campaignId], { metric: "views", days: 30 }).catch(() => null),
      grade.analyticsTop([campaignId], { metric: "views", days: 30, limit: 5 }).catch(() => null),
    ]);
  } catch (err) {
    if (err.status === 404) notFound();
    console.error("[portal] campaign", err);
    return <><PageTitle title="Campaign" /><div className="mt-8"><GradeUnavailable /></div></>;
  }
  if (!detail) notFound();
  const { campaign: c, analytics: a } = detail;
  const pending = creators.reduce((t, cr) => t + (cr.pendingValue || 0), 0);
  const currency = creators.find((cr) => cr.currency)?.currency || "USD";

  return (
    <>
      <Link href="/dashboard/campaigns" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-forest/55 hover:text-forest"><ArrowLeft className="size-4" aria-hidden="true" /> All campaigns</Link>
      <div className="mt-4">
        <PageTitle title={c.campaignName} intro={`${date(c.startDate)} – ${c.endDate ? date(c.endDate) : "ongoing"}${c.campaignDescription ? ` · ${c.campaignDescription}` : ""}`} action={<Badge status={c.campaignStatus} />} />
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Stat dark label="Pending pay" value={money(pending, currency)} hint="Earned, not yet paid" />
        <Stat icon={Users} label="Creators" value={a?.totalCreators ?? creators.length} />
        <Stat icon={Eye} label="Views" value={compact(a?.totalViews)} />
        <Stat icon={Heart} label="Likes" value={compact(a?.totalLikes)} />
        <Stat icon={MessageCircle} label="Comments" value={compact(a?.totalComments)} hint={<span className="inline-flex items-center gap-1"><Share2 className="size-3" /> {compact(a?.totalShares)} shares</span>} />
      </div>
      {series && (
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.65fr_1fr]">
          <Card title="Views per day" subtitle="Last 30 days" divided={false}>
            <AreaChart points={series} label={`${c.campaignName}: views per day, last 30 days`} />
          </Card>
          <Card title="Top posts" subtitle="By views, last 30 days" padded={false}>
            {top?.length ? (
              <ol className="divide-y divide-forest/[0.05]">
                {top.map((p, i) => (
                  <li key={p.id} className="flex items-center gap-3 px-5 py-3.5">
                    <span className="w-4 shrink-0 text-[12px] font-semibold text-forest/35 tabular-nums">{i + 1}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] font-semibold text-forest">{p.title}</span>
                      <span className="block truncate text-[12px] font-medium text-muted">{p.author}</span>
                    </span>
                    <span className="text-[13px] font-semibold tabular-nums">{compact(p.value)}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="px-5 py-12 text-center text-[13px] font-medium text-muted">No posts tracked yet.</p>
            )}
          </Card>
        </div>
      )}

      <div className="mt-6">
        <Card title="Creators" subtitle={`${creators.length} on this campaign`} padded={false}>
          <Table head={["Creator", "Pay type", "Posts", "Views", "Likes", "Pending"]} minWidth="44rem">
            {creators.map((cr) => (
              <tr key={cr.campaignCreatorRecordId || cr.creatorEmail}>
                <td className="px-5 py-3.5">
                  <span className="flex items-center gap-1.5 font-semibold text-forest">{cr.creatorName || cr.creatorEmail}{cr.isVerified && <BadgeCheck className="size-4 text-[#9A3412]" aria-label="Verified" />}</span>
                  <span className="block text-[12px] text-forest/45">{cr.creatorEmail}</span>
                </td>
                <td className="px-5 py-3.5 text-forest/65">{cr.payoutType ? cr.payoutType.toLowerCase().replace(/^\w/, (x) => x.toUpperCase()) : "—"}</td>
                <td className="px-5 py-3.5 font-semibold tabular-nums">{cr.totalPosts ?? "—"}</td>
                <td className="px-5 py-3.5 font-semibold tabular-nums">{compact(cr.totalViews)}</td>
                <td className="px-5 py-3.5 font-semibold tabular-nums">{compact(cr.totalLikes)}</td>
                <td className="px-5 py-3.5 text-right font-semibold tabular-nums">{money(cr.pendingValue, cr.currency || currency)}</td>
              </tr>
            ))}
          </Table>
        </Card>
        <p className="mt-3 text-[12px] font-medium text-forest/45">Figures are tracked by Grade and refreshed regularly. Amounts become payable once VGA verifies the work and you approve the payout.</p>
      </div>
    </>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeCheck, Eye, Heart, MessageCircle, Share2, Users } from "lucide-react";
import { requirePortal } from "../../guard";
import * as grade from "@/lib/grade/client";
import { compact, date, money, ownsCampaign } from "@/lib/portal";
import { Badge, Card, GradeUnavailable, PageTitle, Stat, Table } from "@/components/portal/ui";

export const metadata = { title: "Campaign" };

export default async function CampaignPage({ params }) {
  const user = await requirePortal("client");
  const { id } = await params;
  const campaignId = decodeURIComponent(id);
  if (!ownsCampaign(user, campaignId)) notFound();

  let detail, creators;
  try {
    [detail, { creators }] = await Promise.all([grade.getCampaign(campaignId), grade.listCampaignCreators(campaignId)]);
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
      <Link href="/dashboard/campaigns" className="inline-flex items-center gap-1.5 text-[13px] font-bold text-forest/55 hover:text-forest"><ArrowLeft className="size-4" aria-hidden="true" /> All campaigns</Link>
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
      <div className="mt-6">
        <Card title="Creators" padded={false}>
          <Table head={["Creator", "Pay type", "Posts", "Views", "Likes", "Pending"]} minWidth="44rem">
            {creators.map((cr) => (
              <tr key={cr.campaignCreatorRecordId || cr.creatorEmail}>
                <td className="px-5 py-3.5">
                  <span className="flex items-center gap-1.5 font-bold text-forest">{cr.creatorName || cr.creatorEmail}{cr.isVerified && <BadgeCheck className="size-4 text-[#9A3412]" aria-label="Verified" />}</span>
                  <span className="block text-[12px] text-forest/45">{cr.creatorEmail}</span>
                </td>
                <td className="px-5 py-3.5 text-forest/65">{cr.payoutType ? cr.payoutType.toLowerCase().replace(/^\w/, (x) => x.toUpperCase()) : "—"}</td>
                <td className="px-5 py-3.5 font-semibold tabular-nums">{cr.totalPosts ?? "—"}</td>
                <td className="px-5 py-3.5 font-semibold tabular-nums">{compact(cr.totalViews)}</td>
                <td className="px-5 py-3.5 font-semibold tabular-nums">{compact(cr.totalLikes)}</td>
                <td className="px-5 py-3.5 text-right font-bold tabular-nums">{money(cr.pendingValue, cr.currency || currency)}</td>
              </tr>
            ))}
          </Table>
        </Card>
        <p className="mt-3 text-[12px] font-medium text-forest/45">Figures are tracked by Grade and refreshed regularly. Amounts become payable once VGA verifies the work and you approve the payout.</p>
      </div>
    </>
  );
}

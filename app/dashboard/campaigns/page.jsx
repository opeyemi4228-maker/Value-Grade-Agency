import Link from "next/link";
import { FolderKanban } from "lucide-react";
import { requirePortal } from "../guard";
import { clientCampaigns, compact, date } from "@/lib/portal";
import { Badge, Card, Empty, GradeUnavailable, PageTitle, Table } from "@/components/portal/ui";

export const metadata = { title: "Campaigns" };

export default async function CampaignsPage() {
  const user = await requirePortal("client");
  let campaigns;
  try {
    campaigns = await clientCampaigns(user);
  } catch (err) {
    console.error("[portal] campaigns", err);
    return <><PageTitle title="Campaigns" /><div className="mt-8"><GradeUnavailable /></div></>;
  }
  return (
    <>
      <PageTitle title="Campaigns" intro="Live numbers from every campaign VGA runs for you." />
      <div className="mt-8">
        <Card padded={false}>
          {campaigns.length ? (
            <Table head={["Campaign", "Status", "Dates", "Creators", "Views", "Engagement"]} minWidth="46rem">
              {campaigns.map(({ campaign: c, analytics: a }) => (
                <tr key={c.campaignId} className="hover:bg-forest/[0.02]">
                  <td className="px-5 py-4">
                    <Link href={`/dashboard/campaigns/${encodeURIComponent(c.campaignId)}`} className="font-bold text-forest hover:text-[#9A3412]">{c.campaignName}</Link>
                    {c.campaignDescription && <span className="mt-0.5 block max-w-xs truncate text-[12px] text-forest/45">{c.campaignDescription}</span>}
                  </td>
                  <td className="px-5 py-4"><Badge status={c.campaignStatus} /></td>
                  <td className="px-5 py-4 text-forest/60">{date(c.startDate)} – {c.endDate ? date(c.endDate) : "ongoing"}</td>
                  <td className="px-5 py-4 font-semibold tabular-nums">{a?.totalCreators ?? "—"}</td>
                  <td className="px-5 py-4 font-semibold tabular-nums">{compact(a?.totalViews)}</td>
                  <td className="px-5 py-4 text-right font-semibold tabular-nums">{compact((a?.totalLikes || 0) + (a?.totalComments || 0) + (a?.totalShares || 0))}</td>
                </tr>
              ))}
            </Table>
          ) : (
            <Empty icon={FolderKanban} title="No campaigns linked yet" body="Your VGA campaign lead links campaigns to your account as they go live." />
          )}
        </Card>
      </div>
    </>
  );
}

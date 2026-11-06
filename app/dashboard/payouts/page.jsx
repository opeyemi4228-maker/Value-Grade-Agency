import { Wallet } from "lucide-react";
import { requirePortal } from "../guard";
import * as grade from "@/lib/grade/client";
import { creatorEmail, date, money } from "@/lib/portal";
import { Badge, Card, Empty, GradeUnavailable, PageTitle, Table } from "@/components/portal/ui";

export const metadata = { title: "Payouts" };

export default async function PayoutsPage() {
  const user = await requirePortal("creator");
  let payouts = [], meta;
  try {
    ({ payouts, meta } = await grade.creatorPayouts(creatorEmail(user), { limit: 100 }));
  } catch (err) {
    if (err.status !== 404) {
      console.error("[portal] payouts", err);
      return <><PageTitle title="Payouts" /><div className="mt-8"><GradeUnavailable /></div></>;
    }
  }
  return (
    <>
      <PageTitle title="Payouts" intro={`Every payout to ${creatorEmail(user)}.${meta?.bufferBusinessDays ? ` Bank transfers usually land within ${meta.bufferBusinessDays} business days of approval.` : ""}`} />
      <div className="mt-8">
        <Card padded={false}>
          {payouts.length ? (
            <Table head={["Campaign", "Reference", "Date", "Status", "Amount"]} minWidth="38rem">
              {payouts.map((p) => (
                <tr key={p.payoutId}>
                  <td className="px-5 py-3.5 font-bold text-forest">{p.campaignName || "Direct payout"}</td>
                  <td className="px-5 py-3.5 font-mono text-[12px] text-forest/50">{p.payoutId}</td>
                  <td className="px-5 py-3.5 text-forest/60">{date(p.createdAt || p.payoutDate)}</td>
                  <td className="px-5 py-3.5"><Badge status={p.status} /></td>
                  <td className="px-5 py-3.5 text-right font-bold tabular-nums">{p.amount != null ? money(p.amount, p.currency) : "—"}</td>
                </tr>
              ))}
            </Table>
          ) : (
            <Empty icon={Wallet} title="No payouts yet" body="Payouts appear here once your work is verified and approved." />
          )}
        </Card>
      </div>
    </>
  );
}

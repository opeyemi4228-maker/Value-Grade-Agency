import { CheckSquare, History } from "lucide-react";
import { requirePortal } from "../guard";
import { clientApprovals, date, money } from "@/lib/portal";
import { Badge, Card, Empty, GradeUnavailable, PageTitle, Table } from "@/components/portal/ui";
import { ApprovalButtons } from "@/components/portal/Actions";

export const metadata = { title: "Approvals" };

export default async function ApprovalsPage() {
  const user = await requirePortal("client");
  let pending, history;
  try {
    [pending, history] = await Promise.all([clientApprovals(user, "PENDING"), clientApprovals(user, "APPROVED,REJECTED,CANCELLED")]);
  } catch (err) {
    console.error("[portal] approvals", err);
    return <><PageTitle title="Approvals" /><div className="mt-8"><GradeUnavailable /></div></>;
  }
  const total = pending.reduce((t, a) => t + a.amount, 0);
  return (
    <>
      <PageTitle title="Payout approvals" intro="VGA has verified each deliverable below. Approving releases the payment to the creator through Grade." />
      <div className="mt-8 space-y-6">
        <Card title={`Waiting for you${pending.length ? ` · ${money(total, pending[0].currency)}` : ""}`} padded={false}>
          {pending.length ? (
            <ul className="divide-y divide-forest/[0.05]">
              {pending.map((a) => (
                <li key={a.id} className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[15px] font-semibold text-forest">{a.creatorName} <span className="font-semibold tabular-nums">· {money(a.amount, a.currency)}</span></p>
                    <p className="text-[12.5px] font-medium text-forest/55">{a.description || "Campaign payout"} · requested {date(a.createdAt)}</p>
                  </div>
                  <ApprovalButtons approvalId={a.id} label={money(a.amount, a.currency)} />
                </li>
              ))}
            </ul>
          ) : (
            <Empty icon={CheckSquare} title="Nothing to approve" body="New payout requests appear here once VGA has verified the work." />
          )}
        </Card>
        <Card title="History" padded={false}>
          {history.length ? (
            <Table head={["Creator", "Requested", "Decided", "Status", "Amount"]} minWidth="38rem">
              {history.map((a) => (
                <tr key={a.id}>
                  <td className="px-5 py-3.5 font-semibold text-forest">{a.creatorName}</td>
                  <td className="px-5 py-3.5 text-forest/60">{date(a.createdAt)}</td>
                  <td className="px-5 py-3.5 text-forest/60">{date(a.decidedAt)}</td>
                  <td className="px-5 py-3.5"><Badge status={a.status} /></td>
                  <td className="px-5 py-3.5 text-right font-semibold tabular-nums">{money(a.amount, a.currency)}</td>
                </tr>
              ))}
            </Table>
          ) : (
            <Empty icon={History} title="No decisions yet" />
          )}
        </Card>
      </div>
    </>
  );
}

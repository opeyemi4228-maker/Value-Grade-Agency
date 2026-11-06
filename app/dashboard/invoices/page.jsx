import { Download, FileText } from "lucide-react";
import { requirePortal } from "../guard";
import * as grade from "@/lib/grade/client";
import { clientApprovals, creatorEmail, date, money } from "@/lib/portal";
import { Badge, Card, Empty, GradeUnavailable, PageTitle, Table } from "@/components/portal/ui";

export const metadata = { title: "Invoices" };

function DownloadLink({ id }) {
  return (
    <a href={`/api/portal/invoice/${encodeURIComponent(id)}`} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12.5px] font-bold text-forest ring-1 ring-forest/15 hover:bg-forest hover:text-soft">
      <Download className="size-3.5" aria-hidden="true" /> PDF
    </a>
  );
}

export default async function InvoicesPage() {
  const user = await requirePortal();
  const client = user.type === "client";
  let rows;
  try {
    if (client) {
      rows = (await clientApprovals(user, "APPROVED")).filter((a) => a.invoiceId).map((a) => ({
        id: a.invoiceId, title: a.creatorName, sub: a.description, when: a.decidedAt || a.createdAt, status: "PAID", amount: money(a.amount, a.currency),
      }));
    } else {
      const { receipts } = await grade.creatorReceipts(creatorEmail(user));
      rows = receipts.map((r) => ({ id: r.invoiceId, title: r.campaignName || "Payout", sub: r.invoiceId, when: r.payoutDate, status: r.status, amount: money(r.earningsValue, r.currency) }));
    }
  } catch (err) {
    if (err.status !== 404) {
      console.error("[portal] invoices", err);
      return <><PageTitle title={client ? "Invoices" : "Receipts"} /><div className="mt-8"><GradeUnavailable /></div></>;
    }
    rows = [];
  }
  return (
    <>
      <PageTitle title={client ? "Invoices" : "Receipts"} intro={client ? "Invoices for every payout you've approved, ready for your finance team." : "A receipt for every payment VGA has sent you."} />
      <div className="mt-8">
        <Card padded={false}>
          {rows.length ? (
            <Table head={[client ? "Creator" : "Campaign", "Date", "Status", "Amount", ""]} minWidth="36rem">
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="px-5 py-3.5"><span className="block font-bold text-forest">{r.title}</span><span className="block text-[12px] text-forest/45">{r.sub}</span></td>
                  <td className="px-5 py-3.5 text-forest/60">{date(r.when)}</td>
                  <td className="px-5 py-3.5"><Badge status={r.status} /></td>
                  <td className="px-5 py-3.5 font-bold tabular-nums">{r.amount}</td>
                  <td className="px-5 py-3.5 text-right"><DownloadLink id={r.id} /></td>
                </tr>
              ))}
            </Table>
          ) : (
            <Empty icon={FileText} title={client ? "No invoices yet" : "No receipts yet"} body={client ? "Invoices appear once you approve a payout." : "Receipts appear once a payout is sent."} />
          )}
        </Card>
      </div>
    </>
  );
}

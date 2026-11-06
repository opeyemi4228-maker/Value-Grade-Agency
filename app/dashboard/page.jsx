import Link from "next/link";
import { ArrowRight, BadgeCheck, CheckSquare, Clock3, Eye, FolderKanban, MailCheck, Users, Wallet } from "lucide-react";
import { canSeeData, requireUser } from "@/lib/auth/session";
import * as grade from "@/lib/grade/client";
import { clientApprovals, clientCampaigns, compact, creatorEmail, date, money } from "@/lib/portal";
import { Badge, ButtonLink, Card, Empty, GradeUnavailable, PageTitle, Stat, Table } from "@/components/portal/ui";
import { ApprovalButtons, ResendVerification } from "@/components/portal/Actions";
import { site } from "@/lib/site";

export const metadata = { title: "Overview" };

function Waiting({ user }) {
  const verified = Boolean(user.email_verified_at);
  const steps = [
    { done: true, title: "Account created", body: user.email },
    { done: verified, title: "Confirm your email", body: verified ? "Confirmed" : "Check your inbox for the confirmation link." },
    {
      done: false,
      title: user.type === "client" ? "VGA links your campaigns" : "VGA links your creator record",
      body: user.type === "client" ? "Your campaign lead connects your account to your live campaigns. Usually within one business day." : "We match your account to the email we pay you on. Usually within one business day.",
    },
  ];
  return (
    <>
      <PageTitle title={`Welcome, ${user.name.split(" ")[0]}`} intro="Your account is almost ready." />
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card title="Getting set up">
          <ol className="space-y-5">
            {steps.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span className={s.done ? "grid size-8 shrink-0 place-items-center rounded-full bg-forest text-orange" : "grid size-8 shrink-0 place-items-center rounded-full border border-dashed border-orange text-[12px] font-bold text-[#9A3412]"}>
                  {s.done ? <BadgeCheck className="size-4" aria-hidden="true" /> : i + 1}
                </span>
                <span>
                  <span className="block text-[14.5px] font-bold text-forest">{s.title}</span>
                  <span className="block text-[13px] font-medium text-forest/55">{s.body}</span>
                </span>
              </li>
            ))}
          </ol>
          {!verified && <div className="mt-6 border-t border-forest/[0.06] pt-5"><ResendVerification /></div>}
        </Card>
        <Card title="Need it sooner?">
          <p className="text-[14px] font-medium text-forest/65">Tell your VGA campaign lead you&apos;ve signed up, or contact us and we&apos;ll link your account.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <ButtonLink href="/contact?intent=general">Contact VGA</ButtonLink>
            <ButtonLink href={`mailto:${site.email}`} variant="light">Email us</ButtonLink>
          </div>
        </Card>
      </div>
    </>
  );
}

async function ClientOverview({ user }) {
  let campaigns, approvals;
  try {
    [campaigns, approvals] = await Promise.all([clientCampaigns(user), clientApprovals(user)]);
  } catch (err) {
    console.error("[portal] overview", err);
    return <><PageTitle title="Overview" /><div className="mt-8"><GradeUnavailable /></div></>;
  }
  const totals = campaigns.reduce(
    (t, c) => ({ creators: t.creators + (c.analytics?.totalCreators || 0), views: t.views + (c.analytics?.totalViews || 0), likes: t.likes + (c.analytics?.totalLikes || 0) }),
    { creators: 0, views: 0, likes: 0 },
  );
  const pendingTotal = approvals.reduce((t, a) => t + a.amount, 0);
  const currency = approvals[0]?.currency || "USD";
  const live = campaigns.filter((c) => ["ONGOING", "ACTIVE"].includes(c.campaign.campaignStatus)).length;

  return (
    <>
      <PageTitle title={`Good to see you, ${user.name.split(" ")[0]}`} intro={user.company ? `${user.company} · ${campaigns.length} campaign${campaigns.length === 1 ? "" : "s"}` : undefined} action={<ButtonLink href="/dashboard/approvals">Review approvals <ArrowRight className="size-4" /></ButtonLink>} />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat dark icon={Wallet} label="Awaiting approval" value={money(pendingTotal, currency)} hint={`${approvals.length} payout${approvals.length === 1 ? "" : "s"}`} />
        <Stat icon={FolderKanban} label="Live campaigns" value={live} hint={`${campaigns.length} in total`} />
        <Stat icon={Users} label="Creators" value={totals.creators.toLocaleString()} hint="Across your campaigns" />
        <Stat icon={Eye} label="Views" value={compact(totals.views)} hint={`${compact(totals.likes)} likes`} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card title="Campaigns" action={<Link href="/dashboard/campaigns" className="text-[13px] font-bold text-[#9A3412] hover:underline">View all</Link>} padded={false}>
          <Table head={["Campaign", "Status", "Creators", "Views"]} minWidth="32rem">
            {campaigns.map(({ campaign: c, analytics: a }) => (
              <tr key={c.campaignId} className="hover:bg-forest/[0.02]">
                <td className="px-5 py-3.5"><Link href={`/dashboard/campaigns/${encodeURIComponent(c.campaignId)}`} className="font-bold text-forest hover:text-[#9A3412]">{c.campaignName}</Link><span className="block text-[12px] text-forest/45">Started {date(c.startDate)}</span></td>
                <td className="px-5 py-3.5"><Badge status={c.campaignStatus} /></td>
                <td className="px-5 py-3.5 font-semibold tabular-nums">{a?.totalCreators ?? "—"}</td>
                <td className="px-5 py-3.5 text-right font-semibold tabular-nums">{compact(a?.totalViews)}</td>
              </tr>
            ))}
          </Table>
        </Card>
        <Card title="Next up for approval" padded={false}>
          {approvals.length ? (
            <ul className="divide-y divide-forest/[0.05]">
              {approvals.slice(0, 4).map((a) => (
                <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                  <span>
                    <span className="block text-[14px] font-bold text-forest">{a.creatorName}</span>
                    <span className="block text-[12px] font-medium text-forest/50">{money(a.amount, a.currency)} · {a.description || date(a.createdAt)}</span>
                  </span>
                  <ApprovalButtons approvalId={a.id} label={money(a.amount, a.currency)} />
                </li>
              ))}
            </ul>
          ) : (
            <Empty icon={CheckSquare} title="All caught up" body="New payout requests appear here once VGA has verified the work." />
          )}
        </Card>
      </div>
    </>
  );
}

async function CreatorOverview({ user }) {
  const email = creatorEmail(user);
  let total, payouts, kyc;
  try {
    [total, { payouts }, kyc] = await Promise.all([grade.creatorTotalPaid(email), grade.creatorPayouts(email, { limit: 5 }), grade.kycStatus(email)]);
  } catch (err) {
    if (err.status === 404) {
      return (
        <>
          <PageTitle title={`Hi ${user.name.split(" ")[0]}`} />
          <div className="mt-8"><Card><Empty icon={Clock3} title="No payouts yet" body={`We haven't paid ${email} through VGA yet. Once you're added to a campaign, it shows up here.`} /></Card></div>
        </>
      );
    }
    console.error("[portal] creator overview", err);
    return <><PageTitle title="Overview" /><div className="mt-8"><GradeUnavailable /></div></>;
  }
  const pending = payouts.filter((p) => p.status !== "completed");
  const verified = kyc?.kycStatus === "complete";

  return (
    <>
      <PageTitle title={`Hi ${user.name.split(" ")[0]}`} intro="Your campaigns, payouts and verification in one place." />
      {!verified && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-forest p-5 text-soft">
          <p className="flex items-center gap-3 text-[14.5px] font-semibold"><BadgeCheck className="size-5 text-orange" aria-hidden="true" /> Verify your identity once so we can pay you without delays.</p>
          <ButtonLink href="/dashboard/verification" variant="light">Verify now</ButtonLink>
        </div>
      )}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat dark icon={Wallet} label="Total paid" value={total?.preferredCurrency && total.spentAmountPreferred ? money(total.spentAmountPreferred, total.preferredCurrency) : money(total?.spentAmountUSD, "USD")} hint={total?.spentAmountUSD ? `${money(total.spentAmountUSD, "USD")} equivalent` : undefined} />
        <Stat icon={Clock3} label="In progress" value={pending.length} hint="Payouts on their way" />
        <Stat icon={MailCheck} label="Verification" value={verified ? "Verified" : "Not yet"} hint={kyc?.kycStatus ? `Status: ${kyc.kycStatus.replace(/_/g, " ")}` : "Start from the Verification page"} />
      </div>
      <div className="mt-6">
        <Card title="Recent payouts" action={<Link href="/dashboard/payouts" className="text-[13px] font-bold text-[#9A3412] hover:underline">View all</Link>} padded={false}>
          {payouts.length ? (
            <Table head={["Campaign", "Date", "Status", "Amount"]} minWidth="30rem">
              {payouts.map((p) => (
                <tr key={p.payoutId}>
                  <td className="px-5 py-3.5 font-bold text-forest">{p.campaignName || "Direct payout"}</td>
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

export default async function DashboardPage() {
  const user = await requireUser();
  if (!canSeeData(user)) return <Waiting user={user} />;
  return user.type === "client" ? <ClientOverview user={user} /> : <CreatorOverview user={user} />;
}

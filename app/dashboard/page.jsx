import Link from "next/link";
import { ArrowRight, ArrowUpRight, BadgeCheck, CalendarClock, CheckSquare, Clock3, Eye, FolderKanban, Heart, PlayCircle, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import { canSeeData, requireUser } from "@/lib/auth/session";
import * as grade from "@/lib/grade/client";
import { clientApprovals, clientCampaigns, clientPerformance, compact, creatorEmail, date, earningsByMonth, greeting, money, percent } from "@/lib/portal";
import { Badge, BarList, ButtonLink, Card, Empty, GradeUnavailable, PageTitle, Progress, Stat, Table } from "@/components/portal/ui";
import { AreaChart, ColumnChart } from "@/components/portal/charts";
import { ApprovalButtons, ResendVerification } from "@/components/portal/Actions";
import { site } from "@/lib/site";

export const metadata = { title: "Overview" };

const firstName = (user) => user.name.split(" ")[0];
const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;
const viewAll = (href, label = "View all") => (
  <Link href={href} className="inline-flex items-center gap-1 text-[13px] font-semibold whitespace-nowrap text-[#9A3412] hover:underline">
    {label} <ArrowRight className="size-3.5" aria-hidden="true" />
  </Link>
);

// How far a campaign is through its dates (0–1), or null when it has no end date.
function timeline(c) {
  if (!c.startDate || !c.endDate) return null;
  const start = new Date(c.startDate).getTime();
  const end = new Date(c.endDate).getTime();
  if (end <= start) return 1;
  return Math.min(Math.max((Date.now() - start) / (end - start), 0), 1);
}

const PLATFORM = { TIKTOK: "TikTok", INSTAGRAM: "Instagram", YOUTUBE: "YouTube", FACEBOOK: "Facebook", TWITTER: "X" };

// ---- Not linked yet ---------------------------------------------------------------

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
      <PageTitle title={`Welcome, ${firstName(user)}`} intro="Your account is almost ready." />
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card title="Getting set up" subtitle={`${steps.filter((s) => s.done).length} of ${steps.length} done`}>
          <ol className="space-y-5">
            {steps.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span className={s.done ? "grid size-8 shrink-0 place-items-center rounded-full bg-forest text-orange" : "grid size-8 shrink-0 place-items-center rounded-full border border-dashed border-orange text-[12px] font-semibold text-[#9A3412]"}>
                  {s.done ? <BadgeCheck className="size-4" aria-hidden="true" /> : i + 1}
                </span>
                <span>
                  <span className="block text-[14.5px] font-semibold text-forest">{s.title}</span>
                  <span className="block text-[13px] font-medium text-muted">{s.body}</span>
                </span>
              </li>
            ))}
          </ol>
          {!verified && <div className="mt-6 border-t border-forest/[0.06] pt-5"><ResendVerification /></div>}
        </Card>
        <Card title="Need it sooner?">
          <p className="text-[14px] font-medium text-muted">Tell your VGA campaign lead you&apos;ve signed up, or contact us and we&apos;ll link your account.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <ButtonLink href="/contact?intent=general">Contact VGA</ButtonLink>
            <ButtonLink href={`mailto:${site.email}`} variant="light">Email us</ButtonLink>
          </div>
        </Card>
      </div>
    </>
  );
}

// ---- Brand / agency ---------------------------------------------------------------

async function ClientOverview({ user }) {
  let campaigns, approvals, perf;
  try {
    [campaigns, approvals, perf] = await Promise.all([
      clientCampaigns(user),
      clientApprovals(user),
      // Analytics is a nice-to-have: if the key lacks analytics:read, the rest still loads.
      clientPerformance(user).catch((err) => {
        console.error("[portal] analytics", err);
        return null;
      }),
    ]);
  } catch (err) {
    console.error("[portal] overview", err);
    return <><PageTitle title="Overview" /><div className="mt-8"><GradeUnavailable /></div></>;
  }

  const totals = campaigns.reduce(
    (t, c) => ({
      creators: t.creators + (c.analytics?.totalCreators || 0),
      views: t.views + (c.analytics?.totalViews || 0),
      likes: t.likes + (c.analytics?.totalLikes || 0),
      comments: t.comments + (c.analytics?.totalComments || 0),
      shares: t.shares + (c.analytics?.totalShares || 0),
    }),
    { creators: 0, views: 0, likes: 0, comments: 0, shares: 0 },
  );
  const engagements = totals.likes + totals.comments + totals.shares;
  const engagementRate = totals.views ? engagements / totals.views : 0;
  const pendingTotal = approvals.reduce((t, a) => t + a.amount, 0);
  const currency = approvals[0]?.currency || "USD";
  const live = campaigns.filter(({ campaign: c }) => ["ONGOING", "ACTIVE"].includes(c.campaignStatus));

  return (
    <>
      <PageTitle
        title={`${greeting()}, ${firstName(user)}`}
        intro={`${user.company ? `${user.company} · ` : ""}${plural(live.length, "live campaign")}, ${plural(approvals.length, "payout")} waiting for you.`}
        action={approvals.length > 0 && <ButtonLink href="/dashboard/approvals" variant="orange">Review {plural(approvals.length, "approval")} <ArrowRight className="size-4" aria-hidden="true" /></ButtonLink>}
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat dark icon={Wallet} label="Awaiting your approval" value={money(pendingTotal, currency)} hint={approvals.length ? `${plural(approvals.length, "payout")}, verified by VGA` : "Nothing waiting"} />
        <Stat icon={Eye} label="Views, last 30 days" value={compact(perf?.total ?? totals.views)} change={perf?.change ?? null} hint={perf?.change != null ? "vs previous 30 days" : "All time"} />
        <Stat icon={Heart} label="Engagement rate" value={percent(engagementRate)} hint={`${compact(engagements)} likes, comments and shares`} />
        <Stat icon={FolderKanban} label="Live campaigns" value={live.length} hint={`${plural(totals.creators, "creator")} across ${plural(campaigns.length, "campaign")}`} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.65fr_1fr]">
        <Card title="Views per day" subtitle="Across all your campaigns, last 30 days" divided={false}>
          {perf ? <AreaChart points={perf.series} label="Views per day, last 30 days" /> : <p className="py-16 text-center text-[13px] font-medium text-muted">Daily analytics will appear once Grade analytics access is enabled.</p>}
        </Card>
        <Card title="Engagement" subtitle="Lifetime, across all campaigns" divided={false}>
          <div className="mt-2">
            <BarList
              rows={[
                { label: "Likes", value: totals.likes, display: compact(totals.likes) },
                { label: "Comments", value: totals.comments, display: compact(totals.comments) },
                { label: "Shares", value: totals.shares, display: compact(totals.shares) },
              ]}
            />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-forest/[0.06] pt-5">
            <div>
              <p className="text-[12.5px] font-medium text-muted">Total views</p>
              <p className="mt-0.5 text-lg font-semibold tracking-[-0.02em] text-forest tabular-nums">{compact(totals.views)}</p>
            </div>
            <div>
              <p className="text-[12.5px] font-medium text-muted">Views per creator</p>
              <p className="mt-0.5 text-lg font-semibold tracking-[-0.02em] text-forest tabular-nums">{compact(totals.creators ? totals.views / totals.creators : 0)}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.65fr_1fr]">
        <Card title="Waiting for your approval" subtitle="Work verified by VGA. Approving releases the payout." action={approvals.length > 0 && viewAll("/dashboard/approvals")} padded={false}>
          {approvals.length ? (
            <ul className="divide-y divide-forest/[0.05]">
              {approvals.slice(0, 4).map((a) => (
                <li key={a.id} className="flex flex-wrap items-center gap-x-4 gap-y-3 px-5 py-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-forest/[0.06] text-[12px] font-semibold text-forest">
                    {a.creatorName.split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-semibold text-forest">{a.creatorName}</span>
                    <span className="block truncate text-[12.5px] font-medium text-muted">{a.description || `Requested ${date(a.createdAt)}`}</span>
                  </span>
                  <span className="text-[14px] font-semibold text-forest tabular-nums">{money(a.amount, a.currency)}</span>
                  <ApprovalButtons approvalId={a.id} label={money(a.amount, a.currency)} />
                </li>
              ))}
            </ul>
          ) : (
            <Empty icon={CheckSquare} title="All caught up" body="New payout requests appear here once VGA has verified the work." />
          )}
        </Card>

        <Card title="Top posts" subtitle="By views, last 30 days" padded={false}>
          {perf?.top?.length ? (
            <ol className="divide-y divide-forest/[0.05]">
              {perf.top.map((p, i) => (
                <li key={p.id} className="flex items-center gap-3 px-5 py-3.5">
                  <span className="w-4 shrink-0 text-[12px] font-semibold text-forest/35 tabular-nums">{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-semibold text-forest">
                      {p.url ? <a href={p.url} target="_blank" rel="noopener noreferrer" className="hover:text-[#9A3412]">{p.title}</a> : p.title}
                    </span>
                    <span className="block truncate text-[12px] font-medium text-muted">
                      {[p.author, PLATFORM[p.platform] || p.platform].filter(Boolean).join(" · ")}
                    </span>
                  </span>
                  <span className="text-[13px] font-semibold text-forest tabular-nums">{compact(p.value)}</span>
                </li>
              ))}
            </ol>
          ) : (
            <Empty icon={PlayCircle} title="No posts tracked yet" body="Posts appear here as creators publish." />
          )}
        </Card>
      </div>

      <div className="mt-6">
        <Card title="Campaigns" subtitle={plural(campaigns.length, "campaign")} action={viewAll("/dashboard/campaigns")} padded={false}>
          <Table head={["Campaign", "Status", "Timeline", "Creators", "Views"]} minWidth="44rem">
            {campaigns.map(({ campaign: c, analytics: a }) => {
              const t = timeline(c);
              return (
                <tr key={c.campaignId} className="transition-colors hover:bg-forest/[0.02]">
                  <td className="px-5 py-3.5">
                    <Link href={`/dashboard/campaigns/${encodeURIComponent(c.campaignId)}`} className="font-semibold text-forest hover:text-[#9A3412]">{c.campaignName}</Link>
                    <span className="block text-[12px] text-forest/45">{date(c.startDate)} – {c.endDate ? date(c.endDate) : "ongoing"}</span>
                  </td>
                  <td className="px-5 py-3.5"><Badge status={c.campaignStatus} /></td>
                  <td className="w-48 px-5 py-3.5">{t === null ? <span className="text-[12.5px] text-forest/45">Ongoing</span> : <Progress value={t} label={`${Math.round(t * 100)}% of campaign dates elapsed`} />}</td>
                  <td className="px-5 py-3.5 font-medium tabular-nums">{a?.totalCreators ?? "—"}</td>
                  <td className="px-5 py-3.5 text-right font-semibold tabular-nums">{compact(a?.totalViews)}</td>
                </tr>
              );
            })}
          </Table>
        </Card>
        <p className="mt-3 text-[12px] font-medium text-forest/45">Performance is tracked by Grade and refreshed regularly. Payouts are only requested after VGA verifies the work.</p>
      </div>
    </>
  );
}

// ---- Creator ----------------------------------------------------------------------

function kycSteps(kyc) {
  const status = kyc?.kycStatus;
  const done = new Set(kyc?.kycCompletedSteps || []);
  const complete = status === "complete";
  return [
    { title: "Invite sent", body: "We email you a secure link from Grade.", done: Boolean(kyc) },
    { title: "Email confirmed", body: "Confirm it's you.", done: complete || ["email_verified", "flow_started", "in_progress"].includes(status) },
    { title: "Identity verified", body: "A quick ID check.", done: complete || done.has("id-verification") },
    { title: "Tax details", body: "So payouts are documented correctly.", done: complete || done.has("compliance") },
  ];
}

async function CreatorOverview({ user }) {
  const email = creatorEmail(user);
  let total, payouts, receipts, kyc;
  try {
    [total, { payouts }, { receipts }, kyc] = await Promise.all([
      grade.creatorTotalPaid(email),
      grade.creatorPayouts(email, { limit: 5 }),
      grade.creatorReceipts(email, { limit: 100 }),
      grade.kycStatus(email),
    ]);
  } catch (err) {
    if (err.status === 404) {
      return (
        <>
          <PageTitle title={`${greeting()}, ${firstName(user)}`} />
          <div className="mt-8"><Card><Empty icon={Clock3} title="No payouts yet" body={`We haven't paid ${email} through VGA yet. Once you're added to a campaign, it shows up here.`} /></Card></div>
        </>
      );
    }
    console.error("[portal] creator overview", err);
    return <><PageTitle title="Overview" /><div className="mt-8"><GradeUnavailable /></div></>;
  }

  const inProgress = payouts.filter((p) => p.status !== "completed");
  const inProgressTotal = inProgress.reduce((t, p) => t + Number(p.amount || 0), 0);
  const lastPaid = receipts.find((r) => r.status === "PAID");
  const months = earningsByMonth(receipts);
  const receiptCurrency = receipts[0]?.currency || "USD";
  const steps = kycSteps(kyc);
  const stepsDone = steps.filter((s) => s.done).length;
  const verified = kyc?.kycStatus === "complete";
  const paidValue = total?.preferredCurrency && total.spentAmountPreferred ? money(total.spentAmountPreferred, total.preferredCurrency) : money(total?.spentAmountUSD, "USD");

  return (
    <>
      <PageTitle title={`${greeting()}, ${firstName(user)}`} intro="Your campaigns, payouts and verification in one place." />

      {!verified && (
        <div className="relative mt-6 flex flex-wrap items-center justify-between gap-4 overflow-hidden rounded-2xl bg-gradient-to-r from-forest to-emerald p-5 text-soft">
          <div className="pointer-events-none absolute -right-10 -bottom-16 size-48 rounded-full bg-orange/20 blur-3xl" aria-hidden="true" />
          <p className="relative flex items-center gap-3 text-[14.5px] font-medium">
            <ShieldCheck className="size-5 shrink-0 text-orange" aria-hidden="true" />
            <span><span className="font-semibold">Verify once, get paid without delays.</span> <span className="text-soft/70">{stepsDone} of {steps.length} steps done.</span></span>
          </p>
          <span className="relative"><ButtonLink href="/dashboard/verification" variant="orange">Continue verification <ArrowRight className="size-4" aria-hidden="true" /></ButtonLink></span>
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat dark icon={Wallet} label="Total paid" value={paidValue} hint={total?.spentAmountUSD ? `${money(total.spentAmountUSD, "USD")} equivalent` : undefined} />
        <Stat icon={Clock3} label="On the way" value={inProgressTotal ? money(inProgressTotal, inProgress[0]?.currency || "USD") : "—"} hint={inProgress.length ? plural(inProgress.length, "payout") + " processing" : "Nothing processing"} />
        <Stat icon={CalendarClock} label="Last payout" value={lastPaid ? money(lastPaid.earningsValue, lastPaid.currency) : "—"} hint={lastPaid ? `${date(lastPaid.payoutDate)} · ${lastPaid.campaignName}` : "No payouts yet"} />
        <Stat icon={BadgeCheck} label="Verification" value={verified ? "Verified" : `${stepsDone} of ${steps.length}`} hint={verified ? "You're ready to be paid" : "Steps complete"} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.65fr_1fr]">
        <Card title="Earnings" subtitle="Paid out per month, last 6 months" divided={false}>
          <ColumnChart bars={months} label="Earnings per month, last 6 months" format={`currency:${receiptCurrency}`} />
        </Card>
        <Card title="Verification" subtitle={verified ? "Complete" : "Required before your first payout"} action={!verified && viewAll("/dashboard/verification", "Open")}>
          <ol className="relative space-y-4">
            {steps.map((s, i) => (
              <li key={s.title} className="relative flex gap-3">
                {i < steps.length - 1 && <span className={`absolute top-8 bottom-[-1rem] left-[0.9rem] w-px ${s.done ? "bg-forest/30" : "bg-forest/10"}`} aria-hidden="true" />}
                <span className={s.done ? "relative grid size-7 shrink-0 place-items-center rounded-full bg-forest text-orange" : "relative grid size-7 shrink-0 place-items-center rounded-full border border-dashed border-forest/25 bg-white text-[11px] font-semibold text-forest/45"}>
                  {s.done ? <BadgeCheck className="size-3.5" aria-hidden="true" /> : i + 1}
                </span>
                <span className="pt-0.5">
                  <span className={`block text-[13.5px] font-semibold ${s.done ? "text-forest" : "text-forest/60"}`}>{s.title}<span className="sr-only">{s.done ? " (done)" : " (to do)"}</span></span>
                  <span className="block text-[12.5px] font-medium text-muted">{s.body}</span>
                </span>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <div className="mt-6">
        <Card title="Recent payouts" action={viewAll("/dashboard/payouts")} padded={false}>
          {payouts.length ? (
            <Table head={["Campaign", "Date", "Status", "Amount"]} minWidth="30rem">
              {payouts.map((p) => (
                <tr key={p.payoutId} className="transition-colors hover:bg-forest/[0.02]">
                  <td className="px-5 py-3.5 font-semibold text-forest">{p.campaignName || "Direct payout"}</td>
                  <td className="px-5 py-3.5 text-forest/60">{date(p.createdAt || p.payoutDate)}</td>
                  <td className="px-5 py-3.5"><Badge status={p.status} /></td>
                  <td className="px-5 py-3.5 text-right font-semibold tabular-nums">{p.amount != null ? money(p.amount, p.currency) : "—"}</td>
                </tr>
              ))}
            </Table>
          ) : (
            <Empty icon={Sparkles} title="No payouts yet" body="Payouts appear here once your work is verified and approved." />
          )}
        </Card>
        <p className="mt-3 flex items-center gap-1.5 text-[12px] font-medium text-forest/45">
          <ArrowUpRight className="size-3.5" aria-hidden="true" /> Receipts for every payout are on the Receipts page.
        </p>
      </div>
    </>
  );
}

export default async function DashboardPage() {
  const user = await requireUser();
  if (!canSeeData(user)) return <Waiting user={user} />;
  return user.type === "client" ? <ClientOverview user={user} /> : <CreatorOverview user={user} />;
}

import { BadgeCheck, Check, Clock3, ShieldCheck } from "lucide-react";
import { requirePortal } from "../guard";
import * as grade from "@/lib/grade/client";
import { creatorEmail, date } from "@/lib/portal";
import { Badge, Card, GradeUnavailable, PageTitle } from "@/components/portal/ui";
import { VerificationButton } from "@/components/portal/Actions";

export const metadata = { title: "Verification" };

const STEPS = [
  { id: "id-verification", title: "Identity", body: "A quick ID check, handled securely by Grade." },
  { id: "compliance", title: "Compliance", body: "Tax and payout details so payments go through first time." },
];

export default async function VerificationPage() {
  const user = await requirePortal("creator");
  const email = creatorEmail(user);
  let kyc;
  try {
    kyc = await grade.kycStatus(email);
  } catch (err) {
    console.error("[portal] kyc", err);
    return <><PageTitle title="Verification" /><div className="mt-8"><GradeUnavailable /></div></>;
  }
  const complete = kyc?.kycStatus === "complete";
  const done = new Set(kyc?.kycCompletedSteps || []);

  return (
    <>
      <PageTitle title="Verification" intro="VGA verifies every creator before paying them. It takes a few minutes and you only do it once." />
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card title="Your status" action={kyc ? <Badge status={kyc.kycStatus} /> : <Badge status="none">Not started</Badge>}>
          {complete ? (
            <p className="flex items-center gap-3 text-[15px] font-semibold text-forest"><BadgeCheck className="size-6 text-[#9A3412]" aria-hidden="true" /> You&apos;re verified. Nothing else to do.</p>
          ) : (
            <>
              <ol className="space-y-4">
                {STEPS.map((s) => (
                  <li key={s.id} className="flex gap-4">
                    <span className={done.has(s.id) ? "grid size-8 shrink-0 place-items-center rounded-full bg-forest text-orange" : "grid size-8 shrink-0 place-items-center rounded-full border border-dashed border-orange text-[#9A3412]"}>
                      {done.has(s.id) ? <Check className="size-4" aria-hidden="true" /> : <Clock3 className="size-4" aria-hidden="true" />}
                    </span>
                    <span><span className="block text-[14.5px] font-semibold text-forest">{s.title}</span><span className="block text-[13px] font-medium text-forest/55">{s.body}</span></span>
                  </li>
                ))}
              </ol>
              <div className="mt-6 border-t border-forest/[0.06] pt-5">
                {kyc?.inviteSentAt && <p className="mb-3 text-[13px] font-medium text-forest/55">Invite sent to {email} on {date(kyc.inviteSentAt)}{kyc.inviteExpiresAt ? `, valid until ${date(kyc.inviteExpiresAt)}` : ""}.</p>}
                <VerificationButton again={Boolean(kyc)} />
              </div>
            </>
          )}
        </Card>
        <Card title="Why we ask">
          <ul className="space-y-3 text-[13.5px] font-medium text-forest/65">
            <li className="flex gap-2.5"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#9A3412]" aria-hidden="true" /> Brands only work with creators who are who they say they are.</li>
            <li className="flex gap-2.5"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#9A3412]" aria-hidden="true" /> It keeps payouts compliant and on time.</li>
            <li className="flex gap-2.5"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#9A3412]" aria-hidden="true" /> Your documents go to Grade, our payments partner. VGA never stores them.</li>
          </ul>
        </Card>
      </div>
    </>
  );
}

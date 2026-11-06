import { pageMeta } from "@/lib/seo";
import { ArrowRight, EyeOff, FileLock2, KeyRound, Lock } from "lucide-react";
import PageHero from "@/components/PageHero";
import StatusPanel from "@/components/StatusPanel";
import Section from "@/components/Section";
import SectionHeader from "@/components/SectionHeader";
import ComplianceGrid from "@/components/ComplianceGrid";
import IconCards from "@/components/IconCards";
import Reveal from "@/components/Reveal";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";

export const metadata = pageMeta({
  title: "Creator KYC, Compliance & Trust",
  description:
    "KYC, creator verification, brand safety, payment records and audit-friendly reporting. How Value Grade Agency builds creator marketing that finance, legal and compliance teams can sign off on.",
  path: "/compliance",
});

const trail = ["Agreed deliverable", "Published content", "Verified performance", "Matched invoice", "Approved payout", "Recorded receipt"];

const commitments = [
  { icon: EyeOff, title: "Confidential by default", body: "Client names, budgets, results and strategy are never published without written approval." },
  { icon: Lock, title: "Least-access data handling", body: "Personal and payment data is accessed only by the people who need it to run the campaign." },
  { icon: FileLock2, title: "Documented approvals", body: "Who approved what, and when, is recorded at every stage of the cycle." },
  { icon: KeyRound, title: "Secure systems", body: "Credentials and integrations are kept server-side and never exposed in public channels." },
];

const faqs = [
  {
    q: "What does creator KYC involve?",
    a: "Creators and partners confirm their identity and account ownership before onboarding. The exact checks depend on the campaign and the client's requirements.",
  },
  {
    q: "Can you work within our internal compliance policies?",
    a: "Yes. We map campaign approvals, disclosures and documentation to your policies during the briefing stage.",
  },
  {
    q: "What records will our finance team receive?",
    a: "Records connect each payout to the agreement, the verified delivery, the approved invoice and the payment receipt, organised so they can be reviewed or audited.",
  },
];

export default function CompliancePage() {
  return (
    <>
      <PageHero
        path="/compliance"
        crumb="Compliance & Trust"
        eyebrow="Growth with guardrails"
        title="Creator marketing your finance team will [sign off] on"
        intro="Verification, approvals and records are built into every step, so every payout traces back to a verified deliverable."
        aside={
          <StatusPanel
            title="Compliance status"
            meta="Partner #P-318"
            rows={[
              ["Identity verified", "KYC"],
              ["Account ownership", "Verified"],
              ["Brand-safety review", "Cleared"],
              ["Tax documentation", "On file"],
              ["Disclosure guidance", "Acknowledged"],
            ]}
            footer="Illustrative example"
          />
        }
      />

      <Section tone="cream">
        <SectionHeader tone="light" eyebrow="Our framework" title="Eight controls built into [every] campaign" />
        <ComplianceGrid />
      </Section>

      <Section id="audit-trail">
        <SectionHeader eyebrow="The audit trail" title="Every payout, traced back to [proof]" intro="Nothing is paid without evidence behind it." />
        <Reveal className="mt-12 lg:mt-16">
          <ol className="grid gap-3 md:grid-cols-6">
            {trail.map((t, i) => (
              <li key={t} className="relative flex items-center gap-3 rounded-card bg-forest p-5 last:bg-orange md:min-h-40 md:flex-col md:items-start md:justify-between [&:last-child>span]:text-ink">
                <span className="font-mono text-2xl font-medium text-orange">0{i + 1}</span>
                <span className="text-sm font-bold text-soft">{t}</span>
                {i < trail.length - 1 && (
                  <ArrowRight className="absolute top-1/2 -right-3 z-10 hidden size-5 -translate-y-1/2 rounded-full bg-ink p-0.5 text-orange md:block" aria-hidden="true" />
                )}
              </li>
            ))}
          </ol>
        </Reveal>
      </Section>

      <Section tone="dark" texture="corner">
        <SectionHeader tone="dark" eyebrow="Data & confidentiality" title="How we protect your [information]" />
        <IconCards tone="dark" items={commitments} columns={4} className="mt-12 lg:mt-16" />
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader eyebrow="FAQ" title="Compliance questions, [answered]" />
          <Reveal>
            <FAQ items={faqs} />
          </Reveal>
        </div>
      </Section>

      <FinalCTA title="Talk to us about your [compliance] requirements" />
    </>
  );
}

import { pageMeta } from "@/lib/seo";
import { BarChart3, Building2, FileCheck2, Landmark, Megaphone, ShieldCheck, Target, Users, Wallet } from "lucide-react";
import PageHero from "@/components/PageHero";
import StatusPanel from "@/components/StatusPanel";
import Section from "@/components/Section";
import SectionHeader from "@/components/SectionHeader";
import IconCards from "@/components/IconCards";
import ComparisonTable from "@/components/ComparisonTable";
import CheckList from "@/components/CheckList";
import Reveal from "@/components/Reveal";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";

export const metadata = pageMeta({
  title: "Influencer & Creator Marketing for Brands",
  description:
    "Creator and influencer campaigns for brands that need agreed deliverables, verified performance, transparent reporting and audit-ready payouts. Built for telecoms, banks, fintech and FMCG.",
  path: "/for-brands",
});

const outcomes = [
  { icon: Target, title: "Campaigns built on outcomes", body: "Planned around the KPIs you report on." },
  { icon: Users, title: "The right creators, verified", body: "Matched on audience fit and checked before go-live." },
  { icon: FileCheck2, title: "Deliverables in writing", body: "Every post and usage right agreed upfront." },
  { icon: BarChart3, title: "Reporting you can defend", body: "Verified analytics, not screenshots." },
  { icon: Wallet, title: "One invoice, organised payouts", body: "Creators paid against approved delivery, with records." },
  { icon: ShieldCheck, title: "Brand safety by default", body: "Content and creators screened against your guardrails." },
];

const faqs = [
  {
    q: "What kind of brands does VGA work with?",
    a: "We are built for brands that need accountability in creator marketing, including telecoms operators, banks, fintech companies, FMCG brands and large consumer businesses operating in African markets.",
  },
  {
    q: "Do we approve the creators and the content?",
    a: "Yes. You approve the creator shortlist and content goes through an agreed review step before it is published. Approvals are logged so there is a clear record of who signed off and when.",
  },
  {
    q: "How do you report results?",
    a: "Results are tracked against the deliverables and KPIs agreed at the start, verified through analytics, and shared in a structured report covering delivery, performance and spend.",
  },
];

export default function ForBrandsPage() {
  return (
    <>
      <PageHero
        path="/for-brands"
        crumb="For Brands"
        eyebrow="For marketing, brand and growth teams"
        title="Creator campaigns your whole business can [stand behind]"
        intro="We agree the deliverables, verify the creators and the results, and pay partners against proof. Every naira is accounted for."
        aside={
          <StatusPanel
            title="Campaign checklist"
            meta="Q4 · Launch"
            rows={[
              ["Brief approved by brand", "Done"],
              ["24 creators verified", "Verified"],
              ["Deliverables agreed", "Agreed"],
              ["Content review", "In review", "orange"],
              ["Verified report", "Scheduled", "muted"],
            ]}
            footer="Illustrative example"
          />
        }
      />

      <Section>
        <SectionHeader eyebrow="Benefits" title="What brands [get]" />
        <IconCards items={outcomes} className="mt-12 lg:mt-16" />
      </Section>

      <Section tone="cream">
        <SectionHeader tone="light" eyebrow="Compare" title="Why brands choose [VGA]" />
        <Reveal className="mt-12 lg:mt-16">
          <ComparisonTable />
        </Reveal>
      </Section>

      <Section id="enterprise">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeader
              eyebrow="For enterprises"
              title="Enterprise programmes designed for [scale] and scrutiny"
              intro="Creator programmes built to pass procurement, legal, compliance and finance."
            />
            <Reveal delay={0.1}>
              <CheckList
                className="mt-8"
                items={[
                  "Programmes across brands, products or regions",
                  "Creator KYC and documentation support",
                  "Approvals mapped to your sign-off chain",
                  "Audit-ready payout records and reporting",
                ]}
              />
            </Reveal>
          </div>
          <Reveal delay={0.1} className="grid grid-cols-2 gap-4">
            {[
              { icon: Landmark, label: "Banking & fintech" },
              { icon: Building2, label: "Telecoms" },
              { icon: Megaphone, label: "FMCG" },
              { icon: Users, label: "Large enterprise" },
            ].map(({ icon: Icon, label }, i) => (
              <div key={label} className={`flex aspect-square flex-col justify-between rounded-card p-6 ${i === 0 || i === 3 ? "bg-forest text-soft" : "bg-white text-forest"}`}>
                <Icon className="size-8 text-orange" aria-hidden="true" />
                <p className="display text-xl leading-7 md:text-2xl md:leading-8">{label}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </Section>

      <Section tone="cream">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader eyebrow="FAQ" title="Brand questions, [answered]" />
          <Reveal>
            <FAQ items={faqs} />
          </Reveal>
        </div>
      </Section>

      <FinalCTA />
    </>
  );
}

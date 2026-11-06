import { pageMeta } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import StatusPanel from "@/components/StatusPanel";
import Section from "@/components/Section";
import SectionHeader from "@/components/SectionHeader";
import Reveal from "@/components/Reveal";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import { cycle } from "@/lib/content";

export const metadata = pageMeta({
  title: "How Our Creator Campaigns Work",
  description:
    "The Value Grade Cycle: eight steps from brand brief to verified payout. See how VGA matches creators, agrees deliverables, verifies performance and pays partners against proof.",
  path: "/how-it-works",
});

// Per-step detail for the full cycle on this page.
const detail = [
  { output: "Signed-off campaign brief with KPIs and guardrails" },
  { output: "Verified creator shortlist with fit rationale" },
  { output: "Agreements, approved content, published posts" },
  { output: "Performance checked against agreed deliverables" },
  { output: "Invoices matched to verified delivery and approved" },
  { output: "Payouts released with receipts on file" },
  { output: "Campaign report on delivery, performance and spend" },
  { output: "Recommendations that shape the next brief" },
];

const roles = [
  { role: "Brand or agency", items: ["Sets objectives and guardrails", "Approves creators and content", "Approves invoices"] },
  { role: "Value Grade Agency", items: ["Runs the campaign cycle", "Verifies creators and results", "Administers payouts and records"] },
  { role: "Creators & partners", items: ["Complete verification", "Deliver agreed content", "Get paid against proof"] },
];

const faqs = [
  {
    q: "How long does a typical campaign take to set up?",
    a: "It depends on the scale, the number of creators and your internal approval process. We agree a timeline with you during the briefing stage, before any creator is contracted.",
  },
  {
    q: "What do you need from us to start?",
    a: "Your objectives, target audience, timelines, a budget range and any brand or compliance guidelines. We can work from an existing brief or help you build one.",
  },
  {
    q: "What happens if a creator doesn't deliver?",
    a: "Payouts are tied to verified, approved delivery. If deliverables aren't met, the agreement sets out what happens next, and we work to replace or recover the activity.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        path="/how-it-works"
        crumb="How It Works"
        eyebrow="The Value Grade Cycle"
        title="From brand brief to [verified] payout"
        intro="Find, agree, execute, measure. Eight clear steps, each with an owner, an output and a record."
        aside={
          <StatusPanel
            title="Cycle progress"
            meta="Campaign #Q4-07"
            rows={[
              ["01 Brand Brief", "Done"],
              ["02 Creator Matching", "Done"],
              ["03 Campaign Execution", "Done"],
              ["04 Analytics Verification", "In progress", "orange"],
              ["05 Invoice & Approval", "Next", "muted"],
            ]}
            footer="Illustrative example"
          />
        }
      />

      <Section>
        <SectionHeader eyebrow="The campaign cycle" title="Eight steps, from brief to [payout]" />
        <ol className="relative mt-12 lg:mt-16 grid gap-5 before:absolute before:top-2 before:bottom-2 before:left-[23px] before:w-px before:bg-gradient-to-b before:from-orange before:via-forest/20 before:to-transparent md:before:left-1/2">
          {cycle.map((step, i) => {
            const Icon = step.icon;
            const right = i % 2 === 1;
            return (
              <Reveal as="li" key={step.title} className="relative grid gap-4 pl-16 md:grid-cols-2 md:gap-16 md:pl-0">
                <span className="absolute top-0 left-0 z-10 grid size-12 place-items-center rounded-2xl bg-forest text-orange shadow-[0_0_0_6px_var(--color-soft)] md:left-1/2 md:-translate-x-1/2">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div className={right ? "md:col-start-2" : "md:text-right"}>
                  <div className={`rounded-card bg-white p-7 ${right ? "" : "md:ml-auto"} max-w-lg`}>
                    <p className="font-mono text-xs font-medium tracking-wider text-orange-deep">STEP 0{i + 1}</p>
                    <h3 className="display mt-2 text-xl leading-7 text-forest md:text-2xl md:leading-8">{step.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed font-medium text-forest/70">{step.body}</p>
                    <dl className={`mt-5 grid gap-2 border-t border-forest/10 pt-4 text-xs ${right ? "" : "md:justify-items-end"}`}>
                      <div className="flex gap-2"><dt className="font-bold text-forest/45">Output:</dt><dd className="font-semibold text-forest/80">{detail[i].output}</dd></div>
                    </dl>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </Section>

      <Section tone="cream">
        <SectionHeader tone="light" eyebrow="Roles" title="Everyone knows [their part]" />
        <div className="mt-12 lg:mt-16 grid gap-4 md:grid-cols-3">
          {roles.map((r, i) => (
            <Reveal key={r.role} delay={i * 0.08} className={`rounded-card p-8 ${i === 1 ? "bg-forest text-soft" : "bg-white text-forest"}`}>
              <p className={`font-mono text-xs tracking-wider uppercase ${i === 1 ? "text-orange" : "text-forest/50"}`}>{r.role}</p>
              <ul className="mt-6 grid gap-3">
                {r.items.map((it) => (
                  <li key={it} className={`border-b pb-3 text-base font-semibold last:border-0 ${i === 1 ? "border-soft/10" : "border-forest/10"}`}>{it}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader eyebrow="FAQ" title="Process questions, [answered]" />
          <Reveal>
            <FAQ items={faqs} />
          </Reveal>
        </div>
      </Section>

      <FinalCTA />
    </>
  );
}

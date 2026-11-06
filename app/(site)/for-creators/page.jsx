import { pageMeta } from "@/lib/seo";
import { BadgeCheck, CalendarCheck, FileSignature, MessageSquareText, Receipt, Wallet } from "lucide-react";
import PageHero from "@/components/PageHero";
import StatusPanel from "@/components/StatusPanel";
import Section from "@/components/Section";
import SectionHeader from "@/components/SectionHeader";
import IconCards from "@/components/IconCards";
import Button from "@/components/Button";
import Reveal from "@/components/Reveal";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";

export const metadata = pageMeta({
  title: "Paid Brand Campaigns for Creators & Influencers",
  description:
    "Work with serious brands through Value Grade Agency. Clear briefs, written agreements, structured approvals and payouts on record for creators, influencers and performance partners.",
  path: "/for-creators",
});

const promises = [
  { icon: MessageSquareText, title: "Clear briefs", body: "Know exactly what the brand wants before you start." },
  { icon: FileSignature, title: "Written agreements", body: "Deliverables and fees in writing. No moving goalposts." },
  { icon: CalendarCheck, title: "Structured approvals", body: "One review process with clear feedback." },
  { icon: Wallet, title: "Organised payouts", body: "Paid against approved delivery, every time." },
  { icon: BadgeCheck, title: "Verified profile", body: "Stand out to brands that value trust." },
  { icon: Receipt, title: "Records you can use", body: "Receipts for your bookkeeping and tax." },
];

const steps = [
  ["Apply", "Tell us about your platforms and audience."],
  ["Get verified", "Complete quick identity and account checks."],
  ["Get matched", "We bring you briefs that fit your audience."],
  ["Agree & create", "Sign, create and submit for review."],
  ["Get paid", "Payout released once delivery is verified."],
];

const faqs = [
  {
    q: "Who can join the VGA creator network?",
    a: "Creators, influencers and performance partners who produce consistent, brand-safe content and are willing to complete verification. Audience size matters less than audience quality and fit.",
  },
  {
    q: "Why do I need to complete KYC?",
    a: "Our clients include regulated businesses such as banks and fintechs. Verification protects them, and it protects you by making sure payouts reach the right person.",
  },
  {
    q: "When do I get paid?",
    a: "Payout timing is set out in your agreement for each campaign. Payment is released once your deliverables are verified and approved.",
  },
];

export default function ForCreatorsPage() {
  return (
    <>
      <PageHero
        path="/for-creators"
        crumb="For Creators"
        eyebrow="For creators, influencers and partners"
        title="Work with serious brands, on [clear terms]"
        intro="Structured campaigns with written deliverables, fair agreements and payouts on record. You focus on the content."
        ctas={
          <>
            <Button href="/onboarding?as=creator" variant="primary" size="lg" arrow>Create a creator account</Button>
            <Button href="/contact?intent=creator" variant="ghostDark" size="lg">Join the Creator Network</Button>
          </>
        }
        aside={
          <StatusPanel
            title="Your campaign"
            meta="Creator view"
            rows={[
              ["Agreement signed", "Agreed"],
              ["Content submitted", "Approved"],
              ["Deliverables verified", "Verified"],
              ["Payout", "Released", "orange"],
            ]}
            footer="Illustrative example"
          />
        }
      />

      <Section>
        <SectionHeader eyebrow="Why VGA" title="What you [get]" />
        <IconCards items={promises} className="mt-12 lg:mt-16" />
      </Section>

      <Section tone="dark" texture="corner" id="how">
        <SectionHeader tone="dark" eyebrow="How it works" title="From application to payout in [five] steps" />
        <ol className="mt-12 lg:mt-16 grid gap-4 md:grid-cols-5">
          {steps.map(([title, body], i) => (
            <Reveal as="li" key={title} delay={i * 0.07} className="relative flex min-h-[220px] flex-col rounded-card border border-soft/10 bg-ink/50 p-6">
              <span className="font-mono text-3xl font-medium text-orange">0{i + 1}</span>
              <h3 className="mt-auto pt-8 text-lg font-semibold text-soft">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed font-medium text-soft/65">{body}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader eyebrow="FAQ" title="Creator questions, [answered]" />
          <Reveal>
            <FAQ items={faqs} />
          </Reveal>
        </div>
      </Section>

      <FinalCTA
        title="Ready to work on campaigns that [pay properly?]"
        body="Tell us about your platforms and audience. If there's a fit, we'll be in touch about verification and upcoming briefs."
        actions={<Button href="/contact?intent=creator" variant="primaryOnDark" size="lg" arrow>Join the Creator Network</Button>}
      />
    </>
  );
}

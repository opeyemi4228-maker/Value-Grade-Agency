import { pageMeta } from "@/lib/seo";
import { BarChart3, Clock, FileCheck2, Fingerprint, Handshake, Layers, Users, Wallet } from "lucide-react";
import PageHero from "@/components/PageHero";
import StatusPanel from "@/components/StatusPanel";
import Section from "@/components/Section";
import SectionHeader from "@/components/SectionHeader";
import IconCards from "@/components/IconCards";
import CheckList from "@/components/CheckList";
import Reveal from "@/components/Reveal";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";

export const metadata = pageMeta({
  title: "Creator Campaign Delivery Partner for Agencies",
  description:
    "A creator campaign delivery partner for marketing agencies. VGA handles creator matching, KYC, approvals, payouts and verified reporting while you own the client relationship.",
  path: "/for-agencies",
});

const handled = [
  { icon: Users, title: "Creator sourcing & matching", body: "Verified shortlists, ready for your review." },
  { icon: FileCheck2, title: "Agreements & deliverables", body: "Contracts and timelines documented and tracked." },
  { icon: Fingerprint, title: "KYC & verification", body: "Identity checks before anyone is onboarded." },
  { icon: Clock, title: "Execution & approvals", body: "Drafts, reviews and go-live in one flow." },
  { icon: Wallet, title: "Payout administration", body: "Payouts against approved delivery, with receipts." },
  { icon: BarChart3, title: "Verified reporting", body: "Reports you can put in front of your client." },
];

const faqs = [
  {
    q: "Will VGA contact our clients directly?",
    a: "Only if you want us to. We can work entirely behind your agency, or alongside your team in client meetings. The engagement model is agreed at the start.",
  },
  {
    q: "How do you handle creator payments for our clients?",
    a: "We administer creator payouts against verified, approved delivery and keep records for every transaction, so you have a clean trail for client billing and audits.",
  },
  {
    q: "Can we use VGA for just one part of the process?",
    a: "Yes. Some agencies use us end to end; others use us only for verification, payouts or reporting. We will scope around what you need.",
  },
];

export default function ForAgenciesPage() {
  return (
    <>
      <PageHero
        path="/for-agencies"
        crumb="For Agencies"
        eyebrow="For marketing, media and PR agencies"
        title="Your creator campaign [delivery partner]"
        intro="We run creator execution, verification, payouts and reporting. You keep the strategy and the client."
        aside={
          <StatusPanel
            title="Client: Retail Bank (example)"
            meta="Agency view"
            rows={[
              ["Creator shortlist sent to agency", "Sent"],
              ["Client approval received", "Approved"],
              ["Creator KYC", "Verified"],
              ["Payout batch #14", "Pending approval", "orange"],
            ]}
            footer="Illustrative example"
          />
        }
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader eyebrow="The split" title="You lead. We [deliver.]" intro="Your clients stay your clients. Nothing is published without your written approval." />
          </div>
          <Reveal delay={0.1} className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-card bg-forest p-7 text-soft">
              <p className="flex items-center gap-2 font-mono text-xs tracking-wider text-soft/55 uppercase"><Handshake className="size-4 text-orange" aria-hidden="true" /> Your agency</p>
              <CheckList tone="dark" className="mt-6" items={["Client relationship", "Campaign strategy", "Creative direction", "Final sign-off"]} />
            </div>
            <div className="rounded-card bg-ink p-7 text-soft ring-2 ring-orange">
              <p className="flex items-center gap-2 font-mono text-xs tracking-wider text-orange uppercase"><Layers className="size-4" aria-hidden="true" /> VGA</p>
              <CheckList tone="dark" className="mt-6" items={["Creator matching & KYC", "Agreements & approvals", "Payout administration", "Verified reporting"]} />
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tone="dark" texture="corner">
        <SectionHeader tone="dark" eyebrow="Services" title="What we [handle]" />
        <IconCards tone="dark" items={handled} className="mt-12 lg:mt-16" />
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader eyebrow="FAQ" title="Agency questions, [answered]" />
          <Reveal>
            <FAQ items={faqs} />
          </Reveal>
        </div>
      </Section>

      <FinalCTA title="Let's talk about your next [creator brief]" />
    </>
  );
}

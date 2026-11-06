import Hero from "@/components/home/Hero";
import IndustryCards from "@/components/home/IndustryCards";
import SolutionSteps from "@/components/home/SolutionSteps";
import ServiceCards from "@/components/home/ServiceCards";
import AudienceCarousel from "@/components/home/AudienceCarousel";
import ComplianceFeatures from "@/components/home/ComplianceFeatures";
import Section from "@/components/Section";
import SectionHeader from "@/components/SectionHeader";
import CycleTimeline from "@/components/CycleTimeline";
import FinalCTA from "@/components/FinalCTA";
import Button from "@/components/Button";
import Reveal from "@/components/Reveal";
import { problems, services as serviceList } from "@/lib/content";
import { proposalUrl, site } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

// Layout follows usegrade.com's flow (split hero, card strip, tabbed walkthrough, product cards,
// carousel, feature grid, centred CTA), filled with the brief's §8 sections and VGA's own identity:
// dark-green hero and panels, orange accents, cream bands and the 8-step campaign cycle.
// All dashboard figures are placeholder data (brief §13).
function More({ href, label, tone = "light" }) {
  return (
    <Reveal className="mt-12 flex justify-center">
      <Button href={href} variant={tone === "dark" ? "ghostLight" : "ghostDark"} arrow>{label}</Button>
    </Reveal>
  );
}

export const metadata = pageMeta({
  title: "Value Grade Agency | Influencer & Creator Campaign Management in Nigeria",
  absoluteTitle: true,
  description:
    "Value Grade Agency runs creator, influencer, affiliate and performance-partner campaigns for brands and agencies in Nigeria and Africa, with KYC-checked creators, verified results, clear reporting and structured payouts.",
  path: "/",
  keywords: [
    "influencer marketing agency Nigeria",
    "creator campaign management",
    "influencer marketing Lagos",
    "performance marketing agency Africa",
    "affiliate marketing Nigeria",
    "creator payouts",
    "influencer KYC verification",
  ],
});

const servicesJsonLd = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  name: "Value Grade Agency services",
  itemListElement: serviceList.map((s, i) => ({
    "@type": "Offer",
    position: i + 1,
    itemOffered: { "@type": "Service", name: s.title, description: s.body, provider: { "@id": `${site.url.replace(/\/$/, "")}/#organization` }, areaServed: "Nigeria" },
  })),
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <IndustryCards />

      {/* Problem */}
      <section className="gutter pt-8 pb-24 sm:pb-32">
        <SectionHeader align="center" eyebrow="The problem" title="Influencer marketing has a [trust] problem" />
        <div className="mx-auto mt-12 grid max-w-6xl gap-4 md:grid-cols-3 lg:mt-16">
          {problems.map(({ icon: Icon, title, body }, i) => (
            <Reveal key={title} delay={i * 0.08} className="rounded-card bg-white p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <span className="grid size-12 place-items-center rounded-2xl bg-forest text-orange"><Icon className="size-5" aria-hidden="true" /></span>
                <span className="font-mono text-xs font-medium text-forest/30">0{i + 1}</span>
              </div>
              <h3 className="display mt-6 text-xl leading-7 text-forest md:text-2xl md:leading-8">{title}</h3>
              <p className="mt-3 leading-relaxed font-medium text-forest/70">{body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Solution: tabbed walkthrough */}
      <Section tone="cream" id="solution">
        <SectionHeader
          align="center"
          eyebrow="The solution"
          title="One structured environment for campaigns, creators, payments, and [proof]"
        />
        <SolutionSteps />
      </Section>

      {/* Services: product cards */}
      <Section id="services">
        <SectionHeader align="center" eyebrow="Services" title="What Value Grade Agency [does]" />
        <ServiceCards />
        <More href={proposalUrl} label="Request a Proposal" />
      </Section>

      {/* Who we serve: carousel */}
      <Section tone="cream" id="who-we-serve">
        <SectionHeader align="center" eyebrow="Who we serve" title="Built for everyone [accountable] for creator spend" />
        <AudienceCarousel />
      </Section>

      {/* Process: VGA's own 8-step cycle */}
      <Section tone="dark" texture="corner" id="process">
        <SectionHeader align="center" tone="dark" eyebrow="The process" title="A clear campaign [cycle]" intro="Eight steps, from brief to optimisation." />
        <CycleTimeline compact />
        <More href="/how-it-works" label="See every step" tone="dark" />
      </Section>

      {/* Compliance: feature grid */}
      <Section id="compliance">
        <SectionHeader
          align="center"
          eyebrow="Compliance"
          title="Built for trust, accountability, and clear [reporting]"
          intro="Every payout is traced back to a verified deliverable."
        />
        <ComplianceFeatures />
        <More href="/compliance" label="Compliance & Trust" />
      </Section>

      <FinalCTA />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }} />
    </>
  );
}

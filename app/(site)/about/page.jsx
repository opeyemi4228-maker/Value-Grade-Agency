import { pageMeta } from "@/lib/seo";
import { Globe2 } from "lucide-react";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import SectionHeader from "@/components/SectionHeader";
import IconCards from "@/components/IconCards";
import CheckList from "@/components/CheckList";
import Reveal from "@/components/Reveal";
import Eyebrow from "@/components/Eyebrow";
import FinalCTA from "@/components/FinalCTA";
import { values } from "@/lib/content";

export const metadata = pageMeta({
  title: "About Value Grade Agency",
  description:
    "Value Grade Agency is a performance marketing and creator campaign management agency bringing structure, verification and transparency to creator marketing in African markets.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        path="/about"
        crumb="About"
        eyebrow="About Value Grade Agency"
        title="We exist to make creator marketing [accountable]"
        intro="Value Grade Agency (VGA) is a performance marketing and creator campaign management agency. We run creator, influencer, affiliate and partner campaigns with clear deliverables, verified results and organised payouts."
      />

      <Section tone="cream">
        <Reveal className="mx-auto max-w-4xl text-center">
          <Eyebrow align="center">Our belief</Eyebrow>
          <p className="display mt-6 text-2xl leading-8 text-forest md:text-3xl md:leading-10 lg:text-4xl lg:leading-[44px]">
            Creator marketing works. It just needs the same <span className="mark-line">structure, proof and accountability</span> as every other line in the budget.
          </p>
        </Reveal>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <SectionHeader
            eyebrow="Why we started"
            title="Too much spend, too little [proof]"
          />
          <Reveal delay={0.1} className="grid gap-5 text-lg leading-relaxed font-medium text-forest/75">
            <p>
              Brands across Africa spend more on creators every year, yet much of it still runs on chat-thread agreements, screenshot reports and payments that are hard to trace. That is hard to defend to finance and compliance teams.
            </p>
            <p className="font-bold text-forest">
              VGA was built to fix that: one structured, accountable process from brief to payout.
            </p>
          </Reveal>
        </div>
      </Section>

      <Section tone="dark" texture="corner">
        <SectionHeader tone="dark" eyebrow="What we stand for" title="Four principles behind [every] campaign" />
        <IconCards tone="dark" items={values} columns={4} className="mt-12 lg:mt-16" />
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeader
              eyebrow="African-market aware"
              title="Built for the [markets] we work in"
              intro="We know the platforms, creators, payment methods and regulations of the markets we work in."
            />
            <Reveal delay={0.1}>
              <CheckList
                className="mt-8"
                items={[
                  "Creator networks across key categories and platforms",
                  "Campaigns designed for local audiences and cultural moments",
                  "Processes that fit regulated industries",
                  "Payout administration with clear records",
                ]}
              />
            </Reveal>
          </div>
          <Reveal delay={0.1} className="relative grid aspect-square place-items-center overflow-hidden rounded-panel bg-forest">
            <div className="grid-lines absolute inset-0" aria-hidden="true" />
            <div className="absolute size-[70%] rounded-full border border-soft/10" aria-hidden="true" />
            <div className="absolute size-[48%] rounded-full border border-soft/10" aria-hidden="true" />
            <div className="absolute size-[26%] rounded-full border border-orange/40 bg-orange/10" aria-hidden="true" />
            <Globe2 className="relative size-14 text-orange" aria-hidden="true" />
            {[["18%", "22%"], ["70%", "30%"], ["30%", "75%"], ["78%", "68%"], ["50%", "12%"]].map(([l, t], i) => (
              <span key={i} className="animate-pulse-dot absolute size-2.5 rounded-full bg-orange" style={{ left: l, top: t, animationDelay: `${i * 0.4}s` }} aria-hidden="true" />
            ))}
          </Reveal>
        </div>
      </Section>

      <FinalCTA />
    </>
  );
}

"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, FileCheck2, MapPin, ShieldCheck } from "lucide-react";
import EmailCapture from "./EmailCapture";
import HeroConsole from "./HeroConsole";
import { proposalUrl } from "@/lib/site";

const ease = [0.22, 1, 0.36, 1];

const badges = [
  { icon: ShieldCheck, label: "KYC-checked creators" },
  { icon: FileCheck2, label: "Audit-ready records" },
  { icon: MapPin, label: "Lagos, Nigeria" },
];

const platforms = ["Instagram", "TikTok", "YouTube", "X", "Facebook", "LinkedIn"];

// Process promises, not performance figures: no numbers are published until VGA approves them (brief §13).
const stats = [
  { value: "100%", label: "Creators KYC-checked" },
  { value: "1", label: "Invoice per campaign" },
  { value: "0", label: "Payouts without proof" },
];

export default function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay) => ({
    initial: { opacity: 0, y: reduce ? 0 : 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.01 : 0.7, delay: reduce ? 0 : delay, ease },
  });

  return (
    <section className="relative overflow-hidden">
      <div className="grid-lines-dark pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_70%_at_20%_30%,black,transparent_75%)]" aria-hidden="true" />
      <div className="gutter relative grid items-center gap-12 pt-40 pb-16 sm:pt-44 lg:grid-cols-[1fr_1.02fr] lg:gap-14 lg:pb-24">
        <div className="min-w-0">
          <motion.ul {...rise(0)} className="flex flex-wrap gap-2" aria-label="At a glance">
            {badges.map(({ icon: Icon, label }) => (
              <li key={label} className="inline-flex items-center gap-1.5 rounded-full border border-forest/10 bg-white px-2.5 py-1 text-xs font-medium text-muted">
                <Icon className="size-3.5 text-orange-deep" aria-hidden="true" />
                {label}
              </li>
            ))}
          </motion.ul>

          <motion.h1 {...rise(0.05)} className="display mt-6 text-3xl leading-9 font-bold md:text-4xl md:leading-[44px] lg:text-5xl lg:leading-[56px] text-forest">
            Performance marketing built on{" "}
            <span className="whitespace-nowrap">
              <span className="relative inline-block -rotate-1 rounded-lg bg-orange px-2 pb-0.5 text-ink">trust</span>,
            </span>{" "}
            transparency, and results
          </motion.h1>

          <motion.p {...rise(0.1)} className="mt-5 max-w-[600px] text-lg leading-7 font-medium tracking-[-0.02em] text-muted md:text-xl md:leading-8">
            Value Grade Agency helps brands and agencies manage creator, influencer, affiliate, and performance partner campaigns with verified execution, clear reporting, and structured payout support.
          </motion.p>

          <motion.ul {...rise(0.14)} className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5" aria-label="Platforms we track">
            {platforms.map((p) => (
              <li key={p} className="flex items-center gap-1.5 text-[13px] font-medium text-muted">
                <span className="size-1.5 rounded-full bg-orange" aria-hidden="true" />
                {p}
              </li>
            ))}
          </motion.ul>

          <motion.div {...rise(0.2)} className="mt-8">
            <EmailCapture />
            <Link href={proposalUrl} className="group mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-forest underline decoration-orange decoration-2 underline-offset-4 hover:text-orange-deep">
              Or request a proposal
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </motion.div>

          <motion.dl {...rise(0.26)} className="mt-10 flex gap-8 border-t border-forest/10 pt-7 sm:gap-14">
            {stats.map(({ value, label }) => (
              <div key={label} className="flex flex-col-reverse">
                <dt className="mt-1 text-[13px] leading-5 font-medium text-muted">{label}</dt>
                <dd className="display text-xl font-semibold text-forest md:text-2xl">{value}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.9, delay: reduce ? 0 : 0.15, ease }}
        >
          <HeroConsole />
          <p className="mt-2 text-right text-[11px] font-medium text-forest/40">Illustrative data</p>
        </motion.div>
      </div>
    </section>
  );
}

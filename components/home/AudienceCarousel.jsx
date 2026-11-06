"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import clsx from "clsx";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { audiences } from "@/lib/site";

// Brief §8 "Who we serve" in a centred, auto-rotating carousel (the slot where a
// reference site would show testimonials; VGA has none approved yet).
const detail = {
  "/for-brands": "One accountable partner, one invoice, and proof behind every payout your finance team signs off.",
  "/for-agencies": "A delivery partner that runs creator execution, KYC and payouts under your brand.",
  "/for-creators": "Clear briefs, written agreements and payouts on record once your work is verified.",
  "/for-brands#enterprise": "Always-on programmes for telecoms, banks and large organisations, with audit-ready records.",
};

export default function AudienceCarousel() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const n = audiences.length;

  useEffect(() => {
    if (reduce) return;
    const id = setTimeout(() => setI((v) => (v + 1) % n), 6000);
    return () => clearTimeout(id);
  }, [i, n, reduce]);

  const go = (d) => setI((v) => (v + d + n) % n);
  const { href, label, blurb, icon: Icon } = audiences[i];
  const prev = audiences[(i - 1 + n) % n];
  const next = audiences[(i + 1) % n];

  return (
    <div className="relative mt-12 lg:mt-16" aria-roledescription="carousel" aria-label="Who we serve">
      <div className="relative mx-auto flex max-w-6xl items-center justify-center gap-6">
        {/* Peeking neighbours (desktop) */}
        {[prev, next].map((a, side) => (
          <button
            key={a.href + side}
            onClick={() => go(side ? 1 : -1)}
            className={clsx("hidden w-64 shrink-0 rounded-card bg-white/60 p-6 text-left opacity-50 blur-[1px] transition hover:opacity-80 lg:block", side ? "order-3" : "order-1")}
            aria-label={`Show ${a.label}`}
          >
            <a.icon className="size-6 text-orange-deep" aria-hidden="true" />
            <p className="display mt-5 text-xl leading-7 text-forest">{a.label.replace("For ", "")}</p>
            <p className="mt-2 line-clamp-2 text-sm font-medium text-forest/60">{a.blurb}</p>
          </button>
        ))}

        <div className="order-2 w-full max-w-xl">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={href}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              aria-live="polite"
            >
              <Link href={href} className="group relative block overflow-hidden rounded-panel bg-forest p-7 text-soft shadow-[0_40px_80px_-40px_rgb(0_47_31/0.7)] sm:p-10">
                <div className="halftone pointer-events-none absolute -right-12 -bottom-12 size-72 rounded-full opacity-40 [mask-image:radial-gradient(circle,black,transparent_70%)]" aria-hidden="true" />
                <div className="relative flex items-start justify-between">
                  <span className="grid size-14 place-items-center rounded-2xl bg-orange text-ink"><Icon className="size-6" aria-hidden="true" /></span>
                  <span className="font-mono text-xs font-medium text-soft/40">0{i + 1} / 0{n}</span>
                </div>
                <h3 className="display relative mt-8 text-3xl leading-9 md:text-4xl md:leading-[44px]">{label}</h3>
                <p className="relative mt-4 text-lg leading-relaxed font-medium text-soft/80">{blurb}</p>
                <p className="relative mt-2 text-[15px] leading-relaxed font-medium text-soft/55">{detail[href]}</p>
                <span className="relative mt-8 inline-flex items-center gap-2 text-sm font-bold text-orange">
                  Explore {label.toLowerCase()}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-center gap-4">
        <button onClick={() => go(-1)} aria-label="Previous audience" className="grid size-10 place-items-center rounded-full border border-forest/15 text-forest transition-colors hover:bg-forest hover:text-soft">
          <ChevronLeft className="size-4" aria-hidden="true" />
        </button>
        <div className="flex gap-2" role="tablist" aria-label="Choose an audience">
          {audiences.map((a, n2) => (
            <button key={a.href} role="tab" aria-selected={n2 === i} aria-label={a.label} onClick={() => setI(n2)} className="py-2">
              <span className={clsx("block h-[3px] w-9 rounded-full transition-colors", n2 === i ? "bg-orange" : "bg-forest/15 hover:bg-forest/30")} />
            </button>
          ))}
        </div>
        <button onClick={() => go(1)} aria-label="Next audience" className="grid size-10 place-items-center rounded-full border border-forest/15 text-forest transition-colors hover:bg-forest hover:text-soft">
          <ChevronRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

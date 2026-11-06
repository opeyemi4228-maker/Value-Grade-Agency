"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import clsx from "clsx";
import { ArrowRight, BadgeCheck, Check, ShieldCheck, TrendingUp } from "lucide-react";

// Hero product panel: a deep-green stage with the VGA gauge motif (from the logo) and a few large
// floating cards. Covers the brief's dashboard ideas: verified creators, approved payouts,
// conversion tracking and compliance status. Fictional creators, placeholder figures (brief §13).
// TODO(VGA): confirm the countries / payout methods shown before launch.
const ease = [0.22, 1, 0.36, 1];

const flags = {
  ng: "linear-gradient(90deg,#008751 33.3%,#fff 33.3% 66.6%,#008751 66.6%)",
  gh: "linear-gradient(180deg,#CE1126 33.3%,#FCD116 33.3% 66.6%,#006B3F 66.6%)",
  ke: "linear-gradient(180deg,#111 30%,#fff 30% 35%,#BB0000 35% 65%,#fff 65% 70%,#006600 70%)",
};

const creators = [
  { initials: "AO", name: "Adaeze Okafor", role: "UGC creator", flag: "ng", amount: "₦450,000", method: "Bank transfer", tone: "bg-orange text-ink", pos: "top-[8%] right-[5%]" },
  { initials: "KA", name: "@kwame.eats", role: "Influencer", flag: "gh", amount: "GH₵4,200", method: "Mobile money", tone: "bg-cream text-forest", pos: "top-[24%] left-[5%]" },
  { initials: "WK", name: "Wanjiru K.", role: "Creator", flag: "ke", amount: "KSh 48,000", method: "Mobile money", tone: "bg-emerald text-soft", pos: "top-[40%] left-[22%]" },
];

function Gauge({ className }) {
  // Concentric arcs and ticks echoing the speedometer in the VGA mark.
  const ticks = Array.from({ length: 19 }, (_, i) => (Math.PI * i) / 18);
  return (
    <svg viewBox="0 0 400 220" fill="none" className={className} aria-hidden="true">
      {[190, 150, 110, 70].map((r) => (
        <path key={r} d={`M ${200 - r} 210 A ${r} ${r} 0 0 1 ${200 + r} 210`} stroke="currentColor" strokeWidth="1" />
      ))}
      {ticks.map((a, i) => (
        <line
          key={i}
          x1={(200 - Math.cos(a) * 176).toFixed(2)}
          y1={(210 - Math.sin(a) * 176).toFixed(2)}
          x2={(200 - Math.cos(a) * 190).toFixed(2)}
          y2={(210 - Math.sin(a) * 190).toFixed(2)}
          stroke="currentColor"
          strokeWidth={i % 3 ? 1 : 2}
        />
      ))}
    </svg>
  );
}

function Flag({ code }) {
  return <span className="absolute -right-0.5 -bottom-0.5 size-3.5 overflow-hidden rounded-full ring-2 ring-white" style={{ background: flags[code] }} />;
}

export default function HeroConsole() {
  const reduce = useReducedMotion();
  const [paid, setPaid] = useState(false);

  // Gentle loop on the main button: Approve & pay → Paid → back.
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setPaid((p) => !p), 3200);
    return () => clearInterval(id);
  }, [reduce]);

  const pop = (i) => ({
    initial: { opacity: 0, y: reduce ? 0 : 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.01 : 0.7, delay: reduce ? 0 : 0.35 + i * 0.12, ease },
  });
  const card = "rounded-2xl bg-white text-forest shadow-[0_24px_50px_-20px_rgb(0_0_0/0.55)]";

  return (
    <div
      role="img"
      aria-label="Illustrative VGA dashboard: three verified creators paid in naira, cedis and shillings, a ₦2,143,000 approved payout batch, conversion tracking and compliance status"
      className="relative aspect-[1/1.2] w-full overflow-hidden rounded-3xl bg-gradient-to-b from-emerald via-forest to-ink sm:aspect-[1.08/1]"
    >
      <div aria-hidden="true" className="absolute inset-0">
        <div className="grid-lines-orange absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_100%,black,transparent_75%)]" />
        <Gauge className="absolute bottom-[2%] left-1/2 w-[120%] -translate-x-1/2 text-orange/35" />
        <div className="absolute -bottom-24 left-1/2 size-80 -translate-x-1/2 rounded-full bg-orange/25 blur-3xl" />

        {creators.map((c, i) => (
          <motion.div key={c.name} {...pop(i)} className={clsx(card, "absolute flex items-center gap-2.5 py-2 pr-3 pl-2 sm:gap-3 sm:py-2.5 sm:pr-4", c.pos)}>
            <span className={clsx("relative grid size-9 shrink-0 place-items-center rounded-full text-[11px] font-semibold sm:size-10", c.tone)}>
              {c.initials}
              <Flag code={c.flag} />
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-1 text-[12px] font-bold whitespace-nowrap sm:text-[13px]">
                {c.name}
                <BadgeCheck className="size-3.5 text-orange-deep" />
              </span>
              <span className="block text-[10.5px] font-medium text-forest/50 sm:text-[11px]">{c.role}</span>
            </span>
            <span className="ml-2 text-[13px] font-bold whitespace-nowrap tabular-nums sm:ml-4 sm:text-[15px]">{c.amount}</span>
            <span className="hidden rounded-md bg-cream px-1.5 py-0.5 text-[9.5px] font-bold whitespace-nowrap text-forest/65 xl:inline">{c.method}</span>
          </motion.div>
        ))}

        {/* Small KPI chips */}
        <motion.div {...pop(3)} className="absolute top-[8%] left-[5%] hidden items-center gap-2 rounded-full border border-soft/15 bg-ink/50 px-3 py-1.5 text-[11px] font-semibold text-soft/85 backdrop-blur sm:flex">
          <TrendingUp className="size-3.5 text-orange" /> 3,412 verified sign-ups
        </motion.div>
        <motion.div {...pop(4)} className="absolute top-[26%] right-[5%] hidden items-center gap-2 rounded-full border border-soft/15 bg-ink/50 px-3 py-1.5 text-[11px] font-semibold text-soft/85 backdrop-blur 2xl:flex">
          <ShieldCheck className="size-3.5 text-orange" /> KYC complete
        </motion.div>

        {/* Approved payout card */}
        <motion.div {...pop(5)} className={clsx(card, "absolute inset-x-[5%] bottom-[5%] p-4 sm:p-5")}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold text-forest/50">Total payout · Q4 Launch</p>
              <p className="mt-1 text-2xl font-bold tracking-[-0.03em] tabular-nums md:text-[1.75rem]">
                ₦2,143,000<span className="text-base text-forest/35">.00</span>
              </p>
            </div>
            <dl className="hidden shrink-0 rounded-xl bg-cream px-3 py-2 text-[10.5px] sm:block">
              <div className="flex justify-between gap-6"><dt className="text-forest/50">Recipients</dt><dd className="font-bold">12 creators</dd></div>
              <div className="mt-1 flex justify-between gap-6"><dt className="text-forest/50">Verified</dt><dd className="font-bold">12 of 12</dd></div>
            </dl>
          </div>
          <div className={clsx("mt-4 flex h-11 items-center justify-center gap-2 rounded-xl text-[13.5px] font-bold transition-colors duration-500", paid ? "bg-forest text-soft" : "bg-orange text-ink")}>
            {paid ? (
              <>
                <Check className="size-4 text-orange" strokeWidth={3} /> Paid · receipts filed
              </>
            ) : (
              <>
                Approve &amp; pay <ArrowRight className="size-4" />
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

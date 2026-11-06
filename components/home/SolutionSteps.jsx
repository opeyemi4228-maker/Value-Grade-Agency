"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import clsx from "clsx";
import { ArrowRight, BadgeCheck, Check, Clock3, FileSignature, PenLine, Send, Search, ShieldCheck } from "lucide-react";
import { solutionSteps } from "@/lib/content";

// Brief §8 solution section: Find → Agree → Execute → Measure, each with an icon and short text.
// Each step shows a small product screen (placeholder data). Tabs auto-advance while in view.
const DURATION = 6500;
const card = "rounded-2xl bg-white text-forest shadow-[0_30px_60px_-30px_rgb(0_0_0/0.55)]";
const label = "text-[10px] font-bold tracking-wider text-forest/45 uppercase";

function Initials({ name, n }) {
  const tones = ["bg-orange text-ink", "bg-forest text-orange", "bg-emerald text-soft", "bg-cream text-forest ring-1 ring-forest/10"];
  return <span className={clsx("grid size-8 shrink-0 place-items-center rounded-full text-[10px] font-semibold", tones[n % tones.length])}>{name.split(" ").map((p) => p[0]).join("")}</span>;
}

function FindScreen() {
  const rows = [
    ["Adaeze Okafor", "Lifestyle · 182K", 96],
    ["Tobi Kolade", "Tech · 240K", 91],
    ["Kemi Martins", "Food · 96K", 88],
    ["Zainab Bello", "Fashion · 131K", 84],
  ];
  return (
    <div className={clsx(card, "overflow-hidden")}>
      <div className="flex items-center gap-2 border-b border-forest/8 px-5 py-4">
        <Search className="size-4 text-forest/40" />
        <span className="text-[13px] font-semibold text-forest/80">Fintech app launch · Lagos · 18–34</span>
      </div>
      <div className="flex justify-between px-5 pt-3 pb-1"><span className={label}>Shortlist</span><span className={label}>Brief fit</span></div>
      <ul className="divide-y divide-forest/6">
        {rows.map(([n, meta, fit], i) => (
          <li key={n} className="flex items-center gap-3 px-5 py-3">
            <Initials name={n} n={i} />
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1.5 text-[13px] font-bold">{n}<BadgeCheck className="size-3.5 text-orange-deep" /></span>
              <span className="block text-[11px] font-medium text-forest/50">{meta}</span>
            </span>
            <span className="w-16">
              <span className="block text-right text-[12px] font-bold tabular-nums">{fit}%</span>
              <span className="mt-1 block h-1 overflow-hidden rounded-full bg-forest/8"><span className="block h-full rounded-full bg-forest" style={{ width: `${fit}%` }} /></span>
            </span>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-2 bg-forest/[0.03] px-5 py-3 text-[11.5px] font-semibold text-forest/65">
        <ShieldCheck className="size-4 text-forest" /> Identity, audience and brand-safety checks complete
      </div>
    </div>
  );
}

function AgreeScreen() {
  const terms = [["Deliverables", "3 Reels + 6 Stories"], ["Go-live window", "Nov 4 – Nov 18"], ["Content approval", "Brand sign-off before posting"], ["Payment rule", "Fixed fee + per sign-up"]];
  return (
    <div className={clsx(card, "p-5 sm:p-6")}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={label}>Creator agreement</p>
          <p className="mt-1 text-lg leading-7 font-semibold tracking-[-0.02em]">Adaeze Okafor × Q4 Launch</p>
        </div>
        <FileSignature className="size-6 text-orange-deep" />
      </div>
      <dl className="mt-5 divide-y divide-forest/8 rounded-xl border border-forest/10">
        {terms.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 px-4 py-2.5 text-[12.5px]">
            <dt className="font-medium text-forest/55">{k}</dt>
            <dd className="text-right font-bold">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {[["Brand", "Signed Nov 1"], ["Creator", "Signed Nov 2"]].map(([who, when]) => (
          <div key={who} className="flex items-center gap-2 rounded-xl bg-forest/[0.04] px-3 py-2.5">
            <span className="grid size-5 place-items-center rounded-full bg-forest text-orange"><Check className="size-3" strokeWidth={3.5} /></span>
            <span><span className="block text-[11.5px] font-bold">{who}</span><span className="block text-[10px] font-medium text-forest/50">{when}</span></span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExecuteScreen() {
  const flow = [
    [PenLine, "Draft submitted", "Nov 5 · 10:42", "done"],
    [BadgeCheck, "Brand approved", "Nov 5 · 16:10", "done"],
    [Send, "Published on Instagram", "Nov 6 · 19:00", "done"],
    [Clock3, "Story set 2 of 3", "Due Nov 12", "next"],
  ];
  return (
    <div className={clsx(card, "p-5 sm:p-6")}>
      <div className="flex items-center justify-between">
        <p className={label}>Content tracker · Reel 1</p>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold tracking-wider text-emerald-700 uppercase">On schedule</span>
      </div>
      <ol className="relative mt-5 space-y-4">
        <span className="absolute top-2 bottom-2 left-[15px] w-px bg-forest/12" aria-hidden="true" />
        {flow.map(([Icon, t, when, state]) => (
          <li key={t} className="relative flex items-center gap-3">
            <span className={clsx("relative grid size-8 place-items-center rounded-full", state === "done" ? "bg-forest text-orange" : "border border-dashed border-orange bg-white text-orange-deep")}>
              <Icon className="size-4" />
            </span>
            <span className="flex-1 text-[13px] font-bold">{t}</span>
            <span className="text-[11px] font-medium text-forest/50">{when}</span>
          </li>
        ))}
      </ol>
      <div className="mt-5 rounded-xl bg-forest/[0.04] px-4 py-3 text-[11.5px] font-medium text-forest/65">
        Brand, agency and creator see the same status. No scattered chat threads.
      </div>
    </div>
  );
}

function MeasureScreen() {
  return (
    <div className={clsx(card, "p-5 sm:p-6")}>
      <p className={label}>Verified results · Q4 Launch</p>
      <div className="mt-4 grid grid-cols-3 gap-2.5">
        {[["Sign-ups", "3,412"], ["Reach", "1.8M"], ["Delivered", "68/68"]].map(([k, v]) => (
          <div key={k} className="rounded-xl bg-cream p-3">
            <p className="text-[10px] font-semibold text-forest/50">{k}</p>
            <p className="mt-1 text-lg font-bold tabular-nums">{v}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-xl border border-forest/10 p-4">
        <div className="flex items-center justify-between text-[12.5px]">
          <span className="font-bold">Payout batch #014</span>
          <span className="font-medium text-forest/55">24 creators</span>
        </div>
        <div className="mt-2 flex items-end justify-between">
          <span className="text-2xl font-bold tabular-nums">₦8,500,000</span>
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold tracking-wider text-emerald-700 uppercase">All verified</span>
        </div>
        <div className="mt-4 flex h-10 items-center justify-center gap-2 rounded-full bg-orange text-[13px] font-bold text-ink">
          Approve one invoice <ArrowRight className="size-4" />
        </div>
      </div>
    </div>
  );
}

const screens = { find: FindScreen, agree: AgreeScreen, execute: ExecuteScreen, measure: MeasureScreen };

// Horizontal numbered tabs with a progress underline, above one large panel: copy on the left,
// the step's product screen on a dark-green panel on the right.
export default function SolutionSteps() {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-20% 0px" });
  const [active, setActive] = useState(0);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (reduce || !inView) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % solutionSteps.length), DURATION);
    return () => clearTimeout(id);
  }, [active, run, inView, reduce]);

  const step = solutionSteps[active];
  const Screen = screens[step.key];
  const StepIcon = step.icon;

  return (
    <div ref={ref} className="mx-auto mt-12 max-w-6xl lg:mt-16">
      <div role="tablist" aria-label="Find, Agree, Execute, Measure" className="grid grid-cols-4 gap-2 sm:gap-5">
        {solutionSteps.map(({ key, title }, i) => {
          const on = i === active;
          return (
            <button
              key={key}
              role="tab"
              id={`solution-tab-${key}`}
              aria-selected={on}
              aria-controls="solution-panel"
              onClick={() => { setActive(i); setRun((r) => r + 1); }}
              className="group text-left"
            >
              <span className={clsx("flex items-baseline gap-2 text-[13px] font-bold transition-colors sm:text-base", on ? "text-forest" : "text-forest/40 group-hover:text-forest/70")}>
                <span className={clsx("font-mono text-[11px]", on ? "text-orange-deep" : "")}>0{i + 1}</span>
                {title}
              </span>
              <span className="mt-3 block h-[3px] overflow-hidden rounded-full bg-forest/10">
                {on && (
                  <motion.span
                    key={`${active}-${run}-${inView}`}
                    className="block h-full rounded-full bg-orange"
                    initial={{ width: reduce ? "100%" : "0%" }}
                    animate={{ width: reduce || inView ? "100%" : "0%" }}
                    transition={{ duration: reduce || !inView ? 0 : DURATION / 1000, ease: "linear" }}
                  />
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div id="solution-panel" role="tabpanel" aria-labelledby={`solution-tab-${step.key}`} className="mt-8 grid overflow-hidden rounded-panel bg-white p-3 shadow-[0_30px_80px_-50px_rgb(0_47_31/0.45)] sm:p-4 lg:grid-cols-[0.82fr_1.18fr]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-center p-4 sm:p-8"
          >
            <span className="grid size-12 place-items-center rounded-2xl bg-forest text-orange">
              <StepIcon className="size-5" aria-hidden="true" />
            </span>
            <h3 className="display mt-5 text-2xl leading-8 text-forest md:text-3xl md:leading-10">{step.title}. <span className="text-forest/45">{step.lead}</span></h3>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed font-medium text-forest/65">{step.body}</p>
            <ul className="mt-6 space-y-2.5">
              {step.points.map((p) => (
                <li key={p} className="flex items-center gap-2.5 text-[14px] font-semibold text-forest">
                  <span className="grid size-5 place-items-center rounded-full bg-orange/15 text-orange-deep"><Check className="size-3" strokeWidth={3.5} aria-hidden="true" /></span>
                  {p}
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald to-ink p-5 sm:p-10">
          <div className="grid-lines pointer-events-none absolute inset-0 fade-mask" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-24 -bottom-24 size-80 rounded-full bg-orange/25 blur-3xl" aria-hidden="true" />
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step.key}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
              aria-hidden="true"
            >
              <Screen />
            </motion.div>
          </AnimatePresence>
          <p className="relative mt-4 text-right text-[10.5px] text-soft/40">Illustrative data</p>
        </div>
      </div>
    </div>
  );
}

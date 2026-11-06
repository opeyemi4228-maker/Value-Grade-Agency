import { RefreshCw } from "lucide-react";
import Reveal from "./Reveal";
import { cycle } from "@/lib/content";

// The brief's 8-step campaign cycle (§8), grouped into four phases of two steps.
// Desktop: one orange rail runs across the four phase markers, with two step cards under each.
// Phones and tablets: phases stack, each with its own short rail.
// compact: one short line per step (homepage); full: the longer description.
const phases = ["Plan", "Deliver", "Verify & pay", "Review & improve"];

export default function CycleTimeline({ compact = false }) {
  return (
    <div className="mt-12 lg:mt-16">
      <ol className="relative grid gap-10 md:grid-cols-2 md:gap-x-6 lg:grid-cols-4 lg:gap-x-5">
        {/* The rail: fades from orange into the dark as the cycle moves on. */}
        <span
          className="pointer-events-none absolute top-5 right-0 left-5 hidden h-px bg-gradient-to-r from-orange/80 via-orange/40 to-soft/10 lg:block"
          aria-hidden="true"
        />

        {phases.map((phase, p) => (
          <Reveal as="li" key={phase} delay={p * 0.08} className="relative">
            <div className="flex items-center gap-3">
              <span className="relative grid size-10 shrink-0 place-items-center rounded-full bg-forest font-mono text-[13px] font-medium text-orange ring-1 ring-orange/50">
                <span className="absolute inset-1 rounded-full bg-orange/10" aria-hidden="true" />
                <span className="relative">{p + 1}</span>
              </span>
              <p className="relative -ml-1 bg-forest px-2 text-[13px] leading-5 font-bold tracking-wider text-soft uppercase">{phase}</p>
              <span className="h-px flex-1 bg-gradient-to-r from-orange/50 to-transparent lg:hidden" aria-hidden="true" />
            </div>

            <ul className="mt-6 space-y-3">
              {cycle.slice(p * 2, p * 2 + 2).map(({ icon: Icon, title, short, body }, j) => {
                const n = p * 2 + j + 1;
                return (
                  <li
                    key={title}
                    className="group relative rounded-2xl border border-soft/10 bg-ink/40 p-5 backdrop-blur-sm transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-orange/40 hover:bg-ink/70"
                  >
                    <div className="flex items-center justify-between">
                      <span className="grid size-9 place-items-center rounded-xl bg-orange/10 text-orange ring-1 ring-orange/25 transition-colors duration-300 group-hover:bg-orange group-hover:text-ink">
                        <Icon className="size-[18px]" aria-hidden="true" />
                      </span>
                      <span className="font-mono text-xs font-medium text-soft/40">
                        <span className="sr-only">Step </span>
                        {String(n).padStart(2, "0")}
                        <span className="text-soft/20"> / 08</span>
                      </span>
                    </div>
                    <h3 className="mt-4 text-base leading-6 font-semibold tracking-[-0.02em] text-soft md:text-[17px]">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed font-medium text-soft/60">{compact ? short : body}</p>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        ))}
      </ol>

      {/* The cycle closes: step 8 feeds step 1. */}
      <Reveal delay={0.3} className="mt-10 flex justify-center">
        <p className="inline-flex items-center gap-2.5 rounded-full border border-dashed border-orange/35 bg-orange/[0.06] px-4 py-2 text-[13px] font-medium text-soft/75">
          <RefreshCw className="size-3.5 text-orange" aria-hidden="true" />
          Optimisation feeds the next Brand Brief, so every campaign starts sharper.
        </p>
      </Reveal>
    </div>
  );
}

import Reveal from "./Reveal";
import { complianceFeatures } from "@/lib/content";

// Tipalti-style white feature cards.
export default function ComplianceGrid({ items = complianceFeatures, compact = false }) {
  if (compact) {
    return (
      <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
        {items.map(({ icon: Icon, title }, i) => (
          <Reveal as="li" key={title} delay={(i % 4) * 0.05} className="flex items-center gap-4 rounded-2xl bg-white p-5">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-forest text-orange">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <span className="text-[17px] font-semibold tracking-tight text-forest">{title}</span>
          </Reveal>
        ))}
      </ul>
    );
  }
  return (
    <div className="mt-12 lg:mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map(({ id, icon: Icon, title, body }, i) => (
        <Reveal key={title} delay={(i % 4) * 0.06} className="group flex min-h-[250px] flex-col rounded-card bg-white p-7 transition-all duration-500 hover:-translate-y-1 hover:bg-forest">
          <div id={id} className="flex items-center justify-between">
            <span className="grid size-12 place-items-center rounded-2xl bg-soft text-forest transition-colors duration-500 group-hover:bg-orange group-hover:text-ink">
              <Icon className="size-5" aria-hidden="true" />
            </span>
          </div>
          <h3 className="mt-auto pt-10 text-lg leading-7 font-semibold tracking-[-0.02em] md:text-xl text-forest transition-colors duration-500 group-hover:text-soft">{title}</h3>
          <p className="mt-2 text-[15px] leading-relaxed font-medium text-forest/70 transition-colors duration-500 group-hover:text-soft/70">{body}</p>
        </Reveal>
      ))}
    </div>
  );
}

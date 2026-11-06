import { complianceFeatures } from "@/lib/content";
import Reveal from "../Reveal";

// Brief §8 compliance feature cards as a quiet tile grid, with the KYC tile as a dark anchor.
export default function ComplianceFeatures() {
  return (
    <div className="mx-auto mt-12 grid max-w-6xl gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
      {complianceFeatures.map(({ id, icon: Icon, title, body }, i) => {
        const dark = i === 0;
        return (
          <Reveal
            key={title}
            delay={(i % 4) * 0.05}
            className={`group relative flex flex-col overflow-hidden rounded-card p-6 transition-colors duration-300 ${dark ? "bg-forest text-soft" : "bg-[#EFEBDF] text-forest hover:bg-[#E9E4D5]"}`}
          >
            <span id={id} className="absolute -top-28" aria-hidden="true" />
            <span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-orange transition-transform duration-500 group-hover:scale-x-100" aria-hidden="true" />
            <Icon className={`size-7 stroke-[1.5] ${dark ? "text-orange" : "text-forest"}`} aria-hidden="true" />
            <h3 className="mt-10 text-lg leading-7 font-semibold tracking-[-0.02em]">{title}</h3>
            <p className={`mt-1.5 text-[14px] leading-relaxed font-medium ${dark ? "text-soft/70" : "text-forest/65"}`}>{body}</p>
          </Reveal>
        );
      })}
    </div>
  );
}

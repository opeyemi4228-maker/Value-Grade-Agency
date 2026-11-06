import clsx from "clsx";
import Reveal from "./Reveal";

export default function IconCards({ items, tone = "light", columns = 3, className }) {
  const light = tone === "light";
  return (
    <div className={clsx("grid gap-4 sm:grid-cols-2", columns === 3 && "lg:grid-cols-3", columns === 4 && "lg:grid-cols-4", className)}>
      {items.map(({ icon: Icon, title, body }, i) => (
        <Reveal
          key={title}
          delay={(i % columns) * 0.07}
          className={clsx(
            "group flex flex-col rounded-card p-6 transition-all sm:p-7 duration-500 hover:-translate-y-1",
            light ? "bg-white hover:shadow-[0_30px_60px_-30px_rgb(0_47_31/0.35)]" : "border border-soft/10 bg-ink/50 hover:border-orange/40",
          )}
        >
          <span className={clsx("grid size-12 place-items-center rounded-2xl text-orange transition-transform duration-500 group-hover:-rotate-6", light ? "bg-forest" : "bg-emerald")}>
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <h3 className={clsx("mt-6 text-lg leading-7 sm:mt-8 font-semibold tracking-[-0.02em] md:text-xl", light ? "text-forest" : "text-soft")}>{title}</h3>
          <p className={clsx("mt-2 text-[15px] leading-relaxed font-medium", light ? "text-forest/70" : "text-soft/65")}>{body}</p>
        </Reveal>
      ))}
    </div>
  );
}

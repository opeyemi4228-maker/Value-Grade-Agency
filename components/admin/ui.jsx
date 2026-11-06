// Small presentational pieces shared across admin pages (server-safe, no hooks).
import Link from "next/link";
import clsx from "clsx";
import { ArrowDown, ArrowUp } from "lucide-react";
import { INTENT_META } from "@/lib/admin/metrics";
import { fmtPct, initials } from "./format";

export function Card({ title, action, className, children, bodyClassName }) {
  return (
    <section className={clsx("flex flex-col rounded-2xl border border-line/80 bg-white shadow-[0_1px_2px_rgb(1_28_19/0.04)]", className)}>
      {(title || action) && (
        <header className="flex min-h-14 items-center justify-between gap-3 px-5 pt-4">
          {title && <h2 className="text-[15px] font-bold tracking-tight text-forest">{title}</h2>}
          {action}
        </header>
      )}
      <div className={clsx("flex-1 px-5 pt-2 pb-5", bodyClassName)}>{children}</div>
    </section>
  );
}

export function PageHeader({ title, description, children }) {
  return (
    <div className="flex flex-col gap-4 pb-6 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-[1.65rem] font-extrabold tracking-[-0.03em] text-forest">{title}</h1>
        {description && <p className="mt-1 text-sm text-forest/60">{description}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}

// Arrow + signed value, so the direction never depends on colour alone.
export function DeltaPill({ delta, size = "sm" }) {
  if (delta === null) {
    return <span className="inline-flex items-center rounded-md bg-forest/[0.06] px-1.5 py-0.5 text-[11px] font-bold text-forest/70">New</span>;
  }
  const up = delta > 0;
  const flat = delta === 0;
  const Icon = up ? ArrowUp : ArrowDown;
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-bold tabular-nums",
        size === "sm" ? "text-[11px]" : "text-xs",
        flat ? "bg-forest/[0.06] text-forest/70" : up ? "bg-[#e6f4ec] text-[#0b6b45]" : "bg-[#fdecea] text-[#b42318]",
      )}
    >
      {!flat && <Icon className="size-3" strokeWidth={2.75} aria-hidden="true" />}
      {flat ? "0%" : fmtPct(Math.abs(delta))}
      <span className="sr-only">{flat ? "no change" : up ? "increase" : "decrease"}</span>
    </span>
  );
}

const STATUS_STYLE = {
  new: "bg-orange/10 text-orange-deep ring-orange/25",
  contacted: "bg-[#eaf2fc] text-[#1c5cab] ring-[#2a78d6]/20",
  qualified: "bg-[#f0edfb] text-[#4a3aa7] ring-[#7a5bd6]/20",
  converted: "bg-[#e6f4ec] text-[#0b6b45] ring-[#0f7a52]/20",
  archived: "bg-forest/[0.05] text-forest/55 ring-forest/10",
};
const STATUS_LABEL = { new: "New", contacted: "Contacted", qualified: "Qualified", converted: "Converted", archived: "Archived" };

export function StatusBadge({ status }) {
  return (
    <span className={clsx("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-bold ring-1 ring-inset", STATUS_STYLE[status])}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {STATUS_LABEL[status] || status}
    </span>
  );
}

export function IntentBadge({ intent }) {
  const meta = INTENT_META[intent];
  if (!meta) return null;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest/75">
      <span className="size-2 rounded-[3px]" style={{ background: meta.color }} aria-hidden="true" />
      {meta.short}
    </span>
  );
}

export function SampleTag() {
  return <span className="rounded bg-cream px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-forest/55 uppercase ring-1 ring-line">Sample</span>;
}

export function Avatar({ name, className }) {
  return (
    <span className={clsx("grid size-9 shrink-0 place-items-center rounded-full bg-forest/[0.07] text-xs font-bold text-forest", className)} aria-hidden="true">
      {initials(name)}
    </span>
  );
}

export function ButtonLink({ href, variant = "secondary", className, children, ...props }) {
  return (
    <Link href={href} className={clsx(btn(variant), className)} {...props}>
      {children}
    </Link>
  );
}

export function btn(variant = "secondary") {
  return clsx(
    "inline-flex h-9 items-center justify-center gap-2 rounded-full px-4 text-[13px] font-semibold whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-50",
    variant === "primary" && "bg-forest text-soft shadow-[0_1px_0_rgb(255_255_255/0.15)_inset,0_4px_12px_-4px_rgb(0_47_31/0.5)] hover:bg-emerald",
    variant === "accent" && "bg-orange text-ink hover:bg-orange-soft",
    variant === "secondary" && "border border-line bg-white text-forest hover:border-forest/30 hover:bg-soft",
    variant === "ghost" && "text-forest/70 hover:bg-forest/[0.05] hover:text-forest",
    variant === "danger" && "border border-[#f3c5c0] bg-white text-[#b42318] hover:bg-[#fdecea]",
  );
}

export function EmptyState({ icon: Icon, title, children, action }) {
  return (
    <div className="grid place-items-center px-6 py-14 text-center">
      {Icon && (
        <span className="grid size-12 place-items-center rounded-2xl bg-forest/[0.05] text-forest/60">
          <Icon className="size-5" aria-hidden="true" />
        </span>
      )}
      <h3 className="mt-4 text-[15px] font-bold text-forest">{title}</h3>
      {children && <p className="mt-1.5 max-w-sm text-sm text-forest/60">{children}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

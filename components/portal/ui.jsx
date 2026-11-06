import Link from "next/link";
import clsx from "clsx";
import { AlertTriangle, ArrowDownRight, ArrowUpRight } from "lucide-react";

export function PageTitle({ title, intro, action }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="display text-2xl leading-8 font-bold text-forest md:text-[1.75rem] md:leading-9">{title}</h1>
        {intro && <p className="mt-1.5 max-w-2xl text-[15px] leading-6 font-medium tracking-[-0.01em] text-muted">{intro}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ title, subtitle, action, children, className, padded = true, divided = true }) {
  return (
    <section className={clsx("overflow-hidden rounded-2xl bg-white ring-1 ring-forest/[0.06]", className)}>
      {title && (
        <div className={clsx("flex items-start justify-between gap-4 px-5 pt-4", divided ? "border-b border-forest/[0.06] pb-4" : "pb-1")}>
          <div className="min-w-0">
            <h2 className="text-[15px] leading-6 font-semibold tracking-[-0.01em] text-forest">{title}</h2>
            {subtitle && <p className="text-[12.5px] font-medium text-muted">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={padded ? "p-5" : ""}>{children}</div>
    </section>
  );
}

// Stat tile: sentence-case label, semibold value, optional change pill and hint.
export function Stat({ label, value, hint, icon: Icon, dark, change, goodWhenUp = true }) {
  return (
    <div className={clsx("relative overflow-hidden rounded-2xl p-5 ring-1", dark ? "bg-forest text-soft ring-forest" : "bg-white text-forest ring-forest/[0.06]")}>
      {dark && <div className="pointer-events-none absolute -top-12 -right-12 size-40 rounded-full bg-orange/15 blur-2xl" aria-hidden="true" />}
      <div className="relative flex items-center justify-between gap-3">
        <p className={clsx("text-[13px] font-medium", dark ? "text-soft/65" : "text-muted")}>{label}</p>
        {Icon && (
          <span className={clsx("grid size-8 place-items-center rounded-lg", dark ? "bg-soft/10 text-orange" : "bg-forest/[0.05] text-forest/70")}>
            <Icon className="size-4" aria-hidden="true" />
          </span>
        )}
      </div>
      <p className="relative mt-3 text-[1.6rem] leading-tight font-semibold tracking-[-0.03em] tabular-nums break-words">{value}</p>
      {(change != null || hint) && (
        <div className="relative mt-2 flex flex-wrap items-center gap-2">
          {change != null && <Change value={change} dark={dark} goodWhenUp={goodWhenUp} />}
          {hint && <p className={clsx("text-[12.5px] font-medium", dark ? "text-soft/55" : "text-forest/50")}>{hint}</p>}
        </div>
      )}
    </div>
  );
}

// Signed change vs the previous period. Arrow + words carry direction, not colour alone.
export function Change({ value, dark, goodWhenUp = true }) {
  const up = value >= 0;
  const good = up === goodWhenUp;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11.5px] font-semibold tabular-nums",
        dark ? (good ? "bg-emerald-400/15 text-emerald-300" : "bg-red-400/15 text-red-300") : good ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700",
      )}
    >
      <Icon className="size-3" aria-hidden="true" />
      <span className="sr-only">{up ? "Up" : "Down"} </span>
      {Math.abs(value * 100).toFixed(1)}%
    </span>
  );
}

// Horizontal magnitude bars, one hue. rows: [{ label, value, display }]
export function BarList({ rows, max }) {
  const top = max ?? Math.max(...rows.map((r) => r.value), 1);
  return (
    <ul className="space-y-4">
      {rows.map((r) => (
        <li key={r.label}>
          <div className="flex items-baseline justify-between gap-3 text-[13px]">
            <span className="font-medium text-forest/70">{r.label}</span>
            <span className="font-semibold text-forest tabular-nums">{r.display ?? r.value}</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-forest/[0.06]">
            <div className="h-full rounded-full bg-forest" style={{ width: `${Math.max((r.value / top) * 100, r.value > 0 ? 2 : 0)}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

// Thin progress track, e.g. how far through its dates a campaign is.
export function Progress({ value, label }) {
  const pct = Math.round(Math.min(Math.max(value, 0), 1) * 100);
  return (
    <div className="flex items-center gap-2.5" title={label}>
      <div className="h-1.5 w-full min-w-16 overflow-hidden rounded-full bg-forest/[0.07]" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
        <div className={clsx("h-full rounded-full", pct >= 100 ? "bg-forest/40" : "bg-orange")} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-9 shrink-0 text-right text-[12px] font-medium text-forest/50 tabular-nums">{pct}%</span>
    </div>
  );
}

const TONES = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  orange: "bg-orange/10 text-[#9A3412] ring-orange/30",
  grey: "bg-forest/5 text-forest/60 ring-forest/10",
  red: "bg-red-50 text-red-700 ring-red-600/20",
};

const STATUS_TONE = {
  PENDING: "orange", APPROVING: "orange", APPROVED: "green", REJECTED: "red", CANCELLED: "grey",
  ONGOING: "green", ACTIVE: "green", COMPLETED: "grey", PAUSED: "orange",
  completed: "green", paid: "green", PAID: "green", pending: "orange", needs_review: "orange",
  complete: "green", invited: "orange", email_verified: "orange", flow_started: "orange", in_progress: "orange", error: "red", canceled: "grey", deleted: "grey",
};

export function Badge({ status, children }) {
  const tone = TONES[STATUS_TONE[status] || "grey"];
  return (
    <span className={clsx("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold whitespace-nowrap ring-1 ring-inset", tone)}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {children || String(status || "").replace(/_/g, " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}
    </span>
  );
}

export function Empty({ icon: Icon, title, body, action }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      {Icon && <span className="grid size-12 place-items-center rounded-2xl bg-forest/5 text-forest/50"><Icon className="size-5" aria-hidden="true" /></span>}
      <p className="mt-4 text-[15px] font-semibold text-forest">{title}</p>
      {body && <p className="mt-1 max-w-sm text-[13.5px] font-medium text-muted">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function GradeUnavailable() {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-orange/10 p-5 text-[14px] font-medium text-[#9A3412]">
      <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      <p>We couldn&apos;t load live campaign data just now. Please refresh in a minute. If it keeps happening, contact your VGA campaign lead.</p>
    </div>
  );
}

export function Table({ head, children, minWidth = "40rem" }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-[13.5px]" style={{ minWidth }}>
        <thead>
          <tr className="border-b border-forest/[0.06] bg-forest/[0.015] text-[12px] font-medium text-muted">
            {head.map((h, i) => (
              <th key={h || i} scope="col" className={clsx("px-5 py-2.5 font-medium", i === head.length - 1 && h !== "" ? "text-right" : "")}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-forest/[0.05]">{children}</tbody>
      </table>
    </div>
  );
}

export function ButtonLink({ href, children, variant = "dark" }) {
  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex h-10 items-center gap-2 rounded-xl px-4 text-[13.5px] font-medium whitespace-nowrap transition-colors",
        variant === "dark" ? "bg-forest text-soft hover:bg-emerald" : variant === "orange" ? "bg-orange text-ink hover:bg-orange-soft" : "bg-white text-forest ring-1 ring-forest/15 hover:ring-forest/40",
      )}
    >
      {children}
    </Link>
  );
}

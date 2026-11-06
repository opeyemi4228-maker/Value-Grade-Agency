import Link from "next/link";
import clsx from "clsx";
import { AlertTriangle } from "lucide-react";

export function PageTitle({ title, intro, action }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="display text-[1.9rem] text-forest sm:text-[2.3rem]">{title}</h1>
        {intro && <p className="mt-2 max-w-2xl text-[15px] font-medium text-forest/60">{intro}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ title, action, children, className, padded = true }) {
  return (
    <section className={clsx("overflow-hidden rounded-2xl bg-white ring-1 ring-forest/[0.06]", className)}>
      {title && (
        <div className="flex items-center justify-between gap-4 border-b border-forest/[0.06] px-5 py-4">
          <h2 className="text-[15px] font-extrabold tracking-tight text-forest">{title}</h2>
          {action}
        </div>
      )}
      <div className={padded ? "p-5" : ""}>{children}</div>
    </section>
  );
}

export function Stat({ label, value, hint, icon: Icon, dark }) {
  return (
    <div className={clsx("rounded-2xl p-5 ring-1", dark ? "bg-forest text-soft ring-forest" : "bg-white text-forest ring-forest/[0.06]")}>
      <p className={clsx("flex items-center gap-2 text-[11.5px] font-bold tracking-[0.12em] uppercase", dark ? "text-soft/60" : "text-forest/45")}>
        {Icon && <Icon className="size-4 text-orange" aria-hidden="true" />}
        {label}
      </p>
      <p className="display mt-3 text-[1.6rem] leading-tight tabular-nums break-words 2xl:text-[1.9rem]">{value}</p>
      {hint && <p className={clsx("mt-1 text-[12.5px] font-medium", dark ? "text-soft/55" : "text-forest/50")}>{hint}</p>}
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
    <span className={clsx("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold whitespace-nowrap ring-1 ring-inset", tone)}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {children || String(status || "").replace(/_/g, " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}
    </span>
  );
}

export function Empty({ icon: Icon, title, body, action }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      {Icon && <span className="grid size-12 place-items-center rounded-2xl bg-forest/5 text-forest/50"><Icon className="size-5" aria-hidden="true" /></span>}
      <p className="mt-4 text-[15px] font-bold text-forest">{title}</p>
      {body && <p className="mt-1 max-w-sm text-[13.5px] font-medium text-forest/55">{body}</p>}
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
          <tr className="border-b border-forest/[0.06] text-[11px] font-bold tracking-[0.1em] text-forest/45 uppercase">
            {head.map((h, i) => (
              <th key={h || i} scope="col" className={clsx("px-5 py-3 font-bold", i === head.length - 1 && h !== "" ? "text-right" : "")}>{h}</th>
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
        "inline-flex h-10 items-center gap-2 rounded-xl px-4 text-[13.5px] font-bold transition-colors",
        variant === "dark" ? "bg-forest text-soft hover:bg-orange hover:text-ink" : "bg-white text-forest ring-1 ring-forest/15 hover:ring-forest/40",
      )}
    >
      {children}
    </Link>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import {
  ArrowUpRight,
  Briefcase,
  CalendarDays,
  Check,
  ChevronDown,
  Download,
  Ellipsis,
  Inbox,
  LayoutGrid,
  MailPlus,
  Plus,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";
import { RANGES } from "@/lib/admin/metrics";
import { BarList, Gauge, ShareBar, Sparkline, TrendChart, TrendLegend, WeekdayBars } from "./charts";
import { fmtDate, fmtHours, fmtNum, fmtPct, timeAgo } from "./format";
import { Avatar, DeltaPill, IntentBadge, SampleTag, StatusBadge, btn } from "./ui";

// ---- Widget registry ------------------------------------------------------------------

const WIDGETS = [
  { id: "trend", col: "main", title: "Enquiries over time", tag: "Performance", desc: "Daily enquiries against the previous period, with the mix by enquiry type.", preview: "line" },
  { id: "recent", col: "main", title: "Latest enquiries", tag: "Inbox", desc: "The newest submissions from every form on the website.", preview: "table" },
  { id: "budgets", col: "main", title: "Budget ranges", tag: "Pipeline", desc: "Budget bands chosen on proposal and strategy-call requests.", preview: "bars" },
  { id: "weekday", col: "side", title: "Busiest day", tag: "Audience", desc: "Which weekdays bring in the most enquiries.", preview: "columns" },
  { id: "response", col: "side", title: "Reply rate", tag: "Operations", desc: "Share of enquiries with a reply logged, against the 80% target.", preview: "gauge" },
  { id: "newsletter", col: "side", title: "Newsletter growth", tag: "Audience", desc: "Total subscribers over the period.", preview: "line" },
  { id: "services", col: "side", title: "Most requested services", tag: "Strategy", desc: "Which VGA services brands ask about most.", preview: "bars" },
  { id: "activity", col: "side", title: "Recent activity", tag: "Operations", desc: "Status changes, notes and new submissions as they happen.", preview: "table" },
];
const DEFAULT_ON = ["trend", "recent", "weekday", "response", "newsletter", "services"];
const PREF_KEY = "vga-admin:widgets:v1";

function useWidgetPrefs() {
  const [on, setOn] = useState(DEFAULT_ON);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(PREF_KEY) || "null");
      if (Array.isArray(saved)) setOn(saved.filter((id) => WIDGETS.some((w) => w.id === id)));
    } catch {}
    setReady(true);
  }, []);
  const update = (next) => {
    setOn(next);
    try {
      localStorage.setItem(PREF_KEY, JSON.stringify(next));
    } catch {}
  };
  return { on, ready, add: (id) => update([...on, id]), remove: (id) => update(on.filter((x) => x !== id)), reset: () => update(DEFAULT_ON) };
}

// ---- Chrome ---------------------------------------------------------------------------

function WidgetMenu({ onRemove, extra }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const close = (e) => (e.type === "keydown" ? e.key === "Escape" : !ref.current?.contains(e.target)) && setOpen(false);
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="grid size-8 place-items-center rounded-lg text-forest/45 hover:bg-forest/5 hover:text-forest" aria-label="Widget options" aria-expanded={open}>
        <Ellipsis className="size-4" />
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-1 w-44 rounded-xl border border-line bg-white p-1 shadow-lg">
          {extra}
          <button onClick={onRemove} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] font-semibold text-forest/75 hover:bg-soft">
            <X className="size-3.5" aria-hidden="true" /> Remove widget
          </button>
        </div>
      )}
    </div>
  );
}

function Widget({ title, onRemove, action, extra, className, children }) {
  return (
    <section className={clsx("flex flex-col rounded-2xl border border-line/80 bg-white shadow-[0_1px_2px_rgb(1_28_19/0.04)]", className)}>
      <header className="flex items-center justify-between gap-3 px-5 pt-4">
        <h2 className="text-[15px] font-bold tracking-tight text-forest">{title}</h2>
        <div className="flex items-center gap-1">
          {action}
          <WidgetMenu onRemove={onRemove} extra={extra} />
        </div>
      </header>
      <div className="flex-1 px-5 pt-3 pb-5">{children}</div>
    </section>
  );
}

function RangePicker({ value, bounds }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const close = (e) => (e.type === "keydown" ? e.key === "Escape" : !ref.current?.contains(e.target)) && setOpen(false);
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);
  const current = RANGES.find((r) => r.id === value);
  return (
    <div ref={ref} className="relative flex h-9 items-center rounded-full border border-line bg-white text-[13px] font-semibold text-forest">
      <span className="hidden items-center gap-2 border-r border-line pr-3 pl-3.5 text-forest/70 sm:flex">
        <CalendarDays className="size-4" aria-hidden="true" />
        {fmtDate(bounds.start)} – {fmtDate(bounds.end)}
      </span>
      <button onClick={() => setOpen(!open)} className="flex h-full items-center gap-1.5 rounded-full pr-3 pl-3.5 hover:bg-soft sm:pl-3" aria-haspopup="listbox" aria-expanded={open}>
        <CalendarDays className="size-4 sm:hidden" aria-hidden="true" />
        {current.label}
        <ChevronDown className="size-3.5 text-forest/50" aria-hidden="true" />
      </button>
      {open && (
        <ul role="listbox" aria-label="Date range" className="absolute top-full right-0 z-30 mt-2 w-48 rounded-xl border border-line bg-white p-1 shadow-lg">
          {RANGES.map((r) => (
            <li key={r.id} role="option" aria-selected={r.id === value}>
              <button
                onClick={() => {
                  setOpen(false);
                  router.push(`/admin?range=${r.id}`, { scroll: false });
                }}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[13px] font-semibold text-forest/80 hover:bg-soft"
              >
                {r.label}
                {r.id === value && <Check className="size-4 text-forest" strokeWidth={3} aria-hidden="true" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ---- "Add widget" drawer --------------------------------------------------------------

function Preview({ kind }) {
  const box = "relative grid size-full place-items-center rounded-xl bg-white shadow-[0_6px_18px_-10px_rgb(1_28_19/0.35)]";
  if (kind === "gauge")
    return (
      <div className={box}>
        <svg viewBox="0 0 60 34" className="w-14">
          <path d="M6 30a24 24 0 0 1 48 0" fill="none" stroke="#e9ece7" strokeWidth="7" strokeLinecap="round" />
          <path d="M6 30a24 24 0 0 1 38-19.5" fill="none" stroke="#0f7a52" strokeWidth="7" strokeLinecap="round" />
        </svg>
      </div>
    );
  if (kind === "columns")
    return (
      <div className={box}>
        <div className="flex h-12 items-end gap-1.5">
          {[45, 70, 100, 55, 40].map((h, i) => (
            <span key={i} className={clsx("w-2.5 rounded-t-[4px] rounded-b-[2px]", i === 2 ? "bg-forest" : "bg-[#e3e7e2]")} style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    );
  if (kind === "bars")
    return (
      <div className={clsx(box, "content-center gap-1.5 px-4")}>
        {[90, 64, 40].map((w, i) => (
          <span key={i} className="h-2 w-full rounded-full bg-forest/[0.06]">
            <span className="block h-full rounded-full bg-[#0f7a52]" style={{ width: `${w}%`, opacity: 1 - i * 0.2 }} />
          </span>
        ))}
      </div>
    );
  if (kind === "table")
    return (
      <div className={clsx(box, "content-center gap-2 px-4")}>
        {[0, 1, 2].map((i) => (
          <span key={i} className="flex w-full items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-forest/15" />
            <span className="h-1.5 flex-1 rounded-full bg-forest/10" />
            <span className="h-1.5 w-4 rounded-full bg-orange/50" />
          </span>
        ))}
      </div>
    );
  return (
    <div className={box}>
      <svg viewBox="0 0 64 36" className="w-16">
        <path d="M2 30 L14 24 L24 27 L36 14 L46 18 L62 4 L62 36 L2 36Z" fill="#0f7a52" fillOpacity="0.12" />
        <path d="M2 30 L14 24 L24 27 L36 14 L46 18 L62 4" fill="none" stroke="#0f7a52" strokeWidth="2.25" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function AddWidgetPanel({ open, onClose, on, add, reset }) {
  const closeRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="add-widget-title">
      <div className="absolute inset-0 bg-ink/35 backdrop-blur-[3px]" onClick={onClose} />
      <div className="absolute inset-y-2 right-2 flex w-[min(30rem,calc(100vw-1rem))] flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-[0_32px_64px_-24px_rgb(1_28_19/0.45)] sm:inset-y-3 sm:right-3">
        <header className="flex items-center justify-between border-b border-line px-6 py-4">
          <div>
            <h2 id="add-widget-title" className="text-lg font-extrabold tracking-tight text-forest">
              Add widget
            </h2>
            <p className="text-xs text-forest/55">Choose what appears on your dashboard. Saved in this browser.</p>
          </div>
          <button ref={closeRef} onClick={onClose} className="grid size-9 place-items-center rounded-full border border-line text-forest/60 hover:text-forest" aria-label="Close">
            <X className="size-4" />
          </button>
        </header>
        <ul className="flex-1 space-y-3 overflow-y-auto p-4">
          {WIDGETS.map((w) => {
            const active = on.includes(w.id);
            return (
              <li key={w.id} className={clsx("flex gap-4 rounded-2xl border p-3 transition-colors", active ? "border-line bg-soft/60" : "border-line hover:border-forest/25")}>
                <div className="size-[92px] shrink-0 rounded-xl bg-[#eef0ec] p-2.5">
                  <Preview kind={w.preview} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="text-sm font-bold text-forest">{w.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-forest/60">{w.desc}</p>
                  <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                    <span className="rounded-md border border-line bg-white px-1.5 py-0.5 text-[10.5px] font-semibold text-forest/55">#{w.tag}</span>
                    {active ? (
                      <span className="inline-flex h-7 items-center gap-1 px-2 text-xs font-bold text-[#0b6b45]">
                        <Check className="size-3.5" strokeWidth={3} aria-hidden="true" /> Added
                      </span>
                    ) : (
                      <button onClick={() => add(w.id)} className="inline-flex h-7 items-center gap-1 rounded-full bg-forest px-3 text-xs font-bold text-soft hover:bg-emerald">
                        <Plus className="size-3.5" aria-hidden="true" /> Add
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <footer className="flex items-center justify-between border-t border-line px-6 py-3.5">
          <button onClick={reset} className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest/60 hover:text-forest">
            <RotateCcw className="size-3.5" aria-hidden="true" /> Reset to default
          </button>
          <button onClick={onClose} className={btn("primary")}>
            Done
          </button>
        </footer>
      </div>
    </div>
  );
}

// ---- KPI row --------------------------------------------------------------------------

function Kpi({ label, icon: Icon, k, href }) {
  return (
    <Link href={href} className="group rounded-2xl border border-line/80 bg-white p-5 shadow-[0_1px_2px_rgb(1_28_19/0.04)] transition-all hover:-translate-y-0.5 hover:border-forest/20 hover:shadow-[0_12px_28px_-16px_rgb(1_28_19/0.35)]">
      <div className="flex items-center justify-between">
        <p className="text-[13.5px] font-semibold text-forest/75">{label}</p>
        <span className="grid size-8 place-items-center rounded-lg bg-forest/[0.05] text-forest transition-colors group-hover:bg-orange group-hover:text-ink">
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </div>
      <div className="mt-3 flex items-center gap-2.5">
        <p className="text-[1.85rem] leading-none font-extrabold tracking-[-0.03em] text-forest tabular-nums">{fmtNum(k.value)}</p>
        <DeltaPill delta={k.delta} />
      </div>
      <p className="mt-2.5 text-xs text-forest/50">vs. {fmtNum(k.prev)} previous period</p>
    </Link>
  );
}

// ---- Main -----------------------------------------------------------------------------

export default function Dashboard({ m, exportHref, emptyState }) {
  const { on, ready, add, remove, reset } = useWidgetPrefs();
  const [panel, setPanel] = useState(false);
  const closePanel = useCallback(() => setPanel(false), []);
  const show = (id) => on.includes(id);
  const totalCur = m.byIntent.reduce((s, d) => s + d.value, 0);

  const render = {
    trend: () => (
      <Widget key="trend" title="Enquiries over time" onRemove={() => remove("trend")} action={<span className="hidden sm:block"><TrendLegend /></span>}>
        <div className="grid gap-6 xl:grid-cols-[180px_1fr]">
          <div className="flex flex-col justify-center">
            <p className="text-[2.5rem] leading-none font-extrabold tracking-[-0.04em] text-forest tabular-nums">{fmtNum(m.kpis.enquiries.value)}</p>
            <div className="mt-3 flex items-center gap-2 text-xs text-forest/55">
              <DeltaPill delta={m.kpis.enquiries.delta} /> vs. previous period
            </div>
            <p className="mt-4 text-xs leading-relaxed text-forest/50">
              {m.response.medianHours != null ? `Median first reply: ${fmtHours(m.response.medianHours)}` : "No replies logged yet in this period."}
            </p>
          </div>
          <div>
            <TrendChart data={m.trend} bucketDays={m.bucketDays} />
            <div className="mt-2 sm:hidden">
              <TrendLegend />
            </div>
          </div>
        </div>
        <div className="mt-5 rounded-xl border border-line/80 p-4">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-bold text-forest">Enquiry mix</p>
            <Link href="/admin/enquiries" className="text-xs font-semibold text-forest/55 hover:text-forest">
              View all
            </Link>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
            {m.byIntent.map((d) => (
              <Link key={d.id} href={d.id === "creator" ? "/admin/creators" : `/admin/enquiries?intent=${d.id}`} className="group">
                <p className="flex items-center gap-1.5 text-lg font-extrabold text-forest tabular-nums">
                  <span className="size-2.5 rounded-[3px]" style={{ background: d.color }} aria-hidden="true" />
                  {fmtNum(d.value)}
                </p>
                <p className="text-[11.5px] text-forest/55 group-hover:text-forest">{d.label}</p>
              </Link>
            ))}
          </div>
          <div className="mt-4">
            <ShareBar items={m.byIntent} />
          </div>
          {totalCur === 0 && <p className="mt-2 text-xs text-forest/45">No enquiries in this period yet.</p>}
        </div>
      </Widget>
    ),
    recent: () => (
      <Widget
        key="recent"
        title="Latest enquiries"
        onRemove={() => remove("recent")}
        action={
          <Link href="/admin/enquiries" className="hidden items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-forest/60 hover:bg-soft hover:text-forest sm:inline-flex">
            Open inbox <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        }
      >
        {m.recent.length ? (
          <div className="-mx-5 overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-[13px]">
              <thead>
                <tr className="text-[10.5px] font-bold tracking-[0.1em] text-forest/45 uppercase">
                  <th className="px-5 pb-2 font-bold">From</th>
                  <th className="pb-2 font-bold">Type</th>
                  <th className="pb-2 font-bold">Service</th>
                  <th className="pb-2 font-bold">Received</th>
                  <th className="px-5 pb-2 text-right font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {m.recent.map((e) => (
                  <tr key={e.id} className="group border-t border-dashed border-line">
                    <td className="px-5 py-3">
                      <Link href={`/admin/enquiries/${e.id}`} className="flex items-center gap-3">
                        <Avatar name={e.fullName} className="size-8 text-[11px]" />
                        <span className="min-w-0">
                          <span className="flex items-center gap-2 font-semibold text-forest group-hover:underline">
                            <span className="max-w-[150px] truncate">{e.company || e.fullName}</span>
                            {e.sample && <SampleTag />}
                          </span>
                          <span className="block max-w-[190px] truncate text-xs text-forest/50">{e.company ? e.fullName : e.email}</span>
                        </span>
                      </Link>
                    </td>
                    <td className="py-3 pr-4 whitespace-nowrap">
                      <IntentBadge intent={e.intent} />
                    </td>
                    <td className="max-w-[150px] truncate py-3 pr-4 text-forest/70">{e.service || "—"}</td>
                    <td className="py-3 whitespace-nowrap text-forest/60">{timeAgo(e.createdAt)}</td>
                    <td className="px-5 py-3 text-right">
                      <StatusBadge status={e.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-forest/50">Enquiries from the website will appear here.</p>
        )}
      </Widget>
    ),
    budgets: () => (
      <Widget key="budgets" title="Budget ranges" onRemove={() => remove("budgets")}>
        <BarList items={m.budgets} color="#2a78d6" empty="No budget ranges given in this period." />
      </Widget>
    ),
    weekday: () => (
      <Widget key="weekday" title="Busiest day" onRemove={() => remove("weekday")}>
        <WeekdayBars data={m.weekday} />
      </Widget>
    ),
    response: () => (
      <Widget key="response" title="Reply rate" onRemove={() => remove("response")}>
        <div className="relative">
          <Gauge value={m.response.rate} target={m.response.target} label="Reply rate" />
          <div className="absolute inset-x-0 bottom-1 text-center">
            <p className="text-[2rem] leading-none font-extrabold tracking-[-0.04em] text-forest tabular-nums">{fmtPct(m.response.rate, 0)}</p>
            <p className="mt-1.5 text-[11.5px] text-forest/55">
              {m.response.rate == null
                ? "No enquiries in this period"
                : m.response.rate >= m.response.target
                  ? `On target (${fmtPct(m.response.target, 0)})`
                  : `Target ${fmtPct(m.response.target, 0)} · ${fmtNum(m.response.awaiting)} awaiting reply`}
            </p>
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <Link href="/admin/enquiries?status=new" className={btn("secondary")}>
            Show awaiting reply
          </Link>
        </div>
      </Widget>
    ),
    newsletter: () => (
      <Widget key="newsletter" title="Newsletter growth" onRemove={() => remove("newsletter")}>
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[1.75rem] leading-none font-extrabold tracking-[-0.03em] text-forest tabular-nums">{fmtNum(m.subsTrend.at(-1)?.value ?? 0)}</p>
            <p className="mt-1.5 text-xs text-forest/55">total subscribers</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-forest tabular-nums">+{fmtNum(m.kpis.subscribers.value)}</p>
            <p className="text-[11px] text-forest/50">this period</p>
          </div>
        </div>
        <div className="mt-4">
          <Sparkline data={m.subsTrend} />
        </div>
      </Widget>
    ),
    services: () => (
      <Widget key="services" title="Most requested services" onRemove={() => remove("services")}>
        <BarList items={m.services} empty="No service requests in this period." />
      </Widget>
    ),
    activity: () => (
      <Widget key="activity" title="Recent activity" onRemove={() => remove("activity")}>
        {m.activity.length ? (
          <ol className="relative space-y-4 before:absolute before:top-2 before:bottom-2 before:left-[5px] before:w-px before:bg-line">
            {m.activity.map((a) => (
              <li key={a.id} className="relative flex gap-3 pl-5">
                <span className={clsx("absolute top-1.5 left-0 size-[11px] rounded-full ring-2 ring-white", a.type === "enquiry" ? "bg-orange" : a.type === "subscriber" ? "bg-[#2a78d6]" : "bg-forest/30")} aria-hidden="true" />
                <div className="min-w-0">
                  {a.ref ? (
                    <Link href={`/admin/enquiries/${a.ref}`} className="text-[13px] font-medium text-forest hover:underline">
                      {a.text}
                    </Link>
                  ) : (
                    <p className="text-[13px] font-medium text-forest">{a.text}</p>
                  )}
                  <p className="text-[11px] text-forest/45">{timeAgo(a.at)}</p>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="py-6 text-center text-sm text-forest/50">Nothing yet.</p>
        )}
      </Widget>
    ),
  };

  const main = WIDGETS.filter((w) => w.col === "main" && show(w.id));
  const side = WIDGETS.filter((w) => w.col === "side" && show(w.id));

  return (
    <>
      <div className="flex flex-col gap-4 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-[1.65rem] font-extrabold tracking-[-0.03em] text-forest">Dashboard</h1>
          <p className="mt-1 text-sm text-forest/60">Website enquiries, creator applications and newsletter sign-ups.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <RangePicker value={m.range.id} bounds={m.bounds} />
          <button onClick={() => setPanel(true)} className={btn("secondary")}>
            <LayoutGrid className="size-4" aria-hidden="true" /> Add widget
          </button>
          <a href={exportHref} className={btn("primary")}>
            <Download className="size-4" aria-hidden="true" /> Export
          </a>
        </div>
      </div>

      {emptyState}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="All enquiries" icon={Inbox} k={m.kpis.enquiries} href="/admin/enquiries" />
        <Kpi label="Brand leads" icon={Briefcase} k={m.kpis.brand} href="/admin/enquiries?intent=brand" />
        <Kpi label="Creator applications" icon={Sparkles} k={m.kpis.creators} href="/admin/creators" />
        <Kpi label="New subscribers" icon={MailPlus} k={m.kpis.subscribers} href="/admin/subscribers" />
      </div>

      <div className={clsx("mt-4 grid grid-cols-1 gap-4 transition-opacity xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]", !ready && "opacity-0")}>
        <div className="flex min-w-0 flex-col gap-4">{main.map((w) => render[w.id]())}</div>
        <div className="flex min-w-0 flex-col gap-4">{side.map((w) => render[w.id]())}</div>
      </div>

      {ready && on.length === 0 && (
        <div className="mt-4 rounded-2xl border border-dashed border-forest/20 p-10 text-center">
          <p className="text-sm font-semibold text-forest">Your dashboard is empty.</p>
          <button onClick={() => setPanel(true)} className={clsx(btn("primary"), "mt-4")}>
            <Plus className="size-4" aria-hidden="true" /> Add a widget
          </button>
        </div>
      )}

      <AddWidgetPanel open={panel} onClose={closePanel} on={on} add={add} reset={reset} />
    </>
  );
}


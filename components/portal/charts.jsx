"use client";

// Portal charts. Single-series only (no legend: the card title names the series).
// Specs: 2px line with a ~10% area wash, columns capped at 24px with a 4px rounded top,
// hairline gridlines, sparse labels, a crosshair/tooltip on hover and arrow-key focus,
// and a visually hidden table so screen readers get every value.
import { useId, useMemo, useState } from "react";
import clsx from "clsx";

const FOREST = "#002F1F";

function formatter(format) {
  if (format?.startsWith("currency:")) {
    const currency = format.split(":")[1] || "USD";
    return (n) => {
      try {
        return new Intl.NumberFormat(currency === "NGN" ? "en-NG" : "en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
      } catch {
        return `${currency} ${Math.round(n).toLocaleString()}`;
      }
    };
  }
  return (n) => new Intl.NumberFormat("en", { notation: n >= 10_000 ? "compact" : "standard", maximumFractionDigits: 1 }).format(n);
}

// Round the axis maximum up to a clean number (1, 2, 2.5, 5 × 10^n) and split it into 4 steps.
function niceTicks(max) {
  if (max <= 0) return [0, 1, 2, 3, 4];
  const raw = max / 4;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw);
  return [0, 1, 2, 3, 4].map((i) => i * step);
}

const shortDate = (iso) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(new Date(`${iso}T00:00:00`));

function HiddenTable({ caption, rows, fmt }) {
  return (
    <table className="sr-only">
      <caption>{caption}</caption>
      <tbody>
        {rows.map((r) => (
          <tr key={r.label}><th scope="row">{r.label}</th><td>{fmt(r.value)}</td></tr>
        ))}
      </tbody>
    </table>
  );
}

// Daily values over time. points: [{ date: "YYYY-MM-DD", value }]
export function AreaChart({ points, label, format = "compact", height = 220 }) {
  const fmt = useMemo(() => formatter(format), [format]);
  const [active, setActive] = useState(null);
  const id = useId();

  const max = Math.max(...points.map((p) => p.value), 0);
  const ticks = niceTicks(max);
  const top = ticks[ticks.length - 1] || 1;
  const n = points.length;
  const x = (i) => (n <= 1 ? 50 : (i / (n - 1)) * 100);
  const y = (v) => 100 - (v / top) * 100;

  if (!n) return <p className="py-16 text-center text-[13px] font-medium text-forest/50">No tracked activity in this period yet.</p>;

  const line = points.map((p, i) => `${i ? "L" : "M"}${x(i)},${y(p.value)}`).join(" ");
  const area = `${line} L100,100 L0,100 Z`;
  const last = points[n - 1];
  const shown = active ?? null;

  const pick = (clientX, rect) => {
    const f = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    setActive(Math.round(f * (n - 1)));
  };

  return (
    <div className="select-none">
      <div className="flex">
        {/* Y axis labels */}
        <div className="relative w-11 shrink-0" style={{ height }} aria-hidden="true">
          {ticks.map((t) => (
            <span key={t} className="absolute right-2 -translate-y-1/2 text-[11px] font-medium text-forest/40 tabular-nums" style={{ top: `${y(t)}%` }}>
              {fmt(t)}
            </span>
          ))}
        </div>

        <div
          className="relative min-w-0 flex-1 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-4"
          style={{ height }}
          tabIndex={0}
          role="group"
          aria-label={`${label}. Latest: ${fmt(last.value)} on ${shortDate(last.date)}. Use arrow keys to read each day.`}
          aria-describedby={`${id}-live`}
          onPointerMove={(e) => pick(e.clientX, e.currentTarget.getBoundingClientRect())}
          onPointerLeave={() => setActive(null)}
          onBlur={() => setActive(null)}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") { e.preventDefault(); setActive((a) => Math.min((a ?? n - 1) + 1, n - 1)); }
            if (e.key === "ArrowLeft") { e.preventDefault(); setActive((a) => Math.max((a ?? n) - 1, 0)); }
            if (e.key === "Home") setActive(0);
            if (e.key === "End") setActive(n - 1);
          }}
        >
          {/* Gridlines */}
          {ticks.map((t) => (
            <span key={t} className={clsx("absolute inset-x-0 h-px", t === 0 ? "bg-forest/15" : "bg-forest/[0.06]")} style={{ top: `${y(t)}%` }} aria-hidden="true" />
          ))}

          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible" aria-hidden="true">
            <path d={area} fill={FOREST} fillOpacity="0.08" />
            <path d={line} fill="none" stroke={FOREST} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>

          {/* End marker + label (the one direct label) */}
          {shown === null && (
            <>
              <span className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange ring-2 ring-white" style={{ left: `${x(n - 1)}%`, top: `${y(last.value)}%` }} aria-hidden="true" />
              <span className="absolute -translate-x-full -translate-y-[calc(100%+10px)] rounded-md bg-white/90 px-1.5 text-[12px] font-semibold text-forest tabular-nums" style={{ left: `${x(n - 1)}%`, top: `${y(last.value)}%` }} aria-hidden="true">
                {fmt(last.value)}
              </span>
            </>
          )}

          {/* Crosshair + tooltip */}
          {shown !== null && (
            <>
              <span className="pointer-events-none absolute inset-y-0 w-px bg-forest/25" style={{ left: `${x(shown)}%` }} aria-hidden="true" />
              <span className="pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-forest ring-2 ring-white" style={{ left: `${x(shown)}%`, top: `${y(points[shown].value)}%` }} aria-hidden="true" />
              <span
                className={clsx(
                  "pointer-events-none absolute top-0 z-10 rounded-lg bg-forest px-3 py-2 text-soft shadow-lg",
                  x(shown) > 70 ? "-translate-x-[calc(100%+12px)]" : "translate-x-3",
                )}
                style={{ left: `${x(shown)}%` }}
                aria-hidden="true"
              >
                <span className="block text-[11px] font-medium whitespace-nowrap text-soft/60">{shortDate(points[shown].date)}</span>
                <span className="block text-[14px] font-semibold whitespace-nowrap tabular-nums">{fmt(points[shown].value)}</span>
              </span>
            </>
          )}
          <span id={`${id}-live`} className="sr-only" aria-live="polite">
            {shown !== null ? `${shortDate(points[shown].date)}: ${fmt(points[shown].value)}` : ""}
          </span>
        </div>
      </div>

      {/* X axis: first, middle, last */}
      <div className="mt-2 ml-11 flex justify-between text-[11px] font-medium text-forest/40" aria-hidden="true">
        <span>{shortDate(points[0].date)}</span>
        <span>{shortDate(points[Math.floor((n - 1) / 2)].date)}</span>
        <span>{shortDate(last.date)}</span>
      </div>

      <HiddenTable caption={label} rows={points.map((p) => ({ label: p.date, value: p.value }))} fmt={fmt} />
    </div>
  );
}

// Columns for a handful of periods. bars: [{ label, value }]. The latest column is the accent.
export function ColumnChart({ bars, label, format = "compact", height = 180 }) {
  const fmt = useMemo(() => formatter(format), [format]);
  const [active, setActive] = useState(null);
  const ticks = niceTicks(Math.max(...bars.map((b) => b.value), 0));
  const top = ticks[ticks.length - 1] || 1;
  const latest = bars.length - 1;

  return (
    <div className="select-none">
      <div className="flex">
        <div className="relative w-14 shrink-0" style={{ height }} aria-hidden="true">
          {ticks.map((t) => (
            <span key={t} className="absolute right-2 -translate-y-1/2 text-[11px] font-medium text-forest/40 tabular-nums" style={{ top: `${100 - (t / top) * 100}%` }}>
              {fmt(t)}
            </span>
          ))}
        </div>
        <div className="relative min-w-0 flex-1" style={{ height }} role="img" aria-label={`${label}. Latest month: ${fmt(bars[latest]?.value || 0)}.`}>
          {ticks.map((t) => (
            <span key={t} className={clsx("absolute inset-x-0 h-px", t === 0 ? "bg-forest/15" : "bg-forest/[0.06]")} style={{ top: `${100 - (t / top) * 100}%` }} aria-hidden="true" />
          ))}
          <div className="absolute inset-0 flex items-end justify-around">
            {bars.map((b, i) => {
              const h = (b.value / top) * 100;
              const on = active === i;
              return (
                <button
                  key={b.label}
                  type="button"
                  className="group relative flex h-full w-full max-w-20 items-end justify-center outline-none"
                  onPointerEnter={() => setActive(i)}
                  onPointerLeave={() => setActive(null)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  aria-label={`${b.label}: ${fmt(b.value)}`}
                >
                  <span
                    className={clsx(
                      "w-6 rounded-t-[4px] transition-[background-color,opacity] duration-150 group-focus-visible:ring-2 group-focus-visible:ring-orange group-focus-visible:ring-offset-2",
                      i === latest ? "bg-orange" : "bg-forest",
                      active !== null && !on && "opacity-40",
                    )}
                    style={{ height: b.value > 0 ? `max(${h}%, 4px)` : 0 }}
                  />
                  {(on || (active === null && i === latest && b.value > 0)) && (
                    <span className="pointer-events-none absolute z-10 -translate-y-2 rounded-lg bg-forest px-2.5 py-1.5 text-[12px] font-semibold whitespace-nowrap text-soft tabular-nums shadow-lg" style={{ bottom: `${h}%` }}>
                      {fmt(b.value)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="mt-2 ml-14 flex justify-around text-[11px] font-medium text-forest/45" aria-hidden="true">
        {bars.map((b) => <span key={b.label} className="w-full max-w-20 text-center">{b.label}</span>)}
      </div>
      <HiddenTable caption={label} rows={bars} fmt={fmt} />
    </div>
  );
}

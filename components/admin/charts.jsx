"use client";

// Dependency-free SVG charts for the admin dashboard.
// Specs: 2px lines, recessive grid, crosshair + one tooltip listing every series on line charts,
// per-mark tooltips on bars, keyboard access (arrow keys), and a screen-reader table for each.
import { useEffect, useId, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { fmtNum, fmtPct, fmtShortDate } from "./format";

const C = {
  cur: "#0f7a52",
  prev: "#9aa8a1",
  grid: "#e9ebe6",
  axis: "#7c8a83",
  muted: "#dfe3de",
};

function useWidth() {
  const ref = useRef(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

function niceMax(v) {
  if (v <= 4) return 4;
  const pow = 10 ** Math.floor(Math.log10(v));
  const n = v / pow;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
  return step * pow;
}

function SrTable({ caption, head, rows }) {
  return (
    <table className="sr-only">
      <caption>{caption}</caption>
      <thead>
        <tr>
          {head.map((h) => (
            <th key={h} scope="col">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {r.map((c, j) => (
              <td key={j}>{c}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ---- Trend: this period (area + line) vs previous period (dashed) --------------------

export function TrendChart({ data, bucketDays = 1, height = 232, curLabel = "This period", prevLabel = "Previous period" }) {
  const [ref, width] = useWidth();
  const [hover, setHover] = useState(null);
  const gid = useId().replace(/:/g, "");
  const pad = { t: 12, r: 8, b: 26, l: 30 };
  const w = Math.max(0, width - pad.l - pad.r);
  const h = height - pad.t - pad.b;
  const max = niceMax(Math.max(1, ...data.map((d) => Math.max(d.cur, d.prev))));
  const x = (i) => pad.l + (data.length <= 1 ? w / 2 : (i / (data.length - 1)) * w);
  const y = (v) => pad.t + h - (v / max) * h;

  // Monotone-ish smoothing: cubic segments with horizontal tangents (no overshoot below zero).
  const path = (key) =>
    data
      .map((d, i) => {
        if (i === 0) return `M${x(0)},${y(d[key])}`;
        const mx = (x(i - 1) + x(i)) / 2;
        return `C${mx},${y(data[i - 1][key])} ${mx},${y(d[key])} ${x(i)},${y(d[key])}`;
      })
      .join("");
  const curPath = width ? path("cur") : "";
  const area = width ? `${curPath}L${x(data.length - 1)},${pad.t + h}L${x(0)},${pad.t + h}Z` : "";
  const ticks = [0, max / 2, max];
  const labelEvery = Math.ceil(data.length / Math.max(2, Math.floor(w / 72)));
  const label = (d) => (bucketDays > 1 ? `Week to ${fmtShortDate(d.date)}` : fmtShortDate(d.date));

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left - pad.l;
    setHover(Math.max(0, Math.min(data.length - 1, Math.round((px / w) * (data.length - 1)))));
  };
  const onKey = (e) => {
    if (e.key === "ArrowRight") setHover((h) => Math.min(data.length - 1, (h ?? -1) + 1));
    else if (e.key === "ArrowLeft") setHover((h) => Math.max(0, (h ?? data.length) - 1));
    else return;
    e.preventDefault();
  };
  const hd = hover != null ? data[hover] : null;

  return (
    <div ref={ref} className="relative w-full" style={{ height }}>
      {width > 0 && (
        <svg
          width={width}
          height={height}
          className="block touch-pan-y outline-none focus-visible:ring-2 focus-visible:ring-orange/60 rounded-lg"
          role="img"
          aria-label={`Enquiries over time. Use left and right arrow keys to read values.`}
          tabIndex={0}
          onPointerMove={onMove}
          onPointerLeave={() => setHover(null)}
          onKeyDown={onKey}
          onBlur={() => setHover(null)}
        >
          <defs>
            <linearGradient id={`g${gid}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={C.cur} stopOpacity="0.22" />
              <stop offset="100%" stopColor={C.cur} stopOpacity="0" />
            </linearGradient>
          </defs>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={pad.l} x2={pad.l + w} y1={y(t)} y2={y(t)} stroke={C.grid} strokeDasharray={t === 0 ? undefined : "3 4"} />
              <text x={pad.l - 8} y={y(t)} dy="0.32em" textAnchor="end" fontSize="10.5" fill={C.axis} className="tabular-nums">
                {fmtNum(t)}
              </text>
            </g>
          ))}
          {data.map((d, i) =>
            (i % labelEvery === 0 && data.length - 1 - i >= labelEvery * 0.6) || i === data.length - 1 ? (
              <text key={d.date} x={x(i)} y={height - 6} textAnchor={i === 0 ? "start" : i === data.length - 1 ? "end" : "middle"} fontSize="10.5" fill={C.axis}>
                {fmtShortDate(d.date)}
              </text>
            ) : null,
          )}
          <path d={path("prev")} fill="none" stroke={C.prev} strokeWidth="1.75" strokeDasharray="4 4" strokeLinecap="round" />
          <path d={area} fill={`url(#g${gid})`} />
          <path d={curPath} fill="none" stroke={C.cur} strokeWidth="2.25" strokeLinejoin="round" strokeLinecap="round" />
          {hd && (
            <g pointerEvents="none">
              <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={pad.t + h} stroke={C.axis} strokeDasharray="3 3" strokeOpacity="0.7" />
              <circle cx={x(hover)} cy={y(hd.prev)} r="4" fill="white" stroke={C.prev} strokeWidth="2" />
              <circle cx={x(hover)} cy={y(hd.cur)} r="5" fill={C.cur} stroke="white" strokeWidth="2" />
            </g>
          )}
        </svg>
      )}
      {hd && (
        <div
          className="pointer-events-none absolute z-10 w-44 rounded-xl border border-line bg-white px-3 py-2.5 shadow-[0_12px_32px_-12px_rgb(1_28_19/0.3)]"
          style={{ left: Math.max(0, x(hover) + 188 > width ? x(hover) - 188 : x(hover) + 12), top: 6 }}
          role="status"
        >
          <p className="text-[11px] font-bold text-forest">{label(hd)}</p>
          <p className="mt-1.5 flex items-center gap-2 text-xs text-forest/60">
            <span className="h-0.5 w-3 rounded-full" style={{ background: C.cur }} aria-hidden="true" />
            <span className="font-bold text-forest tabular-nums">{fmtNum(hd.cur)}</span> {curLabel.toLowerCase()}
          </p>
          <p className="mt-1 flex items-center gap-2 text-xs text-forest/60">
            <span className="h-0 w-3 border-t-2 border-dashed" style={{ borderColor: C.prev }} aria-hidden="true" />
            <span className="font-bold text-forest tabular-nums">{fmtNum(hd.prev)}</span> {prevLabel.toLowerCase()}
          </p>
        </div>
      )}
      <SrTable caption="Enquiries per period" head={["Date", curLabel, prevLabel]} rows={data.map((d) => [label(d), d.cur, d.prev])} />
    </div>
  );
}

export function TrendLegend({ curLabel = "This period", prevLabel = "Previous period" }) {
  return (
    <div className="flex items-center gap-4 text-xs font-medium text-forest/60">
      <span className="flex items-center gap-1.5">
        <span className="h-0.5 w-4 rounded-full" style={{ background: C.cur }} aria-hidden="true" />
        {curLabel}
      </span>
      <span className="flex items-center gap-1.5">
        <span className="w-4 border-t-2 border-dashed" style={{ borderColor: C.prev }} aria-hidden="true" />
        {prevLabel}
      </span>
    </div>
  );
}

// ---- Sparkline (single series, no legend: the card title names it) ------------------

export function Sparkline({ data, height = 56, color = C.cur }) {
  const [ref, width] = useWidth();
  const [hover, setHover] = useState(null);
  const vals = data.map((d) => d.value);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const span = max - min || 1;
  const x = (i) => (data.length <= 1 ? width / 2 : (i / (data.length - 1)) * (width - 4) + 2);
  const y = (v) => 4 + (height - 8) * (1 - (v - min) / span);
  const d = data.map((p, i) => `${i ? "L" : "M"}${x(i)},${y(p.value)}`).join("");
  const hd = hover != null ? data[hover] : null;
  return (
    <div ref={ref} className="relative w-full" style={{ height }}>
      {width > 0 && (
        <svg
          width={width}
          height={height}
          className="block"
          aria-hidden="true"
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setHover(Math.max(0, Math.min(data.length - 1, Math.round(((e.clientX - r.left) / width) * (data.length - 1)))));
          }}
          onPointerLeave={() => setHover(null)}
        >
          <path d={`${d}L${x(data.length - 1)},${height}L${x(0)},${height}Z`} fill={color} fillOpacity="0.08" />
          <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          {hd && <circle cx={x(hover)} cy={y(hd.value)} r="4.5" fill={color} stroke="white" strokeWidth="2" />}
        </svg>
      )}
      {hd && (
        <div className="pointer-events-none absolute -top-9 rounded-lg border border-line bg-white px-2 py-1 text-[11px] whitespace-nowrap shadow-md" style={{ left: Math.min(Math.max(x(hover) - 50, 0), width - 110) }}>
          <span className="font-bold text-forest tabular-nums">{fmtNum(hd.value)}</span> <span className="text-forest/55">by {fmtShortDate(hd.date)}</span>
        </div>
      )}
    </div>
  );
}

// ---- Weekday columns: busiest day emphasised, the rest recessive ---------------------

export function WeekdayBars({ data, height = 168 }) {
  const [hover, setHover] = useState(null);
  const max = Math.max(1, ...data.map((d) => d.value));
  const top = data.reduce((a, b) => (b.value > a.value ? b : a), data[0]);
  return (
    <div>
      <div className="flex items-end justify-between gap-2" style={{ height }} role="img" aria-label={`Enquiries by weekday. Busiest: ${top.label} with ${top.value}.`}>
        {data.map((d, i) => {
          const isTop = d === top && d.value > 0;
          const pct = Math.max(6, (d.value / max) * 100);
          return (
            <div
              key={d.label}
              className="relative flex h-full flex-1 flex-col items-center justify-end"
              onPointerEnter={() => setHover(i)}
              onPointerLeave={() => setHover(null)}
              tabIndex={0}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              aria-label={`${d.label}: ${d.value}`}
            >
              {(isTop || hover === i) && (
                <span className={clsx("mb-1.5 text-[11px] font-bold tabular-nums", isTop ? "text-forest" : "text-forest/70")}>{fmtNum(d.value)}</span>
              )}
              <div
                className={clsx("w-full max-w-11 rounded-t-[10px] rounded-b-[4px] transition-colors", isTop ? "bg-gradient-to-b from-[#16935f] to-forest" : hover === i ? "bg-[#cdd5cf]" : "bg-[#e9ece7]")}
                style={{ height: `${pct}%` }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2.5 flex justify-between gap-2">
        {data.map((d) => (
          <span key={d.label} className={clsx("flex-1 text-center text-[11px]", d === top && d.value > 0 ? "font-bold text-forest" : "text-forest/50")}>
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ---- Response-rate gauge: tick ring, filled to the rate, target marker -------------

export function Gauge({ value, target, label }) {
  const ticks = 44;
  const filled = value == null ? 0 : Math.round(value * ticks);
  const targetTick = Math.round(target * ticks);
  const cx = 120;
  const cy = 118;
  const r1 = 92;
  const r2 = 112;
  return (
    <svg viewBox="0 0 240 132" className="mx-auto block w-full max-w-[280px]" role="img" aria-label={`${label}: ${fmtPct(value, 0)}. Target ${fmtPct(target, 0)}.`}>
      {Array.from({ length: ticks + 1 }, (_, i) => {
        const a = Math.PI - (i / ticks) * Math.PI;
        const isTarget = i === targetTick;
        const inner = isTarget ? r1 - 6 : r1;
        const outer = isTarget ? r2 + 4 : r2;
        return (
          <line
            key={i}
            x1={cx + inner * Math.cos(a)}
            y1={cy - inner * Math.sin(a)}
            x2={cx + outer * Math.cos(a)}
            y2={cy - outer * Math.sin(a)}
            stroke={isTarget ? "#ff6a00" : i <= filled && filled > 0 ? (i / ticks < 0.5 ? "#62b58c" : "#0f7a52") : C.muted}
            strokeWidth={isTarget ? 3 : 4}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

// ---- Stacked share bar (intent mix) ----------------------------------------------------

export function ShareBar({ items }) {
  const [hover, setHover] = useState(null);
  const total = items.reduce((s, d) => s + d.value, 0);
  return (
    <div className="relative">
      <div className="flex h-3 w-full gap-[2px] overflow-hidden rounded-full bg-forest/[0.05]" role="img" aria-label={items.map((d) => `${d.label}: ${d.value}`).join(", ")}>
        {total > 0 &&
          items
            .filter((d) => d.value > 0)
            .map((d) => (
              <span
                key={d.id}
                className="h-full transition-opacity first:rounded-l-full last:rounded-r-full"
                style={{ width: `${(d.value / total) * 100}%`, background: d.color, opacity: hover && hover !== d.id ? 0.45 : 1 }}
                onPointerEnter={() => setHover(d.id)}
                onPointerLeave={() => setHover(null)}
              />
            ))}
      </div>
      {hover && (
        <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 rounded-lg border border-line bg-white px-2.5 py-1 text-[11px] whitespace-nowrap shadow-md">
          {(() => {
            const d = items.find((i) => i.id === hover);
            return (
              <>
                <span className="font-bold text-forest tabular-nums">{fmtNum(d.value)}</span> <span className="text-forest/60">{d.label} · {fmtPct(d.value / total, 0)}</span>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}

// ---- Horizontal bar list (top services, budgets) -------------------------------------

export function BarList({ items, color = C.cur, empty = "No data in this period." }) {
  const max = Math.max(1, ...items.map((d) => d.value));
  const total = items.reduce((s, d) => s + d.value, 0);
  const sorted = useMemo(() => items, [items]);
  if (!total) return <p className="py-6 text-center text-sm text-forest/50">{empty}</p>;
  return (
    <ul className="space-y-3">
      {sorted.map((d) => (
        <li key={d.label} className="group">
          <div className="flex items-baseline justify-between gap-3 text-[12.5px]">
            <span className="truncate font-medium text-forest/80" title={d.label}>
              {d.label}
            </span>
            <span className="shrink-0 tabular-nums">
              <span className="font-bold text-forest">{fmtNum(d.value)}</span>
              <span className="ml-1.5 text-forest/45">{fmtPct(d.value / total, 0)}</span>
            </span>
          </div>
          <div className="mt-1.5 h-2 rounded-full bg-forest/[0.05]">
            <div className="h-full rounded-full transition-[width] duration-500 group-hover:brightness-110" style={{ width: `${(d.value / max) * 100}%`, background: color }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

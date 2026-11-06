import StatusPill from "./StatusPill";

// Decorative "product fragment" for inner page heroes. Placeholder data only.
export default function StatusPanel({ title, meta, rows, footer }) {
  return (
    <div className="relative" aria-hidden="true">
      <div className="pointer-events-none absolute -inset-8 rounded-full bg-orange/12 blur-3xl" />
      <div className="relative rounded-panel bg-white p-5 text-forest shadow-[0_40px_100px_-30px_rgb(0_0_0/0.7)] transition-transform duration-500 sm:p-6 lg:rotate-2 lg:hover:rotate-0">
        <div className="flex items-center justify-between gap-3">
          <p className="min-w-0 text-base font-semibold tracking-tight">{title}</p>
          {meta && <span className="shrink-0 rounded-full bg-orange px-2.5 py-1 font-mono text-[10px] font-semibold text-ink">{meta}</span>}
        </div>
        <ul className="mt-5 grid gap-2">
          {rows.map(([label, status, tone]) => (
            <li key={label} className="flex items-center justify-between gap-3 rounded-2xl bg-soft px-3.5 py-3 sm:px-4">
              <span className="min-w-0 text-sm leading-snug font-semibold text-forest/85">{label}</span>
              <StatusPill className="shrink-0 whitespace-nowrap" tone={tone === "orange" ? "orangeLight" : tone === "muted" ? "dark" : "greenLight"}>{status}</StatusPill>
            </li>
          ))}
        </ul>
        {footer && <p className="mt-5 border-t border-forest/10 pt-4 font-mono text-[10px] tracking-wider text-forest/45 uppercase">{footer}</p>}
      </div>
    </div>
  );
}

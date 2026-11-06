import Link from "next/link";
import clsx from "clsx";
import { MARK_VIEWBOX, markShapes } from "./BrandMark";

// tone "light" = white letters for dark backgrounds; "dark" = full-colour for light backgrounds.
export function LogoMark({ tone = "dark", className }) {
  return (
    <svg viewBox={MARK_VIEWBOX} aria-hidden="true" className={clsx("shrink-0", className)}>
      {markShapes(tone === "light" ? "#F4F4F2" : "#002F1F").map((p) => (
        <path key={p.d} {...p} />
      ))}
    </svg>
  );
}

function Wordmark({ tone, tagline }) {
  const light = tone === "light";
  return (
    <span className="flex flex-col leading-none">
      <span className={clsx("text-[13.5px] font-extrabold tracking-[0.14em] transition-colors duration-300", light ? "text-soft" : "text-forest")}>
        VALUE GRADE
      </span>
      <span className="mt-1.5 flex items-center gap-1.5 text-[9px] font-bold tracking-[0.42em] text-orange">
        <span className="h-px flex-1 bg-orange" aria-hidden="true" />
        AGENCY
        <span className="-ml-1.5 h-px flex-1 bg-orange" aria-hidden="true" />
      </span>
      {tagline && (
        <span className={clsx("mt-2.5 text-[8.5px] font-semibold tracking-[0.16em]", light ? "text-soft/70" : "text-forest/60")}>
          TRUST <span className="text-orange">•</span> TRANSPARENCY <span className="text-orange">•</span> RESULTS
        </span>
      )}
    </span>
  );
}

// Horizontal lockup from the letterhead: mark | divider | wordmark.
export default function Logo({ tone = "light", tagline = false, className }) {
  return (
    <Link href="/" aria-label="Value Grade Agency, home" className={clsx("group inline-flex shrink-0 items-center gap-3 whitespace-nowrap", className)}>
      <LogoMark tone={tone} className="h-9 w-auto" />
      <span className={clsx("h-8 w-px", tone === "light" ? "bg-soft/30" : "bg-forest/25")} aria-hidden="true" />
      <Wordmark tone={tone} tagline={tagline} />
    </Link>
  );
}

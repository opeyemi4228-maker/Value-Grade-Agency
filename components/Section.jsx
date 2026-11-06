import clsx from "clsx";

// tone "light": plain page background. "white"/"cream": light band.
// tone "dark": full-width deep-green band. "ink": darker band, for a dark section that follows a dark hero.
export default function Section({ tone = "light", texture, id, className, innerClassName, children }) {
  const dark = tone === "dark" || tone === "ink";
  return (
    <section
      id={id}
      className={clsx(
        "relative overflow-hidden",
        dark ? "py-16 text-soft md:py-24" : "py-16 md:py-24",
        tone === "dark" && "bg-forest",
        tone === "ink" && "bg-ink",
        tone === "white" && "bg-white",
        tone === "cream" && "bg-cream",
        className,
      )}
    >
      {texture === "grid" && <div className={clsx("pointer-events-none absolute inset-0", dark ? "grid-lines fade-mask" : "grid-lines-dark fade-mask")} aria-hidden="true" />}
      {texture === "corner" && dark && <div className="grid-lines-orange corner-mask pointer-events-none absolute inset-0" aria-hidden="true" />}
      {texture === "halftone" && <div className="halftone fade-right pointer-events-none absolute inset-y-0 right-0 w-2/3 opacity-60" aria-hidden="true" />}
      <div className={clsx("relative gutter", innerClassName)}>{children}</div>
    </section>
  );
}

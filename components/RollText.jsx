import clsx from "clsx";

// Text that rolls up to a duplicate of itself when the parent `.group` is hovered.
// `stagger` (ms) offsets each character for a wave effect.
export default function RollText({ text, stagger = 0, className }) {
  return (
    <span className={clsx("relative inline-flex overflow-hidden", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-flex">
        {[...text].map((ch, i) => {
          const glyph = ch === " " ? " " : ch;
          return (
            <span
              key={i}
              className="relative inline-block transition-transform duration-500 ease-[cubic-bezier(0.625,0.05,0,1)] group-hover:-translate-y-full"
              style={stagger ? { transitionDelay: `${i * stagger}ms` } : undefined}
            >
              <span className="block">{glyph}</span>
              <span className="absolute top-full left-0 block">{glyph}</span>
            </span>
          );
        })}
      </span>
    </span>
  );
}

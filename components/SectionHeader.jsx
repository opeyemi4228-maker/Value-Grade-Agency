import clsx from "clsx";
import Reveal from "./Reveal";
import Eyebrow from "./Eyebrow";
import { highlight } from "./Headline";

// Section H2s follow usegrade.com: 24 / 30 / 36px, semibold, -0.03em. Page H1s top out at 48px.
export default function SectionHeader({ eyebrow, title, intro, tone = "light", align = "left", size = "lg", className }) {
  const dark = tone === "dark";
  return (
    <Reveal className={clsx(align === "center" ? "mx-auto max-w-4xl text-center" : "max-w-4xl", className)}>
      {eyebrow && <Eyebrow tone={tone} align={align} className="mb-4">{eyebrow}</Eyebrow>}
      <h2
        className={clsx(
          "display",
          size === "lg" ? "text-2xl leading-8 md:text-3xl md:leading-10 lg:text-4xl lg:leading-[44px]" : "text-xl leading-7 md:text-2xl md:leading-8 lg:text-3xl lg:leading-9",
          dark ? "text-soft" : "text-forest",
        )}
      >
        {highlight(title, "line")}
      </h2>
      {intro && <p className={clsx("mt-4 max-w-2xl text-base leading-relaxed font-medium tracking-[-0.02em] md:text-lg", align === "center" && "mx-auto", dark ? "text-soft/65" : "text-muted")}>{intro}</p>}
    </Reveal>
  );
}

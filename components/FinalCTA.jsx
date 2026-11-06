import Button from "./Button";
import Reveal from "./Reveal";
import Eyebrow from "./Eyebrow";
import { highlight } from "./Headline";
import { bookingUrl, proposalUrl } from "@/lib/site";

export default function FinalCTA({
  title = "Ready to turn creator spend into [measurable] growth?",
  body = "Tell us your goals. A strategist will recommend a campaign structure. No scripted pitch.",
  actions,
}) {
  return (
    <section className="relative overflow-hidden gutter bg-forest py-20 text-center text-soft md:py-28">
      <div className="grid-lines-orange corner-mask pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="halftone pointer-events-none absolute inset-x-0 bottom-0 h-2/3 opacity-40 [mask-image:radial-gradient(ellipse_at_bottom,black_10%,transparent_70%)]" aria-hidden="true" />
      <Reveal className="relative mx-auto max-w-3xl">
        <Eyebrow tone="dark" align="center">Let&apos;s talk</Eyebrow>
        <h2 className="display mt-4 text-3xl leading-9 font-bold md:text-4xl md:leading-[44px] lg:text-5xl lg:leading-[56px]">{highlight(title)}</h2>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-7 font-medium tracking-[-0.02em] text-soft/70 md:text-xl md:leading-8">{body}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {actions ?? (
            <>
              <Button href={bookingUrl} variant="primaryOnDark" size="lg" arrow>Book a Strategy Call</Button>
              <Button href={proposalUrl} variant="ghostLight" size="lg">Request a Proposal</Button>
            </>
          )}
        </div>
      </Reveal>
    </section>
  );
}

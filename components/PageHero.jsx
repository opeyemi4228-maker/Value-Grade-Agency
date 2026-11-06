import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Button from "./Button";
import Reveal from "./Reveal";
import Eyebrow from "./Eyebrow";
import { highlight, plain } from "./Headline";
import { bookingUrl, proposalUrl, site } from "@/lib/site";

// Inner-page hero in the homepage's light, product-led style: copy on the left, and the page's
// product card (`aside`) on a deep-green stage on the right. Breadcrumb data is emitted as JSON-LD.
export default function PageHero({ eyebrow, title, intro, crumb, aside, ctas = true, path }) {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
      { "@type": "ListItem", position: 2, name: crumb, ...(path && { item: `${site.url}${path}` }) },
    ],
  };

  return (
    <section className="relative overflow-hidden">
      <div className="grid-lines-dark pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_70%_at_15%_30%,black,transparent_75%)]" aria-hidden="true" />
      <div className="gutter relative grid items-center gap-12 pt-40 pb-16 sm:pt-48 sm:pb-24 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div className="min-w-0">
          <Reveal>
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.16em] text-forest/45 uppercase">
              <Link href="/" className="transition-colors hover:text-forest">Home</Link>
              <ChevronRight className="size-3" aria-hidden="true" />
              <span className="text-forest/75" aria-current="page">{crumb}</span>
            </nav>
          </Reveal>
          {eyebrow && (
            <Reveal delay={0.05}>
              <Eyebrow className="mt-8">{eyebrow}</Eyebrow>
            </Reveal>
          )}
          <Reveal delay={0.1}>
            <h1 className="display mt-5 text-[2.4rem] leading-[1.08] text-forest sm:text-[3.4rem] xl:text-[4rem]">
              <span className="sr-only">{plain(title)}</span>
              <span aria-hidden="true">{highlight(title)}</span>
            </h1>
          </Reveal>
          {intro && (
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-2xl text-[16px] leading-relaxed font-medium text-forest/65 sm:text-lg">{intro}</p>
            </Reveal>
          )}
          {ctas && (
            <Reveal delay={0.22} className="mt-9 flex flex-col gap-3 sm:flex-row">
              {ctas === true ? (
                <>
                  <Button href={bookingUrl} variant="primary" size="lg" arrow>Book a Strategy Call</Button>
                  <Button href={proposalUrl} variant="ghostDark" size="lg">Request a Proposal</Button>
                </>
              ) : (
                ctas
              )}
            </Reveal>
          )}
        </div>

        {aside && (
          <Reveal delay={0.2}>
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-b from-emerald via-forest to-ink px-6 py-12 sm:px-12 sm:py-16">
              <div className="grid-lines-orange pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_100%,black,transparent_75%)]" aria-hidden="true" />
              <div className="pointer-events-none absolute -bottom-24 left-1/2 size-80 -translate-x-1/2 rounded-full bg-orange/25 blur-3xl" aria-hidden="true" />
              <div className="relative">{aside}</div>
            </div>
          </Reveal>
        )}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    </section>
  );
}

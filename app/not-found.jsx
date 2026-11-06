import Button from "@/components/Button";
import Eyebrow from "@/components/Eyebrow";
import SiteChrome from "@/components/SiteChrome";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <SiteChrome>
    <section className="relative grid min-h-[80vh] place-items-center overflow-hidden bg-forest px-4 pt-24 text-center">
      <div className="grid-lines fade-mask pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative">
        <Eyebrow tone="dark" align="center">404 · Not verified</Eyebrow>
        <h1 className="display mt-6 text-3xl leading-9 font-bold md:text-4xl md:leading-[44px] lg:text-5xl lg:leading-[56px] text-soft">This page doesn&apos;t exist</h1>
        <p className="mx-auto mt-5 max-w-md text-soft/65">The link may be broken or the page may have moved.</p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/" variant="primaryOnDark" size="lg" arrow>Back to home</Button>
          <Button href="/contact" variant="ghostLight" size="lg">Contact us</Button>
        </div>
      </div>
    </section>
    </SiteChrome>
  );
}

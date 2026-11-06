import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileCTA from "@/components/MobileCTA";
import Analytics from "@/components/Analytics";
import CookieConsent from "@/components/CookieConsent";
import HelpNudge from "@/components/HelpNudge";
import { siteJsonLd } from "@/lib/seo";


// Header, footer and site-wide widgets for the public pages. Also used by the root 404,
// which sits outside the (site) route group.
export default function SiteChrome({ children }) {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-full focus:bg-orange focus:px-4 focus:py-2 focus:text-ink">
        Skip to content
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <MobileCTA />
      <HelpNudge />
      <CookieConsent />
      <Analytics />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
    </>
  );
}

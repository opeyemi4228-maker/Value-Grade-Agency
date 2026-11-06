import { Montserrat } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

// Montserrat is the only typeface on the site: headings, body, figures and labels.
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap" });

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Value Grade Agency | Performance Marketing & Creator Campaign Management",
    template: "%s | Value Grade Agency",
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "influencer marketing agency Nigeria",
    "creator campaign management",
    "performance marketing Africa",
    "creator payouts",
    "influencer KYC",
    "affiliate marketing agency",
  ],
  // No site-wide canonical or og:url: each page sets its own via lib/seo.js (pageMeta).
  openGraph: { type: "website", siteName: site.name, locale: "en_GB" },
  twitter: { card: "summary_large_image" },
  creator: site.name,
  publisher: site.name,
  category: "Marketing",
  formatDetection: { telephone: false, email: false, address: false },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  ...(process.env.GOOGLE_SITE_VERIFICATION && { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }),
};

export const viewport = {
  themeColor: "#002F1F",
};

// The public site and the admin share this shell. Site chrome (header, footer, consent,
// analytics) lives in app/(site)/layout.jsx so it never loads inside /admin.
export default function RootLayout({ children }) {
  return (
    <html lang="en-GB" data-scroll-behavior="smooth" className={montserrat.variable}>
      <body>{children}</body>
    </html>
  );
}

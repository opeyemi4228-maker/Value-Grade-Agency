// Central site configuration. Values marked TODO need confirmation from VGA.
import { Building2, Landmark, Layers, Sparkles } from "lucide-react";

export const site = {
  name: "Value Grade Agency",
  shortName: "VGA",
  // Canonical origin. Set NEXT_PUBLIC_SITE_URL in production; Vercel's production domain is the fallback.
  url: (process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) || "http://localhost:3000").replace(/\/$/, ""),
  description:
    "Value Grade Agency runs structured creator, influencer, affiliate and performance-partner campaigns for brands and agencies, with clear deliverables, verified performance, transparent reporting and organised payouts.",
  // TODO(VGA): confirm contact details.
  email: "hello@valuegradeagency.com",
  phone: "+234 000 000 0000",
  whatsapp: "https://wa.me/2340000000000",
  address: "Lagos, Nigeria",
  city: "Lagos",
  timeZone: "Africa/Lagos",
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    { label: "Instagram", href: "https://www.instagram.com/" },
    { label: "X", href: "https://x.com/" },
  ],
};

export const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL || "/contact?intent=call";
export const proposalUrl = "/contact?intent=proposal";

export const audiences = [
  {
    href: "/for-brands",
    label: "For Brands",
    blurb: "Creator campaigns with agreed deliverables and verified results.",
    icon: Building2,
  },
  {
    href: "/for-agencies",
    label: "For Agencies",
    blurb: "A delivery partner for creator execution, payouts and reporting.",
    icon: Layers,
  },
  {
    href: "/for-creators",
    label: "For Creators",
    blurb: "Clear briefs, fair agreements and payouts on record.",
    icon: Sparkles,
  },
  {
    href: "/for-brands#enterprise",
    label: "For Enterprises",
    blurb: "Programme design for telecoms, banks and large organisations.",
    icon: Landmark,
  },
];

export const companyLinks = [
  { href: "/about", label: "About VGA", blurb: "Who we are and how we run campaigns." },
  { href: "/contact", label: "Contact", blurb: "Talk to a strategist about your next campaign." },
];

// Entries with `items` open a dropdown; the rest are plain links.
export const mainNav = [
  { label: "Solutions", items: audiences },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/compliance", label: "Compliance & Trust" },
  { label: "Company", items: companyLinks },
];

// Thin amber strip above the header (usegrade.com style). Set to null to hide it.
// `lead` and `cta` are bold; `text` is the plain middle sentence and is hidden on small screens.
export const announcement = {
  lead: "Paying creators across Nigeria?",
  text: "Every naira should trace back to a verified deliverable.",
  cta: "See how VGA keeps payouts audit-ready",
  href: "/compliance",
};

export const footerNav = [
  {
    title: "Solutions",
    links: [
      { href: "/for-brands", label: "For Brands" },
      { href: "/for-agencies", label: "For Agencies" },
      { href: "/for-creators", label: "For Creators" },
      { href: "/for-brands#enterprise", label: "For Enterprises" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About VGA" },
      { href: "/how-it-works", label: "How It Works" },
      { href: "/contact", label: "Contact" },
      { href: "/contact?intent=proposal", label: "Request a Proposal" },
    ],
  },
  {
    title: "Trust",
    links: [
      { href: "/compliance", label: "Compliance & Trust" },
      { href: "/compliance#kyc", label: "KYC & Verification" },
      { href: "/compliance#records", label: "Payment Records" },
      { href: "/privacy", label: "Privacy Policy" },
    ],
  },
];

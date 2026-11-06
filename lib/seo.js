// Per-page metadata helper: one place that keeps title, description, canonical URL, Open Graph
// and Twitter cards consistent. Each page's social image comes from app/opengraph-image.jsx.
import { site } from "./site";

export function pageMeta({ title, description, path = "/", keywords, absoluteTitle = false }) {
  const fullTitle = absoluteTitle ? title : `${title} | ${site.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    ...(keywords && { keywords }),
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: "en_GB",
      url: path,
      title: fullTitle,
      description,
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
  };
}

// Site-wide structured data: the organisation, the website and the professional service.
// Social profiles are only included once they point at real VGA profiles (not bare domains).
export function siteJsonLd() {
  const url = site.url.replace(/\/$/, "");
  const sameAs = site.socials.map((s) => s.href).filter((h) => /^https?:\/\/[^/]+\/.+/.test(h));
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${url}/#organization`,
        name: site.name,
        alternateName: site.shortName,
        url,
        logo: { "@type": "ImageObject", url: `${url}/icon.svg` },
        email: site.email,
        description: site.description,
        ...(sameAs.length && { sameAs }),
        contactPoint: [{ "@type": "ContactPoint", contactType: "sales", email: site.email, areaServed: ["NG", "GH", "KE", "ZA"], availableLanguage: ["English"] }],
      },
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        url,
        name: site.name,
        inLanguage: "en-GB",
        publisher: { "@id": `${url}/#organization` },
      },
      {
        "@type": "ProfessionalService",
        "@id": `${url}/#service`,
        name: site.name,
        url,
        image: `${url}/opengraph-image`,
        parentOrganization: { "@id": `${url}/#organization` },
        address: { "@type": "PostalAddress", addressLocality: site.city, addressCountry: "NG" },
        areaServed: [
          { "@type": "Country", name: "Nigeria" },
          { "@type": "Place", name: "Africa" },
        ],
        knowsAbout: [
          "Influencer marketing",
          "Creator campaign management",
          "Performance marketing",
          "Affiliate marketing",
          "Creator payouts",
          "KYC and creator verification",
          "Campaign analytics and reporting",
        ],
      },
    ],
  };
}

import { site } from "@/lib/site";

// Public marketing pages are crawlable; the portal, admin, API and one-time auth pages are not.
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin", "/dashboard", "/verify-email", "/reset-password", "/forgot-password"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}

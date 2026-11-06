import { site } from "@/lib/site";

// Public, indexable pages only. Bump UPDATED when page content changes meaningfully.
const UPDATED = new Date("2026-11-06");
const routes = [
  ["", 1, "weekly"],
  ["/for-brands", 0.9, "monthly"],
  ["/for-agencies", 0.9, "monthly"],
  ["/for-creators", 0.9, "monthly"],
  ["/how-it-works", 0.8, "monthly"],
  ["/compliance", 0.8, "monthly"],
  ["/about", 0.7, "monthly"],
  ["/contact", 0.7, "yearly"],
  ["/onboarding", 0.5, "yearly"],
  ["/login", 0.3, "yearly"],
  ["/privacy", 0.2, "yearly"],
];

export default function sitemap() {
  return routes.map(([path, priority, changeFrequency]) => ({
    url: `${site.url}${path}`,
    lastModified: UPDATED,
    changeFrequency,
    priority,
  }));
}

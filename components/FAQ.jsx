import { Plus } from "lucide-react";

// Native <details> accordion: works without JavaScript and is crawlable.
// Emits FAQPage structured data so answers can surface in search results.
export default function FAQ({ items, tone = "light" }) {
  const dark = tone === "dark";
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };

  return (
    <>
      <div className="grid gap-3">
        {items.map(({ q, a }) => (
          <details key={q} className={`group rounded-card px-6 transition-colors sm:px-8 ${dark ? "bg-soft/5 open:bg-soft/10" : "bg-white open:bg-white"}`}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
              <h3 className={`text-base leading-6 font-semibold tracking-[-0.02em] md:text-lg md:leading-7 ${dark ? "text-soft" : "text-forest"}`}>{q}</h3>
              <span className={`grid size-10 shrink-0 place-items-center rounded-full transition-all duration-300 group-open:rotate-45 group-open:bg-orange group-open:text-ink ${dark ? "bg-soft/10 text-soft" : "bg-soft text-forest"}`}>
                <Plus className="size-4" aria-hidden="true" />
              </span>
            </summary>
            <p className={`max-w-3xl pb-7 leading-relaxed font-medium ${dark ? "text-soft/70" : "text-forest/70"}`}>{a}</p>
          </details>
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}

import clsx from "clsx";
import { CalendarDays } from "lucide-react";

// Email capture (brief §9). A plain GET form to /contact, so it works without JavaScript;
// the contact form opens on the strategy-call tab with the email prefilled.
export default function EmailCapture({ id = "hero-email", className, note = "30-minute call with a strategist. No scripted pitch." }) {
  return (
    <div className={clsx("w-full max-w-md", className)}>
      <form action="/contact" method="get" className="flex items-center gap-1.5 rounded-2xl border border-forest/12 bg-white p-1.5 shadow-[0_1px_2px_rgb(0_47_31/0.05),0_12px_30px_-18px_rgb(0_47_31/0.35)] transition focus-within:border-forest/40 focus-within:ring-4 focus-within:ring-forest/[0.06]">
        <input type="hidden" name="intent" value="call" />
        <label htmlFor={id} className="sr-only">Work email</label>
        <input
          id={id}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          className="h-11 min-w-0 flex-1 bg-transparent px-3 text-[15px] font-medium text-forest outline-none placeholder:text-forest/35"
        />
        <button type="submit" className="h-11 shrink-0 rounded-xl bg-forest px-4 text-sm font-medium whitespace-nowrap text-soft transition-colors hover:bg-orange hover:text-ink sm:px-5">
          Book a Strategy Call
        </button>
      </form>
      <p className="mt-3 flex items-center gap-1.5 text-[12.5px] font-medium text-forest/55">
        <CalendarDays className="size-3.5" aria-hidden="true" />
        {note}
      </p>
    </div>
  );
}

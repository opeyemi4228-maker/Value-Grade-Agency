import Link from "next/link";
import { BadgeCheck, FileCheck2, ShieldCheck } from "lucide-react";
import Logo from "../Logo";

const points = [
  { icon: BadgeCheck, text: "Every creator KYC-checked before they post" },
  { icon: ShieldCheck, text: "Payouts approved by you, paid on proof" },
  { icon: FileCheck2, text: "Invoices and receipts ready for finance" },
];

// Split auth layout: form on the left, brand panel on the right (hidden on small screens).
// On desktop the layout is locked to the viewport so the page never scrolls. If a window is
// unusually short, only the form column scrolls, with its bar hidden.
export default function AuthShell({ title, intro, children, footer }) {
  return (
    <div className="grid min-h-dvh bg-soft lg:h-dvh lg:grid-cols-[1fr_0.9fr] lg:overflow-hidden">
      <div className="no-scrollbar flex flex-col px-5 py-6 sm:px-10 lg:min-h-0 lg:overflow-y-auto lg:px-16 lg:py-7">
        <Logo tone="dark" />
        {/* my-auto (not justify-center) keeps the top reachable if the column ever overflows. */}
        <main id="main" className="mx-auto my-auto w-full max-w-md py-8 lg:py-6">
          <h1 className="display text-[1.75rem] leading-9 font-bold text-forest md:text-[2rem] md:leading-10">{title}</h1>
          {intro && <p className="mt-2 text-[15px] leading-6 font-medium tracking-[-0.02em] text-muted">{intro}</p>}
          <div className="mt-6">{children}</div>
          {footer && <div className="mt-6 text-center text-sm font-medium text-muted">{footer}</div>}
        </main>
        <p className="text-[12px] font-medium text-forest/40">
          © {new Date().getFullYear()} Value Grade Agency · <Link href="/privacy" className="hover:text-forest">Privacy</Link> · <Link href="/contact" className="hover:text-forest">Help</Link>
        </p>
      </div>

      <aside className="relative hidden overflow-hidden bg-forest text-soft lg:flex lg:min-h-0 lg:flex-col lg:justify-end lg:p-12 xl:p-14">
        <div className="grid-lines-orange corner-mask pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-20 -bottom-24 size-[28rem] rounded-full bg-orange/20 blur-3xl" aria-hidden="true" />
        <div className="relative">
          <p className="text-[13px] leading-5 font-bold tracking-wider text-orange uppercase">Value Grade Agency</p>
          <p className="display mt-4 max-w-md text-3xl leading-[1.15] font-bold xl:text-[2.5rem]">Creator campaigns you can prove.</p>
          <ul className="mt-8 space-y-3.5">
            {points.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-[15px] font-medium tracking-[-0.01em] text-soft/85">
                <span className="grid size-9 place-items-center rounded-xl bg-orange text-ink"><Icon className="size-4" aria-hidden="true" /></span>
                {text}
              </li>
            ))}
          </ul>
          <div className="mt-10 rounded-2xl bg-white p-5 text-forest shadow-2xl [@media(max-height:700px)]:hidden">
            <div className="flex items-center justify-between text-[12px] font-semibold text-forest/55">
              <span>Payout batch · Q4 Launch</span>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">12 of 12 verified</span>
            </div>
            <p className="mt-2 text-[1.75rem] font-bold tracking-[-0.03em] tabular-nums">₦2,143,000</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-forest/10"><div className="h-full w-full rounded-full bg-gradient-to-r from-forest to-orange" /></div>
            <p className="mt-2 text-right text-[10.5px] text-forest/40">Illustrative data</p>
          </div>
        </div>
      </aside>
    </div>
  );
}

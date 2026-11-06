"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Logo from "./Logo";
import CookieSettingsButton from "./CookieSettingsButton";
import Newsletter from "./Newsletter";
import RollText from "./RollText";
import { footerNav, site } from "@/lib/site";

const socialIcons = {
  LinkedIn: (
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
  ),
  Instagram: (
    <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16ZM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95C23.73 2.7 21.31.27 16.95.07 15.67.01 15.26 0 12 0Zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z" />
  ),
  X: <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.59-6.64 7.59H.47l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93Zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41Z" />,
};

function Clock() {
  const [time, setTime] = useState("--:--");
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-GB", { timeZone: site.timeZone, hour: "2-digit", minute: "2-digit" }));
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);
  return (
    <p className="flex items-center gap-2.5 text-sm font-medium whitespace-nowrap text-soft/60 tabular-nums">
      <span className="size-1.5 animate-pulse-dot rounded-full bg-orange" aria-hidden="true" />
      <b className="font-bold text-soft">{site.city}</b> time <span className="text-soft">{time}</span>
    </p>
  );
}

// Giant ghost wordmark, scaled so it always spans the full footer width.
function FitWord({ text }) {
  const wrap = useRef(null);
  const word = useRef(null);
  useEffect(() => {
    const fit = () => {
      const avail = wrap.current?.clientWidth;
      if (!avail) return;
      word.current.style.fontSize = "100px";
      const width = word.current.getBoundingClientRect().width;
      if (width > 0) word.current.style.fontSize = `${(100 * avail) / width - 0.5}px`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(wrap.current);
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={wrap} className="pointer-events-none mt-16 mb-6 overflow-hidden select-none" aria-hidden="true">
      <span ref={word} className="display inline-block leading-[0.82] whitespace-nowrap text-soft/[0.07]" style={{ fontSize: "16vw" }}>
        {text}
      </span>
    </div>
  );
}

export default function Footer() {
  // The dot grid follows the pointer through a CSS mask.
  const onPointerMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <footer onPointerMove={onPointerMove} className="relative isolate overflow-hidden border-t border-soft/14 bg-ink text-soft">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgb(244 244 242 / 0.16) 1px, transparent 0)",
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(42% 46% at var(--mx, 50%) var(--my, 40%), #000 0%, rgb(0 0 0 / 0.4) 48%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(42% 46% at var(--mx, 50%) var(--my, 40%), #000 0%, rgb(0 0 0 / 0.4) 48%, transparent 80%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "radial-gradient(120% 90% at 50% 118%, rgb(255 106 0 / 0.12), transparent 62%)" }}
        aria-hidden="true"
      />

      <div className="gutter">
        <div className="flex flex-col items-start gap-6 border-b border-soft/14 py-10 sm:flex-row sm:items-center sm:justify-between">
          <Logo tagline />
          <Clock />
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-12 border-b border-soft/14 py-14 sm:py-16 md:gap-x-12 lg:grid-cols-3 lg:gap-x-16 lg:py-20">
          <div className="col-span-2">
            <Link
              href="/contact"
              className="group inline-flex items-baseline gap-3 border-b border-soft/14 pb-3 text-[clamp(2rem,4.5vw,3.5rem)] leading-none font-semibold tracking-[-0.03em] transition-[gap,border-color] duration-300 hover:gap-5 hover:border-soft"
            >
              <RollText text="Let’s talk" className="leading-[1.12]" />
              <ArrowUpRight className="size-[0.42em] shrink-0 text-orange transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </Link>
            <p className="mt-8 max-w-[46ch] text-base leading-relaxed font-medium text-soft/65 sm:text-[17px]">
              <b className="font-bold text-soft">Performance marketing and creator campaigns</b>, with verified results and payouts your finance team can trace.
            </p>
            <ul className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-[15px] font-medium text-soft/75">
              <li>
                <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 transition-colors hover:text-soft">
                  <Mail className="size-4 text-orange" aria-hidden="true" /> {site.email}
                </a>
              </li>
              <li>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 transition-colors hover:text-soft">
                  <Phone className="size-4 text-orange" aria-hidden="true" /> {site.phone}
                </a>
              </li>
              <li>
                <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition-colors hover:text-soft">
                  <MessageCircle className="size-4 text-orange" aria-hidden="true" /> WhatsApp
                </a>
              </li>
              <li className="inline-flex items-center gap-2">
                <MapPin className="size-4 text-orange" aria-hidden="true" /> {site.address}
              </li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h2 className="mb-4 text-xs font-bold tracking-wider text-orange uppercase">The VGA Brief</h2>
            <p className="mb-6 text-base leading-relaxed font-medium text-soft/70">Campaign insight. Verified results. Zero noise.</p>
            <Newsletter />
          </div>

          {footerNav.map((group) => (
            <div key={group.title}>
              <h2 className="mb-4 text-xs font-bold tracking-wider text-orange uppercase">{group.title}</h2>
              <ul>
                {group.links.map((link) => (
                  <li key={link.href} className="border-b border-soft/10 last:border-0">
                    <Link href={link.href} className="flex min-h-12 items-center py-2 text-[15px] leading-snug font-medium text-soft/80 transition-all duration-300 hover:pl-[7px] hover:text-orange sm:text-base">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <FitWord text="Value Grade" />
      </div>

      <div className="border-t border-soft/14 gutter pt-7 pb-10">
        <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
          <div>
            <ul className="mb-1 flex flex-wrap gap-x-6 text-sm font-medium text-soft/70">
              <li><Link href="/privacy" className="inline-flex min-h-10 items-center transition-colors hover:text-soft">Privacy Policy</Link></li>
              <li><CookieSettingsButton className="inline-flex min-h-10 items-center transition-colors hover:text-soft" /></li>
              <li><Link href="/compliance" className="inline-flex min-h-10 items-center transition-colors hover:text-soft">Compliance & Trust</Link></li>
              <li><Link href="/login" className="inline-flex min-h-10 items-center transition-colors hover:text-soft">Client log in</Link></li>
            </ul>
            <p className="flex flex-wrap gap-x-2 text-sm leading-relaxed text-soft/50" suppressHydrationWarning>
              <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
              <span aria-hidden="true">·</span>
              <span>
                Built by{" "}
                <a
                  href="https://www.bitlayerx.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-soft/75 underline decoration-orange/60 underline-offset-4 transition-colors hover:text-soft hover:decoration-orange"
                >
                  BitLayerx Technologies
                </a>
              </span>
            </p>
          </div>
          <ul className="flex gap-1.5">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="group grid size-10 place-items-center rounded-full border border-soft/14 transition-all duration-300 hover:-translate-y-0.5 hover:border-soft hover:bg-soft"
                >
                  <svg viewBox="0 0 24 24" className="size-4 fill-soft transition-colors group-hover:fill-ink" aria-hidden="true">
                    {socialIcons[s.label]}
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

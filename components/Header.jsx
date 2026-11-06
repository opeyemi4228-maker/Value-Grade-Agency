"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import clsx from "clsx";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import Logo from "./Logo";
import RollText from "./RollText";
import { announcement, bookingUrl, mainNav } from "@/lib/site";

const ease = [0.625, 0.05, 0, 1];

// Hover backgrounds for the dropdown cards, cycled by index. `text` is the
// colour the whole card switches to so copy stays readable on the new fill.
const tones = [
  { bg: "bg-gradient-to-br from-forest via-emerald to-forest", dots: "rgb(255 106 0 / 0.45)", text: "hover:text-soft focus-visible:text-soft" },
  { bg: "bg-gradient-to-br from-orange to-orange-soft", dots: "rgb(1 28 19 / 0.22)", text: "hover:text-ink focus-visible:text-ink" },
  { bg: "bg-gradient-to-br from-ink via-forest to-emerald", dots: "rgb(255 106 0 / 0.4)", text: "hover:text-soft focus-visible:text-soft" },
  { bg: "bg-gradient-to-br from-emerald to-ink", dots: "rgb(244 244 242 / 0.2)", text: "hover:text-soft focus-visible:text-soft" },
];

const isActive = (pathname, href) => pathname === href.split("#")[0];

function NavCard({ item, index, compact }) {
  const tone = tones[index % tones.length];
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={clsx(
        "group/card relative flex h-full flex-col justify-between overflow-hidden bg-forest/5 text-forest transition-colors duration-300",
        compact ? "aspect-square p-3" : "p-7",
        tone.text,
      )}
    >
      <span className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 group-focus-visible/card:opacity-100" aria-hidden="true">
        <span className={clsx("absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.625,0.05,0,1)] group-hover/card:scale-110", tone.bg)} />
        {/* Dots stay in the top corner so they never sit behind the text. */}
        <span
          className="absolute inset-0 [mask-image:radial-gradient(ellipse_80%_70%_at_100%_0%,black_10%,transparent_70%)]"
          style={{ backgroundImage: `radial-gradient(${tone.dots} 1.3px, transparent 1.6px)`, backgroundSize: "11px 11px" }}
        />
      </span>

      <span className="relative flex items-start justify-between text-xs font-semibold tracking-wider opacity-60 tabular-nums">
        {String(index + 1).padStart(2, "0")}
        {Icon && <Icon className="size-6 stroke-[1.5]" aria-hidden="true" />}
      </span>

      <span className="relative flex items-end justify-between gap-6">
        <span>
          <span className={clsx("display block", compact ? "text-lg" : "text-2xl")}>{item.label}</span>
          {item.blurb && !compact && <span className="mt-2.5 block max-w-[30ch] text-[15px] leading-snug font-medium opacity-75">{item.blurb}</span>}
        </span>
        {!compact && (
          <span className="grid size-11 shrink-0 place-items-center bg-orange text-ink transition-colors duration-300 group-hover/card:bg-soft group-hover/card:text-ink">
            <ArrowUpRight className="size-5 transition-transform duration-300 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" aria-hidden="true" />
          </span>
        )}
      </span>
    </Link>
  );
}

// Header actions follow usegrade.com: a quiet outline "book a call" next to one filled "get started".
function BookCall({ className }) {
  const external = /^https?:\/\//.test(bookingUrl);
  const Tag = external ? "a" : Link;
  return (
    <Tag
      href={bookingUrl}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      className={clsx(
        "group h-10 shrink-0 items-center justify-center rounded-xl border border-forest/15 bg-white px-4 text-sm font-medium whitespace-nowrap text-forest transition-colors duration-300 hover:border-forest/30 hover:bg-soft",
        className,
      )}
    >
      <RollText text="Book a Strategy Call" stagger={14} className="leading-[1.5]" />
    </Tag>
  );
}

function GetStarted({ className }) {
  return (
    <Link
      href="/signup"
      className={clsx(
        "group h-10 shrink-0 items-center justify-center rounded-xl bg-forest px-4 text-sm font-medium whitespace-nowrap text-soft transition-colors duration-300 hover:bg-emerald",
        className,
      )}
    >
      <RollText text="Get Started" stagger={14} className="leading-[1.5]" />
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openGroup, setOpenGroup] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState(null);
  const closeTimer = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpenGroup(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    const onKey = (e) => e.key === "Escape" && (setMobileOpen(false), setOpenGroup(null));
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const open = (label) => {
    clearTimeout(closeTimer.current);
    setOpenGroup(label);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setOpenGroup(null), 160);
  };

  const active = mainNav.find((entry) => entry.label === openGroup);
  // Pages whose top sits on the light background (inset homepage hero, privacy) start with a light bar.
  // Every public page now opens on a light hero, so the bar is always light.
  const light = true;

  return (
    <>
      <header
        className={clsx("fixed inset-x-0 top-0 z-50 transition-colors duration-300", light ? "text-forest" : "text-soft")}
        onPointerEnter={() => clearTimeout(closeTimer.current)}
        onPointerLeave={(e) => e.pointerType === "mouse" && scheduleClose()}
      >
        {announcement && (
          <div className={clsx("grid transition-[grid-template-rows] duration-300", scrolled || mobileOpen ? "grid-rows-[0fr]" : "grid-rows-[1fr]")}>
            <div className="overflow-hidden">
              <Link
                href={announcement.href}
                className="gutter group flex items-center justify-center gap-2.5 bg-gradient-to-r from-ink via-forest to-ink py-2.5 text-center text-[13px] leading-5 tracking-[-0.01em] text-soft/70 sm:text-sm"
              >
                <span className="size-1.5 shrink-0 animate-pulse-dot rounded-full bg-orange" aria-hidden="true" />
                <span className="truncate">
                  {announcement.lead && <span className="font-semibold text-soft">{announcement.lead} </span>}
                  <span className="hidden font-normal md:inline">{announcement.text} </span>
                  <span className="font-semibold text-orange-soft underline-offset-4 group-hover:underline">{announcement.cta}</span>
                </span>
                <ArrowRight className="size-3.5 shrink-0 text-orange-soft transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        )}

        <div className="relative">
          <div
            className={clsx(
              "absolute inset-0 border-b border-forest/[0.08] transition-[background-color,box-shadow] duration-300",
              scrolled ? "bg-white/90 shadow-[0_8px_24px_-16px_rgb(0_47_31/0.18)] backdrop-blur-xl" : "bg-white",
            )}
            aria-hidden="true"
          />

          <div className="gutter relative flex h-20 items-center lg:grid lg:h-22 lg:grid-cols-[1fr_auto_1fr]">
            <Logo tone={light ? "dark" : "light"} className="lg:justify-self-start" />

            <nav aria-label="Main" className="hidden lg:block">
              <ul className="flex items-center gap-0.5">
                {mainNav.map((entry) =>
                  entry.items ? (
                    <li key={entry.label}>
                      <button
                        type="button"
                        aria-expanded={openGroup === entry.label}
                        aria-controls="nav-dropdown"
                        onPointerEnter={(e) => e.pointerType === "mouse" && open(entry.label)}
                        onClick={() => setOpenGroup((v) => (v === entry.label ? null : entry.label))}
                        className={clsx(
                          "flex h-9 items-center gap-1.5 rounded-md px-3 text-sm xl:px-4 leading-none font-medium transition-[opacity,background-color] hover:bg-current/8 hover:opacity-100",
                          light ? "text-neutral-950" : openGroup === entry.label || entry.items.some((i) => isActive(pathname, i.href)) ? "opacity-100" : "opacity-80",
                          (openGroup === entry.label || entry.items.some((i) => isActive(pathname, i.href))) && "bg-forest/[0.06]",
                        )}
                      >
                        {entry.label}
                        <ChevronDown className={clsx("size-3 transition-transform duration-300", openGroup === entry.label && "rotate-180")} aria-hidden="true" />
                      </button>
                    </li>
                  ) : (
                    <li key={entry.href}>
                      <Link
                        href={entry.href}
                        onPointerEnter={(e) => e.pointerType === "mouse" && setOpenGroup(null)}
                        aria-current={isActive(pathname, entry.href) ? "page" : undefined}
                        className={clsx(
                          "flex h-9 items-center rounded-md px-3 text-sm xl:px-4 leading-none font-medium transition-[opacity,background-color] hover:bg-current/8 hover:opacity-100",
                          light ? "text-neutral-950" : isActive(pathname, entry.href) ? "opacity-100" : "opacity-80",
                          isActive(pathname, entry.href) && "bg-forest/[0.06]",
                        )}
                      >
                        {entry.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </nav>

            <div className="ml-auto flex items-center gap-2 lg:ml-0 lg:justify-self-end">
              <BookCall className="hidden xl:inline-flex" />
              <GetStarted className="hidden sm:inline-flex" />
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                className="group/menu relative grid size-11 shrink-0 place-items-center bg-current transition-transform duration-300 focus-visible:rounded-none focus-visible:outline-offset-2 active:scale-95 lg:hidden"
              >
                {/* Two offset bars that close into a cross. */}
                <span className="relative block h-3 w-5">
                  <span
                    className={clsx(
                      "absolute top-0 right-0 h-0.5 w-5 transition-transform duration-300 ease-[cubic-bezier(0.625,0.05,0,1)]",
                      light ? "bg-soft" : "bg-ink",
                      mobileOpen && "translate-y-[5px] rotate-45",
                    )}
                  />
                  <span
                    className={clsx(
                      "absolute right-0 bottom-0 h-0.5 transition-all duration-300 ease-[cubic-bezier(0.625,0.05,0,1)]",
                      "bg-orange",
                      mobileOpen ? "w-5 -translate-y-[5px] -rotate-45" : "w-3 group-hover/menu:w-5",
                    )}
                  />
                </span>
              </button>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {active && (
              <motion.div
                id="nav-dropdown"
                key="dropdown"
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.5, ease }}
                className="relative hidden overflow-hidden lg:block"
              >
                <ul key={active.label} className={clsx("gutter grid gap-4 pt-8 pb-10", active.items.length > 2 ? "grid-cols-4 [&>li]:h-[19rem]" : "grid-cols-2 [&>li]:h-[15rem]")}>
                  {active.items.map((item, i) => (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: 64 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.55, ease, delay: 0.14 + i * 0.06 }}
                    >
                      <NavCard item={item} index={i} />
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                id="mobile-menu"
                initial={{ height: 0 }}
                animate={{ height: "calc(100dvh - 5rem)" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.45, ease }}
                className="relative overflow-y-auto lg:hidden"
              >
                <nav aria-label="Mobile" className="gutter flex min-h-full flex-col pt-4 pb-8">
                  <ul className="border-t border-forest/10">
                    {mainNav.map((entry) =>
                      entry.items ? (
                        <li key={entry.label} className="border-b border-forest/10">
                          <button
                            type="button"
                            aria-expanded={mobileGroup === entry.label}
                            onClick={() => setMobileGroup((v) => (v === entry.label ? null : entry.label))}
                            className="flex w-full items-center justify-between py-4 text-left text-lg font-semibold tracking-[-0.02em]"
                          >
                            {entry.label}
                            <ChevronDown className={clsx("size-4 transition-transform duration-300", mobileGroup === entry.label && "rotate-180")} aria-hidden="true" />
                          </button>
                          <AnimatePresence initial={false}>
                            {mobileGroup === entry.label && (
                              <motion.ul
                                initial={{ height: 0 }}
                                animate={{ height: "auto" }}
                                exit={{ height: 0 }}
                                transition={{ duration: 0.4, ease }}
                                className="grid grid-cols-2 gap-3 overflow-hidden"
                              >
                                {entry.items.map((item, i) => (
                                  <li key={item.href} className={clsx(i >= entry.items.length - 2 && "pb-4")}>
                                    <NavCard item={item} index={i} compact />
                                  </li>
                                ))}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </li>
                      ) : (
                        <li key={entry.href} className="border-b border-forest/10">
                          <Link href={entry.href} className="block py-4 text-lg font-semibold tracking-[-0.02em]">
                            {entry.label}
                          </Link>
                        </li>
                      ),
                    )}
                  </ul>
                  <div className="mt-auto grid gap-3 pt-8">
                    <GetStarted className="flex h-12 text-base" />
                    <BookCall className="flex h-12 text-base" />
                  </div>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <div
        onClick={() => setOpenGroup(null)}
        className={clsx("fixed inset-0 z-40 hidden bg-ink/40 transition-opacity duration-300 lg:block", active ? "opacity-100" : "pointer-events-none opacity-0")}
        aria-hidden="true"
      />
    </>
  );
}

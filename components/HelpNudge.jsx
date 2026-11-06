"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import clsx from "clsx";
import { ArrowUpRight, CalendarDays, Mail, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { LogoMark } from "./Logo";
import { CONSENT_EVENT, readConsent } from "@/lib/consent";
import { bookingUrl, proposalUrl, site } from "@/lib/site";

const IDLE_MS = 20000; // show the nudge after 20s without scrolling, typing or moving
const DISMISS_KEY = "vga-help-dismissed";

const actions = [
  { href: bookingUrl, icon: CalendarDays, title: "Book a Strategy Call", body: "30 minutes with a strategist", primary: true },
  { href: proposalUrl, icon: Send, title: "Request a Proposal", body: "Get a recommended campaign plan" },
  { href: "/contact?intent=creator", icon: Sparkles, title: "I'm a creator", body: "Join the creator network" },
  { href: site.whatsapp, icon: MessageCircle, title: "Chat on WhatsApp", body: "Quick questions, answered", external: true },
  { href: `mailto:${site.email}`, icon: Mail, title: "Email us", body: site.email, external: true },
];

const storage = {
  get: () => {
    try {
      return sessionStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      return false;
    }
  },
  set: () => {
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {}
  },
};

export default function HelpNudge() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false); // waits until the cookie choice is made
  const [bubble, setBubble] = useState(false);
  const [open, setOpen] = useState(false);
  const timer = useRef();

  useEffect(() => {
    if (readConsent()) setReady(true);
    const onConsent = () => setReady(true);
    window.addEventListener(CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(CONSENT_EVENT, onConsent);
  }, []);

  // Idle detection: any activity restarts the countdown. Shown at most once per session.
  useEffect(() => {
    if (!ready || open || storage.get()) return;
    const restart = () => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setBubble(true), IDLE_MS);
    };
    const events = ["pointermove", "scroll", "keydown", "touchstart"];
    events.forEach((e) => window.addEventListener(e, restart, { passive: true }));
    restart();
    return () => {
      clearTimeout(timer.current);
      events.forEach((e) => window.removeEventListener(e, restart));
    };
  }, [ready, open, pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const dismissBubble = () => {
    setBubble(false);
    storage.set();
  };

  const toggle = () => {
    setOpen((o) => !o);
    if (bubble) dismissBubble();
  };

  if (!ready || pathname === "/contact") return null;

  const pop = reduce ? {} : { initial: { opacity: 0, y: 12, scale: 0.96 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 12, scale: 0.96 } };

  return (
    // Sits above the mobile "Book a call" bar on small screens.
    <div className="fixed right-4 bottom-22 z-50 flex flex-col items-end gap-3 sm:right-6 lg:bottom-6">
      <AnimatePresence>
        {open && (
          <motion.div
            {...pop}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-label="How can we help?"
            id="help-panel"
            className="w-[min(22rem,calc(100vw-2rem))] origin-bottom-right overflow-hidden rounded-3xl bg-white text-forest shadow-[0_30px_80px_-20px_rgb(1_28_19/0.5)]"
          >
            <div className="relative overflow-hidden bg-forest px-6 pt-6 pb-7 text-soft">
              <div className="grid-lines-orange corner-mask pointer-events-none absolute inset-0" aria-hidden="true" />
              <div className="relative flex items-start justify-between">
                <span className="grid size-12 place-items-center rounded-full bg-white ring-2 ring-orange">
                  <LogoMark className="h-4.5 w-auto" />
                </span>
                <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="grid size-9 place-items-center rounded-full text-soft/60 transition-colors hover:bg-soft/10 hover:text-soft">
                  <X className="size-4" />
                </button>
              </div>
              <p className="relative mt-4 text-lg leading-7 font-semibold tracking-[-0.02em] md:text-xl">How can we help?</p>
              <p className="relative mt-1 text-sm font-medium text-soft/70">Pick an option and we&apos;ll take it from there.</p>
            </div>
            <ul className="grid gap-1.5 p-3">
              {actions.map(({ href, icon: Icon, title, body, primary, external }) => {
                const isExternal = external || /^https?:\/\//.test(href);
                const props = isExternal && !href.startsWith("mailto:") ? { target: "_blank", rel: "noopener noreferrer" } : {};
                const Tag = isExternal ? "a" : Link;
                return (
                  <li key={title}>
                    <Tag
                      href={href}
                      {...props}
                      onClick={() => setOpen(false)}
                      className={clsx("group flex items-center gap-3.5 rounded-2xl p-3 transition-colors", primary ? "bg-orange/10 hover:bg-orange/20" : "hover:bg-soft")}
                    >
                      <span className={clsx("grid size-10 shrink-0 place-items-center rounded-xl", primary ? "bg-orange text-ink" : "bg-forest text-orange")}>
                        <Icon className="size-4.5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold">{title}</span>
                        <span className="block truncate text-[12.5px] text-forest/55">{body}</span>
                      </span>
                      <ArrowUpRight className="size-4 text-forest/30 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-orange" aria-hidden="true" />
                    </Tag>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {bubble && !open && (
          <motion.div {...pop} transition={{ duration: 0.35 }} className="relative mr-2 max-w-[17rem] rounded-2xl bg-forest ring-1 ring-soft/15 py-3.5 pr-10 pl-4 text-[15px] leading-snug font-semibold text-soft shadow-[0_20px_50px_-15px_rgb(1_28_19/0.6)]" role="status">
            <button type="button" onClick={toggle} className="text-left">
              Still there? I can help you get started!
            </button>
            <button type="button" onClick={dismissBubble} aria-label="Dismiss" className="absolute top-2.5 right-2.5 grid size-6 place-items-center rounded-full text-soft/50 transition-colors hover:text-soft">
              <X className="size-3.5" />
            </button>
            <span className="absolute -bottom-1.5 right-7 size-3 rotate-45 bg-forest" aria-hidden="true" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls="help-panel"
        aria-label={open ? "Close help" : "Need help? Open quick options"}
        initial={reduce ? false : { opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="relative grid size-16 place-items-center rounded-full bg-white shadow-[0_16px_40px_-12px_rgb(1_28_19/0.55)] ring-[3px] ring-orange transition-transform duration-300 hover:scale-105"
      >
        {open ? <X className="size-6 text-forest" aria-hidden="true" /> : <LogoMark className="h-5 w-auto" />}
        <span className="absolute right-0 bottom-0.5 size-4 rounded-full border-[3px] border-white bg-emerald-500" aria-hidden="true" />
      </motion.button>
    </div>
  );
}

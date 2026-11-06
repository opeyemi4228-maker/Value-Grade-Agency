"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import clsx from "clsx";
import { Cookie, X } from "lucide-react";
import { OPEN_SETTINGS_EVENT, readConsent, saveConsent } from "@/lib/consent";

const categories = [
  { key: "essential", title: "Essential", body: "Keep the site secure and working, and remember this choice. Always on.", locked: true },
  { key: "analytics", title: "Analytics", body: "Anonymous visit statistics that help us improve the website." },
  { key: "marketing", title: "Marketing", body: "Measure our campaigns and show relevant content on other platforms." },
];

function Toggle({ checked, onChange, disabled, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={clsx(
        "relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 disabled:cursor-not-allowed",
        checked ? "bg-forest" : "bg-forest/15",
        disabled && "opacity-60",
      )}
    >
      <span className={clsx("absolute top-1 left-1 grid size-5 place-items-center rounded-full bg-white shadow transition-transform duration-300", checked && "translate-x-5")}>
        {checked && <span className="size-1.5 rounded-full bg-orange" />}
      </span>
    </button>
  );
}

const btn = "inline-flex h-11 flex-1 items-center justify-center rounded-xl px-3 text-[13px] font-medium whitespace-nowrap transition-colors duration-300 sm:h-12 sm:px-5 sm:text-sm";

export default function CookieConsent() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [customise, setCustomise] = useState(false);
  const [prefs, setPrefs] = useState({ analytics: false, marketing: false });
  const panel = useRef(null);

  useEffect(() => {
    const saved = readConsent();
    if (saved) setPrefs({ analytics: saved.analytics, marketing: saved.marketing });
    else setOpen(true);

    const reopen = () => {
      const current = readConsent();
      if (current) setPrefs({ analytics: current.analytics, marketing: current.marketing });
      setCustomise(true);
      setOpen(true);
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, reopen);
  }, []);

  useEffect(() => {
    if (open) panel.current?.focus({ preventScroll: true });
  }, [open, customise]);

  const decide = (choice) => {
    saveConsent(choice);
    setPrefs(choice);
    setOpen(false);
    setCustomise(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panel}
          tabIndex={-1}
          role="dialog"
          aria-modal="false"
          aria-labelledby="cookie-title"
          aria-describedby="cookie-body"
          initial={reduce ? false : { opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 32 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-3 bottom-3 z-[70] max-h-[calc(100dvh-1.5rem)] overflow-y-auto rounded-3xl border border-forest/10 bg-white text-forest shadow-[0_30px_80px_-20px_rgb(1_28_19/0.45)] outline-none sm:inset-x-auto sm:bottom-6 sm:left-6 sm:w-[30rem]"
        >
          <div className="h-1 bg-gradient-to-r from-forest via-emerald to-orange" aria-hidden="true" />
          <div className="p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-xl bg-forest text-orange sm:size-10">
                  <Cookie className="size-5" aria-hidden="true" />
                </span>
                <h2 id="cookie-title" className="text-lg leading-7 font-semibold tracking-[-0.02em] sm:text-xl">
                  {customise ? "Cookie preferences" : "We value your privacy"}
                </h2>
              </div>
              {customise && readConsent() && (
                <button type="button" onClick={() => setOpen(false)} aria-label="Close cookie preferences" className="grid size-9 place-items-center rounded-full text-forest/50 transition-colors hover:bg-soft hover:text-forest">
                  <X className="size-4" />
                </button>
              )}
            </div>

            <p id="cookie-body" className="mt-3 text-sm leading-relaxed font-medium text-forest/70 sm:mt-4 sm:text-[15px]">
              {customise
                ? "Choose which cookies we can use. You can change this at any time from the footer."
                : "We use cookies to run this site and, with your consent, to understand how it is used and improve it."}{" "}
              <Link href="/privacy" className="font-semibold text-forest underline decoration-orange decoration-2 underline-offset-4 hover:text-orange-deep">
                Privacy policy
              </Link>
            </p>

            {customise && (
              <ul className="mt-5 divide-y divide-forest/8 rounded-2xl border border-forest/10 bg-soft/60">
                {categories.map(({ key, title, body, locked }) => (
                  <li key={key} className="flex items-center gap-4 px-4 py-3 sm:py-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold">{title}</p>
                      <p className="mt-0.5 text-[13px] leading-snug text-forest/60">{body}</p>
                    </div>
                    <Toggle
                      label={`${title} cookies`}
                      checked={locked ? true : prefs[key]}
                      disabled={locked}
                      onChange={(v) => setPrefs((p) => ({ ...p, [key]: v }))}
                    />
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-5 flex gap-2 sm:mt-6 sm:gap-2.5">
              {customise ? (
                <>
                  <button type="button" onClick={() => decide(prefs)} className={clsx(btn, "border-2 border-forest text-forest hover:bg-forest hover:text-soft")}>
                    Save preferences
                  </button>
                  <button type="button" onClick={() => decide({ analytics: true, marketing: true })} className={clsx(btn, "bg-orange text-ink hover:bg-forest hover:text-soft")}>
                    Accept All
                  </button>
                </>
              ) : (
                <>
                  <button type="button" onClick={() => setCustomise(true)} className={clsx(btn, "border-2 border-forest/20 text-forest hover:border-forest")}>
                    Customise
                  </button>
                  <button type="button" onClick={() => decide({ analytics: false, marketing: false })} className={clsx(btn, "bg-forest text-soft hover:bg-ink")}>
                    Reject All
                  </button>
                  <button type="button" onClick={() => decide({ analytics: true, marketing: true })} className={clsx(btn, "bg-orange text-ink hover:bg-forest hover:text-soft")}>
                    Accept All
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import clsx from "clsx";
import { ArrowLeft, ArrowRight, CalendarDays, Check, FileText, Loader2, MessageCircle, Sparkles } from "lucide-react";
import { BUDGET_OPTIONS, CAMPAIGN_OPTIONS, CONTACT_METHODS, SERVICE_OPTIONS } from "@/lib/formOptions";

const PATHS = [
  {
    id: "proposal",
    icon: FileText,
    label: "Request a proposal",
    blurb: "Share your brief and we'll recommend creators, deliverables and a timeline.",
    who: "Brands & agencies",
    briefTitle: "Tell us about the campaign",
    submit: "Send proposal request",
  },
  {
    id: "call",
    icon: CalendarDays,
    label: "Book a strategy call",
    blurb: "Talk your goals through with a campaign strategist before you commit.",
    who: "Brands & agencies",
    briefTitle: "What should we cover?",
    submit: "Request a call",
  },
  {
    id: "creator",
    icon: Sparkles,
    label: "Join the creator network",
    blurb: "Get clear briefs, fair agreements and payouts on record.",
    who: "Creators & influencers",
    briefTitle: "Tell us about your content",
    submit: "Submit application",
  },
  {
    id: "general",
    icon: MessageCircle,
    label: "Ask a question",
    blurb: "Partnerships, press or anything else. We'll point you the right way.",
    who: "Everyone else",
    briefTitle: "What's on your mind?",
    submit: "Send message",
  },
];

const STEPS = ["Choose a path", "About you", "Your brief"];
const STEP_FIELDS = {
  2: ["fullName", "email", "company", "role", "contactMethod", "phone"],
  3: ["service", "campaignType", "budget", "message"],
};
const BRAND_SERVICES = SERVICE_OPTIONS.filter((s) => s !== "Joining the creator network");
const PHONE_RE = /^[+()\d\s-]{7,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const turnstileKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL;

// Mirrors validateEnquiry in lib/forms.js so people hear about mistakes before the last step.
function validateStep(step, form, intent) {
  const v = (name) => String(form.elements[name]?.value ?? "").trim();
  const checked = (name) => form.querySelector(`input[name="${name}"]:checked`)?.value ?? "";
  const errors = {};
  if (step === 2) {
    if (v("fullName").length < 2) errors.fullName = "Please enter your full name.";
    if (!EMAIL_RE.test(v("email"))) errors.email = "Please enter a valid email address.";
    if (intent !== "general" && v("company").length < 2) errors.company = intent === "creator" ? "Please enter your creator or channel name." : "Please enter your company name.";
    if (intent === "creator" && v("role").length < 2) errors.role = "Please tell us your main platform and niche.";
    if ((v("phone") || checked("contactMethod") !== "Email") && !PHONE_RE.test(v("phone"))) errors.phone = "Please enter a valid phone number.";
  }
  if (step === 3) {
    if ((intent === "proposal" || intent === "call") && !checked("service")) errors.service = "Please choose a service.";
    if (v("message").length < 10) errors.message = "Please tell us a little more (at least 10 characters).";
  }
  return errors;
}

function Field({ label, name, error, hint, children }) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 flex items-baseline justify-between gap-3 text-sm font-semibold text-forest">
        {label}
        {hint && <span className="text-xs font-medium text-forest/45">{hint}</span>}
      </label>
      {children}
      <ErrorText name={name} error={error} />
    </div>
  );
}

function ErrorText({ name, error }) {
  if (!error) return null;
  return (
    <p id={`${name}-error`} className="mt-2 text-xs font-semibold text-orange-deep">
      {error}
    </p>
  );
}

const inputClass = (error) =>
  clsx(
    "w-full rounded-xl border-2 bg-white px-4 py-3.5 text-[15px] font-medium text-forest placeholder:font-normal placeholder:text-forest/35 transition-colors focus:border-forest focus:outline-none",
    error ? "border-orange-deep" : "border-forest/10 hover:border-forest/25",
  );

// Single-choice chips: real radios, so arrow keys and screen readers behave as expected.
function Chips({ name, label, options, error, hint, defaultValue, columns }) {
  return (
    <fieldset aria-describedby={error ? `${name}-error` : undefined}>
      <legend className="mb-3 flex w-full items-baseline justify-between gap-3 text-sm font-semibold text-forest">
        {label}
        {hint && <span className="text-xs font-medium text-forest/45">{hint}</span>}
      </legend>
      <div className={clsx("flex flex-wrap gap-2", columns && "sm:grid sm:grid-cols-2")}>
        {options.map((o) => (
          <label key={o} className="cursor-pointer">
            <input type="radio" name={name} value={o} defaultChecked={o === defaultValue} className="peer sr-only" />
            <span
              className={clsx(
                "flex h-full items-center gap-2 rounded-xl border-2 bg-white px-4 py-2.5 text-sm font-semibold text-forest/75 transition-colors",
                "hover:border-forest/30 peer-checked:border-forest peer-checked:bg-forest peer-checked:text-soft peer-focus-visible:ring-2 peer-focus-visible:ring-orange peer-focus-visible:ring-offset-2",
                error ? "border-orange-deep/60" : "border-forest/10",
              )}
            >
              {o}
            </span>
          </label>
        ))}
      </div>
      <ErrorText name={name} error={error} />
    </fieldset>
  );
}

function Step({ active, children }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      hidden={!active}
      initial={false}
      animate={active ? { opacity: 1, x: 0 } : { opacity: 0, x: reduce ? 0 : 16 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function ContactForm({ initialIntent, initialEmail }) {
  const preset = PATHS.some((p) => p.id === initialIntent) ? initialIntent : null;
  const [intent, setIntent] = useState(preset);
  const [step, setStep] = useState(preset ? 2 : 1);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [contactMethod, setContactMethod] = useState(CONTACT_METHODS[0]);
  const [turnstileReady, setTurnstileReady] = useState(false);
  const startedAt = useRef(0);
  const panelRef = useRef(null);
  const headingRefs = useRef({});
  const turnstileRef = useRef(null);
  const turnstileId = useRef(null);
  const moved = useRef(false);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // Move focus to the new step's heading so keyboard and screen-reader users land in the right place.
  useEffect(() => {
    if (!moved.current) return;
    headingRefs.current[step]?.focus({ preventScroll: true });
    const top = panelRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 80) panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  // The widget lives on the last step, which is hidden on load, so it's rendered explicitly.
  useEffect(() => {
    if (step === 3 && turnstileReady && turnstileRef.current && turnstileId.current == null) {
      turnstileId.current = window.turnstile.render(turnstileRef.current, { sitekey: turnstileKey, theme: "light" });
    }
  }, [step, turnstileReady]);

  const path = PATHS.find((p) => p.id === intent);
  const creator = intent === "creator";
  const brand = intent === "proposal" || intent === "call";

  function goTo(next) {
    moved.current = true;
    setErrors({});
    setMessage("");
    setStep(next);
  }

  function choose(id) {
    setIntent(id);
    goTo(2);
  }

  function focusFirstError(form, errs) {
    const first = Object.keys(errs)[0];
    const el = form.elements[first];
    (el?.length ? el[0] : el)?.focus?.();
  }

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;

    const stepErrors = validateStep(step, form, intent);
    if (Object.keys(stepErrors).length) {
      setErrors(stepErrors);
      focusFirstError(form, stepErrors);
      return;
    }
    if (step < 3) return goTo(step + 1);

    const payload = Object.fromEntries(new FormData(form));
    payload.intent = intent;
    payload._t = startedAt.current;

    setStatus("loading");
    setErrors({});
    setMessage("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        const errs = data.errors || {};
        // Send people back to whichever step holds the first problem.
        const back = Object.keys(errs).some((k) => STEP_FIELDS[2].includes(k)) ? 2 : 3;
        if (back !== step) setStep(back);
        setErrors(errs);
        setMessage(data.message || "Something went wrong. Please try again.");
        setStatus("error");
        requestAnimationFrame(() => focusFirstError(form, errs));
        if (turnstileId.current != null) window.turnstile?.reset?.(turnstileId.current);
        return;
      }
      setStatus("success");
    } catch {
      setMessage("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  const err = (name) => errors[name];
  const aria = (name) => ({ "aria-invalid": Boolean(err(name)), "aria-describedby": err(name) ? `${name}-error` : undefined });
  const heading = (n) => ({
    ref: (el) => (headingRefs.current[n] = el),
    tabIndex: -1,
    className: "display text-2xl leading-8 text-forest outline-none md:text-3xl md:leading-10",
  });

  if (status === "success") {
    return (
      <div ref={panelRef} className="rounded-panel bg-white p-8 text-center shadow-[0_40px_120px_-50px_rgb(1_28_19/0.45)] sm:p-16" role="status">
        <motion.span
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="mx-auto grid size-20 place-items-center rounded-full bg-orange text-ink"
        >
          <Check className="size-9 stroke-[2.5]" aria-hidden="true" />
        </motion.span>
        <h2 className="display mt-6 text-2xl leading-8 text-forest md:text-3xl md:leading-10">Thank you. We&apos;ve got it.</h2>
        <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed font-medium text-forest/65">
          A member of the VGA team will review your {creator ? "application" : "request"} and reply by {contactMethod === "WhatsApp" ? "WhatsApp" : contactMethod.toLowerCase()}.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {intent === "call" && bookingUrl && (
            <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center gap-2 rounded-xl bg-forest px-5 text-base font-medium text-soft transition-colors hover:bg-orange hover:text-ink">
              <CalendarDays className="size-4" aria-hidden="true" /> Pick a time now
            </a>
          )}
          <a href="/" className="inline-flex h-12 items-center gap-2 rounded-xl border border-forest/15 px-5 text-base font-medium text-forest transition-colors hover:border-forest">
            Back to home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div ref={panelRef} className="scroll-mt-28 overflow-hidden rounded-panel bg-white shadow-[0_40px_120px_-50px_rgb(1_28_19/0.45)] lg:grid lg:grid-cols-[300px_1fr]">
      {turnstileKey && <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" onReady={() => setTurnstileReady(true)} />}

      {/* Progress rail: a vertical stepper on desktop, a compact bar on mobile. */}
      <aside className="relative bg-forest p-6 text-soft sm:p-8 lg:p-10">
        <div className="halftone-light pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_90%_60%_at_0%_100%,black,transparent)]" aria-hidden="true" />
        <div className="relative lg:hidden">
          <div className="flex items-center justify-between text-xs font-bold tracking-wider uppercase">
            <span className="text-orange">Step {step} of 3</span>
            <span className="text-soft/60">{STEPS[step - 1]}</span>
          </div>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-soft/10">
            <motion.div className="h-full rounded-full bg-orange" initial={false} animate={{ width: `${(step / 3) * 100}%` }} transition={{ duration: 0.4 }} />
          </div>
        </div>

        <ol className="relative hidden lg:grid lg:gap-0">
          {STEPS.map((label, i) => {
            const n = i + 1;
            const done = step > n;
            const current = step === n;
            return (
              <li key={label} className="relative flex gap-4 pb-9 last:pb-0" aria-current={current ? "step" : undefined}>
                {n < STEPS.length && <span className={clsx("absolute top-10 bottom-1 left-[17px] w-0.5 rounded-full transition-colors duration-500", done ? "bg-orange" : "bg-soft/12")} aria-hidden="true" />}
                <span
                  className={clsx(
                    "grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold transition-colors duration-300",
                    done && "bg-orange text-ink",
                    current && "bg-soft text-forest ring-4 ring-soft/15",
                    !done && !current && "border-2 border-soft/20 text-soft/45",
                  )}
                >
                  {done ? <Check className="size-4 stroke-[3]" aria-hidden="true" /> : n}
                </span>
                <div className="pt-1.5">
                  <p className={clsx("font-bold transition-colors", current ? "text-soft" : done ? "text-soft/85" : "text-soft/45")}>{label}</p>
                  {n === 1 && path && step > 1 && (
                    <p className="mt-1 text-sm font-medium text-soft/55">{path.label}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        <div className="relative mt-12 hidden border-t border-soft/10 pt-8 lg:block">
          <p className="text-xs font-bold tracking-wider text-orange uppercase">What happens next</p>
          <ul className="mt-4 grid gap-3 text-sm leading-snug font-medium text-soft/65">
            <li>A strategist reads your request.</li>
            <li>We reply using the method you choose.</li>
            <li>We recommend creators, deliverables and timelines.</li>
          </ul>
        </div>
      </aside>

      <form onSubmit={onSubmit} noValidate className="p-6 sm:p-10 lg:p-14">
        {/* Step 1: choose a path */}
        <Step active={step === 1}>
          <h2 {...heading(1)}>What brings you here?</h2>
          <p className="mt-2 font-medium text-forest/60">Pick one and we&apos;ll only ask what we need. It takes about two minutes.</p>
          <div role="group" aria-label="Enquiry type" className="mt-8 grid gap-3 sm:grid-cols-2">
            {PATHS.map((p) => {
              const Icon = p.icon;
              const selected = intent === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => choose(p.id)}
                  className={clsx(
                    "group relative flex flex-col overflow-hidden rounded-card border-2 p-5 text-left sm:p-6 transition-all duration-300",
                    selected ? "border-forest bg-forest text-soft" : "border-forest/10 bg-soft/60 text-forest hover:-translate-y-0.5 hover:border-forest hover:bg-white hover:shadow-[0_20px_40px_-24px_rgb(1_28_19/0.5)]",
                  )}
                >
                  <span className="flex items-start justify-between">
                    <span className={clsx("grid size-12 place-items-center rounded-2xl transition-colors", selected ? "bg-orange text-ink" : "bg-forest text-orange group-hover:bg-orange group-hover:text-ink")}>
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className={clsx("text-[11px] font-bold tracking-wider uppercase", selected ? "text-soft/60" : "text-forest/45")}>{p.who}</span>
                  </span>
                  <span className="mt-4 flex items-center gap-2 text-lg sm:mt-6 font-bold tracking-tight">
                    {p.label}
                    <ArrowRight className="size-4 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" aria-hidden="true" />
                  </span>
                  <span className={clsx("mt-1.5 text-sm leading-relaxed font-medium", selected ? "text-soft/70" : "text-forest/60")}>{p.blurb}</span>
                </button>
              );
            })}
          </div>
        </Step>

        {/* Step 2: about you */}
        <Step active={step === 2}>
          <PathTag path={path} onChange={() => goTo(1)} />
          <h2 {...heading(2)}>{creator ? "Who are you?" : "Nice to meet you"}</h2>
          <p className="mt-2 font-medium text-forest/60">So we know who we&apos;re talking to and how to reach you.</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <Field label="Full name" name="fullName" error={err("fullName")}>
              <input id="fullName" name="fullName" autoComplete="name" placeholder="Ada Okafor" className={inputClass(err("fullName"))} {...aria("fullName")} />
            </Field>
            <Field label={creator ? "Email address" : "Work email"} name="email" error={err("email")}>
              <input id="email" name="email" type="email" autoComplete="email" placeholder="you@company.com" defaultValue={initialEmail} className={inputClass(err("email"))} {...aria("email")} />
            </Field>
            <Field label={creator ? "Creator or channel name" : "Company"} name="company" hint={intent === "general" ? "Optional" : undefined} error={err("company")}>
              <input id="company" name="company" autoComplete={creator ? "off" : "organization"} placeholder={creator ? "@yourhandle" : "Company name"} className={inputClass(err("company"))} {...aria("company")} />
            </Field>
            <Field label={creator ? "Main platform & niche" : "Your role"} name="role" hint={creator ? undefined : "Optional"} error={err("role")}>
              <input id="role" name="role" autoComplete={creator ? "off" : "organization-title"} placeholder={creator ? "TikTok · Finance" : "Head of Marketing"} className={inputClass(err("role"))} {...aria("role")} />
            </Field>

            <fieldset className="sm:col-span-2">
              <legend className="mb-3 text-sm font-semibold text-forest">How should we reply?</legend>
              <div className="grid grid-cols-3 gap-2 rounded-2xl bg-soft p-1.5">
                {CONTACT_METHODS.map((m) => (
                  <label key={m} className="relative cursor-pointer">
                    <input type="radio" name="contactMethod" value={m} checked={contactMethod === m} onChange={() => setContactMethod(m)} className="peer sr-only" />
                    {contactMethod === m && <motion.span layoutId="method-bg" className="absolute inset-0 rounded-xl bg-forest shadow-sm" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                    <span className="relative block rounded-xl py-3 text-center text-sm font-bold text-forest/60 transition-colors peer-checked:text-soft peer-focus-visible:ring-2 peer-focus-visible:ring-orange">{m}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="sm:col-span-2">
              <Field label={contactMethod === "WhatsApp" ? "WhatsApp number" : "Phone number"} name="phone" hint={contactMethod === "Email" ? "Optional" : undefined} error={err("phone")}>
                <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+234 800 000 0000" className={inputClass(err("phone"))} {...aria("phone")} />
              </Field>
            </div>
          </div>
        </Step>

        {/* Step 3: the brief, shaped by the chosen path */}
        <Step active={step === 3}>
          <PathTag path={path} onChange={() => goTo(1)} />
          <h2 {...heading(3)}>{path?.briefTitle}</h2>
          <p className="mt-2 font-medium text-forest/60">{brand ? "A few quick choices, then the details in your own words." : "Just a few lines is plenty."}</p>
          <div className="mt-8 grid gap-7">
            {brand && <Chips name="service" label="What do you need help with?" options={BRAND_SERVICES} error={err("service")} columns />}
            {intent === "proposal" && <Chips name="campaignType" label="Campaign type" hint="Optional" options={CAMPAIGN_OPTIONS.filter((c) => c !== "Creator partnership")} error={err("campaignType")} />}
            {brand && <Chips name="budget" label="Estimated budget" hint="Optional" options={BUDGET_OPTIONS} error={err("budget")} />}
            {creator && (
              <>
                <input type="hidden" name="service" value="Joining the creator network" />
                <input type="hidden" name="campaignType" value="Creator partnership" />
              </>
            )}
            <Field
              label={creator ? "Your audience and content" : brand ? "Goals and details" : "Your message"}
              name="message"
              error={err("message")}
            >
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder={
                  creator
                    ? "Links to your profiles, audience size and location, categories you create for…"
                    : brand
                      ? "Objectives, target audience, timelines and anything else we should know…"
                      : "How can we help?"
                }
                className={clsx(inputClass(err("message")), "min-h-36 resize-y")}
                {...aria("message")}
              />
            </Field>
            {turnstileKey && <div ref={turnstileRef} />}
          </div>
        </Step>

        {/* Honeypot */}
        <div className="hidden" aria-hidden="true">
          <label>
            Website <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <p role="alert" aria-live="assertive" className="mt-6 rounded-xl bg-orange/10 px-4 py-3 text-sm font-semibold text-orange-deep empty:hidden">
          {status === "error" ? message : ""}
        </p>

        <AnimatePresence initial={false}>
          {step > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-10 flex flex-col-reverse gap-4 border-t border-forest/8 pt-8 sm:flex-row sm:items-center sm:justify-between"
            >
              <button type="button" onClick={() => goTo(step - 1)} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl px-5 text-base font-medium text-forest/60 transition-colors hover:bg-soft hover:text-forest">
                <ArrowLeft className="size-4" aria-hidden="true" /> Back
              </button>
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                {step === 3 && (
                  <p className="text-xs leading-relaxed font-medium text-forest/50 sm:max-w-56 sm:text-right">
                    By sending, you agree to our <a href="/privacy" className="underline underline-offset-2 hover:text-forest">privacy policy</a>. We never share your details.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-orange px-6 text-base font-medium text-ink transition-colors duration-300 hover:bg-forest hover:text-soft disabled:opacity-70"
                >
                  {status === "loading" && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
                  {status === "loading" ? "Sending…" : step === 3 ? path?.submit : "Continue"}
                  {status !== "loading" && <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}

function PathTag({ path, onChange }) {
  if (!path) return null;
  const Icon = path.icon;
  return (
    <button
      type="button"
      onClick={onChange}
      className="group mb-5 inline-flex items-center gap-2 rounded-full bg-soft py-1.5 pr-3.5 pl-1.5 text-xs font-bold text-forest/70 transition-colors hover:bg-forest hover:text-soft"
    >
      <span className="grid size-6 place-items-center rounded-full bg-forest text-orange">
        <Icon className="size-3" aria-hidden="true" />
      </span>
      {path.label}
      <span className="font-semibold text-forest/40 group-hover:text-soft/60">· Change</span>
    </button>
  );
}

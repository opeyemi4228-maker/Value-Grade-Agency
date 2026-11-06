"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { ArrowRight, Building2, Eye, EyeOff, Loader2, Sparkles } from "lucide-react";
import { logIn, requestPasswordReset, resetPassword, signUp, verifyEmail } from "@/app/(auth)/actions";

const input =
  "h-11 w-full rounded-xl border bg-white px-4 text-[15px] font-medium text-forest outline-none transition placeholder:text-forest/35 focus:border-forest/50 focus:ring-4 focus:ring-forest/[0.07]";

function Field({ label, name, error, hint, children, aside }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={name} className="text-[13px] font-semibold text-forest">{label}</label>
        {aside}
      </div>
      <div className="mt-1.5">{children}</div>
      {error ? (
        <p id={`${name}-error`} className="mt-1.5 text-[12.5px] font-semibold text-red-700">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-[12px] font-medium text-forest/50">{hint}</p>
      ) : null}
    </div>
  );
}

function Password({ name = "password", autoComplete, error, describedBy }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        id={name}
        name={name}
        type={show ? "text" : "password"}
        autoComplete={autoComplete}
        required
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : describedBy}
        className={clsx(input, "pr-12", error ? "border-red-400" : "border-forest/15")}
      />
      <button type="button" onClick={() => setShow((s) => !s)} className="absolute inset-y-0 right-0 grid w-12 place-items-center text-forest/45 hover:text-forest" aria-label={show ? "Hide password" : "Show password"}>
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

function Submit({ pending, children }) {
  return (
    <button type="submit" disabled={pending} className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-forest text-[15px] font-medium text-soft transition-colors hover:bg-orange hover:text-ink disabled:opacity-60">
      {pending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
      {children}
      {!pending && <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />}
    </button>
  );
}

function Alert({ tone = "error", children }) {
  if (!children) return null;
  return (
    <p role={tone === "error" ? "alert" : "status"} className={clsx("rounded-xl px-4 py-3 text-[13.5px] font-semibold", tone === "error" ? "bg-red-50 text-red-800" : "bg-emerald-50 text-emerald-800")}>
      {children}
    </p>
  );
}

export function LoginForm({ next }) {
  const [state, action, pending] = useActionState(logIn, {});
  return (
    <form action={action} className="space-y-5" noValidate>
      <Alert>{state.error}</Alert>
      <input type="hidden" name="next" value={next || ""} />
      <Field label="Email" name="email">
        <input id="email" name="email" type="email" autoComplete="email" required defaultValue={state.email} className={clsx(input, "border-forest/15")} />
      </Field>
      <Field label="Password" name="password" aside={<Link href="/forgot-password" className="text-[12.5px] font-bold text-orange-deep hover:underline">Forgot password?</Link>}>
        <Password autoComplete="current-password" />
      </Field>
      <Submit pending={pending}>Log in</Submit>
    </form>
  );
}

const TYPES = [
  { id: "client", label: "Brand or agency", body: "Track campaigns, approve payouts, download invoices.", icon: Building2 },
  { id: "creator", label: "Creator", body: "See your campaigns, verification and payouts.", icon: Sparkles },
];

export function SignupForm({ defaultType = "client" }) {
  const [state, action, pending] = useActionState(signUp, {});
  const v = state.values || {};
  const [type, setType] = useState(v.type || defaultType);
  const e = state.errors || {};
  return (
    <form action={action} className="space-y-4" noValidate>
      <Alert>{state.error}</Alert>
      <fieldset>
        <legend className="text-[13px] font-semibold text-forest">I&apos;m signing up as</legend>
        <div className="mt-2 grid gap-2.5 sm:grid-cols-2">
          {TYPES.map(({ id, label, body, icon: Icon }) => {
            const selected = type === id;
            return (
              // Padding lives on the inner surface, not the <label>, so a label reset can never collapse it.
              <label key={id} className="relative block h-full cursor-pointer">
                <input type="radio" name="type" value={id} checked={selected} onChange={() => setType(id)} className="peer sr-only" />
                <span
                  className={clsx(
                    "flex h-full flex-col gap-3 rounded-2xl border bg-white p-3.5 transition-[border-color,box-shadow] duration-200",
                    "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-orange",
                    selected
                      ? "border-forest shadow-[0_0_0_1px_var(--color-forest),0_10px_24px_-18px_rgb(0_47_31/0.5)]"
                      : "border-forest/12 hover:border-forest/30",
                  )}
                >
                  <span
                    className={clsx(
                      "grid size-9 shrink-0 place-items-center rounded-xl transition-colors duration-200",
                      selected ? "bg-orange text-ink" : "bg-forest/[0.05] text-forest/70",
                    )}
                  >
                    <Icon className="size-[18px]" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[14px] leading-5 font-semibold tracking-[-0.01em] text-forest">{label}</span>
                    <span className="mt-0.5 block text-[12.5px] leading-[1.45] font-medium text-muted">{body}</span>
                  </span>
                </span>
                {/* Radio indicator: an empty ring, filled when chosen. */}
                <span
                  className={clsx(
                    "pointer-events-none absolute top-3.5 right-3.5 grid size-[18px] place-items-center rounded-full border transition-colors duration-200",
                    selected ? "border-forest bg-forest" : "border-forest/25 bg-white",
                  )}
                  aria-hidden="true"
                >
                  <span className={clsx("size-1.5 rounded-full bg-white transition-transform duration-200", selected ? "scale-100" : "scale-0")} />
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" name="name" error={e.name}>
          <input id="name" name="name" autoComplete="name" required defaultValue={v.name} aria-invalid={Boolean(e.name)} className={clsx(input, e.name ? "border-red-400" : "border-forest/15")} />
        </Field>
        <Field label={type === "client" ? "Company" : "Channel or handle (optional)"} name="company" error={e.company}>
          <input id="company" name="company" autoComplete="organization" defaultValue={v.company} aria-invalid={Boolean(e.company)} className={clsx(input, e.company ? "border-red-400" : "border-forest/15")} />
        </Field>
      </div>
      <Field label={type === "client" ? "Work email" : "Email"} name="email" error={e.email} hint={type === "creator" ? "Use the email VGA pays you on, so we can match your records." : undefined}>
        <input id="email" name="email" type="email" autoComplete="email" required defaultValue={v.email} aria-invalid={Boolean(e.email)} className={clsx(input, e.email ? "border-red-400" : "border-forest/15")} />
      </Field>
      <Field label="Password" name="password" error={e.password} hint="At least 10 characters, with letters and numbers or symbols.">
        <Password autoComplete="new-password" error={e.password} />
      </Field>
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>Company website<input name="company_website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <div>
        <label className="flex items-start gap-2.5 text-[13px] font-medium text-forest/70">
          <input type="checkbox" name="terms" defaultChecked={v.terms} className="mt-0.5 size-4 accent-[#002F1F]" />
          <span>
            I agree to VGA&apos;s handling of my data as described in the <Link href="/privacy" className="font-bold text-forest underline decoration-orange underline-offset-2">Privacy Policy</Link>.
          </span>
        </label>
        {e.terms && <p className="mt-1.5 text-[12.5px] font-semibold text-red-700">{e.terms}</p>}
      </div>
      <Submit pending={pending}>Create account</Submit>
    </form>
  );
}

export function ForgotForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, {});
  if (state.sent) {
    return <Alert tone="ok">If an account exists for {state.email}, a reset link is on its way. It expires in 1 hour.</Alert>;
  }
  return (
    <form action={action} className="space-y-5" noValidate>
      <Alert>{state.error}</Alert>
      <Field label="Email" name="email">
        <input id="email" name="email" type="email" autoComplete="email" required defaultValue={state.email} className={clsx(input, "border-forest/15")} />
      </Field>
      <Submit pending={pending}>Send reset link</Submit>
    </form>
  );
}

export function ResetForm({ token }) {
  const [state, action, pending] = useActionState(resetPassword, {});
  const e = state.errors || {};
  return (
    <form action={action} className="space-y-5" noValidate>
      <Alert>{state.error}</Alert>
      <input type="hidden" name="token" value={token} />
      <Field label="New password" name="password" error={e.password} hint="At least 10 characters, with letters and numbers or symbols.">
        <Password autoComplete="new-password" error={e.password} />
      </Field>
      <Field label="Confirm password" name="confirm" error={e.confirm}>
        <Password name="confirm" autoComplete="new-password" error={e.confirm} />
      </Field>
      <Submit pending={pending}>Set new password</Submit>
    </form>
  );
}

export function VerifyForm({ token }) {
  const [state, action, pending] = useActionState(verifyEmail, {});
  return (
    <form action={action} className="space-y-5">
      <Alert>{state.error}</Alert>
      <input type="hidden" name="token" value={token} />
      <Submit pending={pending}>Confirm my email</Submit>
    </form>
  );
}

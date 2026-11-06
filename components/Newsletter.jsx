"use client";

import { useState } from "react";
import clsx from "clsx";
import { ArrowRight, Check, Loader2 } from "lucide-react";

export default function Newsletter() {
  const [state, setState] = useState({ status: "idle", message: "" });

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    setState({ status: "loading", message: "" });
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Something went wrong.");
      form.reset();
      setState({ status: "success", message: "You're on the list. Watch your inbox." });
    } catch (err) {
      setState({ status: "error", message: err.message });
    }
  }

  const sent = state.status === "success";

  return (
    <form onSubmit={onSubmit} className="w-full" noValidate>
      <label htmlFor="newsletter-email" className="sr-only">Work email</label>
      <div className={clsx("flex overflow-hidden rounded-xl border transition-colors", sent ? "border-orange" : "border-soft/14 focus-within:border-soft/50")}>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={sent ? "Subscribed" : "Work email"}
          className={clsx("h-11 min-w-0 flex-1 bg-transparent px-5 text-base text-soft focus:outline-none sm:text-sm", sent ? "placeholder:text-orange" : "placeholder:text-soft/45")}
        />
        {/* Honeypot: real visitors never see or fill this. */}
        <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
        <button
          type="submit"
          aria-label="Subscribe"
          disabled={state.status === "loading" || sent}
          className="grid size-11 shrink-0 place-items-center border-l border-soft/14 text-soft transition-colors hover:bg-soft hover:text-ink disabled:pointer-events-none disabled:opacity-50"
        >
          {state.status === "loading" ? <Loader2 className="size-4 animate-spin" /> : sent ? <Check className="size-4" /> : <ArrowRight className="size-4" />}
        </button>
      </div>
      <p role="status" aria-live="polite" className={clsx("mt-3 text-[13px] font-medium", state.status === "error" ? "text-orange" : "text-soft/55")}>
        {state.message || "Monthly. No spam. Unsubscribe any time."}
      </p>
    </form>
  );
}

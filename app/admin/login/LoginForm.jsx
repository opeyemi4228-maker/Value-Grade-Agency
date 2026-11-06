"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, LoaderCircle, Lock } from "lucide-react";
import { login } from "../actions";

export default function LoginForm({ next }) {
  const [state, action, pending] = useActionState(login, null);
  const [show, setShow] = useState(false);
  return (
    <form action={action} className="mt-8 space-y-4">
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="password" className="text-[13px] font-semibold text-forest">
          Password
        </label>
        <div className="relative mt-2">
          <Lock className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-forest/40" aria-hidden="true" />
          <input
            id="password"
            name="password"
            type={show ? "text" : "password"}
            required
            autoFocus
            autoComplete="current-password"
            aria-invalid={Boolean(state?.error)}
            aria-describedby={state?.error ? "login-error" : undefined}
            className="h-12 w-full rounded-xl border border-line bg-white pr-12 pl-11 text-sm text-forest outline-none focus:border-forest/40 focus:ring-4 focus:ring-forest/[0.07] aria-invalid:border-[#e5928a]"
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-forest/45 hover:text-forest"
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {state?.error && (
          <p id="login-error" role="alert" className="mt-2 text-[13px] font-medium text-[#b42318]">
            {state.error}
          </p>
        )}
      </div>
      <button
        disabled={pending}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-forest text-sm font-bold text-soft transition-colors hover:bg-emerald disabled:opacity-70"
      >
        {pending && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

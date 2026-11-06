"use client";

import { useActionState, useState } from "react";
import { Check, Loader2, Mail, ShieldCheck, X } from "lucide-react";
import clsx from "clsx";
import { decidePayout, startVerification } from "@/app/dashboard/actions";
import { changePassword, resendVerification, updateProfile } from "@/app/(auth)/actions";

function Note({ state }) {
  if (state?.error) return <p role="alert" className="text-[12.5px] font-semibold text-red-700">{state.error}</p>;
  if (state?.message) return <p role="status" className="text-[12.5px] font-semibold text-emerald-700">{state.message}</p>;
  return null;
}

// Approve / reject with an explicit confirm step, since approving can send money.
export function ApprovalButtons({ approvalId, label }) {
  const [state, action, pending] = useActionState(decidePayout, {});
  const [confirm, setConfirm] = useState(null);

  if (state?.ok) return <Note state={state} />;

  return (
    <div className="flex flex-col items-end gap-2">
      {confirm ? (
        <form action={action} className="flex flex-wrap items-center justify-end gap-2">
          <input type="hidden" name="approvalId" value={approvalId} />
          <input type="hidden" name="decision" value={confirm} />
          {confirm === "reject" && (
            <input name="note" placeholder="Reason (optional)" maxLength={500} className="h-9 w-44 rounded-lg border border-forest/15 px-3 text-[13px] outline-none focus:border-forest/50" aria-label="Rejection reason" />
          )}
          <span className="text-[12.5px] font-semibold text-forest/60">{confirm === "approve" ? `Pay ${label}?` : "Reject?"}</span>
          <button type="submit" disabled={pending} className={clsx("inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-[13px] font-semibold", confirm === "approve" ? "bg-forest text-soft" : "bg-red-600 text-white")}>
            {pending && <Loader2 className="size-3.5 animate-spin" />} Confirm
          </button>
          <button type="button" onClick={() => setConfirm(null)} className="h-9 rounded-lg px-3 text-[13px] font-semibold text-forest/60 hover:bg-forest/5">Cancel</button>
        </form>
      ) : (
        <div className="flex gap-2">
          <button onClick={() => setConfirm("reject")} className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-[13px] font-semibold text-forest ring-1 ring-forest/15 hover:ring-red-300 hover:text-red-700">
            <X className="size-3.5" aria-hidden="true" /> Reject
          </button>
          <button onClick={() => setConfirm("approve")} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-orange px-3 text-[13px] font-semibold text-ink hover:bg-forest hover:text-soft">
            <Check className="size-3.5" aria-hidden="true" /> Approve
          </button>
        </div>
      )}
      <Note state={state} />
    </div>
  );
}

export function VerificationButton({ again }) {
  const [state, action, pending] = useActionState(startVerification, {});
  return (
    <form action={action} className="space-y-3">
      <button type="submit" disabled={pending || state?.ok} className="inline-flex h-11 items-center gap-2 rounded-xl bg-forest px-5 text-[14px] font-semibold text-soft hover:bg-orange hover:text-ink disabled:opacity-60">
        {pending ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
        {again ? "Resend verification email" : "Start verification"}
      </button>
      <Note state={state} />
    </form>
  );
}

export function ResendVerification() {
  const [state, action, pending] = useActionState(resendVerification, {});
  return (
    <form action={action} className="flex flex-wrap items-center gap-3">
      <button type="submit" disabled={pending} className="inline-flex h-10 items-center gap-2 rounded-xl bg-forest px-4 text-[13.5px] font-semibold text-soft hover:bg-orange hover:text-ink disabled:opacity-60">
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Mail className="size-4" />} Resend email
      </button>
      <Note state={state} />
    </form>
  );
}

const input = "h-11 w-full rounded-xl border border-forest/15 bg-white px-4 text-[14.5px] font-medium text-forest outline-none focus:border-forest/50 focus:ring-4 focus:ring-forest/[0.07]";

export function ProfileForm({ user }) {
  const [state, action, pending] = useActionState(updateProfile, {});
  const e = state?.errors || {};
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <label className="block text-[13px] font-semibold text-forest">Full name
        <input name="name" defaultValue={user.name} autoComplete="name" className={clsx(input, "mt-1.5")} />
        {e.name && <span className="mt-1 block text-[12px] text-red-700">{e.name}</span>}
      </label>
      <label className="block text-[13px] font-semibold text-forest">{user.type === "client" ? "Company" : "Channel or handle"}
        <input name="company" defaultValue={user.company || ""} autoComplete="organization" className={clsx(input, "mt-1.5")} />
        {e.company && <span className="mt-1 block text-[12px] text-red-700">{e.company}</span>}
      </label>
      <label className="block text-[13px] font-semibold text-forest sm:col-span-2">Email
        <input value={user.email} disabled className={clsx(input, "mt-1.5 bg-forest/[0.03] text-forest/60")} />
        <span className="mt-1 block text-[12px] font-medium text-forest/50">To change your login email, contact VGA.</span>
      </label>
      <div className="flex items-center gap-3 sm:col-span-2">
        <button type="submit" disabled={pending} className="inline-flex h-10 items-center gap-2 rounded-xl bg-forest px-4 text-[13.5px] font-semibold text-soft hover:bg-orange hover:text-ink disabled:opacity-60">
          {pending && <Loader2 className="size-4 animate-spin" />} Save profile
        </button>
        <Note state={state} />
      </div>
    </form>
  );
}

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, {});
  const e = state?.errors || {};
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <label className="block text-[13px] font-semibold text-forest sm:col-span-2">Current password
        <input name="current" type="password" autoComplete="current-password" className={clsx(input, "mt-1.5")} />
        {e.current && <span className="mt-1 block text-[12px] text-red-700">{e.current}</span>}
      </label>
      <label className="block text-[13px] font-semibold text-forest sm:col-span-2">New password
        <input name="password" type="password" autoComplete="new-password" className={clsx(input, "mt-1.5")} />
        <span className={clsx("mt-1 block text-[12px]", e.password ? "text-red-700" : "font-medium text-forest/50")}>{e.password || "At least 10 characters, with letters and numbers or symbols."}</span>
      </label>
      <div className="flex items-center gap-3 sm:col-span-2">
        <button type="submit" disabled={pending} className="inline-flex h-10 items-center gap-2 rounded-xl bg-forest px-4 text-[13.5px] font-semibold text-soft hover:bg-orange hover:text-ink disabled:opacity-60">
          {pending && <Loader2 className="size-4 animate-spin" />} Change password
        </button>
        <Note state={state} />
      </div>
    </form>
  );
}

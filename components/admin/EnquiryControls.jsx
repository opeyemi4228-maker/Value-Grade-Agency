"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import clsx from "clsx";
import { Check, Copy, LoaderCircle, Trash2 } from "lucide-react";
import { addNote, removeEnquiry, removeNote, updateStatus } from "@/app/admin/actions";
import { fmtDateTime } from "./format";
import { btn } from "./ui";

const STEPS = [
  { id: "new", label: "New", hint: "Received, no reply yet" },
  { id: "contacted", label: "Contacted", hint: "First reply sent" },
  { id: "qualified", label: "Qualified", hint: "A real fit, in discussion" },
  { id: "converted", label: "Converted", hint: "Signed, briefed or onboarded" },
];

export function StatusPipeline({ id, status }) {
  const [pending, start] = useTransition();
  const [optimistic, setOptimistic] = useState(status);
  useEffect(() => setOptimistic(status), [status]);
  const idx = STEPS.findIndex((s) => s.id === optimistic);
  const set = (s) => {
    setOptimistic(s);
    start(() => updateStatus(id, s));
  };
  return (
    <div>
      <ol className="space-y-1">
        {STEPS.map((s, i) => {
          const done = idx >= i && optimistic !== "archived";
          const isCur = optimistic === s.id;
          return (
            <li key={s.id}>
              <button
                onClick={() => set(s.id)}
                disabled={pending || isCur}
                className={clsx("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors", isCur ? "bg-forest text-soft" : "hover:bg-soft")}
                aria-pressed={isCur}
              >
                <span
                  className={clsx(
                    "grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-bold ring-1",
                    isCur ? "bg-orange text-ink ring-orange" : done ? "bg-forest/10 text-forest ring-forest/20" : "bg-white text-forest/40 ring-line",
                  )}
                >
                  {done && !isCur ? <Check className="size-3.5" strokeWidth={3} aria-hidden="true" /> : i + 1}
                </span>
                <span className="min-w-0">
                  <span className={clsx("block text-[13px] font-bold", isCur ? "text-soft" : "text-forest")}>{s.label}</span>
                  <span className={clsx("block text-[11.5px]", isCur ? "text-soft/65" : "text-forest/50")}>{s.hint}</span>
                </span>
                {isCur && pending && <LoaderCircle className="ml-auto size-4 animate-spin" aria-label="Saving" />}
              </button>
            </li>
          );
        })}
      </ol>
      <div className="mt-3 border-t border-line pt-3">
        <button
          onClick={() => set(optimistic === "archived" ? "new" : "archived")}
          disabled={pending}
          className={clsx(btn(optimistic === "archived" ? "secondary" : "ghost"), "w-full")}
        >
          {optimistic === "archived" ? "Restore to inbox" : "Archive enquiry"}
        </button>
      </div>
    </div>
  );
}

export function NoteForm({ id }) {
  const [state, action, pending] = useActionState(addNote.bind(null, id), null);
  const ref = useRef(null);
  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);
  return (
    <form ref={ref} action={action}>
      <label htmlFor="note" className="sr-only">
        Add an internal note
      </label>
      <textarea
        id="note"
        name="note"
        rows={3}
        maxLength={2000}
        placeholder="Add an internal note: call summary, next step, who owns it…"
        className="w-full resize-y rounded-xl border border-line bg-soft/50 px-3.5 py-3 text-[13px] text-forest outline-none placeholder:text-forest/40 focus:border-forest/30 focus:bg-white focus:ring-4 focus:ring-forest/[0.06]"
        onKeyDown={(e) => (e.metaKey || e.ctrlKey) && e.key === "Enter" && e.currentTarget.form.requestSubmit()}
      />
      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="text-[11px] text-forest/45">{state?.error ? <span className="text-[#b42318]">{state.error}</span> : "Visible to admins only. ⌘↵ to save."}</p>
        <button disabled={pending} className={btn("primary")}>
          {pending && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />} Save note
        </button>
      </div>
    </form>
  );
}

export function NoteItem({ id, note }) {
  const [pending, start] = useTransition();
  return (
    <li className={clsx("group rounded-xl border border-line/80 bg-cream/50 px-3.5 py-3 transition-opacity", pending && "opacity-50")}>
      <p className="text-[13px] whitespace-pre-wrap text-forest">{note.text}</p>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[11px] text-forest/45">{fmtDateTime(note.at)}</span>
        <button onClick={() => start(() => removeNote(id, note.id))} className="text-[11px] font-semibold text-forest/40 opacity-0 transition-opacity group-hover:opacity-100 hover:text-[#b42318] focus:opacity-100">
          Delete
        </button>
      </div>
    </li>
  );
}

export function CopyButton({ value, label = "Copy" }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        } catch {}
      }}
      className="grid size-7 place-items-center rounded-lg text-forest/40 hover:bg-soft hover:text-forest"
      aria-label={done ? "Copied" : label}
      title={done ? "Copied" : label}
    >
      {done ? <Check className="size-3.5 text-[#0b6b45]" strokeWidth={3} /> : <Copy className="size-3.5" />}
    </button>
  );
}

export function DeleteEnquiry({ id, backTo }) {
  const [confirm, setConfirm] = useState(false);
  const [pending, start] = useTransition();
  if (!confirm)
    return (
      <button onClick={() => setConfirm(true)} className={clsx(btn("danger"), "w-full")}>
        <Trash2 className="size-4" aria-hidden="true" /> Delete enquiry
      </button>
    );
  return (
    <div className="rounded-xl border border-[#f3c5c0] bg-[#fdecea]/60 p-3">
      <p className="text-[13px] font-semibold text-[#8a1c13]">Delete permanently? This can&apos;t be undone.</p>
      <div className="mt-3 flex gap-2">
        <button onClick={() => setConfirm(false)} className={clsx(btn("secondary"), "flex-1")}>
          Cancel
        </button>
        <button disabled={pending} onClick={() => start(() => removeEnquiry(id, backTo))} className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-full bg-[#b42318] text-[13px] font-semibold text-white hover:bg-[#8a1c13]">
          {pending && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />} Delete
        </button>
      </div>
    </div>
  );
}

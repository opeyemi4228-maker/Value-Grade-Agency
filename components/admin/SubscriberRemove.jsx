"use client";

import { useState, useTransition } from "react";
import { LoaderCircle, Trash2 } from "lucide-react";
import { deleteSubscriber } from "@/app/admin/actions";

export default function SubscriberRemove({ id, email }) {
  const [confirm, setConfirm] = useState(false);
  const [pending, start] = useTransition();
  if (confirm)
    return (
      <span className="inline-flex items-center gap-2">
        <button onClick={() => setConfirm(false)} className="text-xs font-semibold text-forest/55 hover:text-forest">
          Cancel
        </button>
        <button
          disabled={pending}
          onClick={() => start(() => deleteSubscriber(id))}
          className="inline-flex h-7 items-center gap-1.5 rounded-full bg-[#b42318] px-3 text-xs font-semibold text-white hover:bg-[#8a1c13]"
        >
          {pending && <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" />} Remove
        </button>
      </span>
    );
  return (
    <button
      onClick={() => setConfirm(true)}
      className="grid size-8 place-items-center rounded-lg text-forest/35 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-[#fdecea] hover:text-[#b42318] focus:opacity-100"
      aria-label={`Remove ${email}`}
    >
      <Trash2 className="size-4" />
    </button>
  );
}

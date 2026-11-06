"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { LoaderCircle, X } from "lucide-react";
import { bulkStatus } from "@/app/admin/actions";
import { fmtDateTime, timeAgo } from "./format";
import { Avatar, IntentBadge, SampleTag, StatusBadge } from "./ui";

const BULK = [
  { id: "contacted", label: "Mark contacted" },
  { id: "qualified", label: "Mark qualified" },
  { id: "converted", label: "Mark converted" },
  { id: "archived", label: "Archive" },
];

export default function EnquiryTable({ rows, showIntent = true, creator = false }) {
  const router = useRouter();
  const [selected, setSelected] = useState(() => new Set());
  const [pending, start] = useTransition();
  const all = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const toggle = (id) =>
    setSelected((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const apply = (status) =>
    start(async () => {
      await bulkStatus([...selected], status);
      setSelected(new Set());
      router.refresh();
    });

  return (
    <div className="relative">
      {selected.size > 0 && (
        <div className="sticky top-16 z-10 flex flex-wrap items-center gap-2 border-b border-line bg-forest px-5 py-2.5 text-soft">
          <span className="text-[13px] font-bold">{selected.size} selected</span>
          <span className="mx-1 h-4 w-px bg-soft/20" aria-hidden="true" />
          {BULK.map((b) => (
            <button key={b.id} disabled={pending} onClick={() => apply(b.id)} className="rounded-full px-3 py-1 text-xs font-semibold text-soft/85 ring-1 ring-soft/20 hover:bg-soft hover:text-forest disabled:opacity-50">
              {b.label}
            </button>
          ))}
          {pending && <LoaderCircle className="size-4 animate-spin" aria-label="Saving" />}
          <button onClick={() => setSelected(new Set())} className="ml-auto grid size-7 place-items-center rounded-full hover:bg-soft/10" aria-label="Clear selection">
            <X className="size-4" />
          </button>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className={clsx("w-full min-w-[760px] text-left text-[13px] transition-opacity", pending && "opacity-60")}>
          <thead>
            <tr className="text-[10.5px] font-bold tracking-[0.1em] text-forest/45 uppercase">
              <th className="w-12 py-3 pl-5">
                <input
                  type="checkbox"
                  checked={all}
                  onChange={() => setSelected(all ? new Set() : new Set(rows.map((r) => r.id)))}
                  aria-label="Select all on this page"
                  className="size-4 cursor-pointer rounded accent-forest"
                />
              </th>
              <th className="py-3 font-bold">{creator ? "Creator" : "From"}</th>
              {showIntent && <th className="py-3 font-bold">Type</th>}
              <th className="py-3 font-bold">{creator ? "Platform · niche" : "Service"}</th>
              {!creator && <th className="py-3 font-bold">Budget</th>}
              <th className="py-3 font-bold">Received</th>
              <th className="py-3 pr-5 text-right font-bold">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => {
              const go = () => router.push(`/admin/enquiries/${e.id}`);
              return (
                <tr
                  key={e.id}
                  onClick={(ev) => !ev.target.closest("input,a,button") && go()}
                  className={clsx("cursor-pointer border-t border-line/70 transition-colors hover:bg-soft/70", selected.has(e.id) && "bg-orange/[0.04]", e.status === "new" && "font-semibold")}
                >
                  <td className="py-3 pl-5">
                    <input type="checkbox" checked={selected.has(e.id)} onChange={() => toggle(e.id)} aria-label={`Select ${e.company || e.fullName}`} className="size-4 cursor-pointer rounded accent-forest" />
                  </td>
                  <td className="py-3 pr-4">
                    <a href={`/admin/enquiries/${e.id}`} onClick={(ev) => (ev.preventDefault(), go())} className="flex items-center gap-3">
                      <Avatar name={e.fullName} className="size-8 text-[11px]" />
                      <span className="min-w-0">
                        <span className="flex items-center gap-2 text-forest">
                          {e.status === "new" && <span className="size-1.5 shrink-0 rounded-full bg-orange" aria-label="Unread" />}
                          <span className="max-w-[200px] truncate">{e.company || e.fullName}</span>
                          {e.sample && <SampleTag />}
                        </span>
                        <span className="block max-w-[240px] truncate text-xs font-normal text-forest/50">{e.company ? `${e.fullName} · ${e.email}` : e.email}</span>
                      </span>
                    </a>
                  </td>
                  {showIntent && (
                    <td className="py-3 pr-4">
                      <IntentBadge intent={e.intent} />
                    </td>
                  )}
                  <td className="max-w-[220px] truncate py-3 pr-4 font-normal text-forest/70">{(creator ? e.role : e.service) || "—"}</td>
                  {!creator && <td className="py-3 pr-4 font-normal whitespace-nowrap text-forest/70">{e.budget || "—"}</td>}
                  <td className="py-3 pr-4 font-normal whitespace-nowrap text-forest/60" title={fmtDateTime(e.createdAt)}>
                    {timeAgo(e.createdAt)}
                  </td>
                  <td className="py-3 pr-5 text-right">
                    <StatusBadge status={e.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

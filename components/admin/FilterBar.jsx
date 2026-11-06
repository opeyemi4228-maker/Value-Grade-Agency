"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { LoaderCircle, Search } from "lucide-react";

const STATUS_OPTIONS = [
  { id: "", label: "Open (not archived)" },
  { id: "all", label: "All statuses" },
  { id: "new", label: "New" },
  { id: "contacted", label: "Contacted" },
  { id: "qualified", label: "Qualified" },
  { id: "converted", label: "Converted" },
  { id: "archived", label: "Archived" },
];

const selectCls =
  "h-9 rounded-full border border-line bg-white pr-8 pl-3.5 text-[13px] font-semibold text-forest outline-none focus:border-forest/30 focus:ring-4 focus:ring-forest/[0.06] appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 fill=%22none%22 stroke=%22%23002f1f%22 stroke-width=%222%22 viewBox=%220 0 24 24%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:12px] bg-[right_0.75rem_center] bg-no-repeat";

export default function FilterBar({ params, showStatus = true, placeholder = "Search name, company, email…" }) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, start] = useTransition();
  const [q, setQ] = useState(params.q || "");
  const first = useRef(true);

  const push = (patch) => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...params, ...patch, page: "" })) if (v) sp.set(k, v);
    start(() => router.replace(sp.size ? `${pathname}?${sp}` : pathname, { scroll: false }));
  };

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const t = setTimeout(() => push({ q: q.trim() }), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative">
        {pending ? (
          <LoaderCircle className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 animate-spin text-forest/40" aria-hidden="true" />
        ) : (
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-forest/40" aria-hidden="true" />
        )}
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          aria-label="Search"
          className="h-9 w-64 rounded-full border border-line bg-white pr-3 pl-9 text-[13px] text-forest outline-none placeholder:text-forest/40 focus:border-forest/30 focus:ring-4 focus:ring-forest/[0.06]"
        />
      </div>
      {showStatus && (
        <select aria-label="Status" value={params.status || ""} onChange={(e) => push({ status: e.target.value })} className={selectCls}>
          {STATUS_OPTIONS.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      )}
      <select aria-label="Sort" value={params.sort || ""} onChange={(e) => push({ sort: e.target.value })} className={clsx(selectCls)}>
        <option value="">Newest first</option>
        <option value="oldest">Oldest first</option>
      </select>
    </div>
  );
}

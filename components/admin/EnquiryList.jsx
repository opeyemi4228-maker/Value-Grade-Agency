// Server component: the inbox used by /admin/enquiries and /admin/creators.
import Link from "next/link";
import clsx from "clsx";
import { ChevronLeft, ChevronRight, Download, Inbox } from "lucide-react";
import { INTENT_META } from "@/lib/admin/metrics";
import { PAGE_SIZE, filterEnquiries } from "@/lib/admin/query";
import { STATUSES, getDb } from "@/lib/admin/store";
import EnquiryTable from "./EnquiryTable";
import FilterBar from "./FilterBar";
import { EmptyState, PageHeader, btn } from "./ui";

const TABS = [
  { id: "", label: "All" },
  { id: "brand", label: "Brand leads" },
  { id: "proposal", label: INTENT_META.proposal.short },
  { id: "call", label: INTENT_META.call.short },
  { id: "creator", label: INTENT_META.creator.short },
  { id: "general", label: INTENT_META.general.short },
];

export default async function EnquiryList({ basePath, params, lockedIntent, title, description }) {
  const db = await getDb();
  const pool = lockedIntent ? db.enquiries.filter((e) => e.intent === lockedIntent) : db.enquiries;
  const intent = lockedIntent || params.intent || "";
  const rows = filterEnquiries(pool, { ...params, intent });
  const page = Math.max(1, Number.parseInt(params.page, 10) || 1);
  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const slice = rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const inTab = filterEnquiries(pool, { intent, status: "all" });
  const statusCounts = Object.fromEntries(STATUSES.map((st) => [st.id, inTab.filter((e) => e.status === st.id).length]));

  const href = (patch) => {
    const q = new URLSearchParams();
    const merged = { ...params, ...patch };
    for (const [k, v] of Object.entries(merged)) if (v && !(lockedIntent && k === "intent")) q.set(k, v);
    const s = q.toString();
    return s ? `${basePath}?${s}` : basePath;
  };
  const exportQ = new URLSearchParams({ type: "enquiries", ...(intent && { intent }), ...(params.status && { status: params.status }), ...(params.q && { q: params.q }) });

  return (
    <>
      <PageHeader title={title} description={description}>
        <a href={`/api/admin/export?${exportQ}`} className={btn("secondary")}>
          <Download className="size-4" aria-hidden="true" /> Export CSV
        </a>
      </PageHeader>

      <div className="rounded-2xl border border-line/80 bg-white shadow-[0_1px_2px_rgb(1_28_19/0.04)]">
        <div className="flex flex-col gap-3 border-b border-line px-4 pt-3 sm:px-5">
          {lockedIntent ? (
            <div className="flex gap-1 overflow-x-auto">
              {[{ id: "", label: "Open" }, ...STATUSES].map((s) => {
                const active = (params.status || "") === s.id;
                return (
                  <Link key={s.id || "open"} href={href({ status: s.id, page: "" })} className={clsx("rounded-full px-3 py-1.5 text-[13px] font-semibold whitespace-nowrap", active ? "bg-forest text-soft" : "text-forest/60 hover:bg-soft hover:text-forest")}>
                    {s.label}
                    {s.id && <span className={clsx("ml-1.5 text-[11px] tabular-nums", active ? "text-soft/70" : "text-forest/40")}>{statusCounts[s.id]}</span>}
                  </Link>
                );
              })}
            </div>
          ) : (
            <nav aria-label="Enquiry type" className="-mb-px flex gap-1 overflow-x-auto">
              {TABS.map((t) => {
                const active = intent === t.id;
                return (
                  <Link
                    key={t.id || "all"}
                    href={href({ intent: t.id, page: "" })}
                    aria-current={active ? "page" : undefined}
                    className={clsx("flex items-center gap-2 border-b-2 px-3 pt-1.5 pb-3 text-[13px] font-semibold whitespace-nowrap transition-colors", active ? "border-orange text-forest" : "border-transparent text-forest/55 hover:text-forest")}
                  >
                    {INTENT_META[t.id] && <span className="size-2 rounded-[3px]" style={{ background: INTENT_META[t.id].color }} aria-hidden="true" />}
                    {t.label}
                  </Link>
                );
              })}
            </nav>
          )}
          <div className="pb-3">
            <FilterBar params={params} showStatus={!lockedIntent} />
          </div>
        </div>

        {slice.length ? (
          <EnquiryTable rows={slice} showIntent={!lockedIntent} creator={lockedIntent === "creator"} />
        ) : (
          <EmptyState icon={Inbox} title={params.q ? `Nothing matches “${params.q}”` : "No enquiries here"}>
            {params.q || params.status ? "Try a different search or filter." : "New submissions from the website will appear here."}
          </EmptyState>
        )}

        <div className="flex flex-col items-center justify-between gap-3 border-t border-line px-5 py-3.5 text-[13px] text-forest/60 sm:flex-row">
          <p>
            {rows.length ? (
              <>
                Showing <span className="font-semibold text-forest">{(current - 1) * PAGE_SIZE + 1}–{(current - 1) * PAGE_SIZE + slice.length}</span> of{" "}
                <span className="font-semibold text-forest">{rows.length}</span>
              </>
            ) : (
              "0 results"
            )}
          </p>
          <div className="flex items-center gap-1.5">
            <Link aria-disabled={current <= 1} href={href({ page: String(current - 1) })} className={clsx("grid size-9 place-items-center rounded-full border border-line bg-white text-forest transition-colors hover:border-forest/30 hover:bg-soft", current <= 1 && "pointer-events-none opacity-40")} aria-label="Previous page">
              <ChevronLeft className="size-4" />
            </Link>
            <span className="px-2 tabular-nums">
              Page {current} of {pages}
            </span>
            <Link aria-disabled={current >= pages} href={href({ page: String(current + 1) })} className={clsx("grid size-9 place-items-center rounded-full border border-line bg-white text-forest transition-colors hover:border-forest/30 hover:bg-soft", current >= pages && "pointer-events-none opacity-40")} aria-label="Next page">
              <ChevronRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

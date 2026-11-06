import { Database } from "lucide-react";
import Dashboard from "@/components/admin/Dashboard";
import { btn } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { buildMetrics, getRange } from "@/lib/admin/metrics";
import { getDb } from "@/lib/admin/store";
import { seedSample } from "../actions";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage({ searchParams }) {
  await requireAdmin();
  const { range } = await searchParams;
  const db = await getDb();
  const m = buildMetrics(db, getRange(range).id);
  const isEmpty = db.enquiries.length === 0 && db.subscribers.length === 0;

  const emptyState = isEmpty ? (
    <div className="relative mb-4 overflow-hidden rounded-2xl bg-gradient-to-br from-forest to-ink p-6 text-soft sm:p-8">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-orange text-ink">
            <Database className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-lg font-bold">No submissions yet</p>
            <p className="mt-1 max-w-xl text-sm text-soft/65">
              Enquiries and newsletter sign-ups from the website land here automatically. To try the dashboard first, load fictional sample data. You can remove it from Settings in one click.
            </p>
          </div>
        </div>
        <form action={seedSample}>
          <button className={btn("accent")}>Load sample data</button>
        </form>
      </div>
    </div>
  ) : null;

  return <Dashboard m={m} exportHref={`/api/admin/export?type=enquiries&status=all&range=${m.range.id}`} emptyState={emptyState} />;
}

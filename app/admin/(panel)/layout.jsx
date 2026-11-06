import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin/auth";
import { getDb } from "@/lib/admin/store";

export default async function PanelLayout({ children }) {
  await requireAdmin();
  const db = await getDb();
  const fresh = db.enquiries.filter((e) => e.status === "new");
  const counts = {
    total: fresh.length,
    brand: fresh.filter((e) => e.intent !== "creator").length,
    creators: fresh.filter((e) => e.intent === "creator").length,
  };
  const newItems = fresh.slice(0, 6).map(({ id, intent, company, fullName, createdAt }) => ({ id, intent, company, fullName, createdAt }));
  return (
    <AdminShell counts={counts} newItems={newItems}>
      {children}
    </AdminShell>
  );
}

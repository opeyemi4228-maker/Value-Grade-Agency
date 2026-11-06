// Shared list filtering for the enquiries table and its CSV export, so both always agree.
import { INTENT_ORDER } from "./metrics";

export const PAGE_SIZE = 20;

export function filterEnquiries(list, { intent, status, q, sort } = {}) {
  const query = (q || "").trim().toLowerCase();
  const rows = list.filter((e) => {
    if (intent === "brand" ? e.intent !== "proposal" && e.intent !== "call" : INTENT_ORDER.includes(intent) && e.intent !== intent) return false;
    if (status && status !== "all" && e.status !== status) return false;
    if (!status && e.status === "archived") return false; // archived hidden unless asked for
    if (query) {
      const hay = [e.fullName, e.company, e.email, e.phone, e.role, e.service, e.message].join(" ").toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });
  if (sort === "oldest") rows.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  else rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return rows;
}

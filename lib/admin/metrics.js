// Turns raw submissions into the numbers the dashboard shows. Pure functions: no I/O.
import { BUDGET_OPTIONS } from "@/lib/formOptions";
import { site } from "@/lib/site";

export const RANGES = [
  { id: "7d", label: "Last 7 days", days: 7 },
  { id: "30d", label: "Last 30 days", days: 30 },
  { id: "90d", label: "Last 90 days", days: 90 },
  { id: "12m", label: "Last 12 months", days: 364 },
];
export const DEFAULT_RANGE = "30d";

export const INTENT_META = {
  proposal: { label: "Proposal requests", short: "Proposals", color: "#0f7a52" },
  call: { label: "Strategy calls", short: "Calls", color: "#2a78d6" },
  creator: { label: "Creator applications", short: "Creators", color: "#eb6834" },
  general: { label: "General enquiries", short: "General", color: "#7a5bd6" },
};
// Fixed order = fixed colour per intent (validated as an adjacent set; never re-ordered by rank).
export const INTENT_ORDER = ["proposal", "call", "creator", "general"];

// Share of enquiries that should have a reply logged (status moved past "New").
export const RESPONSE_TARGET = 0.8;

const DAY = 86_400_000;
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function getRange(id) {
  return RANGES.find((r) => r.id === id) || RANGES.find((r) => r.id === DEFAULT_RANGE);
}

const dayFmt = new Intl.DateTimeFormat("en-CA", { timeZone: site.timeZone, year: "numeric", month: "2-digit", day: "2-digit" });
const weekdayFmt = new Intl.DateTimeFormat("en-GB", { timeZone: site.timeZone, weekday: "short" });
export const dayKey = (d) => dayFmt.format(new Date(d));

export function delta(cur, prev) {
  if (!prev) return cur ? null : 0; // null = "new" (nothing to compare against)
  return (cur - prev) / prev;
}

function kpi(cur, prev) {
  return { value: cur, prev, delta: delta(cur, prev) };
}

export function periodBounds(range, now = new Date()) {
  const end = now.getTime();
  const start = end - range.days * DAY;
  return { start, end, prevStart: start - range.days * DAY };
}

export function buildMetrics(db, rangeId, now = new Date()) {
  const range = getRange(rangeId);
  const { start, end, prevStart } = periodBounds(range, now);
  const t = (x) => new Date(x.createdAt).getTime();
  const cur = db.enquiries.filter((e) => t(e) > start && t(e) <= end);
  const prev = db.enquiries.filter((e) => t(e) > prevStart && t(e) <= start);
  const subsCur = db.subscribers.filter((s) => t(s) > start && t(s) <= end);
  const subsPrev = db.subscribers.filter((s) => t(s) > prevStart && t(s) <= start);
  const count = (list, pred) => list.filter(pred).length;
  const isBrand = (e) => e.intent === "proposal" || e.intent === "call";

  // Trend: daily buckets up to 90 days, weekly beyond that.
  const bucketDays = range.days > 90 ? 7 : 1;
  const buckets = Math.ceil(range.days / bucketDays);
  const trend = Array.from({ length: buckets }, (_, i) => {
    const bEnd = end - (buckets - 1 - i) * bucketDays * DAY;
    return { date: new Date(bEnd).toISOString(), cur: 0, prev: 0 };
  });
  const slot = (time, base) => {
    const idx = buckets - 1 - Math.floor((end - (time + base)) / (bucketDays * DAY));
    return idx >= 0 && idx < buckets ? idx : -1;
  };
  for (const e of cur) {
    const i = slot(t(e), 0);
    if (i >= 0) trend[i].cur++;
  }
  for (const e of prev) {
    const i = slot(t(e), range.days * DAY);
    if (i >= 0) trend[i].prev++;
  }

  const byIntent = INTENT_ORDER.map((id) => ({ id, ...INTENT_META[id], value: count(cur, (e) => e.intent === id), prev: count(prev, (e) => e.intent === id) }));

  const weekday = WEEKDAYS.map((label) => ({ label, value: 0 }));
  for (const e of cur) weekday[WEEKDAYS.indexOf(weekdayFmt.format(new Date(e.createdAt)))].value++;

  const responded = cur.filter((e) => e.status !== "new");
  const hours = responded
    .filter((e) => e.firstResponseAt)
    .map((e) => (new Date(e.firstResponseAt) - new Date(e.createdAt)) / 3_600_000)
    .sort((a, b) => a - b);
  const median = hours.length ? hours[Math.floor(hours.length / 2)] : null;

  const tally = (list, key) => {
    const m = new Map();
    for (const e of list) if (e[key]) m.set(e[key], (m.get(e[key]) || 0) + 1);
    return m;
  };
  const services = [...tally(cur.filter((e) => e.intent !== "creator"), "service")]
    .filter(([k]) => k !== "Joining the creator network")
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);
  const budgetMap = tally(cur, "budget");
  const budgets = BUDGET_OPTIONS.map((label) => ({ label, value: budgetMap.get(label) || 0 }));

  // Newsletter growth: running total of subscribers at the end of each bucket.
  const subsBefore = db.subscribers.filter((s) => t(s) <= start).length;
  let running = subsBefore;
  const subsTrend = trend.map((b, i) => {
    const bStart = i === 0 ? start : new Date(trend[i - 1].date).getTime();
    running += db.subscribers.filter((s) => t(s) > bStart && t(s) <= new Date(b.date).getTime()).length;
    return { date: b.date, value: running };
  });

  return {
    range,
    bounds: { start: new Date(start).toISOString(), end: new Date(end).toISOString() },
    bucketDays,
    kpis: {
      enquiries: kpi(cur.length, prev.length),
      brand: kpi(count(cur, isBrand), count(prev, isBrand)),
      creators: kpi(count(cur, (e) => e.intent === "creator"), count(prev, (e) => e.intent === "creator")),
      subscribers: kpi(subsCur.length, subsPrev.length),
    },
    trend,
    byIntent,
    weekday,
    response: {
      rate: cur.length ? responded.length / cur.length : null,
      responded: responded.length,
      total: cur.length,
      awaiting: cur.length - responded.length,
      medianHours: median,
      target: RESPONSE_TARGET,
    },
    services,
    budgets,
    subsTrend,
    totals: { enquiries: db.enquiries.length, subscribers: db.subscribers.length, newEnquiries: count(db.enquiries, (e) => e.status === "new") },
    recent: db.enquiries.slice(0, 6),
    activity: db.activity.slice(0, 8),
  };
}

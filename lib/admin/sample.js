// Fictional records for trying the dashboard before real submissions arrive. Every record is
// flagged `sample: true`, labelled "Sample" in the UI, and removable from Settings in one click.
import { randomUUID } from "node:crypto";
import { BUDGET_OPTIONS, CAMPAIGN_OPTIONS, SERVICE_OPTIONS } from "@/lib/formOptions";

const FIRST = ["Adaeze", "Tunde", "Chioma", "Kemi", "Ifeanyi", "Zainab", "Seun", "Amara", "Bola", "Emeka", "Funmi", "Yusuf", "Ngozi", "Dapo", "Halima", "Obinna", "Temi", "Musa"];
const LAST = ["Okafor", "Adeyemi", "Bello", "Eze", "Nwosu", "Lawal", "Okon", "Balogun", "Ibrahim", "Ogunleye", "Uche", "Danjuma"];
const COMPANIES = ["Northwind Telecom", "Harbour Bank", "Kola Foods", "Brightline Fintech", "Savanna Beverages", "Meridian Media Group", "Palmline Insurance", "Lagoon Mobility", "Atlas Retail", "Crestview Agency", "Greenfield FMCG", "Bluepeak Digital"];
const ROLES = ["Head of Marketing", "Brand Manager", "Growth Lead", "Marketing Director", "Digital Lead", "Account Director"];
const CREATORS = ["Instagram · Lifestyle", "TikTok · Comedy", "YouTube · Tech reviews", "Instagram · Beauty", "TikTok · Finance tips", "X · Football", "YouTube · Food"];
const MESSAGES = {
  proposal: [
    "We're planning a Q1 launch and want 20–30 creators across Lagos and Abuja with verified reporting.",
    "Looking for an always-on creator programme with clear payout records our finance team can audit.",
    "We need a proposal for a regional campaign with KYC-checked creators and weekly reporting.",
  ],
  call: [
    "Would like a 30-minute call to talk through our creator strategy for next year.",
    "Keen to understand how your verification and payout process works before we brief.",
  ],
  general: [
    "Do you work with agencies outside Nigeria? We have clients in Ghana and Kenya.",
    "Can you share a capability deck for our procurement team?",
  ],
  creator: [
    "I create weekly content and have run paid partnerships with two banks. Happy to share analytics.",
    "Mostly short-form video, strong engagement with 18–24 audiences. Looking for long-term briefs.",
  ],
};

// Small seeded PRNG so a reload gives a stable shape within one call.
function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

export function sampleData(now = new Date()) {
  const r = rng(now.getUTCFullYear() * 1000 + now.getUTCMonth() * 50 + now.getUTCDate());
  const pick = (arr) => arr[Math.floor(r() * arr.length)];
  const DAY = 86_400_000;
  const enquiries = [];

  for (let d = 119; d >= 0; d--) {
    const day = new Date(now.getTime() - d * DAY);
    const weekday = day.getUTCDay();
    const trend = 1 + (119 - d) / 160; // gentle growth over the window
    const weekdayLift = weekday === 2 || weekday === 3 ? 1.5 : weekday === 0 || weekday === 6 ? 0.45 : 1;
    const count = Math.round(r() * 2.6 * trend * weekdayLift);
    for (let i = 0; i < count; i++) {
      const roll = r();
      const intent = roll < 0.34 ? "proposal" : roll < 0.56 ? "call" : roll < 0.7 ? "general" : "creator";
      const createdAt = new Date(day.getTime() - Math.floor(r() * 10 * 3600_000)).toISOString();
      const ageDays = d;
      const sr = r();
      const status =
        ageDays < 2 ? "new" : sr < 0.12 ? "new" : sr < 0.4 ? "contacted" : sr < 0.62 ? "qualified" : sr < 0.8 ? "converted" : "archived";
      const name = `${pick(FIRST)} ${pick(LAST)}`;
      const creator = intent === "creator";
      const brief = intent === "proposal" || intent === "call";
      const firstResponseAt = status === "new" ? undefined : new Date(new Date(createdAt).getTime() + (2 + r() * 40) * 3600_000).toISOString();
      enquiries.push({
        id: randomUUID(),
        sample: true,
        createdAt,
        updatedAt: firstResponseAt || createdAt,
        firstResponseAt,
        status,
        emailed: true,
        notes: [],
        intent,
        fullName: name,
        company: creator ? `@${name.split(" ")[0].toLowerCase()}${Math.floor(r() * 90 + 10)}` : intent === "general" && r() < 0.4 ? "" : pick(COMPANIES),
        role: creator ? pick(CREATORS) : pick(ROLES),
        email: `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
        phone: r() < 0.7 ? `+234 80${Math.floor(r() * 9)} ${Math.floor(100 + r() * 899)} ${Math.floor(1000 + r() * 8999)}` : "",
        service: creator ? "Joining the creator network" : brief ? pick(SERVICE_OPTIONS.slice(0, 6)) : r() < 0.5 ? "Not sure yet" : "",
        campaignType: brief ? pick(CAMPAIGN_OPTIONS) : "",
        budget: brief ? pick(BUDGET_OPTIONS) : "",
        contactMethod: pick(["Email", "Email", "Phone", "WhatsApp"]),
        message: pick(MESSAGES[intent]),
      });
    }
  }

  const subscribers = [];
  for (let d = 119; d >= 0; d--) {
    const n = r() < 0.55 ? Math.round(r() * 2) : 0;
    for (let i = 0; i < n; i++) {
      const name = `${pick(FIRST)}.${pick(LAST)}`.toLowerCase();
      subscribers.push({
        id: randomUUID(),
        sample: true,
        email: `${name}${Math.floor(r() * 900)}@example.com`,
        createdAt: new Date(now.getTime() - d * DAY - Math.floor(r() * 12 * 3600_000)).toISOString(),
      });
    }
  }

  return { enquiries, subscribers };
}

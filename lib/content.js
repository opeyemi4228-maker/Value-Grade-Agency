// Shared website copy. Draft copy pending VGA approval. Keep figures out of here
// unless VGA has signed them off (see Confidentiality Rules in the project guide).
import {
  BadgeCheck,
  BarChart3,
  ClipboardCheck,
  Eye,
  FileCheck2,
  FileSearch,
  Fingerprint,
  Gauge,
  Handshake,
  LayoutGrid,
  LineChart,
  Megaphone,
  Receipt,
  RefreshCw,
  Scale,
  Search,
  ShieldCheck,
  Shuffle,
  TriangleAlert,
  UserCheck,
  Users,
  Wallet,
  Workflow,
} from "lucide-react";

// Shown under the hero in place of unapproved metrics.
export const standards = [
  { stamp: "AGREED", title: "Pricing and deliverables", detail: "Signed off before a single post goes live." },
  { stamp: "VERIFIED", title: "Creators and results", detail: "Identity checks and analytics verification." },
  { stamp: "APPROVED", title: "Invoices and payouts", detail: "One approval flow with a clear owner." },
  { stamp: "RECORDED", title: "Every transaction", detail: "Audit-friendly records for finance teams." },
];

export const problems = [
  {
    icon: Eye,
    title: "Opacity",
    body: "Lack of clear pricing, deliverables, verification and performance visibility.",
  },
  {
    icon: Shuffle,
    title: "Friction",
    body: "Manual briefings, scattered approvals, delayed feedback and disconnected campaign execution.",
  },
  {
    icon: TriangleAlert,
    title: "Risk",
    body: "Unverified partners, unclear agreements, weak reporting and poor payment documentation.",
  },
];

export const comparison = {
  columns: ["Typical influencer marketplace", "In-house spreadsheets", "Value Grade Agency"],
  rows: [
    { label: "Pricing clarity", values: ["Varies by creator", "Negotiated ad hoc", "Agreed upfront"] },
    { label: "Creator verification", values: ["Self-declared", "Rarely checked", "KYC-checked"] },
    { label: "Deliverables", values: ["Loosely defined", "In email threads", "Written into the agreement"] },
    { label: "Approvals", values: ["Chat threads", "Forwarded emails", "One structured flow"] },
    { label: "Performance reporting", values: ["Screenshots", "Manual exports", "Verified analytics"] },
    { label: "Payout records", values: ["Limited", "Scattered", "Audit-ready"] },
  ],
  footnote: "Reflects typical market models. Individual providers may differ.",
};

export const solutionSteps = [
  {
    key: "find",
    icon: Search,
    title: "Find",
    lead: "Match the right creators to the brief.",
    body: "We shortlist creators and partners by audience fit, content quality and verified history, not follower counts alone.",
    points: ["Audience and category fit", "Identity verification", "Brand-safety screening"],
  },
  {
    key: "agree",
    icon: Handshake,
    title: "Agree",
    lead: "Lock in deliverables, timelines and fees.",
    body: "Every creator works to a written agreement: what will be posted, when, the approval steps and how they get paid.",
    points: ["Written deliverables", "Agreed pricing", "Content approval steps"],
  },
  {
    key: "execute",
    icon: Workflow,
    title: "Execute",
    lead: "Run the campaign in one structured flow.",
    body: "Briefs, drafts, approvals and go-live are managed in one place, so nothing gets lost between brand, agency and creator.",
    points: ["Centralised briefing", "Tracked approvals", "On-schedule delivery"],
  },
  {
    key: "measure",
    icon: BarChart3,
    title: "Measure",
    lead: "Verify performance, then pay against proof.",
    body: "Results are tracked and checked before invoices are approved, and every payout is recorded for your finance team.",
    points: ["Verified analytics", "Payouts tied to delivery", "Audit-friendly reporting"],
  },
];

export const services = [
  {
    key: "campaigns",
    icon: Megaphone,
    title: "Creator & Influencer Campaign Management",
    body: "We run your creator campaigns end to end, from brief to wrap-up.",
  },
  {
    key: "performance",
    icon: LineChart,
    title: "Performance Marketing Campaign Support",
    body: "Affiliate and partner programmes paid on tracked results.",
  },
  {
    key: "payouts",
    icon: Wallet,
    title: "Creator & Partner Payout Administration",
    body: "Approved, recorded payouts to every creator and partner.",
  },
  {
    key: "compliance",
    icon: ShieldCheck,
    title: "KYC, Compliance & Brand Safety Support",
    body: "Every creator checked before they represent your brand.",
  },
  {
    key: "analytics",
    icon: BarChart3,
    title: "Analytics & Campaign Reporting",
    body: "Verified results in a report you can take to the boardroom.",
  },
  {
    key: "enterprise",
    icon: LayoutGrid,
    title: "Enterprise Campaign Programme Design",
    body: "Always-on creator programmes for large organisations.",
  },
];

export const cycle = [
  { icon: FileSearch, title: "Brand Brief", short: "Goals, audience and KPIs agreed", body: "Objectives, audience, budget range, KPIs and brand guardrails are captured in one brief." },
  { icon: Users, title: "Creator Matching", short: "Verified creators shortlisted", body: "Verified creators and partners are shortlisted against the brief and presented for approval." },
  { icon: Workflow, title: "Campaign Execution", short: "Content approved and published", body: "Agreements signed, content drafted, approved and published on schedule." },
  { icon: Gauge, title: "Analytics Verification", short: "Results checked against the brief", body: "Performance is tracked and checked against the agreed deliverables." },
  { icon: ClipboardCheck, title: "Invoice & Approval", short: "Invoices matched to delivery", body: "Invoices are matched to verified delivery and routed for approval." },
  { icon: Wallet, title: "Partner Payouts", short: "Creators paid, receipts on file", body: "Approved payouts are sent and recorded, with receipts for every transaction." },
  { icon: LineChart, title: "Performance Review", short: "A clear report on results", body: "A clear report on what was delivered, what it achieved and what it cost." },
  { icon: RefreshCw, title: "Optimisation", short: "Learnings shape the next campaign", body: "Learnings feed the next brief: better creators, sharper content, stronger returns." },
];

export const complianceFeatures = [
  { id: "kyc", icon: Fingerprint, title: "KYC", body: "Identity checks for creators and partners before onboarding." },
  { icon: Scale, title: "Compliance Support", body: "Disclosure guidance and campaign rules aligned to your policies." },
  { icon: UserCheck, title: "Creator Verification", body: "Audience and account checks to confirm creators are who they say." },
  { id: "records", icon: Receipt, title: "Payment Records", body: "Every payout logged with amount, date, recipient and approval." },
  { icon: ShieldCheck, title: "Brand Safety", body: "Content and creator history screened against your guardrails." },
  { icon: FileCheck2, title: "Tax Documentation Support", body: "Help collecting the documentation finance needs from partners." },
  { icon: BarChart3, title: "Campaign Reporting", body: "Verified performance reporting, not screenshots." },
  { icon: BadgeCheck, title: "Audit-Friendly Records", body: "Agreements, approvals and payments organised for review." },
];

export const values = [
  { icon: Handshake, title: "Accountable", body: "One point of contact who owns the outcome of every campaign." },
  { icon: Search, title: "Transparent", body: "You see the pricing, the approvals and the real numbers." },
  { icon: BadgeCheck, title: "Verified", body: "Creators, results and payouts are checked before they count." },
  { icon: Gauge, title: "Measurable", body: "Every campaign is planned around outcomes you can track." },
];

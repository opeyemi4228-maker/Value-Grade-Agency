// Demo data that mirrors Grade's documented response shapes. Used when GRADE_* env vars are
// not set, so the portal can be reviewed end to end. All names and figures are fictional.
import "server-only";

const today = new Date();
const daysAgo = (n) => new Date(today.getTime() - n * 86_400_000).toISOString();

const campaigns = [
  { campaignId: "demo_q4_launch", campaignName: "Q4 Launch: Creator Push", campaignStatus: "ONGOING", startDate: daysAgo(40), endDate: daysAgo(-20), campaignDescription: "Fintech app launch with lifestyle and tech creators." },
  { campaignId: "demo_wallet_drive", campaignName: "Wallet Funding Drive", campaignStatus: "ONGOING", startDate: daysAgo(25), endDate: daysAgo(-35), campaignDescription: "Performance campaign paid per verified wallet funding." },
  { campaignId: "demo_fmcg_sampling", campaignName: "FMCG Sampling Week", campaignStatus: "COMPLETED", startDate: daysAgo(90), endDate: daysAgo(60), campaignDescription: "Product sampling with food creators." },
];

const names = [
  ["Adaeze Okafor", "adaeze@example.com"],
  ["Tobi Kolade", "tobi@example.com"],
  ["Kemi Martins", "kemi@example.com"],
  ["Zainab Bello", "zainab@example.com"],
  ["Chidi Nwosu", "chidi@example.com"],
  ["Funmi Adeyemi", "funmi@example.com"],
  ["Kwame Asante", "kwame@example.com"],
  ["Wanjiru Kamau", "wanjiru@example.com"],
];

function seeded(i, n) {
  return ((i * 9301 + n * 49297) % 233280) / 233280;
}

const creatorsByCampaign = Object.fromEntries(
  campaigns.map((c, ci) => [
    c.campaignId,
    names.slice(0, 8 - ci * 2).map(([creatorName, creatorEmail], i) => {
      const r = seeded(i + 1, ci + 3);
      const views = Math.round(40_000 + r * 260_000);
      return {
        campaignId: c.campaignId,
        campaignCreatorRecordId: `CCR_${ci}${i}`,
        creatorProfileId: `CP_${i}`,
        creatorName,
        creatorEmail,
        isVerified: i !== 3,
        payoutType: ci === 1 ? "PERFORMANCE" : i % 3 === 0 ? "HYBRID" : "FIXED",
        pendingValue: c.campaignStatus === "COMPLETED" ? 0 : Math.round(150 + r * 650),
        currency: "USD",
        totalPosts: 1 + Math.round(r * 5),
        totalViews: views,
        totalLikes: Math.round(views * 0.072),
        totalComments: Math.round(views * 0.006),
        totalShares: Math.round(views * 0.004),
        lastCalculatedAt: daysAgo(0.1),
      };
    }),
  ]),
);

// Mutable in demo mode so approve / reject visibly works (per server instance).
const state = globalThis.__vgaGradeDemo || (globalThis.__vgaGradeDemo = {
  approvals: [
    ...creatorsByCampaign.demo_q4_launch.slice(0, 4).map((cr, i) => ({
      id: `demo-appr-q4-${i}`,
      approvalId: `demo-appr-q4-${i}`,
      status: "PENDING",
      campaignId: "demo_q4_launch",
      campaignCreatorRecordId: cr.campaignCreatorRecordId,
      creatorName: cr.creatorName,
      creatorEmail: cr.creatorEmail,
      amount: cr.pendingValue,
      currency: "USD",
      description: i % 2 ? "2 Reels delivered and verified" : "Fixed fee plus 312 verified sign-ups",
      invoiceId: `inv_demo_q4_${i}`,
      createdAt: daysAgo(i + 1),
      decidedAt: null,
    })),
    ...creatorsByCampaign.demo_wallet_drive.slice(0, 2).map((cr, i) => ({
      id: `demo-appr-wd-${i}`,
      approvalId: `demo-appr-wd-${i}`,
      status: "PENDING",
      campaignId: "demo_wallet_drive",
      campaignCreatorRecordId: cr.campaignCreatorRecordId,
      creatorName: cr.creatorName,
      creatorEmail: cr.creatorEmail,
      amount: cr.pendingValue,
      currency: "USD",
      description: "Verified wallet fundings, week 3",
      invoiceId: `inv_demo_wd_${i}`,
      createdAt: daysAgo(i + 2),
      decidedAt: null,
    })),
    ...creatorsByCampaign.demo_fmcg_sampling.slice(0, 4).map((cr, i) => ({
      id: `demo-appr-fm-${i}`,
      approvalId: `demo-appr-fm-${i}`,
      status: "APPROVED",
      campaignId: "demo_fmcg_sampling",
      campaignCreatorRecordId: cr.campaignCreatorRecordId,
      creatorName: cr.creatorName,
      creatorEmail: cr.creatorEmail,
      amount: 300 + i * 85,
      currency: "USD",
      description: "Sampling content package",
      invoiceId: `inv_demo_fm_${i}`,
      createdAt: daysAgo(62 + i),
      decidedAt: daysAgo(60 + i),
    })),
  ],
  kyc: {},
});

const sum = (arr, k) => arr.reduce((t, x) => t + (x[k] || 0), 0);

export function listCampaigns({ search } = {}) {
  const q = (search || "").toLowerCase();
  return { campaigns: campaigns.filter((c) => !q || c.campaignName.toLowerCase().includes(q)), metrics: null };
}

export function getCampaign(id) {
  const campaign = campaigns.find((c) => c.campaignId === id);
  if (!campaign) return null;
  const cr = creatorsByCampaign[id];
  return {
    campaign,
    analytics: {
      totalCreators: cr.length,
      totalViews: sum(cr, "totalViews"),
      totalLikes: sum(cr, "totalLikes"),
      totalComments: sum(cr, "totalComments"),
      totalShares: sum(cr, "totalShares"),
    },
  };
}

export function listCampaignCreators(id) {
  return { creators: [...(creatorsByCampaign[id] || [])].sort((a, b) => b.totalViews - a.totalViews) };
}

export function listApprovals({ campaignId, status }) {
  const statuses = (status || "").split(",").filter(Boolean);
  return {
    approvals: state.approvals
      .filter((a) => (!campaignId || a.campaignId === campaignId) && (!statuses.length || statuses.includes(a.status)))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  };
}

export function getApproval(id) {
  return state.approvals.find((a) => a.id === id) || null;
}

export function decideApproval(id, decision, note) {
  const a = getApproval(id);
  if (!a || a.status !== "PENDING") return { success: false };
  a.status = decision === "approve" ? "APPROVED" : "REJECTED";
  a.decidedAt = new Date().toISOString();
  a.rejectionNote = decision === "approve" ? null : note;
  return { success: true };
}

// Daily views per campaign: a gentle upward trend with weekly rhythm, scaled to each campaign's
// tracked total. Deterministic, so the chart doesn't jump between reloads.
export function analyticsSeries(campaignIds, { days = 30 } = {}) {
  const out = [];
  for (let d = days - 1; d >= 0; d--) {
    const day = new Date(today.getTime() - d * 86_400_000);
    let value = 0;
    for (const id of campaignIds) {
      const c = campaigns.find((x) => x.campaignId === id);
      if (!c) continue;
      const started = (today - new Date(c.startDate)) / 86_400_000;
      const ended = c.endDate && new Date(c.endDate) < day;
      if (ended) continue;
      // Demo campaigns are treated as running across the whole window, so the period-on-period
      // change stays realistic (roughly +20–30%) rather than reflecting the sample launch dates.
      const base = sum(creatorsByCampaign[id], "totalViews") / Math.max(started, 1);
      const trend = 0.7 + ((days - d) / days) * 0.45;
      const weekly = 1 + 0.18 * Math.sin((day.getDay() / 7) * Math.PI * 2);
      const noise = 0.85 + seeded(d + 3, id.length) * 0.3;
      value += base * trend * weekly * noise;
    }
    out.push({ date: day.toISOString().slice(0, 10), value: Math.round(value) });
  }
  return out;
}

const postTitles = ["Unboxing the new app in 60 seconds", "Funding my wallet live", "What I spend in a week in Lagos", "Honest review after 30 days", "Day in the life: launch week", "3 features nobody talks about"];
const platforms = ["TIKTOK", "INSTAGRAM", "YOUTUBE", "TIKTOK", "INSTAGRAM", "TWITTER"];

export function analyticsTop(campaignIds, { limit = 5 } = {}) {
  return campaignIds
    .flatMap((id) => (creatorsByCampaign[id] || []).map((cr, i) => ({ cr, i, id })))
    .map(({ cr, i, id }) => ({
      id: `${cr.campaignCreatorRecordId}_top`,
      title: postTitles[(i + id.length) % postTitles.length],
      author: cr.creatorName,
      handle: `@${cr.creatorName.split(" ")[0].toLowerCase()}`,
      platform: platforms[(i + id.length) % platforms.length],
      url: null,
      value: Math.round(cr.totalViews * 0.42),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

export function creatorTotalPaid(email) {
  return { email, spentAmountUSD: 3570, spentAmountPreferred: 5_355_000, preferredCurrency: "NGN" };
}

export function creatorReceipts() {
  return {
    receipts: [
      { invoiceId: "inv_demo_r1", status: "PAID", payoutDate: daysAgo(6), earningsValue: 620, campaignName: "Q4 Launch: Creator Push", currency: "USD" },
      { invoiceId: "inv_demo_r2", status: "PAID", payoutDate: daysAgo(34), earningsValue: 480, campaignName: "Wallet Funding Drive", currency: "USD" },
      { invoiceId: "inv_demo_r3", status: "PAID", payoutDate: daysAgo(61), earningsValue: 1280, campaignName: "FMCG Sampling Week", currency: "USD" },
      { invoiceId: "inv_demo_r4", status: "PAID", payoutDate: daysAgo(95), earningsValue: 540, campaignName: "Back to School Creators", currency: "USD" },
      { invoiceId: "inv_demo_r5", status: "PAID", payoutDate: daysAgo(128), earningsValue: 360, campaignName: "Savings Week", currency: "USD" },
      { invoiceId: "inv_demo_r6", status: "PAID", payoutDate: daysAgo(150), earningsValue: 290, campaignName: "Savings Week", currency: "USD" },
    ],
  };
}

export function creatorPayouts() {
  return {
    payouts: [
      { payoutId: "CCPAY_demo_4", status: "pending", currency: "USD", amount: 410, campaignName: "Q4 Launch: Creator Push", createdAt: daysAgo(1) },
      { payoutId: "CCPAY_demo_3", status: "completed", currency: "USD", amount: 620, campaignName: "Q4 Launch: Creator Push", createdAt: daysAgo(6) },
      { payoutId: "CCPAY_demo_2", status: "completed", currency: "USD", amount: 480, campaignName: "Wallet Funding Drive", createdAt: daysAgo(34) },
      { payoutId: "CCPAY_demo_1", status: "completed", currency: "USD", amount: 1280, campaignName: "FMCG Sampling Week", createdAt: daysAgo(61) },
    ],
    meta: { bufferBusinessDays: 2 },
  };
}

export function kycStatus(email) {
  return state.kyc[email.toLowerCase()] || null;
}

export function kycInvite(email) {
  const now = new Date().toISOString();
  const conn = {
    connectionId: `SDKKYC_demo_${Object.keys(state.kyc).length + 1}`,
    email,
    inviteStatus: "sent",
    inviteSentAt: now,
    inviteExpiresAt: new Date(Date.now() + 7 * 86_400_000).toISOString(),
    kycStatus: "invited",
    kycCurrentStep: null,
    kycCompletedSteps: [],
    updatedAt: now,
  };
  state.kyc[email.toLowerCase()] = conn;
  return conn;
}

// A tiny valid PDF so downloads work in demo mode.
export function invoicePdf(invoiceId) {
  const text = `Value Grade Agency - demo invoice ${invoiceId}`.replace(/[()\\]/g, "");
  const stream = `BT /F1 18 Tf 60 760 Td (${text}) Tj ET`;
  const objs = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [];
  objs.forEach((o, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${o}\nendobj\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${offsets.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`).join("")}`;
  pdf += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Response(pdf, { headers: { "Content-Type": "application/pdf" } });
}

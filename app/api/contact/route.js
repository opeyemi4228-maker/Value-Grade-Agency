import { NextResponse } from "next/server";
import { addEnquiry } from "@/lib/admin/store";
import { clientIp, looksLikeBot, rateLimited, sendMail, validateEnquiry, verifyTurnstile } from "@/lib/forms";

const SUBJECTS = {
  proposal: "Proposal request",
  call: "Strategy call request",
  general: "General enquiry",
  creator: "Creator network application",
};

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request." }, { status: 400 });
  }

  // Pretend success to bots so they don't retry.
  if (looksLikeBot(body)) return NextResponse.json({ success: true });

  const ip = clientIp(request);
  if (rateLimited(ip)) {
    return NextResponse.json({ success: false, message: "Too many submissions. Please try again later." }, { status: 429 });
  }

  if (!(await verifyTurnstile(body["cf-turnstile-response"], ip))) {
    return NextResponse.json({ success: false, message: "Spam check failed. Please refresh and try again." }, { status: 400 });
  }

  const { data, errors } = validateEnquiry(body);
  if (Object.keys(errors).length) {
    return NextResponse.json({ success: false, message: "Please check the highlighted fields.", errors }, { status: 422 });
  }

  const ok = await sendMail({
    subject: `[VGA website] ${SUBJECTS[data.intent]}: ${data.company || data.fullName}`,
    replyTo: data.email,
    fields: {
      "Request type": SUBJECTS[data.intent],
      "Full name": data.fullName,
      Company: data.company,
      Role: data.role,
      Email: data.email,
      Phone: data.phone,
      "Service interest": data.service,
      "Campaign type": data.campaignType,
      "Budget range": data.budget,
      "Preferred contact": data.contactMethod,
      Message: data.message,
    },
  });

  // Keep a copy for the admin dashboard. A storage failure must never lose the lead,
  // so it only matters when the email failed too.
  let saved = false;
  try {
    await addEnquiry(data, { emailed: ok });
    saved = true;
  } catch (err) {
    console.error("[forms] Could not save enquiry to the admin store:", err.code || err.message);
  }

  if (!ok && !saved) {
    return NextResponse.json({ success: false, message: "We couldn't send your message. Please email us directly." }, { status: 502 });
  }
  return NextResponse.json({ success: true });
}

import { NextResponse } from "next/server";
import { addSubscriber } from "@/lib/admin/store";
import { clean, clientIp, isEmail, rateLimited, sendMail } from "@/lib/forms";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request." }, { status: 400 });
  }

  if (body.company_website) return NextResponse.json({ success: true });

  const email = clean(body.email, 160).toLowerCase();
  if (!isEmail(email)) {
    return NextResponse.json({ success: false, message: "Please enter a valid email address." }, { status: 422 });
  }
  if (rateLimited(`nl:${clientIp(request)}`, 3)) {
    return NextResponse.json({ success: false, message: "Too many attempts. Please try again later." }, { status: 429 });
  }

  // TODO(VGA): swap for a mailing-list provider (Mailchimp, Brevo, Resend Audiences) once chosen.
  const ok = await sendMail({ subject: "[VGA website] Newsletter sign-up", replyTo: email, fields: { Email: email } });
  let saved = false;
  try {
    await addSubscriber(email);
    saved = true;
  } catch (err) {
    console.error("[forms] Could not save subscriber to the admin store:", err.code || err.message);
  }
  if (!ok && !saved) return NextResponse.json({ success: false, message: "Sign-up failed. Please try again later." }, { status: 502 });
  return NextResponse.json({ success: true });
}

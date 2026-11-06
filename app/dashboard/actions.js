"use server";

import { revalidatePath } from "next/cache";
import { canSeeData, requireUser } from "@/lib/auth/session";
import * as grade from "@/lib/grade/client";
import { creatorEmail, normaliseApproval, ownsCampaign } from "@/lib/portal";
import { clean, rateLimited } from "@/lib/forms";

// Approve or reject one payout request. Approving can execute a real payout, so ownership is
// re-checked against Grade's own record of the approval before anything is sent.
export async function decidePayout(_prev, form) {
  const user = await requireUser();
  if (user.type !== "client" || !canSeeData(user)) return { error: "You don't have access to approvals." };
  if (rateLimited(`decide:${user.id}`, 60, 10 * 60_000)) return { error: "Too many actions. Please wait a moment." };

  const id = clean(form.get("approvalId"), 100);
  const decision = form.get("decision") === "approve" ? "approve" : "reject";
  const note = clean(form.get("note"), 500);

  try {
    const raw = await grade.getApproval(id);
    const approval = raw && normaliseApproval(raw);
    if (!approval || !ownsCampaign(user, approval.campaignId)) return { error: "Approval not found." };
    if (approval.status !== "PENDING") return { error: "This payout has already been decided." };
    await grade.decideApproval(id, decision, { note: note || `Rejected by ${user.name}` });
  } catch (err) {
    if (err.status === 409) return { error: "This payout has already been decided." };
    console.error("[portal] decidePayout", err);
    return { error: "Grade couldn't process that right now. Please try again." };
  }
  revalidatePath("/dashboard", "layout");
  return { ok: true, message: decision === "approve" ? "Payout approved." : "Payout rejected." };
}

export async function startVerification() {
  const user = await requireUser();
  if (user.type !== "creator" || !canSeeData(user)) return { error: "Verification opens once your account is linked." };
  if (rateLimited(`kyc:${user.id}`, 3, 60 * 60_000)) return { error: "Please wait before requesting another invite." };
  try {
    const conn = await grade.kycInvite(creatorEmail(user));
    revalidatePath("/dashboard/verification");
    return conn?.kycStatus === "complete"
      ? { ok: true, message: "You're already verified." }
      : { ok: true, message: `Check ${creatorEmail(user)} for an email from Grade with your secure verification link.` };
  } catch (err) {
    console.error("[portal] kycInvite", err);
    return { error: "We couldn't send the invite. Please try again or contact VGA." };
  }
}

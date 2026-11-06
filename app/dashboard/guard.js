import "server-only";

import { notFound, redirect } from "next/navigation";
import { canSeeData, requireUser } from "@/lib/auth/session";

// For data pages: signed in, verified, linked by VGA and the right account type.
export async function requirePortal(type) {
  const user = await requireUser();
  if (!canSeeData(user)) redirect("/dashboard");
  if (type && user.type !== type) notFound();
  return user;
}

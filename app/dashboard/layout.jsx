import PortalShell from "@/components/portal/PortalShell";
import { canSeeData, requireUser } from "@/lib/auth/session";
import { demoMode } from "@/lib/grade/client";
import { clientApprovals } from "@/lib/portal";

export const metadata = {
  title: { default: "Dashboard", template: "%s | VGA Portal" },
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }) {
  const user = await requireUser();
  const linked = canSeeData(user);
  let pending = 0;
  if (linked && user.type === "client") {
    pending = await clientApprovals(user).then((a) => a.length).catch(() => 0);
  }
  return (
    <PortalShell user={{ name: user.name, email: user.email, company: user.company, type: user.type }} linked={linked} pending={pending} demo={linked && demoMode()}>
      {children}
    </PortalShell>
  );
}

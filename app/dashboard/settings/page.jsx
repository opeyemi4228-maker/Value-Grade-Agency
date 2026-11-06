import { requireUser } from "@/lib/auth/session";
import { Card, PageTitle } from "@/components/portal/ui";
import { PasswordForm, ProfileForm } from "@/components/portal/Actions";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await requireUser();
  return (
    <>
      <PageTitle title="Settings" intro="Manage your profile and password." />
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card title="Profile"><ProfileForm user={{ name: user.name, company: user.company, email: user.email, type: user.type }} /></Card>
        <Card title="Password"><PasswordForm /></Card>
      </div>
    </>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/AuthForms";
import { getUser } from "@/lib/auth/session";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Log in",
  description: "Log in to your Value Grade Agency account to track campaigns, approve creator payouts and download invoices.",
  path: "/login",
});

export default async function LoginPage({ searchParams }) {
  const { next } = await searchParams;
  if (await getUser()) redirect("/dashboard");
  return (
    <AuthShell
      title="Welcome back"
      intro="Log in to see your campaigns, payouts and invoices."
      footer={<>New to VGA? <Link href="/signup" className="font-bold text-forest underline decoration-orange decoration-2 underline-offset-4">Create an account</Link></>}
    >
      <LoginForm next={typeof next === "string" ? next : ""} />
    </AuthShell>
  );
}

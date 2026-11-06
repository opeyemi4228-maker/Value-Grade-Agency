import Link from "next/link";
import { redirect } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import { SignupForm } from "@/components/auth/AuthForms";
import { getUser } from "@/lib/auth/session";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Create an account",
  description: "Create a free Value Grade Agency account. Brands and agencies track creator campaigns and approve payouts; creators see their campaigns, verification and payouts.",
  path: "/signup",
});

export default async function SignupPage({ searchParams }) {
  const { as } = await searchParams;
  if (await getUser()) redirect("/dashboard");
  return (
    <AuthShell
      title="Create your account"
      intro="Free to join. Once you confirm your email, VGA links your account to your campaigns or creator record."
      footer={<>Already have an account? <Link href="/login" className="font-bold text-forest underline decoration-orange decoration-2 underline-offset-4">Log in</Link></>}
    >
      <SignupForm defaultType={as === "creator" ? "creator" : "client"} />
    </AuthShell>
  );
}

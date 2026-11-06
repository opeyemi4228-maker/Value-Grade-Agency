import Link from "next/link";
import { redirect } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/AuthForms";
import { Building2, Sparkles } from "lucide-react";
import { getUser } from "@/lib/auth/session";
import { DEMO_ACCOUNTS, demoLoginEnabled } from "@/lib/auth/demo";
import { demoLogIn } from "../actions";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Log in",
  description: "Log in to your Value Grade Agency account to track campaigns, approve creator payouts and download invoices.",
  path: "/login",
});

// Shown only while demo login is enabled (sample Grade data, never in live mode).
function DemoAccess() {
  const options = [
    { type: "client", icon: Building2, label: "Brand or agency", hint: "Campaigns & approvals" },
    { type: "creator", icon: Sparkles, label: "Creator", hint: "Payouts & verification" },
  ];
  return (
    <section className="mt-6 rounded-2xl border border-dashed border-orange/40 bg-orange/[0.05] p-4" aria-labelledby="demo-title">
      <p id="demo-title" className="flex items-center gap-2 text-[13px] font-semibold text-forest">
        <span className="size-1.5 rounded-full bg-orange" aria-hidden="true" /> Try the demo portal
      </p>
      <p className="mt-0.5 text-[12.5px] font-medium text-muted">Sample Grade data only. No real accounts or payouts.</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {options.map(({ type, icon: Icon, label, hint }) => (
          <form key={type} action={demoLogIn}>
            <input type="hidden" name="type" value={type} />
            <button type="submit" className="group flex w-full items-center gap-3 rounded-xl border border-forest/12 bg-white p-3 text-left transition-colors hover:border-forest/35">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-forest text-orange"><Icon className="size-4" aria-hidden="true" /></span>
              <span className="min-w-0">
                <span className="block text-[13.5px] font-semibold text-forest">{label}</span>
                <span className="block truncate text-[12px] font-medium text-muted">{hint}</span>
              </span>
            </button>
          </form>
        ))}
      </div>
      <details className="mt-3 text-[12px] font-medium text-muted">
        <summary className="cursor-pointer select-none hover:text-forest">Prefer to type the details?</summary>
        <dl className="mt-2 space-y-1.5 rounded-lg bg-white p-3 font-mono text-[11.5px] text-forest">
          {Object.entries(DEMO_ACCOUNTS).map(([type, a]) => (
            <div key={type}>
              <dt className="font-sans text-[11px] font-semibold text-forest/50 uppercase">{type === "client" ? "Brand or agency" : "Creator"}</dt>
              <dd className="break-all">{a.email}</dd>
              <dd>{a.password}</dd>
            </div>
          ))}
        </dl>
      </details>
    </section>
  );
}

export default async function LoginPage({ searchParams }) {
  const { next } = await searchParams;
  if (await getUser()) redirect("/dashboard");
  return (
    <AuthShell
      title="Welcome back"
      intro="Log in to see your campaigns, payouts and invoices."
      footer={<>New to VGA? <Link href="/onboarding" className="font-bold text-forest underline decoration-orange decoration-2 underline-offset-4">Create an account</Link></>}
    >
      <LoginForm next={typeof next === "string" ? next : ""} />
      {demoLoginEnabled() && <DemoAccess />}
    </AuthShell>
  );
}

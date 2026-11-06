"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { BadgeCheck, CheckSquare, FileText, FolderKanban, LayoutDashboard, LifeBuoy, LogOut, Menu, Settings, Wallet, X } from "lucide-react";
import Logo, { LogoMark } from "../Logo";
import { logOut } from "@/app/(auth)/actions";

const NAV = {
  client: [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/campaigns", label: "Campaigns", icon: FolderKanban },
    { href: "/dashboard/approvals", label: "Approvals", icon: CheckSquare, badge: true },
    { href: "/dashboard/invoices", label: "Invoices", icon: FileText },
  ],
  creator: [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/payouts", label: "Payouts", icon: Wallet },
    { href: "/dashboard/invoices", label: "Receipts", icon: FileText },
    { href: "/dashboard/verification", label: "Verification", icon: BadgeCheck },
  ],
};

function Nav({ items, pending, onNavigate }) {
  const pathname = usePathname();
  return (
    <ul className="space-y-1">
      {items.map(({ href, label, icon: Icon, exact, badge }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <li key={href}>
            <Link
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={clsx(
                "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium tracking-[-0.01em] transition-colors",
                active ? "bg-forest text-soft" : "text-forest/65 hover:bg-forest/[0.05] hover:text-forest",
              )}
            >
              {active && <span className="absolute top-2.5 bottom-2.5 left-0 w-[3px] rounded-r-full bg-orange" aria-hidden="true" />}
              <Icon className={clsx("size-[18px]", active ? "text-orange" : "text-forest/45")} aria-hidden="true" />
              <span className="flex-1">{label}</span>
              {badge && pending > 0 && <span className="rounded-full bg-orange px-2 py-0.5 text-[11px] font-semibold text-ink tabular-nums">{pending}<span className="sr-only"> pending</span></span>}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function PortalShell({ user, linked, pending = 0, demo, children }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);

  const items = linked ? NAV[user.type] : NAV[user.type].slice(0, 1);
  const initials = user.name.split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="px-1"><Logo tone="dark" /></div>
      <p className="mt-8 px-3 text-[11px] font-semibold tracking-wider text-forest/40 uppercase">{user.type === "client" ? "Client portal" : "Creator portal"}</p>
      <nav className="mt-2" aria-label="Portal">
        <Nav items={items} pending={pending} onNavigate={() => setOpen(false)} />
      </nav>
      <div className="mt-auto space-y-1 pt-4">
        <Link href="/contact?intent=general" className="mb-3 block rounded-2xl bg-gradient-to-br from-forest to-emerald p-4 text-soft transition-transform hover:-translate-y-0.5">
          <LifeBuoy className="size-5 text-orange" aria-hidden="true" />
          <span className="mt-3 block text-[14px] font-semibold tracking-[-0.01em]">Talk to your VGA lead</span>
          <span className="mt-0.5 block text-[12.5px] font-medium text-soft/60">Questions about a campaign or payout? We reply within one business day.</span>
        </Link>
        <div className="border-t border-forest/[0.08] pt-3" />
        <Nav items={[{ href: "/dashboard/settings", label: "Settings", icon: Settings }]} onNavigate={() => setOpen(false)} />
        <form action={logOut}>
          <button type="submit" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium text-forest/65 hover:bg-forest/[0.05] hover:text-forest">
            <LogOut className="size-[18px] text-forest/45" aria-hidden="true" /> Log out
          </button>
        </form>
        <div className="mt-3 flex items-center gap-3 rounded-xl bg-forest/[0.04] p-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-orange text-[12px] font-bold text-ink">{initials}</span>
          <span className="min-w-0">
            <span className="block truncate text-[13px] font-semibold text-forest">{user.name}</span>
            <span className="block truncate text-[11.5px] font-medium text-forest/50">{user.company || user.email}</span>
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh bg-soft lg:grid lg:grid-cols-[17rem_1fr]">
      <a href="#portal-main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-orange focus:px-4 focus:py-2 focus:text-ink">Skip to content</a>

      <aside className="no-scrollbar sticky top-0 hidden h-dvh overflow-y-auto border-r border-forest/[0.08] bg-white p-5 lg:block">{sidebar}</aside>

      {/* Mobile bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-forest/8 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-2" aria-label="Dashboard"><LogoMark className="h-7 w-auto" /><span className="text-[13px] font-semibold text-forest">Portal</span></Link>
        <button onClick={() => setOpen(true)} className="grid size-10 place-items-center rounded-xl bg-forest text-soft" aria-label="Open menu" aria-expanded={open}>
          <Menu className="size-5" />
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button className="absolute inset-0 bg-ink/50" onClick={() => setOpen(false)} aria-label="Close menu" />
          <div className="absolute inset-y-0 left-0 w-72 bg-white p-5 shadow-2xl">
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 grid size-9 place-items-center rounded-lg text-forest/60 hover:bg-forest/5" aria-label="Close menu"><X className="size-5" /></button>
            {sidebar}
          </div>
        </div>
      )}

      <div className="min-w-0">
        {demo && (
          <p className="flex items-center justify-center gap-2 bg-gradient-to-r from-ink via-forest to-ink px-5 py-2 text-center text-[12.5px] font-medium text-soft/75 sm:px-8">
            <span className="size-1.5 shrink-0 animate-pulse-dot rounded-full bg-orange" aria-hidden="true" />
            <span><span className="font-semibold text-soft">Demo mode.</span> Showing sample Grade data. Add the Grade API keys to go live.</span>
          </p>
        )}
        <main id="portal-main" className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-10">{children}</main>
      </div>
    </div>
  );
}

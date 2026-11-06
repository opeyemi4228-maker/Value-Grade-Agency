"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import {
  Bell,
  ExternalLink,
  Inbox,
  LayoutDashboard,
  LogOut,
  MailPlus,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  Sparkles,
  UserCog,
  X,
} from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { logout } from "@/app/admin/actions";
import { INTENT_META } from "@/lib/admin/metrics";
import { timeAgo } from "./format";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox, badge: "total" },
  { href: "/admin/creators", label: "Creator applications", icon: Sparkles, badge: "creators" },
  { href: "/admin/subscribers", label: "Subscribers", icon: MailPlus },
  { href: "/admin/accounts", label: "Portal accounts", icon: UserCog },
];
const NAV_BOTTOM = [{ href: "/admin/settings", label: "Settings", icon: Settings }];

function usePersisted(key, initial) {
  const [value, setValue] = useState(initial);
  useEffect(() => {
    try {
      const v = localStorage.getItem(key);
      if (v !== null) setValue(JSON.parse(v));
    } catch {}
  }, [key]);
  const set = (v) => {
    setValue(v);
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch {}
  };
  return [value, set];
}

function NavLink({ item, collapsed, counts, onNavigate }) {
  const pathname = usePathname();
  const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
  const count = item.badge ? counts[item.badge] : 0;
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      aria-current={active ? "page" : undefined}
      className={clsx(
        "group relative flex h-10 items-center gap-3 rounded-xl text-[13.5px] font-semibold transition-colors",
        collapsed ? "justify-center px-0" : "px-3",
        active ? "bg-forest text-soft shadow-[0_6px_16px_-8px_rgb(0_47_31/0.6)]" : "text-forest/65 hover:bg-forest/[0.05] hover:text-forest",
      )}
    >
      {active && <span className="absolute top-2 bottom-2 -left-3 w-[3px] rounded-r-full bg-orange" aria-hidden="true" />}
      <Icon className="size-[18px] shrink-0" strokeWidth={2} aria-hidden="true" />
      {!collapsed && <span className="truncate">{item.label}</span>}
      {count > 0 && (
        <span
          className={clsx(
            "rounded-full text-[10.5px] font-bold tabular-nums",
            collapsed ? "absolute top-1 right-1 grid size-4 place-items-center bg-orange text-ink" : "ml-auto px-2 py-0.5",
            !collapsed && (active ? "bg-orange text-ink" : "bg-orange/12 text-orange-deep"),
          )}
          aria-label={`${count} new`}
        >
          {collapsed ? "" : count}
        </span>
      )}
    </Link>
  );
}

function Sidebar({ collapsed, setCollapsed, counts, onNavigate, mobile }) {
  return (
    <div className="flex h-full flex-col">
      <div className={clsx("flex h-16 items-center", collapsed ? "justify-center" : "justify-between px-5")}>
        <Link href="/admin" onClick={onNavigate} className="flex items-center gap-2.5" aria-label="VGA Admin, dashboard">
          <LogoMark className="h-6 w-auto" />
          {!collapsed && (
            <span className="flex items-baseline gap-1.5">
              <span className="text-[15px] font-extrabold tracking-[0.08em] text-forest">VGA</span>
              <span className="text-[11px] font-bold tracking-[0.18em] text-orange-deep uppercase">Admin</span>
            </span>
          )}
        </Link>
        {mobile ? (
          <button onClick={onNavigate} className="grid size-8 place-items-center rounded-lg text-forest/60 hover:bg-forest/5" aria-label="Close menu">
            <X className="size-4" />
          </button>
        ) : (
          !collapsed && (
            <button onClick={() => setCollapsed(true)} className="grid size-8 place-items-center rounded-lg text-forest/50 hover:bg-forest/5 hover:text-forest" aria-label="Collapse sidebar">
              <PanelLeftClose className="size-4" />
            </button>
          )
        )}
      </div>

      <nav aria-label="Admin" className={clsx("flex flex-1 flex-col gap-1 pt-3", collapsed ? "px-2.5" : "px-4")}>
        {!collapsed && <p className="px-3 pb-1.5 text-[10.5px] font-bold tracking-[0.14em] text-forest/40 uppercase">Workspace</p>}
        {NAV.map((item) => (
          <NavLink key={item.href} item={item} collapsed={collapsed} counts={counts} onNavigate={onNavigate} />
        ))}
        <div className="my-4 h-px bg-line" />
        {NAV_BOTTOM.map((item) => (
          <NavLink key={item.href} item={item} collapsed={collapsed} counts={counts} onNavigate={onNavigate} />
        ))}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          title={collapsed ? "View website" : undefined}
          className={clsx("flex h-10 items-center gap-3 rounded-xl text-[13.5px] font-semibold text-forest/65 hover:bg-forest/[0.05] hover:text-forest", collapsed ? "justify-center" : "px-3")}
        >
          <ExternalLink className="size-[18px]" aria-hidden="true" />
          {!collapsed && "View website"}
        </a>

        <div className="mt-auto pb-4">
          {collapsed ? (
            <button
              onClick={() => setCollapsed(false)}
              className="mx-auto mt-4 grid size-10 place-items-center rounded-xl text-forest/50 hover:bg-forest/5 hover:text-forest"
              aria-label="Expand sidebar"
            >
              <PanelLeftOpen className="size-4" />
            </button>
          ) : (
            <div className="relative mt-6 overflow-hidden rounded-2xl bg-gradient-to-br from-forest to-ink p-4 text-soft">
              <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
              <div className="relative">
                <span className="grid size-8 place-items-center rounded-lg bg-orange text-ink">
                  <Inbox className="size-4" aria-hidden="true" />
                </span>
                <p className="mt-3 text-sm font-bold">Reply within 24 hours</p>
                <p className="mt-1 text-xs leading-relaxed text-soft/65">
                  {counts.total > 0 ? `${counts.total} ${counts.total === 1 ? "enquiry is" : "enquiries are"} waiting for a first reply.` : "Every enquiry has a reply logged. Nice work."}
                </p>
                <Link
                  href="/admin/enquiries?status=new"
                  onClick={onNavigate}
                  className="mt-3 flex h-9 items-center justify-center rounded-full bg-soft/10 text-xs font-bold ring-1 ring-soft/20 transition-colors hover:bg-orange hover:text-ink hover:ring-orange"
                >
                  Open the inbox
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

function useClickAway(open, setOpen) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, setOpen]);
  return ref;
}

function Notifications({ items, total }) {
  const [open, setOpen] = useState(false);
  const ref = useClickAway(open, setOpen);
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative grid size-10 place-items-center rounded-full border border-line bg-white text-forest/70 transition-colors hover:text-forest"
        aria-label={`Notifications, ${total} new`}
        aria-expanded={open}
      >
        <Bell className="size-[18px]" />
        {total > 0 && <span className="absolute top-2 right-2.5 size-2 rounded-full bg-orange ring-2 ring-white" aria-hidden="true" />}
      </button>
      {open && (
        <div className="absolute right-0 z-40 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line bg-white shadow-[0_24px_48px_-16px_rgb(1_28_19/0.25)]">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="text-sm font-bold text-forest">Awaiting reply</p>
            <span className="rounded-full bg-orange/12 px-2 py-0.5 text-[11px] font-bold text-orange-deep">{total} new</span>
          </div>
          {items.length ? (
            <ul className="max-h-80 overflow-y-auto">
              {items.map((e) => (
                <li key={e.id}>
                  <Link href={`/admin/enquiries/${e.id}`} onClick={() => setOpen(false)} className="flex gap-3 px-4 py-3 hover:bg-soft">
                    <span className="mt-1.5 size-2 shrink-0 rounded-[3px]" style={{ background: INTENT_META[e.intent]?.color }} aria-hidden="true" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-semibold text-forest">{e.company || e.fullName}</span>
                      <span className="block truncate text-xs text-forest/55">
                        {INTENT_META[e.intent]?.label} · {timeAgo(e.createdAt)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-8 text-center text-sm text-forest/55">You&apos;re all caught up.</p>
          )}
          <Link href="/admin/enquiries?status=new" onClick={() => setOpen(false)} className="block border-t border-line px-4 py-3 text-center text-[13px] font-bold text-forest hover:bg-soft">
            View all new enquiries
          </Link>
        </div>
      )}
    </div>
  );
}

function AccountMenu() {
  const [open, setOpen] = useState(false);
  const ref = useClickAway(open, setOpen);
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="grid size-10 place-items-center rounded-full bg-forest text-xs font-extrabold tracking-wider text-soft ring-2 ring-orange/70 ring-offset-2 ring-offset-soft"
        aria-label="Account menu"
        aria-expanded={open}
      >
        VG
      </button>
      {open && (
        <div className="absolute right-0 z-40 mt-2 w-56 overflow-hidden rounded-2xl border border-line bg-white p-1.5 shadow-[0_24px_48px_-16px_rgb(1_28_19/0.25)]">
          <div className="px-3 py-2.5">
            <p className="text-sm font-bold text-forest">VGA team</p>
            <p className="text-xs text-forest/55">Signed in as admin</p>
          </div>
          <Link href="/admin/settings" onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-semibold text-forest/80 hover:bg-soft">
            <Settings className="size-4" aria-hidden="true" /> Settings
          </Link>
          <form action={logout}>
            <button className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-semibold text-[#b42318] hover:bg-[#fdecea]">
              <LogOut className="size-4" aria-hidden="true" /> Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function SearchBox() {
  const router = useRouter();
  const ref = useRef(null);
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        ref.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const q = new FormData(e.currentTarget).get("q")?.toString().trim();
        router.push(q ? `/admin/enquiries?status=all&q=${encodeURIComponent(q)}` : "/admin/enquiries");
      }}
      className="group relative w-full max-w-sm"
    >
      <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-forest/40" aria-hidden="true" />
      <input
        ref={ref}
        name="q"
        type="search"
        placeholder="Search enquiries…"
        aria-label="Search enquiries by name, company or email"
        className="h-10 w-full rounded-full border border-line bg-white pr-14 pl-10 text-[13px] text-forest outline-none placeholder:text-forest/40 focus:border-forest/30 focus:ring-4 focus:ring-forest/[0.06]"
      />
      <kbd className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 rounded-md border border-line bg-soft px-1.5 py-0.5 font-sans text-[10.5px] font-semibold text-forest/45 sm:block">
        ⌘K
      </kbd>
    </form>
  );
}

export default function AdminShell({ counts, newItems, children }) {
  const [collapsed, setCollapsed] = usePersisted("vga-admin:sidebar-collapsed", false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <div className="min-h-dvh bg-[#f3f4f1] text-forest">
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-30 hidden border-r border-line/80 bg-white transition-[width] duration-200 lg:block",
          collapsed ? "w-[76px]" : "w-[264px]",
        )}
      >
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} counts={counts} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-[280px] bg-white shadow-2xl">
            <Sidebar collapsed={false} counts={counts} mobile onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className={clsx("transition-[padding] duration-200", collapsed ? "lg:pl-[76px]" : "lg:pl-[264px]")}>
        <header className="sticky top-0 z-20 border-b border-line/70 bg-[#f3f4f1]/85 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button onClick={() => setMobileOpen(true)} className="grid size-10 shrink-0 place-items-center rounded-full border border-line bg-white lg:hidden" aria-label="Open menu">
              <Menu className="size-[18px]" />
            </button>
            <SearchBox />
            <div className="ml-auto flex items-center gap-2.5">
              <Notifications items={newItems} total={counts.total} />
              <AccountMenu />
            </div>
          </div>
        </header>
        <main id="admin-main" className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

import clsx from "clsx";
import { ArrowUp, BadgeCheck, CalendarRange, Check, Clock3, FileText, Landmark, Smartphone, Wallet } from "lucide-react";
import Reveal from "../Reveal";
import { services } from "@/lib/content";

// Brief §8 services as product cards: a small UI view on a dark-green panel, then title and copy.
// Fictional names and placeholder figures only.
const ui = "rounded-xl bg-white text-forest shadow-[0_20px_40px_-20px_rgb(0_0_0/0.6)]";
const tiny = "text-[10px] font-bold tracking-wider text-forest/45 uppercase";

function Campaigns() {
  const rows = [["Adaeze O.", "4 / 4", 100], ["Tobi K.", "2 / 3", 66], ["Kemi M.", "1 / 2", 50]];
  return (
    <div className={clsx(ui, "w-full max-w-[17rem] p-4")}>
      <div className="flex items-center justify-between"><p className={tiny}>Q4 Launch</p><span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700">ACTIVE</span></div>
      <ul className="mt-3 space-y-2.5">
        {rows.map(([n, p, w]) => (
          <li key={n}>
            <div className="flex justify-between text-[11.5px] font-semibold"><span>{n}</span><span className="font-semibold text-forest/50">{p} posts</span></div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-forest/8"><div className={clsx("h-full rounded-full", w === 100 ? "bg-forest" : "bg-orange")} style={{ width: `${w}%` }} /></div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Performance() {
  return (
    <div className={clsx(ui, "w-full max-w-[17rem] p-4")}>
      <p className={tiny}>Verified sign-ups</p>
      <p className="mt-1 text-2xl font-bold tabular-nums">3,412</p>
      <svg viewBox="0 0 200 60" className="mt-2 h-14 w-full" fill="none" preserveAspectRatio="none">
        <path d="M0 55 C30 52 45 42 70 44 S110 30 130 28 S170 12 200 6" stroke="#FF6A00" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M0 55 C30 52 45 42 70 44 S110 30 130 28 S170 12 200 6 V60 H0Z" fill="#FF6A00" opacity="0.12" />
      </svg>
      <p className="mt-1 text-[10.5px] font-semibold text-forest/55">Partners paid per tracked result</p>
    </div>
  );
}

function Payouts() {
  const items = [[Landmark, "Adaeze O.", "₦450,000", "ml-6"], [Smartphone, "Tobi K.", "₦380,000", "ml-0"], [Wallet, "Kemi M.", "₦520,000", "ml-10"]];
  return (
    <div className="w-full max-w-[17rem] space-y-2">
      {items.map(([Icon, n, a, ml]) => (
        <div key={n} className={clsx(ui, ml, "flex items-center gap-2.5 px-3 py-2")}>
          <span className="grid size-7 place-items-center rounded-lg bg-forest text-orange"><Icon className="size-3.5" /></span>
          <span className="flex-1 text-[12px] font-semibold">{n}</span>
          <span className="text-[12px] font-bold tabular-nums">{a}</span>
          <span className="grid size-4 place-items-center rounded-full bg-emerald-600 text-white"><Check className="size-2.5" strokeWidth={3.5} /></span>
        </div>
      ))}
    </div>
  );
}

function Kyc() {
  const checks = [["Identity verified", true], ["Account & audience", true], ["Brand-safety history", true], ["Tax documents", false]];
  return (
    <div className={clsx(ui, "w-full max-w-[17rem] p-4")}>
      <div className="flex items-center gap-2.5">
        <span className="grid size-8 place-items-center rounded-full bg-orange text-[10px] font-semibold text-ink">ZB</span>
        <span><span className="flex items-center gap-1 text-[12px] font-bold">Zainab B. <BadgeCheck className="size-3.5 text-orange-deep" /></span><span className="block text-[10px] text-forest/50">Fashion · Instagram</span></span>
      </div>
      <ul className="mt-3 space-y-1.5">
        {checks.map(([t, ok]) => (
          <li key={t} className="flex items-center gap-2 text-[11px] font-semibold">
            {ok ? <span className="grid size-4 place-items-center rounded-full bg-forest text-orange"><Check className="size-2.5" strokeWidth={3.5} /></span> : <Clock3 className="size-4 text-orange-deep" />}
            <span className={ok ? "" : "text-forest/50"}>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Analytics() {
  const bars = [30, 46, 40, 62, 55, 78, 100];
  return (
    <div className={clsx(ui, "w-full max-w-[17rem] p-4")}>
      <div className="flex items-center justify-between"><p className={tiny}>Campaign report</p><FileText className="size-4 text-orange-deep" /></div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-cream p-2"><p className="text-[9px] font-semibold text-forest/50">Reach</p><p className="text-sm font-semibold">1.8M</p></div>
        <div className="rounded-lg bg-cream p-2"><p className="text-[9px] font-semibold text-forest/50">Cost / result</p><p className="text-sm font-semibold">₦2,491</p></div>
      </div>
      <div className="mt-3 flex h-12 items-end gap-1.5">
        {bars.map((h, i) => <span key={i} className={clsx("flex-1 rounded-t", i === bars.length - 1 ? "bg-orange" : "bg-forest/80")} style={{ height: `${h}%` }} />)}
      </div>
    </div>
  );
}

function Enterprise() {
  const lanes = [["Always-on creators", "w-[88%]", "ml-0", "bg-forest"], ["Product launch", "w-[40%]", "ml-[10%]", "bg-orange"], ["Seasonal push", "w-[34%]", "ml-[56%]", "bg-emerald"]];
  return (
    <div className={clsx(ui, "w-full max-w-[17rem] p-4")}>
      <div className="flex items-center justify-between"><p className={tiny}>2027 programme</p><CalendarRange className="size-4 text-orange-deep" /></div>
      <div className="mt-2 grid grid-cols-4 text-[8.5px] font-bold text-forest/35"><span>Q1</span><span>Q2</span><span>Q3</span><span>Q4</span></div>
      <ul className="mt-2 space-y-2.5">
        {lanes.map(([t, w, ml, c]) => (
          <li key={t}>
            <p className="text-[10px] font-semibold text-forest/60">{t}</p>
            <div className={clsx("mt-1 h-2.5 rounded-full", w, ml, c)} />
          </li>
        ))}
      </ul>
      <p className="mt-3 flex items-center gap-1 text-[10px] font-semibold text-forest/50"><ArrowUp className="size-3" /> One governance model across teams</p>
    </div>
  );
}

const visuals = { campaigns: Campaigns, performance: Performance, payouts: Payouts, compliance: Kyc, analytics: Analytics, enterprise: Enterprise };

export default function ServiceCards() {
  return (
    <div className="mx-auto mt-12 grid max-w-6xl gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
      {services.map(({ key, icon: Icon, title, body }, i) => {
        const Visual = visuals[key];
        return (
          <Reveal key={key} delay={(i % 3) * 0.07} className="h-full">
            <article className="group flex h-full flex-col rounded-3xl bg-white p-2 ring-1 ring-forest/[0.06] transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgb(0_47_31/0.35)]">
              {/* Product view on a dark panel. Fictional names and placeholder figures. */}
              <div className="relative grid aspect-[16/11] place-items-center overflow-hidden rounded-[1.25rem] bg-gradient-to-br from-emerald to-ink p-6">
                <div className="grid-lines fade-mask pointer-events-none absolute inset-0" aria-hidden="true" />
                <div className="pointer-events-none absolute -right-16 -bottom-16 size-56 rounded-full bg-orange/20 opacity-60 blur-3xl transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true" />
                <div className="relative flex w-full justify-center transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-[1.02]" aria-hidden="true">
                  <Visual />
                </div>
              </div>

              <div className="flex flex-1 flex-col px-4 pt-5 pb-5">
                <div className="flex items-center justify-between">
                  <span className="grid size-9 place-items-center rounded-xl bg-forest/[0.05] text-forest transition-colors duration-300 group-hover:bg-orange group-hover:text-ink">
                    <Icon className="size-[18px]" aria-hidden="true" />
                  </span>
                  <span className="font-mono text-xs font-medium text-forest/35">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-4 text-lg leading-7 font-semibold tracking-[-0.02em] text-forest">{title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed font-medium tracking-[-0.01em] text-muted">{body}</p>
              </div>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}

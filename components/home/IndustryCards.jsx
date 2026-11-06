import { Building2, Landmark, Megaphone, ShieldCheck, ShoppingBasket, Smartphone, Wallet, Wifi } from "lucide-react";

// Card strip under the hero. No client names are approved (brief §13), so each card names an
// industry and the kind of campaign VGA runs for it.
const industries = [
  { icon: Wifi, name: "Telecoms", detail: "Subscriber sign-ups" },
  { icon: Landmark, name: "Banking", detail: "App activations" },
  { icon: Wallet, name: "Fintech", detail: "Wallet funding" },
  { icon: ShoppingBasket, name: "FMCG", detail: "Product launches" },
  { icon: Megaphone, name: "Agencies", detail: "Creator execution" },
  { icon: ShieldCheck, name: "Insurance", detail: "Lead generation" },
  { icon: Smartphone, name: "Consumer tech", detail: "App installs" },
  { icon: Building2, name: "Enterprise", detail: "Always-on programmes" },
];

export default function IndustryCards() {
  const loop = [...industries, ...industries];
  return (
    <section aria-label="Industries we serve" className="py-14 sm:py-16">
      <p className="text-center text-xs font-bold tracking-wider text-forest/55 uppercase">Built for teams in</p>
      <div className="edge-mask mt-8 overflow-hidden">
        <ul className="flex w-max animate-marquee gap-4 hover:[animation-play-state:paused]">
          {loop.map(({ icon: Icon, name, detail }, i) => (
            <li key={i} aria-hidden={i >= industries.length} className="flex w-56 items-center gap-4 rounded-2xl bg-white p-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-forest text-orange">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-[15px] font-semibold tracking-tight text-forest">{name}</span>
                <span className="block text-[12.5px] font-medium text-forest/55">{detail}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

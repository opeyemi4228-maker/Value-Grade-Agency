import clsx from "clsx";
import { Check } from "lucide-react";

export default function CheckList({ items, tone = "light", className }) {
  const light = tone === "light";
  return (
    <ul className={clsx("grid gap-3.5", className)}>
      {items.map((item) => (
        <li key={item} className={clsx("flex gap-3 leading-relaxed font-medium", light ? "text-forest/80" : "text-soft/75")}>
          <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-orange/15 text-orange">
            <Check className="size-3" strokeWidth={3} aria-hidden="true" />
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

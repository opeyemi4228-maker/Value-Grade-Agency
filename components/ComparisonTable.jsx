import { Check, Minus } from "lucide-react";
import { comparison } from "@/lib/content";

export default function ComparisonTable() {
  const [marketplace, inhouse, vga] = comparison.columns;
  return (
    <div>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-panel bg-white md:block">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">How Value Grade Agency compares with typical alternatives</caption>
          <thead>
            <tr className="border-b border-forest/10">
              <th scope="col" className="w-[26%] px-7 py-6 font-mono text-[11px] font-medium tracking-wider text-forest/50 uppercase">Criteria</th>
              <th scope="col" className="px-7 py-6 font-bold text-forest/60">{marketplace}</th>
              <th scope="col" className="px-7 py-6 font-bold text-forest/60">{inhouse}</th>
              <th scope="col" className="bg-forest px-7 py-6 text-base font-semibold text-soft">
                <span className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-orange" aria-hidden="true" /> {vga}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {comparison.rows.map((row) => (
              <tr key={row.label} className="border-b border-forest/8 last:border-0">
                <th scope="row" className="px-7 py-5 font-semibold text-forest">{row.label}</th>
                <td className="px-7 py-5 font-medium text-forest/60">
                  <span className="flex items-center gap-2"><Minus className="size-3.5 text-forest/30" aria-hidden="true" />{row.values[0]}</span>
                </td>
                <td className="px-7 py-5 font-medium text-forest/60">
                  <span className="flex items-center gap-2"><Minus className="size-3.5 text-forest/30" aria-hidden="true" />{row.values[1]}</span>
                </td>
                <td className="bg-forest px-7 py-5 font-bold text-soft">
                  <span className="flex items-center gap-2"><Check className="size-4 text-orange" strokeWidth={3} aria-hidden="true" />{row.values[2]}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked rows */}
      <ul className="grid gap-3 md:hidden">
        {comparison.rows.map((row) => (
          <li key={row.label} className="rounded-card bg-white p-5">
            <p className="font-mono text-[10px] tracking-wider text-forest/50 uppercase">{row.label}</p>
            <p className="mt-2 flex items-center gap-2 font-semibold text-forest">
              <Check className="size-4 text-orange" strokeWidth={3} aria-hidden="true" /> VGA: {row.values[2]}
            </p>
            <p className="mt-1.5 text-xs text-forest/55">Marketplace: {row.values[0]} · In-house: {row.values[1]}</p>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-xs font-medium text-forest/50">{comparison.footnote}</p>
    </div>
  );
}

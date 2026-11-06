import clsx from "clsx";

const tones = {
  orange: "bg-orange/12 text-orange ring-orange/30",
  green: "bg-emerald-400/10 text-emerald-300 ring-emerald-300/25",
  muted: "bg-soft/5 text-soft/60 ring-soft/15",
  dark: "bg-forest/8 text-forest ring-forest/20",
  greenLight: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  orangeLight: "bg-orange/10 text-[#C2410C] ring-orange/30",
};

export default function StatusPill({ children, tone = "orange", dot = true, className }) {
  return (
    <span className={clsx("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] font-medium tracking-wider uppercase ring-1 ring-inset", tones[tone], className)}>
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

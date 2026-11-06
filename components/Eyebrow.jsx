import clsx from "clsx";

// The small label above every heading: an orange tick plus uppercase text.
// Light backgrounds use the deeper orange so the label stays legible.
export default function Eyebrow({ children, tone = "light", align = "left", as: Tag = "p", className }) {
  return (
    <Tag
      className={clsx(
        "flex items-center gap-2 text-[13px] leading-5 font-bold tracking-wider uppercase",
        align === "center" && "justify-center",
        tone === "dark" ? "text-orange" : "text-orange-deep",
        className,
      )}
    >
      <span className="size-1.5 shrink-0 rounded-full bg-orange" aria-hidden="true" />
      {children}
    </Tag>
  );
}

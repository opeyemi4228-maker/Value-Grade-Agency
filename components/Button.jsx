import Link from "next/link";
import clsx from "clsx";
import { ArrowRight } from "lucide-react";

const variants = {
  primary: "bg-orange text-ink hover:bg-ink hover:text-soft",
  primaryOnDark: "bg-orange text-ink hover:bg-soft",
  dark: "bg-forest text-soft hover:bg-orange hover:text-ink",
  ghostLight: "border border-soft/30 text-soft hover:border-soft hover:bg-soft hover:text-forest",
  ghostDark: "border border-forest/25 text-forest hover:border-forest hover:bg-forest hover:text-soft",
};

const sizes = {
  sm: "h-9 rounded-lg px-3.5 text-sm",
  md: "h-11 rounded-xl px-5 text-[15px]",
  lg: "h-12 rounded-xl px-5 text-base",
};

export default function Button({ href, variant = "primary", size = "md", arrow = false, className, children, ...props }) {
  const external = /^https?:\/\//.test(href);
  const classes = clsx(
    "group inline-flex items-center justify-center gap-2 font-medium tracking-[-0.01em] whitespace-nowrap transition-all duration-300",
    variants[variant],
    sizes[size],
    className,
  );
  const content = (
    <>
      {children}
      {arrow && (
        <span className="relative grid size-5 place-items-center overflow-hidden" aria-hidden="true">
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-5" />
          <ArrowRight className="absolute size-4 -translate-x-5 transition-transform duration-300 group-hover:translate-x-0" />
        </span>
      )}
    </>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...props}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...props}>
      {content}
    </Link>
  );
}

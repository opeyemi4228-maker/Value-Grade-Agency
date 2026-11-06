"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { CalendarDays } from "lucide-react";
import Link from "next/link";
import { bookingUrl } from "@/lib/site";

// Sticky "Book a call" bar on small screens once the visitor scrolls past the hero.
export default function MobileCTA() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY > document.body.scrollHeight - 600;
      setShow(window.scrollY > 640 && !nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  if (pathname === "/contact") return null;

  return (
    <div className={clsx("fixed inset-x-4 bottom-4 z-40 transition-all duration-500 lg:hidden", show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-24 opacity-0")}>
      <Link href={bookingUrl} className="flex h-13 items-center justify-center gap-2 rounded-full bg-orange text-[15px] font-semibold text-ink shadow-[0_16px_40px_-12px_rgb(255_106_0/0.7)]">
        <CalendarDays className="size-4" aria-hidden="true" /> Book a Strategy Call
      </Link>
    </div>
  );
}

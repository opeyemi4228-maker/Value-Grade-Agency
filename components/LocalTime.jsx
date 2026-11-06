"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

// Current time in the office's time zone. Rendered client-side only to avoid a hydration mismatch.
export default function LocalTime({ timeZone, className }) {
  const [time, setTime] = useState(null);

  useEffect(() => {
    const format = () => new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit" }).format(new Date());
    setTime(format());
    const id = setInterval(() => setTime(format()), 30_000);
    return () => clearInterval(id);
  }, [timeZone]);

  if (!time) return null;
  return (
    <span className={clsx("flex items-center gap-2 tabular-nums", className)}>
      <span className="size-1.5 animate-pulse-dot rounded-full bg-orange" aria-hidden="true" />
      {time} local time
    </span>
  );
}

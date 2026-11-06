"use client";

import { openCookieSettings } from "@/lib/consent";

export default function CookieSettingsButton({ className, children = "Cookie settings" }) {
  return (
    <button type="button" onClick={openCookieSettings} className={className}>
      {children}
    </button>
  );
}

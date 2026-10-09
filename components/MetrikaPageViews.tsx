"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ymPageView } from "@/lib/metrika";
import { captureAcquisition } from "@/lib/acquisition";

export default function MetrikaPageViews() {
  const pathname = usePathname();
  const previous = useRef<string | null>(null);
  useEffect(() => {
    captureAcquisition();
    const url = new URL(window.location.pathname, window.location.origin);
    // Keep campaign attribution, without arbitrary URL parameters.
    const query = new URLSearchParams(window.location.search);
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
      const value = query.get(key);
      if (value && /^[\p{L}\p{N} ._/-]{1,100}$/u.test(value)) url.searchParams.set(key, value);
    }
    if (previous.current === url.href) return;
    let referer = previous.current ?? "";
    if (!referer && document.referrer) {
      try { referer = new URL(document.referrer).origin; } catch { /* malformed referrer */ }
    }
    ymPageView(url.href, referer);
    previous.current = url.href;
  }, [pathname]);
  return null;
}

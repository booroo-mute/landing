"use client";

import { useEffect, useState } from "react";

export type OS = "windows" | "macos" | "other";

export function useOS(): OS {
  const [os, setOS] = useState<OS>("windows");

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes("mac")) {
      setOS("macos");
    } else if (userAgent.includes("win")) {
      setOS("windows");
    } else {
      setOS("other");
    }
  }, []);

  return os;
}

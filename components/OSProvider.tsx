"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type OS = "windows" | "macos" | "mobile" | "other";

const OSContext = createContext<OS | null>(null);

export function useOS(): OS {
  const os = useContext(OSContext);
  if (!os) {
    throw new Error("useOS must be used within OSProvider");
  }
  return os;
}

function isMobileDevice(userAgent: string): boolean {
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i.test(userAgent);
}

export function OSProvider({ children }: { children: ReactNode }) {
  const [os, setOS] = useState<OS | null>(null);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (isMobileDevice(userAgent)) {
      setOS("mobile");
    } else if (userAgent.includes("mac")) {
      setOS("macos");
    } else if (userAgent.includes("win")) {
      setOS("windows");
    } else {
      setOS("other");
    }
  }, []);

  if (!os) {
    return null;
  }

  return (
    <OSContext.Provider value={os}>
      <div className="animate-fade-in">{children}</div>
    </OSContext.Provider>
  );
}

"use client";

import { createContext, useContext, useSyncExternalStore, ReactNode } from "react";

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

const subscribe = () => () => {};
const serverOS = (): OS => "other";
function clientOS(): OS {
  const userAgent = navigator.userAgent.toLowerCase();
  if (isMobileDevice(userAgent) || (userAgent.includes("mac") && navigator.maxTouchPoints > 1)) return "mobile";
  if (userAgent.includes("mac")) return "macos";
  if (userAgent.includes("win")) return "windows";
  return "other";
}

export function OSProvider({ children }: { children: ReactNode }) {
  const os = useSyncExternalStore(subscribe, clientOS, serverOS);
  return <OSContext.Provider value={os}>{children}</OSContext.Provider>;
}

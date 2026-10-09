"use client";

import { useEffect, useRef, RefObject } from "react";

export function useParallax<T extends HTMLElement>(speed: number = 0.5): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const element = ref.current;
    let frame = 0;
    function handleScroll() {
      if (preference.matches || frame) return;
      frame = requestAnimationFrame(() => {
        if (element) element.style.transform = `translateY(${window.scrollY * speed}px)`;
        frame = 0;
      });
    }
    function motionChanged() {
      cancelAnimationFrame(frame);
      frame = 0;
      if (element) element.style.transform = "";
      handleScroll();
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    preference.addEventListener("change", motionChanged);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
      preference.removeEventListener("change", motionChanged);
      if (element) element.style.transform = "";
    };
  }, [speed]);

  return ref;
}

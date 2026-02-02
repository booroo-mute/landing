"use client";

import { useEffect, useRef, RefObject } from "react";

export function useParallax<T extends HTMLElement>(speed: number = 0.5): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    let ticking = false;

    function updateTransform() {
      if (ref.current) {
        ref.current.style.transform = `translateY(${window.scrollY * speed}px)`;
      }
      ticking = false;
    }

    function handleScroll() {
      if (!ticking) {
        requestAnimationFrame(updateTransform);
        ticking = true;
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return ref;
}

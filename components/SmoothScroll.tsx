"use client";

import { useEffect } from "react";
import Lenis from "lenis";

// Подключается только на страницах, которым нужен плавный скролл (главная).
// На контентных страницах (блог, инструкции) лишний JS и rAF-цикл ни к чему.
export default function SmoothScroll({
  children,
}: {
  children?: React.ReactNode;
}) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}

"use client";

import { useEffect } from "react";

/**
 * Sets --scroll CSS variable on document root for parallax effects.
 * Only runs on desktop with no reduced-motion preference.
 */
export function useParallax() {
  useEffect(() => {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || prefersReduced) return;

    let raf = 0;
    const update = () => {
      document.documentElement.style.setProperty("--scroll", String(window.scrollY));
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
}

"use client";

import { useEffect, useRef } from "react";

let sharedObserver: IntersectionObserver | null = null;
const observedElements = new Set<Element>();

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function getSharedObserver() {
  if (sharedObserver) return sharedObserver;

  sharedObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          sharedObserver!.unobserve(entry.target);
          observedElements.delete(entry.target);
        }
      }
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  return sharedObserver;
}

export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      el.classList.add("visible");
      return;
    }

    const observer = getSharedObserver();
    observer.observe(el);
    observedElements.add(el);

    return () => {
      observer.unobserve(el);
      observedElements.delete(el);
    };
  }, []);

  return ref;
}

"use client";

import { useEffect, useRef } from "react";

// Single shared IntersectionObserver for all reveal elements
let sharedObserver: IntersectionObserver | null = null;
const observedElements = new Set<Element>();

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
    { threshold: 0.15 }
  );

  return sharedObserver;
}

export function useFadeIn<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

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

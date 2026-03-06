"use client";

import { useScrollAnimation } from "./useScrollAnimation";

/** @deprecated Use useScrollAnimation instead */
export function useFadeIn<T extends HTMLElement = HTMLDivElement>(
  _threshold?: number
) {
  return useScrollAnimation<T>();
}

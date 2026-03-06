"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export function AnimatedDivider() {
  const ref = useScrollAnimation<HTMLDivElement>();
  return <div ref={ref} className="section-divider" />;
}

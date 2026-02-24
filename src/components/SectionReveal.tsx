"use client";

import { useFadeIn } from "@/hooks/useFadeIn";

export function SectionReveal({
  children,
  className = "",
  threshold,
}: {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
}) {
  const ref = useFadeIn<HTMLDivElement>(threshold);
  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}

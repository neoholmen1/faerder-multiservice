"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Tilbake til toppen"
      className={`fixed right-6 bottom-6 z-30 hidden h-11 w-11 items-center justify-center rounded-full bg-white text-primary shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all duration-300 md:flex ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      <ChevronUp size={20} strokeWidth={2} />
    </button>
  );
}

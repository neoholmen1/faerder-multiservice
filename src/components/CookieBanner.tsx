"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const STORAGE_KEY = "cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  function respond(value: "granted" | "denied") {
    localStorage.setItem(STORAGE_KEY, value);
    window.dispatchEvent(new Event("cookie-consent-change"));
    setLeaving(true);
    setTimeout(() => setVisible(false), 300);
  }

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 p-4 transition-all duration-300 ${
        leaving
          ? "translate-y-full opacity-0"
          : "translate-y-0 opacity-100 animate-[slideUp_0.4s_ease-out]"
      }`}
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl bg-[#faf0e4] p-5 shadow-lg sm:flex-row sm:items-center sm:gap-6">
        <p className="flex-1 text-[14px] leading-[1.6] text-text-secondary">
          Vi bruker informasjonskapsler for analyse og forbedring av nettsiden.{" "}
          <Link
            href="/personvern"
            className="underline underline-offset-2 transition-colors hover:text-primary"
          >
            Les mer
          </Link>
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            onClick={() => respond("denied")}
            className="rounded-full border border-black/10 px-5 py-2 text-[13px] font-medium text-text-secondary transition-colors hover:border-black/20 hover:text-text"
          >
            Avslå
          </button>
          <button
            onClick={() => respond("granted")}
            className="rounded-full bg-primary px-5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-primary-dark"
          >
            Godta
          </button>
        </div>
      </div>
    </div>
  );
}

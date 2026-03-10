"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Phone, ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/tracking";
import { copyAndToast } from "@/lib/toast";

const navItems = [
  { href: "/prisliste", label: "Priser" },
  { href: "/om-oss", label: "Om oss" },
  { href: "/kontakt", label: "Kontakt" },
  { href: "/jobb", label: "Jobb hos oss" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const close = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll on iOS Safari
  useEffect(() => {
    if (mobileOpen) {
      const scrollY = window.scrollY;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
    } else {
      const top = document.body.style.top;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      if (top) window.scrollTo(0, -parseInt(top, 10));
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
    };
  }, [mobileOpen]);

  // Close mobile menu on Escape
  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen, close]);

  return (
    <header
      className="fixed top-0 right-0 left-0 z-50"
      style={{
        background: mobileOpen
          ? "#faf8f5"
          : scrolled
            ? "rgba(250, 248, 245, 0.85)"
            : "transparent",
        backdropFilter: mobileOpen ? "none" : scrolled ? "blur(12px) saturate(1.2)" : "none",
        WebkitBackdropFilter: mobileOpen ? "none" : scrolled ? "blur(12px) saturate(1.2)" : "none",
        borderBottom: mobileOpen
          ? "1px solid transparent"
          : scrolled
            ? "1px solid rgba(0,0,0,0.05)"
            : "1px solid transparent",
        transition: mobileOpen ? "none" : "background 0.3s ease, border-bottom 0.3s ease",
      }}
    >
      <div
        className="mx-auto flex items-center justify-between px-6"
        style={{ maxWidth: 1200, height: 64 }}
      >
        {/* Logo — icon only on mobile, full logo on desktop */}
        <Link href="/" onClick={close} className="relative z-50 shrink-0">
          <Image
            src="/images/faerder-logo.webp"
            alt="Færder Multiservice"
            width={140}
            height={42}
            priority
            quality={90}
            className="h-8 w-auto object-contain md:h-10"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {[
            { href: "/tjenester", label: "Tjenester" },
            ...navItems,
          ].map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-hover-link relative text-[0.85rem] font-[450] tracking-[0.01em] ${isActive ? "nav-hover-link--active" : ""}`}
                style={{
                  color: isActive ? "#1A1A1A" : "#1A1A1A",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTAs */}
        <div className="flex items-center gap-4">
          {/* Gratis befaring — plain text link, desktop only */}
          <Link
            href="/kontakt"
            className="hidden items-center gap-1.5 text-[0.82rem] font-medium text-text-secondary transition-colors duration-200 hover:text-text lg:flex"
          >
            Gratis befaring <ArrowRight size={12} />
          </Link>

          {/* Phone CTA — orange pill, desktop only */}
          <a
            href="tel:+4796823647"
            onClick={(e) => {
              e.preventDefault();
              copyAndToast("968 23 647", "Telefonnummer kopiert!");
              trackEvent("phone_click", { location: "header" });
            }}
            className="hidden items-center gap-2 rounded-full bg-primary px-4 py-2 text-[0.82rem] font-medium text-white transition-opacity duration-200 hover:opacity-90 md:flex cursor-pointer"
          >
            <Phone size={13} />
            968 23 647
          </a>

          {/* Mobile: orange phone pill */}
          <a
            href="tel:+4796823647"
            onClick={() => trackEvent("phone_click", { location: "header" })}
            className="relative z-50 flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-[13px] font-medium text-white md:hidden"
          >
            <Phone size={14} />
            968 23 647
          </a>

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="relative z-50 flex h-11 w-11 flex-col items-center justify-center gap-[5px] md:hidden"
            aria-label={mobileOpen ? "Lukk meny" : "Åpne meny"}
            aria-expanded={mobileOpen}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`block h-[2px] w-5 rounded-full bg-[#1A1A1A] ${
                  mobileOpen
                    ? i === 0 ? "translate-y-[7px] rotate-45" : i === 1 ? "scale-x-0 opacity-0" : "-translate-y-[7px] -rotate-45"
                    : ""
                }`}
                style={{
                  transition: "transform 0.3s ease, opacity 0.3s ease",
                }}
              />
            ))}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          mobileOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        {/* Solid warm background */}
        <div
          className="absolute inset-0"
          style={{ background: "#faf8f5" }}
          onClick={close}
        />

        {/* Nav content — centered */}
        <nav
          className="relative flex h-[100dvh] flex-col items-center justify-center gap-5 px-10 text-center"
          onClick={(e) => e.stopPropagation()}
        >
          {[
            { href: "/tjenester", label: "Tjenester" },
            ...navItems,
          ].map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              className="font-serif text-[28px] tracking-[-0.02em] text-text transition-colors duration-200 hover:text-primary"
              style={mobileOpen ? {
                animation: `hero-in 0.5s cubic-bezier(0.16,1,0.3,1) ${0.05 + i * 0.06}s both`,
              } : undefined}
            >
              {item.label}
            </Link>
          ))}

          {/* CTA buttons */}
          <div className="mt-10 flex w-full flex-col gap-3">
            <Link
              href="/kontakt"
              onClick={close}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-[15px] font-semibold text-white transition-opacity duration-200 hover:opacity-90"
              style={mobileOpen ? {
                animation: "hero-in 0.5s cubic-bezier(0.16,1,0.3,1) 0.3s both",
              } : undefined}
            >
              Gratis befaring <ArrowRight size={15} />
            </Link>
            <a
              href="tel:+4796823647"
              onClick={() => {
                trackEvent("phone_click", { location: "header" });
                close();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-full border-[1.5px] border-text/20 px-6 py-4 text-[15px] font-medium text-text transition-colors duration-200 hover:border-text/40"
              style={mobileOpen ? {
                animation: "hero-in 0.5s cubic-bezier(0.16,1,0.3,1) 0.35s both",
              } : undefined}
            >
              <Phone size={16} />
              968 23 647
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}

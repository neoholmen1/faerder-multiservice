"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Phone, ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/tracking";
import { copyAndToast } from "@/lib/toast";
import { services } from "@/data/services";

const navItems = [
  { href: "/om-oss", label: "Om oss" },
  { href: "/kontakt", label: "Kontakt" },
  { href: "/jobb", label: "Jobb hos oss" },
];

/* #14 Open/closed indicator based on Norwegian business hours */
function useIsOpen() {
  const [open, setOpen] = useState<boolean | null>(null);
  useEffect(() => {
    const now = new Date();
    const day = now.getDay(); // 0=Sun
    const h = now.getHours();
    setOpen(day >= 1 && day <= 5 && h >= 8 && h < 16);
  }, []);
  return open;
}

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";
  const isOpen = useIsOpen();

  const close = useCallback(() => setMobileOpen(false), []);

  // Transparent → solid header on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll on iOS Safari (needs both overflow and position fixed)
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

  // Close mobile menu on Escape key
  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen, close]);

  const transparent = isHome && !scrolled && !mobileOpen;
  const ease = "cubic-bezier(0.4, 0, 0.2, 1)";
  const dur = "0.4s";

  return (
    <header
      className="fixed top-0 right-0 left-0 z-50"
      style={{
        background: transparent ? "rgba(255,255,255,0)" : "rgba(255,255,255,0.85)",
        backdropFilter: transparent ? "saturate(100%) blur(0px)" : "saturate(180%) blur(20px)",
        WebkitBackdropFilter: transparent ? "saturate(100%) blur(0px)" : "saturate(180%) blur(20px)",
        boxShadow: transparent ? "0 1px 3px rgba(0,0,0,0)" : "0 1px 3px rgba(0,0,0,0.06)",
        borderBottom: transparent ? "1px solid rgba(0,0,0,0)" : "1px solid rgba(0,0,0,0.06)",
        transition: `background ${dur} ${ease}, backdrop-filter ${dur} ${ease}, -webkit-backdrop-filter ${dur} ${ease}, box-shadow ${dur} ${ease}, border-color ${dur} ${ease}`,
      }}
    >
      <div
        className="mx-auto flex max-w-[1200px] items-center justify-between px-6"
        style={{
          height: scrolled ? 56 : 64,
          transition: `height ${dur} ${ease}`,
        }}
      >
        {/* Logo */}
        <Link href="/" onClick={close} className="relative z-50 transition-transform duration-200 hover:scale-[1.02]">
          <Image
            src="/images/faerder-logo.webp"
            alt="Færder Multiservice"
            width={160}
            height={48}
            priority
            className="h-12 w-auto object-contain"
            style={{
              filter: transparent ? "brightness(0) invert(1)" : "brightness(1) invert(0)",
              transition: `filter ${dur} ${ease}`,
            }}
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
                className={`nav-link relative text-[14px] font-medium ${
                  !transparent && isActive ? "nav-link-active" : ""
                }`}
                style={{
                  color: transparent
                    ? isActive ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.7)"
                    : isActive ? "#1A1A1A" : "#6B7280",
                  textShadow: transparent ? "0 1px 2px rgba(0,0,0,0.3)" : "none",
                  transition: `color ${dur} ${ease}, text-shadow ${dur} ${ease}`,
                }}
              >
                {item.label}
                {isActive && (
                  <span className="absolute -bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Gratis befaring CTA — desktop only */}
          <Link
            href="/kontakt"
            className="hidden items-center gap-1 rounded-full px-3.5 py-1.5 text-[12px] font-semibold lg:flex"
            style={{
              color: transparent ? "rgba(255,255,255,0.8)" : "#E8721C",
              textShadow: transparent ? "0 1px 2px rgba(0,0,0,0.3)" : "none",
              transition: `color ${dur} ${ease}, text-shadow ${dur} ${ease}`,
            }}
          >
            Gratis befaring <ArrowRight size={12} />
          </Link>

          {/* Phone CTA with open/closed indicator */}
          <a
            href="tel:+4796823647"
            onClick={(e) => {
              e.preventDefault();
              copyAndToast("968 23 647", "Telefonnummer kopiert!");
              trackEvent("phone_click", { location: "header" });
            }}
            className="phone-pulse hidden items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold text-white md:flex cursor-pointer"
            style={{
              background: transparent ? "rgba(255,255,255,0.15)" : "#E8721C",
              border: transparent ? "1px solid rgba(255,255,255,0.25)" : "1px solid transparent",
              backdropFilter: transparent ? "blur(12px)" : "blur(0px)",
              WebkitBackdropFilter: transparent ? "blur(12px)" : "blur(0px)",
              transition: `all ${dur} ${ease}`,
            }}
          >
            {/* Open/closed dot */}
            {isOpen !== null && (
              <span className={`h-1.5 w-1.5 rounded-full ${isOpen ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`} />
            )}
            <Phone size={13} />
            968 23 647
          </a>

          {/* Mobile: phone */}
          <a
            href="tel:+4796823647"
            onClick={() => trackEvent("phone_click", { location: "header" })}
            className="relative z-50 flex h-11 w-11 items-center justify-center rounded-full hover:opacity-60 md:hidden"
            style={{
              color: transparent ? "#fff" : "#1A1A1A",
              transition: `color ${dur} ${ease}`,
            }}
            aria-label="Ring oss"
          >
            <Phone size={18} />
          </a>

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-[5px] md:hidden"
            aria-label={mobileOpen ? "Lukk meny" : "Åpne meny"}
            aria-expanded={mobileOpen}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`block h-[2px] w-5 rounded-full ${
                  mobileOpen
                    ? i === 0 ? "translate-y-[7px] rotate-45" : i === 1 ? "scale-x-0 opacity-0" : "-translate-y-[7px] -rotate-45"
                    : ""
                }`}
                style={{
                  backgroundColor: mobileOpen ? "#1A1A1A" : transparent ? "#fff" : "#1A1A1A",
                  transition: `transform 0.3s ease, opacity 0.3s ease, background-color ${dur} ${ease}`,
                }}
              />
            ))}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          mobileOpen
            ? "visible translate-x-0 opacity-100"
            : "invisible translate-x-full opacity-0"
        }`}
      >
        {/* Background — click to close */}
        <div className="absolute inset-0 bg-white" onClick={close} />

        {/* Content */}
        <nav
          className="relative flex h-[100dvh] flex-col px-8 pt-20 pb-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Tjenester section */}
          <p className="text-[11px] font-semibold tracking-widest text-text-secondary/60 uppercase">
            Tjenester
          </p>
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
            {services.map((s) => (
              <Link
                key={s.slug}
                href={`/tjenester/${s.slug}`}
                onClick={close}
                className="py-2 text-[15px] font-medium text-text transition-colors duration-150 hover:text-primary"
              >
                {s.name}
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="my-6 h-px bg-gray-100" />

          {/* Main nav links — #10 stagger animation */}
          {navItems.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              className="py-3 text-2xl font-bold tracking-tight text-text transition-all duration-200 hover:opacity-60"
              style={mobileOpen ? {
                animation: `hero-in 0.4s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.05}s both`,
              } : undefined}
            >
              {item.label}
            </Link>
          ))}

          {/* Spacer pushes phone button to bottom */}
          <div className="flex-1" />

          {/* Phone CTA — orange, at bottom */}
          <a
            href="tel:+4796823647"
            onClick={() => {
              trackEvent("phone_click", { location: "header" });
              close();
            }}
            className="flex w-full items-center justify-center gap-2.5 rounded-full bg-primary px-6 py-4 text-[16px] font-semibold text-white transition-opacity duration-200 hover:opacity-90"
          >
            <Phone size={18} />
            968 23 647
          </a>
        </nav>
      </div>
    </header>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/tracking";

/**
 * Global, mobil-kun sticky CTA. Vises når brukeren har scrollet litt
 * (slik at den ikke konkurrerer med hero), og skjules når footer er synlig
 * eller når man er på sider hvor CTA-en er overflødig.
 */
const HIDDEN_PATHS = ["/admin", "/kontakt", "/takk"];

export function MobileCtaSticky({ phone }: { phone: string }) {
  const pathname = usePathname();
  const [scrolledPast, setScrolledPast] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolledPast(window.scrollY > 220);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const obs = new IntersectionObserver(([entry]) => setFooterVisible(entry.isIntersecting), {
      threshold: 0,
    });
    obs.observe(footer);
    return () => obs.disconnect();
  }, [pathname]);

  const isHidden = HIDDEN_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
  const show = scrolledPast && !footerVisible && !isHidden;

  const phoneDigits = phone.replace(/\s/g, "");
  const phoneIntl = phoneDigits.startsWith("+") ? phoneDigits : `+47${phoneDigits}`;

  return (
    <div
      className={`fixed right-0 bottom-0 left-0 z-40 bg-white px-3 pt-2.5 shadow-[0_-2px_12px_rgba(0,0,0,0.08)] transition-all duration-300 md:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
      style={{ paddingBottom: "calc(0.625rem + env(safe-area-inset-bottom, 0px))" }}
      aria-hidden={!show}
    >
      <div className="flex items-center gap-2">
        <Link
          href="/kontakt"
          onClick={() => trackEvent("cta_click", { location: "mobile_sticky" })}
          className="btn-glow flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-3 text-[14.5px] font-semibold text-white active:scale-[0.97]"
        >
          Få tilbud <ArrowRight size={15} />
        </Link>
        <a
          href={`tel:${phoneIntl}`}
          onClick={() => trackEvent("phone_click", { location: "mobile_sticky" })}
          aria-label="Ring oss"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[1.5px] border-text/20 text-text transition-colors hover:border-text/40 hover:text-primary active:scale-95"
        >
          <Phone size={17} />
        </a>
      </div>
    </div>
  );
}

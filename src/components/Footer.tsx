"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, ShieldCheck, Leaf, Handshake } from "lucide-react";
import { trackEvent } from "@/lib/tracking";
import { copyAndToast } from "@/lib/toast";
import { SITE_SETTINGS_FALLBACK, type SiteSettings, type Badge } from "@/lib/site";

const tjenester = [
  { name: "Fast vask", href: "/tjenester/fast-vask" },
  { name: "Flyttevask", href: "/tjenester/flyttevask" },
  { name: "Kontorvask", href: "/tjenester/kontorvask" },
  { name: "Byggvask", href: "/tjenester/byggvask" },
  { name: "Spesialvask", href: "/tjenester/spesialvask" },
  { name: "Luktsanering", href: "/tjenester/luktsanering" },
  { name: "Hovedrengjøring", href: "/tjenester/hovedrengjoring" },
  { name: "Visningsvask", href: "/tjenester/visningsvask" },
  { name: "Borettslag", href: "/tjenester/borettslag" },
];

const BADGE_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  godkjent: ShieldCheck,
  nho: Handshake,
  ev: Leaf,
};

export function Footer({ settings }: { settings?: SiteSettings | null } = {}) {
  const s = settings ?? SITE_SETTINGS_FALLBACK;
  const phone = s.phone ?? SITE_SETTINGS_FALLBACK.phone ?? "";
  const phoneDigits = phone.replace(/\s/g, "");
  const phoneIntl = phoneDigits.startsWith("+") ? phoneDigits : `+47${phoneDigits}`;
  const email = s.email_general ?? SITE_SETTINGS_FALLBACK.email_general ?? "";
  const address = s.visit_address ?? SITE_SETTINGS_FALLBACK.visit_address ?? "";
  const dekningsomrader =
    s.coverage_areas.length > 0 ? s.coverage_areas : SITE_SETTINGS_FALLBACK.coverage_areas;
  const badges: Badge[] = s.badges.length > 0 ? s.badges : SITE_SETTINGS_FALLBACK.badges;
  return (
    <footer className="bg-[#faf0e4]">
      <div className="mx-auto max-w-[1200px] px-6 pt-20 pb-8 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-16">
          {/* Kontaktinfo */}
          <div>
            <Image
              src="/images/faerder-logo.webp"
              alt="Færder Multiservice"
              width={160}
              height={50}
              quality={90}
              className="h-12 w-auto object-contain"
            />
            <p className="mt-4 text-[15px] leading-[1.7] text-text-secondary">
              Vi vasker for folk og bedrifter i Vestfold.
            </p>

            <ul className="mt-6 space-y-3">
              <li>
                <a
                  href={`tel:${phoneIntl}`}
                  onClick={(e) => {
                    if (window.innerWidth >= 768) {
                      e.preventDefault();
                      copyAndToast(phone, "Telefonnummer kopiert!");
                    }
                    trackEvent("phone_click", { location: "footer" });
                  }}
                  className="flex items-center gap-2.5 text-[15px] text-text-secondary transition-colors duration-150 hover:text-primary"
                >
                  <Phone size={15} className="shrink-0" />
                  {phoneIntl.replace(/^\+47/, "+47 ")}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2.5 text-[15px] text-text-secondary transition-colors duration-150 hover:text-primary"
                >
                  <Mail size={15} className="shrink-0" />
                  {email}
                </a>
              </li>
              <li>
                <span className="flex items-start gap-2.5 text-[15px] text-text-secondary">
                  <MapPin size={15} className="mt-0.5 shrink-0" />
                  {address}
                </span>
              </li>
            </ul>
          </div>

          {/* Tjenester */}
          <div>
            <p className="text-lg font-bold tracking-[-0.03em] text-text">
              Tjenester
            </p>
            <ul className="mt-6 space-y-2.5">
              {tjenester.map((t) => (
                <li key={t.href}>
                  <Link
                    href={t.href}
                    className="text-[15px] text-text-secondary transition-colors duration-150 hover:text-primary"
                  >
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Dekningsområde */}
          <div>
            <p className="text-lg font-bold tracking-[-0.03em] text-text">
              Dekningsområde
            </p>
            <ul className="mt-6 space-y-2.5">
              {dekningsomrader.map((sted) => (
                <li key={sted} className="text-[15px] text-text-secondary">
                  {sted}
                </li>
              ))}
            </ul>
          </div>

          {/* Lenker */}
          <div>
            <p className="text-lg font-bold tracking-[-0.03em] text-text">
              Lenker
            </p>
            <ul className="mt-6 space-y-2.5">
              {[
                { href: "/prisliste", label: "Priser" },
                { href: "/om-oss", label: "Om oss" },
                { href: "/kontakt", label: "Kontakt" },
                { href: "/jobb", label: "Jobb hos oss" },
                { href: "/personvern", label: "Personvernerklæring" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[15px] text-text-secondary transition-colors duration-150 hover:text-primary"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom: badges + copyright */}
        <div className="mt-20 border-t border-black/[0.06] pt-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="flex flex-wrap items-center gap-4">
              {badges.map((b) => {
                const Icon = BADGE_ICONS[b.key] ?? ShieldCheck;
                return (
                  <span
                    key={b.key + b.label}
                    className="tooltip-trigger flex items-center gap-2 text-xs text-[#9CA3AF]"
                  >
                    <Icon size={13} className="text-primary" />
                    {b.label}
                    {b.tooltip && (
                      <span className="tooltip hidden sm:block">{b.tooltip}</span>
                    )}
                  </span>
                );
              })}
            </div>
            <p className="text-xs text-[#9CA3AF]">
              &copy; {new Date().getFullYear()} Færder Multiservice AS &middot; Org.nr 824 779 392
            </p>
          </div>
        </div>

        {/* Back to top */}
        <div className="mt-6 text-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-xs text-[#9CA3AF] transition-colors duration-200 hover:text-primary"
          >
            ↑ Tilbake til toppen
          </button>
        </div>
      </div>
    </footer>
  );
}

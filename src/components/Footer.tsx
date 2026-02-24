"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, ShieldCheck, Leaf, Handshake } from "lucide-react";
import { trackEvent } from "@/lib/tracking";
import { copyAndToast } from "@/lib/toast";

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

const dekningsomrader = [
  "Tønsberg", "Nøtterøy", "Tjøme", "Færder",
  "Sandefjord", "Horten", "Holmestrand", "Larvik",
];

export function Footer() {
  return (
    <footer>
      {/* Separator */}
      <div className="h-px bg-gray-200/50" />

      <div className="mx-auto max-w-[1200px] px-6 py-20 lg:py-24">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Kontaktinfo */}
          <div>
            <Image
              src="/images/faerder-logo.webp"
              alt="Færder Multiservice"
              width={160}
              height={50}
              quality={85}
              className="h-12 w-auto object-contain"
            />
            <p className="mt-3 text-[15px] leading-[1.7] text-text-secondary">
              Profesjonelt renhold for private og bedrifter i Vestfold.
            </p>

            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href="tel:+4796823647"
                  onClick={(e) => {
                    if (window.innerWidth >= 768) {
                      e.preventDefault();
                      copyAndToast("968 23 647", "Telefonnummer kopiert!");
                    }
                    trackEvent("phone_click", { location: "footer" });
                  }}
                  className="flex items-center gap-2.5 text-[15px] text-text-secondary transition-colors duration-150 hover:text-primary"
                >
                  <Phone size={15} className="shrink-0" />
                  +47 968 23 647
                </a>
              </li>
              <li>
                <a
                  href="mailto:post@faerdermultiservice.no"
                  className="flex items-center gap-2.5 text-[15px] text-text-secondary transition-colors duration-150 hover:text-primary"
                >
                  <Mail size={15} className="shrink-0" />
                  post@faerdermultiservice.no
                </a>
              </li>
              <li>
                <span className="flex items-start gap-2.5 text-[15px] text-text-secondary">
                  <MapPin size={15} className="mt-0.5 shrink-0" />
                  Smormeien 1, 3116 Nøtterøy
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

          {/* Snarveier */}
          <div>
            <p className="text-lg font-bold tracking-[-0.03em] text-text">
              Snarveier
            </p>
            <ul className="mt-6 space-y-2.5">
              {[
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
        <div className="mt-16 border-t border-gray-200/50 pt-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="flex flex-wrap items-center gap-4">
              <span className="tooltip-trigger flex items-center gap-2 text-[13px] font-medium text-text-secondary">
                <ShieldCheck size={14} className="text-primary" />
                Offentlig godkjent renholdsbedrift
                <span className="tooltip hidden sm:block">Godkjent av Arbeidstilsynet. Registrert i Renholdsregisteret.</span>
              </span>
              <span className="tooltip-trigger flex items-center gap-2 text-[13px] font-medium text-text-secondary">
                <Handshake size={14} className="text-primary" />
                Medlem av NHO Service og Handel
                <span className="tooltip hidden sm:block">NHO Service og Handel: Norges ledende arbeidsgiverorganisasjon for servicenæringen.</span>
              </span>
              <span className="tooltip-trigger flex items-center gap-2 text-[13px] font-medium text-text-secondary">
                <Leaf size={14} className="text-primary" />
                EV-sertifisert
                <span className="tooltip hidden sm:block">EV-dampmaskin: Ingen sterke kjemikalier. Skånsomt for miljøet.</span>
              </span>
            </div>
            <p className="text-sm text-text-secondary">
              &copy; {new Date().getFullYear()} Færder Multiservice AS &middot; Org.nr 824 779 392
            </p>
          </div>
        </div>

        {/* Back to top */}
        <div className="mt-10 text-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="back-to-top-text inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[13px] font-medium text-text-secondary transition-colors duration-200 hover:text-primary"
          >
            <span className="text-default">↑ Tilbake til toppen</span>
            <span className="text-hover">Opp, opp og avgårde! ↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}

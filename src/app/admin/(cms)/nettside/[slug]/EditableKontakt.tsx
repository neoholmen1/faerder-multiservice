"use client";

import Image from "next/image";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import EditableText from "@/components/admin/inline/EditableText";
import EditableImage from "@/components/admin/inline/EditableImage";
import { sectionKey } from "@/components/admin/inline/save";

const kontaktInfo = [
  { icon: Phone, label: "Telefon", value: "+47 968 23 647" },
  { icon: Mail, label: "E-post", value: "post@faerdermultiservice.no" },
  { icon: MapPin, label: "Adresse", value: "Stensarmen 3A, 3112 Tønsberg" },
  { icon: Clock, label: "Åpningstider", value: "Man–Fre 08:00–16:00" },
];

export function EditableKontakt({ siteId }: { siteId: string }) {
  return (
    <div className="min-h-full bg-white">
      {/* HERO */}
      <section className="bg-[#faf8f5] pt-20 pb-12 lg:pt-24 lg:pb-16">
        <div className="mx-auto max-w-[1200px] px-6 text-center">
          <EditableText
            fieldKey={sectionKey("hero", "eyebrow", 0)}
            fallback="Kontakt"
            as="p"
            className="text-[13px] font-medium tracking-widest text-primary uppercase"
          />
          <EditableText
            fieldKey={sectionKey("hero", "title", 0)}
            fallback="Kontakt oss"
            as="h1"
            className="mt-5 text-[clamp(2.25rem,5vw,4rem)] leading-[1.05] tracking-[-0.02em] text-text"
          />
          <EditableText
            fieldKey={sectionKey("hero", "subtitle", 0)}
            fallback="Vi svarer samme dag — senest neste virkedag."
            as="p"
            className="mx-auto mt-5 max-w-lg text-[17px] font-light text-text-secondary"
          />
        </div>
      </section>

      {/* FORM + KONTAKTINFO */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid gap-10 lg:grid-cols-5">
            {/* Form (read-only preview) */}
            <div className="lg:col-span-3">
              <EditableText
                fieldKey={sectionKey("form", "title", 0)}
                fallback="Skriv til oss"
                as="h2"
                className="text-2xl tracking-[-0.02em] text-text"
              />
              <div className="mt-7 space-y-4 rounded-xl bg-[#fafaf9] p-5 ring-1 ring-black/[0.04]">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="h-12 rounded-xl border border-gray-200 bg-background-warm px-4 py-3 text-[14px] text-text-secondary">Navn *</div>
                  <div className="h-12 rounded-xl border border-gray-200 bg-background-warm px-4 py-3 text-[14px] text-text-secondary">E-post *</div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="h-12 rounded-xl border border-gray-200 bg-background-warm px-4 py-3 text-[14px] text-text-secondary">Telefon *</div>
                  <div className="h-12 rounded-xl border border-gray-200 bg-background-warm px-4 py-3 text-[14px] text-text-secondary">Postnummer / sted</div>
                </div>
                <div className="h-12 rounded-xl border border-gray-200 bg-background-warm px-4 py-3 text-[14px] text-text-secondary">Tjeneste</div>
                <div className="h-28 rounded-xl border border-gray-200 bg-background-warm px-4 py-3 text-[14px] text-text-secondary">Melding</div>
                <div className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-[14px] font-semibold text-white">
                  Send melding
                </div>
              </div>
              <p className="mt-3 text-[11.5px] italic text-text-secondary/60">
                Skjemafeltene er ikke redigerbare — kun overskriften over.
              </p>
            </div>

            {/* Kontaktinfo card (read-only) */}
            <div className="lg:col-span-2">
              <div className="rounded-3xl bg-background-warm p-7 shadow-sm">
                <h3 className="text-lg tracking-[-0.03em] text-text">Kontaktinformasjon</h3>
                <ul className="mt-6 space-y-5">
                  {kontaktInfo.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.label} className="flex items-start gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
                          <Icon size={17} className="text-primary" />
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-text-secondary">{item.label}</p>
                          <p className="mt-0.5 text-[14.5px] font-medium text-text">{item.value}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <p className="mt-3 text-center text-[11.5px] italic text-text-secondary/60">
                Kontaktinfo redigeres under Innstillinger
              </p>

              {/* Aleksandra image */}
              <div className="mt-7">
                <EditableImage
                  fieldKey={sectionKey("aleksandra", "image_url", 0)}
                  siteId={siteId}
                  defaultCategory="team"
                  fallback="/images/aleksandra-bil.webp"
                >
                  {(url) => (
                    <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl ring-1 ring-black/[0.04]">
                      <Image
                        src={url ?? "/images/aleksandra-bil.webp"}
                        alt="Aleksandra"
                        fill
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                </EditableImage>
                <p className="mt-2 text-center text-[12.5px] text-text-secondary">
                  Aleksandra klar for oppdrag i firmabilen
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kart (read-only) */}
      <section className="pb-12 lg:pb-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="aspect-[16/6] w-full overflow-hidden rounded-3xl bg-[#e5e5e4] shadow-sm">
            <div className="flex h-full w-full items-center justify-center text-[13px] text-text-secondary">
              Google Maps-kart (vises på den ekte siden)
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

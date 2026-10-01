"use client";

import Image from "next/image";
import { Sparkles, Leaf, Heart, ShieldCheck, MapPin, ArrowRight, Phone } from "lucide-react";
import EditableText from "@/components/admin/inline/EditableText";
import EditableImage from "@/components/admin/inline/EditableImage";
import { sectionKey } from "@/components/admin/inline/save";

const dekningsomrader = [
  "Tønsberg", "Nøtterøy", "Tjøme", "Færder",
  "Sandefjord", "Horten", "Holmestrand", "Larvik",
];

export function EditableOmOss({ siteId }: { siteId: string }) {
  return (
    <div className="min-h-full bg-white">
      {/* HERO */}
      <section className="bg-[#faf8f5] pt-20 pb-12 lg:pt-24 lg:pb-16">
        <div className="mx-auto max-w-[1200px] px-6 text-center">
          <EditableText
            fieldKey={sectionKey("hero", "eyebrow", 0)}
            fallback="Om oss"
            as="p"
            className="text-[13px] font-medium tracking-widest text-primary uppercase"
          />
          <EditableText
            fieldKey={sectionKey("hero", "title", 0)}
            fallback="Om Færder Multiservice"
            as="h1"
            className="mt-5 text-[clamp(2.25rem,5vw,4rem)] leading-[1.05] tracking-[-0.02em] text-text"
          />
          <EditableText
            fieldKey={sectionKey("hero", "subtitle", 0)}
            fallback="Vi har vasket i Vestfold siden 2020."
            as="p"
            className="mx-auto mt-5 max-w-lg text-[17px] font-light leading-relaxed text-text-secondary"
            multiline
          />
        </div>
      </section>

      {/* VÅR HISTORIE */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:gap-14">
            {/* Leder portrait */}
            <div className="shrink-0 text-center">
              <EditableImage
                fieldKey={sectionKey("historie", "leader_image", 0)}
                siteId={siteId}
                defaultCategory="team"
                fallback="/images/aleksandra-portrett.webp"
              >
                {(url) => (
                  <div className="relative h-[200px] w-[200px] overflow-hidden rounded-full ring-1 ring-primary/10">
                    <Image
                      src={url ?? "/images/aleksandra-portrett.webp"}
                      alt="Daglig leder"
                      fill
                      sizes="200px"
                      className="object-cover"
                    />
                  </div>
                )}
              </EditableImage>
              <EditableText
                fieldKey={sectionKey("historie", "leader_name", 0)}
                fallback="Aleksandra"
                as="p"
                className="mt-4 text-[15px] font-semibold text-text"
              />
              <EditableText
                fieldKey={sectionKey("historie", "leader_title", 0)}
                fallback="Daglig leder"
                as="p"
                className="text-[13px] text-text-secondary"
              />
            </div>

            {/* Tekst */}
            <div>
              <EditableText
                fieldKey={sectionKey("historie", "eyebrow", 0)}
                fallback="Vår historie"
                as="p"
                className="text-[13px] font-medium tracking-widest text-primary uppercase"
              />
              <EditableText
                fieldKey={sectionKey("historie", "title", 0)}
                fallback="Slik startet det"
                as="h2"
                className="mt-5 text-[clamp(1.75rem,4vw,3rem)] tracking-[-0.02em] leading-[1.1] text-text"
              />
              <div className="mt-7 space-y-5">
                {[0, 1, 2].map((i) => (
                  <EditableText
                    key={i}
                    fieldKey={sectionKey("historie", "paragraph", i)}
                    fallback={
                      [
                        "Vi startet i 2020 med en enkel idé: å vaske skikkelig og behandle folk ordentlig. Det gjør vi fortsatt.",
                        "I dag er vi et etablert team. Vi vasker for folk, bedrifter, borettslag og utbyggere i hele Vestfold — fra Holmestrand til Larvik.",
                        "Vi gjør heller én jobb grundig enn ti halvveis. Vi er ikke fornøyde før du er det.",
                      ][i]
                    }
                    as="p"
                    className="text-[17px] leading-[1.7] text-text-secondary"
                    multiline
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VERDIER */}
      <section className="bg-[#f5f5f7] py-12 lg:py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="text-center">
            <EditableText
              fieldKey={sectionKey("verdier", "eyebrow", 0)}
              fallback="Våre verdier"
              as="p"
              className="text-[13px] font-medium tracking-widest text-primary uppercase"
            />
            <EditableText
              fieldKey={sectionKey("verdier", "title", 0)}
              fallback="Det vi står for"
              as="h2"
              className="mt-5 text-[clamp(1.75rem,4vw,3rem)] tracking-[-0.02em] leading-[1.1] text-text"
            />
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {[0, 1, 2].map((i) => {
              const icons = [Sparkles, Leaf, Heart];
              const colors = [
                "text-primary bg-[#fdf6ef]",
                "text-emerald-600 bg-emerald-50",
                "text-rose-500 bg-rose-50",
              ];
              const Icon = icons[i];
              return (
                <div key={i} className="rounded-3xl bg-white p-7 shadow-sm">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${colors[i]}`}>
                    <Icon size={24} strokeWidth={1.5} />
                  </div>
                  <EditableText
                    fieldKey={sectionKey("verdier", "card_title", i)}
                    fallback={["Grundig, alltid", "Bra for miljøet", "Lokalt og personlig"][i]}
                    as="h3"
                    className="mt-6 text-[18px] tracking-[-0.02em] text-text"
                  />
                  <EditableText
                    fieldKey={sectionKey("verdier", "card_text", i)}
                    fallback={
                      [
                        "Ingen snarveier. Ingen halvgjort jobb. Sånn er det bare.",
                        "Vi vasker med damp. Ingen sterke kjemikalier. Bra for deg og naturen.",
                        "Basert i Tønsberg. Kort reisevei, kjente fjes, personlig oppfølging.",
                      ][i]
                    }
                    as="p"
                    className="mt-2 text-[14.5px] leading-[1.6] text-text-secondary"
                    multiline
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SERTIFISERINGER (read-only) */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="text-center">
            <p className="text-[13px] font-medium tracking-widest text-primary uppercase">Sertifiseringer</p>
            <h2 className="mt-5 text-[clamp(1.75rem,4vw,3rem)] tracking-[-0.02em] leading-[1.1] text-text">
              Godkjent og sertifisert
            </h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            <div className="rounded-3xl bg-white p-7 shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                <ShieldCheck size={24} strokeWidth={1.5} className="text-blue-600" />
              </div>
              <h3 className="mt-6 text-[18px] text-text">Offentlig godkjent renholdsbedrift</h3>
              <p className="mt-2 text-[14.5px] leading-[1.6] text-text-secondary">
                Godkjent av Arbeidstilsynet. Det betyr at alt er på stell — lønn, arbeidsforhold og HMS.
              </p>
            </div>
            <div className="rounded-3xl bg-white p-7 shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
                <Leaf size={24} strokeWidth={1.5} className="text-emerald-600" />
              </div>
              <h3 className="mt-6 text-[18px] text-text">EV-sertifisert</h3>
              <p className="mt-2 text-[14.5px] leading-[1.6] text-text-secondary">
                Vi bruker dampmaskin med kun vann og varme. Ingen sterke kjemikalier.
              </p>
            </div>
          </div>
          <p className="mt-3 text-center text-[11.5px] italic text-text-secondary/60">
            Sertifiseringer redigeres under Innstillinger
          </p>
        </div>
      </section>

      {/* DEKNINGSOMRÅDE */}
      <section className="bg-[#f5f5f7] py-12 lg:py-16">
        <div className="mx-auto max-w-[1200px] px-6 text-center">
          <p className="text-[13px] font-medium tracking-widest text-primary uppercase">Dekningsområde</p>
          <h2 className="mt-5 text-[clamp(1.75rem,4vw,3rem)] tracking-[-0.02em] leading-[1.1] text-text">
            Vi dekker hele Vestfold
          </h2>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-2.5">
            {dekningsomrader.map((by) => (
              <span
                key={by}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-[13.5px] font-medium text-text-secondary shadow-sm"
              >
                <MapPin size={13} className="text-primary" />
                {by}
              </span>
            ))}
          </div>
          <p className="mt-3 text-[11.5px] italic text-text-secondary/60">
            Dekningsområde redigeres under Innstillinger
          </p>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-12 lg:py-16" style={{ background: "linear-gradient(180deg, #fdf6ef, #faf0e4)" }}>
        <div className="mx-auto max-w-3xl px-6 text-center">
          <EditableText
            fieldKey={sectionKey("cta_final", "title", 0)}
            fallback="Vil du vite mer?"
            as="h2"
            className="text-[clamp(1.5rem,3vw,2rem)] tracking-[-0.02em] text-text"
          />
          <EditableText
            fieldKey={sectionKey("cta_final", "body", 0)}
            fallback="Send oss en melding eller ring. Vi svarer samme dag — senest neste virkedag."
            as="p"
            className="mt-3 text-[15px] text-text-secondary"
            multiline
          />
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-[14.5px] font-semibold text-white">
              Ta kontakt <ArrowRight size={16} />
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-gray-300 px-7 py-3.5 text-[14.5px] font-medium text-text-secondary">
              <Phone size={15} /> 968 23 647
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

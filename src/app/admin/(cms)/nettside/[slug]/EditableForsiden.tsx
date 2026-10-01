"use client";

import Image from "next/image";
import {
  Sparkles,
  Truck,
  Building2,
  HardHat,
  Wind,
  Home,
  ShieldCheck,
  Leaf,
  MapPin,
  Phone,
  ArrowRight,
  Handshake,
} from "lucide-react";
import EditableText from "@/components/admin/inline/EditableText";
import EditableImage from "@/components/admin/inline/EditableImage";
import { sectionKey } from "@/components/admin/inline/save";

const tjenester = [
  { name: "Fast vask", pris: "Fra 470 kr", slug: "fast-vask", icon: Home },
  { name: "Flyttevask", pris: "Fra 3 500 kr", slug: "flyttevask", icon: Truck },
  { name: "Kontorvask", pris: "Etter avtale", slug: "kontorvask", icon: Building2 },
  { name: "Byggvask", pris: "Fra 5 000 kr", slug: "byggvask", icon: HardHat },
  { name: "Spesialvask", pris: "Fra 400 kr", slug: "spesialvask", icon: Sparkles },
  { name: "Luktsanering", pris: "Fra 3 000 kr", slug: "luktsanering", icon: Wind },
];

/**
 * Inline-editor for forsiden. Speiler den ekte nettsidens layout og rekkefølge,
 * men hver tekst og hovedbildet er klikkbart for å redigere direkte.
 */
export function EditableForsiden({ siteId }: { siteId: string }) {
  return (
    <div className="min-h-full bg-white">
      {/* 1. HERO */}
      <section className="bg-gradient-to-b from-[#faf8f5] to-[#f5f0ea] pt-20 pb-12">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <EditableText
            fieldKey="hero_eyebrow"
            fallback="Vaskebyrå i Vestfold"
            as="span"
            className="inline-block rounded-full bg-primary/10 px-3.5 py-1.5 text-[12px] font-semibold tracking-[0.2em] text-primary uppercase"
          />
          <h1 className="mt-5">
            <span className="block font-serif text-[clamp(2rem,6vw,3.5rem)] leading-[1.05] tracking-[-0.02em] text-text">
              Rent{" "}
              <EditableText
                fieldKey="hero_title"
                fallback="hjem."
                as="span"
                className="inline"
              />
            </span>
            <EditableText
              fieldKey={sectionKey("hero", "tagline", 0)}
              fallback="Null stress."
              as="span"
              className="mt-1 block font-serif italic text-[clamp(2rem,6vw,3.5rem)] leading-[1.05] tracking-[-0.02em] text-primary"
            />
          </h1>
          <EditableText
            fieldKey="hero_subtitle"
            fallback="Fast vask i hele Vestfold — fra 470 kr."
            as="p"
            className="mx-auto mt-5 max-w-lg text-[1.0625rem] font-medium leading-[1.6] text-text-secondary"
            multiline
          />
          <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-[14.5px] font-semibold text-white">
              <EditableText
                fieldKey="hero_cta_primary_label"
                fallback="Se våre tjenester"
                as="span"
              />
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-text px-7 py-3.5 text-[14.5px] font-medium text-text">
              <Phone size={15} />
              <EditableText
                fieldKey="hero_cta_secondary_label"
                fallback="Ring oss"
                as="span"
              />
            </span>
          </div>
        </div>
      </section>

      {/* 2. FIRMABIL SHOWCASE */}
      <section
        className="py-8 lg:py-10"
        style={{ background: "linear-gradient(180deg, #f5f0ea 0%, #faf8f5 100%)" }}
      >
        <div className="mx-auto max-w-[1100px] px-6">
          <EditableImage
            fieldKey="hero_image_url"
            siteId={siteId}
            defaultCategory="hero"
            fallback="/images/firmabil-hero.webp"
          >
            {(url) => (
              <div className="relative aspect-[21/8] w-full overflow-hidden rounded-[24px] bg-[#f5f0ea] shadow-[0_20px_60px_-20px_rgba(232,114,28,0.25)] ring-1 ring-black/[0.04]">
                <Image
                  src={url ?? "/images/firmabil-hero.webp"}
                  alt="Færder Multiservice firmabil"
                  fill
                  quality={95}
                  sizes="(max-width: 1100px) 100vw, 1100px"
                  className="object-cover"
                  style={{ objectPosition: "center 62%" }}
                />
                <div className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-text shadow">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Vi vasker i Vestfold
                </div>
              </div>
            )}
          </EditableImage>
        </div>
      </section>

      {/* 3. TRUST STRIPE */}
      <section className="bg-[#faf8f5]">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6 py-7 text-[12.5px] text-text-secondary">
          <span className="inline-flex items-center gap-2">
            <ShieldCheck size={15} className="text-primary" strokeWidth={2} /> Offentlig godkjent
          </span>
          <span className="hidden h-3 w-px bg-text-secondary/20 sm:block" />
          <span className="inline-flex items-center gap-2">
            <Handshake size={15} className="text-primary" strokeWidth={2} /> NHO-medlem
          </span>
          <span className="hidden h-3 w-px bg-text-secondary/20 sm:block" />
          <span className="inline-flex items-center gap-2">
            <Leaf size={15} className="text-primary" strokeWidth={2} /> EV-sertifisert
          </span>
        </div>
      </section>

      {/* 4. TJENESTER */}
      <section className="bg-[#faf8f5] py-12 lg:py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="text-center">
            <p className="text-[13px] font-medium tracking-widest text-primary uppercase">
              Våre tjenester
            </p>
            <h2 className="mt-5 text-[clamp(1.75rem,3.5vw,2.5rem)] tracking-[-0.02em] leading-[1.1] text-text">
              Hva trenger du?
            </h2>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
            {tjenester.map((t) => {
              const Icon = t.icon;
              return (
                <div
                  key={t.slug}
                  className="flex flex-col items-center rounded-[16px] bg-white px-6 py-8 text-center shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)]"
                >
                  <Icon size={42} strokeWidth={1.2} className="text-primary" />
                  <h3 className="mt-3 text-[15px] font-semibold text-text">{t.name}</h3>
                  <p className="mt-1 text-[12.5px] font-medium text-primary">{t.pris}</p>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-center text-[11.5px] text-text-secondary/60 italic">
            Tjeneste-kortene redigeres på Tjenester-fanen
          </p>
        </div>
      </section>

      {/* 5. KUNDEANMELDELSER */}
      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <EditableText
            fieldKey={sectionKey("kundeanmeldelser", "eyebrow", 0)}
            fallback="Kundeanmeldelser"
            as="p"
            className="text-[13px] font-medium tracking-widest text-primary uppercase"
          />
          <EditableText
            fieldKey={sectionKey("kundeanmeldelser", "title", 0)}
            fallback="De fleste nye kundene våre kommer via anbefalinger"
            as="h2"
            className="mt-5 text-[clamp(1.75rem,3.5vw,2.5rem)] tracking-[-0.02em] leading-[1.1] text-text"
            multiline
          />
          <EditableText
            fieldKey={sectionKey("kundeanmeldelser", "subtitle", 0)}
            fallback="Hør hva noen av dem sier."
            as="p"
            className="mx-auto mt-3 max-w-md text-[15px] text-text-secondary"
          />
          <p className="mt-3 text-[11.5px] text-text-secondary/60 italic">
            De faktiske anmeldelsene redigeres under Innstillinger
          </p>
        </div>
      </section>

      {/* 6. SLIK FUNGERER DET */}
      <section className="bg-[#f5f5f7] py-12 lg:py-16">
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="text-center">
            <EditableText
              fieldKey={sectionKey("slik_fungerer", "eyebrow", 0)}
              fallback="Slik fungerer det"
              as="p"
              className="text-[13px] font-medium tracking-widest text-primary uppercase"
            />
            <EditableText
              fieldKey={sectionKey("slik_fungerer", "title", 0)}
              fallback="Enkelt som 1-2-3"
              as="h2"
              className="mt-5 text-[clamp(1.75rem,3.5vw,2.5rem)] tracking-[-0.02em] leading-[1.1] text-text"
            />
          </div>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="text-center">
                <span className="block text-3xl font-extralight text-primary/70">0{i + 1}</span>
                <EditableText
                  fieldKey={sectionKey("slik_fungerer", "step_title", i)}
                  fallback={["Fortell oss hva du trenger", "Vi gir deg en pris", "Vi gjør jobben"][i]}
                  as="h3"
                  className="mt-3 text-[18px] tracking-[-0.02em] text-text"
                />
                <EditableText
                  fieldKey={sectionKey("slik_fungerer", "step_text", i)}
                  fallback={
                    [
                      "Bruk kalkulatoren eller send oss en melding.",
                      "Du får et tilbud raskt. Ingen skjulte kostnader.",
                      "Vi fikser resten — grundig og skikkelig.",
                    ][i]
                  }
                  as="p"
                  className="mt-2 text-[14.5px] leading-[1.6] text-text-secondary"
                  multiline
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. TRUST BAR (stats) */}
      <section className="bg-[#faf8f5] py-10 lg:py-12">
        <div className="mx-auto grid max-w-[1000px] grid-cols-3 gap-6 px-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <EditableText
                fieldKey={sectionKey("trust_bar", "stat_value", i)}
                fallback={["6+", "Etablert", "Hundrevis"][i]}
                as="span"
                className="text-[clamp(1.75rem,4vw,2.75rem)] font-bold tracking-[-0.04em] text-text"
              />
              <span className="mt-3 h-1 w-10 rounded-full bg-primary" />
              <EditableText
                fieldKey={sectionKey("trust_bar", "stat_label", i)}
                fallback={["Års erfaring", "Team i Vestfold", "Fornøyde kunder"][i]}
                as="span"
                className="mt-3 text-[12px] font-medium tracking-wide text-text-secondary uppercase"
              />
            </div>
          ))}
        </div>
      </section>

      {/* 8. HVORFOR OSS */}
      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="text-center">
            <EditableText
              fieldKey={sectionKey("hvorfor_oss", "eyebrow", 0)}
              fallback="Derfor oss"
              as="p"
              className="text-[13px] font-medium tracking-widest text-primary uppercase"
            />
            <EditableText
              fieldKey={sectionKey("hvorfor_oss", "title", 0)}
              fallback="Derfor velger folk oss"
              as="h2"
              className="mt-5 text-[clamp(1.75rem,3.5vw,2.5rem)] tracking-[-0.02em] leading-[1.1] text-text"
            />
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => {
              const icons = [ShieldCheck, Handshake, Leaf, MapPin];
              const colors = [
                "text-blue-600 bg-blue-50",
                "text-violet-600 bg-violet-50",
                "text-emerald-600 bg-emerald-50",
                "text-amber-600 bg-amber-50",
              ];
              const Icon = icons[i];
              return (
                <div key={i} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/[0.04]">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${colors[i]}`}>
                    <Icon size={20} strokeWidth={1.5} />
                  </div>
                  <EditableText
                    fieldKey={sectionKey("hvorfor_oss", "card_title", i)}
                    fallback={["Offentlig godkjent", "Medlem av NHO", "EV-sertifisert", "Lokalt i Vestfold"][i]}
                    as="h3"
                    className="mt-5 text-[16px] tracking-[-0.02em] text-text"
                  />
                  <EditableText
                    fieldKey={sectionKey("hvorfor_oss", "card_text", i)}
                    fallback={
                      [
                        "Godkjent av Arbeidstilsynet. Alt er på stell hos oss.",
                        "Vi er med i NHO Service og Handel. Vi gjør ting ordentlig.",
                        "Vi vasker med damp — ingen sterke kjemikalier. Bra for deg og miljøet.",
                        "Vi holder til i Tønsberg. Kort vei til hele Vestfold.",
                      ][i]
                    }
                    as="p"
                    className="mt-2 text-[14px] leading-[1.6] text-text-secondary"
                    multiline
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. FAQ */}
      <section className="bg-[#f5f5f7] py-12 lg:py-16">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center">
            <EditableText
              fieldKey={sectionKey("faq", "eyebrow", 0)}
              fallback="FAQ"
              as="p"
              className="text-[13px] font-medium tracking-widest text-primary uppercase"
            />
            <EditableText
              fieldKey={sectionKey("faq", "title", 0)}
              fallback="Vanlige spørsmål"
              as="h2"
              className="mt-5 text-[clamp(1.75rem,3.5vw,2.5rem)] tracking-[-0.02em] leading-[1.1] text-text"
            />
          </div>
          <div className="mt-10 space-y-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl bg-white p-5 shadow-sm">
                <EditableText
                  fieldKey={sectionKey("faq", "q", i)}
                  fallback={
                    [
                      "Hva koster det?",
                      "Hva er inkludert?",
                      "Dekker dere mitt område?",
                      "Når kan dere komme?",
                      "Har dere garanti?",
                    ][i]
                  }
                  as="h3"
                  className="text-[15px] font-semibold text-text"
                />
                <EditableText
                  fieldKey={sectionKey("faq", "a", i)}
                  fallback={
                    [
                      "Prøv kalkulatoren vår — du får et estimat med en gang.",
                      "Alle flater, gulv, kjøkken, bad og støvtørking.",
                      "Vi dekker hele Vestfold.",
                      "Som regel innen 3–5 virkedager.",
                      "Ja! Er du ikke fornøyd, kommer vi tilbake og fikser det — helt gratis.",
                    ][i]
                  }
                  as="p"
                  className="mt-2 text-[14px] leading-[1.6] text-text-secondary"
                  multiline
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. CTA FINAL */}
      <section className="py-12 lg:py-16" style={{ background: "linear-gradient(180deg, #fdf6ef, #faf0e4)" }}>
        <div className="mx-auto max-w-[1100px] px-6 text-center">
          <EditableText
            fieldKey={sectionKey("cta_final", "title", 0)}
            fallback="La oss ta renholdet for deg"
            as="h2"
            className="text-[clamp(1.75rem,4vw,3rem)] tracking-[-0.02em] leading-[1.1] text-text"
            multiline
          />
          <EditableText
            fieldKey={sectionKey("cta_final", "body", 0)}
            fallback="Send en melding eller bare ring. Vi svarer samme dag — senest neste virkedag."
            as="p"
            className="mx-auto mt-5 max-w-lg text-[16px] leading-[1.6] text-text-secondary"
            multiline
          />
          <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-[14.5px] font-semibold text-white">
              Ta kontakt <ArrowRight size={16} />
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-gray-300 px-7 py-3.5 text-[14.5px] font-medium text-text-secondary">
              <Phone size={15} /> 968 23 647
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1100px] px-6 py-6 text-center text-[11.5px] text-text-secondary/60 italic">
        Header, footer og kontaktinfo redigeres under Innstillinger
      </div>
    </div>
  );
}

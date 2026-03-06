import type { Metadata } from "next";
import Image from "next/image";
import { ShieldCheck, Leaf, MapPin, Heart, Sparkles } from "lucide-react";
import { PageHero } from "@/components/DarkHero";
import { SectionReveal } from "@/components/SectionReveal";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Om oss — Lokalt i Vestfold siden 2020",
  description:
    "Vi er 11 ansatte som vasker i hele Vestfold. Godkjent, EV-sertifisert, og med siden 2020. Bli kjent med oss.",
  alternates: { canonical: "/om-oss" },
  openGraph: {
    title: "Om oss | Færder Multiservice",
    description: "Vi er 11 ansatte som vasker i hele Vestfold. Godkjent, EV-sertifisert, og med siden 2020.",
    url: "/om-oss",
  },
};

const dekningsomrader = [
  "Tønsberg", "Nøtterøy", "Tjøme", "Færder",
  "Sandefjord", "Horten", "Holmestrand", "Larvik",
];

export default function OmOssPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Hjem", href: "/" },
        { name: "Om oss", href: "/om-oss" },
      ]} />
      <PageHero
        label="Om oss"
        title="Om Færder Multiservice"
        subtitle="Vi har vasket i Vestfold siden 2020."
      />

      {/* Vår historie */}
      <section className="py-28 lg:py-36">
        <SectionReveal className="mx-auto max-w-4xl px-6">
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:gap-16">
            {/* Aleksandra portrait */}
            <div className="shrink-0 text-center">
              <div className="photo-frame photo-frame-round inline-block">
                <div className="photo-frame-bg !rounded-full" />
                <Image
                  src="/images/aleksandra-portrett.webp"
                  alt="Aleksandra, daglig leder i Færder Multiservice, Tønsberg"
                  width={200}
                  height={200}
                  quality={90}
                  className="h-[200px] w-[200px] object-cover"
                />
              </div>
              <p className="mt-4 text-[15px] font-semibold text-text">Aleksandra</p>
              <p className="text-[13px] text-text-secondary">Daglig leder</p>
            </div>

            {/* Text */}
            <div>
              <p className="text-[13px] font-medium tracking-widest text-primary uppercase">
                Vår historie
              </p>
              <h2 className="mt-5 text-[clamp(1.75rem,4vw,3rem)] tracking-[-0.02em] leading-[1.1] text-text">
                Slik startet det
              </h2>
              <div className="mt-8 space-y-6 text-[17px] leading-[1.7] text-text-secondary">
                <p>
                  Vi startet i 2020 med en enkel idé: å vaske skikkelig og
                  behandle folk ordentlig. Det gjør vi fortsatt.
                </p>
                <p>
                  I dag er vi over 11 ansatte. Vi vasker for folk, bedrifter,
                  borettslag og utbyggere i hele Vestfold — fra Holmestrand til Larvik.
                </p>
                <p>
                  Vi gjør heller én jobb grundig enn ti halvveis.
                  Vi er ikke fornøyde før du er det.
                </p>
              </div>
            </div>
          </div>
        </SectionReveal>
      </section>

      {/* Verdier */}
      <div className="section-divider" />
      <section className="bg-[#f5f5f7] py-28 lg:py-36">
        <div className="mx-auto max-w-[1200px] px-6">
          <SectionReveal className="text-center">
            <p className="text-[13px] font-medium tracking-widest text-primary uppercase">
              Våre verdier
            </p>
            <h2 className="mt-5 text-[clamp(1.75rem,4vw,3rem)] tracking-[-0.02em] leading-[1.1] text-text">
              Det vi står for
            </h2>
          </SectionReveal>

          <SectionReveal className="mt-20 grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: Sparkles,
                title: "Grundig, alltid",
                text: "Ingen snarveier. Ingen halvgjort jobb. Sånn er det bare.",
                color: "text-primary",
                bg: "bg-accent",
              },
              {
                icon: Leaf,
                title: "Bra for miljøet",
                text: "Vi vasker med damp. Ingen sterke kjemikalier. Bra for deg og naturen.",
                color: "text-emerald-600",
                bg: "bg-emerald-50",
              },
              {
                icon: Heart,
                title: "Lokalt og personlig",
                text: "Basert på Kaldnes i Tønsberg. Kort reisevei, kjente fjes, personlig oppfølging.",
                color: "text-rose-500",
                bg: "bg-rose-50",
              },
            ].map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="feature-card group rounded-3xl bg-white p-8 lg:p-10"
                >
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${v.bg} transition-transform duration-500 group-hover:scale-110`}>
                    <Icon size={26} strokeWidth={1.5} className={v.color} />
                  </div>
                  <h3 className="mt-7 text-[19px] tracking-[-0.02em] text-text">
                    {v.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-[1.7] text-text-secondary">
                    {v.text}
                  </p>
                </div>
              );
            })}
          </SectionReveal>
        </div>
      </section>

      {/* Sertifiseringer */}
      <div className="section-divider" />
      <section className="py-28 lg:py-36">
        <SectionReveal className="mx-auto max-w-[1200px] px-6">
          <div className="text-center">
            <p className="text-[13px] font-medium tracking-widest text-primary uppercase">
              Sertifiseringer
            </p>
            <h2 className="mt-5 text-[clamp(1.75rem,4vw,3rem)] tracking-[-0.02em] leading-[1.1] text-text">
              Godkjent og sertifisert
            </h2>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2">
            <div className="feature-card rounded-3xl bg-white p-8 lg:p-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                <ShieldCheck size={26} strokeWidth={1.5} className="text-blue-600" />
              </div>
              <h3 className="mt-6 text-[19px] tracking-[-0.02em] text-text">
                Offentlig godkjent renholdsbedrift
              </h3>
              <p className="mt-3 text-[15px] leading-[1.7] text-text-secondary">
                Godkjent av Arbeidstilsynet. Det betyr at alt er på stell
                — lønn, arbeidsforhold og HMS. Du kan være trygg.
              </p>
            </div>
            <div className="feature-card rounded-3xl bg-white p-8 lg:p-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
                <Leaf size={26} strokeWidth={1.5} className="text-emerald-600" />
              </div>
              <h3 className="mt-6 text-[19px] tracking-[-0.02em] text-text">
                EV-sertifisert
              </h3>
              <p className="mt-3 text-[15px] leading-[1.7] text-text-secondary">
                Vi bruker dampmaskin som vasker med kun vann og varme.
                Ingen sterke kjemikalier. Bedre for lufta hjemme hos deg.
              </p>
            </div>
          </div>
        </SectionReveal>
      </section>

      {/* Dekningsområde */}
      <div className="section-divider" />
      <section className="bg-[#f5f5f7] py-28 lg:py-36">
        <SectionReveal className="mx-auto max-w-[1200px] px-6 text-center">
          <p className="text-[13px] font-medium tracking-widest text-primary uppercase">
            Dekningsområde
          </p>
          <h2 className="mt-5 text-[clamp(1.75rem,4vw,3rem)] tracking-[-0.02em] leading-[1.1] text-text">
            Vi dekker hele Vestfold
          </h2>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            {dekningsomrader.map((by) => (
              <span
                key={by}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-text-secondary shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.04)]"
              >
                <MapPin size={14} className="text-primary" />
                {by}
              </span>
            ))}
          </div>
        </SectionReveal>
      </section>

    </>
  );
}

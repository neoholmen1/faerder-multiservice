import type { Metadata } from "next";
import Image from "next/image";
import { ShieldCheck, Leaf, MapPin, Heart, Sparkles } from "lucide-react";
import { PageHero } from "@/components/DarkHero";
import { SectionReveal } from "@/components/SectionReveal";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Om oss — Lokalt i Vestfold siden 2020",
  description:
    "Lokalt vaskebyrå i Vestfold siden 2020. 11+ ansatte, EV-sertifisert, offentlig godkjent. Les mer om oss.",
  alternates: { canonical: "/om-oss" },
  openGraph: {
    title: "Om oss | Færder Multiservice",
    description: "Lokalt vaskebyrå i Vestfold siden 2020. 11+ ansatte, EV-sertifisert, offentlig godkjent.",
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
        subtitle="Lokalt vaskebyrå i Vestfold siden 2020."
      />

      {/* Vår historie */}
      <section className="py-24 lg:py-32">
        <SectionReveal className="mx-auto max-w-4xl px-6">
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:gap-16">
            {/* Aleksandra portrait */}
            <div className="shrink-0 text-center">
              <div className="photo-frame photo-frame-round inline-block">
                <div className="photo-frame-bg !rounded-full" />
                <Image
                  src="/images/aleksandra-portrett.webp"
                  alt="Aleksandra, daglig leder i Færder Multiservice, Nøtterøy"
                  width={200}
                  height={200}
                  quality={85}
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
              <h2 className="mt-4 text-[clamp(1.75rem,4vw,3rem)] font-bold tracking-[-0.03em] leading-[1.1] text-text">
                Startet med én visjon
              </h2>
              <div className="mt-8 space-y-6 text-[17px] leading-[1.7] text-text-secondary">
                <p>
                  Færder Multiservice ble startet i 2020 med én klar visjon: å levere
                  profesjonelt renhold med personlig service i Vestfold.
                </p>
                <p>
                  I dag er vi over 11 ansatte som dekker hele regionen — fra Holmestrand
                  i nord til Larvik i sør. Vi vasker for privatpersoner, bedrifter,
                  borettslag og utbyggere.
                </p>
                <p>
                  Vi tror på kvalitet fremfor kvantitet. Hvert oppdrag får den
                  oppmerksomheten det fortjener, og vi er ikke fornøyde før kunden
                  er det.
                </p>
              </div>
            </div>
          </div>
        </SectionReveal>
      </section>

      {/* Verdier */}
      <section className="border-t border-gray-100 bg-background-warm py-24 lg:py-32">
        <div className="mx-auto max-w-[1200px] px-6">
          <SectionReveal className="text-center">
            <p className="text-[13px] font-medium tracking-widest text-primary uppercase">
              Våre verdier
            </p>
            <h2 className="mt-4 text-[clamp(1.75rem,4vw,3rem)] font-bold tracking-[-0.03em] leading-[1.1] text-text">
              Det vi står for
            </h2>
          </SectionReveal>

          <SectionReveal className="mt-16 grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: Sparkles,
                title: "Kvalitet i hvert hjørne",
                text: "Vi er grundige, alltid. Ingen snarveier, ingen halvgjort jobb.",
                color: "text-primary",
                bg: "bg-accent",
              },
              {
                icon: Leaf,
                title: "Miljøbevisst",
                text: "EV-sertifisert med dampmaskin. Skånsomt for miljøet — og helsen din.",
                color: "text-emerald-600",
                bg: "bg-emerald-50",
              },
              {
                icon: Heart,
                title: "Lokalt og personlig",
                text: "Basert på Nøtterøy. Kort reisevei, kjente fjes, personlig oppfølging.",
                color: "text-rose-500",
                bg: "bg-rose-50",
              },
            ].map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="feature-card group rounded-3xl border border-gray-100/80 bg-white p-8 lg:p-10"
                >
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${v.bg} transition-transform duration-500 group-hover:scale-110`}>
                    <Icon size={26} strokeWidth={1.5} className={v.color} />
                  </div>
                  <h3 className="mt-7 text-[19px] font-semibold tracking-[-0.02em] text-text">
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
      <section className="py-24 lg:py-32">
        <SectionReveal className="mx-auto max-w-[1200px] px-6">
          <div className="text-center">
            <p className="text-[13px] font-medium tracking-widest text-primary uppercase">
              Sertifiseringer
            </p>
            <h2 className="mt-4 text-[clamp(1.75rem,4vw,3rem)] font-bold tracking-[-0.03em] leading-[1.1] text-text">
              Godkjent og sertifisert
            </h2>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            <div className="feature-card rounded-3xl border border-gray-100/80 bg-white p-8 lg:p-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                <ShieldCheck size={26} strokeWidth={1.5} className="text-blue-600" />
              </div>
              <h3 className="mt-6 text-[19px] font-semibold tracking-[-0.02em] text-text">
                Offentlig godkjent renholdsbedrift
              </h3>
              <p className="mt-3 text-[15px] leading-[1.7] text-text-secondary">
                Vi er registrert og godkjent av Arbeidstilsynet. Det betyr at vi følger alle krav
                til lønn, arbeidsforhold og HMS — noe som gir deg trygghet som kunde.
              </p>
            </div>
            <div className="feature-card rounded-3xl border border-gray-100/80 bg-white p-8 lg:p-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
                <Leaf size={26} strokeWidth={1.5} className="text-emerald-600" />
              </div>
              <h3 className="mt-6 text-[19px] font-semibold tracking-[-0.02em] text-text">
                EV-sertifisert
              </h3>
              <p className="mt-3 text-[15px] leading-[1.7] text-text-secondary">
                Vi bruker EV-dampmaskin som rengjør med kun vann og varme — ingen sterke kjemikalier.
                Bedre for miljøet, bedre for inneklimaet, bedre for deg.
              </p>
            </div>
          </div>
        </SectionReveal>
      </section>

      {/* Dekningsområde */}
      <section className="border-y border-gray-100 py-24 lg:py-32">
        <SectionReveal className="mx-auto max-w-[1200px] px-6 text-center">
          <p className="text-[13px] font-medium tracking-widest text-primary uppercase">
            Dekningsområde
          </p>
          <h2 className="mt-4 text-[clamp(1.75rem,4vw,3rem)] font-bold tracking-[-0.03em] leading-[1.1] text-text">
            Vi dekker hele Vestfold
          </h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {dekningsomrader.map((by) => (
              <span
                key={by}
                className="inline-flex items-center gap-2 rounded-full border border-gray-100 bg-background-warm px-5 py-2.5 text-sm font-medium text-text-secondary"
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

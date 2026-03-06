import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { services } from "@/data/services";
import { PageHero } from "@/components/DarkHero";
import { SectionReveal } from "@/components/SectionReveal";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Priser — Renhold i Vestfold",
  description:
    "Se priser for fast vask, flyttevask, kontorvask, byggvask og mer. Ingen skjulte kostnader. Få et uforpliktende tilbud i dag.",
  alternates: { canonical: "/prisliste" },
  openGraph: {
    title: "Priser | Færder Multiservice",
    description:
      "Se priser for fast vask, flyttevask, kontorvask, byggvask og mer. Ingen skjulte kostnader.",
    url: "/prisliste",
  },
};

const visibleSlugs = [
  "fast-vask",
  "flyttevask",
  "kontorvask",
  "byggvask",
  "spesialvask",
  "luktsanering",
];

export default function PrislistePage() {
  const visibleServices = services.filter((s) => visibleSlugs.includes(s.slug));

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Hjem", href: "/" },
          { name: "Priser", href: "/prisliste" },
        ]}
      />

      <PageHero
        label="Priser"
        title="Hva koster det?"
        subtitle="Her ser du prisene våre. Ingen skjulte kostnader — du vet hva du betaler."
      />

      <section className="py-16 md:py-28 lg:py-36">
        <div className="mx-auto max-w-[900px] px-5 md:px-6">
          <SectionReveal>
            <div className="space-y-6">
              {visibleServices.map((service) => (
                <div
                  key={service.slug}
                  className="rounded-2xl border border-gray-100 bg-white p-6 md:p-8"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-[1.25rem] font-bold tracking-[-0.02em] text-text">
                        {service.name}
                      </h2>
                      <p className="mt-1 text-[15px] text-text-secondary">
                        {service.description}
                      </p>
                    </div>
                    <p className="shrink-0 text-[1.1rem] font-bold text-primary">
                      {service.price}
                    </p>
                  </div>

                  {/* Frequency breakdown */}
                  {service.frequencies.length > 0 && (
                    <div className="mt-5 border-t border-gray-50 pt-5">
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {service.frequencies.map((f) => (
                          <div
                            key={f.id}
                            className="flex items-center justify-between rounded-xl bg-[#faf8f5] px-4 py-3"
                          >
                            <div>
                              <p className="text-[14px] font-medium text-text">
                                {f.label}
                              </p>
                              <p className="text-[12px] text-text-secondary">
                                {f.sublabel}
                              </p>
                            </div>
                            <p className="text-[14px] font-semibold text-text">
                              {f.price}{" "}
                              <span className="font-normal text-text-secondary">
                                {f.period}
                              </span>
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4">
                    <Link
                      href={`/tjenester/${service.slug}`}
                      className="inline-flex items-center gap-1 text-[13px] font-medium text-primary transition-colors hover:text-primary/80"
                    >
                      Les mer <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </SectionReveal>

          <SectionReveal className="mt-8 text-center">
            <p className="text-[13px] text-text-secondary">
              Alle priser er inkl. mva. Endelig pris avhenger av boligens størrelse og tilstand.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-100 py-16 lg:py-20" style={{ background: "linear-gradient(180deg, #fdf6ef, #faf0e4)" }}>
        <SectionReveal className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-[clamp(1.5rem,3vw,2rem)] tracking-[-0.02em] text-text">
            Vil du ha en nøyaktig pris?
          </h2>
          <p className="mt-3 text-[15px] text-text-secondary">
            Send oss en melding eller ring. Vi gir deg et tilbud samme dag.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/kontakt"
              className="btn-glow inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-[15px] font-semibold text-white"
            >
              Få tilbud <ArrowRight size={16} />
            </Link>
            <a
              href="tel:+4796823647"
              className="btn-outline inline-flex items-center gap-2 rounded-full border-2 border-gray-300 px-8 py-4 text-[15px] font-medium text-text-secondary hover:border-gray-400 hover:text-text"
            >
              <Phone size={15} /> 968 23 647
            </a>
          </div>
        </SectionReveal>
      </section>
    </>
  );
}

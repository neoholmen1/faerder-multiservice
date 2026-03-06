import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { services, getServiceBySlug } from "@/data/services";
import { SectionReveal } from "@/components/SectionReveal";
import { Accordion } from "@/components/Accordion";
import { ServicePageClient } from "./client";
import { ServiceJsonLd, FAQJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: service.seoTitle,
    description: service.seoDescription,
    alternates: { canonical: `/tjenester/${service.slug}` },
    openGraph: {
      title: `${service.seoTitle} | Færder Multiservice`,
      description: service.seoDescription,
      url: `/tjenester/${service.slug}`,
    },
  };
}

const relatedServices: Record<string, { text: string; slug: string; label: string }> = {
  "fast-vask": {
    text: "Trenger du hovedrengjøring? En grundig engangsvask fra topp til bunn.",
    slug: "hovedrengjoring",
    label: "Les om hovedrengjøring",
  },
  "flyttevask": {
    text: "Trenger du visningsvask? Vi klargjør boligen før visning.",
    slug: "visningsvask",
    label: "Les om visningsvask",
  },
  "kontorvask": {
    text: "Vi vasker også fellesarealer i borettslag og sameier.",
    slug: "borettslag",
    label: "Les om borettslag",
  },
};

const dekningsomrader = [
  "Tønsberg", "Nøtterøy", "Tjøme", "Færder",
  "Sandefjord", "Horten", "Holmestrand", "Larvik",
];

export default async function TjenestePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <>
      <ServiceJsonLd service={service} />
      <FAQJsonLd items={service.faq} />
      <BreadcrumbJsonLd items={[
        { name: "Hjem", href: "/" },
        { name: "Tjenester", href: "/tjenester" },
        { name: service.name, href: `/tjenester/${service.slug}` },
      ]} />

      {/* Configurator */}
      <ServicePageClient service={service} />

      {/* FAQ — compact, max 4 */}
      <section className="py-16 lg:py-20">
        <SectionReveal className="mx-auto max-w-3xl px-6">
          <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold tracking-[-0.03em] leading-[1.1] text-text">
            Vanlige spørsmål
          </h2>
          <div className="mt-8">
            <Accordion items={service.faq.slice(0, 4)} />
          </div>
        </SectionReveal>
      </section>

      {/* Related service */}
      {relatedServices[slug] && (
        <section className="border-t border-gray-100 py-12 lg:py-16">
          <SectionReveal className="mx-auto max-w-3xl px-6">
            <div className="flex flex-col gap-3 rounded-2xl bg-[#faf8f5] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <p className="text-[15px] leading-[1.6] text-text-secondary">
                {relatedServices[slug].text}
              </p>
              <Link
                href={`/tjenester/${relatedServices[slug].slug}`}
                className="inline-flex shrink-0 items-center gap-1.5 text-[14px] font-semibold text-primary transition-colors hover:text-primary/80"
              >
                {relatedServices[slug].label} <ArrowRight size={14} />
              </Link>
            </div>
          </SectionReveal>
        </section>
      )}

      {/* Coverage tags + CTA — compact */}
      <section className="border-t border-gray-100 py-16 lg:py-20">
        <SectionReveal className="mx-auto max-w-3xl px-6">
          {/* Dekningsområde — inline tags */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[13px] font-semibold text-text-secondary">Vi dekker:</span>
            {dekningsomrader.map((by) => (
              <span key={by} className="inline-flex items-center gap-1 rounded-full border border-gray-100 bg-white px-3 py-1 text-[13px] text-text-secondary">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                {by}
              </span>
            ))}
          </div>

          {/* CTA — tight */}
          <div className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-[clamp(1.25rem,3vw,1.75rem)] font-bold tracking-[-0.03em] text-text">
              Klar for {service.name.toLowerCase()}?
            </h2>
            <div className="flex items-center gap-3">
              <Link
                href="/kontakt"
                className="btn-glow btn-shimmer inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-[14px] font-semibold text-white"
              >
                Få tilbud <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
              <a
                href="tel:+4796823647"
                className="inline-flex items-center gap-1.5 text-[14px] font-medium text-text-secondary transition-colors hover:text-primary"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                968 23 647
              </a>
            </div>
          </div>
        </SectionReveal>
      </section>
    </>
  );
}

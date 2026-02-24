import Link from "next/link";
import type { Metadata } from "next";
import {
  Sparkles, Truck, Building2, HardHat, Wind,
  Droplets, Home, Eye, Users, ArrowRight, Phone,
} from "lucide-react";
import { services } from "@/data/services";
import { PageHero } from "@/components/DarkHero";
import { SectionReveal } from "@/components/SectionReveal";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Våre tjenester",
  description: "Fast vask, flyttevask, kontorvask, byggvask og mer. Se priser fra 350 kr/time. Offentlig godkjent renholdsbedrift i Vestfold.",
  alternates: { canonical: "/tjenester" },
  openGraph: {
    title: "Våre tjenester | Færder Multiservice",
    description: "Fast vask, flyttevask, kontorvask, byggvask og mer. Se priser fra 350 kr/time.",
    url: "/tjenester",
  },
};

const iconMap: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  Sparkles, Truck, Building2, HardHat, Wind, Droplets, Home, Eye, Users,
};

export default function TjenesterPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Hjem", href: "/" },
        { name: "Tjenester", href: "/tjenester" },
      ]} />
      <PageHero label="Tjenester" title="Våre tjenester" subtitle="Alt innen profesjonelt renhold — for hjem og bedrift." />

      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-[1200px] px-6">
          <SectionReveal>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {services.map((s) => {
                const Icon = iconMap[s.icon] || Sparkles;
                return (
                  <Link
                    key={s.slug}
                    href={`/tjenester/${s.slug}`}
                    className="service-card group flex flex-col rounded-3xl border border-gray-100/80 bg-white p-8 lg:p-10"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent transition-all duration-500 group-hover:bg-primary/10 group-hover:scale-110">
                      <Icon size={26} strokeWidth={1.5} className="text-primary" />
                    </div>
                    <h2 className="mt-6 text-[19px] font-semibold tracking-[-0.02em] text-text">{s.name}</h2>
                    <p className="mt-2 text-[15px] leading-[1.7] text-text-secondary">{s.description}</p>
                    <p className="mt-auto pt-5 text-sm font-semibold text-primary">Fra {s.price}</p>
                  </Link>
                );
              })}
            </div>
          </SectionReveal>
        </div>
      </section>

      <section className="bg-background-warm py-24 lg:py-32">
        <SectionReveal className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-bold tracking-[-0.03em] leading-[1.1] text-text">
            Usikker på hva du trenger?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[17px] leading-[1.7] text-text-secondary">
            Kontakt oss for en uforpliktende befaring — vi hjelper deg å finne riktig løsning.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/kontakt"
              className="btn-glow btn-shimmer inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-[15px] font-semibold text-white"
            >
              Ta kontakt <ArrowRight size={16} />
            </Link>
            <a
              href="tel:+4796823647"
              className="btn-outline inline-flex items-center gap-2 rounded-full border-2 border-gray-200 px-8 py-4 text-[15px] font-medium text-text-secondary hover:border-gray-300 hover:text-text"
            >
              <Phone size={15} /> 968 23 647
            </a>
          </div>
        </SectionReveal>
      </section>
    </>
  );
}

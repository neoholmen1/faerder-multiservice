import Link from "next/link";
import type { Metadata } from "next";
import {
  Sparkles, Truck, Building2, HardHat, Wind,
  Home, ArrowRight, Phone,
} from "lucide-react";
import { getCurrentSite } from "@/lib/site";
import { getServicesOrFallback } from "@/lib/cms-fallback";
import { PageHero } from "@/components/DarkHero";
import { SectionReveal } from "@/components/SectionReveal";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Våre tjenester",
  description: "Fast vask, flyttevask, kontorvask, byggvask og mer. Se priser fra 550 kr. Offentlig godkjent renholdsbedrift i Vestfold.",
  alternates: { canonical: "/tjenester" },
  openGraph: {
    title: "Våre tjenester | Færder Multiservice",
    description: "Fast vask, flyttevask, kontorvask, byggvask og mer. Se priser fra 550 kr.",
    url: "/tjenester",
  },
};

const iconMap: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  Sparkles, Truck, Building2, HardHat, Wind, Home,
};

const slugToIcon: Record<string, string> = {
  "fast-vask": "Home",
  "flyttevask": "Truck",
  "kontorvask": "Building2",
  "byggvask": "HardHat",
  "spesialvask": "Sparkles",
  "luktsanering": "Wind",
};

export default async function TjenesterPage() {
  const site = await getCurrentSite();
  const allServices = await getServicesOrFallback(site?.id ?? null);
  const services = allServices.filter((s) => s.visible_on_homepage);

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Hjem", href: "/" },
        { name: "Tjenester", href: "/tjenester" },
      ]} />
      <PageHero label="Tjenester" title="Våre tjenester" subtitle="Vi vasker for folk og bedrifter i hele Vestfold." />

      <section className="py-28 lg:py-36">
        <div className="mx-auto max-w-[1200px] px-6">
          <SectionReveal>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {services.map((s) => {
                const iconName = slugToIcon[s.slug] || s.icon || "Sparkles";
                const Icon = iconMap[iconName] || Sparkles;
                return (
                  <Link
                    key={s.slug}
                    href={`/tjenester/${s.slug}`}
                    className="service-card group flex flex-col items-center rounded-[16px] bg-white px-6 py-8 text-center"
                  >
                    <Icon size={48} strokeWidth={1.2} className="text-primary" />
                    <h2 className="mt-4 text-[16px] font-semibold tracking-tight text-text">{s.name}</h2>
                    <p className="mt-1 text-[14px] leading-[1.6] text-text-secondary">{s.short_description}</p>
                    <p className="mt-3 text-[13px] font-medium text-primary">{s.price_label}</p>
                    <ArrowRight size={14} className="mt-3 text-text-secondary/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary" />
                  </Link>
                );
              })}
            </div>
          </SectionReveal>
        </div>
      </section>

      <div className="section-divider" />
      <section className="bg-[#f5f5f7] py-28 lg:py-36">
        <SectionReveal className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-[clamp(1.75rem,4vw,3rem)] tracking-[-0.02em] leading-[1.1] text-text">
            Usikker på hva du trenger?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[17px] leading-[1.7] text-text-secondary">
            Ring oss, så tar vi en titt — helt gratis. Vi finner ut hva du trenger.
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

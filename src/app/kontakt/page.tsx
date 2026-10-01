import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import KontaktClient from "./client";
import { getPageContent, pick, pickHero } from "@/lib/page-cms";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Kontakt oss — Gratis befaring",
  description:
    "Ta kontakt — vi gir deg gratis befaring og pris. Ring 968 23 647 eller send melding. Vi svarer samme dag — senest neste virkedag.",
  alternates: { canonical: "/kontakt" },
  openGraph: {
    title: "Kontakt oss | Færder Multiservice",
    description: "Ring 968 23 647 eller send oss en melding. Gratis befaring i hele Vestfold.",
    url: "/kontakt",
  },
};

export default async function KontaktPage() {
  const content = await getPageContent("kontakt");
  const heroEyebrow = pickHero(content, "hero_eyebrow", "Kontakt");
  const heroTitle = pickHero(content, "hero_title", "Kontakt oss");
  const heroSubtitle = pickHero(content, "hero_subtitle", "Vi svarer samme dag — senest neste virkedag.");
  const formTitle = pick(content, "form", "title", 0, "Skriv til oss");

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Hjem", href: "/" },
        { name: "Kontakt", href: "/kontakt" },
      ]} />
      <KontaktClient
        heroEyebrow={heroEyebrow}
        heroTitle={heroTitle}
        heroSubtitle={heroSubtitle}
        formTitle={formTitle}
      />
    </>
  );
}

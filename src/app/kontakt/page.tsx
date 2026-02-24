import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import KontaktClient from "./client";

export const metadata: Metadata = {
  title: "Kontakt oss — Gratis befaring",
  description:
    "Kontakt Færder Multiservice for gratis befaring og tilbud. Ring 968 23 647 eller send oss en melding. Vi svarer innen 24 timer.",
  alternates: { canonical: "/kontakt" },
  openGraph: {
    title: "Kontakt oss | Færder Multiservice",
    description: "Ring 968 23 647 eller send oss en melding. Gratis befaring i hele Vestfold.",
    url: "/kontakt",
  },
};

export default function KontaktPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Hjem", href: "/" },
        { name: "Kontakt", href: "/kontakt" },
      ]} />
      <KontaktClient />
    </>
  );
}

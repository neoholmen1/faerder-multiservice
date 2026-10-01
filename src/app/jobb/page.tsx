import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import JobbClient from "./client";
import { getPageContent, pick, pickHero } from "@/lib/page-cms";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Jobb hos oss",
  description:
    "Bli med på laget! Vi er alltid på utkikk etter flinke folk. Godt miljø, god lønn og fleksible tider.",
  alternates: { canonical: "/jobb" },
  openGraph: {
    title: "Jobb hos oss | Færder Multiservice",
    description: "Bli med på laget. Godt miljø, god lønn og fleksible tider.",
    url: "/jobb",
  },
};

export default async function JobbPage() {
  const content = await getPageContent("jobb");
  const cms = {
    heroEyebrow: pickHero(content, "hero_eyebrow", "Karriere"),
    heroTitle: pickHero(content, "hero_title", "Bli en del av teamet"),
    heroSubtitle: pickHero(content, "hero_subtitle", "Vi er alltid på utkikk etter flinke folk."),
    quote: pick(content, "sitat", "quote", 0,
      "Vi ønsker oss alltid nye og trivelige kollegaer i Færder Multiservice."),
    quoteAuthor: pick(content, "sitat", "author", 0, "Aleksandra, daglig leder og eier"),
    fordelerEyebrow: pick(content, "fordeler", "eyebrow", 0, "Fordeler"),
    fordelerTitle: pick(content, "fordeler", "title", 0, "Hvorfor jobbe hos oss"),
    fordelerCards: [
      {
        title: pick(content, "fordeler", "card_title", 0, "Godt miljø"),
        text: pick(content, "fordeler", "card_text", 0, "Vi er et tett team. God stemning og folk som bryr seg."),
      },
      {
        title: pick(content, "fordeler", "card_title", 1, "God lønn"),
        text: pick(content, "fordeler", "card_text", 1, "Vi betaler godt. Gjør du en bra jobb, merker du det."),
      },
      {
        title: pick(content, "fordeler", "card_title", 2, "Fleksible tider"),
        text: pick(content, "fordeler", "card_text", 2, "Vi finner tider som passer. Hverdagen skal gå opp."),
      },
    ],
    soknadEyebrow: pick(content, "soknad", "eyebrow", 0, "Søk"),
    soknadTitle: pick(content, "soknad", "title", 0, "Høres bra ut? Si hei!"),
  };

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Hjem", href: "/" },
        { name: "Jobb", href: "/jobb" },
      ]} />
      <JobbClient cms={cms} />
    </>
  );
}

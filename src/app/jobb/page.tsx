import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import JobbClient from "./client";

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

export default function JobbPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Hjem", href: "/" },
        { name: "Jobb", href: "/jobb" },
      ]} />
      <JobbClient />
    </>
  );
}

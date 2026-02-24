import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import JobbClient from "./client";

export const metadata: Metadata = {
  title: "Jobb hos oss",
  description:
    "Bli en del av teamet hos Færder Multiservice. Vi ser alltid etter dyktige folk. Godt arbeidsmiljø, konkurransedyktig lønn og fleksible arbeidstider.",
  alternates: { canonical: "/jobb" },
  openGraph: {
    title: "Jobb hos oss | Færder Multiservice",
    description: "Bli en del av teamet. Godt arbeidsmiljø, konkurransedyktig lønn og fleksible arbeidstider.",
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

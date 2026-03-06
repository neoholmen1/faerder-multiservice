import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import BlogClient from "./client";

export const metadata: Metadata = {
  title: "Blogg — Tips og råd for et renere hjem",
  description:
    "Alt du trenger å vite om renhold, vedlikehold og et renere hjem. Tips, guider og råd fra Færder Multiservice.",
  alternates: { canonical: "/blogg" },
  openGraph: {
    title: "Blogg | Færder Multiservice",
    description:
      "Alt du trenger å vite om renhold, vedlikehold og et renere hjem.",
    url: "/blogg",
  },
};

export default function BloggPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Hjem", href: "/" },
          { name: "Blogg", href: "/blogg" },
        ]}
      />
      <BlogClient />
    </>
  );
}

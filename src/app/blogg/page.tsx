import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getCurrentSite } from "@/lib/site";
import { getBlogPostsOrFallback, formatBlogDate } from "@/lib/cms-fallback";
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

export default async function BloggPage() {
  const site = await getCurrentSite();
  const posts = await getBlogPostsOrFallback(site?.id ?? null);
  const cards = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    image: p.cover_image_url ?? "/images/illustrations/blogg-fast-vask.webp",
    date: formatBlogDate(p),
    tags: p.tags,
  }));

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Hjem", href: "/" },
          { name: "Blogg", href: "/blogg" },
        ]}
      />
      <BlogClient posts={cards} />
    </>
  );
}

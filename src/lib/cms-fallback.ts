/**
 * CMS-funksjoner med automatisk fallback til hardkodet data fra src/data/*.ts.
 * Brukes av frontend-komponenter som skal fungere uten DB-tilkobling.
 *
 * Mønster:
 *   1. Prøv å hente fra Supabase (cms.ts)
 *   2. Hvis tom liste / null returneres, bruk hardkodet fallback
 *   3. Komponenten ser samme type uavhengig av kilde
 */

import { services as fallbackServices } from "@/data/services";
import { blogPosts as fallbackBlogPosts } from "@/data/blog";
import { testimonials as fallbackTestimonials } from "@/data/testimonials";
import {
  getServices,
  getService,
  getBlogPosts,
  getBlogPost,
  getTestimonials,
  type Service,
  type BlogPost,
  type Testimonial,
} from "./cms";

// ────────────────────────────────────────────────────────────
// Mappers — hardkodet data → DB-kompatible objekter
// ────────────────────────────────────────────────────────────

function mapServiceFallback(s: (typeof fallbackServices)[number], idx: number): Service {
  return {
    id: s.slug,
    site_id: "",
    slug: s.slug,
    name: s.name,
    short_description: s.description,
    long_description: s.longDescription,
    price_label: s.price,
    icon: s.icon,
    image_url: s.image,
    included: s.included,
    frequencies: s.frequencies as Service["frequencies"],
    steps: s.steps,
    faq: s.faq,
    coverage_text: s.coverageText,
    seo_title: s.seoTitle,
    seo_description: s.seoDescription,
    sort_order: idx,
    visible_on_homepage: idx < 6,
    visible_on_pricelist: idx < 6,
    published: true,
  };
}

function mapBlogFallback(p: (typeof fallbackBlogPosts)[number]): BlogPost {
  return {
    id: p.slug,
    site_id: "",
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    body: p.content,
    cover_image_url: p.image,
    tags: p.tags,
    author_name: "",
    published_at: null,
    status: "published",
    seo_title: p.seoTitle,
    seo_description: p.seoDescription,
    created_at: "",
    updated_at: "",
  };
}

function mapTestimonialFallback(
  t: (typeof fallbackTestimonials)[number],
  idx: number,
): Testimonial {
  return {
    id: `${t.name}-${idx}`,
    author_name: t.name,
    author_role: t.location,
    author_company: t.date,
    quote: t.text,
    rating: t.rating,
    sort_order: idx,
  };
}

// ────────────────────────────────────────────────────────────
// Public API — brukt av frontend
// ────────────────────────────────────────────────────────────

export async function getServicesOrFallback(siteId: string | null): Promise<Service[]> {
  if (!siteId) return fallbackServices.map(mapServiceFallback);
  const fromDb = await getServices(siteId);
  if (fromDb.length > 0) return fromDb;
  return fallbackServices.map(mapServiceFallback);
}

export async function getServiceOrFallback(
  siteId: string | null,
  slug: string,
): Promise<Service | null> {
  if (siteId) {
    const fromDb = await getService(siteId, slug);
    if (fromDb) return fromDb;
  }
  const idx = fallbackServices.findIndex((s) => s.slug === slug);
  if (idx === -1) return null;
  return mapServiceFallback(fallbackServices[idx], idx);
}

export async function getBlogPostsOrFallback(siteId: string | null): Promise<BlogPost[]> {
  if (!siteId) return fallbackBlogPosts.map(mapBlogFallback);
  const fromDb = await getBlogPosts(siteId);
  if (fromDb.length > 0) return fromDb;
  return fallbackBlogPosts.map(mapBlogFallback);
}

export async function getBlogPostOrFallback(
  siteId: string | null,
  slug: string,
): Promise<BlogPost | null> {
  if (siteId) {
    const fromDb = await getBlogPost(siteId, slug);
    if (fromDb) return fromDb;
  }
  const post = fallbackBlogPosts.find((p) => p.slug === slug);
  if (!post) return null;
  return mapBlogFallback(post);
}

export async function getTestimonialsOrFallback(
  siteId: string | null,
): Promise<Testimonial[]> {
  if (!siteId) return fallbackTestimonials.map(mapTestimonialFallback);
  const fromDb = await getTestimonials(siteId);
  if (fromDb.length > 0) return fromDb;
  return fallbackTestimonials.map(mapTestimonialFallback);
}

/** Lar oss vise dato uten å kreve en publiseringsdato i DB. */
export function formatBlogDate(post: BlogPost): string {
  if (post.published_at) {
    const d = new Date(post.published_at);
    return d.toLocaleDateString("nb-NO", { year: "numeric", month: "long" });
  }
  // Fallback for hardkodet data — bruk dato-feltet fra src/data/blog.ts
  const fallback = fallbackBlogPosts.find((p) => p.slug === post.slug);
  return fallback?.date ?? "";
}

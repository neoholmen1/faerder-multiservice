import { cache } from "react";
import { supabase } from "./supabase";

// ────────────────────────────────────────────────────────────
// Typer
// ────────────────────────────────────────────────────────────

export type MediaItem = {
  id: string;
  site_id: string;
  storage_path: string;
  url: string;
  alt_text: string;
  category: string;
  mime_type: string | null;
  size_bytes: number | null;
  width: number | null;
  height: number | null;
  uploaded_by: string | null;
  uploaded_at: string;
};

export type Page = {
  id: string;
  site_id: string;
  slug: string;
  name: string;
  hero_image_url: string | null;
  hero_eyebrow: string | null;
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_cta_primary_label: string | null;
  hero_cta_primary_href: string | null;
  hero_cta_secondary_label: string | null;
  hero_cta_secondary_href: string | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
};

export type PageSection = {
  id: string;
  site_id: string;
  page_slug: string;
  section_key: string;
  field_key: string;
  value: string;
  sort_order: number;
  updated_at: string;
};

export type Frequency = {
  id: string;
  label: string;
  sublabel?: string;
  price: string;
  period: string;
  popular?: boolean;
};

export type Step = { title: string; description: string };
export type FaqItem = { question: string; answer: string };

export type Service = {
  id: string;
  site_id: string;
  slug: string;
  name: string;
  short_description: string;
  long_description: string;
  price_label: string;
  icon: string | null;
  image_url: string | null;
  included: string[];
  frequencies: Frequency[];
  steps: Step[];
  faq: FaqItem[];
  coverage_text: string;
  seo_title: string | null;
  seo_description: string | null;
  sort_order: number;
  visible_on_homepage: boolean;
  visible_on_pricelist: boolean;
  published: boolean;
};

export type Testimonial = {
  id: string;
  author_name: string;
  author_role: string;
  author_company: string;
  quote: string;
  rating: number | null;
  sort_order: number;
};

export type BlogPost = {
  id: string;
  site_id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover_image_url: string | null;
  tags: string[];
  author_name: string;
  published_at: string | null;
  status: "draft" | "published";
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
};

// ────────────────────────────────────────────────────────────
// Media
// ────────────────────────────────────────────────────────────

export async function listMedia(siteId: string, category?: string): Promise<MediaItem[]> {
  if (!supabase) return [];
  let query = supabase
    .from("media")
    .select("*")
    .eq("site_id", siteId)
    .order("uploaded_at", { ascending: false });

  if (category) query = query.eq("category", category);

  const { data, error } = await query;
  if (error || !data) return [];
  return data as MediaItem[];
}

export const MEDIA_CATEGORIES = [
  { key: "hero", label: "Hero / topbilde" },
  { key: "service", label: "Tjeneste" },
  { key: "team", label: "Team / portrett" },
  { key: "blog", label: "Blogg" },
  { key: "general", label: "Generelt" },
] as const;

// ────────────────────────────────────────────────────────────
// Pages
// ────────────────────────────────────────────────────────────

export const getPage = cache(async (siteId: string, slug: string): Promise<Page | null> => {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("site_id", siteId)
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  return data as Page;
});

export async function listPages(siteId: string): Promise<Page[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from("pages")
    .select("*")
    .eq("site_id", siteId)
    .order("name");
  return (data ?? []) as Page[];
}

export const getPageSections = cache(
  async (siteId: string, slug: string): Promise<PageSection[]> => {
    if (!supabase) return [];
    const { data } = await supabase
      .from("page_sections")
      .select("*")
      .eq("site_id", siteId)
      .eq("page_slug", slug)
      .order("section_key")
      .order("field_key")
      .order("sort_order");
    return (data ?? []) as PageSection[];
  },
);

export function getSectionField(
  sections: PageSection[],
  sectionKey: string,
  fieldKey: string,
  fallback = "",
): string {
  const row = sections.find(
    (s) => s.section_key === sectionKey && s.field_key === fieldKey && s.sort_order === 0,
  );
  return row?.value || fallback;
}

export function getSectionList(
  sections: PageSection[],
  sectionKey: string,
  fieldKey: string,
): string[] {
  return sections
    .filter((s) => s.section_key === sectionKey && s.field_key === fieldKey)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((s) => s.value);
}

// ────────────────────────────────────────────────────────────
// Services
// ────────────────────────────────────────────────────────────

function normalizeService(s: Record<string, unknown>): Service {
  return {
    ...(s as Service),
    included: Array.isArray(s.included) ? (s.included as string[]) : [],
    frequencies: Array.isArray(s.frequencies) ? (s.frequencies as Frequency[]) : [],
    steps: Array.isArray(s.steps) ? (s.steps as Step[]) : [],
    faq: Array.isArray(s.faq) ? (s.faq as FaqItem[]) : [],
  };
}

export const getServices = cache(async (siteId: string): Promise<Service[]> => {
  if (!supabase) return [];
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("site_id", siteId)
    .eq("published", true)
    .order("sort_order");
  return (data ?? []).map((s) => normalizeService(s as Record<string, unknown>));
});

export const getService = cache(async (siteId: string, slug: string): Promise<Service | null> => {
  if (!supabase) return null;
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("site_id", siteId)
    .eq("slug", slug)
    .maybeSingle();
  if (!data) return null;
  return normalizeService(data as Record<string, unknown>);
});

// ────────────────────────────────────────────────────────────
// Testimonials
// ────────────────────────────────────────────────────────────

export const getTestimonials = cache(async (siteId: string): Promise<Testimonial[]> => {
  if (!supabase) return [];
  const { data } = await supabase
    .from("testimonials")
    .select("id, author_name, author_role, author_company, quote, rating, sort_order")
    .eq("site_id", siteId)
    .eq("published", true)
    .order("sort_order");
  return (data ?? []) as Testimonial[];
});

// ────────────────────────────────────────────────────────────
// Blog
// ────────────────────────────────────────────────────────────

function normalizeBlog(b: Record<string, unknown>): BlogPost {
  return {
    ...(b as BlogPost),
    tags: Array.isArray(b.tags) ? (b.tags as string[]) : [],
  };
}

export const getBlogPosts = cache(async (siteId: string): Promise<BlogPost[]> => {
  if (!supabase) return [];
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("site_id", siteId)
    .eq("status", "published")
    .order("published_at", { ascending: false });
  return (data ?? []).map((b) => normalizeBlog(b as Record<string, unknown>));
});

export const getBlogPost = cache(async (siteId: string, slug: string): Promise<BlogPost | null> => {
  if (!supabase) return null;
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("site_id", siteId)
    .eq("slug", slug)
    .maybeSingle();
  if (!data) return null;
  return normalizeBlog(data as Record<string, unknown>);
});

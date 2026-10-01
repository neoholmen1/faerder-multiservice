import { cache } from "react";
import { supabase } from "./supabase";
import { getCurrentSite } from "./site";
import type { Page, PageSection } from "./cms";

export type PageContent = {
  page: Partial<Page>;
  sections: Record<string, string>;
};

function sectionKey(section: string, field: string, sortOrder: number): string {
  return `${section}::${field}::${sortOrder}`;
}

export const getPageContent = cache(async (slug: string): Promise<PageContent> => {
  if (!supabase) return { page: {}, sections: {} };
  const site = await getCurrentSite();
  if (!site) return { page: {}, sections: {} };

  const [{ data: pageData }, { data: sectionData }] = await Promise.all([
    supabase
      .from("pages")
      .select("*")
      .eq("site_id", site.id)
      .eq("slug", slug)
      .maybeSingle(),
    supabase
      .from("page_sections")
      .select("*")
      .eq("site_id", site.id)
      .eq("page_slug", slug),
  ]);

  const sections: Record<string, string> = {};
  for (const row of (sectionData as PageSection[] | null) ?? []) {
    sections[sectionKey(row.section_key, row.field_key, row.sort_order)] = row.value ?? "";
  }

  return { page: (pageData as Page | null) ?? {}, sections };
});

export function pick(
  content: PageContent,
  section: string,
  field: string,
  sortOrder: number,
  fallback: string,
): string {
  const value = content.sections[sectionKey(section, field, sortOrder)];
  return value && value.trim() !== "" ? value : fallback;
}

export function pickHero(
  content: PageContent,
  field: keyof Page,
  fallback: string,
): string {
  const value = content.page[field];
  if (typeof value === "string" && value.trim() !== "") return value;
  return fallback;
}

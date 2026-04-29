import { supabase } from "@/lib/supabase";
import { savePageHero, savePageSections } from "@/lib/page-content";
import type { Page, PageSection } from "@/lib/cms";
import type { EditableValues } from "./EditableContext";

const PAGE_COLUMNS = new Set<string>([
  "hero_eyebrow",
  "hero_title",
  "hero_subtitle",
  "hero_image_url",
  "hero_cta_primary_label",
  "hero_cta_primary_href",
  "hero_cta_secondary_label",
  "hero_cta_secondary_href",
  "meta_title",
  "meta_description",
]);

export function isPageColumn(key: string): boolean {
  return PAGE_COLUMNS.has(key);
}

export function sectionKey(sectionKey: string, fieldKey: string, sortOrder = 0): string {
  return `${sectionKey}::${fieldKey}::${sortOrder}`;
}

export function parseSectionKey(
  key: string,
): { section: string; field: string; sortOrder: number } | null {
  const parts = key.split("::");
  if (parts.length < 2) return null;
  const sortOrder = parts.length >= 3 ? parseInt(parts[2], 10) || 0 : 0;
  return { section: parts[0], field: parts[1], sortOrder };
}

export async function loadInitialValues(
  siteId: string,
  slug: string,
): Promise<EditableValues> {
  if (!supabase) return {};
  const [{ data: pageData }, { data: sectionData }] = await Promise.all([
    supabase
      .from("pages")
      .select("*")
      .eq("site_id", siteId)
      .eq("slug", slug)
      .maybeSingle(),
    supabase
      .from("page_sections")
      .select("*")
      .eq("site_id", siteId)
      .eq("page_slug", slug),
  ]);

  const out: EditableValues = {};

  const p = pageData as Page | null;
  for (const col of PAGE_COLUMNS) {
    out[col] = (p?.[col as keyof Page] as string | null | undefined) ?? null;
  }

  const sections = (sectionData as PageSection[] | null) ?? [];
  for (const row of sections) {
    out[sectionKey(row.section_key, row.field_key, row.sort_order)] = row.value ?? "";
  }

  return out;
}

export async function saveValues(
  siteId: string,
  slug: string,
  diff: EditableValues,
): Promise<{ error: string | null }> {
  const heroFields: Record<string, string | null> = {};
  const sectionRows: { section_key: string; field_key: string; value: string; sort_order: number }[] = [];

  for (const [key, value] of Object.entries(diff)) {
    if (PAGE_COLUMNS.has(key)) {
      heroFields[key] = (value as string | null) ?? null;
    } else {
      const parsed = parseSectionKey(key);
      if (parsed) {
        sectionRows.push({
          section_key: parsed.section,
          field_key: parsed.field,
          value: (value as string | null) ?? "",
          sort_order: parsed.sortOrder,
        });
      }
    }
  }

  if (Object.keys(heroFields).length > 0) {
    const r = await savePageHero(siteId, slug, heroFields);
    if (r.error) return r;
  }

  if (sectionRows.length > 0) {
    const r = await savePageSections(siteId, slug, sectionRows);
    if (r.error) return r;
  }

  return { error: null };
}

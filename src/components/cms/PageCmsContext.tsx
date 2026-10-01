"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { getCurrentSite } from "@/lib/site";
import type { Page, PageSection } from "@/lib/cms";

type Content = {
  page: Partial<Page>;
  sections: Record<string, string>;
};

const Ctx = createContext<Content>({ page: {}, sections: {} });

function sectionKey(section: string, field: string, sortOrder: number): string {
  return `${section}::${field}::${sortOrder}`;
}

export function PageCmsProvider({
  slug,
  initial,
  children,
}: {
  slug: string;
  initial?: Content;
  children: ReactNode;
}) {
  const [content, setContent] = useState<Content>(initial ?? { page: {}, sections: {} });

  useEffect(() => {
    if (initial) return;
    let cancelled = false;
    (async () => {
      if (!supabase) return;
      const site = await getCurrentSite();
      if (!site) return;
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
      if (cancelled) return;
      const sections: Record<string, string> = {};
      for (const row of (sectionData as PageSection[] | null) ?? []) {
        sections[sectionKey(row.section_key, row.field_key, row.sort_order)] = row.value ?? "";
      }
      setContent({ page: (pageData as Page | null) ?? {}, sections });
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, initial]);

  return <Ctx.Provider value={content}>{children}</Ctx.Provider>;
}

export type PageCmsContent = Content;

export function useCms(section: string, field: string, sortOrder: number, fallback: string): string {
  const content = useContext(Ctx);
  const value = content.sections[sectionKey(section, field, sortOrder)];
  return value && value.trim() !== "" ? value : fallback;
}

export function useCmsHero(field: keyof Page, fallback: string): string {
  const content = useContext(Ctx);
  const value = content.page[field];
  if (typeof value === "string" && value.trim() !== "") return value;
  return fallback;
}

import { cache } from "react";
import { supabase } from "./supabase";

export const SITE_SLUG = process.env.NEXT_PUBLIC_SITE_SLUG ?? "faerder";

export type Site = {
  id: string;
  slug: string;
  name: string;
  domain: string | null;
  org_number: string | null;
  theme: Record<string, unknown>;
};

export type Badge = { key: string; label: string; tooltip?: string };

export type SiteSettings = {
  site_id: string;
  phone: string | null;
  email_general: string | null;
  visit_address: string | null;
  postal_address: string | null;
  opening_hours: string | null;
  social: Record<string, string>;
  coverage_areas: string[];
  badges: Badge[];
  updated_at: string;
};

export type SiteRole = "owner" | "editor" | "super_admin";

export type SiteAccess = {
  hasAccess: boolean;
  role: SiteRole | null;
};

/**
 * Hardkodet sannhet — dette vises når DB ikke er koblet til, eller hvis
 * site_settings-raden mangler. Holder all kontaktinfo ett sted.
 */
export const SITE_SETTINGS_FALLBACK: SiteSettings = {
  site_id: "",
  phone: "968 23 647",
  email_general: "post@faerdermultiservice.no",
  visit_address: "Rambergveien 1, Tønsberg",
  postal_address: "Rambergveien 1, Tønsberg",
  opening_hours: "Mandag–fredag: 08:00–16:00\nLørdag–søndag: Stengt",
  social: {},
  coverage_areas: [
    "Tønsberg",
    "Nøtterøy",
    "Tjøme",
    "Færder",
    "Sandefjord",
    "Horten",
    "Holmestrand",
    "Larvik",
  ],
  badges: [
    { key: "godkjent", label: "Offentlig godkjent renholdsbedrift", tooltip: "Godkjent av Arbeidstilsynet. Registrert i Renholdsregisteret." },
    { key: "nho", label: "Medlem av NHO Service og Handel", tooltip: "NHO Service og Handel: Norges ledende arbeidsgiverorganisasjon for servicenæringen." },
    { key: "ev", label: "EV-sertifisert", tooltip: "EV-dampmaskin: Ingen sterke kjemikalier. Skånsomt for miljøet." },
  ],
  updated_at: "",
};

/**
 * Hent siten denne deployen tilhører. Returnerer null hvis DB ikke er
 * konfigurert eller hvis raden ikke finnes.
 */
export const getCurrentSite = cache(async (): Promise<Site | null> => {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("sites")
    .select("id, slug, name, domain, org_number, theme")
    .eq("slug", SITE_SLUG)
    .eq("active", true)
    .maybeSingle();

  if (error || !data) return null;
  return data as Site;
});

export const getSiteSettings = cache(async (siteId: string): Promise<SiteSettings | null> => {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("site_id", siteId)
    .maybeSingle();

  if (error || !data) return null;
  return {
    ...data,
    social: (data.social ?? {}) as Record<string, string>,
    coverage_areas: Array.isArray(data.coverage_areas) ? data.coverage_areas : [],
    badges: Array.isArray(data.badges) ? data.badges : [],
  } as SiteSettings;
});

export async function getSiteSettingsOrFallback(siteId: string | null): Promise<SiteSettings> {
  if (!siteId) return SITE_SETTINGS_FALLBACK;
  const settings = await getSiteSettings(siteId);
  return settings ?? { ...SITE_SETTINGS_FALLBACK, site_id: siteId };
}

export async function getSiteAccessForCurrentUser(siteId: string): Promise<SiteAccess> {
  if (!supabase) return { hasAccess: false, role: null };
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { hasAccess: false, role: null };

  const [{ data: superAdmin }, { data: siteUser }] = await Promise.all([
    supabase.from("super_admins").select("user_id").eq("user_id", user.id).maybeSingle(),
    supabase
      .from("site_users")
      .select("role")
      .eq("user_id", user.id)
      .eq("site_id", siteId)
      .maybeSingle(),
  ]);

  if (superAdmin) return { hasAccess: true, role: "super_admin" };
  if (siteUser) return { hasAccess: true, role: siteUser.role as "owner" | "editor" };
  return { hasAccess: false, role: null };
}

export function formatPhoneLink(phone?: string | null): string {
  const digits = (phone ?? SITE_SETTINGS_FALLBACK.phone ?? "").replace(/\s/g, "");
  if (!digits) return "";
  if (digits.startsWith("+")) return `tel:${digits}`;
  return `tel:+47${digits}`;
}

export function formatPhoneIntl(phone?: string | null): string {
  if (!phone) return "";
  if (phone.startsWith("+")) return phone;
  return `+47 ${phone}`;
}

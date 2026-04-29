"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Star } from "lucide-react";
import { getCurrentSite, type SiteSettings, type Badge } from "@/lib/site";
import { supabase } from "@/lib/supabase";
import type { Testimonial } from "@/lib/cms";
import { revalidatePublicSite } from "@/app/actions/revalidate";
import PageHeader from "@/components/admin/PageHeader";
import SaveBar from "@/components/admin/SaveBar";
import { Field, inputClass, textareaClass } from "@/components/admin/Field";

type TestimonialDraft = {
  id?: string;
  author_name: string;
  author_role: string;
  author_company: string;
  quote: string;
  rating: number | null;
  sort_order: number;
  published: boolean;
};

export default function InnstillingerPage() {
  const [siteId, setSiteId] = useState<string | null>(null);
  const [orig, setOrig] = useState<SiteSettings | null>(null);
  const [draft, setDraft] = useState<SiteSettings | null>(null);
  const [coverageInput, setCoverageInput] = useState("");
  const [testimonials, setTestimonials] = useState<TestimonialDraft[]>([]);
  const [origTestimonials, setOrigTestimonials] = useState<TestimonialDraft[]>([]);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const site = await getCurrentSite();
      if (!site || !supabase) return;
      setSiteId(site.id);

      const [{ data: settings }, { data: tests }] = await Promise.all([
        supabase.from("site_settings").select("*").eq("site_id", site.id).maybeSingle(),
        supabase
          .from("testimonials")
          .select("*")
          .eq("site_id", site.id)
          .order("sort_order"),
      ]);

      if (settings) {
        const s: SiteSettings = {
          ...settings,
          social: (settings.social ?? {}) as Record<string, string>,
          coverage_areas: Array.isArray(settings.coverage_areas) ? settings.coverage_areas : [],
          badges: Array.isArray(settings.badges) ? settings.badges : [],
        };
        setOrig(s);
        setDraft(s);
        setCoverageInput(s.coverage_areas.join(", "));
      }

      if (tests) {
        const ts = tests.map(
          (t): TestimonialDraft => ({
            id: t.id,
            author_name: t.author_name,
            author_role: t.author_role ?? "",
            author_company: t.author_company ?? "",
            quote: t.quote,
            rating: t.rating,
            sort_order: t.sort_order,
            published: t.published,
          }),
        );
        setTestimonials(ts);
        setOrigTestimonials(ts);
      }
    })();
  }, []);

  if (!siteId || !draft || !orig) {
    return (
      <>
        <PageHeader title="Innstillinger" subtitle="Kontaktinfo, sosiale medier og testimonials." />
        <div className="flex flex-1 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#E8721C] border-t-transparent" />
        </div>
      </>
    );
  }

  const settingsDirty =
    JSON.stringify({ ...draft, coverage_areas: coverageInput.split(",").map((s) => s.trim()).filter(Boolean) }) !==
    JSON.stringify({ ...orig, coverage_areas: orig.coverage_areas });
  const testimonialsDirty = JSON.stringify(testimonials) !== JSON.stringify(origTestimonials);
  const dirty = settingsDirty || testimonialsDirty;

  function update<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setDraft((d) => (d ? { ...d, [key]: value } : d));
  }

  function updateSocial(platform: string, url: string) {
    setDraft((d) => {
      if (!d) return d;
      const social = { ...d.social };
      if (url) social[platform] = url;
      else delete social[platform];
      return { ...d, social };
    });
  }

  async function handleSave() {
    if (!supabase || !draft) return;
    setSaving(true);
    setStatus("idle");
    setError(null);

    const coverage_areas = coverageInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const { error: settingsErr } = await supabase
      .from("site_settings")
      .upsert(
        {
          site_id: draft.site_id || siteId,
          phone: draft.phone,
          email_general: draft.email_general,
          visit_address: draft.visit_address,
          postal_address: draft.postal_address,
          opening_hours: draft.opening_hours,
          social: draft.social,
          coverage_areas,
          badges: draft.badges,
        },
        { onConflict: "site_id" },
      );

    if (settingsErr) {
      setStatus("error");
      setError(settingsErr.message);
      setSaving(false);
      return;
    }

    // Persist testimonials: upsert existing, insert new, delete removed
    const removedIds = origTestimonials
      .filter((o) => o.id && !testimonials.some((t) => t.id === o.id))
      .map((o) => o.id!);
    if (removedIds.length > 0) {
      await supabase.from("testimonials").delete().in("id", removedIds);
    }

    for (const t of testimonials) {
      if (t.id) {
        await supabase
          .from("testimonials")
          .update({
            author_name: t.author_name,
            author_role: t.author_role,
            author_company: t.author_company,
            quote: t.quote,
            rating: t.rating,
            sort_order: t.sort_order,
            published: t.published,
          })
          .eq("id", t.id);
      } else {
        await supabase.from("testimonials").insert({
          site_id: siteId,
          author_name: t.author_name,
          author_role: t.author_role,
          author_company: t.author_company,
          quote: t.quote,
          rating: t.rating,
          sort_order: t.sort_order,
          published: t.published,
        });
      }
    }

    // Re-fetch testimonials to get new IDs
    const { data: tests } = await supabase
      .from("testimonials")
      .select("*")
      .eq("site_id", siteId)
      .order("sort_order");
    const refreshed = (tests ?? []).map(
      (t): TestimonialDraft => ({
        id: t.id,
        author_name: t.author_name,
        author_role: t.author_role ?? "",
        author_company: t.author_company ?? "",
        quote: t.quote,
        rating: t.rating,
        sort_order: t.sort_order,
        published: t.published,
      }),
    );
    setTestimonials(refreshed);
    setOrigTestimonials(refreshed);

    const newSettings = { ...draft, coverage_areas };
    setOrig(newSettings);
    setDraft(newSettings);
    setStatus("saved");
    await revalidatePublicSite();
    setSaving(false);
  }

  function discard() {
    if (!orig) return;
    setDraft(orig);
    setCoverageInput(orig.coverage_areas.join(", "));
    setTestimonials(origTestimonials);
  }

  return (
    <>
      <PageHeader title="Innstillinger" subtitle="Kontaktinfo, åpningstider, sosiale medier og testimonials." />

      <div className="flex flex-1 flex-col overflow-y-auto bg-[#fafaf9]">
        <div className="mx-auto w-full max-w-3xl px-8 py-8 space-y-6">
          {/* Kontakt */}
          <Section title="Kontaktinfo">
            <Field label="Telefon">
              <input
                type="text"
                className={inputClass}
                value={draft.phone ?? ""}
                onChange={(e) => update("phone", e.target.value || null)}
              />
            </Field>
            <Field label="E-post">
              <input
                type="email"
                className={inputClass}
                value={draft.email_general ?? ""}
                onChange={(e) => update("email_general", e.target.value || null)}
              />
            </Field>
            <Field label="Besøksadresse">
              <input
                type="text"
                className={inputClass}
                value={draft.visit_address ?? ""}
                onChange={(e) => update("visit_address", e.target.value || null)}
              />
            </Field>
            <Field label="Postadresse">
              <input
                type="text"
                className={inputClass}
                value={draft.postal_address ?? ""}
                onChange={(e) => update("postal_address", e.target.value || null)}
              />
            </Field>
            <Field
              label="Åpningstider"
              help="Multilinje støttes. Skriv en ny linje for hver dag/intervall."
            >
              <textarea
                className={textareaClass}
                value={draft.opening_hours ?? ""}
                onChange={(e) => update("opening_hours", e.target.value || null)}
              />
            </Field>
          </Section>

          {/* Sosiale medier */}
          <Section title="Sosiale medier" description="La feltet stå tomt hvis kanalen ikke brukes.">
            <Field label="Facebook">
              <input
                type="url"
                className={inputClass}
                placeholder="https://facebook.com/..."
                value={draft.social.facebook ?? ""}
                onChange={(e) => updateSocial("facebook", e.target.value)}
              />
            </Field>
            <Field label="Instagram">
              <input
                type="url"
                className={inputClass}
                placeholder="https://instagram.com/..."
                value={draft.social.instagram ?? ""}
                onChange={(e) => updateSocial("instagram", e.target.value)}
              />
            </Field>
            <Field label="LinkedIn">
              <input
                type="url"
                className={inputClass}
                placeholder="https://linkedin.com/company/..."
                value={draft.social.linkedin ?? ""}
                onChange={(e) => updateSocial("linkedin", e.target.value)}
              />
            </Field>
          </Section>

          {/* Dekningsområde */}
          <Section
            title="Dekningsområde"
            description="Komma-separert liste. Vises i footer og på dekningssiden."
          >
            <Field label="Byer / steder">
              <textarea
                className={textareaClass}
                value={coverageInput}
                onChange={(e) => setCoverageInput(e.target.value)}
                placeholder="Tønsberg, Nøtterøy, Tjøme, ..."
              />
            </Field>
          </Section>

          {/* Badges */}
          <Section title="Badges / sertifiseringer">
            <BadgesEditor badges={draft.badges} onChange={(b) => update("badges", b)} />
          </Section>

          {/* Testimonials */}
          <Section
            title="Kundeanmeldelser"
            description={`${testimonials.length} ${testimonials.length === 1 ? "anmeldelse" : "anmeldelser"}`}
          >
            <TestimonialsEditor items={testimonials} onChange={setTestimonials} />
          </Section>
        </div>
      </div>

      <SaveBar
        saving={saving}
        status={status}
        error={error}
        dirty={dirty}
        onSave={handleSave}
        onDiscard={discard}
      />
    </>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[#ececec] bg-white p-6">
      <div className="mb-5 border-b border-[#fafaf9] pb-4">
        <h2 className="text-[14px] font-semibold tracking-tight text-[#171717]">{title}</h2>
        {description && <p className="mt-0.5 text-[11.5px] text-[#a3a3a3]">{description}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function BadgesEditor({
  badges,
  onChange,
}: {
  badges: Badge[];
  onChange: (b: Badge[]) => void;
}) {
  return (
    <div className="space-y-3">
      {badges.map((b, i) => (
        <div key={i} className="rounded-lg border border-[#ececec] bg-[#fafaf9] p-3">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              className={inputClass}
              placeholder="Nøkkel (f.eks. 'godkjent')"
              value={b.key}
              onChange={(e) => {
                const next = [...badges];
                next[i] = { ...next[i], key: e.target.value };
                onChange(next);
              }}
            />
            <input
              type="text"
              className={inputClass}
              placeholder="Etikett"
              value={b.label}
              onChange={(e) => {
                const next = [...badges];
                next[i] = { ...next[i], label: e.target.value };
                onChange(next);
              }}
            />
          </div>
          <input
            type="text"
            className={`${inputClass} mt-2`}
            placeholder="Tooltip (valgfritt)"
            value={b.tooltip ?? ""}
            onChange={(e) => {
              const next = [...badges];
              next[i] = { ...next[i], tooltip: e.target.value || undefined };
              onChange(next);
            }}
          />
          <div className="mt-2 text-right">
            <button
              onClick={() => onChange(badges.filter((_, idx) => idx !== i))}
              className="text-[11.5px] font-medium text-[#737373] transition-colors hover:text-red-600"
            >
              Slett
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={() => onChange([...badges, { key: "", label: "" }])}
        className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-[#d4d4d4] bg-white px-4 py-2 text-[12.5px] font-medium text-[#525252] transition-colors hover:border-[#E8721C] hover:text-[#E8721C]"
      >
        <Plus className="h-3.5 w-3.5" /> Legg til badge
      </button>
    </div>
  );
}

function TestimonialsEditor({
  items,
  onChange,
}: {
  items: TestimonialDraft[];
  onChange: (items: TestimonialDraft[]) => void;
}) {
  return (
    <div className="space-y-3">
      {items.map((t, i) => (
        <div key={t.id ?? `new-${i}`} className="rounded-lg border border-[#ececec] bg-[#fafaf9] p-4">
          <div className="grid grid-cols-2 gap-2">
            <Field label="Navn">
              <input
                type="text"
                className={inputClass}
                value={t.author_name}
                onChange={(e) => {
                  const next = [...items];
                  next[i] = { ...next[i], author_name: e.target.value };
                  onChange(next);
                }}
              />
            </Field>
            <Field label="Rolle / sted">
              <input
                type="text"
                className={inputClass}
                value={t.author_role}
                onChange={(e) => {
                  const next = [...items];
                  next[i] = { ...next[i], author_role: e.target.value };
                  onChange(next);
                }}
              />
            </Field>
            <Field label="Kontekst (f.eks. Bedriftskunde)">
              <input
                type="text"
                className={inputClass}
                value={t.author_company}
                onChange={(e) => {
                  const next = [...items];
                  next[i] = { ...next[i], author_company: e.target.value };
                  onChange(next);
                }}
              />
            </Field>
            <Field label="Stjerner (1–5)">
              <input
                type="number"
                min={1}
                max={5}
                className={inputClass}
                value={t.rating ?? 5}
                onChange={(e) => {
                  const next = [...items];
                  next[i] = { ...next[i], rating: parseInt(e.target.value) || null };
                  onChange(next);
                }}
              />
            </Field>
          </div>
          <div className="mt-3">
            <Field label="Sitat">
              <textarea
                className={textareaClass}
                value={t.quote}
                onChange={(e) => {
                  const next = [...items];
                  next[i] = { ...next[i], quote: e.target.value };
                  onChange(next);
                }}
              />
            </Field>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <label className="flex items-center gap-2 text-[12.5px] text-[#525252]">
              <input
                type="checkbox"
                checked={t.published}
                onChange={(e) => {
                  const next = [...items];
                  next[i] = { ...next[i], published: e.target.checked };
                  onChange(next);
                }}
              />
              Synlig på nettsiden
            </label>
            <button
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="inline-flex items-center gap-1 text-[11.5px] font-medium text-[#737373] transition-colors hover:text-red-600"
            >
              <Trash2 className="h-3 w-3" /> Slett
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={() =>
          onChange([
            ...items,
            {
              author_name: "",
              author_role: "",
              author_company: "",
              quote: "",
              rating: 5,
              sort_order: items.length,
              published: true,
            },
          ])
        }
        className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-[#d4d4d4] bg-white px-4 py-2 text-[12.5px] font-medium text-[#525252] transition-colors hover:border-[#E8721C] hover:text-[#E8721C]"
      >
        <Plus className="h-3.5 w-3.5" /> Legg til anmeldelse
      </button>
    </div>
  );
}

"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCurrentSite } from "@/lib/site";
import { getService, type Service } from "@/lib/cms";
import { supabase } from "@/lib/supabase";
import { revalidatePublicSite } from "@/app/actions/revalidate";
import MediaPicker from "@/components/admin/MediaPicker";
import SaveBar from "@/components/admin/SaveBar";
import { Field, inputClass, textareaClass } from "@/components/admin/Field";

export default function TjenesteEditorRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [siteId, setSiteId] = useState<string | null>(null);
  const [original, setOriginal] = useState<Service | null>(null);
  const [draft, setDraft] = useState<Service | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const site = await getCurrentSite();
      if (!site) return;
      setSiteId(site.id);
      const s = await getService(site.id, slug);
      if (s) {
        setOriginal(s);
        setDraft(s);
      }
    })();
  }, [slug]);

  if (!siteId || !draft || !original) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#E8721C] border-t-transparent" />
      </div>
    );
  }

  const dirty = JSON.stringify(draft) !== JSON.stringify(original);

  function update<K extends keyof Service>(key: K, value: Service[K]) {
    setDraft((d) => (d ? { ...d, [key]: value } : d));
  }

  async function handleSave() {
    if (!supabase || !draft) return;
    setSaving(true);
    setStatus("idle");
    setError(null);
    const { error } = await supabase
      .from("services")
      .update({
        name: draft.name,
        short_description: draft.short_description,
        long_description: draft.long_description,
        price_label: draft.price_label,
        icon: draft.icon,
        image_url: draft.image_url,
        included: draft.included,
        frequencies: draft.frequencies,
        steps: draft.steps,
        faq: draft.faq,
        coverage_text: draft.coverage_text,
        seo_title: draft.seo_title,
        seo_description: draft.seo_description,
        sort_order: draft.sort_order,
        visible_on_homepage: draft.visible_on_homepage,
        visible_on_pricelist: draft.visible_on_pricelist,
        published: draft.published,
      })
      .eq("id", draft.id);

    if (error) {
      setStatus("error");
      setError(error.message);
    } else {
      setOriginal(draft);
      setStatus("saved");
      await revalidatePublicSite();
      router.refresh();
    }
    setSaving(false);
  }

  return (
    <>
      <div className="flex shrink-0 items-center gap-3 border-b border-[#ececec] bg-white px-8 pb-3 pt-5">
        <Link
          href="/admin/tjenester"
          className="flex h-7 w-7 items-center justify-center rounded-lg text-[#a3a3a3] transition-colors hover:bg-[#fafaf9] hover:text-[#171717]"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
        </Link>
        <div>
          <p className="text-[11px] uppercase tracking-[0.1em] text-[#a3a3a3]">Tjeneste</p>
          <h1 className="text-[18px] font-semibold tracking-tight text-[#171717]">{draft.name}</h1>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto bg-[#fafaf9]">
        <div className="mx-auto w-full max-w-3xl px-8 py-8 space-y-6">
          {/* Synlighet */}
          <Section title="Synlighet">
            <div className="space-y-3">
              <Toggle
                label="Publisert (synlig på nettsiden)"
                checked={draft.published}
                onChange={(v) => update("published", v)}
              />
              <Toggle
                label="Vis på forsiden"
                checked={draft.visible_on_homepage}
                onChange={(v) => update("visible_on_homepage", v)}
              />
              <Toggle
                label="Vis i prislisten"
                checked={draft.visible_on_pricelist}
                onChange={(v) => update("visible_on_pricelist", v)}
              />
            </div>
          </Section>

          {/* Grunnleggende */}
          <Section title="Grunnleggende">
            <Field label="Navn">
              <input
                type="text"
                className={inputClass}
                value={draft.name}
                onChange={(e) => update("name", e.target.value)}
              />
            </Field>
            <Field label="Slug" help="Brukes i URL-en. Endre kun ved opprettelse.">
              <input type="text" className={inputClass} value={draft.slug} disabled />
            </Field>
            <Field label="Kort beskrivelse" help="Vises i tjeneste-kortet på forsiden.">
              <input
                type="text"
                className={inputClass}
                value={draft.short_description}
                onChange={(e) => update("short_description", e.target.value)}
              />
            </Field>
            <Field label="Lang beskrivelse" help="Vises på tjenestesiden under tittelen.">
              <textarea
                className={textareaClass}
                value={draft.long_description}
                onChange={(e) => update("long_description", e.target.value)}
              />
            </Field>
            <Field label="Pris-etikett" help='F.eks. "Fra 550 kr" eller "Etter avtale".'>
              <input
                type="text"
                className={inputClass}
                value={draft.price_label}
                onChange={(e) => update("price_label", e.target.value)}
              />
            </Field>
            <Field label="Dekningsområde-tekst">
              <textarea
                className={textareaClass}
                value={draft.coverage_text}
                onChange={(e) => update("coverage_text", e.target.value)}
              />
            </Field>
            <Field label="Bilde">
              <MediaPicker
                siteId={siteId}
                defaultCategory="service"
                value={draft.image_url}
                onChange={(url) => update("image_url", url)}
                label=""
              />
            </Field>
          </Section>

          {/* Inkludert (string list) */}
          <Section
            title="Hva er inkludert"
            description={`${draft.included.length} punkter`}
          >
            <ListEditor
              items={draft.included}
              onChange={(items) => update("included", items)}
              placeholder="F.eks. Støvtørking av alle møbler"
            />
          </Section>

          {/* Frekvenser (JSON) */}
          <Section
            title="Frekvenser / pakker"
            description="Redigeres som JSON. Hver oppføring: {id, label, sublabel?, price, period, popular?}"
          >
            <JsonEditor
              value={draft.frequencies}
              onChange={(v) => update("frequencies", v)}
            />
          </Section>

          {/* Steg (JSON) */}
          <Section title="Slik fungerer det" description="Hver oppføring: {title, description}">
            <JsonEditor value={draft.steps} onChange={(v) => update("steps", v)} />
          </Section>

          {/* FAQ (JSON) */}
          <Section title="FAQ" description="Hver oppføring: {question, answer}">
            <JsonEditor value={draft.faq} onChange={(v) => update("faq", v)} />
          </Section>

          {/* SEO */}
          <Section title="SEO">
            <Field label="SEO-tittel">
              <input
                type="text"
                className={inputClass}
                value={draft.seo_title ?? ""}
                onChange={(e) => update("seo_title", e.target.value || null)}
              />
            </Field>
            <Field label="SEO-beskrivelse">
              <textarea
                className={textareaClass}
                value={draft.seo_description ?? ""}
                onChange={(e) => update("seo_description", e.target.value || null)}
              />
            </Field>
          </Section>
        </div>
      </div>

      <SaveBar
        saving={saving}
        status={status}
        error={error}
        dirty={dirty}
        onSave={handleSave}
        onDiscard={() => setDraft(original)}
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

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 rounded-full transition-colors ${
          checked ? "bg-[#E8721C]" : "bg-[#e5e5e4]"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.15)] transition-transform ${
            checked ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </button>
      <span className="text-[13.5px] text-[#404040]">{label}</span>
    </label>
  );
}

function ListEditor({
  items,
  onChange,
  placeholder,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            type="text"
            className={inputClass}
            value={item}
            placeholder={placeholder}
            onChange={(e) => {
              const next = [...items];
              next[i] = e.target.value;
              onChange(next);
            }}
          />
          <button
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            className="rounded-lg border border-[#ececec] bg-white px-3 text-[12px] font-medium text-[#737373] transition-colors hover:border-[#d4d4d4] hover:text-red-600"
          >
            Slett
          </button>
        </div>
      ))}
      <button
        onClick={() => onChange([...items, ""])}
        className="rounded-full border border-dashed border-[#d4d4d4] bg-white px-4 py-2 text-[12.5px] font-medium text-[#525252] transition-colors hover:border-[#E8721C] hover:text-[#E8721C]"
      >
        + Legg til
      </button>
    </div>
  );
}

function JsonEditor<T>({ value, onChange }: { value: T; onChange: (v: T) => void }) {
  const [text, setText] = useState(JSON.stringify(value, null, 2));
  const [parseError, setParseError] = useState<string | null>(null);

  useEffect(() => {
    setText(JSON.stringify(value, null, 2));
  }, [value]);

  function handleChange(next: string) {
    setText(next);
    try {
      const parsed = JSON.parse(next);
      onChange(parsed);
      setParseError(null);
    } catch (e) {
      setParseError(e instanceof Error ? e.message : "Ugyldig JSON");
    }
  }

  return (
    <div>
      <textarea
        className={`${textareaClass} font-mono text-[12.5px] min-h-[180px]`}
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        spellCheck={false}
      />
      {parseError && (
        <p className="mt-1.5 text-[11.5px] text-red-600">JSON-feil: {parseError}</p>
      )}
    </div>
  );
}

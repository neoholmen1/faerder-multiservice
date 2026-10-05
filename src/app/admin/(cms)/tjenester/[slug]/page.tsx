"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
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
  const liveUrl = `/tjenester/${slug}`;

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
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#E57100] border-t-transparent" />
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
    }
    setSaving(false);
  }

  return (
    <>
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#ececec] bg-white px-6 pb-3 pt-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/tjenester"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[#a3a3a3] transition-colors hover:bg-[#fafaf9] hover:text-[#171717]"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          </Link>
          <div>
            <p className="text-[11px] uppercase tracking-[0.1em] text-[#a3a3a3]">Tjeneste</p>
            <h1 className="text-[17px] font-semibold tracking-tight text-[#171717]">{draft.name}</h1>
          </div>
        </div>
        <Link
          href={liveUrl}
          target="_blank"
          className="inline-flex items-center gap-2 rounded-full bg-[#E57100] px-4 py-2 text-[12.5px] font-semibold text-white transition-all hover:bg-[#a64f0d] active:scale-95"
        >
          Se siden live <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
        </Link>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="mx-auto w-full max-w-3xl overflow-y-auto bg-[#fafaf9]">
          <div className="px-6 py-6 space-y-4">
          {/* Synlighet */}
          <Section title="Synlighet" description="Hvor og om tjenesten vises." defaultOpen>
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
          <Section title="Grunnleggende" description="Navn, beskrivelser, pris og bilde." defaultOpen>
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
            <Field label="Pris-etikett" help='F.eks. "Fra 470 kr" eller "Etter avtale". Må matche billigste pris-pakke.'>
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

          {/* Frekvenser / pakker */}
          <Section
            title="Frekvenser / pakker"
            description="Pris-pakkene som vises i kalkulatoren på tjenestesiden."
          >
            <FrequenciesEditor
              items={draft.frequencies}
              onChange={(v) => update("frequencies", v)}
            />
          </Section>

          {/* Steg */}
          <Section title="Slik fungerer det" description="3 steg som vises på tjenestesiden.">
            <StepsEditor items={draft.steps} onChange={(v) => update("steps", v)} />
          </Section>

          {/* FAQ */}
          <Section title="Spørsmål og svar" description="Vises som accordion nederst på tjenestesiden.">
            <FaqEditor items={draft.faq} onChange={(v) => update("faq", v)} />
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
  defaultOpen = false,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="overflow-hidden rounded-xl border border-[#ececec] bg-white">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-[#fafaf9]"
      >
        <div className="min-w-0">
          <h2 className="text-[13.5px] font-semibold tracking-tight text-[#171717]">{title}</h2>
          {description && <p className="mt-0.5 text-[11px] leading-snug text-[#a3a3a3]">{description}</p>}
        </div>
        <svg
          className={`h-4 w-4 shrink-0 text-[#a3a3a3] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className="space-y-3.5 border-t border-[#fafaf9] px-5 py-5">{children}</div>
      )}
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
    <label className="flex cursor-pointer select-none items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="relative inline-flex shrink-0 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E57100]/30 focus-visible:ring-offset-2"
        style={{
          width: "40px",
          height: "22px",
          backgroundColor: checked ? "#E57100" : "#d4d4d4",
        }}
      >
        <span
          aria-hidden="true"
          className="rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-200"
          style={{
            width: "18px",
            height: "18px",
            transform: `translate(${checked ? 20 : 2}px, 2px)`,
          }}
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
        className="rounded-full border border-dashed border-[#d4d4d4] bg-white px-4 py-2 text-[12.5px] font-medium text-[#525252] transition-colors hover:border-[#E57100] hover:text-[#E57100]"
      >
        + Legg til
      </button>
    </div>
  );
}

type Frequency = { id: string; label: string; sublabel?: string; price: string; period: string; popular?: boolean };
type Step = { title: string; description: string };
type Faq = { question: string; answer: string };

function FrequenciesEditor({ items, onChange }: { items: Frequency[]; onChange: (v: Frequency[]) => void }) {
  function update(i: number, patch: Partial<Frequency>) {
    const next = [...items];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  }
  return (
    <div className="space-y-3">
      {items.map((f, i) => (
        <div key={i} className="rounded-lg border border-[#ececec] bg-[#fafaf9] p-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Navn (f.eks. Ukentlig)">
              <input
                type="text"
                className={inputClass}
                value={f.label}
                onChange={(e) => update(i, { label: e.target.value })}
              />
            </Field>
            <Field label="Undertekst (valgfri)">
              <input
                type="text"
                className={inputClass}
                value={f.sublabel ?? ""}
                onChange={(e) => update(i, { sublabel: e.target.value })}
              />
            </Field>
            <Field label="Pris (f.eks. Fra 550)">
              <input
                type="text"
                className={inputClass}
                value={f.price}
                onChange={(e) => update(i, { price: e.target.value })}
              />
            </Field>
            <Field label="Enhet (f.eks. kr/gang)">
              <input
                type="text"
                className={inputClass}
                value={f.period}
                onChange={(e) => update(i, { period: e.target.value })}
              />
            </Field>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <Toggle
              label="Marker som populær"
              checked={!!f.popular}
              onChange={(v) => update(i, { popular: v || undefined })}
            />
            <button
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="text-[12px] font-medium text-[#737373] transition-colors hover:text-red-600"
            >
              Slett
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={() =>
          onChange([...items, { id: `freq-${Date.now()}`, label: "", price: "", period: "kr" }])
        }
        className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-[#d4d4d4] bg-white px-4 py-2 text-[12.5px] font-medium text-[#525252] transition-colors hover:border-[#E57100] hover:text-[#E57100]"
      >
        + Legg til pakke
      </button>
    </div>
  );
}

function StepsEditor({ items, onChange }: { items: Step[]; onChange: (v: Step[]) => void }) {
  function update(i: number, patch: Partial<Step>) {
    const next = [...items];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  }
  return (
    <div className="space-y-3">
      {items.map((step, i) => (
        <div key={i} className="rounded-lg border border-[#ececec] bg-[#fafaf9] p-4">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[#a3a3a3]">
            Steg {i + 1}
          </p>
          <Field label="Tittel">
            <input
              type="text"
              className={inputClass}
              value={step.title}
              onChange={(e) => update(i, { title: e.target.value })}
            />
          </Field>
          <div className="mt-3">
            <Field label="Beskrivelse">
              <textarea
                className={textareaClass}
                value={step.description}
                onChange={(e) => update(i, { description: e.target.value })}
              />
            </Field>
          </div>
          <div className="mt-2 text-right">
            <button
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="text-[12px] font-medium text-[#737373] transition-colors hover:text-red-600"
            >
              Slett steg
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={() => onChange([...items, { title: "", description: "" }])}
        className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-[#d4d4d4] bg-white px-4 py-2 text-[12.5px] font-medium text-[#525252] transition-colors hover:border-[#E57100] hover:text-[#E57100]"
      >
        + Legg til steg
      </button>
    </div>
  );
}

function FaqEditor({ items, onChange }: { items: Faq[]; onChange: (v: Faq[]) => void }) {
  function update(i: number, patch: Partial<Faq>) {
    const next = [...items];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  }
  return (
    <div className="space-y-3">
      {items.map((q, i) => (
        <div key={i} className="rounded-lg border border-[#ececec] bg-[#fafaf9] p-4">
          <Field label="Spørsmål">
            <input
              type="text"
              className={inputClass}
              value={q.question}
              onChange={(e) => update(i, { question: e.target.value })}
            />
          </Field>
          <div className="mt-3">
            <Field label="Svar">
              <textarea
                className={textareaClass}
                value={q.answer}
                onChange={(e) => update(i, { answer: e.target.value })}
              />
            </Field>
          </div>
          <div className="mt-2 text-right">
            <button
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="text-[12px] font-medium text-[#737373] transition-colors hover:text-red-600"
            >
              Slett spørsmål
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={() => onChange([...items, { question: "", answer: "" }])}
        className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-[#d4d4d4] bg-white px-4 py-2 text-[12.5px] font-medium text-[#525252] transition-colors hover:border-[#E57100] hover:text-[#E57100]"
      >
        + Legg til spørsmål
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

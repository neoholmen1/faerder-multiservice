"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { getCurrentSite } from "@/lib/site";
import { getPageDef, type FieldDef } from "@/lib/page-definitions";
import { loadInitialValues, saveValues, sectionKey } from "@/components/admin/inline/save";
import { EditableProvider, useEditable } from "@/components/admin/inline/EditableContext";
import { revalidatePublicSite } from "@/app/actions/revalidate";
import MediaPicker from "@/components/admin/MediaPicker";
import SaveBar from "@/components/admin/SaveBar";
import { Field, inputClass, textareaClass } from "@/components/admin/Field";
import { EditableForsiden } from "./EditableForsiden";
import { EditableOmOss } from "./EditableOmOss";
import { EditableKontakt } from "./EditableKontakt";
import { EditableJobb } from "./EditableJobb";
import { EditablePrisliste } from "./EditablePrisliste";

function InlineEditor({ slug, siteId }: { slug: string; siteId: string }) {
  if (slug === "home") return <EditableForsiden siteId={siteId} />;
  if (slug === "om-oss") return <EditableOmOss siteId={siteId} />;
  if (slug === "kontakt") return <EditableKontakt siteId={siteId} />;
  if (slug === "jobb") return <EditableJobb siteId={siteId} />;
  if (slug === "prisliste") return <EditablePrisliste />;
  return null;
}

function pagePreviewUrl(slug: string): string {
  if (slug === "home") return "/";
  return `/${slug}`;
}

export default function PageEditorRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const def = getPageDef(slug);
  const [siteId, setSiteId] = useState<string | null>(null);
  const [initial, setInitial] = useState<Record<string, string | null> | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const site = await getCurrentSite();
        if (!site) {
          setLoadError("Fant ikke siten 'faerder' i databasen. Kjørte du SQL-migrasjonene?");
          return;
        }
        setSiteId(site.id);
        const values = await loadInitialValues(site.id, slug);
        setInitial(values);
      } catch (e) {
        setLoadError(e instanceof Error ? e.message : "Ukjent feil ved lasting");
      }
    })();
  }, [slug]);

  if (!def) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-[14px] text-[#a3a3a3]">Ukjent side: {slug}</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 p-6">
          <p className="text-[14px] font-semibold text-red-900">Kunne ikke laste siden</p>
          <p className="mt-2 text-[13px] text-red-800">{loadError}</p>
        </div>
      </div>
    );
  }

  if (!siteId || !initial) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#E57100] border-t-transparent" />
      </div>
    );
  }

  const isInline = ["home", "om-oss", "kontakt", "jobb", "prisliste"].includes(slug);

  return (
    <EditorWithSave
      siteId={siteId}
      slug={slug}
      pageName={def.name}
      def={def}
      initial={initial}
      isInline={isInline}
    />
  );
}

function EditorWithSave({
  siteId,
  slug,
  pageName,
  def,
  initial,
  isInline,
}: {
  siteId: string;
  slug: string;
  pageName: string;
  def: NonNullable<ReturnType<typeof getPageDef>>;
  initial: Record<string, string | null>;
  isInline: boolean;
}) {
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const autosave = async (key: string, value: string | null) => {
    setSaving(true);
    setStatus("idle");
    setError(null);
    const r = await saveValues(siteId, slug, { [key]: value });
    if (r.error) {
      setStatus("error");
      setError(r.error);
    } else {
      await revalidatePublicSite();
      setStatus("saved");
    }
    setSaving(false);
  };

  return (
    <EditableProvider initial={initial} onAutoSave={isInline ? autosave : undefined}>
      <Editor
        siteId={siteId}
        slug={slug}
        pageName={pageName}
        def={def}
        isInline={isInline}
        saving={saving}
        setSaving={setSaving}
        status={status}
        setStatus={setStatus}
        error={error}
        setError={setError}
      />
    </EditableProvider>
  );
}

function Editor({
  siteId,
  slug,
  pageName,
  def,
  isInline,
  saving,
  setSaving,
  status,
  setStatus,
  error,
  setError,
}: {
  siteId: string;
  slug: string;
  pageName: string;
  def: NonNullable<ReturnType<typeof getPageDef>>;
  isInline: boolean;
  saving: boolean;
  setSaving: (v: boolean) => void;
  status: "idle" | "saved" | "error";
  setStatus: (v: "idle" | "saved" | "error") => void;
  error: string | null;
  setError: (v: string | null) => void;
}) {
  const router = useRouter();
  const { get, set, dirty, diff, values, reset } = useEditable();
  const liveUrl = pagePreviewUrl(slug);

  async function handleSave() {
    setSaving(true);
    setStatus("idle");
    setError(null);
    const payload = isInline ? values : diff;
    const r = await saveValues(siteId, slug, payload);
    if (r.error) {
      setStatus("error");
      setError(r.error);
    } else {
      await revalidatePublicSite();
      setStatus("saved");
    }
    setSaving(false);
  }

  return (
    <>
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#ececec] bg-white px-6 pb-3 pt-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/nettside"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[#a3a3a3] transition-colors hover:bg-[#fafaf9] hover:text-[#171717]"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          </Link>
          <div>
            <p className="text-[11px] uppercase tracking-[0.1em] text-[#a3a3a3]">Nettside</p>
            <h1 className="text-[17px] font-semibold tracking-tight text-[#171717]">{pageName}</h1>
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
        {["home", "om-oss", "kontakt", "jobb", "prisliste"].includes(slug) ? (
          /* INLINE EDITING — klikk direkte på tekstene */
          <div className="flex-1 overflow-y-auto bg-white">
            <InlineEditor slug={slug} siteId={siteId} />
          </div>
        ) : (
        /* Skjema-fallback for andre sider */
        <div className="mx-auto w-full max-w-3xl overflow-y-auto bg-[#fafaf9]">
          <div className="px-6 py-6 space-y-4">
          {def.hasHero && (
            <Block title="Hero" placement={def.heroPlacement}>
              <Field label="Liten overskrift">
                <input
                  type="text"
                  className={inputClass}
                  value={get("hero_eyebrow") ?? ""}
                  onChange={(e) => set("hero_eyebrow", e.target.value || null)}
                />
              </Field>
              <Field label="Tittel">
                <input
                  type="text"
                  className={inputClass}
                  value={get("hero_title") ?? ""}
                  onChange={(e) => set("hero_title", e.target.value || null)}
                />
              </Field>
              <Field label="Undertekst">
                <textarea
                  className={textareaClass}
                  value={get("hero_subtitle") ?? ""}
                  onChange={(e) => set("hero_subtitle", e.target.value || null)}
                />
              </Field>
              <Field label="Hero-bilde">
                <MediaPicker
                  siteId={siteId}
                  defaultCategory="hero"
                  value={get("hero_image_url")}
                  onChange={(url) => set("hero_image_url", url)}
                  label=""
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Primærknapp tekst">
                  <input
                    type="text"
                    className={inputClass}
                    value={get("hero_cta_primary_label") ?? ""}
                    onChange={(e) => set("hero_cta_primary_label", e.target.value || null)}
                  />
                </Field>
                <Field label="Primærknapp lenke">
                  <input
                    type="text"
                    className={inputClass}
                    value={get("hero_cta_primary_href") ?? ""}
                    onChange={(e) => set("hero_cta_primary_href", e.target.value || null)}
                  />
                </Field>
                <Field label="Sekundærknapp tekst">
                  <input
                    type="text"
                    className={inputClass}
                    value={get("hero_cta_secondary_label") ?? ""}
                    onChange={(e) => set("hero_cta_secondary_label", e.target.value || null)}
                  />
                </Field>
                <Field label="Sekundærknapp lenke">
                  <input
                    type="text"
                    className={inputClass}
                    value={get("hero_cta_secondary_href") ?? ""}
                    onChange={(e) => set("hero_cta_secondary_href", e.target.value || null)}
                  />
                </Field>
              </div>
            </Block>
          )}

          {def.sections?.map((section, idx) => (
            <Block key={`${section.key}-${idx}`} title={section.name} placement={section.placement}>
              {section.repeatOrders ? (
                section.repeatOrders.map((sortOrder) => (
                  <div
                    key={sortOrder}
                    className="rounded-lg border border-[#ececec] bg-[#fafaf9] p-4"
                  >
                    <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-[#a3a3a3]">
                      Element {sortOrder + 1}
                    </p>
                    <div className="space-y-3">
                      {section.fields.map((f) => (
                        <RenderField
                          key={f.key}
                          field={f}
                          siteId={siteId}
                          fieldKey={sectionKey(section.key, f.key, sortOrder)}
                        />
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <>
                  {section.fields.map((f) => (
                    <RenderField
                      key={f.key}
                      field={f}
                      siteId={siteId}
                      fieldKey={sectionKey(section.key, f.key, 0)}
                    />
                  ))}
                </>
              )}
            </Block>
          ))}

          {def.hasSeo && (
            <Block title="SEO" placement="Tittel og beskrivelse for Google og sosiale medier">
              <Field label="Meta-tittel" help="Vises som tittel i søkeresultater. Maks 60 tegn.">
                <input
                  type="text"
                  className={inputClass}
                  value={get("meta_title") ?? ""}
                  onChange={(e) => set("meta_title", e.target.value || null)}
                />
              </Field>
              <Field
                label="Meta-beskrivelse"
                help="Vises under tittelen i søkeresultater. Maks 160 tegn."
              >
                <textarea
                  className={textareaClass}
                  value={get("meta_description") ?? ""}
                  onChange={(e) => set("meta_description", e.target.value || null)}
                />
              </Field>
            </Block>
          )}
          </div>
        </div>
        )}
      </div>

      <SaveBar
        saving={saving}
        status={status}
        error={error}
        dirty={dirty}
        alwaysEnabled={isInline}
        autosaveHint={isInline}
        onSave={handleSave}
        onDiscard={isInline ? undefined : reset}
      />
    </>
  );
}

function Block({
  title,
  placement,
  children,
}: {
  title: string;
  placement?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[#ececec] bg-white p-5">
      <div className="mb-4 border-b border-[#fafaf9] pb-3">
        <h2 className="text-[13.5px] font-semibold tracking-tight text-[#171717]">{title}</h2>
        {placement && <p className="mt-0.5 text-[11px] leading-snug text-[#a3a3a3]">{placement}</p>}
      </div>
      <div className="space-y-3.5">{children}</div>
    </section>
  );
}

function RenderField({
  field,
  siteId,
  fieldKey,
}: {
  field: FieldDef;
  siteId: string;
  fieldKey: string;
}) {
  const { get, set } = useEditable();
  const value = get(fieldKey) ?? "";

  if (field.type === "image") {
    return (
      <Field label={field.label} help={field.help}>
        <MediaPicker
          siteId={siteId}
          defaultCategory="general"
          value={value || null}
          onChange={(url) => set(fieldKey, url)}
          label=""
        />
      </Field>
    );
  }

  if (field.type === "textarea") {
    return (
      <Field label={field.label} help={field.help}>
        <textarea
          className={textareaClass}
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => set(fieldKey, e.target.value)}
        />
      </Field>
    );
  }

  return (
    <Field label={field.label} help={field.help}>
      <input
        type="text"
        className={inputClass}
        placeholder={field.placeholder}
        value={value}
        onChange={(e) => set(fieldKey, e.target.value)}
      />
    </Field>
  );
}

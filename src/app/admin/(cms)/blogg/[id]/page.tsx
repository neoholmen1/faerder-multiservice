"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { getCurrentSite } from "@/lib/site";
import { supabase } from "@/lib/supabase";
import type { BlogPost } from "@/lib/cms";
import { revalidatePublicSite } from "@/app/actions/revalidate";
import MediaPicker from "@/components/admin/MediaPicker";
import SaveBar from "@/components/admin/SaveBar";
import { Field, inputClass, textareaClass } from "@/components/admin/Field";

const MDEditor = dynamic(() => import("@uiw/react-md-editor").then((m) => m.default), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] items-center justify-center rounded-lg border border-[#ececec] bg-[#fafaf9]">
      <p className="text-[13px] text-[#a3a3a3]">Laster editor...</p>
    </div>
  ),
});

export default function BloggEditorRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [siteId, setSiteId] = useState<string | null>(null);
  const [original, setOriginal] = useState<BlogPost | null>(null);
  const [draft, setDraft] = useState<BlogPost | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    (async () => {
      const site = await getCurrentSite();
      if (!site || !supabase) return;
      setSiteId(site.id);
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (data) {
        const post = {
          ...data,
          tags: Array.isArray(data.tags) ? data.tags : [],
        } as BlogPost;
        setOriginal(post);
        setDraft(post);
        setTagsInput(post.tags.join(", "));
      }
    })();
  }, [id]);

  if (!siteId || !draft || !original) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#E8721C] border-t-transparent" />
      </div>
    );
  }

  const dirty = JSON.stringify(draft) !== JSON.stringify(original);

  function update<K extends keyof BlogPost>(key: K, value: BlogPost[K]) {
    setDraft((d) => (d ? { ...d, [key]: value } : d));
  }

  async function handleSave() {
    if (!supabase || !draft) return;
    setSaving(true);
    setStatus("idle");
    setError(null);
    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    const updated = { ...draft, tags };
    const { error } = await supabase
      .from("blog_posts")
      .update({
        slug: updated.slug,
        title: updated.title,
        excerpt: updated.excerpt,
        body: updated.body,
        cover_image_url: updated.cover_image_url,
        tags,
        author_name: updated.author_name,
        published_at: updated.published_at,
        status: updated.status,
        seo_title: updated.seo_title,
        seo_description: updated.seo_description,
      })
      .eq("id", updated.id);
    if (error) {
      setStatus("error");
      setError(error.message);
    } else {
      setOriginal(updated);
      setDraft(updated);
      setStatus("saved");
      await revalidatePublicSite();
      router.refresh();
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!supabase || !draft) return;
    if (!confirm(`Slett innlegget "${draft.title}"? Dette kan ikke angres.`)) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", draft.id);
    if (error) {
      alert("Sletting feilet: " + error.message);
      return;
    }
    await revalidatePublicSite();
    router.push("/admin/blogg");
  }

  return (
    <>
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#ececec] bg-white px-8 pb-3 pt-5">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blogg"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[#a3a3a3] transition-colors hover:bg-[#fafaf9] hover:text-[#171717]"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          </Link>
          <div>
            <p className="text-[11px] uppercase tracking-[0.1em] text-[#a3a3a3]">Blogg</p>
            <h1 className="truncate text-[18px] font-semibold tracking-tight text-[#171717]">
              {draft.title || "Uten tittel"}
            </h1>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium text-[#737373] transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={2} /> Slett
        </button>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto bg-[#fafaf9]">
        <div className="mx-auto w-full max-w-3xl px-8 py-8 space-y-6">
          <Section title="Status">
            <Field label="Publisert">
              <select
                className={inputClass}
                value={draft.status}
                onChange={(e) => update("status", e.target.value as "draft" | "published")}
              >
                <option value="draft">Utkast (skjult)</option>
                <option value="published">Publisert</option>
              </select>
            </Field>
            <Field label="Publiseringsdato" help="ISO-format. La stå tom for utkast.">
              <input
                type="datetime-local"
                className={inputClass}
                value={
                  draft.published_at
                    ? new Date(draft.published_at).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  update(
                    "published_at",
                    e.target.value ? new Date(e.target.value).toISOString() : null,
                  )
                }
              />
            </Field>
          </Section>

          <Section title="Hoved-innhold">
            <Field label="Tittel">
              <input
                type="text"
                className={inputClass}
                value={draft.title}
                onChange={(e) => update("title", e.target.value)}
              />
            </Field>
            <Field label="Slug" help="URL-vennlig versjon av tittelen.">
              <input
                type="text"
                className={inputClass}
                value={draft.slug}
                onChange={(e) => update("slug", e.target.value)}
              />
            </Field>
            <Field label="Ingress" help="Vises i listen og som intro på toppen.">
              <textarea
                className={textareaClass}
                value={draft.excerpt}
                onChange={(e) => update("excerpt", e.target.value)}
              />
            </Field>
            <Field label="Tags" help="Komma-separert. F.eks. Tips, Flyttevask">
              <input
                type="text"
                className={inputClass}
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
            </Field>
            <Field label="Forfatter">
              <input
                type="text"
                className={inputClass}
                value={draft.author_name}
                onChange={(e) => update("author_name", e.target.value)}
              />
            </Field>
            <Field label="Cover-bilde">
              <MediaPicker
                siteId={siteId}
                defaultCategory="blog"
                value={draft.cover_image_url}
                onChange={(url) => update("cover_image_url", url)}
                label=""
              />
            </Field>
          </Section>

          <Section title="Brødtekst" description="Bruk markdown eller HTML.">
            <div data-color-mode="light">
              <MDEditor
                value={draft.body}
                onChange={(v) => update("body", v ?? "")}
                height={500}
                preview="edit"
              />
            </div>
          </Section>

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
        dirty={dirty || tagsInput !== original.tags.join(", ")}
        onSave={handleSave}
        onDiscard={() => {
          setDraft(original);
          setTagsInput(original.tags.join(", "));
        }}
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

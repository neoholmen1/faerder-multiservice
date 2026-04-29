"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, ChevronRight } from "lucide-react";
import { getCurrentSite } from "@/lib/site";
import { supabase } from "@/lib/supabase";
import type { BlogPost } from "@/lib/cms";
import PageHeader from "@/components/admin/PageHeader";

export default function BloggListPage() {
  const router = useRouter();
  const [siteId, setSiteId] = useState<string | null>(null);
  const [posts, setPosts] = useState<BlogPost[] | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    (async () => {
      const site = await getCurrentSite();
      if (!site) {
        setPosts([]);
        return;
      }
      setSiteId(site.id);
      if (!supabase) {
        setPosts([]);
        return;
      }
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("site_id", site.id)
        .order("published_at", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false });
      setPosts((data ?? []) as BlogPost[]);
    })();
  }, []);

  async function handleCreate() {
    if (!siteId || !supabase) return;
    setCreating(true);
    const slug = `nytt-innlegg-${Date.now()}`;
    const { data, error } = await supabase
      .from("blog_posts")
      .insert({
        site_id: siteId,
        slug,
        title: "Nytt innlegg (uten tittel)",
        excerpt: "",
        body: "",
        tags: [],
        status: "draft",
      })
      .select()
      .single();
    setCreating(false);
    if (error) {
      alert("Kunne ikke opprette: " + error.message);
      return;
    }
    if (data) router.push(`/admin/blogg/${data.id}`);
  }

  return (
    <>
      <PageHeader
        title="Blogg"
        subtitle="Skriv innlegg og publiser når du er klar."
        actions={
          <button
            onClick={handleCreate}
            disabled={creating || !siteId}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#171717] px-4 py-2 text-[12.5px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition-all hover:bg-[#000] disabled:opacity-60"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
            {creating ? "Oppretter..." : "Nytt innlegg"}
          </button>
        }
      />
      <div className="flex-1 overflow-y-auto bg-[#fafaf9] px-8 py-7">
        {posts === null ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#E8721C] border-t-transparent" />
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#d4d4d4] bg-white p-8 text-center">
            <p className="text-[14px] text-[#737373]">
              Ingen innlegg enda. Klikk &laquo;Nytt innlegg&raquo; for å starte.
            </p>
          </div>
        ) : (
          <div className="grid max-w-4xl gap-3">
            {posts.map((p) => (
              <Link
                key={p.id}
                href={`/admin/blogg/${p.id}`}
                className="group flex items-center gap-4 rounded-xl border border-[#ececec] bg-white p-4 transition-all duration-150 hover:border-[#E8721C] hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)]"
              >
                {p.cover_image_url ? (
                  <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-[#fafaf9]">
                    <Image
                      src={p.cover_image_url}
                      alt=""
                      fill
                      sizes="80px"
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-14 w-20 shrink-0 rounded-lg bg-[#fafaf9]" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-[14.5px] font-semibold tracking-tight text-[#171717]">
                      {p.title}
                    </h3>
                    {p.status === "draft" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                        Utkast
                      </span>
                    )}
                    {p.status === "published" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                        Publisert
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-[12.5px] text-[#737373]">{p.excerpt}</p>
                </div>
                <ChevronRight
                  className="h-4 w-4 shrink-0 text-[#a3a3a3] transition-transform group-hover:translate-x-0.5 group-hover:text-[#E8721C]"
                  strokeWidth={2}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

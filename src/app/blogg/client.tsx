"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/DarkHero";
import { SectionReveal } from "@/components/SectionReveal";

export type BlogCard = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  tags: string[];
};

export default function BlogClient({ posts }: { posts: BlogCard[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const p of posts) for (const t of p.tags) set.add(t);
    return Array.from(set);
  }, [posts]);

  const filtered = activeTag ? posts.filter((p) => p.tags.includes(activeTag)) : posts;

  return (
    <>
      <PageHero
        label="Blogg"
        title="Tips og råd"
        subtitle="Alt du trenger å vite om renhold, vedlikehold og et renere hjem."
      />

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-[1200px] px-6">
          {/* Tag filters */}
          <SectionReveal>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTag(null)}
                className={`rounded-full border px-5 py-2.5 text-[13px] font-medium transition-all duration-200 ${
                  activeTag === null
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-gray-200 text-text-secondary hover:border-gray-300 hover:text-text"
                }`}
              >
                Alle
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`rounded-full border px-5 py-2.5 text-[13px] font-medium transition-all duration-200 ${
                    activeTag === tag
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-gray-200 text-text-secondary hover:border-gray-300 hover:text-text"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </SectionReveal>

          {/* Grid */}
          <SectionReveal className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post) => (
              <Link
                key={post.slug}
                href={`/blogg/${post.slug}`}
                className="blog-card group overflow-hidden rounded-[16px] bg-white"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={600}
                    height={338}
                    quality={90}
                    loading="lazy"
                    className="blog-card-image h-full w-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[#f0eeeb] px-2.5 py-0.5 text-[0.72rem] font-medium text-text-secondary"
                      >
                        {tag}
                      </span>
                    ))}
                    <span className="ml-auto text-[0.78rem] text-[#9CA3AF]">
                      {post.date}
                    </span>
                  </div>
                  <h3 className="mt-3 text-[1.15rem] leading-snug text-text">
                    {post.title}
                  </h3>
                </div>
              </Link>
            ))}
          </SectionReveal>
        </div>
      </section>
    </>
  );
}

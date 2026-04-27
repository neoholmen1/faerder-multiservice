import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Phone, ArrowLeft } from "lucide-react";
import { blogPosts, getBlogPostBySlug } from "@/data/blog";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.seoTitle,
    description: post.seoDescription,
    alternates: { canonical: `/blogg/${post.slug}` },
    openGraph: {
      title: post.seoTitle,
      description: post.seoDescription,
      url: `/blogg/${post.slug}`,
      type: "article",
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  // Related posts: all other posts, exclude current
  const related = blogPosts.filter((p) => p.slug !== post.slug);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Hjem", href: "/" },
          { name: "Blogg", href: "/blogg" },
          { name: post.title, href: `/blogg/${post.slug}` },
        ]}
      />

      {/* Header area */}
      <section className="bg-[#faf8f5] pt-32 pb-16 lg:pt-40 lg:pb-20">
        <div className="mx-auto max-w-[680px] px-6">
          <Link
            href="/blogg"
            className="inline-flex items-center gap-1.5 text-[13px] text-text-secondary transition-colors duration-150 hover:text-primary"
          >
            <ArrowLeft size={14} /> Tilbake til bloggen
          </Link>

          <h1 className="mt-8 text-[clamp(2rem,4vw,2.8rem)] leading-[1.1] tracking-[-0.02em] text-text">
            {post.title}
          </h1>

          <div className="mt-5 flex items-center gap-3">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#f0eeeb] px-3 py-1 text-[0.75rem] font-medium text-text-secondary"
              >
                {tag}
              </span>
            ))}
            <span className="text-[0.8rem] text-[#9CA3AF]">{post.date}</span>
          </div>
        </div>
      </section>

      {/* Hero image */}
      <div className="mx-auto max-w-[680px] px-6">
        <div className="-mt-2 overflow-hidden rounded-[16px]">
          <Image
            src={post.image}
            alt={post.title}
            width={680}
            height={383}
            quality={90}
            className="aspect-[16/9] w-full object-cover"
          />
        </div>
      </div>

      {/* Article body */}
      <article className="mx-auto max-w-[680px] px-6 py-12 lg:py-16">
        <div
          className="prose-custom"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {/* Related articles */}
      {related.length > 0 && (
        <section className="border-t border-black/[0.06] py-16 lg:py-20">
          <div className="mx-auto max-w-[1000px] px-6">
            <h2 className="text-[1.5rem] tracking-[-0.02em] text-text">
              Andre artikler
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blogg/${r.slug}`}
                  className="blog-card group overflow-hidden rounded-[16px] bg-white"
                >
                  <div className="aspect-[16/9] overflow-hidden">
                    <Image
                      src={r.image}
                      alt={r.title}
                      width={400}
                      height={225}
                      quality={90}
                      loading="lazy"
                      className="blog-card-image h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2">
                      {r.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-[#f0eeeb] px-2.5 py-0.5 text-[0.72rem] font-medium text-text-secondary"
                        >
                          {tag}
                        </span>
                      ))}
                      <span className="ml-auto text-[0.78rem] text-[#9CA3AF]">
                        {r.date}
                      </span>
                    </div>
                    <h3 className="mt-3 text-[1.05rem] leading-snug text-text">
                      {r.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="py-16 lg:py-20" style={{ background: "linear-gradient(180deg, #fdf6ef, #faf0e4)" }}>
        <div className="mx-auto max-w-[680px] px-6 text-center">
          <h2 className="text-[clamp(1.5rem,3vw,2rem)] tracking-[-0.02em] text-text">
            Trenger du hjelp med renhold?
          </h2>
          <p className="mt-3 text-[15px] text-text-secondary">
            Send en melding eller ring. Vi svarer samme dag — senest neste virkedag.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/kontakt"
              className="btn-glow inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-[15px] font-semibold text-white"
            >
              Få tilbud <ArrowRight size={16} />
            </Link>
            <a
              href="tel:+4796823647"
              className="btn-outline inline-flex items-center gap-2 rounded-full border-2 border-gray-300 px-8 py-4 text-[15px] font-medium text-text-secondary hover:border-gray-400 hover:text-text"
            >
              <Phone size={15} /> 968 23 647
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

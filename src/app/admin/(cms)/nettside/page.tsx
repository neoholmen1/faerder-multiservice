"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PAGE_DEFINITIONS } from "@/lib/page-definitions";
import PageHeader from "@/components/admin/PageHeader";

export default function NettsidePage() {
  return (
    <>
      <PageHeader
        title="Nettside"
        subtitle="Rediger tekst og bilder på alle sider av nettsiden."
      />
      <div className="flex-1 overflow-y-auto bg-[#fafaf9] px-8 py-7">
        <div className="grid max-w-4xl gap-3">
          {PAGE_DEFINITIONS.map((p) => (
            <Link
              key={p.slug}
              href={`/admin/nettside/${p.slug}`}
              className="group flex items-center justify-between gap-4 rounded-xl border border-[#ececec] bg-white px-5 py-4 transition-all duration-150 hover:border-[#E8721C] hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)]"
            >
              <div className="min-w-0">
                <h3 className="text-[15px] font-semibold tracking-tight text-[#171717]">
                  {p.name}
                </h3>
                <p className="mt-0.5 text-[12.5px] text-[#737373]">
                  {p.hasHero && "Hero · "}
                  {p.sections?.length ?? 0} seksjon{p.sections?.length === 1 ? "" : "er"}
                  {p.hasSeo && " · SEO"}
                </p>
              </div>
              <ChevronRight
                className="h-4 w-4 text-[#a3a3a3] transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-[#E8721C]"
                strokeWidth={2}
              />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Eye, EyeOff } from "lucide-react";
import { getCurrentSite } from "@/lib/site";
import { getServices, type Service } from "@/lib/cms";
import PageHeader from "@/components/admin/PageHeader";

export default function TjenesterListPage() {
  const [services, setServices] = useState<Service[] | null>(null);

  useEffect(() => {
    (async () => {
      const site = await getCurrentSite();
      if (!site) {
        setServices([]);
        return;
      }
      const list = await getServices(site.id);
      setServices(list);
    })();
  }, []);

  return (
    <>
      <PageHeader
        title="Tjenester"
        subtitle="Rediger tjenestebeskrivelser, priser og bilder."
      />
      <div className="flex-1 overflow-y-auto bg-[#fafaf9] px-8 py-7">
        {services === null ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#E8721C] border-t-transparent" />
          </div>
        ) : services.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#d4d4d4] bg-white p-8 text-center">
            <p className="text-[14px] text-[#737373]">
              Ingen tjenester funnet. Kjør SQL-migrasjonene for å seede inn de 9 tjenestene.
            </p>
          </div>
        ) : (
          <div className="grid max-w-4xl gap-3">
            {services.map((s) => (
              <Link
                key={s.slug}
                href={`/admin/tjenester/${s.slug}`}
                className="group flex items-center gap-4 rounded-xl border border-[#ececec] bg-white p-4 transition-all duration-150 hover:border-[#E8721C] hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)]"
              >
                {s.image_url ? (
                  <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-[#fafaf9]">
                    <Image src={s.image_url} alt="" fill sizes="80px" unoptimized className="object-cover" />
                  </div>
                ) : (
                  <div className="h-14 w-20 shrink-0 rounded-lg bg-[#fafaf9]" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-[14.5px] font-semibold tracking-tight text-[#171717]">
                      {s.name}
                    </h3>
                    {!s.published && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                        <EyeOff className="h-3 w-3" /> Skjult
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-[12.5px] text-[#737373]">
                    {s.short_description}
                  </p>
                  <p className="mt-0.5 text-[12.5px] font-medium text-[#E8721C]">{s.price_label}</p>
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

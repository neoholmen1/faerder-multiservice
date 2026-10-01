"use client";

import Image from "next/image";
import { Users, Briefcase, Clock } from "lucide-react";
import EditableText from "@/components/admin/inline/EditableText";
import EditableImage from "@/components/admin/inline/EditableImage";
import { sectionKey } from "@/components/admin/inline/save";

export function EditableJobb({ siteId }: { siteId: string }) {
  return (
    <div className="min-h-full bg-white">
      {/* HERO */}
      <section className="bg-[#faf8f5] pt-20 pb-12 lg:pt-24 lg:pb-16">
        <div className="mx-auto max-w-[1200px] px-6 text-center">
          <EditableText
            fieldKey={sectionKey("hero", "eyebrow", 0)}
            fallback="Karriere"
            as="p"
            className="text-[13px] font-medium tracking-widest text-primary uppercase"
          />
          <EditableText
            fieldKey={sectionKey("hero", "title", 0)}
            fallback="Bli en del av teamet"
            as="h1"
            className="mt-5 text-[clamp(2.25rem,5vw,4rem)] leading-[1.05] tracking-[-0.02em] text-text"
          />
          <EditableText
            fieldKey={sectionKey("hero", "subtitle", 0)}
            fallback="Vi er alltid på utkikk etter flinke folk."
            as="p"
            className="mx-auto mt-5 max-w-lg text-[17px] font-light text-text-secondary"
          />
        </div>
      </section>

      {/* TEAM-bilde + sitat */}
      <section className="py-10 lg:py-14">
        <div className="mx-auto max-w-[800px] px-6">
          <EditableImage
            fieldKey={sectionKey("team", "image_url", 0)}
            siteId={siteId}
            defaultCategory="team"
            fallback="/images/team-jobb.webp"
          >
            {(url) => (
              <div className="relative aspect-[7/4] w-full overflow-hidden rounded-2xl shadow-sm">
                <Image
                  src={url ?? "/images/team-jobb.webp"}
                  alt="Teamet i Færder Multiservice"
                  fill
                  sizes="(max-width: 768px) 100vw, 700px"
                  className="object-cover"
                />
                <span className="absolute bottom-4 right-4 rounded-full bg-white px-3 py-1 text-sm font-semibold text-primary shadow">
                  Et etablert team
                </span>
              </div>
            )}
          </EditableImage>

          <blockquote className="mx-auto mt-10 max-w-lg border-l-4 border-primary pl-6">
            <EditableText
              fieldKey={sectionKey("sitat", "quote", 0)}
              fallback="Vi ønsker oss alltid nye og trivelige kollegaer i Færder Multiservice."
              as="p"
              className="text-[17px] leading-[1.7] text-text-secondary italic"
              multiline
            />
            <EditableText
              fieldKey={sectionKey("sitat", "author", 0)}
              fallback="— Aleksandra, daglig leder og eier"
              as="footer"
              className="mt-3 text-[14px] font-semibold text-text"
            />
          </blockquote>
        </div>
      </section>

      {/* FORDELER */}
      <section className="bg-[#f5f5f7] py-12 lg:py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="text-center">
            <EditableText
              fieldKey={sectionKey("fordeler", "eyebrow", 0)}
              fallback="Fordeler"
              as="p"
              className="text-[13px] font-medium tracking-widest text-primary uppercase"
            />
            <EditableText
              fieldKey={sectionKey("fordeler", "title", 0)}
              fallback="Hvorfor jobbe hos oss"
              as="h2"
              className="mt-5 text-[clamp(1.75rem,4vw,3rem)] tracking-[-0.02em] leading-[1.1] text-text"
            />
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {[0, 1, 2].map((i) => {
              const icons = [Users, Briefcase, Clock];
              const colors = [
                "text-blue-600 bg-blue-50",
                "text-emerald-600 bg-emerald-50",
                "text-amber-600 bg-amber-50",
              ];
              const Icon = icons[i];
              return (
                <div key={i} className="rounded-3xl bg-white p-7 shadow-sm">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${colors[i]}`}>
                    <Icon size={24} strokeWidth={1.5} />
                  </div>
                  <EditableText
                    fieldKey={sectionKey("fordeler", "card_title", i)}
                    fallback={["Godt miljø", "God lønn", "Fleksible tider"][i]}
                    as="h3"
                    className="mt-6 text-[18px] tracking-[-0.02em] text-text"
                  />
                  <EditableText
                    fieldKey={sectionKey("fordeler", "card_text", i)}
                    fallback={
                      [
                        "Vi er et tett team. God stemning og folk som bryr seg.",
                        "Vi betaler godt. Gjør du en bra jobb, merker du det.",
                        "Vi finner tider som passer. Hverdagen skal gå opp.",
                      ][i]
                    }
                    as="p"
                    className="mt-2 text-[14.5px] leading-[1.6] text-text-secondary"
                    multiline
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SØKNAD */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-2xl px-6">
          <div className="text-center">
            <EditableText
              fieldKey={sectionKey("soknad", "eyebrow", 0)}
              fallback="Søk"
              as="p"
              className="text-[13px] font-medium tracking-widest text-primary uppercase"
            />
            <EditableText
              fieldKey={sectionKey("soknad", "title", 0)}
              fallback="Høres bra ut? Si hei!"
              as="h2"
              className="mt-5 text-[clamp(1.75rem,4vw,3rem)] tracking-[-0.02em] leading-[1.1] text-text"
            />
          </div>
          <div className="mt-10 space-y-4 rounded-xl bg-[#fafaf9] p-5 ring-1 ring-black/[0.04]">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="h-12 rounded-xl border border-gray-200 bg-background-warm px-4 py-3 text-[14px] text-text-secondary">Navn *</div>
              <div className="h-12 rounded-xl border border-gray-200 bg-background-warm px-4 py-3 text-[14px] text-text-secondary">E-post *</div>
            </div>
            <div className="h-12 rounded-xl border border-gray-200 bg-background-warm px-4 py-3 text-[14px] text-text-secondary">Telefon *</div>
            <div className="h-24 rounded-xl border border-gray-200 bg-background-warm px-4 py-3 text-[14px] text-text-secondary">Melding</div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-[14px] font-semibold text-white">
              Send søknad
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

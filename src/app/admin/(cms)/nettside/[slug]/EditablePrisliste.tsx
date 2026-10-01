"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowRight, Phone } from "lucide-react";
import EditableText from "@/components/admin/inline/EditableText";
import { EditableField } from "@/components/admin/inline/EditableField";
import { sectionKey } from "@/components/admin/inline/save";
import { getServices, type Service } from "@/lib/cms";
import { getCurrentSite } from "@/lib/site";
import { supabase } from "@/lib/supabase";
import { revalidatePublicSite } from "@/app/actions/revalidate";

export function EditablePrisliste() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    (async () => {
      const site = await getCurrentSite();
      if (!site) return;
      const list = await getServices(site.id);
      setServices(list.filter((s) => s.visible_on_pricelist));
    })();
  }, []);

  const saveServiceField = useCallback(
    async (id: string, field: "name" | "short_description" | "price_label", next: string) => {
      if (!supabase) {
        alert("Database er ikke konfigurert.");
        return;
      }
      const { error } = await supabase.from("services").update({ [field]: next }).eq("id", id);
      if (error) {
        alert(`Kunne ikke lagre: ${error.message}`);
        return;
      }
      setServices((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: next } : s)));
      await revalidatePublicSite();
    },
    [],
  );

  return (
    <div className="min-h-full bg-white">
      {/* HERO */}
      <section className="bg-[#faf8f5] pt-20 pb-12 lg:pt-24 lg:pb-16">
        <div className="mx-auto max-w-[1200px] px-6 text-center">
          <EditableText
            fieldKey={sectionKey("hero", "eyebrow", 0)}
            fallback="Priser"
            as="p"
            className="text-[13px] font-medium tracking-widest text-primary uppercase"
          />
          <EditableText
            fieldKey={sectionKey("hero", "title", 0)}
            fallback="Hva koster det?"
            as="h1"
            className="mt-5 text-[clamp(2.25rem,5vw,4rem)] leading-[1.05] tracking-[-0.02em] text-text"
          />
          <EditableText
            fieldKey={sectionKey("hero", "subtitle", 0)}
            fallback="Her ser du prisene våre. Ingen skjulte kostnader — du vet hva du betaler."
            as="p"
            className="mx-auto mt-5 max-w-lg text-[17px] font-light text-text-secondary"
            multiline
          />
        </div>
      </section>

      {/* PRISLISTE — direkte redigerbar */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-[900px] px-6">
          <div className="space-y-3">
            {services.length === 0 ? (
              <p className="text-center text-[13.5px] text-text-secondary">Laster tjenester...</p>
            ) : (
              services.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
                >
                  <div className="min-w-0 flex-1">
                    <EditableField
                      value={s.name}
                      onSave={(next) => saveServiceField(s.id, "name", next)}
                      as="h2"
                      className="text-[18px] font-bold tracking-[-0.02em] text-text"
                    />
                    <EditableField
                      value={s.short_description}
                      onSave={(next) => saveServiceField(s.id, "short_description", next)}
                      as="p"
                      multiline
                      className="mt-1 text-[14px] text-text-secondary"
                    />
                  </div>
                  <EditableField
                    value={s.price_label}
                    onSave={(next) => saveServiceField(s.id, "price_label", next)}
                    as="p"
                    className="shrink-0 text-[16px] font-bold text-primary"
                  />
                </div>
              ))
            )}
          </div>
          <p className="mt-4 text-center text-[12px] text-text-secondary">
            Klikk direkte på tekst eller pris for å redigere — lagres automatisk
          </p>

          <div className="mt-7 text-center">
            <EditableText
              fieldKey={sectionKey("disclaimer", "text", 0)}
              fallback="Alle priser er inkl. mva. Endelig pris avhenger av boligens størrelse og tilstand."
              as="p"
              className="text-[13.5px] text-text-secondary"
              multiline
            />
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="border-t border-gray-100 py-12 lg:py-16" style={{ background: "linear-gradient(180deg, #fdf6ef, #faf0e4)" }}>
        <div className="mx-auto max-w-3xl px-6 text-center">
          <EditableText
            fieldKey={sectionKey("cta_final", "title", 0)}
            fallback="Vil du ha en nøyaktig pris?"
            as="h2"
            className="text-[clamp(1.5rem,3vw,2rem)] tracking-[-0.02em] text-text"
          />
          <EditableText
            fieldKey={sectionKey("cta_final", "body", 0)}
            fallback="Send oss en melding eller ring. Vi gir deg et tilbud samme dag — senest neste virkedag."
            as="p"
            className="mt-3 text-[15px] text-text-secondary"
            multiline
          />
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-[14.5px] font-semibold text-white">
              Få tilbud <ArrowRight size={16} />
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-gray-300 px-7 py-3.5 text-[14.5px] font-medium text-text-secondary">
              <Phone size={15} /> 968 23 647
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

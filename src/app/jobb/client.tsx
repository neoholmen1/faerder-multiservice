"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Briefcase, Users, Clock, ArrowRight, Check } from "lucide-react";
import { PageHero } from "@/components/DarkHero";
import { SectionReveal } from "@/components/SectionReveal";

export default function JobbClient() {
  const [fields, setFields] = useState({
    navn: "",
    epost: "",
    telefon: "",
    melding: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const update = useCallback((name: string, value: string) => {
    setFields((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <>
      <PageHero
        label="Karriere"
        title="Bli en del av teamet"
        subtitle="Vi ser alltid etter dyktige folk som vil gjøre en forskjell."
      />

      {/* Team hero image */}
      <section className="py-16 lg:py-20">
        <SectionReveal className="mx-auto max-w-[800px] px-6">
          <div className="photo-frame mx-auto max-w-[700px]">
            <div className="photo-frame-bg" />
            <Image
              src="/images/team-jobb.webp"
              alt="Teamet i Færder Multiservice på jobb i Vestfold"
              width={700}
              height={450}
              quality={85}
              sizes="(max-width: 768px) 100vw, 700px"
              className="w-full"
            />
            <span className="absolute bottom-4 right-4 z-10 rounded-full bg-white px-3 py-1 text-sm font-semibold text-primary shadow-md">
              11+ ansatte
            </span>
          </div>
          <blockquote className="mx-auto mt-10 max-w-lg border-l-4 border-primary pl-6">
            <p className="text-[17px] leading-[1.7] text-text-secondary italic">
              &ldquo;Vi ønsker oss alltid nye og trivelige kollegaer i Færder Multiservice.&rdquo;
            </p>
            <footer className="mt-3 text-[14px] font-semibold text-text">
              — Aleksandra, daglig leder og eier
            </footer>
          </blockquote>
        </SectionReveal>
      </section>

      <section className="bg-background-warm py-24 lg:py-32">
        <div className="mx-auto max-w-[1200px] px-6">
          <SectionReveal className="text-center">
            <p className="text-[13px] font-medium tracking-widest text-primary uppercase">
              Fordeler
            </p>
            <h2 className="mt-4 text-[clamp(1.75rem,4vw,3rem)] font-bold tracking-[-0.03em] leading-[1.1] text-text">
              Hvorfor jobbe hos oss
            </h2>
          </SectionReveal>

          <SectionReveal className="mt-16 grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: Users,
                title: "Godt arbeidsmiljø",
                text: "Vi er et tett team som støtter hverandre. God stemning på jobb, hver dag.",
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                icon: Briefcase,
                title: "Konkurransedyktig lønn",
                text: "Vi verdsetter godt arbeid og tilbyr konkurransedyktige betingelser.",
                color: "text-emerald-600",
                bg: "bg-emerald-50",
              },
              {
                icon: Clock,
                title: "Fleksible arbeidstider",
                text: "Vi tilpasser arbeidstidene slik at det fungerer for alle i teamet.",
                color: "text-amber-600",
                bg: "bg-amber-50",
              },
            ].map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="feature-card group rounded-3xl border border-gray-100/80 bg-white p-8 lg:p-10"
                >
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${v.bg} transition-transform duration-500 group-hover:scale-110`}>
                    <Icon size={26} strokeWidth={1.5} className={v.color} />
                  </div>
                  <h3 className="mt-7 text-[19px] font-semibold tracking-[-0.02em] text-text">
                    {v.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-[1.7] text-text-secondary">
                    {v.text}
                  </p>
                </div>
              );
            })}
          </SectionReveal>
        </div>
      </section>

      <section className="py-24 lg:py-32">
        <SectionReveal className="mx-auto max-w-2xl px-6">
          <div className="text-center">
            <p className="text-[13px] font-medium tracking-widest text-primary uppercase">
              Søk
            </p>
            <h2 className="mt-4 text-[clamp(1.75rem,4vw,3rem)] font-bold tracking-[-0.03em] leading-[1.1] text-text">
              Interessert? Send oss en melding.
            </h2>
          </div>

          <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-5 sm:grid-cols-2">
              {[
                { id: "jobb-navn", label: "Navn *", name: "navn", type: "text" },
                { id: "jobb-epost", label: "E-post *", name: "epost", type: "email" },
              ].map((f) => (
                <div key={f.id} className="float-field">
                  <input
                    id={f.id}
                    type={f.type}
                    required
                    placeholder=" "
                    value={fields[f.name as keyof typeof fields]}
                    onChange={(e) => update(f.name, e.target.value)}
                    className="h-14 w-full rounded-xl border border-gray-200 bg-background-warm px-4 text-[15px] text-text outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                  <label htmlFor={f.id}>{f.label}</label>
                </div>
              ))}
            </div>
            <div className="float-field">
              <input
                id="jobb-telefon"
                type="tel"
                required
                placeholder=" "
                value={fields.telefon}
                onChange={(e) => update("telefon", e.target.value)}
                className="h-14 w-full rounded-xl border border-gray-200 bg-background-warm px-4 text-[15px] text-text outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
              <label htmlFor="jobb-telefon">Telefon *</label>
            </div>
            <div className="float-field">
              <textarea
                id="jobb-melding"
                rows={5}
                placeholder=" "
                value={fields.melding}
                onChange={(e) => update("melding", e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-background-warm px-4 pt-7 pb-3 text-[15px] text-text outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
              <label htmlFor="jobb-melding">Melding</label>
            </div>
            <button
              type="submit"
              className={`btn-glow inline-flex items-center gap-2 rounded-full px-8 py-4 text-[15px] font-semibold text-white transition-all duration-300 ${
                submitted ? "btn-success bg-emerald-500" : "bg-primary hover:bg-primary-dark"
              }`}
            >
              {submitted ? (
                <><Check size={16} /> Sendt!</>
              ) : (
                <><span>Send søknad</span> <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-[15px] text-text-secondary">
            Du kan også sende CV direkte til{" "}
            <a
              href="mailto:post@faerdermultiservice.no"
              className="font-medium text-primary transition-opacity duration-200 hover:opacity-70"
            >
              post@faerdermultiservice.no
            </a>
          </p>
        </SectionReveal>
      </section>
    </>
  );
}

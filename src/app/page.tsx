"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Sparkles, Truck, Building2, HardHat, Wind,
  Droplets, Home, Eye, Users, ShieldCheck, Leaf,
  MapPin, Phone, ArrowRight, ArrowDown, Handshake, Check, Star,
} from "lucide-react";
import Image from "next/image";
import { trackEvent } from "@/lib/tracking";
import { copyAndToast } from "@/lib/toast";
import { useFadeIn } from "@/hooks/useFadeIn";
import { useCountUp } from "@/hooks/useCountUp";
import { MagneticLink } from "@/components/MagneticButton";
import { ScrollProgress } from "@/components/ScrollProgress";
import { testimonials } from "@/data/testimonials";

const tjenester = [
  { name: "Fast vask", pris: "350 kr/t", slug: "fast-vask", icon: Sparkles, popular: true },
  { name: "Flyttevask", pris: "3 500 kr", slug: "flyttevask", icon: Truck },
  { name: "Kontorvask", pris: "Avtale", slug: "kontorvask", icon: Building2 },
  { name: "Byggvask", pris: "400 kr/t", slug: "byggvask", icon: HardHat },
  { name: "Spesialvask", pris: "350 kr/t", slug: "spesialvask", icon: Wind },
  { name: "Luktsanering", pris: "Befaring", slug: "luktsanering", icon: Droplets },
  { name: "Hovedrengjøring", pris: "450 kr/t", slug: "hovedrengjoring", icon: Home },
  { name: "Visningsvask", pris: "2 500 kr", slug: "visningsvask", icon: Eye },
  { name: "Borettslag", pris: "Avtale", slug: "borettslag", icon: Users },
];

/* ── Kundeanmeldelser ── */
function Kundeanmeldelser() {
  const ref = useFadeIn<HTMLElement>();
  const gridRef = useFadeIn<HTMLDivElement>();
  const lineRef = useRef<HTMLSpanElement>(null);
  const [lineVisible, setLineVisible] = useState(false);

  useEffect(() => {
    const el = lineRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setLineVisible(true); obs.disconnect(); } },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-[1200px] px-6">
        <div ref={ref} className="reveal text-center">
          <p className="text-[13px] font-medium tracking-widest text-primary uppercase">
            Kundeanmeldelser
          </p>
          <h2
            className="mt-4 text-[clamp(2rem,4vw,3.25rem)] font-bold tracking-[-0.03em] leading-[1.1] text-text"
          >
            92% av kundene våre er fra anbefaling
          </h2>
          {/* Animated orange underline */}
          <span
            ref={lineRef}
            className="mx-auto mt-4 block h-[3px] w-16 rounded-full bg-primary transition-transform duration-700 ease-out"
            style={{ transform: lineVisible ? "scaleX(1)" : "scaleX(0)" }}
          />
          <p className="mx-auto mt-4 max-w-md text-[17px] leading-[1.7] text-text-secondary">
            Det sier mer enn noe vi kan skrive selv.
          </p>
        </div>

        {/* Grid layout — 2 cols on tablet, 4 on desktop */}
        <div ref={gridRef} className="reveal-stagger mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="group relative rounded-2xl border border-gray-200 bg-white p-7 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_8px_30px_rgba(232,114,28,0.08)]"
            >
              {/* Large decorative quote mark */}
              <span className="absolute top-4 right-5 text-[4rem] leading-none font-serif text-primary/[0.06] select-none transition-all duration-500 group-hover:text-primary/[0.12]">
                &rdquo;
              </span>

              {/* Stars — pop in with stagger */}
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star
                    key={j}
                    size={16}
                    className="fill-primary text-primary star-pop"
                    style={{ animationDelay: `${0.6 + i * 0.15 + j * 0.06}s` }}
                  />
                ))}
              </div>

              {/* Orange top accent — animates width on hover */}
              <span className="absolute top-0 left-6 right-6 h-[2px] rounded-full bg-primary/30 transition-all duration-500 group-hover:left-4 group-hover:right-4 group-hover:bg-primary/60" />

              {/* Quote */}
              <p className="relative mt-4 text-[15px] leading-[1.7] text-text">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div className="mt-5">
                <p className="text-[14px] font-semibold text-text">{t.name}</p>
                <p className="text-[13px] text-text-secondary">{t.date} · {t.location}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom link */}
        <div className="mt-10 text-center">
          <Link
            href="/kontakt"
            className="inline-flex items-center gap-2 text-[15px] font-semibold text-primary transition-colors duration-150 hover:text-primary/80"
          >
            Vi kommer gjerne på uforpliktende befaring — helt kostnadsfritt <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// TODO: Legg til før/etter-slider når kunden leverer ekte bilder

/* ── Slik fungerer det ── */
const stegData = [
  {
    nr: "01",
    tittel: "Fortell oss hva du trenger",
    tekst: "Bruk priskalkulatoren eller send oss en melding. Det tar under ett minutt.",
  },
  {
    nr: "02",
    tittel: "Vi gir deg en pris",
    tekst: "Du får et uforpliktende tilbud innen 24 timer. Ingen overraskelser.",
  },
  {
    nr: "03",
    tittel: "Vi gjør jobben",
    tekst: "Lén deg tilbake. Vi leverer skinnende resultater — garantert.",
  },
];

function SlikFungererDet() {
  const ref = useFadeIn<HTMLElement>();
  const gridRef = useFadeIn<HTMLDivElement>();

  return (
    <section className="bg-[#F9F8F6] py-24 lg:py-32">
      <div className="mx-auto max-w-[1200px] px-6">
        <div ref={ref} className="reveal text-center">
          <p className="text-[13px] font-medium tracking-widest text-primary uppercase">
            Slik fungerer det
          </p>
          <h2
            className="mt-4 text-[clamp(2rem,4vw,3.25rem)] font-bold tracking-[-0.03em] leading-[1.1] text-text"

          >
            Enkelt som 1-2-3
          </h2>
        </div>

        <div ref={gridRef} className="reveal-stagger mt-16 grid gap-10 sm:grid-cols-3 sm:gap-6">
          {stegData.map((steg, i) => (
            <div key={steg.nr} className="relative text-center sm:text-left">
              {/* Dashed connector line (between steps, desktop only) */}
              {i < stegData.length - 1 && (
                <div className="pointer-events-none absolute top-10 right-0 hidden h-px w-[calc(100%-3rem)] translate-x-[calc(50%+1.5rem)] border-t-2 border-dashed border-primary/20 sm:block" />
              )}

              <span className="text-5xl font-extralight tracking-tight text-primary/70 sm:text-7xl">
                {steg.nr}
              </span>
              <h3 className="mt-4 text-xl font-semibold tracking-[-0.02em] text-text">
                {steg.tittel}
              </h3>
              <p className="mt-2 text-[15px] leading-[1.7] text-text-secondary">
                {steg.tekst}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Trust Bar ── */
function TrustBar() {
  const aar = useCountUp(6, 2000);
  const ansatte = useCountUp(11, 2000);
  const kunder = useCountUp(1000, 2000);
  const rating = useCountUp(48, 2000);
  const ref = useFadeIn<HTMLDivElement>();

  return (
    <section className="bg-background-warm py-20 lg:py-24">
      <div ref={ref} className="reveal mx-auto grid max-w-[1000px] grid-cols-2 gap-6 px-6 sm:gap-10 lg:grid-cols-4 lg:gap-0">
        {[
          { ref: aar.ref, value: `${aar.count}+`, label: "Års erfaring" },
          { ref: ansatte.ref, value: `${ansatte.count}+`, label: "Ansatte" },
          { ref: kunder.ref, value: `${kunder.count}+`, label: "Fornøyde kunder" },
          { ref: rating.ref, value: `${(rating.count / 10).toFixed(1)}`, label: "På Google", star: true },
        ].map((stat) => (
          <div key={stat.label} ref={stat.ref} className="flex flex-col items-center text-center">
            <span className="text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-[-0.04em] text-text">
              {"star" in stat && stat.star && <span className="mr-1 text-primary">★</span>}
              {stat.value}
            </span>
            <span className="mt-3 h-1 w-10 rounded-full bg-primary" />
            <span className="mt-3 text-[13px] font-medium tracking-wide text-text-secondary uppercase">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Hvorfor oss (light) ── */
function HvorforOss() {
  const ref = useFadeIn<HTMLElement>();
  const gridRef = useFadeIn<HTMLDivElement>();

  return (
    <section className="bg-background-warm py-24 lg:py-32">
      <div className="mx-auto max-w-[1200px] px-6">
        <div ref={ref} className="reveal text-center">
          <p className="text-[13px] font-medium tracking-widest text-primary uppercase">Derfor oss</p>
          <h2
            className="mt-4 text-[clamp(2rem,4vw,3.25rem)] font-bold tracking-[-0.03em] leading-[1.1] text-text"

          >
            Kvalitet du kan stole på
          </h2>
        </div>
        <div ref={gridRef} className="reveal-stagger mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: ShieldCheck, tittel: "Offentlig godkjent", tekst: "Vi er offentlig godkjent renholdsbedrift og følger alle krav fra Arbeidstilsynet.", iconColor: "text-blue-600", bgColor: "bg-blue-50", tooltip: "Godkjent av Arbeidstilsynet. Registrert i Renholdsregisteret." },
            { icon: Handshake, tittel: "Medlem av NHO", tekst: "Vi er medlem av NHO Service og Handel — en garanti for seriøsitet og kvalitet.", iconColor: "text-violet-600", bgColor: "bg-violet-50", tooltip: "NHO Service og Handel: Norges ledende arbeidsgiverorganisasjon for servicenæringen." },
            { icon: Leaf, tittel: "EV-sertifisert", tekst: "Vi bruker EV-dampmaskin — skånsomt for miljøet og helsen din. Ingen sterke kjemikalier.", iconColor: "text-emerald-600", bgColor: "bg-emerald-50", tooltip: "EV-dampmaskin: Ingen sterke kjemikalier. Skånsomt for miljøet." },
            { icon: MapPin, tittel: "Lokalt i Vestfold", tekst: "Basert på Nøtterøy. Kort reisevei til hele Vestfold — fra Holmestrand til Larvik.", iconColor: "text-amber-600", bgColor: "bg-amber-50", tooltip: "Smormeien 1, Nøtterøy. Maks 30 min til hele Vestfold." },
          ].map((k) => {
            const Icon = k.icon;
            return (
              <div key={k.tittel} className="feature-card tooltip-trigger group rounded-2xl border border-gray-100/80 bg-white p-6 sm:rounded-3xl sm:p-8 lg:p-10">
                <div className="tooltip hidden lg:block">{k.tooltip}</div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${k.bgColor} transition-transform duration-500 group-hover:scale-110 sm:h-14 sm:w-14 sm:rounded-2xl`}>
                  <Icon size={22} strokeWidth={1.5} className={`${k.iconColor} sm:!h-[26px] sm:!w-[26px]`} />
                </div>
                <h3 className="mt-5 text-[17px] font-semibold tracking-[-0.02em] text-text sm:mt-7 sm:text-[19px]">{k.tittel}</h3>
                <p className="mt-3 text-[15px] leading-[1.7] text-text-secondary">{k.tekst}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── FAQ ── */
const faqData = [
  {
    q: "Hva koster det?",
    a: "Bruk priskalkulatoren vår for å få et umiddelbart estimat. Prisene varierer etter størrelse, boligtype og tjeneste. Vi gir alltid en nøyaktig pris etter befaring.",
    link: { href: "/tjenester/fast-vask", label: "Gå til prisestimator" },
  },
  {
    q: "Hva er inkludert?",
    a: "Hver tjeneste har en detaljert sjekkliste. Generelt dekker vi alle synlige flater, gulv, kjøkken, bad og støvtørking. Se den spesifikke tjenestesiden for full oversikt.",
    link: { href: "/tjenester", label: "Se alle tjenester" },
  },
  {
    q: "Dekker dere mitt område?",
    a: "Vi dekker hele Vestfold: Tønsberg, Nøtterøy, Tjøme, Færder, Sandefjord, Horten, Holmestrand og Larvik. Kort reisevei betyr raskt oppmøte.",
  },
  {
    q: "Når kan dere komme?",
    a: "Vi er vanligvis ledige innen 3–5 virkedager. For akutte behov — ring oss direkte på 968 23 647.",
  },
  {
    q: "Har dere garanti?",
    a: "Ja! Er du ikke fornøyd, kommer vi tilbake og fikser det — helt kostnadsfritt. Vi er offentlig godkjent renholdsbedrift og EV-sertifisert.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqData.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

function FAQ() {
  const ref = useFadeIn<HTMLElement>();
  const pillsRef = useFadeIn<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);
  const [clicked, setClicked] = useState<Set<number>>(new Set());
  const [showLead, setShowLead] = useState(false);
  const [leadFields, setLeadFields] = useState({ navn: "", telefon: "" });
  const [leadSent, setLeadSent] = useState(false);

  const handleClick = useCallback((i: number) => {
    trackEvent("faq_click", { question: faqData[i].q });
    setActive((prev) => (prev === i ? null : i));
    setClicked((prev) => {
      const next = new Set(prev);
      next.add(i);
      if (next.size >= 2) setShowLead(true);
      return next;
    });
  }, []);

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadFields.navn.trim() || !leadFields.telefon.trim()) return;
    trackEvent("lead_submit", { service: "faq" });
    setLeadSent(true);
  };

  return (
    <section className="bg-[#F9F8F6] py-24 lg:py-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div ref={ref} className="reveal text-center">
          <p className="text-[13px] font-medium tracking-widest text-primary uppercase">FAQ</p>
          <h2
            className="mt-4 text-[clamp(2rem,4vw,3.25rem)] font-bold tracking-[-0.03em] leading-[1.1] text-text"

          >
            Vanlige spørsmål
          </h2>
        </div>

        {/* Pills */}
        <div ref={pillsRef} className="reveal-stagger mt-12 flex flex-wrap justify-center gap-2.5">
          {faqData.map((item, i) => (
            <button
              key={i}
              onClick={() => handleClick(i)}
              className={`rounded-full border bg-white px-5 py-3 text-[14px] font-medium transition-all duration-200 ${
                active === i
                  ? "border-primary text-primary shadow-[0_2px_12px_rgba(232,114,28,0.1)]"
                  : "border-gray-200 text-text-secondary hover:border-primary/40 hover:text-text"
              }`}
            >
              {item.q}
            </button>
          ))}
        </div>

        {/* Answer */}
        <div className="mt-8 min-h-[80px]">
          {active !== null && (
            <div
              key={active}
              className="faq-answer-enter rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] sm:p-8"
            >
              <p className="text-[15px] leading-[1.7] text-text-secondary">
                {faqData[active].a}
              </p>
              {faqData[active].link && (
                <Link
                  href={faqData[active].link!.href}
                  className="content-link mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary"
                >
                  {faqData[active].link!.label} <ArrowRight size={14} />
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Lead Capture — shown after 2 unique clicks */}
        {showLead && (
          <div className="faq-lead-enter mt-10 rounded-2xl bg-[#FFF8F3] p-6 shadow-[0_4px_24px_rgba(232,114,28,0.06)] sm:p-8">
            {!leadSent ? (
              <>
                <p className="text-[16px] font-semibold tracking-tight text-text">
                  Vil du ha en konkret pris?
                </p>
                <p className="mt-1 text-[14px] text-text-secondary">
                  Legg igjen nummeret ditt, så ringer vi.
                </p>
                <form onSubmit={handleLeadSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <input
                    type="text"
                    placeholder="Navn"
                    required
                    value={leadFields.navn}
                    onChange={(e) => setLeadFields((p) => ({ ...p, navn: e.target.value }))}
                    className="h-12 flex-1 rounded-xl border border-gray-200 bg-white px-4 text-[14px] text-text outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                  <input
                    type="tel"
                    placeholder="Telefon"
                    required
                    value={leadFields.telefon}
                    onChange={(e) => setLeadFields((p) => ({ ...p, telefon: e.target.value }))}
                    className="h-12 flex-1 rounded-xl border border-gray-200 bg-white px-4 text-[14px] text-text outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                  <button
                    type="submit"
                    className="btn-glow inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 text-[14px] font-semibold text-white"
                  >
                    Send <ArrowRight size={14} />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex items-center gap-3 py-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100">
                  <Check size={18} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-text">Mottatt!</p>
                  <p className="text-[13px] text-text-secondary">Vi ringer deg snart.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* ── CTA ── */
function CTASeksjon() {
  const ref = useFadeIn<HTMLElement>();
  return (
    <section className="bg-accent py-24 lg:py-32">
      <div ref={ref} className="reveal mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-[-0.04em] leading-[1.1] text-text">
          La oss ta <span className="text-gradient">renholdet</span> for deg
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-[17px] leading-[1.7] text-text-secondary">
          Send oss en melding eller ring direkte. Vi svarer innen 24 timer med et uforpliktende tilbud.
        </p>
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <MagneticLink
            href="/kontakt"
            onClick={() => trackEvent("cta_click", { location: "section" })}
            className="btn-glow btn-shimmer inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-primary px-8 py-4 text-[15px] font-semibold text-white sm:w-auto"
          >
            Ta kontakt <ArrowRight size={16} />
          </MagneticLink>
          <a
            href="tel:+4796823647"
            onClick={() => trackEvent("phone_click", { location: "section" })}
            className="btn-outline inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-gray-300 px-8 py-4 text-[15px] font-medium text-text-secondary hover:border-gray-400 hover:text-text sm:w-auto"
          >
            <Phone size={15} /> 968 23 647
          </a>
        </div>
      </div>
    </section>
  );
}

/* ── Sticky Mobile CTA ── */
function MobileCTA() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hero = document.querySelector("[data-hero]");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShow(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`fixed right-0 bottom-0 left-0 z-40 bg-white px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 md:hidden ${
        show ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <div className="flex items-center gap-3">
        <Link
          href="/kontakt"
          onClick={() => trackEvent("cta_click", { location: "mobile" })}
          className="btn-glow flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-[15px] font-semibold text-white"
        >
          Få gratis tilbud <ArrowRight size={15} />
        </Link>
        <a
          href="tel:+4796823647"
          onClick={() => trackEvent("phone_click", { location: "mobile_cta" })}
          className="ring-pulse flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-primary text-primary"
          aria-label="Ring oss"
        >
          <Phone size={18} />
        </a>
      </div>
    </div>
  );
}

/* ── Animated orange divider ── */
function HeroDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="h-[3px] w-full origin-left bg-primary transition-transform duration-700 ease-out"
      style={{
        transform: visible ? "scaleX(1)" : "scaleX(0)",
        boxShadow: visible ? "0 0 12px rgba(232,114,28,0.4)" : "none",
      }}
    />
  );
}

/* ── Homepage ── */
export default function Hjem() {
  const tjenesterRef = useFadeIn<HTMLElement>();
  const gridRef = useFadeIn<HTMLDivElement>();

  return (
    <>
      <ScrollProgress />

      {/* Hero */}
      <section data-hero className="relative overflow-hidden h-[70vh] md:h-[min(75vh,680px)]">
        {/* #14 Image — Ken Burns from 1.03 to 1.08 */}
        <div className="absolute inset-0">
          <Image
            src="/images/firmabil-hero.webp"
            alt="Færder Multiservice firmabil"
            fill
            priority
            quality={95}
            sizes="100vw"
            className="hero-image-zoom object-cover"
            style={{ objectPosition: "center 55%" }}
          />
          {/* Cinematic vignette overlay */}
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse at center 40%, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.45) 100%)" }}
          />
        </div>

        {/* Text — on top */}
        <div className="relative z-10 mx-auto flex h-full max-w-3xl flex-col items-center justify-start px-6 pt-[calc(60px+56px)] text-center">
          <div className="hero-animate">
            {/* #17 Eyebrow text */}
            <span
              className="mb-4 inline-block rounded-full text-[10px] font-semibold tracking-[0.2em] text-white uppercase md:text-[11px]"
              style={{ background: "rgba(0,0,0,0.2)", padding: "0.3rem 0.8rem", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)", textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}
            >
              Vaskebyrå i Vestfold
            </span>

            {/* "Rent hjem." — #32 mobile text size */}
            <span
              className="block text-[clamp(2rem,8vw,4.5rem)] leading-[1.05] font-[800] tracking-[-0.04em] text-white"
              style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3), 0 8px 30px rgba(0,0,0,0.15)" }}
            >
              Rent hjem.
            </span>
            {/* "Null stress." */}
            <span
              className="block text-[clamp(2rem,8vw,4.5rem)] leading-[1.05] font-[800] tracking-[-0.04em] text-primary"
              style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3), 0 8px 30px rgba(0,0,0,0.15)" }}
            >
              Null stress.
            </span>

            {/* #26 Bold orange price highlight */}
            <p
              className="mx-auto mt-4 max-w-lg text-[1.0625rem] font-medium leading-[1.6] tracking-wide text-white/90"
              style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.2)" }}
            >
              Profesjonelt renhold i hele Vestfold — <span className="font-bold text-primary">fra 350 kr/time.</span>
            </p>

            {/* Buttons — full-width on mobile */}
            <div className="mt-7 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:justify-center">
              <MagneticLink
                href="#tjenester"
                className="btn-glow btn-shimmer inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-primary px-8 py-4 text-[15px] font-semibold text-white transition-transform duration-200 hover:scale-[1.03] sm:w-auto"
              >
                Se våre tjenester <ArrowDown size={16} />
              </MagneticLink>
              <a
                href="tel:+4796823647"
                onClick={(e) => {
                  if (window.innerWidth >= 768) {
                    e.preventDefault();
                    copyAndToast("968 23 647", "Telefonnummer kopiert!");
                  }
                  trackEvent("phone_click", { location: "hero" });
                }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 text-[15px] font-medium text-white transition-all duration-200 hover:scale-[1.03] hover:bg-white/25 sm:w-auto"
                style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.25)" }}
              >
                <Phone size={16} /> 968 23 647
              </a>
            </div>

          </div>
        </div>

        {/* #20 Bottom shadow for depth */}
        <div className="absolute right-0 bottom-0 left-0 z-10 h-px shadow-[0_4px_20px_rgba(0,0,0,0.08)]" />
      </section>

      {/* Animated orange divider */}
      <HeroDivider />

      {/* Tjenester */}
      <section id="tjenester" className="bg-white pt-24 pb-24 lg:pb-32">
        <div className="mx-auto max-w-[1200px] px-6">
          <div ref={tjenesterRef} className="reveal text-center">
            <p className="text-[13px] font-medium tracking-widest text-primary uppercase">Våre tjenester</p>
            <h2
              className="mt-4 text-[clamp(2rem,4vw,3.25rem)] font-bold tracking-[-0.03em] leading-[1.1] text-text"
  
            >
              Hva trenger du?
            </h2>
          </div>
          <div ref={gridRef} className="reveal-stagger mt-16 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6">
            {tjenester.map((t) => {
              const Icon = t.icon;
              return (
                <Link
                  key={t.slug}
                  href={`/tjenester/${t.slug}`}
                  className="service-card group relative flex flex-col items-center rounded-2xl border border-gray-100/80 bg-white px-3 py-6 text-center sm:rounded-3xl sm:px-6 sm:py-12"
                >
                  {"popular" in t && t.popular && (
                    <span className="popular-badge absolute top-2 right-2 z-10 rounded-full bg-primary px-2.5 py-0.5 text-[0.68rem] font-bold tracking-[0.05em] text-white uppercase shadow-[0_2px_8px_rgba(232,114,28,0.3)] sm:top-3 sm:right-3">
                      Mest populær
                    </span>
                  )}
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent transition-all duration-500 group-hover:bg-primary/15 group-hover:scale-105 sm:h-14 sm:w-14 sm:rounded-2xl">
                    <Icon size={22} strokeWidth={1.5} className="text-primary transition-transform duration-500 group-hover:scale-110 sm:!h-[26px] sm:!w-[26px]" />
                  </div>
                  <h3 className="mt-4 text-[14px] font-semibold tracking-tight text-text sm:mt-6 sm:text-base">{t.name}</h3>
                  <p className="service-price mt-2 text-[13px] font-semibold text-primary transition-colors duration-300">Fra {t.pris}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Kundeanmeldelser */}
      <Kundeanmeldelser />

      {/* Gradient: white → warm */}
      <div className="gradient-light-to-dark" />

      {/* Slik fungerer det */}
      <SlikFungererDet />


      {/* Trust Bar */}
      <TrustBar />

      {/* Gradient: warm → warm */}
      <div className="gradient-dark-to-warm" />

      {/* Hvorfor oss (warm/light) */}
      <HvorforOss />

      {/* FAQ */}
      <FAQ />

      {/* Gradient: warm → accent */}
      <div className="gradient-warm-to-dark" />

      {/* CTA */}
      <CTASeksjon />

      {/* Sticky Mobile CTA */}
      <MobileCTA />
    </>
  );
}

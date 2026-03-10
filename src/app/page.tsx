"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Sparkles, Truck, Building2, HardHat, Wind,
  Home, ShieldCheck, Leaf,
  MapPin, Phone, ArrowRight, ArrowDown, Handshake, Check, Star,
} from "lucide-react";
import Image from "next/image";
import { trackEvent } from "@/lib/tracking";
import { copyAndToast } from "@/lib/toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useCountUp } from "@/hooks/useCountUp";
import { MagneticLink } from "@/components/MagneticButton";
import { ScrollProgress } from "@/components/ScrollProgress";
import { testimonials } from "@/data/testimonials";
import { blogPosts } from "@/data/blog";

const tjenester = [
  { name: "Fast vask", pris: "Fra 550 kr", slug: "fast-vask", icon: Home },
  { name: "Flyttevask", pris: "Fra 3 500 kr", slug: "flyttevask", icon: Truck },
  { name: "Kontorvask", pris: "Etter avtale", slug: "kontorvask", icon: Building2 },
  { name: "Byggvask", pris: "Fra 5 000 kr", slug: "byggvask", icon: HardHat },
  { name: "Spesialvask", pris: "Fra 800 kr", slug: "spesialvask", icon: Sparkles },
  { name: "Luktsanering", pris: "Fra 3 000 kr", slug: "luktsanering", icon: Wind },
];

/* ── Service card — icon + text, no images ── */
function TjenesteKort({ t }: { t: (typeof tjenester)[number] }) {
  const Icon = t.icon;

  return (
    <Link
      href={`/tjenester/${t.slug}`}
      className="service-card group relative flex flex-col items-center rounded-[16px] bg-white px-6 py-8 text-center"
    >
      <Icon size={48} strokeWidth={1.2} className="text-primary" />

      <h3 className="mt-4 text-[16px] font-semibold tracking-tight text-text">{t.name}</h3>
      <p className="mt-1.5 text-[13px] font-medium text-primary">{t.pris}</p>

      <ArrowRight size={14} className="mt-3 text-text-secondary/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary" />
    </Link>
  );
}

/* ── Kundeanmeldelser ── */
function Kundeanmeldelser() {
  const ref = useScrollAnimation<HTMLDivElement>();
  const gridRef = useScrollAnimation<HTMLDivElement>();
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
    <section className="bg-white py-16 md:py-28 lg:py-36">
      <div className="mx-auto max-w-[1200px] px-5 md:px-6">
        <div ref={ref} className="reveal text-center">
          <p className="text-[13px] font-medium tracking-widest text-primary uppercase">
            Kundeanmeldelser
          </p>
          <h2
            className="mt-5 text-[clamp(2rem,4vw,3.25rem)] tracking-[-0.02em] leading-[1.1] text-text"
          >
            9 av 10 kunder kommer til oss via venner
          </h2>
          {/* Animated orange underline */}
          <span
            ref={lineRef}
            className="mx-auto mt-4 block h-[3px] w-16 rounded-full bg-primary transition-transform duration-700 ease-out"
            style={{ transform: lineVisible ? "scaleX(1)" : "scaleX(0)" }}
          />
          <p className="mx-auto mt-4 max-w-md text-[17px] leading-[1.7] text-text-secondary">
            Det sier vel egentlig alt.
          </p>
        </div>

        {/* Grid layout — 2 cols on tablet, 4 on desktop */}
        <div ref={gridRef} className="reveal-stagger mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="group relative rounded-2xl bg-white p-7 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.04)] transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)]"
            >
              {/* Large decorative quote mark */}
              <span aria-hidden="true" className="absolute top-4 right-5 text-[4rem] leading-none font-serif text-primary/[0.06] select-none transition-all duration-500 group-hover:text-primary/[0.12]">
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
              <span aria-hidden="true" className="absolute top-0 left-6 right-6 h-[2px] rounded-full bg-primary/30 transition-all duration-500 group-hover:left-4 group-hover:right-4 group-hover:bg-primary/60" />

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
            Vi tar gjerne en titt — helt gratis <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── Slik fungerer det ── */
const stegData = [
  {
    nr: "01",
    tittel: "Fortell oss hva du trenger",
    tekst: "Bruk kalkulatoren eller send oss en melding. Tar under ett minutt.",
    bilde: "/images/illustrations/steg-kontakt.webp",
    alt: "Person som tar kontakt for renhold",
    rotate: "-2deg",
  },
  {
    nr: "02",
    tittel: "Vi gir deg en pris",
    tekst: "Du får et tilbud innen 24 timer. Ingen skjulte kostnader.",
    bilde: "/images/illustrations/steg-tilbud.webp",
    alt: "Tilbud og prisoverslag for renhold",
    rotate: "1deg",
  },
  {
    nr: "03",
    tittel: "Vi gjør jobben",
    tekst: "Len deg tilbake. Vi fikser resten — grundig og skikkelig.",
    bilde: "/images/illustrations/steg-vasker.webp",
    alt: "Vasketeamet i arbeid",
    rotate: "-1deg",
  },
];

function SlikFungererDet() {
  const ref = useScrollAnimation<HTMLDivElement>();
  const gridRef = useScrollAnimation<HTMLDivElement>();

  return (
    <section className="bg-[#f5f5f7] py-16 md:py-28 lg:py-36">
      <div className="mx-auto max-w-[1200px] px-5 md:px-6">
        <div ref={ref} className="reveal text-center">
          <p className="text-[13px] font-medium tracking-widest text-primary uppercase">
            Slik fungerer det
          </p>
          <h2
            className="mt-5 text-[clamp(2rem,4vw,3.25rem)] tracking-[-0.02em] leading-[1.1] text-text"
          >
            Enkelt som 1-2-3
          </h2>
        </div>

        <div ref={gridRef} className="reveal-stagger mt-20 grid gap-10 sm:grid-cols-3 sm:gap-6">
          {stegData.map((steg, i) => (
            <div key={steg.nr} className="relative text-center">
              {/* Dashed connector line (between steps, desktop only) */}
              {i < stegData.length - 1 && (
                <div className="pointer-events-none absolute top-[65px] right-0 hidden h-px w-[calc(100%-8rem)] translate-x-[calc(50%+4rem)] border-t-2 border-dashed border-primary/15 sm:block" />
              )}

              {/* Circular image */}
              <div className="relative mx-auto mb-5 h-[100px] w-[100px] sm:h-[130px] sm:w-[130px]">
                {/* Decorative blob behind */}
                <div
                  className="absolute -top-2 -left-2 h-[120px] w-[120px] rounded-full sm:-top-[10px] sm:-left-[10px] sm:h-[160px] sm:w-[160px]"
                  style={{ background: "radial-gradient(circle, rgba(232,114,28,0.06) 0%, transparent 70%)" }}
                />
                <Image
                  src={steg.bilde}
                  alt={steg.alt}
                  width={130}
                  height={130}
                  quality={90}
                  loading="lazy"
                  className="steg-image relative h-full w-full rounded-full border-[3px] border-[#faf0e4] object-cover transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-105 hover:border-primary"
                  style={{ transform: `rotate(${steg.rotate})` }}
                />
              </div>

              <span className="text-4xl font-extralight tracking-tight text-primary/70 sm:text-5xl">
                {steg.nr}
              </span>
              <h3 className="mt-3 text-xl tracking-[-0.02em] text-text">
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
  const ref = useScrollAnimation<HTMLDivElement>();

  return (
    <section className="bg-[#faf8f5] py-16 md:py-24 lg:py-28">
      <div ref={ref} className="reveal mx-auto grid max-w-[1000px] grid-cols-2 gap-6 px-5 md:px-6 sm:gap-10 lg:grid-cols-4 lg:gap-0">
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
  const ref = useScrollAnimation<HTMLDivElement>();
  const gridRef = useScrollAnimation<HTMLDivElement>();

  return (
    <section className="bg-white py-16 md:py-28 lg:py-36">
      <div className="mx-auto max-w-[1200px] px-5 md:px-6">
        <div ref={ref} className="reveal text-center">
          <p className="text-[13px] font-medium tracking-widest text-primary uppercase">Derfor oss</p>
          <h2
            className="mt-5 text-[clamp(2rem,4vw,3.25rem)] tracking-[-0.02em] leading-[1.1] text-text"
          >
            Derfor velger folk oss
          </h2>
        </div>

        <div ref={gridRef} className="reveal-stagger mt-10 grid gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {[
            { icon: ShieldCheck, tittel: "Offentlig godkjent", tekst: "Godkjent av Arbeidstilsynet. Alt er på stell hos oss.", iconColor: "text-blue-600", bgColor: "bg-blue-50", tooltip: "Registrert i Renholdsregisteret." },
            { icon: Handshake, tittel: "Medlem av NHO", tekst: "Vi er med i NHO Service og Handel. Vi gjør ting ordentlig.", iconColor: "text-violet-600", bgColor: "bg-violet-50", tooltip: "NHO Service og Handel." },
            { icon: Leaf, tittel: "EV-sertifisert", tekst: "Vi vasker med damp — ingen sterke kjemikalier. Bra for deg og miljøet.", iconColor: "text-emerald-600", bgColor: "bg-emerald-50", tooltip: "Kun vann og varme. Ingen kjemikalier." },
            { icon: MapPin, tittel: "Lokalt i Vestfold", tekst: "Vi holder til på Nøtterøy. Kort vei til hele Vestfold.", iconColor: "text-amber-600", bgColor: "bg-amber-50", tooltip: "Smørmeien 1, Nøtterøy." },
          ].map((k) => {
            const Icon = k.icon;
            return (
              <div key={k.tittel} className="feature-card tooltip-trigger group rounded-2xl bg-white p-6 sm:rounded-3xl sm:p-8 lg:p-10">
                <div className="tooltip hidden lg:block">{k.tooltip}</div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${k.bgColor} transition-transform duration-500 group-hover:scale-110 sm:h-14 sm:w-14 sm:rounded-2xl`}>
                  <Icon size={22} strokeWidth={1.5} className={`${k.iconColor} sm:!h-[26px] sm:!w-[26px]`} />
                </div>
                <h3 className="mt-5 text-[17px] tracking-[-0.02em] text-text sm:mt-7 sm:text-[19px]">{k.tittel}</h3>
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
    a: "Prøv kalkulatoren vår — du får et estimat med en gang. Prisen avhenger av størrelse og type jobb. Vi gir alltid en fast pris etter befaring.",
    link: { href: "/tjenester/fast-vask", label: "Prøv kalkulatoren" },
  },
  {
    q: "Hva er inkludert?",
    a: "Alle flater, gulv, kjøkken, bad og støvtørking. Hver tjeneste har en egen sjekkliste så du vet nøyaktig hva du får.",
    link: { href: "/tjenester", label: "Se alle tjenester" },
  },
  {
    q: "Dekker dere mitt område?",
    a: "Vi dekker hele Vestfold — Tønsberg, Nøtterøy, Tjøme, Færder, Sandefjord, Horten, Holmestrand og Larvik. Vi er aldri langt unna.",
  },
  {
    q: "Når kan dere komme?",
    a: "Som regel innen 3–5 virkedager. Haster det? Bare ring oss på 968 23 647.",
  },
  {
    q: "Har dere garanti?",
    a: "Ja! Er du ikke fornøyd, kommer vi tilbake og fikser det — helt gratis. Så enkelt er det.",
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
  const ref = useScrollAnimation<HTMLDivElement>();
  const pillsRef = useScrollAnimation<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);
  const [, setClicked] = useState<Set<number>>(new Set());
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

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadFields.navn.trim() || !leadFields.telefon.trim()) return;
    trackEvent("lead_submit", { service: "faq" });
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          navn: leadFields.navn,
          telefon: leadFields.telefon,
          tjeneste: "Generell henvendelse (FAQ)",
        }),
      });
    } catch { /* show success regardless — avoid blocking UI */ }
    setLeadSent(true);
  };

  return (
    <section className="bg-[#f5f5f7] py-16 md:py-28 lg:py-36">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <div ref={ref} className="reveal text-center">
          <p className="text-[13px] font-medium tracking-widest text-primary uppercase">FAQ</p>
          <h2
            className="mt-5 text-[clamp(2rem,4vw,3.25rem)] tracking-[-0.02em] leading-[1.1] text-text"

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
              className={`flex min-h-[48px] items-center rounded-full border bg-white px-5 py-3 text-[15px] sm:text-[14px] font-medium transition-all duration-200 ${
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
                    aria-label="Navn"
                    required
                    value={leadFields.navn}
                    onChange={(e) => setLeadFields((p) => ({ ...p, navn: e.target.value }))}
                    className="h-12 flex-1 rounded-xl border border-gray-200 bg-white px-4 text-base text-text outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                  <input
                    type="tel"
                    placeholder="Telefon"
                    aria-label="Telefon"
                    required
                    value={leadFields.telefon}
                    onChange={(e) => setLeadFields((p) => ({ ...p, telefon: e.target.value }))}
                    className="h-12 flex-1 rounded-xl border border-gray-200 bg-white px-4 text-base text-text outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                  <button
                    type="submit"
                    className="btn-glow inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-7 text-base font-semibold text-white sm:w-auto"
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

/* ── Blog section ── */
function BlogSeksjon() {
  const ref = useScrollAnimation<HTMLDivElement>();
  const cardsRef = useScrollAnimation<HTMLDivElement>();

  return (
    <section className="bg-[#faf8f5] py-16 md:py-28 lg:py-36">
      <div className="mx-auto max-w-[1200px] px-5 md:px-6">
        {/* Header row */}
        <div ref={ref} className="reveal flex items-end justify-between">
          <div>
            <p className="text-[13px] font-medium tracking-widest text-primary uppercase">
              Fra bloggen
            </p>
            <h2 className="mt-5 text-[clamp(2rem,4vw,3.25rem)] tracking-[-0.02em] leading-[1.1] text-text">
              Tips og råd for et renere hjem
            </h2>
          </div>
          <Link
            href="/blogg"
            className="hidden items-center gap-1.5 text-[15px] font-medium text-primary transition-colors duration-150 hover:text-primary-dark sm:flex"
          >
            Flere artikler <ArrowRight size={15} />
          </Link>
        </div>

        {/* Cards — vertical stack on mobile, grid on desktop */}
        <div ref={cardsRef} className="reveal-stagger mt-14 grid gap-5 sm:grid-cols-3">
          {blogPosts.slice(0, 3).map((post) => (
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
        </div>

        {/* Mobile "Flere artikler" link */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/blogg"
            className="inline-flex items-center gap-1.5 text-[15px] font-medium text-primary"
          >
            Flere artikler <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── CTA ── */
function CTASeksjon() {
  const ref = useScrollAnimation<HTMLDivElement>();
  return (
    <section className="py-16 md:py-28 lg:py-36" style={{ background: "linear-gradient(180deg, #fdf6ef, #faf0e4)" }}>
      <div ref={ref} className="reveal mx-auto max-w-[1100px] px-5 md:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[45%_55%] lg:gap-16">
          {/* Illustration — hjem til rent hus */}
          <div className="relative mx-auto max-w-[280px] lg:max-w-[380px]">
            <div className="absolute -top-8 -left-8 -z-10 h-[300px] w-[300px] rounded-full bg-primary/[0.06]" aria-hidden="true" />
            <Image
              src="/images/illustrations/hjem_til_rent_hus.webp"
              alt="Glad person som kommer hjem til rent hus"
              width={380}
              height={380}
              quality={90}
              className="w-full rounded-[20px] border border-primary/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-transform duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.02]"
              style={{ transform: "rotate(-2deg)" }}
            />
          </div>

          {/* Text + buttons */}
          <div className="text-center lg:text-left">
            <h2 className="text-[clamp(2rem,5vw,3.5rem)] tracking-[-0.02em] leading-[1.1] text-text">
              La oss ta <span className="text-gradient italic">renholdet</span> for deg
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-[17px] leading-[1.7] text-text-secondary lg:mx-0">
              Send en melding eller bare ring. Vi svarer innen 24 timer.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
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
        </div>
      </div>
    </section>
  );
}

/* ── Sticky Mobile CTA ── */
function MobileCTA() {
  const [heroGone, setHeroGone] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector("[data-hero]");
    const footer = document.querySelector("footer");

    const heroObs = new IntersectionObserver(
      ([entry]) => setHeroGone(!entry.isIntersecting),
      { threshold: 0 }
    );

    const footerObs = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { threshold: 0 }
    );

    if (hero) heroObs.observe(hero);
    if (footer) footerObs.observe(footer);

    return () => {
      heroObs.disconnect();
      footerObs.disconnect();
    };
  }, []);

  const show = heroGone && !footerVisible;

  return (
    <div
      className={`fixed right-0 bottom-0 left-0 z-40 bg-white py-3 px-5 shadow-[0_-2px_12px_rgba(0,0,0,0.08)] transition-all duration-300 md:hidden ${
        show ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <a
        href="tel:+4796823647"
        onClick={() => trackEvent("phone_click", { location: "mobile_sticky" })}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-base font-semibold text-white"
      >
        <Phone size={16} />
        Ring oss — 968 23 647
      </a>
    </div>
  );
}

/* ── Hero typewriter ── */
const typewriterWords = ["hjem.", "kontor.", "bygg.", "borettslag.", "fra dag én."];

function HeroTypewriter() {
  const [text, setText] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [phase, setPhase] = useState<"idle" | "typing" | "waiting" | "deleting">("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    // Start after hero entrance animation
    timeoutRef.current = setTimeout(() => setPhase("typing"), 1200);
    return () => clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    const word = typewriterWords[wordIdx];

    if (phase === "typing") {
      if (text.length < word.length) {
        timeoutRef.current = setTimeout(() => {
          setText(word.slice(0, text.length + 1));
        }, 140);
      } else {
        // Done typing → wait (cursor blinks during this)
        timeoutRef.current = setTimeout(() => setPhase("waiting"), 2200);
      }
    } else if (phase === "waiting") {
      timeoutRef.current = setTimeout(() => setPhase("deleting"), 3000);
    } else if (phase === "deleting") {
      if (text.length > 0) {
        timeoutRef.current = setTimeout(() => {
          setText(text.slice(0, -1));
        }, 60);
      } else {
        // Done deleting → next word
        timeoutRef.current = setTimeout(() => {
          setWordIdx((i) => (i + 1) % typewriterWords.length);
          setPhase("typing");
        }, 600);
      }
    }

    return () => clearTimeout(timeoutRef.current);
  }, [text, phase, wordIdx]);

  // Use a zero-width space when empty so the line height is preserved
  const displayText = text || "\u200B";

  return (
    <span
      className="block font-serif text-[clamp(2rem,8vw,2.5rem)] leading-[1.05] tracking-[-0.02em] text-text md:text-[clamp(2.25rem,8vw,5rem)]"
    >
      Rent{" "}{displayText}
      <span
        className="inline-block w-[2px] align-middle"
        style={{
          height: "0.7em",
          background: "#E8721C",
          marginLeft: "3px",
          marginBottom: "0.05em",
          animation: "blink 0.8s step-end infinite",
        }}
      />
    </span>
  );
}

/* ── Animated section divider ── */
function AnimatedDivider() {
  const ref = useScrollAnimation<HTMLDivElement>();
  return <div ref={ref} className="section-divider" />;
}

/* ── Homepage ── */
export default function Hjem() {
  const tjenesterRef = useScrollAnimation<HTMLDivElement>();
  const gridRef = useScrollAnimation<HTMLDivElement>();

  return (
    <>
      <ScrollProgress />

      {/* Hero — clean gradient, no photo */}
      <section
        data-hero
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(180deg, #faf8f5 0%, #f5f0ea 100%)" }}
      >
        {/* Watercolor blobs — decorative corners (inlined SVGs) */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <svg viewBox="0 0 300 300" fill="none" className="absolute -top-10 -right-16 w-[320px] opacity-40">
            <defs><filter id="wb1" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur in="SourceGraphic" stdDeviation="18"/></filter></defs>
            <ellipse cx="150" cy="130" rx="110" ry="90" fill="#E8721C" opacity="0.25" filter="url(#wb1)"/>
            <ellipse cx="170" cy="170" rx="90" ry="75" fill="#F4A261" opacity="0.2" filter="url(#wb1)"/>
            <ellipse cx="130" cy="150" rx="70" ry="60" fill="#E8721C" opacity="0.15" filter="url(#wb1)"/>
          </svg>
          <svg viewBox="0 0 250 250" fill="none" className="absolute -bottom-12 -left-12 w-[280px] opacity-30">
            <defs><filter id="wb2a" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur in="SourceGraphic" stdDeviation="20"/></filter></defs>
            <ellipse cx="120" cy="130" rx="95" ry="80" fill="#F5E6D3" opacity="0.4" filter="url(#wb2a)"/>
            <ellipse cx="140" cy="110" rx="70" ry="65" fill="#E8C9A0" opacity="0.3" filter="url(#wb2a)"/>
            <ellipse cx="110" cy="150" rx="60" ry="50" fill="#F4A261" opacity="0.15" filter="url(#wb2a)"/>
          </svg>
          <svg viewBox="0 0 180 180" fill="none" className="absolute top-16 -left-8 w-[200px] opacity-25">
            <defs><filter id="wb3" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur in="SourceGraphic" stdDeviation="15"/></filter></defs>
            <ellipse cx="90" cy="85" rx="65" ry="55" fill="#F5E6D3" opacity="0.35" filter="url(#wb3)"/>
            <ellipse cx="80" cy="100" rx="50" ry="45" fill="#E8C9A0" opacity="0.25" filter="url(#wb3)"/>
          </svg>
          <svg viewBox="0 0 250 250" fill="none" className="absolute bottom-20 -right-10 w-[220px] opacity-20 rotate-180">
            <defs><filter id="wb2b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur in="SourceGraphic" stdDeviation="20"/></filter></defs>
            <ellipse cx="120" cy="130" rx="95" ry="80" fill="#F5E6D3" opacity="0.4" filter="url(#wb2b)"/>
            <ellipse cx="140" cy="110" rx="70" ry="65" fill="#E8C9A0" opacity="0.3" filter="url(#wb2b)"/>
            <ellipse cx="110" cy="150" rx="60" ry="50" fill="#F4A261" opacity="0.15" filter="url(#wb2b)"/>
          </svg>
        </div>

        {/* Text — centered */}
        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 pt-36 pb-10 text-center md:pt-44 md:pb-14">
          <div className="hero-animate">
            {/* Eyebrow */}
            <span className="mb-5 inline-block rounded-full bg-primary/10 px-3.5 py-1.5 text-[12px] font-semibold tracking-[0.2em] text-primary uppercase md:text-[11px]">
              Vaskebyrå i Vestfold
            </span>

            {/* "Rent ___. Null stress." — h1 with typewriter */}
            <h1>
              <HeroTypewriter />
              {/* "Null stress." — serif italic orange */}
              <span className="block font-serif italic text-[clamp(2rem,8vw,2.5rem)] leading-[1.05] tracking-[-0.02em] text-primary md:text-[clamp(2.25rem,8vw,5rem)]">
                Null stress.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-5 max-w-lg text-[1.0625rem] font-medium leading-[1.6] tracking-wide text-text-secondary">
              Skikkelig renhold i hele Vestfold — <span className="font-bold text-primary">fra 550 kr.</span>
            </p>

            {/* Buttons */}
            <div className="mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:justify-center">
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
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border-[1.5px] border-text px-8 py-4 text-[15px] font-medium text-text transition-all duration-200 hover:scale-[1.03] hover:bg-text/5 sm:w-auto"
              >
                <Phone size={16} /> 968 23 647
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* Firmabil image — seamless visual break */}
      <div
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(180deg, #f5f0ea 0%, #faf8f5 100%)" }}
      >
        <Image
          src="/images/firmabil-hero.webp"
          alt="Færder Multiservice firmabil"
          width={1920}
          height={600}
          priority
          quality={90}
          sizes="100vw"
          className="w-full object-cover"
          style={{
            height: "clamp(300px, 35vw, 440px)",
            objectPosition: "center 70%",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 70%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 70%, transparent 100%)",
          }}
        />
      </div>

      {/* Tjenester */}
      <section id="tjenester" className="bg-[#faf8f5] pt-16 pb-16 md:pt-28 md:pb-28 lg:pb-36">
        <div className="mx-auto max-w-[1200px] px-5 md:px-6">
          <div ref={tjenesterRef} className="reveal text-center">
            <p className="text-[13px] font-medium tracking-widest text-primary uppercase">Våre tjenester</p>
            <h2
              className="mt-5 text-[clamp(2rem,4vw,3.25rem)] tracking-[-0.02em] leading-[1.1] text-text"

            >
              Hva trenger du?
            </h2>
          </div>
          <div ref={gridRef} className="reveal-stagger mt-14 grid grid-cols-2 gap-4 md:grid-cols-3">
            {tjenester.map((t) => (
              <TjenesteKort key={t.slug} t={t} />
            ))}
          </div>
        </div>
      </section>

      {/* Kundeanmeldelser */}
      <Kundeanmeldelser />

      {/* Divider */}
      <AnimatedDivider />

      {/* Slik fungerer det */}
      <SlikFungererDet />


      {/* Trust Bar */}
      <TrustBar />

      {/* Divider */}
      <AnimatedDivider />

      {/* Hvorfor oss (warm/light) */}
      <HvorforOss />

      {/* FAQ */}
      <FAQ />

      {/* Divider */}
      <AnimatedDivider />

      {/* Blog */}
      <BlogSeksjon />

      {/* Divider */}
      <AnimatedDivider />

      {/* CTA */}
      <CTASeksjon />

      {/* Sticky Mobile CTA */}
      <MobileCTA />
    </>
  );
}

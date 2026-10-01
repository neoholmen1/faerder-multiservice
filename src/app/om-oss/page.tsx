import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Leaf, MapPin, Heart, Sparkles, ArrowRight, Phone } from "lucide-react";
import { PageHero } from "@/components/DarkHero";
import { SectionReveal } from "@/components/SectionReveal";
import { AnimatedDivider } from "@/components/AnimatedDivider";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getPageContent, pick, pickHero } from "@/lib/page-cms";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Om oss — Lokalt i Vestfold siden 2020",
  description:
    "Et etablert renholdsteam som vasker i hele Vestfold. Godkjent, EV-sertifisert, og med siden 2020. Bli kjent med oss.",
  alternates: { canonical: "/om-oss" },
  openGraph: {
    title: "Om oss | Færder Multiservice",
    description: "Et etablert renholdsteam som vasker i hele Vestfold. Godkjent, EV-sertifisert, og med siden 2020.",
    url: "/om-oss",
  },
};

const dekningsomrader = [
  "Tønsberg", "Nøtterøy", "Tjøme", "Færder",
  "Sandefjord", "Horten", "Holmestrand", "Larvik",
];

export default async function OmOssPage() {
  const content = await getPageContent("om-oss");

  const heroEyebrow = pickHero(content, "hero_eyebrow", "Om oss");
  const heroTitle = pickHero(content, "hero_title", "Om Færder Multiservice");
  const heroSubtitle = pickHero(content, "hero_subtitle", "Vi har vasket i Vestfold siden 2020.");

  const leaderName = pick(content, "historie", "leader_name", 0, "Aleksandra");
  const leaderTitle = pick(content, "historie", "leader_title", 0, "Daglig leder");
  const histEyebrow = pick(content, "historie", "eyebrow", 0, "Vår historie");
  const histTitle = pick(content, "historie", "title", 0, "Slik startet det");
  const p0 = pick(content, "historie", "paragraph", 0,
    "Vi startet i 2020 med en enkel idé: å vaske skikkelig og behandle folk ordentlig. Det gjør vi fortsatt.");
  const p1 = pick(content, "historie", "paragraph", 1,
    "I dag er vi et etablert team. Vi vasker for folk, bedrifter, borettslag og utbyggere i hele Vestfold — fra Holmestrand til Larvik.");
  const p2 = pick(content, "historie", "paragraph", 2,
    "Vi gjør heller én jobb grundig enn ti halvveis. Vi er ikke fornøyde før du er det.");

  const verdiEyebrow = pick(content, "verdier", "eyebrow", 0, "Våre verdier");
  const verdiTitle = pick(content, "verdier", "title", 0, "Det vi står for");
  const verdiDefaults = [
    { tittel: "Grundig, alltid", tekst: "Ingen snarveier. Ingen halvgjort jobb. Sånn er det bare." },
    { tittel: "Bra for miljøet", tekst: "Vi vasker med damp. Ingen sterke kjemikalier. Bra for deg og naturen." },
    { tittel: "Lokalt og personlig", tekst: "Basert i Tønsberg. Kort reisevei, kjente fjes, personlig oppfølging." },
  ];
  const verdiCards = [0, 1, 2].map((i) => ({
    title: pick(content, "verdier", "card_title", i, verdiDefaults[i].tittel),
    text: pick(content, "verdier", "card_text", i, verdiDefaults[i].tekst),
  }));

  const ctaTitle = pick(content, "cta_final", "title", 0, "Vil du vite mer?");
  const ctaBody = pick(content, "cta_final", "body", 0,
    "Send oss en melding eller ring. Vi svarer samme dag — senest neste virkedag.");

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Hjem", href: "/" },
        { name: "Om oss", href: "/om-oss" },
      ]} />
      <PageHero
        label={heroEyebrow}
        title={heroTitle}
        subtitle={heroSubtitle}
      />

      {/* Vår historie */}
      <section className="py-16 md:py-28 lg:py-36">
        <SectionReveal className="mx-auto max-w-4xl px-6">
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:gap-16">
            {/* Aleksandra portrait */}
            <div className="shrink-0 text-center">
              <div className="photo-frame photo-frame-round inline-block">
                <div className="photo-frame-bg !rounded-full" />
                <Image
                  src="/images/aleksandra-portrett.webp"
                  alt={`${leaderName}, ${leaderTitle.toLowerCase()} i Færder Multiservice, Tønsberg`}
                  width={200}
                  height={200}
                  quality={90}
                  priority
                  className="h-[200px] w-[200px] object-cover"
                />
              </div>
              <p className="mt-4 text-[15px] font-semibold text-text">{leaderName}</p>
              <p className="text-[13px] text-text-secondary">{leaderTitle}</p>
            </div>

            {/* Text */}
            <div>
              <p className="text-[13px] font-medium tracking-widest text-primary uppercase">
                {histEyebrow}
              </p>
              <h2 className="mt-5 text-[clamp(1.75rem,4vw,3rem)] tracking-[-0.02em] leading-[1.1] text-text">
                {histTitle}
              </h2>
              <div className="mt-8 space-y-6 text-[17px] leading-[1.7] text-text-secondary">
                <p>{p0}</p>
                <p>{p1}</p>
                <p>{p2}</p>
              </div>
            </div>
          </div>
        </SectionReveal>
      </section>

      {/* Verdier */}
      <AnimatedDivider />
      <section className="bg-[#f5f5f7] py-16 md:py-28 lg:py-36">
        <div className="mx-auto max-w-[1200px] px-6">
          <SectionReveal className="text-center">
            <p className="text-[13px] font-medium tracking-widest text-primary uppercase">
              {verdiEyebrow}
            </p>
            <h2 className="mt-5 text-[clamp(1.75rem,4vw,3rem)] tracking-[-0.02em] leading-[1.1] text-text">
              {verdiTitle}
            </h2>
          </SectionReveal>

          <SectionReveal className="mt-12 md:mt-20 grid gap-6 sm:grid-cols-3">
            {[
              { icon: Sparkles, color: "text-primary", bg: "bg-accent" },
              { icon: Leaf, color: "text-emerald-600", bg: "bg-emerald-50" },
              { icon: Heart, color: "text-rose-500", bg: "bg-rose-50" },
            ].map((v, i) => {
              const Icon = v.icon;
              return (
                <div
                  key={i}
                  className="feature-card group rounded-3xl bg-white p-8 lg:p-10"
                >
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${v.bg} transition-transform duration-500 group-hover:scale-110`}>
                    <Icon size={26} strokeWidth={1.5} className={v.color} />
                  </div>
                  <h3 className="mt-7 text-[19px] tracking-[-0.02em] text-text">
                    {verdiCards[i].title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-[1.7] text-text-secondary">
                    {verdiCards[i].text}
                  </p>
                </div>
              );
            })}
          </SectionReveal>
        </div>
      </section>

      {/* Sertifiseringer */}
      <AnimatedDivider />
      <section className="py-16 md:py-28 lg:py-36">
        <SectionReveal className="mx-auto max-w-[1200px] px-6">
          <div className="text-center">
            <p className="text-[13px] font-medium tracking-widest text-primary uppercase">
              Sertifiseringer
            </p>
            <h2 className="mt-5 text-[clamp(1.75rem,4vw,3rem)] tracking-[-0.02em] leading-[1.1] text-text">
              Godkjent og sertifisert
            </h2>
          </div>

          <div className="mt-10 md:mt-16 grid gap-6 sm:grid-cols-2">
            <div className="feature-card rounded-3xl bg-white p-8 lg:p-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                <ShieldCheck size={26} strokeWidth={1.5} className="text-blue-600" />
              </div>
              <h3 className="mt-6 text-[19px] tracking-[-0.02em] text-text">
                Offentlig godkjent renholdsbedrift
              </h3>
              <p className="mt-3 text-[15px] leading-[1.7] text-text-secondary">
                Godkjent av Arbeidstilsynet. Det betyr at alt er på stell
                — lønn, arbeidsforhold og HMS. Du kan være trygg.
              </p>
            </div>
            <div className="feature-card rounded-3xl bg-white p-8 lg:p-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
                <Leaf size={26} strokeWidth={1.5} className="text-emerald-600" />
              </div>
              <h3 className="mt-6 text-[19px] tracking-[-0.02em] text-text">
                EV-sertifisert
              </h3>
              <p className="mt-3 text-[15px] leading-[1.7] text-text-secondary">
                Vi bruker dampmaskin som vasker med kun vann og varme.
                Ingen sterke kjemikalier. Bedre for lufta hjemme hos deg.
              </p>
            </div>
          </div>
        </SectionReveal>
      </section>

      {/* Dekningsområde */}
      <AnimatedDivider />
      <section className="bg-[#f5f5f7] py-16 md:py-28 lg:py-36">
        <SectionReveal className="mx-auto max-w-[1200px] px-6 text-center">
          <p className="text-[13px] font-medium tracking-widest text-primary uppercase">
            Dekningsområde
          </p>
          <h2 className="mt-5 text-[clamp(1.75rem,4vw,3rem)] tracking-[-0.02em] leading-[1.1] text-text">
            Vi dekker hele Vestfold
          </h2>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            {dekningsomrader.map((by) => (
              <span
                key={by}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-text-secondary shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.04)]"
              >
                <MapPin size={14} className="text-primary" />
                {by}
              </span>
            ))}
          </div>
        </SectionReveal>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20" style={{ background: "linear-gradient(180deg, #fdf6ef, #faf0e4)" }}>
        <SectionReveal className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-[clamp(1.5rem,3vw,2rem)] tracking-[-0.02em] text-text">
            {ctaTitle}
          </h2>
          <p className="mt-3 text-[15px] text-text-secondary">
            {ctaBody}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/kontakt"
              className="btn-glow btn-shimmer inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-[15px] font-semibold text-white"
            >
              Ta kontakt <ArrowRight size={16} />
            </Link>
            <a
              href="tel:+4796823647"
              className="btn-outline inline-flex items-center gap-2 rounded-full border-2 border-gray-300 px-8 py-4 text-[15px] font-medium text-text-secondary hover:border-gray-400 hover:text-text"
            >
              <Phone size={15} /> 968 23 647
            </a>
          </div>
        </SectionReveal>
      </section>

    </>
  );
}

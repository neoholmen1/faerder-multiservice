"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock, ArrowRight, Check, Loader2 } from "lucide-react";
import { trackEvent } from "@/lib/tracking";
import { copyAndToast } from "@/lib/toast";
import { PageHero } from "@/components/DarkHero";
import { SectionReveal } from "@/components/SectionReveal";

const kontaktInfo = [
  { icon: Phone, label: "Telefon", value: "+47 968 23 647", href: "tel:+4796823647" },
  { icon: Mail, label: "E-post", value: "post@faerdermultiservice.no", href: "mailto:post@faerdermultiservice.no" },
  { icon: MapPin, label: "Adresse", value: "Smormeien 1, 3116 Nøtterøy", href: null },
  { icon: Clock, label: "Åpningstider", value: "Man–Fre 08:00–16:00", href: null },
];

const tjenesteListe = [
  "Fast vask", "Flyttevask", "Kontorvask", "Byggvask", "Spesialvask",
  "Luktsanering", "Hovedrengjøring", "Visningsvask", "Borettslag", "Annet",
];

interface FieldState {
  value: string;
  touched: boolean;
}

function validateField(name: string, value: string): string {
  if (name === "navn" && !value.trim()) return "Navn er påkrevd";
  if (name === "epost") {
    if (!value.trim()) return "E-post er påkrevd";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Ugyldig e-postadresse";
  }
  if (name === "telefon") {
    if (!value.trim()) return "Telefon er påkrevd";
    if (!/^[\d\s+()-]{8,}$/.test(value)) return "Ugyldig telefonnummer";
  }
  return "";
}

function FloatingField({
  id,
  label,
  type = "text",
  required,
  field,
  error,
  isValid,
  onChange,
  onBlur,
  textarea,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  field: FieldState;
  error: string;
  isValid: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
  textarea?: boolean;
}) {
  const baseClass =
    "w-full rounded-xl border bg-background-warm px-4 text-[15px] text-text outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10";
  const stateClass = field.touched
    ? error
      ? "border-red-400"
      : isValid
      ? "border-emerald-400"
      : "border-gray-200"
    : "border-gray-200";

  return (
    <div className="float-field relative">
      {textarea ? (
        <textarea
          id={id}
          rows={5}
          placeholder=" "
          value={field.value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={`${baseClass} ${stateClass} pt-7 pb-3`}
        />
      ) : (
        <input
          id={id}
          type={type}
          required={required}
          placeholder=" "
          value={field.value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={`${baseClass} ${stateClass} h-14`}
        />
      )}
      <label htmlFor={id}>
        {label}
        {required && " *"}
      </label>
      {field.touched && !textarea && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2">
          {isValid && !error && (
            <Check size={16} className="text-emerald-500" />
          )}
        </span>
      )}
      {field.touched && error && (
        <p className="mt-1.5 text-[13px] text-red-500">{error}</p>
      )}
    </div>
  );
}

export default function KontaktClient() {
  const router = useRouter();
  const [fields, setFields] = useState({
    navn: { value: "", touched: false },
    epost: { value: "", touched: false },
    telefon: { value: "", touched: false },
    sted: { value: "", touched: false },
    tjeneste: { value: "", touched: false },
    melding: { value: "", touched: false },
  });
  const [honeypot, setHoneypot] = useState("");
  const [sending, setSending] = useState(false);
  const [apiError, setApiError] = useState("");

  const updateField = useCallback((name: string, value: string) => {
    setFields((prev) => ({ ...prev, [name]: { ...prev[name as keyof typeof prev], value } }));
  }, []);

  const touchField = useCallback((name: string) => {
    setFields((prev) => ({ ...prev, [name]: { ...prev[name as keyof typeof prev], touched: true } }));
  }, []);

  const errors = {
    navn: validateField("navn", fields.navn.value),
    epost: validateField("epost", fields.epost.value),
    telefon: validateField("telefon", fields.telefon.value),
  };

  const isFormValid = !errors.navn && !errors.epost && !errors.telefon;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;
    if (!isFormValid) {
      setFields((prev) => ({
        ...prev,
        navn: { ...prev.navn, touched: true },
        epost: { ...prev.epost, touched: true },
        telefon: { ...prev.telefon, touched: true },
      }));
      return;
    }

    setSending(true);
    setApiError("");
    trackEvent("form_submit");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          navn: fields.navn.value,
          epost: fields.epost.value,
          telefon: fields.telefon.value,
          sted: fields.sted.value,
          tjeneste: fields.tjeneste.value,
          melding: fields.melding.value,
          website: honeypot,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.error || "Noe gikk galt. Prøv igjen.");
        setSending(false);
        return;
      }

      router.push("/takk");
    } catch {
      setApiError("Kunne ikke sende. Sjekk internettforbindelsen din eller ring oss direkte.");
      setSending(false);
    }
  };

  return (
    <>
      <PageHero
        label="Kontakt"
        title="Kontakt oss"
        subtitle="Vi svarer innen 24 timer."
      />

      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
            <SectionReveal className="lg:col-span-3">
              <h2 className="text-2xl font-bold tracking-[-0.03em] text-text">
                Send oss en melding
              </h2>
              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                <div className="absolute -left-[9999px]" aria-hidden="true">
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <FloatingField
                    id="navn"
                    label="Navn"
                    required
                    field={fields.navn}
                    error={fields.navn.touched ? errors.navn : ""}
                    isValid={!errors.navn && fields.navn.value.length > 0}
                    onChange={(v) => updateField("navn", v)}
                    onBlur={() => touchField("navn")}
                  />
                  <FloatingField
                    id="epost"
                    label="E-post"
                    type="email"
                    required
                    field={fields.epost}
                    error={fields.epost.touched ? errors.epost : ""}
                    isValid={!errors.epost && fields.epost.value.length > 0}
                    onChange={(v) => updateField("epost", v)}
                    onBlur={() => touchField("epost")}
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <FloatingField
                    id="telefon"
                    label="Telefon"
                    type="tel"
                    required
                    field={fields.telefon}
                    error={fields.telefon.touched ? errors.telefon : ""}
                    isValid={!errors.telefon && fields.telefon.value.length > 0}
                    onChange={(v) => updateField("telefon", v)}
                    onBlur={() => touchField("telefon")}
                  />
                  <FloatingField
                    id="sted"
                    label="Postnummer / sted"
                    field={fields.sted}
                    error=""
                    isValid={false}
                    onChange={(v) => updateField("sted", v)}
                    onBlur={() => touchField("sted")}
                  />
                </div>

                <div>
                  <label htmlFor="tjeneste" className="mb-1.5 block text-[11px] font-semibold tracking-widest text-text-secondary uppercase">
                    Tjeneste
                  </label>
                  <select
                    id="tjeneste"
                    value={fields.tjeneste.value}
                    onChange={(e) => updateField("tjeneste", e.target.value)}
                    className="w-full appearance-none rounded-xl border border-gray-200 bg-background-warm px-4 py-3.5 text-[15px] text-text outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
                  >
                    <option value="">Velg tjeneste (valgfritt)</option>
                    {tjenesteListe.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <FloatingField
                  id="melding"
                  label="Melding"
                  textarea
                  field={fields.melding}
                  error=""
                  isValid={false}
                  onChange={(v) => updateField("melding", v)}
                  onBlur={() => touchField("melding")}
                />

                <button
                  type="submit"
                  disabled={sending || (!isFormValid && (fields.navn.touched || fields.epost.touched || fields.telefon.touched))}
                  className={`btn-glow inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-[15px] font-semibold text-white transition-all duration-300 hover:bg-primary-dark disabled:opacity-50 disabled:hover:transform-none disabled:cursor-not-allowed`}
                >
                  {sending ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Sender...
                    </>
                  ) : (
                    <>
                      Send henvendelse <ArrowRight size={16} />
                    </>
                  )}
                </button>
                {apiError && (
                  <p className="mt-3 text-[14px] text-red-500">{apiError}</p>
                )}
              </form>
            </SectionReveal>

            <SectionReveal className="lg:col-span-2">
              <div className="rounded-3xl border border-gray-100/80 bg-background-warm p-8 lg:p-10">
                <h3 className="text-lg font-bold tracking-[-0.03em] text-text">
                  Kontaktinformasjon
                </h3>
                <ul className="mt-8 space-y-6">
                  {kontaktInfo.map((item) => {
                    const Icon = item.icon;
                    const content = (
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
                          <Icon size={18} className="text-primary" />
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-text-secondary">{item.label}</p>
                          <p className="mt-0.5 text-[15px] font-medium text-text">{item.value}</p>
                        </div>
                      </div>
                    );
                    if (item.href) {
                      return (
                        <li key={item.label}>
                          <a
                            href={item.href}
                            onClick={item.href.startsWith("tel:") ? (e: React.MouseEvent) => {
                          if (window.innerWidth >= 768) {
                            e.preventDefault();
                            copyAndToast("968 23 647", "Telefonnummer kopiert!");
                          }
                          trackEvent("phone_click", { location: "contact" });
                        } : undefined}
                            className="block transition-opacity duration-200 hover:opacity-70"
                          >
                            {content}
                          </a>
                        </li>
                      );
                    }
                    return <li key={item.label}>{content}</li>;
                  })}
                </ul>
              </div>

              {/* Aleksandra with EV machine */}
              <div className="mt-8">
                <div className="photo-frame">
                  <div className="photo-frame-bg" />
                  <Image
                    src="/images/aleksandra-bil.webp"
                    alt="Aleksandra viser EV-dampmaskin i aksjon, Færder Multiservice"
                    width={600}
                    height={400}
                    quality={85}
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="w-full"
                  />
                </div>
                <p className="mt-3 text-center text-[13px] text-text-secondary">
                  Aleksandra viser EV-dampmaskin i aksjon
                </p>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      <section className="pb-24 lg:pb-32">
        <SectionReveal className="mx-auto max-w-[1200px] px-6">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2038.5!2d10.4044!3d59.2264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSmormeien+1%2C+3116+N%C3%B8tter%C3%B8y!5e0!3m2!1sno!2sno!4v1"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
            title="Kart til Færder Multiservice, Nøtterøy, Vestfold"
          />
        </SectionReveal>
      </section>
    </>
  );
}

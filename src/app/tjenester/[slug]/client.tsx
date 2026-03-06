"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, ArrowRight, Phone, Loader2, Share2 } from "lucide-react";
import type { Service } from "@/data/services";
import { getServiceConfig, type ServiceConfig, type ConfigStep, type ConfigAddon, type PriceRange } from "@/data/configurator";
import { trackEvent } from "@/lib/tracking";
import { copyAndToast } from "@/lib/toast";
import { ScrollProgress } from "@/components/ScrollProgress";

// ── Animated number hook ──
function useAnimatedNum(target: number) {
  const [display, setDisplay] = useState(target);
  const prev = useRef(target);

  useEffect(() => {
    if (target === prev.current) { setDisplay(target); return; }
    const from = prev.current;
    prev.current = target;
    const start = performance.now();
    const dur = 800;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (target - from) * e));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target]);

  return display;
}

// ── Sticky detection hook ──
function useStickyDetect(topOffset = 96) {
  const ref = useRef<HTMLDivElement>(null);
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsStuck(!entry.isIntersecting),
      { rootMargin: `-${topOffset + 1}px 0px 0px 0px`, threshold: 1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [topOffset]);

  return { ref, isStuck };
}

// ── Option Card ──
function OptionCard({
  label,
  sublabel,
  priceHint,
  selected,
  onClick,
}: {
  label: string;
  sublabel?: string;
  priceHint?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative rounded-2xl border-2 px-4 py-4 text-left transition-all duration-200 ${
        selected
          ? "border-primary bg-white shadow-[0_2px_12px_rgba(232,114,28,0.1)]"
          : "border-gray-100 bg-white hover:border-gray-200"
      }`}
    >
      {selected && (
        <div className="absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
          <Check size={11} strokeWidth={3} className="text-white" />
        </div>
      )}
      <span className="block text-[14px] font-semibold text-text">{label}</span>
      {sublabel && (
        <span className="mt-0.5 block text-[12px] text-text-secondary">{sublabel}</span>
      )}
      {priceHint && (
        <span className="mt-1 block text-[12px] font-medium text-primary">{priceHint}</span>
      )}
    </button>
  );
}

// ── Addon Checkbox ──
function AddonItem({
  addon,
  active,
  onToggle,
  onSubSelect,
}: {
  addon: ConfigAddon;
  active: string | boolean | undefined;
  onToggle: () => void;
  onSubSelect: (subId: string) => void;
}) {
  const isActive = !!active;
  const hasSubOptions = !!addon.subOptions;

  return (
    <div>
      <button
        onClick={onToggle}
        className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all duration-200 ${
          isActive
            ? "border-primary/30 bg-primary/5"
            : "border-gray-100 bg-white hover:border-gray-200"
        }`}
      >
        <div
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all duration-200 ${
            isActive ? "border-primary bg-primary" : "border-gray-300"
          }`}
        >
          {isActive && <Check size={12} strokeWidth={3} className="text-white" />}
        </div>
        <span className="flex-1 text-[15px] text-text">{addon.label}</span>
        {addon.priceHint && (
          <span className="shrink-0 text-[13px] font-medium text-primary">{addon.priceHint}</span>
        )}
      </button>

      {/* Sub-options (shown when active & has sub-options) */}
      {hasSubOptions && isActive && (
        <div className="mt-2 ml-8 flex flex-wrap gap-2">
          {addon.subOptions!.map((sub) => (
            <button
              key={sub.id}
              onClick={() => onSubSelect(sub.id)}
              className={`rounded-lg border-2 px-3 py-1.5 text-[13px] font-medium transition-all duration-200 ${
                active === sub.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-gray-200 text-text-secondary hover:border-gray-300"
              }`}
            >
              {sub.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Step Section ──
function StepSection({
  step,
  value,
  onChange,
  selections,
}: {
  step: ConfigStep;
  value: string | undefined;
  onChange: (id: string) => void;
  selections: Record<string, string>;
}) {
  // Resolve dynamic options
  let options = step.options;
  if (step.dependsOn) {
    const depValue = selections[step.dependsOn];
    if (!depValue) {
      return (
        <div>
          <h3 className="text-[13px] font-semibold tracking-wide text-text-secondary uppercase">
            {step.title} {step.required && <span className="text-primary">*</span>}
          </h3>
          <p className="mt-3 text-[14px] text-text-secondary">
            Velg {step.dependsOn === "boligtype" ? "boligtype" : "forrige steg"} først
          </p>
        </div>
      );
    }
    // Auto-value: skip rendering
    if (step.autoValue?.[depValue]) return null;
    // Dynamic options
    if (step.dynamicOptions?.[depValue]) {
      options = step.dynamicOptions[depValue];
    }
  }

  if (options.length === 0) return null;

  return (
    <div>
      <h3 className="text-[13px] font-semibold tracking-wide text-text-secondary uppercase">
        {step.title} {step.required && <span className="text-primary">*</span>}
      </h3>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {options.map((opt) => (
          <OptionCard
            key={opt.id}
            label={opt.label}
            sublabel={opt.sublabel}
            priceHint={opt.priceHint}
            selected={value === opt.id}
            onClick={() => onChange(opt.id)}
          />
        ))}
      </div>
    </div>
  );
}

// ── Lead Form ──
const tidspunktValg = ["Formiddag", "Ettermiddag", "Fleksibel"];

function LeadForm({
  tjeneste,
  serviceSlug,
  selectionRows,
  activeAddonLabels,
  estimertPris,
}: {
  tjeneste: string;
  serviceSlug: string;
  selectionRows: { label: string; value: string }[];
  activeAddonLabels: string[];
  estimertPris: string;
}) {
  const router = useRouter();
  const [fields, setFields] = useState({ navn: "", telefon: "", postnr: "", tidspunkt: "" });
  const [honeypot, setHoneypot] = useState("");
  const [sending, setSending] = useState(false);
  const [apiError, setApiError] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;
    if (!fields.navn.trim() || !fields.telefon.trim()) return;

    setSending(true);
    setApiError("");
    trackEvent("lead_submit", { service: serviceSlug });

    try {
      const valg: Record<string, string> = {};
      for (const row of selectionRows) {
        valg[row.label] = row.value;
      }

      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          navn: fields.navn,
          telefon: fields.telefon,
          postnummer: fields.postnr,
          tidspunkt: fields.tidspunkt,
          tjeneste,
          valg,
          tillegg: activeAddonLabels,
          estimertPris,
          website: honeypot,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.error || "Noe gikk galt. Prøv igjen.");
        setSending(false);
        return;
      }

      router.push("/takk/tilbud");
    } catch {
      setApiError("Kunne ikke sende. Sjekk internettforbindelsen din eller ring oss direkte.");
      setSending(false);
    }
  };

  const inputClass = "h-12 w-full rounded-xl border border-gray-200 bg-background-warm px-4 text-[14px] text-text outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Honeypot */}
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

      <div className="float-field">
        <input
          id="lead-navn"
          ref={nameRef}
          type="text"
          placeholder=" "
          required
          value={fields.navn}
          onChange={(e) => setFields((p) => ({ ...p, navn: e.target.value }))}
          className={inputClass}
        />
        <label htmlFor="lead-navn">Navn *</label>
      </div>
      <div className="float-field">
        <input
          id="lead-telefon"
          type="tel"
          placeholder=" "
          required
          value={fields.telefon}
          onChange={(e) => setFields((p) => ({ ...p, telefon: e.target.value }))}
          className={inputClass}
        />
        <label htmlFor="lead-telefon">Telefon *</label>
      </div>
      <div className="float-field">
        <input
          id="lead-postnr"
          type="text"
          placeholder=" "
          value={fields.postnr}
          onChange={(e) => setFields((p) => ({ ...p, postnr: e.target.value }))}
          className={inputClass}
        />
        <label htmlFor="lead-postnr">Postnummer</label>
      </div>
      <select
        id="lead-tidspunkt"
        aria-label="Foretrukket tidspunkt"
        value={fields.tidspunkt}
        onChange={(e) => setFields((p) => ({ ...p, tidspunkt: e.target.value }))}
        className="w-full appearance-none rounded-xl border border-gray-200 bg-background-warm px-4 py-3 text-[14px] text-text outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
      >
        <option value="">Foretrukket tidspunkt (valgfritt)</option>
        {tidspunktValg.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
      <button
        type="submit"
        disabled={sending}
        className="btn-glow flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-[14px] font-semibold text-white disabled:opacity-50"
      >
        {sending ? (
          <>
            <Loader2 size={14} className="animate-spin" /> Sender...
          </>
        ) : (
          <>
            Send forespørsel <ArrowRight size={14} />
          </>
        )}
      </button>
      {apiError && (
        <p className="text-[13px] text-red-500">{apiError}</p>
      )}
    </form>
  );
}

// ── Summary Card ──
function SummaryCard({
  service,
  config,
  selections,
  addons,
  price,
  allRequiredDone,
  included,
}: {
  service: Service;
  config: ServiceConfig;
  selections: Record<string, string>;
  addons: Record<string, string | boolean>;
  price: PriceRange | null;
  allRequiredDone: boolean;
  included: string[];
}) {
  const [showForm, setShowForm] = useState(false);
  const [showIncluded, setShowIncluded] = useState(false);
  const [showPling, setShowPling] = useState(false);
  const [shimmerKey, setShimmerKey] = useState(0);
  const prevPrice = useRef<string>("");
  const animMin = useAnimatedNum(price?.min ?? 0);
  const animMax = useAnimatedNum(price?.max ?? 0);

  // Detect price changes for shimmer + first-time pling
  useEffect(() => {
    if (!price) return;
    const key = `${price.min}-${price.max}`;
    if (prevPrice.current && prevPrice.current !== key) {
      setShimmerKey((k) => k + 1);
    }
    if (!prevPrice.current && key) {
      setShowPling(true);
      setTimeout(() => setShowPling(false), 700);
    }
    prevPrice.current = key;
  }, [price]);

  const activeAddonLabels: string[] = [];
  for (const addon of config.addons) {
    if (addons[addon.id]) {
      let label = addon.label;
      if (addon.subOptions && typeof addons[addon.id] === "string") {
        const sub = addon.subOptions.find((s) => s.id === addons[addon.id]);
        if (sub) label += ` (${sub.label})`;
      }
      activeAddonLabels.push(label);
    }
  }

  const selectionRows: { label: string; value: string }[] = [];
  for (const step of config.steps) {
    if (selections[step.id]) {
      // Search static options first, then dynamic options
      let opt = step.options.find((o) => o.id === selections[step.id]);
      if (!opt && step.dynamicOptions) {
        for (const dynOpts of Object.values(step.dynamicOptions)) {
          opt = dynOpts.find((o) => o.id === selections[step.id]);
          if (opt) break;
        }
      }
      if (opt) selectionRows.push({ label: step.title, value: opt.label });
    }
  }

  return (
    <div className={`sticky-snap sticky top-24 rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] sm:p-8 ${allRequiredDone ? "is-stuck" : ""}`}>
      <p className="text-[11px] font-semibold tracking-widest text-text-secondary uppercase">
        Din oppsummering
      </p>

      <p className="mt-4 text-[16px] font-bold tracking-tight text-text">
        {service.name}
      </p>

      {/* Selection rows */}
      {selectionRows.length > 0 && (
        <div className="mt-4 border-t border-gray-100 pt-4 space-y-2">
          {selectionRows.map((row) => (
            <div key={row.label} className="flex items-center justify-between text-[14px]">
              <span className="text-text-secondary">{row.label}</span>
              <span className="font-medium text-text">{row.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Addons */}
      {activeAddonLabels.length > 0 && (
        <div className="mt-4 border-t border-gray-100 pt-4">
          <p className="text-[12px] font-semibold tracking-wide text-text-secondary uppercase">
            Tillegg
          </p>
          <ul className="mt-2 space-y-1.5">
            {activeAddonLabels.map((label) => (
              <li key={label} className="flex items-center gap-2 text-[14px] text-text">
                <Check size={14} className="shrink-0 text-emerald-500" />
                {label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Price */}
      <div className="mt-5 border-t border-gray-100 pt-5">
        <p className="text-[12px] font-semibold tracking-wide text-text-secondary uppercase">
          Estimert pris
        </p>
        {price ? (
          <p className={`mt-2 text-center ${showPling ? "price-pling" : ""}`}>
            <span key={shimmerKey} className="price-shimmer inline-block text-2xl font-bold tracking-tight text-primary sm:text-3xl">
              {animMin === animMax
                ? animMin.toLocaleString("nb-NO")
                : `${animMin.toLocaleString("nb-NO")} – ${animMax.toLocaleString("nb-NO")}`}
            </span>
            <span className="ml-1.5 text-[14px] text-text-secondary">{price.period}</span>
          </p>
        ) : (
          <p className="mt-2 text-center text-[15px] text-text-secondary">
            Velg alle feltene for estimat
          </p>
        )}
      </div>

      <p className="mt-3 text-[12px] text-text-secondary">
        Estimat eks. mva. Endelig pris kan endre seg etter befaring.
      </p>

      {/* Share estimate */}
      {price && (
        <button
          onClick={() => {
            const lines = [
              `Estimat – ${service.name}`,
              ...selectionRows.map((r) => `${r.label}: ${r.value}`),
              ...(activeAddonLabels.length > 0 ? [`Tillegg: ${activeAddonLabels.join(", ")}`] : []),
              `Estimert pris: ${price.min === price.max ? price.min.toLocaleString("nb-NO") : `${price.min.toLocaleString("nb-NO")} – ${price.max.toLocaleString("nb-NO")}`} ${price.period}`,
              `\nfaerdermultiservice.no/tjenester/${service.slug}`,
            ];
            copyAndToast(lines.join("\n"), "Estimat kopiert!");
          }}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-gray-200 py-2.5 text-[13px] font-medium text-text-secondary transition-all duration-200 hover:border-gray-300 hover:text-text"
        >
          <Share2 size={14} /> Del estimat
        </button>
      )}

      {/* Hva er inkludert — compact list */}
      {included.length > 0 && (
        <div className="mt-5 border-t border-gray-100 pt-5">
          <p className="text-[12px] font-semibold tracking-wide text-text-secondary uppercase">
            Inkludert
          </p>
          <ul className="mt-3 space-y-1.5">
            {included.slice(0, showIncluded ? included.length : 4).map((item) => (
              <li key={item} className="flex items-start gap-2 text-[13px] leading-[1.5] text-text-secondary">
                <Check size={12} className="mt-0.5 shrink-0 text-primary" />
                {item}
              </li>
            ))}
          </ul>
          {included.length > 4 && (
            <button
              onClick={() => setShowIncluded((p) => !p)}
              className="mt-2 text-[13px] font-medium text-primary transition-colors hover:text-primary-dark"
            >
              {showIncluded ? "Vis mindre ↑" : `Se alt inkludert (${included.length}) ↓`}
            </button>
          )}
        </div>
      )}

      {/* CTA / Lead Form */}
      {!showForm ? (
        <>
          <button
            onClick={() => allRequiredDone && setShowForm(true)}
            disabled={!allRequiredDone}
            className={`btn-shimmer mt-6 flex w-full items-center justify-center gap-2 rounded-full py-4 text-[15px] font-semibold text-white transition-all duration-300 ${
              allRequiredDone
                ? "btn-glow bg-primary"
                : "cursor-not-allowed bg-gray-300"
            }`}
          >
            Få tilbud <ArrowRight size={16} />
          </button>
          <a
            href="tel:+4796823647"
            onClick={() => trackEvent("phone_click", { location: "service_page" })}
            className="btn-outline mt-3 flex w-full items-center justify-center gap-2 rounded-full border-2 border-gray-200 py-4 text-[15px] font-medium text-text-secondary hover:border-gray-300 hover:text-text"
          >
            <Phone size={15} /> Eller ring: 968 23 647
          </a>
        </>
      ) : (
        <div className="mt-6 border-t border-gray-100 pt-5">
          <p className="mb-1 text-[15px] font-semibold text-text">
            Vi ringer deg med en pris
          </p>
          <p className="mb-4 text-[13px] text-text-secondary">
            Fyll inn, så tar vi kontakt.
          </p>
          <LeadForm
            tjeneste={service.name}
            serviceSlug={service.slug}
            selectionRows={selectionRows}
            activeAddonLabels={activeAddonLabels}
            estimertPris={
              price
                ? price.min === price.max
                  ? `${price.min.toLocaleString("nb-NO")} ${price.period}`
                  : `${price.min.toLocaleString("nb-NO")} – ${price.max.toLocaleString("nb-NO")} ${price.period}`
                : ""
            }
          />
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════
// Main Configurator
// ═══════════════════════════════════════════════
export function ServicePageClient({ service }: { service: Service }) {
  const config = getServiceConfig(service.slug);

  const [selections, setSelections] = useState<Record<string, string>>({});
  const [addons, setAddons] = useState<Record<string, string | boolean>>({});
  const estimatorStarted = useRef(false);
  const estimatorCompleted = useRef(false);

  const setSelection = useCallback((stepId: string, optId: string) => {
    if (!estimatorStarted.current) {
      estimatorStarted.current = true;
      trackEvent("estimator_start", { service: service.slug });
    }
    setSelections((prev) => {
      const next = { ...prev, [stepId]: optId };

      // If this step is depended on by other steps, reset those & apply auto-values
      if (config) {
        for (const step of config.steps) {
          if (step.dependsOn === stepId) {
            // Check if current value is still valid for the new dynamic options
            const dynOpts = step.dynamicOptions?.[optId];
            const auto = step.autoValue?.[optId];
            if (auto) {
              next[step.id] = auto;
            } else if (dynOpts && prev[step.id]) {
              const stillValid = dynOpts.some((o) => o.id === prev[step.id]);
              if (!stillValid) delete next[step.id];
            } else {
              delete next[step.id];
            }
          }
        }
      }

      return next;
    });
  }, [config]);

  const toggleAddon = useCallback((addonId: string) => {
    setAddons((prev) => {
      const copy = { ...prev };
      if (copy[addonId]) {
        delete copy[addonId];
      } else {
        copy[addonId] = true;
      }
      return copy;
    });
  }, []);

  const setAddonSub = useCallback((addonId: string, subId: string) => {
    setAddons((prev) => ({ ...prev, [addonId]: subId }));
  }, []);

  if (!config) {
    return (
      <section className="bg-background-warm pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="mx-auto max-w-[1200px] px-6">
          <h1 className="text-3xl font-bold text-text">{service.name}</h1>
          <p className="mt-4 text-text-secondary">{service.longDescription}</p>
        </div>
      </section>
    );
  }

  // Build effective selections (include auto-values)
  const effectiveSelections = { ...selections };
  for (const step of config.steps) {
    if (step.dependsOn && step.autoValue) {
      const depVal = effectiveSelections[step.dependsOn];
      if (depVal && step.autoValue[depVal]) {
        effectiveSelections[step.id] = step.autoValue[depVal];
      }
    }
  }

  const price = config.calculatePrice(effectiveSelections, addons);
  const requiredSteps = config.steps.filter((s) => s.required);
  const completedRequired = requiredSteps.filter((s) => effectiveSelections[s.id]).length;
  const allRequiredDone = completedRequired === requiredSteps.length;
  const progress = requiredSteps.length > 0 ? completedRequired / requiredSteps.length : 0;

  // Track estimator completion (fires once when user first sees a price)
  useEffect(() => {
    if (allRequiredDone && price && !estimatorCompleted.current) {
      estimatorCompleted.current = true;
      const priceStr =
        price.min === price.max
          ? `${price.min.toLocaleString("nb-NO")} ${price.period}`
          : `${price.min.toLocaleString("nb-NO")}–${price.max.toLocaleString("nb-NO")} ${price.period}`;
      trackEvent("estimator_complete", { service: service.slug, price: priceStr });
    }
  }, [allRequiredDone, price, service.slug]);

  return (
    <section className="bg-background-warm pt-32 pb-20 lg:pt-40 lg:pb-28">
      <ScrollProgress />
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] text-text-secondary">
          <Link href="/" className="transition-colors duration-200 hover:text-primary">Hjem</Link>
          <span>/</span>
          <Link href="/tjenester" className="transition-colors duration-200 hover:text-primary">Tjenester</Link>
          <span>/</span>
          <span className="text-text">{service.name}</span>
        </div>

        {/* Title */}
        <div className="mt-8">
          <p className="text-[13px] font-medium tracking-widest text-primary uppercase">
            {service.name}
          </p>
          <h1 className="mt-3 text-[clamp(2rem,4vw,3.25rem)] font-bold tracking-[-0.04em] leading-[1.1] text-text">
            Sett sammen din{service.slug === "fast-vask" ? " faste vask" : ` ${service.name.toLowerCase()}`}
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-[1.7] text-text-secondary line-clamp-2">
            {service.description}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mt-8">
          <div className="flex items-center justify-between text-[13px] text-text-secondary">
            <span>
              {completedRequired} av {requiredSteps.length} valg
            </span>
            <span>{Math.round(progress * 100)}%</span>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>

        {/* Main grid: configurator + summary */}
        <div className="mt-10 grid gap-12 lg:grid-cols-5 lg:gap-16">
          {/* Left: steps + addons */}
          <div className="space-y-10 lg:col-span-3">
            {config.steps.map((step) => (
              <StepSection
                key={step.id}
                step={step}
                value={selections[step.id]}
                onChange={(optId) => setSelection(step.id, optId)}
                selections={selections}
              />
            ))}

            {config.addons.length > 0 && (
              <div>
                <h3 className="text-[13px] font-semibold tracking-wide text-text-secondary uppercase">
                  Tillegg <span className="normal-case font-normal">(valgfritt)</span>
                </h3>
                <div className="mt-3 space-y-2">
                  {config.addons.map((addon) => (
                    <AddonItem
                      key={addon.id}
                      addon={addon}
                      active={addons[addon.id]}
                      onToggle={() => toggleAddon(addon.id)}
                      onSubSelect={(subId) => setAddonSub(addon.id, subId)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: summary */}
          <div className="lg:col-span-2">
            <SummaryCard
              service={service}
              config={config}
              selections={effectiveSelections}
              addons={addons}
              price={price}
              allRequiredDone={allRequiredDone}
              included={service.included}
            />
          </div>
        </div>

        {/* Back link */}
        <div className="mt-16 border-t border-gray-100 pt-8">
          <Link
            href="/tjenester"
            className="inline-flex items-center gap-2 text-[15px] font-medium text-text-secondary transition-colors duration-200 hover:text-primary"
          >
            ← Tilbake til alle tjenester
          </Link>
        </div>
      </div>
    </section>
  );
}

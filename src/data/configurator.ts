// ═══════════════════════════════════════════════
// Service Configurator — options & pricing logic
// ═══════════════════════════════════════════════

export interface ConfigOption {
  id: string;
  label: string;
  sublabel?: string;
  priceHint?: string;
}

export interface ConfigStep {
  id: string;
  title: string;
  options: ConfigOption[];
  required: boolean;
  /** Step ID whose value determines which dynamic options to show */
  dependsOn?: string;
  /** Options keyed by the depended step's value */
  dynamicOptions?: Record<string, ConfigOption[]>;
  /** Auto-select a value and hide the step, keyed by depended step's value */
  autoValue?: Record<string, string>;
}

export interface ConfigAddon {
  id: string;
  label: string;
  priceHint?: string;
  subOptions?: ConfigOption[];
}

export interface PriceRange {
  min: number;
  max: number;
  period: string;
}

export interface ServiceConfig {
  steps: ConfigStep[];
  addons: ConfigAddon[];
  calculatePrice: (
    selections: Record<string, string>,
    activeAddons: Record<string, string | boolean>
  ) => PriceRange | null;
}

// ── Helpers ──
type R = [number, number];
const sc = (r: R, m: number): R => [Math.round(r[0] * m), Math.round(r[1] * m)];
const ad = (r: R, a: number): R => [r[0] + a, r[1] + a];

// ── Shared: Boligtype ──
const BOLIG: ConfigOption[] = [
  { id: "hybel", label: "Hybel", priceHint: "Laveste pris" },
  { id: "leilighet", label: "Leilighet" },
  { id: "rekkehus", label: "Rekkehus" },
  { id: "enebolig", label: "Hus" },
  { id: "villa", label: "Villa" },
  { id: "penthouse", label: "Penthouse" },
];

// ── Shared: Størrelse per boligtype ──
const SIZE_BY_BOLIG: Record<string, ConfigOption[]> = {
  hybel: [
    { id: "under-25", label: "Under 25 m²" },
    { id: "25-40", label: "25–40 m²" },
  ],
  leilighet: [
    { id: "30-50", label: "30–50 m²" },
    { id: "50-80", label: "50–80 m²" },
    { id: "80-120", label: "80–120 m²" },
  ],
  rekkehus: [
    { id: "80-120", label: "80–120 m²" },
    { id: "120-160", label: "120–160 m²" },
    { id: "160-200", label: "160–200 m²" },
  ],
  enebolig: [
    { id: "100-150", label: "100–150 m²" },
    { id: "150-200", label: "150–200 m²" },
    { id: "200-300", label: "200–300 m²" },
  ],
  villa: [
    { id: "200-300", label: "200–300 m²" },
    { id: "300-400", label: "300–400 m²" },
    { id: "over-400", label: "Over 400 m²" },
  ],
  penthouse: [
    { id: "80-120", label: "80–120 m²" },
    { id: "120-200", label: "120–200 m²" },
  ],
};

// ── Shared: Bad per boligtype ──
const BATH_BY_BOLIG: Record<string, ConfigOption[]> = {
  // hybel: auto 1 (handled by autoValue)
  leilighet: [
    { id: "1", label: "1 bad", priceHint: "Inkludert" },
    { id: "2", label: "2 bad" },
    { id: "3+", label: "3+ bad" },
  ],
  rekkehus: [
    { id: "1", label: "1 bad", priceHint: "Inkludert" },
    { id: "2", label: "2 bad" },
    { id: "3+", label: "3+ bad" },
  ],
  enebolig: [
    { id: "1", label: "1 bad", priceHint: "Inkludert" },
    { id: "2", label: "2 bad" },
    { id: "3+", label: "3+ bad" },
  ],
  villa: [
    { id: "1", label: "1 bad", priceHint: "Inkludert" },
    { id: "2", label: "2 bad" },
    { id: "3", label: "3 bad" },
    { id: "4+", label: "4+ bad" },
  ],
  penthouse: [
    { id: "1", label: "1 bad", priceHint: "Inkludert" },
    { id: "2", label: "2 bad" },
    { id: "3", label: "3 bad" },
    { id: "4+", label: "4+ bad" },
  ],
};

const BATH_AUTO: Record<string, string> = { hybel: "1" };

// ═══════════════════════════════════════════════
// 1. FAST VASK
// ═══════════════════════════════════════════════
const fastVask: ServiceConfig = {
  steps: [
    {
      id: "frekvens",
      title: "Frekvens",
      required: true,
      options: [
        { id: "ukentlig", label: "Ukentlig", priceHint: "Spar 15 %" },
        { id: "annenhver", label: "Annenhver uke", sublabel: "Standard" },
        { id: "manedlig", label: "Månedlig", priceHint: "+15 %" },
        { id: "engang", label: "Engangsvask", priceHint: "+25 %" },
      ],
    },
    { id: "boligtype", title: "Boligtype", required: true, options: BOLIG },
    {
      id: "storrelse",
      title: "Størrelse",
      required: true,
      options: [],
      dependsOn: "boligtype",
      dynamicOptions: SIZE_BY_BOLIG,
    },
    {
      id: "bad",
      title: "Antall bad",
      required: true,
      options: [],
      dependsOn: "boligtype",
      dynamicOptions: BATH_BY_BOLIG,
      autoValue: BATH_AUTO,
    },
  ],
  addons: [
    { id: "skap", label: "Innvendig i skap og skuffer", priceHint: "+300 kr" },
    { id: "stekeovn", label: "Stekeovn og kjøleskap", priceHint: "+250 kr" },
    { id: "vinduer", label: "Vinduer innvendig", priceHint: "+350 kr" },
    { id: "balkong", label: "Balkong / terrasse", priceHint: "+250 kr" },
    { id: "stryking", label: "Stryking av klær", priceHint: "+200 kr" },
    { id: "klesvask", label: "Klesvask (1 maskin)", priceHint: "+150 kr" },
  ],
  calculatePrice(sel, addons) {
    const key = `${sel.boligtype}-${sel.storrelse}`;
    const base: Record<string, R> = {
      "hybel-under-25": [550, 650], "hybel-25-40": [650, 800],
      "leilighet-30-50": [800, 1000], "leilighet-50-80": [1000, 1300], "leilighet-80-120": [1300, 1650],
      "rekkehus-80-120": [1400, 1700], "rekkehus-120-160": [1700, 2100], "rekkehus-160-200": [2100, 2600],
      "enebolig-100-150": [1500, 1900], "enebolig-150-200": [1900, 2400], "enebolig-200-300": [2400, 3000],
      "villa-200-300": [2600, 3200], "villa-300-400": [3200, 4000], "villa-over-400": [4000, 5200],
      "penthouse-80-120": [1400, 1800], "penthouse-120-200": [1800, 2500],
    };

    const b = base[key];
    if (!b || !sel.frekvens || !sel.bad) return null;

    const freqMult: Record<string, number> = { ukentlig: 0.85, annenhver: 1.0, manedlig: 1.15, engang: 1.25 };
    let r = sc(b, freqMult[sel.frekvens] ?? 1);

    // Extra bath: +150 kr per bath beyond 1
    const bathExtra: Record<string, number> = { "1": 0, "2": 150, "3": 300, "3+": 300, "4+": 450 };
    r = ad(r, bathExtra[sel.bad] ?? 0);

    const ac: Record<string, number> = { skap: 300, stekeovn: 250, vinduer: 350, balkong: 250, stryking: 200, klesvask: 150 };
    for (const [k, v] of Object.entries(addons)) { if (v && ac[k]) r = ad(r, ac[k]); }

    return { min: r[0], max: r[1], period: sel.frekvens === "engang" ? "kr" : "kr/gang" };
  },
};

// ═══════════════════════════════════════════════
// 2. FLYTTEVASK
// ═══════════════════════════════════════════════
const FLYTTE_SIZE: Record<string, ConfigOption[]> = {
  hybel: [
    { id: "under-25", label: "Under 25 m²" },
    { id: "25-40", label: "25–40 m²" },
  ],
  leilighet: [
    { id: "30-50", label: "30–50 m²" },
    { id: "50-80", label: "50–80 m²" },
    { id: "80-120", label: "80–120 m²" },
  ],
  rekkehus: [
    { id: "80-120", label: "80–120 m²" },
    { id: "120-160", label: "120–160 m²" },
    { id: "160-200", label: "160–200 m²" },
  ],
  enebolig: [
    { id: "100-150", label: "100–150 m²" },
    { id: "150-200", label: "150–200 m²" },
    { id: "200-300", label: "200–300 m²" },
  ],
  villa: [
    { id: "200-300", label: "200–300 m²" },
    { id: "300-400", label: "300–400 m²" },
    { id: "over-400", label: "Over 400 m²" },
  ],
  penthouse: [
    { id: "80-120", label: "80–120 m²" },
    { id: "120-200", label: "120–200 m²" },
  ],
};

const flyttevask: ServiceConfig = {
  steps: [
    {
      id: "type",
      title: "Type flyttevask",
      required: true,
      options: [
        { id: "utvask", label: "Utvask", sublabel: "Flytter ut", priceHint: "Standard" },
        { id: "innvask", label: "Innvask", sublabel: "Flytter inn", priceHint: "−20 %" },
      ],
    },
    { id: "boligtype", title: "Boligtype", required: true, options: BOLIG },
    {
      id: "storrelse",
      title: "Størrelse",
      required: true,
      options: [],
      dependsOn: "boligtype",
      dynamicOptions: FLYTTE_SIZE,
    },
    {
      id: "bad",
      title: "Antall bad",
      required: true,
      options: [],
      dependsOn: "boligtype",
      dynamicOptions: BATH_BY_BOLIG,
      autoValue: BATH_AUTO,
    },
  ],
  addons: [
    { id: "vinduer", label: "Vinduer innvendig + utvendig", priceHint: "+500 kr/5 vinduer" },
    { id: "balkong", label: "Balkong / terrasse", priceHint: "+500 kr" },
    { id: "garasje", label: "Garasje", priceHint: "+1 200 kr" },
    { id: "stekeovn", label: "Stekeovn og kjøleskap (grundig)", priceHint: "+400 kr" },
    { id: "skap", label: "Innvendig i alle skap", priceHint: "+600 kr" },
    { id: "bod", label: "Bod / kjeller", priceHint: "+800 kr" },
  ],
  calculatePrice(sel, addons) {
    const key = `${sel.boligtype}-${sel.storrelse}`;
    const base: Record<string, R> = {
      "hybel-under-25": [3500, 3500], "hybel-25-40": [3500, 3800],
      "leilighet-30-50": [3500, 4500], "leilighet-50-80": [4500, 7000], "leilighet-80-120": [7000, 10500],
      "rekkehus-80-120": [7500, 10500], "rekkehus-120-160": [10500, 14000], "rekkehus-160-200": [14000, 17500],
      "enebolig-100-150": [9000, 13000], "enebolig-150-200": [13000, 17500], "enebolig-200-300": [17500, 26000],
      "villa-200-300": [18000, 26000], "villa-300-400": [26000, 35000], "villa-over-400": [35000, 45000],
      "penthouse-80-120": [7500, 11000], "penthouse-120-200": [11000, 17000],
    };

    const b = base[key];
    if (!b || !sel.type || !sel.bad) return null;

    const typeMult: Record<string, number> = { utvask: 1.0, innvask: 0.8 };
    let r = sc(b, typeMult[sel.type] ?? 1);

    // Extra bath: +800 kr per bath beyond 1
    const bathExtra: Record<string, number> = { "1": 0, "2": 800, "3": 1600, "3+": 1600, "4+": 2400 };
    r = ad(r, bathExtra[sel.bad] ?? 0);

    const ac: Record<string, number> = { vinduer: 500, balkong: 500, garasje: 1200, stekeovn: 400, skap: 600, bod: 800 };
    for (const [k, v] of Object.entries(addons)) { if (v && ac[k]) r = ad(r, ac[k]); }

    return { min: r[0], max: r[1], period: "kr" };
  },
};

// ═══════════════════════════════════════════════
// 3. KONTORVASK
// ═══════════════════════════════════════════════
const kontorvask: ServiceConfig = {
  steps: [
    {
      id: "frekvens",
      title: "Frekvens",
      required: true,
      options: [
        { id: "daglig", label: "Daglig", sublabel: "5 dager/uke", priceHint: "−25 %/gang" },
        { id: "2-3-uke", label: "2–3 ganger/uke", priceHint: "−15 %/gang" },
        { id: "ukentlig", label: "Ukentlig", priceHint: "Standard" },
        { id: "annenhver", label: "Annenhver uke", priceHint: "+10 %" },
        { id: "manedlig", label: "Månedlig", priceHint: "+20 %" },
      ],
    },
    {
      id: "lokale",
      title: "Type lokale",
      required: true,
      options: [
        { id: "kontor", label: "Kontor" },
        { id: "butikk", label: "Butikk" },
        { id: "klinikk", label: "Klinikk" },
        { id: "lager", label: "Lager" },
        { id: "annet", label: "Annet" },
      ],
    },
    {
      id: "storrelse",
      title: "Størrelse",
      required: true,
      options: [
        { id: "under-100", label: "Under 100 m²" },
        { id: "100-250", label: "100–250 m²" },
        { id: "250-500", label: "250–500 m²" },
        { id: "500-1000", label: "500–1 000 m²" },
        { id: "over-1000", label: "Over 1 000 m²", sublabel: "Pris etter befaring" },
      ],
    },
    {
      id: "etasjer",
      title: "Antall etasjer",
      required: true,
      options: [
        { id: "1", label: "1 etasje" },
        { id: "2", label: "2 etasjer" },
        { id: "3+", label: "3+ etasjer" },
      ],
    },
  ],
  addons: [
    { id: "vindusvask", label: "Vindusvask", priceHint: "+800 kr" },
    { id: "gulvpolering", label: "Gulvpolering", priceHint: "+1 500 kr" },
    { id: "kjokken", label: "Kjøkken / kantine", priceHint: "+600 kr" },
    {
      id: "toaletter",
      label: "Toaletter utover 2",
      priceHint: "+200 kr/stk",
      subOptions: [
        { id: "1-2", label: "1–2 stk" },
        { id: "3-4", label: "3–4 stk" },
        { id: "5+", label: "5+ stk" },
      ],
    },
  ],
  calculatePrice(sel, addons) {
    const perVisit: Record<string, R> = {
      "under-100": [1200, 1800], "100-250": [1800, 3500],
      "250-500": [3500, 6000], "500-1000": [6000, 10000], "over-1000": [10000, 16000],
    };
    const b = perVisit[sel.storrelse];
    if (!b || !sel.frekvens || !sel.lokale || !sel.etasjer) return null;

    const freqMult: Record<string, number> = { daglig: 0.75, "2-3-uke": 0.85, ukentlig: 1.0, annenhver: 1.1, manedlig: 1.2 };
    const freqVisits: Record<string, number> = { daglig: 22, "2-3-uke": 10, ukentlig: 4.3, annenhver: 2.15, manedlig: 1 };
    const etasjeMult: Record<string, number> = { "1": 1.0, "2": 1.15, "3+": 1.3 };

    let r = sc(b, etasjeMult[sel.etasjer] ?? 1);
    r = sc(r, freqMult[sel.frekvens] ?? 1);
    const visits = freqVisits[sel.frekvens] ?? 1;
    r = sc(r, visits);

    if (addons.vindusvask) r = ad(r, 800 * Math.min(visits, 4));
    if (addons.gulvpolering) r = ad(r, 1500);
    if (addons.kjokken) r = ad(r, 600 * visits * 0.5);
    if (addons.toaletter) {
      const tAdd: Record<string, number> = { "1-2": 0, "3-4": 200, "5+": 400 };
      r = ad(r, (tAdd[addons.toaletter as string] ?? 0) * visits);
    }

    return { min: Math.round(r[0]), max: Math.round(r[1]), period: "kr/mnd" };
  },
};

// ═══════════════════════════════════════════════
// 4. BYGGVASK
// ═══════════════════════════════════════════════
const byggvask: ServiceConfig = {
  steps: [
    {
      id: "type",
      title: "Type prosjekt",
      required: true,
      options: [
        { id: "nybygg", label: "Nybygg" },
        { id: "renovering", label: "Renovering" },
        { id: "tilbygg", label: "Tilbygg" },
      ],
    },
    {
      id: "storrelse",
      title: "Størrelse",
      required: true,
      options: [
        { id: "under-80", label: "Under 80 m²" },
        { id: "80-150", label: "80–150 m²" },
        { id: "150-300", label: "150–300 m²" },
        { id: "over-300", label: "Over 300 m²", sublabel: "Pris etter befaring" },
      ],
    },
    {
      id: "tilstand",
      title: "Tilstand",
      required: true,
      options: [
        { id: "lett", label: "Lett støv", sublabel: "Fin finish", priceHint: "Standard" },
        { id: "mye", label: "Mye byggestøv", sublabel: "Standard", priceHint: "+30 %" },
        { id: "grov", label: "Grov rengjøring", sublabel: "Tung jobb", priceHint: "+50 %" },
      ],
    },
  ],
  addons: [
    {
      id: "vindusvask",
      label: "Vindusvask",
      subOptions: [
        { id: "5-10", label: "5–10 vinduer", priceHint: "+1 500 kr" },
        { id: "10-20", label: "10–20 vinduer", priceHint: "+2 500 kr" },
        { id: "20+", label: "20+ vinduer", priceHint: "+4 000 kr" },
      ],
    },
    { id: "fasadevask", label: "Fasadevask", priceHint: "+3 000 kr" },
    { id: "maling-lim", label: "Fjerning av maling / lim", priceHint: "+2 000 kr" },
  ],
  calculatePrice(sel, addons) {
    const base: Record<string, R> = {
      "under-80": [5000, 8000], "80-150": [8000, 14000],
      "150-300": [14000, 25000], "over-300": [25000, 40000],
    };

    const b = base[sel.storrelse];
    if (!b || !sel.type || !sel.tilstand) return null;

    const typeMult: Record<string, number> = { nybygg: 1.0, renovering: 1.1, tilbygg: 0.9 };
    const tilstandMult: Record<string, number> = { lett: 1.0, mye: 1.3, grov: 1.5 };

    let r = sc(b, typeMult[sel.type] ?? 1);
    r = sc(r, tilstandMult[sel.tilstand] ?? 1);

    if (addons.vindusvask) {
      const vk: Record<string, number> = { "5-10": 1500, "10-20": 2500, "20+": 4000 };
      r = ad(r, vk[addons.vindusvask as string] ?? 1500);
    }
    if (addons.fasadevask) r = ad(r, 3000);
    if (addons["maling-lim"]) r = ad(r, 2000);

    return { min: r[0], max: r[1], period: "kr" };
  },
};

// ═══════════════════════════════════════════════
// 5. SPESIALVASK
// ═══════════════════════════════════════════════
const spesialvask: ServiceConfig = {
  steps: [
    {
      id: "omfang",
      title: "Omfang",
      required: true,
      options: [
        { id: "lite", label: "Lite", sublabel: "1–5 enheter" },
        { id: "medium", label: "Medium", sublabel: "5–15 enheter" },
        { id: "stort", label: "Stort", sublabel: "15+ enheter" },
      ],
    },
  ],
  addons: [
    {
      id: "vindusvask",
      label: "Vindusvask",
      priceHint: "800–4 500 kr",
      subOptions: [
        { id: "innvendig", label: "Kun innvendig" },
        { id: "inn-ut", label: "Innvendig + utvendig", priceHint: "+60 %" },
      ],
    },
    { id: "tepperens", label: "Tepperens", priceHint: "400–4 000 kr" },
    { id: "mobelrens", label: "Møbelrens", priceHint: "600–6 000 kr" },
    { id: "hoyde", label: "Vanskelig tilgang (høyde)", priceHint: "+500 kr" },
    { id: "impregnering", label: "Impregnering", priceHint: "+500 kr" },
  ],
  calculatePrice(sel, addons) {
    if (!sel.omfang) return null;

    const prices: Record<string, Record<string, R>> = {
      vindusvask: { lite: [800, 1200], medium: [1200, 2500], stort: [2500, 4500] },
      tepperens: { lite: [400, 800], medium: [800, 2000], stort: [2000, 4000] },
      mobelrens: { lite: [600, 1200], medium: [1200, 3000], stort: [3000, 6000] },
    };

    let r: R = [0, 0];
    let hasService = false;

    for (const svcId of ["vindusvask", "tepperens", "mobelrens"] as const) {
      if (addons[svcId]) {
        const p = prices[svcId][sel.omfang] ?? [500, 1000];
        r = ad(r, p[0]);
        r = [r[0], r[1] + p[1]];
        hasService = true;
      }
    }

    if (!hasService) return null;

    // Innvendig + utvendig adds 60% to vindusvask portion
    if (addons.vindusvask === "inn-ut") {
      const vp = prices.vindusvask[sel.omfang] ?? [800, 1200];
      r = ad(r, Math.round(vp[0] * 0.6));
      r = [r[0], r[1] + Math.round(vp[1] * 0.6)];
    }
    if (addons.hoyde) r = ad(r, 500);
    if (addons.impregnering) r = ad(r, 500);

    return { min: r[0], max: r[1], period: "kr" };
  },
};

// ═══════════════════════════════════════════════
// 6. LUKTSANERING
// ═══════════════════════════════════════════════
const luktsanering: ServiceConfig = {
  steps: [
    {
      id: "lukttype",
      title: "Type lukt",
      required: true,
      options: [
        { id: "royk", label: "Røyk", priceHint: "Standard" },
        { id: "kjaledyr", label: "Kjæledyr", priceHint: "−10 %" },
        { id: "fukt", label: "Fukt / mugg", priceHint: "+20 %" },
        { id: "brann", label: "Brann", priceHint: "+40 %" },
        { id: "annet", label: "Annet" },
      ],
    },
    {
      id: "omfang",
      title: "Omfang",
      required: true,
      options: [
        { id: "ett-rom", label: "Ett rom" },
        { id: "flere-rom", label: "Flere rom" },
        { id: "hele", label: "Hele boligen" },
      ],
    },
    {
      id: "storrelse",
      title: "Boligstørrelse",
      required: true,
      options: [
        { id: "under-50", label: "Under 50 m²" },
        { id: "50-100", label: "50–100 m²" },
        { id: "100-200", label: "100–200 m²" },
        { id: "over-200", label: "Over 200 m²" },
      ],
    },
  ],
  addons: [
    { id: "tekstil", label: "Tekstilbehandling", priceHint: "+2 000 kr" },
    { id: "ozon", label: "Ozonsanering", priceHint: "+3 000 kr" },
    { id: "ventilasjon", label: "Ventilasjonssystem", priceHint: "+2 500 kr" },
  ],
  calculatePrice(sel, addons) {
    if (!sel.lukttype || !sel.omfang || !sel.storrelse) return null;

    const luktMult: Record<string, number> = { royk: 1.0, kjaledyr: 0.9, fukt: 1.2, brann: 1.4, annet: 1.0 };

    let r: R;
    if (sel.omfang === "ett-rom") {
      r = [3000, 5000];
    } else if (sel.omfang === "flere-rom") {
      r = [5000, 10000];
    } else {
      const sizeBase: Record<string, R> = {
        "under-50": [8000, 12000], "50-100": [8000, 12000],
        "100-200": [12000, 20000], "over-200": [16000, 25000],
      };
      r = sizeBase[sel.storrelse] ?? [10000, 15000];
    }

    r = sc(r, luktMult[sel.lukttype] ?? 1);

    if (addons.tekstil) r = ad(r, 2000);
    if (addons.ozon) r = ad(r, 3000);
    if (addons.ventilasjon) r = ad(r, 2500);

    return { min: r[0], max: r[1], period: "kr" };
  },
};

// ═══════════════════════════════════════════════
// 7. HOVEDRENGJØRING
// ═══════════════════════════════════════════════
const hovedrengjoring: ServiceConfig = {
  steps: [
    { id: "boligtype", title: "Boligtype", required: true, options: BOLIG },
    {
      id: "storrelse",
      title: "Størrelse",
      required: true,
      options: [],
      dependsOn: "boligtype",
      dynamicOptions: SIZE_BY_BOLIG,
    },
    {
      id: "bad",
      title: "Antall bad",
      required: true,
      options: [],
      dependsOn: "boligtype",
      dynamicOptions: BATH_BY_BOLIG,
      autoValue: BATH_AUTO,
    },
    {
      id: "soverom",
      title: "Antall soverom",
      required: true,
      options: [
        { id: "1", label: "1 soverom" },
        { id: "2", label: "2 soverom" },
        { id: "3", label: "3 soverom" },
        { id: "4+", label: "4+ soverom" },
      ],
    },
  ],
  addons: [
    { id: "vinduer", label: "Vinduer innvendig", priceHint: "+400 kr" },
    { id: "balkong", label: "Balkong / terrasse", priceHint: "+300 kr" },
    { id: "garasje", label: "Garasje", priceHint: "+1 000 kr" },
    { id: "stekeovn", label: "Stekeovn og kjøleskap", priceHint: "+300 kr" },
    { id: "skap", label: "Innvendig i skap", priceHint: "+400 kr" },
    { id: "vegg-tak", label: "Vegg- og takvask per rom", priceHint: "+500 kr" },
  ],
  calculatePrice(sel, addons) {
    const key = `${sel.boligtype}-${sel.storrelse}`;
    // Ca 2x fast vask-priser
    const base: Record<string, R> = {
      "hybel-under-25": [1100, 1400], "hybel-25-40": [1400, 1700],
      "leilighet-30-50": [1600, 2000], "leilighet-50-80": [2000, 2800], "leilighet-80-120": [2800, 3500],
      "rekkehus-80-120": [2900, 3600], "rekkehus-120-160": [3600, 4500], "rekkehus-160-200": [4500, 5500],
      "enebolig-100-150": [3200, 4000], "enebolig-150-200": [3800, 5000], "enebolig-200-300": [5000, 6500],
      "villa-200-300": [5500, 6800], "villa-300-400": [6800, 8500], "villa-over-400": [8500, 11000],
      "penthouse-80-120": [3000, 3800], "penthouse-120-200": [3800, 5200],
    };

    const b = base[key];
    if (!b || !sel.bad || !sel.soverom) return null;

    const bathExtra: Record<string, number> = { "1": 0, "2": 250, "3": 500, "3+": 500, "4+": 750 };
    const sovAdd: Record<string, number> = { "1": 0, "2": 200, "3": 400, "4+": 600 };
    let r = ad(b, bathExtra[sel.bad] ?? 0);
    r = ad(r, sovAdd[sel.soverom] ?? 0);

    const ac: Record<string, number> = { vinduer: 400, balkong: 300, garasje: 1000, stekeovn: 300, skap: 400, "vegg-tak": 500 };
    for (const [k, v] of Object.entries(addons)) { if (v && ac[k]) r = ad(r, ac[k]); }

    return { min: r[0], max: r[1], period: "kr" };
  },
};

// ═══════════════════════════════════════════════
// 8. VISNINGSVASK
// ═══════════════════════════════════════════════
const visningsvask: ServiceConfig = {
  steps: [
    { id: "boligtype", title: "Boligtype", required: true, options: BOLIG },
    {
      id: "storrelse",
      title: "Størrelse",
      required: true,
      options: [],
      dependsOn: "boligtype",
      dynamicOptions: SIZE_BY_BOLIG,
    },
    {
      id: "tidspunkt",
      title: "Tidspunkt",
      required: true,
      options: [
        { id: "fleksibel", label: "Fleksibel", sublabel: "Innen 1 uke", priceHint: "Standard" },
        { id: "2-dager", label: "Innen 2 dager", priceHint: "+15 %" },
        { id: "haster", label: "Haster", sublabel: "Innen 24 timer", priceHint: "+30 %" },
      ],
    },
  ],
  addons: [
    { id: "vinduer", label: "Vinduer innvendig", priceHint: "+350 kr" },
    { id: "balkong", label: "Balkong / terrasse", priceHint: "+250 kr" },
    { id: "styling", label: "Styling-tips (rydding & oppsett)", priceHint: "+500 kr" },
    { id: "parfymering", label: "Parfymering", priceHint: "+200 kr" },
  ],
  calculatePrice(sel, addons) {
    const key = `${sel.boligtype}-${sel.storrelse}`;
    // Ca 1.5x fast vask-priser
    const base: Record<string, R> = {
      "hybel-under-25": [900, 1100], "hybel-25-40": [1100, 1300],
      "leilighet-30-50": [1200, 1500], "leilighet-50-80": [1500, 2000], "leilighet-80-120": [2000, 2500],
      "rekkehus-80-120": [2100, 2600], "rekkehus-120-160": [2600, 3200], "rekkehus-160-200": [3200, 4000],
      "enebolig-100-150": [2300, 2900], "enebolig-150-200": [2800, 3600], "enebolig-200-300": [3600, 4500],
      "villa-200-300": [3900, 4800], "villa-300-400": [4800, 6000], "villa-over-400": [6000, 7800],
      "penthouse-80-120": [2100, 2700], "penthouse-120-200": [2700, 3700],
    };

    const b = base[key];
    if (!b || !sel.tidspunkt) return null;

    const tidMult: Record<string, number> = { fleksibel: 1.0, "2-dager": 1.15, haster: 1.3 };
    let r = sc(b, tidMult[sel.tidspunkt] ?? 1);

    const ac: Record<string, number> = { vinduer: 350, balkong: 250, styling: 500, parfymering: 200 };
    for (const [k, v] of Object.entries(addons)) { if (v && ac[k]) r = ad(r, ac[k]); }

    return { min: r[0], max: r[1], period: "kr" };
  },
};

// ═══════════════════════════════════════════════
// 9. BORETTSLAG
// ═══════════════════════════════════════════════
const borettslag: ServiceConfig = {
  steps: [
    {
      id: "areal",
      title: "Type areal",
      required: true,
      options: [
        { id: "trappeoppgang", label: "Trappeoppgang" },
        { id: "fellesrom", label: "Fellesrom" },
        { id: "vaskerom", label: "Vaskerom" },
        { id: "garasje", label: "Garasje" },
        { id: "alt", label: "Alt", sublabel: "Komplett pakke" },
      ],
    },
    {
      id: "oppganger",
      title: "Antall oppganger",
      required: true,
      options: [
        { id: "1", label: "1 oppgang" },
        { id: "2-3", label: "2–3 oppganger" },
        { id: "4-6", label: "4–6 oppganger" },
        { id: "7+", label: "7+ oppganger", sublabel: "Pris etter befaring" },
      ],
    },
    {
      id: "frekvens",
      title: "Frekvens",
      required: true,
      options: [
        { id: "ukentlig", label: "Ukentlig", priceHint: "Standard" },
        { id: "annenhver", label: "Annenhver uke", priceHint: "−30 %" },
        { id: "manedlig", label: "Månedlig", priceHint: "−50 %" },
      ],
    },
    {
      id: "etasjer",
      title: "Etasjer per oppgang",
      required: true,
      options: [
        { id: "2-3", label: "2–3 etasjer" },
        { id: "4-6", label: "4–6 etasjer" },
        { id: "7+", label: "7+ etasjer" },
      ],
    },
  ],
  addons: [
    { id: "vindusvask", label: "Vindusvask i fellesarealer", priceHint: "+1 500 kr/gang" },
    { id: "soppelrom", label: "Utvendig søppelrom", priceHint: "+500 kr/gang" },
    { id: "snomaking", label: "Snømåking (vinter)", priceHint: "+2 000 kr/mnd" },
  ],
  calculatePrice(sel, addons) {
    if (!sel.areal || !sel.oppganger || !sel.frekvens || !sel.etasjer) return null;

    // Base: 1 oppgang, ukentlig, 2-3 etasjer
    const arealBase: Record<string, R> = {
      trappeoppgang: [600, 850], fellesrom: [700, 1000],
      vaskerom: [400, 600], garasje: [800, 1200], alt: [2000, 3000],
    };
    const oppMult: Record<string, number> = { "1": 1.0, "2-3": 2.2, "4-6": 4.0, "7+": 6.5 };
    const etasjeMult: Record<string, number> = { "2-3": 1.0, "4-6": 1.4, "7+": 1.8 };
    const freqMult: Record<string, number> = { ukentlig: 1.0, annenhver: 0.7, manedlig: 0.5 };
    const freqVisits: Record<string, number> = { ukentlig: 4.3, annenhver: 2.15, manedlig: 1 };

    const perVisit = arealBase[sel.areal] ?? [800, 1200];
    let r = sc(perVisit, oppMult[sel.oppganger] ?? 1);
    r = sc(r, etasjeMult[sel.etasjer] ?? 1);
    // Monthly price = per visit * visits * frequency discount
    r = sc(r, freqMult[sel.frekvens] ?? 1);
    const visits = freqVisits[sel.frekvens] ?? 1;
    r = sc(r, visits);

    if (addons.vindusvask) r = ad(r, 1500 * visits);
    if (addons.soppelrom) r = ad(r, 500 * visits);
    if (addons.snomaking) r = ad(r, 2000);

    return { min: Math.round(r[0]), max: Math.round(r[1]), period: "kr/mnd" };
  },
};

// ═══════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════
const configs: Record<string, ServiceConfig> = {
  "fast-vask": fastVask,
  flyttevask,
  kontorvask,
  byggvask,
  spesialvask,
  luktsanering,
  hovedrengjoring,
  visningsvask,
  borettslag,
};

export function getServiceConfig(slug: string): ServiceConfig | undefined {
  return configs[slug];
}

/**
 * Definisjoner over hvilke felter hver side har. Brukes av admin-editoren til å
 * vite hvilke skjemafelter som skal vises, og av frontend til å hente verdier.
 */

export type FieldType = "text" | "textarea" | "image" | "href";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  help?: string;
  placeholder?: string;
}

export interface SectionDef {
  key: string;
  name: string;
  placement?: string;
  /** Hvis satt: feltet repeteres med disse sort_orders. F.eks. [0,1,2,3] for 4 kort. */
  repeatOrders?: number[];
  fields: FieldDef[];
}

export interface PageDef {
  slug: string;
  name: string;
  hasHero?: boolean;
  heroPlacement?: string;
  hasSeo?: boolean;
  sections?: SectionDef[];
}

export const PAGE_DEFINITIONS: PageDef[] = [
  {
    slug: "home",
    name: "Forsiden",
    hasHero: true,
    heroPlacement: "Topp-hero med typewriter og knapper — det første besøkende ser",
    hasSeo: true,
    sections: [
      {
        key: "hvorfor_oss",
        name: "Hvorfor oss (4 kort)",
        placement: "Midt på forsiden — boksene som viser hvorfor folk velger Færder",
        fields: [
          { key: "eyebrow", label: "Liten overskrift", type: "text" },
          { key: "title", label: "Tittel", type: "text" },
        ],
      },
      {
        key: "hvorfor_oss",
        name: "Hvorfor oss — kort",
        repeatOrders: [0, 1, 2, 3],
        fields: [
          { key: "card_title", label: "Korttittel", type: "text" },
          { key: "card_text", label: "Korttekst", type: "textarea" },
        ],
      },
      {
        key: "slik_fungerer",
        name: "Slik fungerer det",
        placement: "Tre steg-illustrasjoner",
        fields: [
          { key: "eyebrow", label: "Liten overskrift", type: "text" },
          { key: "title", label: "Tittel", type: "text" },
        ],
      },
      {
        key: "slik_fungerer",
        name: "Slik fungerer det — steg",
        repeatOrders: [0, 1, 2],
        fields: [
          { key: "step_title", label: "Tittel", type: "text" },
          { key: "step_text", label: "Tekst", type: "textarea" },
        ],
      },
      {
        key: "trust_bar",
        name: "Trust bar",
        placement: "Stripe med tall (års erfaring, ansatte, fornøyde kunder)",
        repeatOrders: [0, 1, 2],
        fields: [
          { key: "stat_value", label: "Tall / verdi", type: "text" },
          { key: "stat_label", label: "Etikett", type: "text" },
        ],
      },
      {
        key: "kundeanmeldelser",
        name: "Kundeanmeldelser-blokk",
        placement: "Overskriften over de 4 anmeldelsene (selve anmeldelsene redigeres på Innstillinger)",
        fields: [
          { key: "eyebrow", label: "Liten overskrift", type: "text" },
          { key: "title", label: "Tittel", type: "text" },
          { key: "subtitle", label: "Undertekst", type: "text" },
        ],
      },
      {
        key: "faq",
        name: "FAQ — overskrift",
        placement: "Vanlige spørsmål",
        fields: [
          { key: "eyebrow", label: "Liten overskrift", type: "text" },
          { key: "title", label: "Tittel", type: "text" },
        ],
      },
      {
        key: "faq",
        name: "FAQ — spørsmål",
        repeatOrders: [0, 1, 2, 3, 4],
        fields: [
          { key: "q", label: "Spørsmål", type: "text" },
          { key: "a", label: "Svar", type: "textarea" },
        ],
      },
      {
        key: "cta_final",
        name: "Avsluttende CTA",
        placement: "Nederst på forsiden, før footer",
        fields: [
          { key: "title", label: "Tittel", type: "text" },
          { key: "body", label: "Brødtekst", type: "textarea" },
        ],
      },
    ],
  },

  {
    slug: "om-oss",
    name: "Om oss",
    hasHero: false,
    hasSeo: true,
    sections: [
      {
        key: "hero",
        name: "Hero",
        placement: "Toppen av Om oss-siden",
        fields: [
          { key: "eyebrow", label: "Liten overskrift", type: "text" },
          { key: "title", label: "Tittel", type: "text" },
          { key: "subtitle", label: "Undertekst", type: "textarea" },
        ],
      },
      {
        key: "historie",
        name: "Vår historie",
        fields: [
          { key: "eyebrow", label: "Liten overskrift", type: "text" },
          { key: "title", label: "Tittel", type: "text" },
          { key: "leader_name", label: "Leder navn", type: "text" },
          { key: "leader_title", label: "Leder tittel", type: "text" },
          { key: "leader_image", label: "Leder bilde URL", type: "image" },
        ],
      },
      {
        key: "historie",
        name: "Historie — paragrafer",
        repeatOrders: [0, 1, 2],
        fields: [{ key: "paragraph", label: "Avsnitt", type: "textarea" }],
      },
      {
        key: "verdier",
        name: "Våre verdier",
        fields: [
          { key: "eyebrow", label: "Liten overskrift", type: "text" },
          { key: "title", label: "Tittel", type: "text" },
        ],
      },
      {
        key: "verdier",
        name: "Verdier — kort",
        repeatOrders: [0, 1, 2],
        fields: [
          { key: "card_title", label: "Korttittel", type: "text" },
          { key: "card_text", label: "Korttekst", type: "textarea" },
        ],
      },
      {
        key: "cta_final",
        name: "Avsluttende CTA",
        fields: [
          { key: "title", label: "Tittel", type: "text" },
          { key: "body", label: "Brødtekst", type: "textarea" },
        ],
      },
    ],
  },

  {
    slug: "kontakt",
    name: "Kontakt",
    hasHero: false,
    hasSeo: true,
    sections: [
      {
        key: "hero",
        name: "Hero",
        fields: [
          { key: "eyebrow", label: "Liten overskrift", type: "text" },
          { key: "title", label: "Tittel", type: "text" },
          { key: "subtitle", label: "Undertekst", type: "text" },
        ],
      },
      {
        key: "form",
        name: "Skjema",
        fields: [{ key: "title", label: "Skjema-tittel", type: "text" }],
      },
    ],
  },

  {
    slug: "jobb",
    name: "Jobb hos oss",
    hasHero: false,
    hasSeo: true,
    sections: [
      {
        key: "hero",
        name: "Hero",
        fields: [
          { key: "eyebrow", label: "Liten overskrift", type: "text" },
          { key: "title", label: "Tittel", type: "text" },
          { key: "subtitle", label: "Undertekst", type: "text" },
        ],
      },
      {
        key: "sitat",
        name: "Sitat fra leder",
        fields: [
          { key: "quote", label: "Sitat", type: "textarea" },
          { key: "author", label: "Forfatter", type: "text" },
        ],
      },
      {
        key: "fordeler",
        name: "Fordeler",
        fields: [
          { key: "eyebrow", label: "Liten overskrift", type: "text" },
          { key: "title", label: "Tittel", type: "text" },
        ],
      },
      {
        key: "fordeler",
        name: "Fordeler — kort",
        repeatOrders: [0, 1, 2],
        fields: [
          { key: "card_title", label: "Korttittel", type: "text" },
          { key: "card_text", label: "Korttekst", type: "textarea" },
        ],
      },
      {
        key: "soknad",
        name: "Søknadsskjema",
        fields: [
          { key: "eyebrow", label: "Liten overskrift", type: "text" },
          { key: "title", label: "Tittel", type: "text" },
        ],
      },
    ],
  },

  {
    slug: "prisliste",
    name: "Prisliste",
    hasHero: false,
    hasSeo: true,
    sections: [
      {
        key: "hero",
        name: "Hero",
        fields: [
          { key: "eyebrow", label: "Liten overskrift", type: "text" },
          { key: "title", label: "Tittel", type: "text" },
          { key: "subtitle", label: "Undertekst", type: "textarea" },
        ],
      },
      {
        key: "disclaimer",
        name: "Disclaimer",
        fields: [{ key: "text", label: "Tekst", type: "textarea" }],
      },
      {
        key: "cta_final",
        name: "Avsluttende CTA",
        fields: [
          { key: "title", label: "Tittel", type: "text" },
          { key: "body", label: "Brødtekst", type: "textarea" },
        ],
      },
    ],
  },
];

export function getPageDef(slug: string): PageDef | null {
  return PAGE_DEFINITIONS.find((p) => p.slug === slug) ?? null;
}

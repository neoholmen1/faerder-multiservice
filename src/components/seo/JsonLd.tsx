import type { Service } from "@/data/services";

const BASE_URL = "https://faerdermultiservice.no";

// ── LocalBusiness (homepage) ──
export function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${BASE_URL}/#business`,
    name: "Færder Multiservice AS",
    image: `${BASE_URL}/images/firmabil-hero.webp`,
    description:
      "Skikkelig renhold i hele Vestfold. Fast vask, flyttevask, kontorvask og mer. Godkjent og EV-sertifisert.",
    url: BASE_URL,
    telephone: "+4796823647",
    email: "post@faerdermultiservice.no",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Rambergveien 1",
      addressLocality: "Tønsberg",
      addressCountry: "NO",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 59.2256,
      longitude: 10.4186,
    },
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: 59.2264,
        longitude: 10.4044,
      },
      geoRadius: "50000",
    },
    openingHours: "Mo-Fr 08:00-16:00",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "16:00",
    },
    priceRange: "550-1200 NOK",
    memberOf: {
      "@type": "Organization",
      name: "NHO",
    },
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "Offentlig godkjent renholdsbedrift",
      },
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "EV-sertifisert",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ── Service (tjenestesider) ──
export function ServiceJsonLd({ service }: { service: Service }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.seoDescription,
    url: `${BASE_URL}/tjenester/${service.slug}`,
    provider: {
      "@type": "LocalBusiness",
      "@id": `${BASE_URL}/#business`,
      name: "Færder Multiservice AS",
    },
    areaServed: {
      "@type": "State",
      name: "Vestfold",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "NOK",
      price: service.price.replace(/[^\d]/g, "") || undefined,
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "NOK",
        price: service.price,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ── FAQPage (tjenestesider med FAQ) ──
export function FAQJsonLd({ items }: { items: { question: string; answer: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ── BreadcrumbList ──
export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; href: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${BASE_URL}${item.href}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

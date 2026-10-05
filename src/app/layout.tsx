import type { Metadata, Viewport } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";
import { ScrollToTop } from "@/components/ScrollToTop";
import { CookieBanner } from "@/components/CookieBanner";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { MobileCtaSticky } from "@/components/MobileCtaSticky";
import { PreviewModeDetector } from "@/components/PreviewModeDetector";
import { LocalBusinessJsonLd } from "@/components/seo/JsonLd";
import { getCurrentSite, getSiteSettings, SITE_SETTINGS_FALLBACK } from "@/lib/site";
import { getOpenStatus } from "@/lib/openHours";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://faerdermultiservice.no"),
  title: {
    default: "Vaskebyrå i Vestfold | Færder Multiservice",
    template: "%s | Færder Multiservice — Renhold i Vestfold",
  },
  description:
    "Skikkelig renhold for hjem og bedrift i Vestfold. Godkjent og EV-sertifisert. Gratis befaring — vi gir deg pris samme dag.",
  openGraph: {
    type: "website",
    locale: "nb_NO",
    siteName: "Færder Multiservice AS",
    title: "Færder Multiservice — Skikkelig renhold i Vestfold",
    description:
      "Fast vask, flyttevask, kontorvask og mer. Godkjent og EV-sertifisert. Gratis befaring.",
    url: "https://faerdermultiservice.no",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: "Færder Multiservice — Rent hjem. Null stress." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Færder Multiservice — Vi vasker, du slipper",
    description:
      "Fast vask, flyttevask, kontorvask og mer. Godkjent og EV-sertifisert. Gratis befaring.",
    images: ["/images/og-image.jpg"],
  },
  alternates: {
    canonical: "https://faerdermultiservice.no",
  },
  // Utkast-deployen skal aldri indekseres. Settes via NEXT_PUBLIC_DEMO_MODE,
  // og forsterkes av X-Robots-Tag fra src/proxy.ts.
  ...(process.env.NEXT_PUBLIC_DEMO_MODE === "1"
    ? { robots: { index: false, follow: false, nocache: true } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: "#E57100",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const site = await getCurrentSite();
  const settings = site ? await getSiteSettings(site.id) : null;
  const phone = settings?.phone ?? SITE_SETTINGS_FALLBACK.phone ?? "968 23 647";
  const openStatus = getOpenStatus();

  return (
    <html lang="nb" data-scroll-behavior="smooth">
      <body className={`${dmSans.variable} ${dmSerif.variable} antialiased`}>
        <PreviewModeDetector />
        <LocalBusinessJsonLd />
        <Header openStatus={openStatus} phone={phone} />
        <main>
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer settings={settings} />
        <MobileCtaSticky phone={phone} />
        <ScrollToTop />
        <CookieBanner />
        <GoogleAnalytics />
        <Analytics />
        <Script id="easter-egg" strategy="afterInteractive">{`
          console.log('%c\\u{1f9f9} Færder Multiservice','font-size:16px;font-weight:bold;color:#E57100');
          console.log('%c\\u{1f4bc} Utvikler? Vi leter alltid etter flinke folk \\u2192 faerdermultiservice.no/jobb','font-size:12px;color:#E57100');
        `}</Script>
      </body>
    </html>
  );
}

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
import { LocalBusinessJsonLd } from "@/components/seo/JsonLd";
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
    template: "%s | Færder Multiservice",
  },
  description:
    "Skikkelig renhold for hjem og bedrift i Vestfold. Godkjent, EV-sertifisert, fra 350 kr/t. Se priser og bestill.",
  openGraph: {
    type: "website",
    locale: "nb_NO",
    siteName: "Færder Multiservice AS",
    title: "Færder Multiservice — Skikkelig renhold i Vestfold",
    description:
      "Fast vask fra 350 kr/t. Flyttevask, kontorvask og mer. 4.8/5 på Google.",
    url: "https://faerdermultiservice.no",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: "Færder Multiservice — Rent hjem. Null stress." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Færder Multiservice — Vi vasker, du slipper",
    description:
      "Fast vask fra 350 kr/t. Flyttevask, kontorvask og mer. 4.8/5 på Google.",
    images: ["/images/og-image.jpg"],
  },
  alternates: {
    canonical: "https://faerdermultiservice.no",
  },
};

export const viewport: Viewport = {
  themeColor: "#E8721C",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nb">
      <body className={`${dmSans.variable} ${dmSerif.variable} antialiased`}>
        <LocalBusinessJsonLd />
        <Header />
        <main>
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <ScrollToTop />
        <CookieBanner />
        <GoogleAnalytics />
        <Analytics />
        <Script id="easter-egg" strategy="afterInteractive">{`
          console.log('%c\\u{1f9f9} Færder Multiservice','font-size:16px;font-weight:bold;color:#E8721C');
          console.log('%c\\u{1f4bc} Utvikler? Vi leter alltid etter flinke folk \\u2192 faerdermultiservice.no/jobb','font-size:12px;color:#E8721C');
        `}</Script>
      </body>
    </html>
  );
}

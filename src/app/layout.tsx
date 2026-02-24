import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";
import { ScrollToTop } from "@/components/ScrollToTop";
import { LocalBusinessJsonLd } from "@/components/seo/JsonLd";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://faerdermultiservice.no"),
  title: {
    default: "Vaskebyrå i Vestfold | Færder Multiservice",
    template: "%s | Færder Multiservice",
  },
  description:
    "Profesjonelt renhold for hjem og bedrift i Tønsberg, Nøtterøy og Vestfold. Offentlig godkjent, EV-sertifisert. Se priser og bestill.",
  openGraph: {
    type: "website",
    locale: "nb_NO",
    siteName: "Færder Multiservice AS",
    title: "Færder Multiservice — Profesjonelt renhold i Vestfold",
    description:
      "Fast vask fra 350 kr/t. Flyttevask, kontorvask og mer. EV-sertifisert, NHO-medlem, 4.8/5 på Google.",
    url: "https://faerdermultiservice.no",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: "Færder Multiservice — Rent hjem. Null stress." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Færder Multiservice — Profesjonelt renhold i Vestfold",
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
      <body className={`${inter.variable} antialiased`}>
        <LocalBusinessJsonLd />
        <Header />
        <main>
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <ScrollToTop />
        <Analytics />
        <Script id="easter-egg" strategy="afterInteractive">{`
          console.log('%c\\u{1f9f9} Færder Multiservice','font-size:16px;font-weight:bold;color:#E8721C');
          console.log('%c\\u{1f4bc} Utvikler? Vi leter alltid etter flinke folk \\u2192 faerdermultiservice.no/jobb','font-size:12px;color:#E8721C');
        `}</Script>
      </body>
    </html>
  );
}

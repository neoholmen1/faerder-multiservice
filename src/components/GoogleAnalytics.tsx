"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";
const STORAGE_KEY = "cookie-consent";

export function GoogleAnalytics() {
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    const check = () =>
      setConsent(localStorage.getItem(STORAGE_KEY) === "granted");

    check();
    window.addEventListener("cookie-consent-change", check);
    return () => window.removeEventListener("cookie-consent-change", check);
  }, []);

  // Uten en ekte GA4-ID skal ingenting lastes — ellers fyrer vi en request
  // til Google med en ugyldig ID, uten å få statistikk tilbake.
  if (!consent || !GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            analytics_storage: 'granted',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
          });
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

const GA_ID = "G-XXXXXXXXXX"; // TODO: Bytt ut med din GA4 Measurement ID
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

  if (!consent) return null;

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

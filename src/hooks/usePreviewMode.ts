"use client";

import { useEffect, useState } from "react";

/**
 * Returnerer `true` hvis komponenten kjører inne i en iframe (admin-preview)
 * eller URL-en har `?preview=1`. Komponenter bruker dette til å hoppe over
 * JS-drevne animasjoner (typewriter, count-up, mouse-tilt etc.) som ellers
 * ville sett ut som konstant loading i preview-vinduet.
 */
export function usePreviewMode(): boolean {
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const inIframe = window.self !== window.top;
    const hasFlag = params.has("preview");
    setIsPreview(inIframe || hasFlag);
  }, []);

  return isPreview;
}

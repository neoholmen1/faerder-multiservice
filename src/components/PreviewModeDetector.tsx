"use client";

import { useEffect } from "react";

/**
 * Detekterer om vi er i en iframe (preview-modus fra admin) og legger til
 * `data-preview="true"` på <html>. CSS i globals.css bruker dette til å
 * deaktivere animasjoner og scroll-reveal som ellers ville sett ut som
 * konstant "loading" når preview-iframe blir vist.
 */
export function PreviewModeDetector() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isIframe = window.self !== window.top;
    const hasFlag = params.has("preview");
    if (isIframe || hasFlag) {
      document.documentElement.dataset.preview = "true";
    }
  }, []);
  return null;
}

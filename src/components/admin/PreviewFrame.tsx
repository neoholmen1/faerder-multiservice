"use client";

import { memo } from "react";

/**
 * Isolert iframe-komponent. React.memo gjør at den IKKE re-rendres når formen
 * over endrer state — kun når `previewKey` eller `src` endres.
 *
 * Uten dette ville iframe-en flicker / laste på nytt ved hvert tastetrykk.
 */
function PreviewFrameInner({
  src,
  previewKey,
  title,
}: {
  src: string;
  previewKey: number;
  title: string;
}) {
  return (
    <div className="relative h-full w-full bg-[#e5e5e4]">
      <div className="absolute left-1/2 top-3 z-10 -translate-x-1/2 rounded-full bg-white/95 px-3 py-1 text-[11px] font-medium tracking-wide text-[#737373] shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        Forhåndsvisning · {src}
      </div>
      <iframe
        key={previewKey}
        src={src}
        title={title}
        className="h-full w-full border-0 bg-white"
        loading="lazy"
      />
    </div>
  );
}

export const PreviewFrame = memo(PreviewFrameInner, (prev, next) => {
  return prev.src === next.src && prev.previewKey === next.previewKey;
});

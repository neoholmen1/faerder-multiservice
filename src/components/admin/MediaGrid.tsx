"use client";

import Image from "next/image";
import type { MediaItem } from "@/lib/cms";

export default function MediaGrid({
  items,
  onSelect,
}: {
  items: MediaItem[];
  onSelect: (item: MediaItem) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-[#d4d4d4] bg-white">
        <p className="text-[13px] text-[#a3a3a3]">Ingen bilder enda. Last opp ditt første bilde over.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {items.map((m) => (
        <button
          key={m.id}
          onClick={() => onSelect(m)}
          className="group relative aspect-square overflow-hidden rounded-xl border border-[#ececec] bg-white transition-all duration-150 hover:border-[#E8721C] hover:shadow-[0_2px_8px_rgba(232,114,28,0.12)]"
        >
          <Image
            src={m.url}
            alt={m.alt_text || ""}
            fill
            sizes="200px"
            unoptimized
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
            <p className="truncate text-[11px] text-white">
              {m.alt_text || m.storage_path.split("/").pop()}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}

"use client";

import { ReactNode } from "react";

export function Field({
  label,
  help,
  children,
}: {
  label: string;
  help?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[12px] font-medium text-[#404040]">{label}</span>
      <div className="mt-1.5">{children}</div>
      {help && <p className="mt-1 text-[11.5px] text-[#a3a3a3]">{help}</p>}
    </label>
  );
}

export const inputClass =
  "h-10 w-full rounded-lg border border-[#ececec] bg-white px-3 text-[14px] text-[#171717] outline-none transition-colors focus:border-[#E8721C] focus:ring-2 focus:ring-[#E8721C]/10";

export const textareaClass =
  "min-h-[100px] w-full rounded-lg border border-[#ececec] bg-white px-3 py-2 text-[14px] text-[#171717] outline-none transition-colors focus:border-[#E8721C] focus:ring-2 focus:ring-[#E8721C]/10";

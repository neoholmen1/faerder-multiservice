"use client";

import { ReactNode } from "react";

export default function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex shrink-0 items-end justify-between gap-4 border-b border-[#ececec] bg-white px-8 pb-5 pt-7">
      <div className="min-w-0">
        <h1 className="text-[22px] font-semibold tracking-tight text-[#171717]">{title}</h1>
        {subtitle && <p className="mt-1 text-[13.5px] text-[#737373]">{subtitle}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

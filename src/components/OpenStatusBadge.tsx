import type { OpenStatus } from "@/lib/openHours";

/**
 * Pure presentation component. Mottar {isOpen, label, detail} som props slik
 * at den kan brukes i både server- og klient-komponenter uten flicker.
 */
export function OpenStatusBadge({
  status,
  className = "",
}: {
  status: OpenStatus;
  className?: string;
}) {
  return (
    <span
      title={status.detail}
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
        status.isOpen ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"
      } ${className}`}
    >
      <span className="relative flex h-1.5 w-1.5 items-center justify-center" aria-hidden="true">
        {status.isOpen && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        )}
        <span
          className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
            status.isOpen ? "bg-emerald-500" : "bg-gray-400"
          }`}
        />
      </span>
      {status.label}
    </span>
  );
}

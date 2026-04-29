"use client";

export default function SaveBar({
  saving,
  status,
  error,
  dirty,
  onSave,
  onDiscard,
}: {
  saving: boolean;
  status: "idle" | "saved" | "error";
  error?: string | null;
  dirty: boolean;
  onSave: () => void;
  onDiscard?: () => void;
}) {
  return (
    <div className="sticky bottom-0 z-20 flex items-center justify-between gap-4 border-t border-[#ececec] bg-white/95 px-8 py-4 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="text-[12.5px]">
        {dirty && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 font-medium text-amber-700">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Ulagrede endringer
          </span>
        )}
        {status === "saved" && !dirty && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 font-medium text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Lagret
          </span>
        )}
        {status === "error" && error && (
          <span className="rounded-full bg-red-50 px-2.5 py-0.5 font-medium text-red-700">
            {error}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {dirty && onDiscard && (
          <button
            onClick={onDiscard}
            className="rounded-full px-4 py-2 text-[12.5px] font-medium text-[#525252] transition-colors hover:bg-[#fafaf9] hover:text-[#171717]"
          >
            Forkast
          </button>
        )}
        <button
          onClick={onSave}
          disabled={!dirty || saving}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#171717] px-5 py-2 text-[13px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition-all hover:bg-[#000] disabled:cursor-not-allowed disabled:bg-[#e5e5e4] disabled:text-[#a3a3a3] disabled:shadow-none"
        >
          {saving ? "Lagrer..." : "Lagre endringer"}
        </button>
      </div>
    </div>
  );
}

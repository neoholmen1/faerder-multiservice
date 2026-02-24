import type { Metadata } from "next";
import Link from "next/link";
import { Phone } from "lucide-react";
import { Confetti } from "@/components/Confetti";

export const metadata: Metadata = {
  title: "Takk for din henvendelse · Færder Multiservice",
  robots: { index: false, follow: false },
};

export default function TakkPage() {
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 pt-20 text-center">
      <Confetti />
      {/* Animated checkmark */}
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
        <svg
          className="check-animate"
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
        >
          <circle
            cx="20"
            cy="20"
            r="18"
            stroke="#22c55e"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M12 20l6 6 10-12"
            stroke="#22c55e"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>
      <h1 className="mt-8 text-[clamp(1.75rem,4vw,3rem)] font-bold tracking-[-0.03em] leading-[1.1] text-text">
        Takk for din henvendelse!
      </h1>
      <p className="mx-auto mt-4 max-w-md text-[17px] leading-[1.7] text-text-secondary">
        Vi har mottatt meldingen din og svarer vanligvis innen 1 virkedag.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <a
          href="tel:+4796823647"
          className="inline-flex items-center gap-2 text-[15px] font-medium text-text-secondary transition-colors duration-150 hover:text-primary"
        >
          <Phone size={15} />
          Haster? Ring 968 23 647
        </a>
      </div>
      <Link
        href="/"
        className="mt-12 text-sm font-medium text-primary transition-opacity duration-200 hover:opacity-70"
      >
        ← Tilbake til forsiden
      </Link>
    </section>
  );
}

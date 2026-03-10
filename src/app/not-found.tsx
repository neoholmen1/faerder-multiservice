import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "404 — Siden finnes ikke",
  description: "Denne siden finnes ikke. Se våre tjenester eller kontakt oss.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section
      className="flex min-h-[100vh] flex-col items-center justify-center px-6 text-center"
      style={{ background: "#faf8f5" }}
    >
      <span
        className="font-serif text-[120px] leading-none tracking-tight text-primary select-none"
        style={{ opacity: 0.15 }}
      >
        404
      </span>

      <h1 className="mt-6 text-[clamp(1.5rem,4vw,2.25rem)] tracking-[-0.02em] text-text">
        Denne siden finnes ikke
      </h1>

      <p className="mx-auto mt-3 max-w-sm text-[15px] leading-[1.6] text-text-secondary">
        Siden du leter etter er flyttet eller finnes ikke lenger.
      </p>

      <Link
        href="/"
        className="btn-glow mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-[15px] font-semibold text-white"
      >
        Tilbake til forsiden <ArrowRight size={16} />
      </Link>

      <a
        href="tel:+4796823647"
        className="mt-6 inline-flex items-center gap-2 text-[15px] text-text-secondary transition-colors duration-150 hover:text-primary"
      >
        <Phone size={15} />
        Trenger du hjelp? Ring 968 23 647
      </a>
    </section>
  );
}

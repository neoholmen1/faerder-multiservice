import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Siden finnes ikke",
};

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <span className="text-8xl font-extralight tracking-tight text-primary">
        404
      </span>
      <h1 className="mt-6 text-2xl font-bold tracking-[-0.03em] text-text">
        Denne siden finnes ikke
      </h1>
      <p className="mt-3 text-[15px] text-text-secondary">
        Men vi finner det du trenger:
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Link
          href="/tjenester"
          className="btn-glow inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-[15px] font-semibold text-white"
        >
          Se tjenester
        </Link>
        <Link
          href="/kontakt"
          className="btn-outline inline-flex items-center gap-2 rounded-full border-2 border-gray-200 px-7 py-3.5 text-[15px] font-medium text-text-secondary hover:border-gray-300 hover:text-text"
        >
          Kontakt oss
        </Link>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";

export function DemoGate() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(false);
    try {
      const res = await fetch("/api/demo-session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        window.location.href = "/";
        return;
      }
      setError(true);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf8f5] px-6">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_12px_40px_rgba(0,0,0,0.06)]">
        <p className="text-[12px] font-semibold tracking-[0.2em] text-[#E8721C] uppercase">
          Utkast
        </p>
        <h1 className="mt-3 text-[26px] leading-tight tracking-[-0.02em] text-[#1A1A1A]">
          Færder Multiservice
        </h1>
        <p className="mt-3 text-[14px] leading-[1.6] text-[#6B7280]">
          Denne siden er et arbeidsutkast og ikke publisert. Skriv inn
          tilgangskoden for å se den.
        </p>

        <form onSubmit={submit} className="mt-7">
          <label htmlFor="demo-pass" className="sr-only">
            Tilgangskode
          </label>
          <input
            id="demo-pass"
            type="password"
            autoFocus
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Tilgangskode"
            className="h-12 w-full rounded-xl border border-gray-200 bg-[#faf8f5] px-4 text-base text-[#1A1A1A] outline-none transition-all duration-200 focus:border-[#E8721C] focus:ring-2 focus:ring-[#E8721C]/10"
          />
          {error && (
            <p className="mt-3 text-[13.5px] text-red-600">
              Feil kode. Prøv igjen.
            </p>
          )}
          <button
            type="submit"
            disabled={busy || !password}
            className="mt-4 h-12 w-full rounded-xl bg-[#E8721C] text-[15px] font-semibold text-white transition-opacity duration-200 disabled:opacity-50"
          >
            {busy ? "Sjekker…" : "Vis utkastet"}
          </button>
        </form>

        <p className="mt-7 text-[12px] text-[#9CA3AF]">Utkast laget av Axaro</p>
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Database, Sparkles } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace("/admin/nettside");
    });
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setError("");
    setLoggingIn(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoggingIn(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.replace("/admin/nettside");
  }

  // Hvis databasen ikke er konfigurert: vis instruksjoner i stedet for skjema
  if (!isSupabaseConfigured) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#fafafa] p-6">
        <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50">
            <Database className="h-6 w-6 text-amber-600" strokeWidth={1.75} />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-[#171717]">Database ikke koblet til</h1>
          <p className="mt-3 text-[14.5px] leading-relaxed text-[#525252]">
            Admin-panelet krever en Supabase-database. Følg{" "}
            <code className="rounded bg-[#fafaf9] px-1.5 py-0.5 text-[13px] text-[#171717]">
              SUPABASE_SETUP.md
            </code>{" "}
            for å opprette prosjekt, kjøre SQL-migrasjonene og sette miljøvariabler.
          </p>
          <ul className="mt-5 space-y-2 text-[13.5px] text-[#525252]">
            <li className="flex gap-2">
              <span className="mt-0.5 text-[#a3a3a3]">1.</span>
              <span>Opprett gratis Supabase-prosjekt på supabase.com</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-0.5 text-[#a3a3a3]">2.</span>
              <span>
                Kjør SQL-filene i <code className="rounded bg-[#fafaf9] px-1.5 py-0.5 text-[12.5px]">supabase/migrations/</code> i SQL Editor (i nummerrekkefølge)
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-0.5 text-[#a3a3a3]">3.</span>
              <span>
                Legg til <code className="rounded bg-[#fafaf9] px-1.5 py-0.5 text-[12.5px]">NEXT_PUBLIC_SUPABASE_URL</code> og{" "}
                <code className="rounded bg-[#fafaf9] px-1.5 py-0.5 text-[12.5px]">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> i .env.local
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-0.5 text-[#a3a3a3]">4.</span>
              <span>Restart dev-serveren</span>
            </li>
          </ul>
          <a
            href="/"
            className="mt-7 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[#E8721C] hover:text-[#a64f0d]"
          >
            ← Tilbake til forsiden
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#fafafa] p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#E8721C] to-[#a64f0d] text-[15px] font-bold text-white">
            <Sparkles className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-[14px] font-semibold tracking-tight text-[#171717]">
              Færder Multiservice
            </p>
            <p className="text-[11px] text-[#a3a3a3]">Admin-panel</p>
          </div>
        </div>
        <h1 className="mt-7 text-2xl font-bold text-[#171717]">Logg inn</h1>
        <p className="mt-2 text-[13.5px] text-[#737373]">
          Bruk e-post og passord for kontoen din.
        </p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-[12px] font-medium text-[#404040]">
              E-post
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-lg border border-[#ececec] bg-white px-3 text-[14px] text-[#171717] outline-none transition-colors focus:border-[#E8721C] focus:ring-2 focus:ring-[#E8721C]/10"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-[12px] font-medium text-[#404040]">
              Passord
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-lg border border-[#ececec] bg-white px-3 text-[14px] text-[#171717] outline-none transition-colors focus:border-[#E8721C] focus:ring-2 focus:ring-[#E8721C]/10"
            />
          </div>
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-[12.5px] text-red-700">{error}</p>
          )}
          <button
            type="submit"
            disabled={loggingIn}
            className="h-11 w-full rounded-full bg-[#171717] font-semibold text-white transition-colors hover:bg-[#000] disabled:opacity-60"
          >
            {loggingIn ? "Logger inn…" : "Logg inn"}
          </button>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Database } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  getCurrentSite,
  getSiteAccessForCurrentUser,
  type Site,
  type SiteRole,
} from "@/lib/site";
import type { User } from "@supabase/supabase-js";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function CmsLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [site, setSite] = useState<Site | null>(null);
  const [siteRole, setSiteRole] = useState<SiteRole | null>(null);
  const [accessChecking, setAccessChecking] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setAuthReady(true);
      return;
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthReady(true);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setSiteRole(null);
        setSite(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setAccessChecking(true);
    (async () => {
      const currentSite = await getCurrentSite();
      if (cancelled) return;
      setSite(currentSite);
      if (!currentSite) {
        setAccessChecking(false);
        return;
      }
      const access = await getSiteAccessForCurrentUser(currentSite.id);
      if (cancelled) return;
      setSiteRole(access.role);
      setAccessChecking(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  // Database ikke konfigurert
  if (!isSupabaseConfigured) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#fafafa] p-6">
        <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50">
            <Database className="h-6 w-6 text-amber-600" strokeWidth={1.75} />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-[#171717]">Database ikke koblet til</h1>
          <p className="mt-3 text-[14.5px] leading-relaxed text-[#525252]">
            Admin-panelet trenger en Supabase-database for å lagre endringer. Se{" "}
            <code className="rounded bg-[#fafaf9] px-1.5 py-0.5 text-[13px] text-[#171717]">
              SUPABASE_SETUP.md
            </code>{" "}
            for instruksjoner.
          </p>
          <Link
            href="/"
            className="mt-7 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[#E8721C] hover:text-[#a64f0d]"
          >
            ← Tilbake til forsiden
          </Link>
        </div>
      </div>
    );
  }

  if (!authReady || (user && accessChecking)) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E8721C] border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#fafafa] p-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          <h1 className="text-2xl font-bold text-[#171717]">Logg inn</h1>
          <p className="mt-3 text-sm text-[#737373]">
            Du må være innlogget for å redigere innhold.
          </p>
          <Link
            href="/admin"
            className="mt-6 inline-flex w-full justify-center rounded-full bg-[#E8721C] py-3 font-semibold text-white transition-colors hover:bg-[#a64f0d]"
          >
            Til innlogging
          </Link>
        </div>
      </div>
    );
  }

  if (!siteRole) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#fafafa] p-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          <h1 className="text-2xl font-bold text-[#171717]">Ingen tilgang</h1>
          <p className="mt-3 text-sm text-[#737373]">
            Brukeren <span className="font-medium text-[#404040]">{user.email}</span> har ikke
            tilgang til {site?.name ?? "denne siten"}. Be en super-admin om å legge deg inn i
            <code className="ml-1 rounded bg-[#fafaf9] px-1 py-0.5 text-[12px]">site_users</code>.
          </p>
          <button
            onClick={() => supabase?.auth.signOut()}
            className="mt-6 w-full rounded-full bg-[#E8721C] py-3 font-semibold text-white transition-colors hover:bg-[#a64f0d]"
          >
            Logg ut
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex bg-[#fafaf9]">
      <AdminSidebar userEmail={user.email ?? null} />
      <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  );
}

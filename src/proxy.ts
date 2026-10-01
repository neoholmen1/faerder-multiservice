import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Demo-port for utkast-deployen. Aktiv KUN når DEMO_PASSWORD er satt, så
 * produksjonsbygget er upåvirket. Alt utenom selve porten, statiske filer og
 * session-endepunktet krever gyldig cookie.
 */
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png|images/|robots.txt|api/demo-session).*)"],
};

const COOKIE = "faerder_demo";

function token(secret: string) {
  return createHmac("sha256", secret).update("faerder-demo-session").digest("hex");
}

function equal(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export default function proxy(req: NextRequest) {
  const secret = process.env.DEMO_PASSWORD;
  if (!secret) return NextResponse.next();

  const { pathname } = req.nextUrl;
  if (pathname === "/demo-tilgang") return NextResponse.next();

  const value = req.cookies.get(COOKIE)?.value;
  if (value && equal(value, token(secret))) {
    const res = NextResponse.next();
    // Utkastet skal aldri indekseres, uansett hvilken rute som treffes.
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    return res;
  }

  // Redirect, ikke rewrite: ved rewrite ser usePathname() fortsatt den
  // opprinnelige ruta, og da rendres header/footer oppå porten.
  const url = req.nextUrl.clone();
  url.pathname = "/demo-tilgang";
  url.search = "";
  const res = NextResponse.redirect(url);
  res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return res;
}

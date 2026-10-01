/**
 * Ruter som ikke skal ha offentlig header/footer/CTA-er: admin-panelet og
 * demo-porten. Ett sted, så guardene i chrome-komponentene ikke driver fra
 * hverandre.
 *
 * MERK: guarden må stå ETTER alle hooks i komponenten. En tidlig return over
 * dem endrer hook-antallet mellom renders og krasjer React ved klientside-
 * navigasjon inn/ut av disse rutene.
 */
const CHROMELESS = ["/admin", "/demo-tilgang"];

export function isChromelessRoute(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return CHROMELESS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

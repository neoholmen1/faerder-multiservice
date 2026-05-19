/**
 * Hardkodet driftstider for Færder Multiservice.
 *
 * 0 = Søndag, 1 = Mandag, ..., 6 = Lørdag
 * `null` = stengt
 */
const SCHEDULE: Record<number, { open: number; close: number } | null> = {
  0: null, // søn
  1: { open: 8, close: 16 }, // man
  2: { open: 8, close: 16 }, // tir
  3: { open: 8, close: 16 }, // ons
  4: { open: 8, close: 16 }, // tor
  5: { open: 8, close: 16 }, // fre
  6: null, // lør
};

const DAY_LABEL: Record<number, string> = {
  0: "søndag",
  1: "mandag",
  2: "tirsdag",
  3: "onsdag",
  4: "torsdag",
  5: "fredag",
  6: "lørdag",
};

export type OpenStatus = {
  isOpen: boolean;
  /** Kort tekst: "Åpent nå" | "Stengt" */
  label: string;
  /** Detaljtekst: "Stengt — åpner mandag 08:00" eller "Åpent til 16:00" */
  detail: string;
};

/**
 * Returnerer åpningsstatus basert på Oslo-tid (Europa/Oslo).
 * Brukes på server (SSR) — caches via React-tre, oppfriskes når siden re-renderes.
 */
export function getOpenStatus(now: Date = new Date()): OpenStatus {
  // Konverter til Oslo-tid via toLocaleString — fungerer både på server og klient
  const osloString = now.toLocaleString("en-US", { timeZone: "Europe/Oslo" });
  const osloDate = new Date(osloString);
  const day = osloDate.getDay();
  const hour = osloDate.getHours();
  const minute = osloDate.getMinutes();
  const minutesIntoDay = hour * 60 + minute;

  const today = SCHEDULE[day];
  if (today) {
    const openMin = today.open * 60;
    const closeMin = today.close * 60;
    if (minutesIntoDay >= openMin && minutesIntoDay < closeMin) {
      return {
        isOpen: true,
        label: "Åpent nå",
        detail: `Åpent til kl ${pad(today.close)}:00`,
      };
    }
  }

  // Finn neste åpningstid
  for (let offset = 0; offset < 7; offset++) {
    const checkDay = (day + offset) % 7;
    const sched = SCHEDULE[checkDay];
    if (!sched) continue;

    if (offset === 0) {
      // Senere i dag
      if (minutesIntoDay < sched.open * 60) {
        return {
          isOpen: false,
          label: "Stengt nå",
          detail: `Åpner i dag kl ${pad(sched.open)}:00`,
        };
      }
      // Allerede stengt for i dag — fortsett å lete
      continue;
    }

    return {
      isOpen: false,
      label: "Stengt nå",
      detail: `Åpner ${DAY_LABEL[checkDay]} kl ${pad(sched.open)}:00`,
    };
  }

  return { isOpen: false, label: "Stengt", detail: "" };
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

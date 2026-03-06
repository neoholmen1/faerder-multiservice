import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// ── Resend client (lazy — avoids build crash when env var is missing) ──
let _resend: Resend | null = null;
function getResend() {
  if (!_resend) {
    if (!process.env.RESEND_API_KEY) return null;
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

// ── Rate limiter (optional — skipped if env vars missing) ──
const ratelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: new Redis({
          url: process.env.UPSTASH_REDIS_REST_URL,
          token: process.env.UPSTASH_REDIS_REST_TOKEN,
        }),
        limiter: Ratelimit.slidingWindow(5, "1 h"),
        analytics: true,
        prefix: "lead",
      })
    : null;

// ── POST /api/lead ──
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Honeypot
    if (body.website) {
      return NextResponse.json({ success: true });
    }

    // Validation
    const navn = String(body.navn ?? "").trim();
    const telefon = String(body.telefon ?? "").trim();
    if (!navn) return NextResponse.json({ error: "Navn er påkrevd" }, { status: 400 });
    if (!telefon || !/^[\d\s+()-]{8,}$/.test(telefon))
      return NextResponse.json({ error: "Ugyldig telefonnummer" }, { status: 400 });

    // Rate limiting
    if (ratelimit) {
      const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "127.0.0.1";
      const { success } = await ratelimit.limit(ip);
      if (!success) {
        return NextResponse.json(
          { error: "For mange forespørsler. Vennligst prøv igjen senere." },
          { status: 429 }
        );
      }
    }

    const postnummer = String(body.postnummer ?? "").trim();
    const tidspunkt = String(body.tidspunkt ?? "").trim();
    const tjeneste = String(body.tjeneste ?? "").trim();
    const valg = body.valg as Record<string, string> | undefined;
    const tillegg = body.tillegg as string[] | undefined;
    const estimertPris = String(body.estimertPris ?? "").trim();

    const resend = getResend();
    if (!resend) {
      return NextResponse.json(
        { error: "E-post er ikke konfigurert." },
        { status: 503 }
      );
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
    const notificationEmail = process.env.NOTIFICATION_EMAIL ?? "post@faerdermultiservice.no";

    // Build details rows
    const detailRows: string[] = [];
    detailRows.push(row("Navn", navn));
    detailRows.push(row("Telefon", `<a href="tel:${esc(telefon)}" style="color:#E8721C;">${esc(telefon)}</a>`));
    if (postnummer) detailRows.push(row("Postnummer", postnummer));
    if (tidspunkt) detailRows.push(row("Foretrukket tidspunkt", tidspunkt));
    detailRows.push(row("Tjeneste", `<strong>${esc(tjeneste)}</strong>`));

    if (valg && Object.keys(valg).length > 0) {
      for (const [label, value] of Object.entries(valg)) {
        detailRows.push(row(esc(label), esc(value)));
      }
    }

    if (tillegg && tillegg.length > 0) {
      detailRows.push(row("Tillegg", tillegg.map(esc).join(", ")));
    }

    if (estimertPris) {
      detailRows.push(row("Estimert pris", `<strong style="color:#E8721C;">${esc(estimertPris)}</strong>`));
    }

    await resend.emails.send({
      from: fromEmail,
      to: notificationEmail,
      subject: `Ny lead: ${tjeneste} — ${navn}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1A1A1A; margin-bottom: 8px;">Ny lead fra prisestimatoren</h2>
          <p style="color: #6B7280; font-size: 14px; margin: 0 0 24px;">Kunden har brukt prisestimatoren og ønsker et tilbud.</p>
          <table style="width: 100%; border-collapse: collapse;">
            ${detailRows.join("\n")}
          </table>
          <p style="margin-top: 24px; font-size: 13px; color: #9CA3AF;">Sendt fra prisestimatoren på faerdermultiservice.no</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Lead API error:", err);
    return NextResponse.json(
      { error: "Noe gikk galt. Vennligst prøv igjen eller ring oss direkte." },
      { status: 500 }
    );
  }
}

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding: 10px 0; color: #6B7280; width: 150px; vertical-align: top;">${label}</td>
    <td style="padding: 10px 0; color: #1A1A1A;">${value}</td>
  </tr>`;
}

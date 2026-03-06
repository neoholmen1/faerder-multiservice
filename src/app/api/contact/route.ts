import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// ── Resend client ──
const resend = new Resend(process.env.RESEND_API_KEY);

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
      })
    : null;

// ── Validation ──
function validateBody(body: Record<string, unknown>) {
  const navn = String(body.navn ?? "").trim();
  const epost = String(body.epost ?? "").trim();
  const telefon = String(body.telefon ?? "").trim();

  if (!navn) return "Navn er påkrevd";
  if (!epost || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(epost))
    return "Ugyldig e-postadresse";
  if (!telefon || !/^[\d\s+()-]{8,}$/.test(telefon))
    return "Ugyldig telefonnummer";

  return null;
}

// ── POST /api/contact ──
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Honeypot — bots fill this hidden field
    if (body.website) {
      return NextResponse.json({ success: true });
    }

    // Server-side validation
    const validationError = validateBody(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    // Rate limiting
    if (ratelimit) {
      const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "127.0.0.1";
      const { success } = await ratelimit.limit(ip);
      if (!success) {
        return NextResponse.json(
          { error: "For mange henvendelser. Vennligst prøv igjen senere." },
          { status: 429 }
        );
      }
    }

    const navn = String(body.navn).trim();
    const epost = String(body.epost).trim();
    const telefon = String(body.telefon).trim();
    const sted = String(body.sted ?? "").trim();
    const tjeneste = String(body.tjeneste ?? "").trim();
    const melding = String(body.melding ?? "").trim();

    const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
    const notificationEmail = process.env.NOTIFICATION_EMAIL ?? "post@faerdermultiservice.no";

    // 1. Send notification to the business
    await resend.emails.send({
      from: fromEmail,
      to: notificationEmail,
      subject: `Ny henvendelse fra ${navn} — ${tjeneste || "Generell"}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1A1A1A; margin-bottom: 24px;">Ny henvendelse fra nettsiden</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; color: #6B7280; width: 120px; vertical-align: top;">Navn</td>
              <td style="padding: 10px 0; color: #1A1A1A; font-weight: 500;">${escapeHtml(navn)}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #6B7280; vertical-align: top;">E-post</td>
              <td style="padding: 10px 0;"><a href="mailto:${escapeHtml(epost)}" style="color: #E8721C;">${escapeHtml(epost)}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #6B7280; vertical-align: top;">Telefon</td>
              <td style="padding: 10px 0;"><a href="tel:${escapeHtml(telefon)}" style="color: #E8721C;">${escapeHtml(telefon)}</a></td>
            </tr>
            ${sted ? `<tr><td style="padding: 10px 0; color: #6B7280; vertical-align: top;">Sted</td><td style="padding: 10px 0; color: #1A1A1A;">${escapeHtml(sted)}</td></tr>` : ""}
            ${tjeneste ? `<tr><td style="padding: 10px 0; color: #6B7280; vertical-align: top;">Tjeneste</td><td style="padding: 10px 0; color: #1A1A1A; font-weight: 500;">${escapeHtml(tjeneste)}</td></tr>` : ""}
          </table>
          ${
            melding
              ? `<div style="margin-top: 20px; padding: 16px; background: #F9F8F6; border-radius: 12px;">
                  <p style="color: #6B7280; font-size: 13px; margin: 0 0 8px;">Melding</p>
                  <p style="color: #1A1A1A; white-space: pre-wrap; margin: 0;">${escapeHtml(melding)}</p>
                </div>`
              : ""
          }
          <p style="margin-top: 24px; font-size: 13px; color: #9CA3AF;">Sendt fra kontaktskjemaet på faerdermultiservice.no</p>
        </div>
      `,
    });

    // 2. Send confirmation to the customer
    await resend.emails.send({
      from: fromEmail,
      to: epost,
      subject: "Takk for din henvendelse — Færder Multiservice",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1A1A1A;">Hei ${escapeHtml(navn)}!</h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.7;">
            Takk for din henvendelse! Vi har mottatt meldingen din og svarer vanligvis innen 24 timer.
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.7;">
            Har du det travelt? Ring oss gjerne direkte på
            <a href="tel:+4796823647" style="color: #E8721C; font-weight: 500;">968 23 647</a>.
          </p>
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;" />
          <p style="color: #9CA3AF; font-size: 13px;">
            Færder Multiservice AS · Rambergveien, 3115 Tønsberg<br />
            <a href="https://faerdermultiservice.no" style="color: #E8721C;">faerdermultiservice.no</a>
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Noe gikk galt. Vennligst prøv igjen eller ring oss direkte." },
      { status: 500 }
    );
  }
}

// ── HTML escape to prevent XSS in emails ──
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

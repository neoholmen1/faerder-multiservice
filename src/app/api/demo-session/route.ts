import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Demo-port. Passordet sammenlignes KUN her, mot DEMO_PASSWORD, og når aldri
 * klient-bundelen. Nettleseren får en httpOnly-cookie med et token *avledet*
 * fra hemmeligheten — selve hemmeligheten forlater aldri serveren.
 *
 * Samme mønster som Prima (app/api/admin/session/route.ts).
 */
export const dynamic = "force-dynamic";

export const DEMO_COOKIE = "faerder_demo";

function token(secret: string) {
  return createHmac("sha256", secret).update("faerder-demo-session").digest("hex");
}

function equal(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export async function GET() {
  const secret = process.env.DEMO_PASSWORD;
  const jar = await cookies();
  const value = jar.get(DEMO_COOKIE)?.value;
  const ok = Boolean(secret && value && equal(value, token(secret)));
  return Response.json({ ok });
}

export async function POST(req: Request) {
  const secret = process.env.DEMO_PASSWORD;
  let password = "";
  try {
    password = String(((await req.json()) as { password?: string }).password ?? "");
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  if (!secret || !password || !equal(password, secret)) {
    return Response.json({ ok: false }, { status: 401 });
  }

  const jar = await cookies();
  jar.set(DEMO_COOKIE, token(secret), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return Response.json({ ok: true });
}

export async function DELETE() {
  const jar = await cookies();
  jar.delete(DEMO_COOKIE);
  return Response.json({ ok: true });
}

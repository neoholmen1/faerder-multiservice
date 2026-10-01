import type { Metadata } from "next";
import { DemoGate } from "./DemoGate";

export const metadata: Metadata = {
  title: { absolute: "Utkast — Færder Multiservice" },
  robots: { index: false, follow: false },
};

export default function DemoTilgangPage() {
  return <DemoGate />;
}

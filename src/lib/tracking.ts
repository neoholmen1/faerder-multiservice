import { track } from "@vercel/analytics";

export function trackEvent(name: string, props?: Record<string, string>) {
  track(name, props);
}

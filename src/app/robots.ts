import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // Utkast-deploy: steng alt ute, og ikke pek på et sitemap.
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "1") {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/takk", "/takk/tilbud", "/api/"],
      },
    ],
    sitemap: "https://faerdermultiservice.no/sitemap.xml",
  };
}

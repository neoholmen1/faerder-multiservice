import type { MetadataRoute } from "next";
import { services } from "@/data/services";
import { blogPosts } from "@/data/blog";

const BASE_URL = "https://faerdermultiservice.no";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/tjenester`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/prisliste`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/om-oss`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/kontakt`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/blogg`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/jobb`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/personvern`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const servicePages: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${BASE_URL}/tjenester/${s.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${BASE_URL}/blogg/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...servicePages, ...blogPages];
}

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { LEGAL_VERSION } from "@/lib/legal";

export default function sitemap(): MetadataRoute.Sitemap {
  const legal = new Date(LEGAL_VERSION);
  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/developers`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/advertisers`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/terms`, lastModified: legal, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/privacy`, lastModified: legal, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/cookies`, lastModified: legal, changeFrequency: "yearly", priority: 0.3 },
  ];
}

import type { MetadataRoute } from "next";

const SITE_URL = "https://openwearablesai.com";

/** See robots.ts — static export needs the same opt-in here. */
export const dynamic = "force-static";

/**
 * One page, so one entry. The in-page sections are anchors on it, and listing
 * anchors as separate URLs would only be noise to a crawler.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}

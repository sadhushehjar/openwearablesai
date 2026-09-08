import type { MetadataRoute } from "next";

const SITE_URL = "https://openwearablesai.com";

/**
 * Next 16 treats robots.ts as a route handler, and `output: "export"` refuses
 * to collect one that has not opted into static rendering — the build fails
 * with a bare "Failed to collect page data for /robots.txt". This is the opt-in.
 */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

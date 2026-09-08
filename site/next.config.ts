import type { NextConfig } from "next";

/**
 * GitHub Pages serves plain files, so the site is exported as static HTML.
 *
 * Where it is served from decides how assets must be addressed, and the two
 * destinations disagree:
 *
 *   - https://sadhushehjar.github.io/openwearablesai/  needs every asset
 *     prefixed with /openwearablesai, or the browser asks the domain root for
 *     /_next/... and gets a 404 — the page loads as unstyled HTML.
 *   - https://openwearablesai.com/                     serves from the root, so
 *     the prefix must be absent or the same requests 404 the other way.
 *
 * PAGES_BASE_PATH is set by the deploy workflow. It carries the subpath while
 * the site lives on github.io, and is dropped once DNS points the apex domain
 * at Pages.
 */
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",

  ...(basePath ? { basePath, assetPrefix: basePath } : {}),

  /** next/image and next/link get the prefix for free; a raw <a href> to a file
   *  in public/ does not, so the value is published for those call sites. */
  env: { NEXT_PUBLIC_BASE_PATH: basePath },

  /** the Image Optimization API needs a server; static export cannot use it */
  images: { unoptimized: true },

  /** emit /about/index.html style paths, which static hosts resolve cleanly */
  trailingSlash: true,
};

export default nextConfig;

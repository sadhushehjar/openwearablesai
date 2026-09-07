import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * GitHub Pages serves plain files — no Next.js server — so the site is
   * exported as static HTML into `out/`.
   *
   * The custom apex domain (openwearablesai.com) serves from the root, so no
   * basePath/assetPrefix is needed. If this were ever served from
   * <user>.github.io/<repo>/ instead, both would have to be set to "/<repo>".
   */
  output: "export",

  /** the Image Optimization API needs a server; static export cannot use it */
  images: { unoptimized: true },

  /** emit /about/index.html style paths, which static hosts resolve cleanly */
  trailingSlash: true,
};

export default nextConfig;

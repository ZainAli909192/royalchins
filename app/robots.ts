import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/store/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/account/", "/auth/", "/checkout/", "/cart", "/search"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}

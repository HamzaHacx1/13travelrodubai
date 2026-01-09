import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";


const withNextIntl = createNextIntlPlugin("./i18n.ts");
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    localPatterns: [
      {
        pathname: "/api/rayna/image",
      },
      {
        pathname: "/**",
        search: "",
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "d2g4iwshf24scx.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "d1i3enf1i5tb1f.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);

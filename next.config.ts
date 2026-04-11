import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cpudvcdiszjltgwkorrj.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/document-covers/**",
      },
    ],
  },

  async redirects() {
    return [
      {
        source: "/kocluk",
        destination: "https://prekoc.com.tr",
        permanent: true,
      },
      {
        source: "/kocluk/:path*",
        destination: "https://prekoc.com.tr/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
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
};

export default nextConfig;
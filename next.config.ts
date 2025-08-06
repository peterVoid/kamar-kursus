import { env } from "@/env";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${env.NEXT_PUBLIC_S3_BUCKET_NAME}.t3.storageapi.dev`,
      },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['storage.sujjeee.com'],
  },
  env: {
    API_URL: process.env.API_URL,
    API_TOKEN: process.env.API_TOKEN
  }
};

export default nextConfig;

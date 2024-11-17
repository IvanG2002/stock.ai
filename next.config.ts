import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['storage.sujjeee.com'],
  },
  env: {
    API_URL: 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large',
    API_TOKEN: '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'
  }
};

export default nextConfig;

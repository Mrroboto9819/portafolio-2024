import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  runtimeConfig: {
    mailgunApiKey: process.env.MAILGUN_API_KEY,
    mailgunDomain: process.env.MAILGUN_DOMAIN,
    jwtSecret: process.env.JWT_SECRET,
    public: {}
  }
};

export default nextConfig;

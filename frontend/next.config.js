/** @type {import('next').NextConfig} */
require('dotenv').config({ path: `./.env` });

const nextConfig = {
  reactStrictMode: false,
  env: {
    // Reference a variable that was defined in the .env.* file and make it available at Build Time
    title: process.env.title,
    apiRoot:  process.env.apiRoot,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  }
}

module.exports = nextConfig

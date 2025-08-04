/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3001',
    USE_MOCK: process.env.USE_MOCK || 'true',
  },
}

module.exports = nextConfig
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
      API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000/api/v1',
      WS_URL: process.env.WS_URL || 'ws://localhost:3000/api/v1/ws'
    }
  }
  
  module.exports = nextConfig
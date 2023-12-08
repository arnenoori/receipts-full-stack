/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        hostname: "uploadthing.com",
        protocol: "https",
        pathname: "/f/**",
        port: ''
      },
      {
        hostname: "utfs.io",
        protocol: "https",
        pathname: "/f/**",
        port: ''
      },
      {
        hostname: "img.clerk.com",
        protocol: "https",
        pathname: "/**",
        port: ''
      }
    ]
  }
}

module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "kapruka.com"
      },
      {
        protocol: "https",
        hostname: "www.kapruka.com"
      },
      {
        protocol: "https",
        hostname: "**.kapruka.com"
      }
    ]
  }
};

export default nextConfig;

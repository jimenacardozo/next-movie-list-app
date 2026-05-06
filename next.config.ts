import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        port: '',
        pathname: '/**'
      },  
      {
        protocol: 'https',
        hostname: 'cdn.otro-sitio.net',
      },
    ]
  }
};

export default nextConfig;

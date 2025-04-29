import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['www.advanceitbd.com',],
    remotePatterns:[
      {
        protocol:'https',
        hostname:'www.advanceitbd.com',
        port:'',
        pathname:'/wp-content/uploads/*',
      }
    ]
  },
};

export default nextConfig;

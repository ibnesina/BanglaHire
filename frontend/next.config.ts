import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['www.advanceitbd.com',],
<<<<<<< HEAD
=======
    remotePatterns:[
      {
        protocol:'https',
        hostname:'www.advanceitbd.com',
        port:'',
        pathname:'/wp-content/uploads/*',
      }
    ]
>>>>>>> 45ee64f07d6bb4f6e0b03962f8df7c0760766fb3
  },
};

export default nextConfig;

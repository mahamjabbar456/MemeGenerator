/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["i.imgflip.com"],
      },
    eslint : {
        ignoreDuringBuilds : true,
    }
};

export default nextConfig;

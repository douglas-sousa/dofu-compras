/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: process.env.BUCKET_DOMAIN,
                pathname: `/${process.env.BUCKET_ID}/**`
            }
        ]
    }
};

export default nextConfig;
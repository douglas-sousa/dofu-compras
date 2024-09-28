/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "storage.googleapis.com",
                pathname: "/bucket.dofu.com.br/**"
            }
        ]
    }
};

export default nextConfig;
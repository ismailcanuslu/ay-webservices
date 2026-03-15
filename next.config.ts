import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    env: {
        // Gateway URL'ini override etmek için .env.local dosyasına ekle:
        // NEXT_PUBLIC_GATEWAY_URL=http://localhost:8000
    },
};

export default nextConfig;

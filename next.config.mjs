/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.r2.cloudflarestorage.com",
      },
    ],
  },

  experimental: {
    serverComponentsExternalPackages: ["@react-pdf/renderer"],
    optimizePackageImports: ["lucide-react", "date-fns", "recharts"],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
      {
        source: "/api/feeds/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=21600, stale-while-revalidate=3600",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/products/:slug",
        destination: "/urunler/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

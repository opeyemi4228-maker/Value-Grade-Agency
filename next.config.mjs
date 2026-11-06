/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  // Database drivers load native/wasm files at runtime, so keep them out of the bundle.
  serverExternalPackages: ["pg", "@electric-sql/pglite"],
  // Account creation moved from /signup to /onboarding. Query strings (e.g. ?as=creator) carry over.
  async redirects() {
    return [{ source: "/signup", destination: "/onboarding", permanent: true }];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // Browsers only honour HSTS over HTTPS, so this is harmless in local development.
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
        ],
      },
      {
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "private, no-store" },
        ],
      },
    ];
  },
};

export default nextConfig;

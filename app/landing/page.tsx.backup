/** @type {import('next').NextConfig} */
const nextConfig = {
  // Elimin experimental.turbo (depractiat în Next.js 15.5.19)
  experimental: {
    images: {
      unoptimized: true,
    },
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://translate.googleapis.com https://www.googleapis.com https://www.google-analytics.com https://assets.mailerlite.com https://api.openai.com https://api.stripe.com; img-src 'self' data: https:;",
          },
        ],
      },
    ];
  },
  // Ignoră erorile ESLint în timpul build-ului (temporar)
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
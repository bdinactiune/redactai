/** @type {import('next').NextConfig} */
const nextConfig = {
  // Mută images la nivelul principal (nu în experimental)
  images: {
    unoptimized: true,
  },
  // Elimină complet experimental.turbo
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
  // Ignoră ESLint temporar
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://translate.google.com https://translate.googleapis.com https://www.googletagmanager.com https://www.google-analytics.com https://assets.mailerlite.com; connect-src 'self' https://translate.googleapis.com https://api.openai.com https://api.stripe.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RedactAI - Generator de conținut cu Inteligență Artificială",
  description: "Generează articole, email-uri, postări pe social media și multe altele cu ajutorul AI-ului. Rapid, simplu, profesional.",
  metadataBase: new URL('https://redactai.ro'),
  openGraph: {
    title: 'RedactAI - Generator de conținut AI',
    description: 'Generează conținut de calitate în câteva secunde cu ajutorul inteligenței artificiale.',
    url: 'https://redactai.ro',
    siteName: 'RedactAI',
    locale: 'ro_RO',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <head>
        <meta name="google-site-verification" content="CZAKUhMQJAC" />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-37YNOKZ605"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-37YNOKZ605');
            `,
          }}
        />
      </head>
      <body>
        {children}
        <footer className="border-t mt-12 py-6 text-center">
          <div className="max-w-md mx-auto mb-4">
            <h3 className="font-bold mb-2">Abonează-te la newsletter</h3>
            <p className="text-sm text-gray-600 mb-3">Primești oferte și noutăți RedactAI</p>
            <form action="https://formspree.io/f/xzdkovrp" method="POST" className="flex gap-2">
              <input type="email" name="email" placeholder="Email" required className="border rounded p-2 flex-1" />
              <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">Abonează-te</button>
            </form>
            <p className="text-xs text-gray-400 mt-2">Nu trimitem spam. Poți dezabona oricând.</p>
          </div>
          <div className="space-x-4">
            <a href="/" className="text-purple-600 hover:underline">🇷🇴 Română</a>
            <a href="/en" className="text-gray-500 hover:underline">🇬🇧 English</a>
          </div>
          <p className="text-xs text-gray-400 mt-4">© 2026 RedactAI. Toate drepturile rezervate.</p>
        </footer>
      </body>
    </html>
  );
}
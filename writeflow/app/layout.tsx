import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WriteFlow - AI Writing Assistant",
  description: "Generate high-quality content with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <head>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-Q2N4MP3H77"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-Q2N4MP3H77');
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
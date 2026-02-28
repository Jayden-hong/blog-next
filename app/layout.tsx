import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { WebsiteJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: {
    default: "No Noise Blog",
    template: "%s | No Noise Blog"
  },
  description: "Your attention is valuable. Every day: 6 must-reads, plus my latest writing.",
  keywords: ["tech", "AI", "programming", "daily read", "RSS", "software engineering"],
  authors: [{ name: "Jayden" }],
  creator: "Jayden",
  metadataBase: new URL("https://blog.zucchini.win"),
  alternates: {
    canonical: "/",
    types: {
      'application/rss+xml': 'https://blog.zucchini.win/rss.xml',
      'application/json': 'https://blog.zucchini.win/feed.json',
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://blog.zucchini.win",
    siteName: "No Noise Blog",
    title: "No Noise Blog",
    description: "Your attention is valuable. Every day: 6 must-reads, plus my latest writing.",
  },
  twitter: {
    card: "summary_large_image",
    title: "No Noise Blog",
    description: "Your attention is valuable. Every day: 6 must-reads, plus my latest writing.",
    creator: "@jaydenkahn",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <WebsiteJsonLd />
      </head>
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased min-h-screen bg-white text-neutral-900`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

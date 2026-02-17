import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jayden's Blog",
  description: "AI 产品经理的思考与实践",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.className} antialiased min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}


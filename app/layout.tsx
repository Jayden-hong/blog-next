import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jayden's Blog - AI产品经理的思考与实践",
  description: "分享 AI 产品、技术工具、个人思考",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

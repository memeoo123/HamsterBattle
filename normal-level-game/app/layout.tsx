import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const image = `${origin}/og.png`;

  return {
    metadataBase: new URL(origin),
    title: "仓鼠防线 · 正常关卡",
    description: "使用真实主线配置运行的可玩关卡骨架。",
    openGraph: {
      title: "仓鼠防线 · 正常关卡",
      description: "200 个主线关卡，选关、布塔、战斗与结算已可运行。",
      type: "website",
      url: origin,
      images: [{ url: image, width: 1200, height: 630, alt: "仓鼠防线正常关卡重建" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "仓鼠防线 · 正常关卡",
      description: "200 个主线关卡的可玩重建版本。",
      images: [image],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
import type { Metadata } from "next";
import "./globals.css";
import "../src/styles/pixel.css";

export const metadata: Metadata = {
  title: "不吃灰｜收藏卡带放映机",
  description: "把收藏链接变成游戏卡带，重新播放那些值得回看的内容。",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Noto+Sans+SC:wght@400;500;700;900&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}

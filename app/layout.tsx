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
      <body>{children}</body>
    </html>
  );
}

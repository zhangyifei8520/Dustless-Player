import type { Metadata } from "next";
import { AboutPage } from "@/src/components/AboutPage";

export const metadata: Metadata = {
  title: "关于｜不吃灰收藏夹播放器",
  description: "了解不吃灰收藏夹播放器的使用方式与创作团队。",
};

export default function AboutRoute() {
  return <AboutPage />;
}

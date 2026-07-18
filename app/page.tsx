import type { Metadata } from "next";
import { GamePrototype } from "@/src/components/GamePrototype";

export const metadata: Metadata = {
  title: "不吃灰｜收藏卡带放映机",
  description: "把收藏链接变成游戏卡带，重新播放那些值得回看的内容。",
};

export default function Home() {
  return <GamePrototype />;
}

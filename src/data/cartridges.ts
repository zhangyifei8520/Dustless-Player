export type Cartridge = {
  id: string;
  category: "health" | "learn" | "explore";
  color: "green" | "pink" | "yellow";
  source: "bilibili" | "xiaohongshu" | "youtube" | "external";
  url: string;
  code: string;
  icon: string;
  title: string;
  summary: string;
  thumbnail?: string | null;
};

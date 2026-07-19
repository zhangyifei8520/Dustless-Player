export type Cartridge = {
  id: string;
  color: "green" | "blue" | "pink";
  source: "bilibili" | "xiaohongshu" | "youtube";
  url: string;
  code: string;
  title: string;
  summary: string;
};

export const cartridges: Cartridge[] = [
  {
    id: "hb-01",
    color: "green",
    source: "youtube",
    url: "https://www.youtube.com/watch?v=K5KVEU3aaeQ&t=56s",
    code: "HB-01",
    title: "灵感收藏放映室",
    summary: "把值得回看的生活灵感重新装进一张随时可播的卡带。",
  },
  {
    id: "ls-02",
    color: "blue",
    source: "bilibili",
    url: "https://www.bilibili.com/video/BV1wL9sYEE8t/",
    code: "LS-02",
    title: "今日学习录像带",
    summary: "用一次专注放映完整看完这份值得收藏的学习内容。",
  },
  {
    id: "cr-03",
    color: "pink",
    source: "bilibili",
    url: "https://www.bilibili.com/video/BV1hKKV6MEHM/",
    code: "CR-03",
    title: "创意补给播放卡",
    summary: "把曾经打动你的创意内容变成下一次行动灵感。",
  },
];

export type Cartridge = {
  id: string;
  color: "green" | "blue" | "pink";
  source: "bilibili" | "xiaohongshu";
  url: string;
  code: string;
  title: string;
  category: string;
  summary: string;
  status: "sealed" | "ready" | "playing";
  date: string;
};

export const cartridges: Cartridge[] = [
  {
    id: "hb-01",
    color: "green",
    source: "xiaohongshu",
    url: "https://www.xiaohongshu.com/explore/6829a272000000002100a94e",
    code: "HB-01",
    title: "灵感收藏放映室",
    category: "生活方式 · 图文笔记",
    summary: "把值得回看的生活灵感收进卡带。用轻松的方式重新打开收藏，让好点子不再吃灰。",
    status: "ready",
    date: "07.18",
  },
  {
    id: "ls-02",
    color: "blue",
    source: "bilibili",
    url: "https://www.bilibili.com/video/BV1wL9sYEE8t/",
    code: "LS-02",
    title: "今日学习录像带",
    category: "知识充电 · 视频收藏",
    summary: "把长视频拆成一次有仪式感的观看。插入卡带、等待读盘，然后专心看完这份收藏。",
    status: "sealed",
    date: "07.18",
  },
  {
    id: "cr-03",
    color: "pink",
    source: "bilibili",
    url: "https://www.bilibili.com/video/BV1hKKV6MEHM/",
    code: "CR-03",
    title: "创意补给播放卡",
    category: "创作灵感 · 视频收藏",
    summary: "一张等待播放的创意卡带。回看曾经打动你的内容，把收藏重新变成下一次行动。",
    status: "sealed",
    date: "07.18",
  },
];

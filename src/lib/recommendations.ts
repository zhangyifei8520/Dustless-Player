import type { Cartridge } from "../data/cartridges";

export const LIBRARY_STORAGE_KEY = "nochigui-library-v3";
export const HOME_RECOMMENDATIONS_STORAGE_KEY = "dustless-home-recommendations-v1";

export type CartridgeCategory = Cartridge["category"];

type LibraryItem = {
  code: string;
  icon: string;
  title: string;
  desc: string;
  src: string;
  url: string;
  thumb?: string;
};

export type LibraryCatalog = Record<CartridgeCategory, { items: LibraryItem[] }>;

const health = [
  ["HB-01", "60", "60分钟普拉提", "GetFitWithMe · 跟练视频", "B站", "https://www.bilibili.com/video/BV1LR4y1u72j/"],
  ["HB-02", "AM", "30min早起拉伸", "唤醒全身的晨间跟练", "B站", "https://www.bilibili.com/video/BV13g4y1u7di/"],
  ["HB-03", "7D", "一周高效减脂餐", "4个月瘦30斤的实操餐单", "B站", "https://www.bilibili.com/video/BV1vh411B7Bw/"],
  ["HB-04", "DB", "40分钟哑铃塑形", "哑铃全身塑形跟练", "B站", "https://www.bilibili.com/video/BV1mw41167Gr/"],
  ["HB-05", "21", "备战第一场半马", "新手跑者的备赛干货", "B站", "https://www.bilibili.com/video/BV1kFFazkENm/"],
  ["HB-06", "GO", "站立有氧燃脂操", "30分钟无跳跃燃脂跟练", "B站", "https://www.bilibili.com/video/BV1sA411Q7R3/"],
  ["HB-07", "HM", "家常菜合集", "意犹l · 下厨房菜谱", "下厨房", "https://www.xiachufang.com/recipe/107689354/"],
] as const;

const learn = [
  ["LC-01", "PY", "Python全课程", "零基础英文全套课程", "YouTube", "https://www.youtube.com/watch?v=K5KVEU3aaeQ"],
  ["LC-02", "VC", "Vibe Coding", "2026新手完整课程", "YouTube", "https://www.youtube.com/watch?v=BpOsHF5Oj_I"],
  ["LC-03", "3D", "Blender入门", "零基础建模教程", "B站", "https://www.bilibili.com/video/BV14u41147YH/"],
  ["LC-04", "CL", "一小时色彩扫盲", "芜菁F- · 绘画色彩课", "B站", "https://www.bilibili.com/video/BV1qy421i7Bw/"],
  ["LC-05", "AI", "AI可解释性研究", "Anthropic 研究工作台", "网页", "https://transformer-circuits.pub/2026/workspace/index.html"],
  ["LC-06", "SP", "LLM交互识别", "Berkeley AI 研究博客", "网页", "https://bair.berkeley.edu/blog/2026/03/13/spex/"],
  ["LC-07", "AG", "智能体发展史", "Datawhale 开源教程", "网页", "https://hello-agents.datawhale.cc/#/./chapter2/%E7%AC%AC%E4%BA%8C%E7%AB%A0%20%E6%99%BA%E8%83%BD%E4%BD%93%E5%8F%91%E5%B1%95%E5%8F%B2"],
  ["LC-08", "BG", "AI时代已开启", "比尔·盖茨长文", "网页", "https://www.gatesnotes.com/The-Age-of-AI-Has-Begun"],
] as const;

const explore = [
  ["EX-01", "UB", "乌布印尼VLOG", "在乌布精神吸氧", "B站", "https://www.bilibili.com/video/BV1WyHteAEag/"],
  ["EX-02", "IS", "冰岛异世界旅行", "世界尽头的风景", "B站", "https://www.bilibili.com/video/BV1tY4y1w7GQ/"],
  ["EX-03", "FR", "法西一人旅行", "一个人的欧洲Vlog", "B站", "https://www.bilibili.com/video/BV1t4dUBsEEt/"],
  ["EX-04", "YN", "云南小吃地图", "街头美食合集", "B站", "https://www.bilibili.com/video/BV16MVU6uEos/"],
  ["EX-05", "DL", "大理旅游VLOG", "苍山洱海慢生活", "B站", "https://www.bilibili.com/video/BV1L2ECz1EXC/"],
  ["EX-06", "AU", "澳洲徒步路线", "6条壮观徒步线路", "网页", "https://www.worldnomads.com/explore/oceania/australia/6-spectacular-australia-hikes"],
] as const;

const fallbackThumbnails: Record<string, string> = {
  "HB-01": "https://i0.hdslb.com/bfs/archive/3194257f165cee39d621982d69b76bf8b628588c.jpg",
  "HB-02": "https://i1.hdslb.com/bfs/archive/625384bbed3e74dbc82345d609dc63e96cc92b44.jpg",
  "HB-03": "https://i0.hdslb.com/bfs/archive/08f05405e2897544e84535222ec4960b74ab08b6.jpg",
  "HB-04": "https://i2.hdslb.com/bfs/archive/02656bb8710e00e64adea9ef10cfc870524fae96.jpg",
  "HB-05": "https://i1.hdslb.com/bfs/archive/97fc90a8259983a8f86a7b0ec9bbbd669f72469c.jpg",
  "HB-06": "https://i1.hdslb.com/bfs/archive/6ee887b30fbf6f836bdef1dfbe5a25f6aaaf18b8.jpg",
  "HB-07": "https://i2.chuimg.com/9b739377d531444aaad276df10e6778d_1080w_1440h.jpg?imageView2/2/w/660/interlace/1/q/75",
  "LC-01": "https://img.youtube.com/vi/K5KVEU3aaeQ/hqdefault.jpg",
  "LC-02": "https://img.youtube.com/vi/BpOsHF5Oj_I/hqdefault.jpg",
  "LC-03": "https://i2.hdslb.com/bfs/archive/9b45c566fc54ad6e6555d7075179acf7cd9c6077.jpg",
  "LC-04": "https://i1.hdslb.com/bfs/archive/263248d52719c642d52ba39fda52cd3870be930d.jpg",
  "LC-05": "https://transformer-circuits.pub/2026/workspace/png/img_1b62b10ab235e6e7.png",
  "LC-06": "https://bair.berkeley.edu/static/blog/spex/teaser.png",
  "LC-07": "/library-page/assets/hello-agents.png",
  "LC-08": "/library-page/assets/gates-ai.png",
  "EX-01": "https://i0.hdslb.com/bfs/archive/2e58fa6425f55edf88ea0017a15a5790b348bf53.jpg",
  "EX-02": "https://i0.hdslb.com/bfs/archive/214a3e81d03476406ae502d3d762f8b3e2a9e927.jpg",
  "EX-03": "https://i0.hdslb.com/bfs/archive/51dbf0fb90b149b8d8b515e57c9b2b55d347c497.jpg",
  "EX-04": "https://i2.hdslb.com/bfs/archive/dc1f73ad06203d8376d1e17f6b64a263f6b1fb5e.jpg",
  "EX-05": "https://i1.hdslb.com/bfs/archive/42136d4353b4817e513945b08353df58879214f5.jpg",
  "EX-06": "https://media.worldnomads.com/explore/australia/great-walks/great-ocean-walk-social.jpg",
};

function items(records: readonly (readonly string[])[]): LibraryItem[] {
  return records.map(([code, icon, title, desc, src, url]) => ({
    code,
    icon,
    title,
    desc,
    src,
    url,
    thumb: fallbackThumbnails[code],
  }));
}

export const FALLBACK_LIBRARY_CATALOG: LibraryCatalog = {
  health: { items: items(health) },
  learn: { items: items(learn) },
  explore: { items: items(explore) },
};

const categories: CartridgeCategory[] = ["health", "learn", "explore"];
const colors: Record<CartridgeCategory, Cartridge["color"]> = {
  health: "green",
  learn: "pink",
  explore: "yellow",
};

function isValidUrl(value: unknown): value is string {
  if (typeof value !== "string" || !value.trim()) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function normalizeThumbnail(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  if (/^https?:\/\//.test(value)) return value;
  if (value.startsWith("./assets/")) return `/library-page/assets/${value.slice("./assets/".length)}`;
  return null;
}

function normalizeCatalog(value: unknown): LibraryCatalog | null {
  if (!value || typeof value !== "object") return null;
  const catalog = value as Partial<Record<CartridgeCategory, { items?: unknown }>>;
  if (!categories.every((category) => Array.isArray(catalog[category]?.items))) return null;

  return Object.fromEntries(categories.map((category) => [category, {
    items: (catalog[category]?.items as unknown[]).flatMap((item) => {
      if (!item || typeof item !== "object") return [];
      const candidate = item as Partial<LibraryItem>;
      if (!isValidUrl(candidate.url) || typeof candidate.code !== "string" || typeof candidate.icon !== "string" || typeof candidate.title !== "string" || typeof candidate.desc !== "string") return [];
      const thumb = normalizeThumbnail(candidate.thumb);
      return [{
        code: candidate.code,
        icon: candidate.icon,
        title: candidate.title,
        desc: candidate.desc,
        src: typeof candidate.src === "string" ? candidate.src : "网页",
        url: candidate.url,
        ...(thumb ? { thumb } : {}),
      }];
    }),
  }])) as LibraryCatalog;
}

export function parseLibraryCatalog(raw: string | null): LibraryCatalog {
  if (!raw) return FALLBACK_LIBRARY_CATALOG;
  try {
    const parsed = JSON.parse(raw) as { catalog?: unknown };
    return normalizeCatalog(parsed.catalog) ?? FALLBACK_LIBRARY_CATALOG;
  } catch {
    return FALLBACK_LIBRARY_CATALOG;
  }
}

function sourceFor(url: string): Cartridge["source"] {
  try {
    const host = new URL(url).hostname;
    if (host.includes("bilibili.com") || host === "b23.tv") return "bilibili";
    if (host.includes("youtube.com") || host === "youtu.be") return "youtube";
    if (host.includes("xiaohongshu.com") || host.includes("xhslink.com")) return "xiaohongshu";
  } catch { /* invalid URLs are filtered before this point */ }
  return "external";
}

export function buildCartridgePool(catalog: LibraryCatalog): Cartridge[] {
  return categories.flatMap((category) => catalog[category].items
    .filter((item) => isValidUrl(item.url))
    .map((item) => ({
      id: `${category}:${item.code}:${item.url}`,
      category,
      color: colors[category],
      source: sourceFor(item.url),
      url: item.url,
      code: item.code,
      icon: item.icon,
      title: item.title,
      summary: item.desc,
      thumbnail: item.thumb ?? null,
    })));
}

function selectCandidate(candidates: Cartridge[], currentId: string | undefined, used: Set<string>, random: () => number): Cartridge | null {
  const different = candidates.filter((item) => item.id !== currentId && !used.has(item.id));
  const available = different.length ? different : candidates.filter((item) => !used.has(item.id));
  const fallback = available.length ? available : candidates.filter((item) => item.id !== currentId);
  const source = fallback.length ? fallback : candidates;
  return source.length ? source[Math.min(source.length - 1, Math.floor(random() * source.length))] : null;
}

export function pickRecommendations(pool: Cartridge[], current: Cartridge[], random = Math.random): Cartridge[] {
  const used = new Set<string>();
  return categories.flatMap((category, index) => {
    const preferred = pool.filter((item) => item.category === category);
    const alternatives = pool.filter((item) => item.category !== category);
    const card = selectCandidate(preferred.length ? preferred : alternatives, current[index]?.id, used, random);
    if (!card) return [];
    used.add(card.id);
    return [card];
  });
}

function refillRecommendations(saved: (Cartridge | null)[], pool: Cartridge[], random: () => number): Cartridge[] {
  const used = new Set(saved.flatMap((card) => (card ? [card.id] : [])));
  return categories.flatMap((category, index) => {
    const kept = saved[index];
    if (kept) return [kept];
    const preferred = pool.filter((item) => item.category === category);
    const alternatives = pool.filter((item) => item.category !== category);
    const card = selectCandidate(preferred.length ? preferred : alternatives, undefined, used, random);
    if (!card) return [];
    used.add(card.id);
    return [card];
  });
}

export function restoreRecommendations(raw: string | null, pool: Cartridge[], random = Math.random): Cartridge[] {
  try {
    const ids = JSON.parse(raw ?? "")?.ids;
    if (Array.isArray(ids) && ids.length === 3) {
      const saved = ids.map((id) => pool.find((item) => item.id === id) ?? null);
      const kept = saved.filter((item): item is Cartridge => Boolean(item));
      if (kept.length === 3) return kept;
      return refillRecommendations(saved, pool, random);
    }
  } catch { /* regenerate below */ }
  return pickRecommendations(pool, [], random);
}

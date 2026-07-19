import type { Cartridge } from "../data/cartridges";

export type PlaybackTarget =
  | { kind: "embed"; src: string }
  | { kind: "external"; url: string };

export function getPlaybackTarget(cartridge: Cartridge): PlaybackTarget {
  if (cartridge.source === "bilibili") {
    const bvid = cartridge.url.match(/BV[0-9A-Za-z]+/)?.[0];

    if (bvid) {
      return {
        kind: "embed",
        src: `https://player.bilibili.com/player.html?bvid=${bvid}&autoplay=1&danmaku=0&refer=1`,
      };
    }
  }

  if (cartridge.source === "youtube") {
    try {
      const url = new URL(cartridge.url);
      const videoId = url.searchParams.get("v");
      const startSeconds = Number.parseInt(url.searchParams.get("t")?.replace(/s$/, "") ?? "0", 10);

      if (videoId) {
        const start = Number.isFinite(startSeconds) && startSeconds > 0 ? `&start=${startSeconds}` : "";
        return {
          kind: "embed",
          src: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0${start}`,
        };
      }
    } catch {
      return { kind: "external", url: cartridge.url };
    }
  }

  return { kind: "external", url: cartridge.url };
}

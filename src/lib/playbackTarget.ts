import type { Cartridge } from "../data/cartridges";

export type PlaybackTarget =
  | { kind: "embed"; src: string }
  | { kind: "external"; url: string };

function parseStartSeconds(raw: string | null): number {
  if (!raw) return 0;
  if (/^\d+s?$/.test(raw)) return Number.parseInt(raw, 10);
  const match = raw.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
  if (!match) return 0;
  const [, hours, minutes, seconds] = match;
  return Number(hours ?? 0) * 3600 + Number(minutes ?? 0) * 60 + Number(seconds ?? 0);
}

export function getPlaybackTarget(cartridge: Cartridge): PlaybackTarget {
  if (cartridge.source === "bilibili") {
    const bvid = cartridge.url.match(/BV[0-9A-Za-z]+/)?.[0];

    if (bvid) {
      // isOutside=true is required for embedding on non-bilibili domains; without it
      // the player UI loads but refuses to play the stream (black screen at 00:00).
      return {
        kind: "embed",
        src: `https://player.bilibili.com/player.html?isOutside=true&bvid=${bvid}&p=1&autoplay=1&danmaku=0`,
      };
    }
  }

  if (cartridge.source === "youtube") {
    try {
      const url = new URL(cartridge.url);
      const videoId = url.hostname === "youtu.be"
        ? url.pathname.split("/").filter(Boolean)[0] ?? null
        : url.searchParams.get("v");
      const startSeconds = parseStartSeconds(url.searchParams.get("t"));

      if (videoId) {
        const start = startSeconds > 0 ? `&start=${startSeconds}` : "";
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

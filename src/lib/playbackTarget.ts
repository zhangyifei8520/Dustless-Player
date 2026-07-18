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

  return { kind: "external", url: cartridge.url };
}

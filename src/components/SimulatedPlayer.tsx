"use client";

import { useState } from "react";
import type { Cartridge } from "../data/cartridges";
import { getPlaybackTarget } from "../lib/playbackTarget";

type SimulatedPlayerProps = {
  cartridge: Cartridge;
  fullscreen?: boolean;
};

export function SimulatedPlayer({
  cartridge,
  fullscreen = false,
}: SimulatedPlayerProps) {
  const target = getPlaybackTarget(cartridge);

  return (
    <div className={`sim-player ${fullscreen ? "is-fullscreen" : ""}`}>
      {target.kind === "embed" ? (
        <iframe
          className="sim-player-embed"
          src={target.src}
          title={`${cartridge.title} - 视频播放器`}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <WebReader cartridge={cartridge} url={target.url} />
      )}
    </div>
  );
}

function WebReader({ cartridge, url }: { cartridge: Cartridge; url: string }) {
  const coverSrc = cartridge.thumbnail ?? "/assets/reader-cover-placeholder.svg";
  const [loadedCover, setLoadedCover] = useState<{ src: string; orientation: "portrait" | "landscape" } | null>(null);
  const coverOrientation = loadedCover?.src === coverSrc ? loadedCover.orientation : "portrait";

  return (
    <div className={`sim-reader-summary ${coverOrientation === "landscape" ? "is-landscape" : ""}`}>
      <div className="sim-reader-summary-copy">
        <span>SAVED SUMMARY</span>
        <h2>{cartridge.title}</h2>
        <p>{cartridge.summary}</p>
        <small>已保留收藏库中的原始摘要，可打开链接继续查看。</small>
        <a href={url} target="_blank" rel="noopener noreferrer">打开原链接 ↗</a>
      </div>
      <div className={`sim-reader-summary-cover ${coverOrientation === "landscape" ? "is-landscape" : ""}`}>
        <img
          src={coverSrc}
          alt=""
          referrerPolicy="no-referrer"
          onLoad={(event) => setLoadedCover({
            src: coverSrc,
            orientation: event.currentTarget.naturalWidth > event.currentTarget.naturalHeight ? "landscape" : "portrait",
          })}
        />
      </div>
    </div>
  );
}

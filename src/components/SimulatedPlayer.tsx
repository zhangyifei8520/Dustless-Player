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
          title={`${cartridge.title} - Bilibili 播放器`}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <div className="sim-external">
          <span>{cartridge.source === "xiaohongshu" ? "小红书" : "外部平台"}</span>
          <h2>{cartridge.title}</h2>
          <p>该平台限制站内播放，请在原页面观看。</p>
          <a href={target.url} target="_blank" rel="noopener noreferrer">
            打开原链接
          </a>
        </div>
      )}
    </div>
  );
}

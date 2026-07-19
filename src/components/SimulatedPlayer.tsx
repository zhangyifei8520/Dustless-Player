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
        <div className="sim-web-preview">
          <iframe
            className="sim-web-embed"
            src={target.url}
            title={`${cartridge.title} - 网页预览`}
          />
          <a className="sim-web-fallback" href={target.url} target="_blank" rel="noopener noreferrer">
            打开原链接 ↗
          </a>
        </div>
      )}
    </div>
  );
}

import type { Cartridge } from "../data/cartridges";

type SimulatedPlayerProps = {
  cartridge: Cartridge;
  fullscreen?: boolean;
};

export function SimulatedPlayer({
  cartridge,
  fullscreen = false,
}: SimulatedPlayerProps) {
  return (
    <div className={`sim-player ${fullscreen ? "is-fullscreen" : ""}`}>
      <div className="sim-scanlines" aria-hidden="true" />
      <div className="sim-topline">
        <span className="sim-live"><i /> PLAYING</span>
        <span>{cartridge.source === "bilibili" ? "BILIBILI" : "小红书"}</span>
      </div>
      <div className="sim-content">
        <div className={`sim-tape-mark tape-${cartridge.color}`}>
          {cartridge.code.slice(0, 2)}
        </div>
        <p className="sim-kicker">NOW WATCHING / 当前播放</p>
        <h2>{cartridge.title}</h2>
        <p className="sim-summary">{cartridge.summary}</p>
      </div>
      <div className="sim-controls">
        <span className="sim-pause" aria-hidden="true">Ⅱ</span>
        <div className="sim-timeline"><span /></div>
        <span>02:14 / 08:32</span>
      </div>
    </div>
  );
}

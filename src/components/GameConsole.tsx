"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { cartridges, type Cartridge } from "../data/cartridges";
import { initialPlayerState, playerReducer } from "../lib/playerMachine";
import { CartridgeCard } from "./CartridgeCard";
import { SimulatedPlayer } from "./SimulatedPlayer";

export function GameConsole() {
  const [state, dispatch] = useReducer(playerReducer, initialPlayerState);
  const [notice, setNotice] = useState<string | null>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const active = cartridges.find((card) => card.id === state.activeCartridgeId) ?? null;

  useEffect(() => {
    if (state.mode !== "loading") return;
    const startedAt = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(100, Math.round(((now - startedAt) / 1200) * 100));
      dispatch({ type: "SET_PROGRESS", progress });
      if (progress >= 100) {
        dispatch({ type: "FINISH_LOADING" });
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [state.mode, state.activeCartridgeId]);

  useEffect(() => {
    if (!state.fullscreen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") dispatch({ type: "CLOSE_FULLSCREEN" });
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [state.fullscreen]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 1800);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const play = (cartridge: Cartridge) => {
    dispatch({ type: "START_LOADING", cartridgeId: cartridge.id });
  };

  const showNavNotice = (label: string) => setNotice(`${label}页面准备中`);

  return (
    <>
      <header className="site-header">
        <nav aria-label="主导航">
          <button type="button" onClick={() => showNavNotice("首页")}>
            <span className="nav-icon nav-home" aria-hidden="true" />
            首页
          </button>
          <button type="button" onClick={() => showNavNotice("收藏库")}>
            <span className="nav-icon nav-library" aria-hidden="true" />
            收藏库
          </button>
          <button type="button" onClick={() => showNavNotice("关于")}>
            <span className="nav-icon nav-about" aria-hidden="true">?</span>
            关于
          </button>
        </nav>
      </header>

      <section className="console-section" id="console" aria-label="收藏卡带放映机">
        <div className="console-stage">
          {/* The source asset is already an exact-size local PNG; optimization would soften its pixel edges. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="console-art"
            src="/assets/computer2.png"
            width={987}
            height={969}
            alt="像素风游戏主机与卡带柜"
          />

          <div className={`screen-layer screen-${state.mode}`} aria-live="polite">
            {state.mode === "idle" && (
              <div className="idle-screen">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/screen-wallpaper.png"
                  width={1672}
                  height={941}
                  alt="像素山海桌面壁纸"
                />
                <div className="idle-prompt">
                  <span aria-hidden="true"><i /><i /><i /></span>
                  <small>点击或拖拽一张卡带开始播放</small>
                </div>
              </div>
            )}
            {state.mode === "off" && (
              <div className="off-screen"><span>·</span><span>·</span><i /></div>
            )}
            {state.mode === "loading" && (
              <div className="loading-screen">
                <p>READING CARTRIDGE...</p>
                <div className="loading-track"><span style={{ width: `${state.progress}%` }} /></div>
                <strong>{String(state.progress).padStart(3, "0")}%</strong>
                <small>{active?.code} / 请稍候</small>
              </div>
            )}
            {state.mode === "playing" && active && <SimulatedPlayer cartridge={active} />}
          </div>

          <button
            className={`console-control power-control ${state.mode === "off" ? "is-off" : ""}`}
            type="button"
            aria-label={state.mode === "off" ? "开启显示器" : "关闭显示器"}
            aria-pressed={state.mode !== "off"}
            onClick={() => dispatch({ type: "POWER_TOGGLE" })}
          >
            <span className="power-symbol" aria-hidden="true" />
            <small>POWER</small>
          </button>

          <div
            ref={slotRef}
            className={`slot-dropzone ${state.mode === "loading" ? "is-reading" : ""}`}
            onDragOver={(event) => {
              event.preventDefault();
              event.dataTransfer.dropEffect = "move";
            }}
            onDrop={(event) => {
              event.preventDefault();
              const id = event.dataTransfer.getData("text/cartridge-id");
              const cartridge = cartridges.find((item) => item.id === id);
              if (cartridge) play(cartridge);
            }}
          >
            <span>DROP HERE</span>
          </div>

          <button
            className="console-control fullscreen-control"
            type="button"
            aria-label="全屏播放"
            onClick={() => {
              if (state.mode === "playing") dispatch({ type: "OPEN_FULLSCREEN" });
              else setNotice("先播放一张卡带");
            }}
          >
            <span className="expand-symbol" aria-hidden="true"><i /><i /><i /><i /></span>
            <small>全屏</small>
          </button>

          <div className="card-rack" aria-label="每日推荐卡带">
            {cartridges.map((cartridge) => (
              <CartridgeCard
                key={cartridge.id}
                cartridge={cartridge}
                active={state.mode === "playing" && active?.id === cartridge.id}
                disabled={state.mode === "loading"}
                onPlay={play}
              />
            ))}
          </div>
        </div>
        <p className="drag-hint"><span>↑</span> 把卡带拖进插槽 · 或点击播放</p>
      </section>

      {notice && <div className="pixel-toast" role="status">{notice}<span>…</span></div>}

      {state.fullscreen && active && (
        <div className="fullscreen-overlay" role="dialog" aria-modal="true" aria-label={`${active.title} 全屏播放`}>
          <button
            className="fullscreen-close"
            type="button"
            aria-label="关闭全屏"
            onClick={() => dispatch({ type: "CLOSE_FULLSCREEN" })}
          >×</button>
          <div className="fullscreen-frame">
            <SimulatedPlayer cartridge={active} fullscreen />
          </div>
          <p>ESC TO RETURN / 按 Esc 返回</p>
        </div>
      )}
    </>
  );
}

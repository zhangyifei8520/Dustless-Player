"use client";

import { useEffect, useState } from "react";
import type { Cartridge } from "../data/cartridges";
import { getPlaybackTarget } from "../lib/playbackTarget";
import type { ReaderArticle } from "../lib/reader";

type SimulatedPlayerProps = {
  cartridge: Cartridge;
  fullscreen?: boolean;
};

type ReaderState =
  | { status: "loading" }
  | { status: "ready"; url: string; article: ReaderArticle }
  | { status: "error"; url: string };

const readerCacheKey = "dustless-reader-cache-v1";

function readCachedArticle(url: string): ReaderArticle | null {
  try {
    const cache = JSON.parse(window.localStorage.getItem(readerCacheKey) ?? "{}") as Record<string, ReaderArticle>;
    const article = cache[url];
    return article?.title && Array.isArray(article.blocks) ? article : null;
  } catch {
    return null;
  }
}

function cacheArticle(url: string, article: ReaderArticle) {
  try {
    const cache = JSON.parse(window.localStorage.getItem(readerCacheKey) ?? "{}") as Record<string, ReaderArticle>;
    window.localStorage.setItem(readerCacheKey, JSON.stringify({ ...cache, [url]: article }));
  } catch { /* reading remains available when local storage is full or unavailable */ }
}

export function SimulatedPlayer({
  cartridge,
  fullscreen = false,
}: SimulatedPlayerProps) {
  const target = getPlaybackTarget(cartridge);
  const externalUrl = target.kind === "external" ? target.url : null;
  const [readerState, setReaderState] = useState<ReaderState>({ status: "loading" });

  useEffect(() => {
    if (!externalUrl) return;
    const cached = readCachedArticle(externalUrl);
    if (cached) {
      const timer = window.setTimeout(() => setReaderState({ status: "ready", url: externalUrl, article: cached }), 0);
      return () => window.clearTimeout(timer);
    }

    const controller = new AbortController();
    fetch(`/api/reader?url=${encodeURIComponent(externalUrl)}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("reader request failed");
        return response.json() as Promise<ReaderArticle>;
      })
      .then((article) => {
        cacheArticle(externalUrl, article);
        setReaderState({ status: "ready", url: externalUrl, article });
      })
      .catch((error: unknown) => {
        if ((error as { name?: string }).name !== "AbortError") {
          setReaderState({ status: "error", url: externalUrl });
        }
      });
    return () => controller.abort();
  }, [externalUrl]);

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
        <WebReader cartridge={cartridge} url={target.url} state={readerState} />
      )}
    </div>
  );
}

function WebReader({ cartridge, url, state }: { cartridge: Cartridge; url: string; state: ReaderState }) {
  const coverSrc = cartridge.thumbnail ?? "/assets/reader-cover-placeholder.svg";
  const [loadedCover, setLoadedCover] = useState<{ src: string; orientation: "portrait" | "landscape" } | null>(null);
  const coverOrientation = loadedCover?.src === coverSrc ? loadedCover.orientation : "portrait";

  if (state.status === "loading" || state.url !== url) {
    return <div className="sim-reader-loading">READING WEB PAGE<span>...</span></div>;
  }

  if (state.status === "ready") {
    return (
      <article className="sim-reader">
        <header>
          <span>{cartridge.source === "xiaohongshu" ? "小红书" : "网页阅读"}</span>
          <a href={url} target="_blank" rel="noopener noreferrer">原链接 ↗</a>
        </header>
        <div className="sim-reader-content">
          <h2>{state.article.title}</h2>
          {state.article.blocks.map((block, index) => {
            if (block.type === "image") return <img key={`${block.src}-${index}`} src={block.src} alt={block.alt} />;
            if (block.type === "heading") return <h3 key={`${block.text}-${index}`}>{block.text}</h3>;
            return <p key={`${block.text}-${index}`}>{block.text}</p>;
          })}
        </div>
      </article>
    );
  }

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

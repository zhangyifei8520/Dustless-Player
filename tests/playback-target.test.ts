import assert from "node:assert/strict";
import test from "node:test";

import type { Cartridge } from "../src/data/cartridges";
import { getPlaybackTarget } from "../src/lib/playbackTarget";

const makeCartridge = (overrides: Partial<Cartridge>): Cartridge => ({
  id: "test-card",
  color: "blue",
  source: "bilibili",
  url: "https://www.bilibili.com/video/BV1wL9sYEE8t/",
  code: "TEST-01",
  title: "测试卡带",
  category: "测试",
  summary: "测试播放目标解析。",
  status: "ready",
  date: "07.18",
  ...overrides,
});

test("builds the official Bilibili player URL for both video cards", () => {
  assert.deepEqual(
    getPlaybackTarget(makeCartridge({ url: "https://www.bilibili.com/video/BV1wL9sYEE8t/" })),
    {
      kind: "embed",
      src: "https://player.bilibili.com/player.html?bvid=BV1wL9sYEE8t&autoplay=1&danmaku=0&refer=1",
    },
  );
  assert.deepEqual(
    getPlaybackTarget(makeCartridge({ url: "https://www.bilibili.com/video/BV1hKKV6MEHM/" })),
    {
      kind: "embed",
      src: "https://player.bilibili.com/player.html?bvid=BV1hKKV6MEHM&autoplay=1&danmaku=0&refer=1",
    },
  );
});

test("builds an embeddable YouTube player URL for a saved video", () => {
  assert.deepEqual(
    getPlaybackTarget(
      makeCartridge({
        source: "youtube" as Cartridge["source"],
        url: "https://www.youtube.com/watch?v=K5KVEU3aaeQ&t=56s",
      }),
    ),
    {
      kind: "embed",
      src: "https://www.youtube.com/embed/K5KVEU3aaeQ?autoplay=1&rel=0&start=56",
    },
  );
});

test("builds an embeddable YouTube player URL for youtu.be short links", () => {
  assert.deepEqual(
    getPlaybackTarget(
      makeCartridge({
        source: "youtube" as Cartridge["source"],
        url: "https://youtu.be/K5KVEU3aaeQ?t=30",
      }),
    ),
    {
      kind: "embed",
      src: "https://www.youtube.com/embed/K5KVEU3aaeQ?autoplay=1&rel=0&start=30",
    },
  );
});

test("parses hour/minute/second YouTube timestamps", () => {
  assert.deepEqual(
    getPlaybackTarget(
      makeCartridge({
        source: "youtube" as Cartridge["source"],
        url: "https://www.youtube.com/watch?v=K5KVEU3aaeQ&t=1h2m3s",
      }),
    ),
    {
      kind: "embed",
      src: "https://www.youtube.com/embed/K5KVEU3aaeQ?autoplay=1&rel=0&start=3723",
    },
  );
});

test("uses the original Xiaohongshu URL as an external target", () => {
  const url = "https://www.xiaohongshu.com/explore/6829a272000000002100a94e";

  assert.deepEqual(
    getPlaybackTarget(makeCartridge({ source: "xiaohongshu", url })),
    { kind: "external", url },
  );
});

test("uses a safe external target for malformed or unsupported embed sources", () => {
  const malformedUrl = "https://www.bilibili.com/video/not-a-bvid/";
  const malformedYoutubeUrl = "not a valid YouTube URL";
  const unsupportedUrl = "https://example.com/video/BV1wL9sYEE8t";

  assert.deepEqual(
    getPlaybackTarget(makeCartridge({ url: malformedUrl })),
    { kind: "external", url: malformedUrl },
  );
  assert.deepEqual(
    getPlaybackTarget(
      makeCartridge({
        source: "youtube",
        url: malformedYoutubeUrl,
      }),
    ),
    { kind: "external", url: malformedYoutubeUrl },
  );
  assert.deepEqual(
    getPlaybackTarget(
      makeCartridge({
        source: "xiaohongshu",
        url: unsupportedUrl,
      }),
    ),
    { kind: "external", url: unsupportedUrl },
  );
});

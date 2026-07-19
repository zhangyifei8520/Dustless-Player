import assert from "node:assert/strict";
import test from "node:test";

import {
  buildCartridgePool,
  FALLBACK_LIBRARY_CATALOG,
  parseLibraryCatalog,
  pickRecommendations,
  restoreRecommendations,
} from "../src/lib/recommendations";

test("maps the collection catalog to homepage colors and copy", () => {
  const pool = buildCartridgePool(FALLBACK_LIBRARY_CATALOG);

  assert.equal(pool.length, 21);
  assert.deepEqual(
    [...new Set(pool.filter((item) => item.category === "health").map((item) => item.color))],
    ["green"],
  );
  assert.deepEqual(
    [...new Set(pool.filter((item) => item.category === "learn").map((item) => item.color))],
    ["pink"],
  );
  assert.deepEqual(
    [...new Set(pool.filter((item) => item.category === "explore").map((item) => item.color))],
    ["yellow"],
  );

  const first = pool.find((item) => item.code === "HB-01");
  assert.deepEqual(first && {
    icon: first.icon,
    title: first.title,
    summary: first.summary,
    source: first.source,
  }, {
    icon: "60",
    title: "60分钟普拉提",
    summary: "GetFitWithMe · 跟练视频",
    source: "bilibili",
  });
});

test("falls back safely when saved library data is malformed or has no usable catalog", () => {
  assert.equal(parseLibraryCatalog("not-json"), FALLBACK_LIBRARY_CATALOG);
  assert.equal(parseLibraryCatalog(JSON.stringify({ catalog: { health: { items: [] } } })), FALLBACK_LIBRARY_CATALOG);
});

test("keeps a collection card thumbnail for the homepage player", () => {
  const catalog = parseLibraryCatalog(JSON.stringify({
    catalog: {
      health: { items: [{
        code: "HB-99",
        icon: "HB",
        title: "收藏库封面测试",
        desc: "应保留收藏库封面",
        src: "网页",
        url: "https://example.com/article",
        thumb: "https://images.example.com/cover.jpg",
      }] },
      learn: { items: [] },
      explore: { items: [] },
    },
  }));

  assert.equal(buildCartridgePool(catalog)[0]?.thumbnail, "https://images.example.com/cover.jpg");
});

test("ships collection detail covers in the homepage fallback catalog", () => {
  const pool = buildCartridgePool(FALLBACK_LIBRARY_CATALOG);

  assert.equal(
    pool.find((item) => item.code === "LC-05")?.thumbnail,
    "https://transformer-circuits.pub/2026/workspace/png/img_1b62b10ab235e6e7.png",
  );
});

test("restores valid saved recommendations and replaces deleted records", () => {
  const pool = buildCartridgePool(FALLBACK_LIBRARY_CATALOG);
  const saved = pickRecommendations(pool, [], () => 0.2);
  const restored = restoreRecommendations(JSON.stringify({ ids: saved.map((item) => item.id) }), pool, () => 0.8);

  assert.deepEqual(restored.map((item) => item.id), saved.map((item) => item.id));

  const withOneMissing = restoreRecommendations(
    JSON.stringify({ ids: [saved[0].id, "removed", saved[2].id] }),
    pool,
    () => 0.8,
  );
  assert.equal(withOneMissing.length, 3);
  assert.notEqual(withOneMissing[1].id, "removed");
});

test("rerolls each category without reusing the current cards when alternatives exist", () => {
  const pool = buildCartridgePool(FALLBACK_LIBRARY_CATALOG);
  const current = pickRecommendations(pool, [], () => 0);
  const rerolled = pickRecommendations(pool, current, () => 0);

  assert.equal(rerolled.length, 3);
  assert.ok(rerolled.every((item, index) => item.id !== current[index].id));
  assert.deepEqual(rerolled.map((item) => item.category), ["health", "learn", "explore"]);
});

test("fills an empty preferred category from another category and keeps that actual color", () => {
  const pool = buildCartridgePool({
    health: { items: [] },
    learn: { items: FALLBACK_LIBRARY_CATALOG.learn.items.slice(0, 2) },
    explore: { items: FALLBACK_LIBRARY_CATALOG.explore.items.slice(0, 2) },
  });
  const picks = pickRecommendations(pool, [], () => 0);

  assert.equal(picks.length, 3);
  assert.ok(picks.every((item) => item.category !== "health"));
  assert.ok(picks.every((item) => item.color === (item.category === "learn" ? "pink" : "yellow")));
});

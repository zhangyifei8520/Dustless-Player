import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { SimulatedPlayer } from "../src/components/SimulatedPlayer";
import { buildCartridgePool, FALLBACK_LIBRARY_CATALOG } from "../src/lib/recommendations";

test("Bilibili player iframe grants the exact required media permissions", () => {
  const cartridges = buildCartridgePool(FALLBACK_LIBRARY_CATALOG);
  const cartridge = cartridges.find((item) => item.source === "bilibili");
  assert.ok(cartridge);

  const html = renderToStaticMarkup(
    createElement(SimulatedPlayer, { cartridge }),
  );

  assert.match(html, /<iframe\b/);
  assert.match(
    html,
    /allow="autoplay; encrypted-media; picture-in-picture; fullscreen"/,
  );
});

test("ordinary saved webpages enter the in-app reader instead of an iframe", () => {
  const cartridges = buildCartridgePool(FALLBACK_LIBRARY_CATALOG);
  const cartridge = cartridges.find((item) => item.source === "external");
  assert.ok(cartridge);

  const html = renderToStaticMarkup(
    createElement(SimulatedPlayer, { cartridge }),
  );

  assert.match(html, /sim-reader-loading/);
  assert.match(html, /READING WEB PAGE/);
  assert.doesNotMatch(html, /网页预览/);
});

test("the reader fallback clearly keeps the saved card summary", async () => {
  const source = await readFile(new URL("../src/components/SimulatedPlayer.tsx", import.meta.url), "utf8");

  assert.match(source, /SAVED SUMMARY/);
  assert.match(source, /\{cartridge\.summary\}/);
  assert.match(source, /已保留收藏库中的原始摘要/);
});

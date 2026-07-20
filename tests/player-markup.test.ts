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

test("ordinary saved webpages immediately render the saved summary card instead of an iframe", () => {
  const cartridges = buildCartridgePool(FALLBACK_LIBRARY_CATALOG);
  const cartridge = cartridges.find((item) => item.source === "external");
  assert.ok(cartridge);

  const html = renderToStaticMarkup(
    createElement(SimulatedPlayer, { cartridge }),
  );

  assert.match(html, /sim-reader-summary/);
  assert.match(html, /SAVED SUMMARY/);
  assert.match(html, new RegExp(cartridge.title));
  assert.match(html, new RegExp(cartridge.summary));
  assert.doesNotMatch(html, /sim-reader-loading/);
  assert.doesNotMatch(html, /网页预览/);
});

test("ordinary saved webpages do not request or render fetched page content", async () => {
  const source = await readFile(new URL("../src/components/SimulatedPlayer.tsx", import.meta.url), "utf8");

  assert.doesNotMatch(source, /api\/reader/);
  assert.doesNotMatch(source, /sim-reader-content/);
});

test("the reader fallback clearly keeps the saved card summary", async () => {
  const source = await readFile(new URL("../src/components/SimulatedPlayer.tsx", import.meta.url), "utf8");

  assert.match(source, /SAVED SUMMARY/);
  assert.match(source, /\{cartridge\.summary\}/);
  assert.match(source, /已保留收藏库中的原始摘要/);
});

test("the reader fallback includes a cover slot and saved summary copy", async () => {
  const source = await readFile(new URL("../src/components/SimulatedPlayer.tsx", import.meta.url), "utf8");

  assert.match(source, /sim-reader-summary-cover/);
  assert.match(source, /sim-reader-summary-copy/);
  assert.match(source, /cartridge\.thumbnail/);
});

test("the summary cover reuses the saved library thumbnail without a referrer", async () => {
  const source = await readFile(new URL("../src/components/SimulatedPlayer.tsx", import.meta.url), "utf8");

  assert.match(source, /cartridge\.thumbnail \?\? "\/assets\/reader-cover-placeholder\.svg"/);
  assert.match(source, /referrerPolicy="no-referrer"/);
  assert.doesNotMatch(source, /原网页暂时无法读取/);
});

test("the summary card detects horizontal covers for its alternate layout", async () => {
  const source = await readFile(new URL("../src/components/SimulatedPlayer.tsx", import.meta.url), "utf8");
  const styles = await readFile(new URL("../src/styles/pixel.css", import.meta.url), "utf8");

  assert.match(source, /coverOrientation/);
  assert.match(source, /naturalWidth > .*naturalHeight/);
  assert.match(source, /is-landscape/);
  assert.match(styles, /sim-reader-summary-cover\.is-landscape/);
  assert.match(styles, /rotate\(10deg\)/);
});

test("the left drag instruction stays within its yellow underline", async () => {
  const styles = await readFile(new URL("../src/styles/pixel.css", import.meta.url), "utf8");

  assert.match(styles, /\.left-decor small \{[^}]*width: 250px/);
});

test("homepage card and summary copy use the collection typography", async () => {
  const styles = await readFile(new URL("../src/styles/pixel.css", import.meta.url), "utf8");

  assert.match(styles, /\.cartridge-label h3 \{[^}]*font-family: "Noto Sans SC", sans-serif;[^}]*font-weight: 900/);
  assert.match(styles, /\.cartridge-label p \{[^}]*font-family: "Noto Sans SC", sans-serif;[^}]*font-weight: 400/);
  assert.match(styles, /\.sim-reader-summary h2 \{[^}]*font-family: "Noto Sans SC", sans-serif;[^}]*font-weight: 900/);
  assert.match(styles, /\.sim-reader-summary p \{[^}]*font-family: "Noto Sans SC", sans-serif;[^}]*font-weight: 400/);
});

test("homepage repeats the collection footer labels", async () => {
  const source = await readFile(new URL("../src/components/GamePrototype.tsx", import.meta.url), "utf8");

  assert.match(source, /不吃灰播放器/);
  assert.match(source, /Dustless Player/);
  assert.match(source, /© 2026 Version 1\.0/);
  assert.match(source, /site-footer/);
});

test("homepage footer uses its calibrated smaller visual scale", async () => {
  const styles = await readFile(new URL("../src/styles/pixel.css", import.meta.url), "utf8");

  assert.match(styles, /\.site-footer \{[^}]*font-size: 7px/);
  assert.match(styles, /\.site-footer strong \{[^}]*font-size: 10px/);
});

test("side decorations use the console safety zone on desktop", async () => {
  const styles = await readFile(new URL("../src/styles/pixel.css", import.meta.url), "utf8");

  assert.match(styles, /--console-stage-width:/);
  assert.match(styles, /\.left-decor \{[^}]*left: clamp\(28px, calc\(50% - 650px\)/);
  assert.match(styles, /\.right-decor \{[^}]*right: clamp\(28px, calc\(50% - 650px\)/);
  assert.match(styles, /--side-decor-scale: clamp\(/);
  assert.match(styles, /\.left-decor,\s*\.right-decor \{[^}]*transform: scale\(var\(--side-decor-scale\)\)/s);
  assert.match(styles, /@media \(max-width: 1120px\)[\s\S]*\.left-decor,\s*\.right-decor \{ display: none; \}/);
});

test("portrait layout keeps three cartridges inside the rack and protects the console controls", async () => {
  const styles = await readFile(new URL("../src/styles/pixel.css", import.meta.url), "utf8");
  const portraitStyles = styles.slice(styles.indexOf("@media (max-width: 520px)"));

  assert.match(portraitStyles, /\.console-stage \{[^}]*padding-bottom: 0/);
  assert.match(styles, /@media \(max-width: 760px\)[\s\S]*--console-stage-width: min\(854px, calc\(100vw - 24px\)\)/);
  assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\.console-stage \{[^}]*width: var\(--console-stage-width\)/);
  assert.match(portraitStyles, /\.card-rack \{[^}]*bottom: 0/);
  assert.match(portraitStyles, /\.card-rack \{[^}]*grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
  assert.doesNotMatch(portraitStyles, /\.card-rack \{[^}]*flex-direction: column/);
  assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\.console-control \{[^}]*width: 36px; height: 36px/);
  assert.match(portraitStyles, /\.power-control,\s*\.fullscreen-control \{[^}]*top: calc\(57\.5vw - 13\.8px\)/s);
  assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\.site-header \{ top: 10px/);
});

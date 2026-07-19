import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const cssPath = new URL("../src/styles/pixel.css", import.meta.url);
const consolePath = new URL("../src/components/GameConsole.tsx", import.meta.url);
const cartridgePath = new URL("../src/components/CartridgeCard.tsx", import.meta.url);
const cartridgesPath = new URL("../src/data/cartridges.ts", import.meta.url);

function selectorRule(css, selector) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = css.match(new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`, "s"));
  assert.ok(match, `missing ${selector} rule`);
  return match[1];
}

function lastSelectorRule(css, selector) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const matches = [...css.matchAll(new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`, "gs"))];
  const match = matches.at(-1);
  assert.ok(match, `missing ${selector} rule`);
  return match[1];
}

test("pixel controls use the calibrated font, focus, and slot contract", async () => {
  const [css, consoleSource] = await Promise.all([
    readFile(cssPath, "utf8"),
    readFile(consolePath, "utf8"),
  ]);

  assert.match(css, /@font-face\s*\{[^}]*font-family:\s*["']PoxiaoPixel["'][^}]*src:\s*url\(["']\/fonts\/PoxiaoPixel\.ttf["']\)\s*format\(["']truetype["']\)/s);

  const navButton = selectorRule(css, ".site-header nav button");
  assert.match(navButton, /font-family:\s*["']PoxiaoPixel["']/);
  assert.match(navButton, /color:\s*#000;/);
  assert.match(navButton, /text-shadow:\s*none;/);

  const controlInteraction = selectorRule(css, ".console-control:hover,\n.console-control:focus-visible");
  assert.doesNotMatch(controlInteraction, /dashed/);

  const powerControl = selectorRule(css, ".power-control");
  const fullscreenControl = selectorRule(css, ".fullscreen-control");
  assert.equal(powerControl.match(/top:\s*([^;]+);/)?.[1], fullscreenControl.match(/top:\s*([^;]+);/)?.[1]);

  assert.match(consoleSource, /className="slot-hint"/);
  assert.doesNotMatch(consoleSource, /className="drag-hint"/);
});

test("navigation artwork and fullscreen label use the calibrated color geometry", async () => {
  const css = await readFile(cssPath, "utf8");

  assert.match(selectorRule(css, ".nav-home::before"), /width:\s*15px;[\s\S]*height:\s*8px;/);
  assert.match(selectorRule(css, ".nav-home::after"), /width:\s*10px;[\s\S]*height:\s*8px;/);
  assert.match(selectorRule(css, ".nav-library::before"), /width:\s*3px;[\s\S]*height:\s*13px;[\s\S]*box-shadow:\s*6px 0 0 currentcolor, 12px 0 0 currentcolor;/);
  assert.match(lastSelectorRule(css, ".nav-library::after"), /height:\s*3px;/);
  assert.match(selectorRule(css, ".nav-about"), /font-size:\s*15px;/);
  assert.match(selectorRule(css, ".fullscreen-control small"), /color:\s*#000;/);
});

test("cartridge cards only show source, title, and summary", async () => {
  const [cardSource, cartridgeData] = await Promise.all([
    readFile(cartridgePath, "utf8"),
    readFile(cartridgesPath, "utf8"),
  ]);

  assert.match(cardSource, /className="cartridge-source"/);
  assert.match(cardSource, /<h3>\{cartridge\.title\}<\/h3>/);
  assert.match(cardSource, /<p>\{cartridge\.summary\}<\/p>/);
  assert.doesNotMatch(cardSource, /cartridge-source small/);
  assert.doesNotMatch(cardSource, /cartridge\.category/);
  assert.doesNotMatch(cardSource, /cartridge-foot/);
  assert.doesNotMatch(cardSource, /status-/);
  assert.doesNotMatch(cardSource, /cartridge\.status/);
  assert.doesNotMatch(cardSource, /cartridge\.date/);
  assert.doesNotMatch(cartridgeData, /category:/);
  assert.doesNotMatch(cartridgeData, /status:/);
  assert.doesNotMatch(cartridgeData, /date:/);
});

test("console exposes the approved identity, decor copy, random placeholder, and slot hint", async () => {
  const consoleSource = await readFile(consolePath, "utf8");

  for (const copy of [
    "不吃灰 · 播放器",
    "Ready to play?",
    "Favorites",
    "Game Player",
    "COLLECT GAMES",
    "UNLOCK MEMORIES",
    "PLAY FOREVER",
    "随机推荐",
    "随机推荐功能准备中",
    "把卡带拖进插槽",
  ]) assert.match(consoleSource, new RegExp(copy.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

  assert.match(consoleSource, /Drag your favorite game cartridge into the slot and let(?:'|&apos;)s play!/);
  assert.match(consoleSource, /LET(?:'|&apos;)S<br \/>PLAY!/);

  assert.doesNotMatch(consoleSource, /把卡带拖进插槽 · 或点击播放/);
  assert.match(consoleSource, /className="brand-lockup"/);
  assert.match(consoleSource, /className="left-decor"/);
  assert.match(consoleSource, /className="right-decor"/);
  assert.match(consoleSource, /className="random-recommendation"/);
});

test("flat cartridge rack uses compact controls and black navigation", async () => {
  const css = await readFile(cssPath, "utf8");

  const cardRack = selectorRule(css, ".card-rack");
  assert.match(cardRack, /left:\s*8%;/);
  assert.match(cardRack, /right:\s*8%;/);
  assert.match(cardRack, /height:\s*29%;/);
  assert.match(cardRack, /bottom:\s*0;/);
  assert.match(cardRack, /gap:\s*6\.86%;/);

  const cartridge = selectorRule(css, ".cartridge");
  assert.doesNotMatch(cartridge, /box-shadow:/);

  const cartridgeShadow = selectorRule(css, ".cartridge::after");
  assert.match(cartridgeShadow, /z-index:\s*-2;/);
  assert.match(cartridgeShadow, /width:\s*100%;/);
  assert.match(cartridgeShadow, /height:\s*100%;/);
  assert.match(cartridgeShadow, /border-radius:\s*inherit;/);
  assert.match(cartridgeShadow, /background:\s*#000;/);

  const cartridgePlay = selectorRule(css, ".cartridge-play");
  assert.match(cartridgePlay, /left:\s*8%;/);
  assert.match(cartridgePlay, /right:\s*8%;/);
  assert.match(cartridgePlay, /bottom:\s*-9px;/);
  assert.match(cartridgePlay, /height:\s*clamp\(30px,\s*3\.8vw,\s*38px\);/);

  const navIcon = selectorRule(css, ".nav-icon");
  assert.match(navIcon, /color:\s*#000;/);
  assert.match(navIcon, /filter:\s*none;/);
});

test("console decor uses approved card, control, random-button, and accent geometry", async () => {
  const css = await readFile(cssPath, "utf8");
  const rack = selectorRule(css, ".card-rack");
  assert.match(rack, /left:\s*8%;/);
  assert.match(rack, /right:\s*8%;/);
  assert.match(rack, /gap:\s*6\.86%;/);
  assert.match(selectorRule(css, ".power-control"), /top:\s*56\.5%;/);
  assert.match(selectorRule(css, ".fullscreen-control"), /top:\s*56\.5%;/);
  assert.match(selectorRule(css, ".random-recommendation"), /top:\s*66%;/);
  assert.match(selectorRule(css, ".random-recommendation"), /right:\s*-3%;/);
  assert.match(selectorRule(css, ".random-recommendation"), /min-width:\s*96px;/);
  assert.match(selectorRule(css, ".random-recommendation"), /min-height:\s*31px;/);
  assert.match(selectorRule(css, ".random-recommendation"), /background:[^;]*#475bf4/);
  for (const selector of [".brand-lockup", ".left-decor", ".right-decor"]) {
    assert.match(selectorRule(css, selector), /position:\s*absolute;/);
  }
  assert.match(selectorRule(css, ".slot-hint"), /text-align:\s*center;/);
  assert.match(selectorRule(css, ".cartridge-blue"), /--shell:\s*var\(--yellow\);/);
});

test("side decorations use the enlarged desktop type scale", async () => {
  const css = await readFile(cssPath, "utf8");

  assert.match(selectorRule(css, ".left-decor"), /width:\s*200px;/);
  assert.match(selectorRule(css, ".left-decor h1"), /font-size:\s*29px;/);
  assert.match(selectorRule(css, ".left-decor small"), /font-size:\s*9px;/);
  assert.match(selectorRule(css, ".right-decor"), /width:\s*198px;/);
  assert.match(selectorRule(css, ".lets-play"), /font-size:\s*20px;/);
  assert.match(selectorRule(css, ".decor-info-card p"), /font-size:\s*9px;/);
});

test("cartridge shadow layers behind the unchanged card geometry and short label", async () => {
  const [css, cartridgeData] = await Promise.all([
    readFile(cssPath, "utf8"),
    readFile(cartridgesPath, "utf8"),
  ]);

  const cartridge = selectorRule(css, ".cartridge");
  assert.match(cartridge, /isolation:\s*isolate;/);
  assert.doesNotMatch(cartridge, /background:\s*var\(--shell\)/);

  const cardSurface = selectorRule(css, ".cartridge::before");
  assert.match(cardSurface, /inset:\s*0;/);
  assert.match(cardSurface, /z-index:\s*-1;/);
  assert.match(cardSurface, /background:\s*var\(--shell\)/);

  const shadow = selectorRule(css, ".cartridge::after");
  assert.match(shadow, /top:\s*8px;/);
  assert.match(shadow, /right:\s*-8px;/);
  assert.match(shadow, /width:\s*100%;/);
  assert.match(shadow, /height:\s*100%;/);
  assert.match(shadow, /z-index:\s*-2;/);

  const label = selectorRule(css, ".cartridge-label");
  assert.match(label, /box-sizing:\s*border-box;/);
  assert.match(label, /flex:\s*0 0 55%;/);
  assert.match(selectorRule(css, ".cartridge-label p"), /-webkit-line-clamp:\s*1;/);
  assert.doesNotMatch(cartridgeData, /。[^\n]*。/);
});

test("fullscreen video uses the calibrated viewport geometry", async () => {
  const css = await readFile(cssPath, "utf8");

  const fullscreenFrame = selectorRule(css, ".fullscreen-frame");
  assert.match(fullscreenFrame, /width:[^;]*92vw/);
  assert.match(fullscreenFrame, /width:[^;]*100dvh/);
});

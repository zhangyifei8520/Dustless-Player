import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const cssPath = new URL("../src/styles/pixel.css", import.meta.url);
const consolePath = new URL("../src/components/GameConsole.tsx", import.meta.url);
const cartridgePath = new URL("../src/components/CartridgeCard.tsx", import.meta.url);
const recommendationsPath = new URL("../src/lib/recommendations.ts", import.meta.url);
const smilePath = new URL("../public/assets/pixel-smile.svg", import.meta.url);
const offSmilePath = new URL("../public/assets/pixel-off-smile.svg", import.meta.url);

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

  const navButton = /\.site-header nav button,\s*\.site-header nav a\s*\{([^}]*)\}/s.exec(css)?.[1] ?? "";
  assert.match(navButton, /font-family:\s*["']PoxiaoPixel["']/);
  assert.match(navButton, /color:\s*#000;/);
  assert.match(navButton, /text-shadow:\s*none;/);

  const controlInteraction = selectorRule(css, ".console-control:hover,\n.console-control:focus-visible");
  assert.doesNotMatch(controlInteraction, /dashed/);

  const powerControl = selectorRule(css, ".power-control");
  const fullscreenControl = selectorRule(css, ".fullscreen-control");
  assert.equal(powerControl.match(/top:\s*([^;]+);/)?.[1], fullscreenControl.match(/top:\s*([^;]+);/)?.[1]);

  assert.match(consoleSource, /className="slot-hint"/);
  assert.doesNotMatch(consoleSource, /className="slot-hint"[^>]*><span>↑<\/span>/);
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
  const [cardSource, recommendationData] = await Promise.all([
    readFile(cartridgePath, "utf8"),
    readFile(recommendationsPath, "utf8"),
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
  assert.match(recommendationData, /category,/);
  assert.doesNotMatch(cardSource, /status:/);
  assert.doesNotMatch(cardSource, /date:/);
});

test("homepage cartridge titles use the collection Chinese font one size smaller", async () => {
  const css = await readFile(cssPath, "utf8");
  const title = selectorRule(css, ".cartridge-label h3");

  assert.match(title, /font-family:\s*["']Noto Sans SC["']/);
  assert.match(title, /font-size:\s*clamp\(8px,\s*0\.9vw,\s*12px\);/);
});

test("console exposes the approved identity, decor copy, random placeholder, and slot hint", async () => {
  const consoleSource = await readFile(consolePath, "utf8");

  for (const copy of [
    "不吃灰播放器",
    "DUSTLESS PLAYER",
    "Ready to play?",
    "COLLECT GAMES",
    "UNLOCK MEMORIES",
    "PLAY FOREVER",
    "把卡带拖进插槽",
  ]) assert.match(consoleSource, new RegExp(copy.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

  assert.match(consoleSource, /Drag your favorite game cartridge into the slot and let(?:'|&apos;)s play!/);
  assert.match(consoleSource, /LET(?:'|&apos;)S<br \/>PLAY!/);

  assert.doesNotMatch(consoleSource, /把卡带拖进插槽 · 或点击播放/);
  assert.doesNotMatch(consoleSource, /className="brand-lockup"/);
  assert.match(consoleSource, /className="boot-title"/);
  assert.match(consoleSource, /aria-label="随机"/);
  assert.match(consoleSource, />\s*随机\s*<\/button>/);
  assert.doesNotMatch(consoleSource, />\s*随机推荐\s*<\/button>/);
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
  assert.match(selectorRule(css, ".random-recommendation"), /top:\s*64%;/);
  assert.match(selectorRule(css, ".random-recommendation"), /right:\s*1%;/);
  assert.match(selectorRule(css, ".random-recommendation"), /min-width:\s*66px;/);
  assert.match(selectorRule(css, ".random-recommendation"), /min-height:\s*31px;/);
  assert.match(selectorRule(css, ".random-recommendation"), /background:[^;]*#475bf4/);
  for (const selector of [".left-decor", ".right-decor"]) {
    assert.match(selectorRule(css, selector), /position:\s*absolute;/);
  }
  assert.match(selectorRule(css, ".slot-hint"), /text-align:\s*center;/);
  assert.match(selectorRule(css, ".cartridge-green"), /--shell:\s*#3ecf8e;/);
  assert.match(selectorRule(css, ".cartridge-pink"), /--shell:\s*#ff6fa5;/);
  assert.match(selectorRule(css, ".cartridge-yellow"), /--shell:\s*#ffc93c;/);
});

test("side decorations use the reduced desktop type scale and Mono wordmark", async () => {
  const css = await readFile(cssPath, "utf8");

  assert.match(css, /font-family:\s*["']ChillPixelsMono["'][^}]*src:\s*url\(["']\/fonts\/ChillPixels-Mono\.otf["']\)/s);
  assert.match(selectorRule(css, ".left-decor"), /width:\s*300px;/);
  assert.match(selectorRule(css, ".left-decor p"), /font-size:\s*14\.4px;/);
  assert.match(selectorRule(css, ".left-decor h1"), /font-size:\s*22\.2px;/);
  assert.match(selectorRule(css, ".left-decor h1"), /letter-spacing:\s*\.1em;/);
  assert.match(selectorRule(css, ".left-decor h1 span"), /font-family:\s*["']ChillPixelsMono["']/);
  assert.match(selectorRule(css, ".left-decor h1 span"), /font-size:\s*25px;/);
  assert.match(selectorRule(css, ".left-decor h1 span"), /letter-spacing:\s*\.02em;/);
  assert.match(selectorRule(css, ".left-decor small"), /font-size:\s*12\.96px;/);
  assert.match(selectorRule(css, ".right-decor"), /width:\s*250px;/);
  assert.match(selectorRule(css, ".lets-play"), /font-size:\s*21\.6px;/);
  assert.match(selectorRule(css, ".decor-info-card p"), /font-size:\s*14\.26px;/);
});

test("idle screen uses the supplied rainbow boot-title treatment", async () => {
  const css = await readFile(cssPath, "utf8");

  assert.match(css, /font-family:\s*["']ChillPixelsMinimalism["'][^}]*src:\s*url\(["']\/fonts\/ChillPixels-Minimalism\.otf["']\)/s);
  assert.match(selectorRule(css, ".boot-title"), /font-family:\s*["']ChillPixelsMinimalism["']/);
  assert.match(selectorRule(css, ".boot-title span:nth-child(odd)"), /translateY\(-6px\)/);
  assert.match(selectorRule(css, ".boot-title span:nth-child(even)"), /translateY\(6px\)/);
  assert.match(selectorRule(css, ".idle-screen small"), /background:\s*transparent;/);
  assert.match(selectorRule(css, ".idle-screen small"), /font-size:\s*clamp\(6\.4px,\s*\.8vw,\s*9\.6px\);/);
});

test("the powered-off screen uses the supplied white pixel smile", async () => {
  const [consoleSource, offSmileSvg] = await Promise.all([
    readFile(consolePath, "utf8"),
    readFile(offSmilePath, "utf8"),
  ]);

  assert.match(consoleSource, /className="off-screen"[\s\S]*src="\/assets\/pixel-off-smile\.svg"/);
  assert.match(offSmileSvg, /<svg[^>]*viewBox="0 0 42 42"/);
  assert.match(offSmileSvg, /fill="white"/);
});

test("side decorations use the supplied vector pixel smile", async () => {
  const [css, consoleSource, smileSvg] = await Promise.all([
    readFile(cssPath, "utf8"),
    readFile(consolePath, "utf8"),
    readFile(smilePath, "utf8"),
  ]);

  assert.equal((consoleSource.match(/src="\/assets\/pixel-smile\.svg"/g) ?? []).length, 2);
  assert.match(smileSvg, /<svg[^>]*viewBox="0 0 68 64"/);
  assert.match(smileSvg, /#FFE665/);
  assert.doesNotMatch(smileSvg, /#F5C956|#F9ED32/);
  assert.match(selectorRule(css, ".decor-smile"), /width:\s*32px;/);
  assert.match(selectorRule(css, ".decor-smile"), /height:\s*auto;/);
  assert.match(selectorRule(css, ".right-smile"), /width:\s*42px;/);
  assert.match(selectorRule(css, ".right-smile"), /z-index:\s*2;/);
  assert.match(selectorRule(css, ".right-smile"), /left:\s*152px;/);
  assert.match(selectorRule(css, ".right-smile"), /transform:\s*rotate\(25deg\);/);
  assert.match(selectorRule(css, ".lets-play"), /width:\s*109px;/);
  assert.match(selectorRule(css, ".lets-play"), /font-family:\s*"ChillPixelsMono";/);
  assert.match(selectorRule(css, ".decor-info-card"), /box-sizing:\s*border-box;/);
  assert.match(selectorRule(css, ".decor-info-card"), /width:\s*213px;/);
  assert.match(selectorRule(css, ".decor-info-card"), /min-height:\s*158px;/);
  assert.match(selectorRule(css, ".decor-info-card"), /font-family:\s*"ChillPixelsMono";/);
  assert.match(selectorRule(css, ".decor-info-card p"), /font-size:\s*14\.26px;/);
  assert.match(consoleSource, /className="decor-lightning"[^>]*src="\/assets\/pixel-lightning\.svg"/);
  assert.doesNotMatch(consoleSource, />ϟ</);
  assert.match(selectorRule(css, ".decor-lightning"), /width:\s*34px;/);
  assert.match(selectorRule(css, ".decor-lightning"), /height:\s*auto;/);
  assert.doesNotMatch(css, /\.decor-smile::before/);
});

test("the page uses native pointer and drag cursors", async () => {
  const css = await readFile(cssPath, "utf8");

  assert.doesNotMatch(css, /pixel-cursor-(?:default|action)\.svg/);
  assert.doesNotMatch(css, /--cursor-(?:default|action):/);
  assert.match(/\.site-header nav button,\s*\.site-header nav a\s*\{([^}]*)\}/s.exec(css)?.[1] ?? "", /cursor:\s*pointer;/);
  assert.match(selectorRule(css, ".cartridge"), /cursor:\s*grab;/);
});

test("cartridge shadow layers behind the unchanged card geometry and short label", async () => {
  const css = await readFile(cssPath, "utf8");

  const cartridge = selectorRule(css, ".cartridge");
  assert.match(cartridge, /isolation:\s*isolate;/);
  assert.doesNotMatch(cartridge, /background:\s*var\(--shell\)/);

  const cardSurface = selectorRule(css, ".cartridge::before");
  assert.match(cardSurface, /inset:\s*0;/);
  assert.match(cardSurface, /z-index:\s*-1;/);
  assert.match(cardSurface, /background:\s*var\(--shell\)/);

  const shadow = selectorRule(css, ".cartridge::after");
  assert.match(shadow, /top:\s*4px;/);
  assert.match(shadow, /right:\s*-4px;/);
  assert.match(shadow, /width:\s*100%;/);
  assert.match(shadow, /height:\s*100%;/);
  assert.match(shadow, /z-index:\s*-2;/);

  const label = selectorRule(css, ".cartridge-label");
  assert.match(label, /box-sizing:\s*border-box;/);
  assert.match(label, /flex:\s*0 0 55%;/);
  assert.match(selectorRule(css, ".cartridge-label p"), /-webkit-line-clamp:\s*1;/);
  assert.match(label, /background:\s*#f7f2e7;/);
});

test("fullscreen video uses the calibrated viewport geometry", async () => {
  const css = await readFile(cssPath, "utf8");

  const fullscreenFrame = selectorRule(css, ".fullscreen-frame");
  assert.match(fullscreenFrame, /width:[^;]*92vw/);
  assert.match(fullscreenFrame, /width:[^;]*100dvh/);
});

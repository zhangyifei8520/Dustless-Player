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
  assert.match(navButton, /text-shadow:[^;]*#000/);

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

test("cartridge groups and fullscreen video use the calibrated viewport geometry", async () => {
  const css = await readFile(cssPath, "utf8");

  const cardRack = selectorRule(css, ".card-rack");
  assert.match(cardRack, /left:\s*14%;/);
  assert.match(cardRack, /right:\s*14%;/);
  assert.match(cardRack, /height:\s*21%;/);

  const cartridgePlay = selectorRule(css, ".cartridge-play");
  assert.match(cartridgePlay, /left:\s*3%;/);
  assert.match(cartridgePlay, /right:\s*3%;/);
  assert.match(cartridgePlay, /height:\s*clamp\(36px,\s*5\.5vw,\s*52px\);/);

  const fullscreenFrame = selectorRule(css, ".fullscreen-frame");
  assert.match(fullscreenFrame, /width:[^;]*92vw/);
  assert.match(fullscreenFrame, /width:[^;]*100dvh/);
});

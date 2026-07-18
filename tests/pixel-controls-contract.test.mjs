import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const cssPath = new URL("../src/styles/pixel.css", import.meta.url);
const consolePath = new URL("../src/components/GameConsole.tsx", import.meta.url);

function selectorRule(css, selector) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = css.match(new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`, "s"));
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

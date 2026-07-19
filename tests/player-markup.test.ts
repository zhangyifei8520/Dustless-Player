import assert from "node:assert/strict";
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

test("ordinary saved webpages render inside the screen with an original-link fallback", () => {
  const cartridges = buildCartridgePool(FALLBACK_LIBRARY_CATALOG);
  const cartridge = cartridges.find((item) => item.source === "external");
  assert.ok(cartridge);

  const html = renderToStaticMarkup(
    createElement(SimulatedPlayer, { cartridge }),
  );

  assert.match(html, new RegExp(`src="${cartridge.url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`));
  assert.match(html, /title="[^"]+ - 网页预览"/);
  assert.match(html, /打开原链接/);
});

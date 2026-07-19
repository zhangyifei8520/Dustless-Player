import assert from "node:assert/strict";
import test from "node:test";

import { buildCartridgePool, FALLBACK_LIBRARY_CATALOG } from "../src/lib/recommendations";

test("ships a complete fallback collection with real source URLs", () => {
  const cartridges = buildCartridgePool(FALLBACK_LIBRARY_CATALOG);
  assert.equal(cartridges.length, 21);
  assert.equal(new Set(cartridges.map((card) => card.id)).size, 21);
  assert.ok(cartridges.every((card) => card.summary.length > 0));
  assert.equal(cartridges.find((card) => card.code === "LC-01")?.source, "youtube");
  assert.match(cartridges.find((card) => card.code === "LC-01")?.url ?? "", /K5KVEU3aaeQ/);
  assert.match(cartridges.find((card) => card.code === "HB-01")?.url ?? "", /BV1LR4y1u72j/);
  assert.equal(cartridges.find((card) => card.code === "HB-07")?.source, "external");
});

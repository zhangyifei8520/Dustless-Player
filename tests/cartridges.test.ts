import assert from "node:assert/strict";
import test from "node:test";

import { cartridges } from "../src/data/cartridges";

test("ships three distinct vector cartridge records with real source URLs", () => {
  assert.equal(cartridges.length, 3);
  assert.deepEqual(
    cartridges.map((card) => card.color),
    ["green", "blue", "pink"],
  );
  assert.equal(new Set(cartridges.map((card) => card.id)).size, 3);
  assert.ok(cartridges.every((card) => card.summary.length >= 20));
  assert.match(cartridges[0].url, /xiaohongshu\.com/);
  assert.match(cartridges[1].url, /BV1wL9sYEE8t/);
  assert.match(cartridges[2].url, /BV1hKKV6MEHM/);
});

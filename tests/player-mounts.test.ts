import assert from "node:assert/strict";
import test from "node:test";

import { getPlayerMounts } from "../src/lib/playerMachine";

test("inline playback is the only mounted player outside fullscreen", () => {
  assert.deepEqual(
    getPlayerMounts({ mode: "playing", fullscreen: false }),
    { inline: true, fullscreen: false },
  );
});

test("fullscreen suppresses inline playback and mounts one fullscreen player", () => {
  const mounts = getPlayerMounts({ mode: "playing", fullscreen: true });

  assert.deepEqual(mounts, { inline: false, fullscreen: true });
  assert.equal(Number(mounts.inline) + Number(mounts.fullscreen), 1);
});

test("non-playing states mount no player", () => {
  assert.deepEqual(
    getPlayerMounts({ mode: "loading", fullscreen: false }),
    { inline: false, fullscreen: false },
  );
});

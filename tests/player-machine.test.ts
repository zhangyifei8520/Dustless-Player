import assert from "node:assert/strict";
import test from "node:test";

import {
  initialPlayerState,
  playerReducer,
} from "../src/lib/playerMachine";

test("power turns the idle display off and back to the wallpaper", () => {
  const off = playerReducer(initialPlayerState, { type: "POWER_TOGGLE" });
  assert.equal(off.mode, "off");

  const idle = playerReducer(off, { type: "POWER_TOGGLE" });
  assert.equal(idle.mode, "idle");
});

test("starting a cartridge enters loading and finishing enters playback", () => {
  const loading = playerReducer(initialPlayerState, {
    type: "START_LOADING",
    cartridgeId: "bl-01",
  });
  assert.deepEqual(loading, {
    mode: "loading",
    activeCartridgeId: "bl-01",
    progress: 0,
    fullscreen: false,
  });

  const progressed = playerReducer(loading, {
    type: "SET_PROGRESS",
    progress: 64,
  });
  assert.equal(progressed.progress, 64);

  const playing = playerReducer(progressed, { type: "FINISH_LOADING" });
  assert.equal(playing.mode, "playing");
  assert.equal(playing.progress, 100);
});

test("power during loading cancels the cartridge and fullscreen closes cleanly", () => {
  const loading = playerReducer(initialPlayerState, {
    type: "START_LOADING",
    cartridgeId: "cr-03",
  });
  const off = playerReducer(loading, { type: "POWER_TOGGLE" });
  assert.deepEqual(off, {
    mode: "off",
    activeCartridgeId: null,
    progress: 0,
    fullscreen: false,
  });

  const playing = {
    mode: "playing" as const,
    activeCartridgeId: "cr-03",
    progress: 100,
    fullscreen: false,
  };
  const fullscreen = playerReducer(playing, { type: "OPEN_FULLSCREEN" });
  assert.equal(fullscreen.fullscreen, true);
  assert.equal(
    playerReducer(fullscreen, { type: "CLOSE_FULLSCREEN" }).fullscreen,
    false,
  );
});

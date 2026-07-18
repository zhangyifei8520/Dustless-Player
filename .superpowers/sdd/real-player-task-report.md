# Real Player Task 1 Report

## Scope

- Added a pure playback target resolver.
- Replaced simulated playback with official Bilibili embeds.
- Added a safe original-link fallback for Xiaohongshu and malformed/unsupported targets.
- Reused the same player component in the console screen and fullscreen overlay.
- Did not change calibrated console geometry or mobile media rules.
- Did not add a `回看` button or restore `PIXEL REPLAY`.

## RED evidence

Command:

```text
node --import tsx --test tests/playback-target.test.ts
```

Expected failure observed before production implementation:

```text
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../src/lib/playbackTarget'
tests 1
pass 0
fail 1
```

The later temporary `muted=1` requirement was also changed test-first. After that requirement was revoked, the exact tests were restored first and failed against the temporary production URL because it still contained `muted=1`. Production was then restored to the originally planned URL.

## GREEN evidence

Focused resolver verification:

```text
node --import tsx --test tests/playback-target.test.ts
tests 3
pass 3
fail 0
```

Full verification:

```text
npm run lint && npm test
```

Results:

```text
ESLint: passed
Unit tests: 7 passed, 0 failed
Production build: passed
Rendered HTML test: 1 passed, 0 failed
```

## Browser QA at 1440×900

- `LS-02` rendered `https://player.bilibili.com/player.html?bvid=BV1wL9sYEE8t&autoplay=1&danmaku=0&refer=1`.
- `CR-03` rendered `https://player.bilibili.com/player.html?bvid=BV1hKKV6MEHM&autoplay=1&danmaku=0&refer=1`.
- No controls inside either Bilibili iframe were used.
- `HB-01` rendered no iframe and exposed its original Xiaohongshu URL with `target="_blank"` and `rel="noopener noreferrer"`.
- Fullscreen overlay opened and closed with Escape.
- `PIXEL REPLAY` was absent and no `回看` button was present.

## Changed files

- `src/lib/playbackTarget.ts`
- `src/components/SimulatedPlayer.tsx`
- `src/styles/pixel.css`
- `tests/playback-target.test.ts`
- `tests/rendered-html.test.mjs`
- `.superpowers/sdd/real-player-task-report.md`

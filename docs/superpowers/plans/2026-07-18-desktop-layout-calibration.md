# Desktop Layout Calibration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Calibrate the desktop prototype to fit fully within one viewport, use an exact 16:9 screen, correctly place the Power/fullscreen controls, and match the supplied black-and-white pixel navigation.

**Architecture:** Keep the existing React state machine and cartridge components. Replace only the console presentation layer: copy the supplied console and wallpaper assets into `public/assets`, render the wallpaper inside one shared 16:9 screen layer, and anchor every control to the same aspect-ratio console stage. Desktop CSS becomes viewport-height-driven; existing mobile rules remain but are not part of this acceptance pass.

**Tech Stack:** React 19, TypeScript, Vinext, CSS, Node test runner, Codex in-app browser.

## Global Constraints

- Remove the upper-left brand and the complete left promotional copy block.
- Preserve all existing playback, loading, Power, fullscreen, Escape, drag/drop, and navigation-feedback behavior.
- Use `组件/computer2.png` as the console structure reference and preserve `Clipboard - 2026-07-18 18.15.34.png` at its original 1672×941 pixels as the near-16:9 idle wallpaper; do not resample it.
- Do not add an icon package or rebuild the console illustration.
- Desktop acceptance viewports are exactly 1920×1080 and 1440×900.
- Mobile CSS may remain but receives no additional visual tuning in this plan.

---

### Task 1: Lock the revised desktop structure with a failing render test

**Files:**
- Modify: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: the server-rendered `/` route.
- Produces: regression assertions for the new asset names and removed promotional content.

- [ ] **Step 1: Add the failing assertions**

Add these assertions inside `server-renders the cartridge game prototype` after reading `html`:

```js
assert.match(html, /\/assets\/computer2\.png/);
assert.match(html, /\/assets\/screen-wallpaper\.png/);
assert.doesNotMatch(html, /REPLAY YOUR SAVES/);
assert.doesNotMatch(html, /把收藏，/);
assert.doesNotMatch(html, /插回生活里。/);
assert.match(html, /class="nav-icon nav-home"/);
assert.match(html, /class="nav-icon nav-library"/);
assert.match(html, /class="nav-icon nav-about"/);
```

- [ ] **Step 2: Run the focused test and confirm it fails**

Run:

```bash
npm run build && node --test tests/rendered-html.test.mjs
```

Expected: FAIL because the current HTML still references `game-console.png`, includes the brand/copy, and has no named navigation icon classes.

- [ ] **Step 3: Commit the red test**

```bash
git add tests/rendered-html.test.mjs
git commit -m "test: lock desktop console layout contract"
```

---

### Task 2: Install the approved console and 16:9 wallpaper assets

**Files:**
- Create: `public/assets/computer2.png`
- Create: `public/assets/screen-wallpaper.png`

**Interfaces:**
- Consumes: `/Users/zhangyifei/Documents/不吃灰project/组件/computer2.png` and `/Users/zhangyifei/我的灵感素材/我的灵感素材.library/images/MRQ7O2P14PGND.info/Clipboard - 2026-07-18 18.15.34.png`.
- Produces: stable public URLs `/assets/computer2.png` and `/assets/screen-wallpaper.png`.

- [ ] **Step 1: Copy the exact supplied raster assets**

Run:

```bash
cp '/Users/zhangyifei/Documents/不吃灰project/组件/computer2.png' public/assets/computer2.png
cp '/Users/zhangyifei/我的灵感素材/我的灵感素材.library/images/MRQ7O2P14PGND.info/Clipboard - 2026-07-18 18.15.34.png' public/assets/screen-wallpaper.png
sips -g pixelWidth -g pixelHeight public/assets/computer2.png public/assets/screen-wallpaper.png
```

Expected: `computer2.png` is 987×969 and `screen-wallpaper.png` is 1672×941. CSS supplies the exact 16:9 viewport without resampling this pixel artwork.

- [ ] **Step 2: Commit the assets**

```bash
git add public/assets/computer2.png public/assets/screen-wallpaper.png
git commit -m "assets: add calibrated console and screen wallpaper"
```

---

### Task 3: Simplify the page chrome and render a shared 16:9 screen

**Files:**
- Modify: `src/components/GameConsole.tsx`
- Test: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: the existing `PlayerState` modes and `SimulatedPlayer`.
- Produces: one `.screen-layer` whose child content changes without changing its geometry.

- [ ] **Step 1: Remove the brand and promotional copy**

Replace the header/section opening with this structure:

```tsx
<header className="site-header">
  <nav aria-label="主导航">
    <button type="button" onClick={() => showNavNotice("首页")}>
      <span className="nav-icon nav-home" aria-hidden="true" />
      首页
    </button>
    <button type="button" onClick={() => showNavNotice("收藏库")}>
      <span className="nav-icon nav-library" aria-hidden="true" />
      收藏库
    </button>
    <button type="button" onClick={() => showNavNotice("关于")}>
      <span className="nav-icon nav-about" aria-hidden="true">?</span>
      关于
    </button>
  </nav>
</header>

<section className="console-section" id="console" aria-label="收藏卡带放映机">
  <div className="console-stage">
```

Delete the `.brand` anchor and the entire `.console-copy` element.

- [ ] **Step 2: Switch the console artwork and idle wallpaper**

Change the console image source to `/assets/computer2.png`. Replace the idle content with:

```tsx
{state.mode === "idle" && (
  <div className="idle-screen">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src="/assets/screen-wallpaper.png"
      width={1672}
      height={941}
      alt="像素山海桌面壁纸"
    />
    <div className="idle-prompt">
      <span aria-hidden="true"><i /><i /><i /></span>
      <strong>PIXEL REPLAY</strong>
      <small>点击或拖拽一张卡带开始播放</small>
    </div>
  </div>
)}
```

Keep the existing off/loading/playing branches inside the same `.screen-layer`.

- [ ] **Step 3: Run the render test**

Run:

```bash
npm run build && node --test tests/rendered-html.test.mjs
```

Expected: PASS for asset references, removed copy, and navigation icon classes.

- [ ] **Step 4: Commit the component update**

```bash
git add src/components/GameConsole.tsx tests/rendered-html.test.mjs
git commit -m "feat: simplify desktop console composition"
```

---

### Task 4: Calibrate single-screen geometry and control positions

**Files:**
- Modify: `src/styles/pixel.css`

**Interfaces:**
- Consumes: `.site-header`, `.console-section`, `.console-stage`, `.screen-layer`, `.power-control`, `.fullscreen-control`, `.slot-dropzone`, `.card-rack`.
- Produces: stable desktop geometry relative to the 987×969 console stage.

- [ ] **Step 1: Make the desktop page height-driven**

Replace the desktop page/header/stage layout with these values:

```css
.game-page {
  position: relative;
  min-height: 100vh;
  padding: 20px 28px;
  overflow: hidden;
}

.site-header {
  position: absolute;
  z-index: 100;
  top: 26px;
  right: 38px;
  display: flex;
  justify-content: flex-end;
  width: auto;
  margin: 0;
}

.console-section {
  display: grid;
  min-height: calc(100vh - 40px);
  place-items: center;
  width: 100%;
  margin: 0;
}

.console-stage {
  position: relative;
  width: min(900px, calc((100vh - 86px) * 1.0186), calc(100vw - 56px));
  margin: 28px auto 0;
  isolation: isolate;
}
```

Delete the obsolete `.brand*` and `.console-copy*` rules.

- [ ] **Step 2: Lock the screen to the supplied 16:9 opening**

Use the measured `computer2.png` screen opening:

```css
.screen-layer {
  position: absolute;
  z-index: 3;
  top: 7.12%;
  left: 16.82%;
  width: 65.86%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 2px 2px 8px 8px;
}

.idle-screen,
.idle-screen > img {
  width: 100%;
  height: 100%;
}

.idle-screen > img {
  display: block;
  object-fit: cover;
}

.idle-prompt {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  justify-items: center;
  text-align: center;
}
```

Keep off/loading/playing backgrounds clipped by `.screen-layer`.

- [ ] **Step 3: Anchor both controls inside the white panel**

Set the control geometry relative to the stage:

```css
.console-control {
  width: 5.1%;
  aspect-ratio: 1;
  height: auto;
}

.power-control {
  top: 58.9%;
  left: 15.3%;
}

.fullscreen-control {
  top: 58.9%;
  right: 15.3%;
}

.slot-dropzone {
  top: 57.55%;
  left: 34.1%;
  width: 31.8%;
  height: 5.1%;
}
```

The Power and fullscreen labels remain attached to their buttons via `.console-control small`.

- [ ] **Step 4: Replace blue navigation tiles with black-and-white pixel controls**

Use CSS-only icons and hard pixel shadows:

```css
.site-header nav {
  display: flex;
  gap: 30px;
}

.site-header nav button {
  display: inline-flex;
  gap: 10px;
  align-items: center;
  padding: 4px;
  border: 0;
  color: #fff;
  background: transparent;
  font-size: 23px;
  font-weight: 950;
  cursor: pointer;
  text-shadow: -2px -2px 0 #000, 2px -2px 0 #000,
    -2px 2px 0 #000, 2px 2px 0 #000, 3px 0 0 #000, 0 3px 0 #000;
}

.nav-icon {
  position: relative;
  display: inline-grid;
  width: 27px;
  height: 27px;
  flex: 0 0 27px;
  place-items: center;
  color: #fff;
  filter: drop-shadow(2px 0 0 #000) drop-shadow(-2px 0 0 #000)
    drop-shadow(0 2px 0 #000) drop-shadow(0 -2px 0 #000);
}
```

Draw `.nav-home` and `.nav-library` with `::before`/`::after`; render the about question mark through `.nav-about`.

- [ ] **Step 5: Replace the card outline hover with lift**

Replace the current hover/focus rule with:

```css
.cartridge:hover,
.cartridge:focus-visible {
  z-index: 20;
  filter: brightness(1.05) saturate(1.08);
  outline: none;
  box-shadow: 10px 16px 0 var(--ink);
  transform: translateY(-9px);
}
```

Add `transform 140ms steps(3, end)` to the base cartridge transition without changing `.is-dragging`.

- [ ] **Step 6: Run lint and all tests**

Run:

```bash
npm run lint && npm test
```

Expected: zero lint errors, four state/data tests pass, render test passes, and Vinext build exits 0.

- [ ] **Step 7: Commit the calibrated CSS**

```bash
git add src/styles/pixel.css
git commit -m "fix: calibrate desktop console geometry"
```

---

### Task 5: Browser-verify desktop geometry and publish the revision

**Files:**
- Modify only if browser evidence reveals a measured mismatch: `src/styles/pixel.css`
- Modify automatically through deployment metadata only if required: `.openai/hosting.json`

**Interfaces:**
- Consumes: local `npm run dev`, Sites project ID from `.openai/hosting.json`.
- Produces: a verified private production deployment of the calibrated desktop page.

- [ ] **Step 1: Start the development server**

Run `npm run dev` and use the exact reported localhost URL.

- [ ] **Step 2: Verify 1920×1080**

Set the browser viewport to 1920×1080 and verify with DOM geometry plus a screenshot:

```js
({
  viewport: [window.innerWidth, window.innerHeight],
  scrollHeight: document.documentElement.scrollHeight,
  screenRatio: screenRect.width / screenRect.height,
  powerInsidePanel: true,
  fullscreenInsidePanel: true,
})
```

Expected: `scrollHeight <= 1080`, `screenRatio` is within 0.01 of `16 / 9`, all of the console and cabinet are visible, and both controls are inside the white panel.

- [ ] **Step 3: Verify 1440×900**

Set the browser viewport to 1440×900 and repeat the same checks.

Expected: `scrollHeight <= 900` and no overlap among controls, cabinet, and cards.

- [ ] **Step 4: Verify interaction regressions**

Click Power off/on, play each card through its `data-testid`, wait for loading to become playing, open fullscreen, close with Escape, and click one navigation button to confirm the preparation toast.

- [ ] **Step 5: Run final verification**

Run:

```bash
npm run lint && npm test && git status --short --branch
```

Expected: all checks pass and the working tree is clean after any final calibration commit.

- [ ] **Step 6: Save and privately deploy the new Sites version**

Push the exact verified commit to the configured Sites source repository, package with `scripts/package-site.sh`, save one new version, deploy privately, and poll until deployment status is `succeeded`.

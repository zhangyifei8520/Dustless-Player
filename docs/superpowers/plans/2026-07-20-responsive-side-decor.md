# 响应式两侧装饰安全区 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让首页两侧装饰在桌面宽度变化时避让中央主机，并在窄屏隐藏。

**Architecture:** 复用现有 `.console-stage` 的响应式宽度，通过 CSS 自定义变量计算主机左右边界。两侧装饰以主机边界为锚点，按剩余侧边空间缩放；窄屏继续隐藏装饰。只修改像素样式与契约测试，不改变主机、屏幕或卡片布局。

**Tech Stack:** React, TypeScript, CSS, Node test runner.

## Global Constraints

- 中央主机、控制区和卡片架的位置、尺寸和间距保持不变。
- 两侧装饰包含文字、黄色下划线、笑脸、右侧白卡和蓝色闪电。
- 桌面空间不足时按比例缩小，进入窄屏断点后隐藏。

---

### Task 1: Add the responsive safety-zone contract

**Files:**
- Modify: `tests/player-markup.test.ts`

- [ ] **Step 1: Write the failing test**

Add a test that requires the stylesheet to define a shared console width variable, side-safe anchoring, and a scale clamp for both decoration groups:

```ts
test("side decorations use the console safety zone on desktop", async () => {
  const styles = await readFile(new URL("../src/styles/pixel.css", import.meta.url), "utf8");

  assert.match(styles, /--console-stage-width:/);
  assert.match(styles, /\.left-decor \{[^}]*right: calc\(50% \+ var\(--console-stage-width\) \/ 2/);
  assert.match(styles, /\.right-decor \{[^}]*left: calc\(50% \+ var\(--console-stage-width\) \/ 2/);
  assert.match(styles, /--side-decor-scale: clamp\(/);
  assert.match(styles, /\.left-decor,\s*\.right-decor \{[^}]*transform: scale\(var\(--side-decor-scale\)\)/s);
});
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `node --import tsx --test tests/player-markup.test.ts`

Expected: FAIL because the current stylesheet uses fixed `left` and `right` positions and has no shared safety-zone variables.

### Task 2: Implement the CSS safety zone

**Files:**
- Modify: `src/styles/pixel.css:164-181,847-872`

- [ ] **Step 1: Define the shared stage width**

Change `.console-stage` to use a custom property without changing its existing width formula:

```css
.console-section {
  --console-stage-width: min(900px, calc((100vh - 86px) * 1.0186), calc(100vw - 56px));
}

.console-stage {
  width: var(--console-stage-width);
}
```

- [ ] **Step 2: Anchor decorations outside the stage**

Add the available-space scale and replace fixed side placement with stage-relative edges:

```css
.console-section {
  --side-decor-scale: clamp(.55, calc((100vw - var(--console-stage-width) - 56px) / 560px), 1);
}

.left-decor,
.right-decor {
  transform: scale(var(--side-decor-scale));
}

.left-decor {
  right: calc(50% + var(--console-stage-width) / 2 + 24px);
  left: auto;
  transform-origin: right center;
}

.right-decor {
  left: calc(50% + var(--console-stage-width) / 2 + 24px);
  right: auto;
  transform-origin: left center;
}
```

Keep the existing `top`, widths, typography, and decoration child positions unchanged.

- [ ] **Step 3: Preserve the narrow-screen behavior**

Keep `.left-decor, .right-decor { display: none; }` in the existing `@media (max-width: 760px)` block so the desktop safety zone does not affect the mobile layout.

- [ ] **Step 4: Run the focused test to verify it passes**

Run: `node --import tsx --test tests/player-markup.test.ts`

Expected: PASS with the existing tests unchanged except for the new responsive contract.

### Task 3: Verify the full project

**Files:**
- No additional files.

- [ ] **Step 1: Run the full validation suite**

Run: `npm test && npm run lint && npm run build`

Expected: all tests pass, build succeeds, and lint reports no errors.

- [ ] **Step 2: Check the final diff**

Run: `git diff --check && git status --short`

Expected: only `src/styles/pixel.css` and `tests/player-markup.test.ts` are modified after the already committed design and plan documents.

# 网页摘要封面卡 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 当普通网页无法被阅读器完整读取时，在电视屏幕中显示带倾斜封面小卡的电子风收藏摘要卡。

**Architecture:** 保持现有 `SimulatedPlayer` 的 Reader 成功路径不变，只增强 `error` 路径。阅读器状态新增可选 `coverImage`，API 在 Reader 文本存在首图但无法形成正文时返回摘要降级数据；客户端用该图渲染右侧倾斜封面，缺图时显示本地像素占位。

**Tech Stack:** Next.js/Vinext、React、TypeScript、CSS、Node test runner。

## Global Constraints

- 只修改普通网页读取失败时的摘要卡，不改视频播放器、卡带、电视机和全屏交互。
- 摘要始终使用收藏库卡片已有的 `title` 与 `summary`，不生成或虚构网页内容。
- 首图可用时显示首图；无首图时使用本地像素占位。
- 继续使用现有深色电子风摘要卡视觉和像素字体。

---

### Task 1: 扩展阅读器失败数据以保留首图

**Files:**
- Modify: `src/lib/reader.ts`
- Modify: `app/api/reader/route.ts`
- Modify: `tests/reader.test.ts`

**Interfaces:**
- Produces: `extractReaderCover(raw: string): string | null`，返回 Reader Markdown 中第一张 HTTP(S) 图片。
- Produces: 失败接口响应 `{ error: string; coverImage: string | null }`。
- Consumes: `parseReaderMarkdown(raw)` 现有正文解析函数。

- [ ] **Step 1: 写出首图提取失败测试**

```ts
test("extracts the first image when reader markdown has no readable article body", () => {
  assert.equal(
    extractReaderCover("Title: 页面\\n\\nMarkdown Content:\\n![封面](https://images.example.com/cover.jpg)"),
    "https://images.example.com/cover.jpg",
  );
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `node --import tsx --test tests/reader.test.ts`

Expected: FAIL，提示 `extractReaderCover` 未导出。

- [ ] **Step 3: 实现最小首图解析**

```ts
export function extractReaderCover(raw: string): string | null {
  return raw.match(/!\\[[^\\]]*\\]\\((https?:\\/\\/[^\\s)]+)/)?.[1] ?? null;
}
```

在 `app/api/reader/route.ts` 中先读取 Reader 返回文本；当 `parseReaderMarkdown` 为空时，返回 502 JSON：

```ts
return Response.json(
  { error: "暂时无法读取该网页", coverImage: extractReaderCover(markdown) },
  { status: 502 },
);
```

- [ ] **Step 4: 运行测试确认通过**

Run: `node --import tsx --test tests/reader.test.ts`

Expected: PASS。

- [ ] **Step 5: 提交本任务**

```bash
git add src/lib/reader.ts app/api/reader/route.ts tests/reader.test.ts
git commit -m "feat: retain reader cover on fallback"
```

### Task 2: 渲染倾斜封面摘要卡

**Files:**
- Modify: `src/components/SimulatedPlayer.tsx`
- Modify: `src/styles/pixel.css`
- Modify: `tests/player-markup.test.ts`

**Interfaces:**
- Consumes: 失败接口响应中的 `coverImage: string | null`。
- Produces: `ReaderState` 的错误分支 `{ status: "error"; url: string; coverImage: string | null }`。
- Produces: `.sim-reader-summary-copy` 和 `.sim-reader-summary-cover` 两列摘要卡布局。

- [ ] **Step 1: 写出摘要卡结构失败测试**

```ts
test("the reader fallback includes a cover slot and saved summary copy", async () => {
  const source = await readFile(new URL("../src/components/SimulatedPlayer.tsx", import.meta.url), "utf8");
  assert.match(source, /sim-reader-summary-cover/);
  assert.match(source, /sim-reader-summary-copy/);
  assert.match(source, /coverImage/);
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `node --import tsx --test tests/player-markup.test.ts`

Expected: FAIL，提示摘要卡类名或 `coverImage` 不存在。

- [ ] **Step 3: 实现客户端错误响应和摘要卡结构**

把 Reader 请求的非 2xx 响应解析为 `{ coverImage?: string | null }`，并存入错误状态。摘要卡使用：

```tsx
<div className="sim-reader-summary">
  <div className="sim-reader-summary-copy">…已有 SAVED SUMMARY、标题、摘要、链接…</div>
  <div className="sim-reader-summary-cover">
    <img src={state.coverImage ?? "/assets/reader-cover-placeholder.svg"} alt="" />
  </div>
</div>
```

创建 `public/assets/reader-cover-placeholder.svg`，使用简单像素方块、浅紫屏幕和黄色点缀，作为没有首图时的封面。

- [ ] **Step 4: 添加两列电子风视觉**

```css
.sim-reader-summary { grid-template-columns: minmax(0, 1fr) 30%; }
.sim-reader-summary-cover { transform: rotate(8deg); border: 3px solid var(--ink); box-shadow: 5px 5px 0 #090b16; }
.sim-reader-summary-cover img { width: 100%; height: 100%; object-fit: cover; image-rendering: pixelated; }
```

保留现有深色底色、黄色 `SAVED SUMMARY` 标签和蓝色原链接按钮；封面卡不能遮挡左侧标题、摘要和链接。

- [ ] **Step 5: 运行测试和构建确认通过**

Run: `npm test && npm run lint && git diff --check`

Expected: 测试全部通过；lint 仅保留项目既有的 `img` 优化 warning；无 diff 空白错误。

- [ ] **Step 6: 提交本任务**

```bash
git add src/components/SimulatedPlayer.tsx src/styles/pixel.css public/assets/reader-cover-placeholder.svg tests/player-markup.test.ts
git commit -m "feat: add cover card to web summary fallback"
```

## Self-Review

- 覆盖了规格中的首图、无图占位、左侧摘要、右侧倾斜卡片和不改视频/卡带的限制。
- 无待定项、占位说明或未定义接口。
- Task 2 消费的 `coverImage` 在 Task 1 的响应协议中定义。

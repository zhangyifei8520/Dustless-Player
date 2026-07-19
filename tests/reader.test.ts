import assert from "node:assert/strict";
import test from "node:test";

import { extractReaderCover, parseReaderMarkdown } from "../src/lib/reader";

test("turns reader markdown into a compact article with images and paragraphs", () => {
  const article = parseReaderMarkdown(`Title: 测试文章

Markdown Content:
## 测试文章

![封面](https://images.example.com/cover.png)

这是第一段正文，用于说明文章的内容。

### 小标题

这是第二段正文，长度足够作为阅读内容展示。`);

  assert.deepEqual(article, {
    title: "测试文章",
    blocks: [
      { type: "image", src: "https://images.example.com/cover.png", alt: "封面" },
      { type: "paragraph", text: "这是第一段正文，用于说明文章的内容。" },
      { type: "heading", text: "小标题" },
      { type: "paragraph", text: "这是第二段正文，长度足够作为阅读内容展示。" },
    ],
  });
});

test("rejects reader output without readable body content", () => {
  assert.equal(parseReaderMarkdown("Title: 空页面\n\nMarkdown Content:"), null);
});

test("extracts the first image when reader markdown has no readable article body", () => {
  assert.equal(
    extractReaderCover("Title: 页面\n\nMarkdown Content:\n![封面](https://images.example.com/cover.jpg)"),
    "https://images.example.com/cover.jpg",
  );
});

import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import test from "node:test";

test("homepage library control opens the library route", async () => {
  const source = await readFile(new URL("../src/components/GameConsole.tsx", import.meta.url), "utf8");
  assert.match(source, /window\.location\.assign\("\/library"\)/);
});

test("library route embeds the imported standalone page", async () => {
  const source = await readFile(new URL("../app/library/page.tsx", import.meta.url), "utf8");
  assert.match(source, /src="\/library-page\/index\.html"/);
  assert.match(source, /title="收藏库"/);
});

test("imported library page loads its standalone runtime", async () => {
  const source = await readFile(new URL("../public/library-page/index.html", import.meta.url), "utf8");
  assert.match(source, /src="\.\/support\.js"/);
});

test("library player profile exposes an editable username modal", async () => {
  const source = await readFile(new URL("../public/library-page/index.html", import.meta.url), "utf8");

  assert.match(source, /class="player-name"/);
  assert.match(source, /title="修改用户名"/);
  assert.match(source, /onClick="\{\{ openProfileEdit \}\}"/);
  assert.match(source, /profileEditOpen/);
  assert.match(source, /profileNameDraft/);
  assert.match(source, /保存/);
  assert.match(source, /取消/);
  assert.match(source, /setState\(\{\s*playerName:/);
});

test("library route reuses the homepage navigation outside the scaled embed", async () => {
  const route = await readFile(new URL("../app/library/page.tsx", import.meta.url), "utf8");
  const embedded = await readFile(new URL("../public/library-page/index.html", import.meta.url), "utf8");
  assert.match(route, /className="site-header"/);
  assert.match(route, /href="\/"/);
  assert.match(route, /href="\/library"/);
  assert.doesNotMatch(embedded, /class="site-nav"/);
  assert.doesNotMatch(embedded, /border-right:10px solid #1c1b2e/);
});

test("library runtime and referenced images are shipped", async () => {
  const paths = [
    "../public/library-page/support.js",
    "../public/library-page/assets/hello-agents.png",
    "../public/library-page/assets/gates-ai.png",
  ];

  for (const path of paths) {
    const url = new URL(path, import.meta.url);
    await access(url);
    assert.ok((await stat(url)).size > 0, `${path} should not be empty`);
  }
});

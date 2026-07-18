import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the cartridge game prototype", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /\/assets\/computer2\.png/);
  assert.match(html, /\/assets\/screen-wallpaper\.png/);
  assert.doesNotMatch(html, /REPLAY YOUR SAVES/);
  assert.doesNotMatch(html, /把收藏，/);
  assert.doesNotMatch(html, /插回生活里。/);
  assert.match(html, /class="nav-icon nav-home"/);
  assert.match(html, /class="nav-icon nav-library"/);
  assert.match(html, /class="nav-icon nav-about"/);
  assert.match(html, /<title>不吃灰｜收藏卡带放映机<\/title>/i);
  assert.match(html, /HB-01/);
  assert.match(html, /LS-02/);
  assert.match(html, /CR-03/);
  assert.match(html, /全屏播放/);
  assert.doesNotMatch(html, /PIXEL REPLAY/);
  assert.doesNotMatch(html, />\s*回看\s*</);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site/);
});

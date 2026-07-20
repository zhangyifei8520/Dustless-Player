import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pagePath = new URL("../app/about/page.tsx", import.meta.url);
const componentPath = new URL("../src/components/AboutPage.tsx", import.meta.url);
const cssPath = new URL("../src/styles/pixel.css", import.meta.url);

test("about page contains the usage guide and named pixel team portraits", async () => {
  const [page, component] = await Promise.all([
    readFile(pagePath, "utf8"),
    readFile(componentPath, "utf8"),
  ]);

  assert.match(page, /AboutPage/);
  assert.match(component, /使用说明书/);
  assert.match(component, /把那些被收藏/);
  assert.match(component, /Xiya/);
  assert.match(component, /Fifi/);
  assert.match(component, /黑色长头发/);
  assert.match(component, /红色头发/);
  assert.match(component, /about-avatar-xiya/);
  assert.match(component, /about-avatar-fifi/);
  assert.match(component, /卡带趣味交互/);
  assert.match(component, /Ai收藏分析助手/);
  assert.match(component, /收藏库保存链接经过Ai智能化分析分门归类，并智能化分析你的收藏爱好。/);
  assert.match(component, /每日推荐/);
  assert.match(component, /AI智能分析并推荐三个收藏链接至首页，点击随机按钮可再次随机刷新。/);
  assert.match(component, /AI帮你重新发现想成为的自己。/);
  assert.match(component, /产品概念与体验架构/);
  assert.match(component, /视觉设计与交互体验/);
  assert.match(component, /一台把收藏链接变成游戏卡带的AI播放器，让想看的内容重新回到你的生活里。/);
  assert.match(component, /负责定义产品概念、PRD及功能框架，构建从“收藏沉淀”到“AI自我探索”的体验逻辑。设计收藏库机制与交互体系，让 AI 从内容整理升级为驱动个人成长的智能伙伴。/);
  assert.match(component, /负责确立像素风视觉语言与整体交互体验，搭建具有复古游戏氛围的首页场景。设计游戏机核心玩法，让收藏内容从静态浏览变成可探索的趣味互动。/);
});

test("about page uses the dense two-row desktop composition and static navigation", async () => {
  const [component, css] = await Promise.all([
    readFile(componentPath, "utf8"),
    readFile(cssPath, "utf8"),
  ]);

  assert.match(component, /href="\/"/);
  assert.match(component, /href="\/library"/);
  assert.match(component, /href="\/about"/);
  assert.match(css, /\.about-grid\s*\{[\s\S]*grid-template-columns:\s*repeat\(12,\s*minmax\(0,\s*1fr\)\);[\s\S]*grid-auto-flow:\s*dense;/);
  assert.match(css, /\.about-instruction-card\s*\{[\s\S]*grid-column:\s*span 7;[\s\S]*grid-row:\s*span 2;/);
  assert.match(css, /\.about-person-card\s*\{[\s\S]*grid-column:\s*span 5;/);
  assert.match(css, /\.about-header\s*\{[\s\S]*position:\s*absolute;[\s\S]*top:\s*26px;[\s\S]*right:\s*38px;[\s\S]*width:\s*auto;/);
  assert.match(css, /\.about-page[\s\S]*background:[\s\S]*linear-gradient/);
});

test("about page desktop composition fits one viewport without page scrolling", async () => {
  const css = await readFile(cssPath, "utf8");

  assert.match(css, /\.about-page\s*\{[\s\S]*height:\s*100dvh;[\s\S]*overflow-x:\s*hidden;[\s\S]*overflow-y:\s*hidden;/);
  assert.match(css, /\.about-grid\s*\{[\s\S]*height:\s*min\(47vh,\s*430px\);/);
  assert.match(css, /\.about-footer\s*\{[\s\S]*margin:\s*16px auto 0;/);
});

test("about hero console stays compact on the right", async () => {
  const css = await readFile(cssPath, "utf8");

  assert.match(css, /\.about-hero-console\s*\{[\s\S]*width:\s*min\(400px,\s*100%\);[\s\S]*justify-self:\s*end;/);
  assert.match(css, /\.about-lead\s*\{[\s\S]*font-size:\s*clamp\(12px,\s*\.95vw,\s*15px\);/);
  assert.match(css, /\.about-hero-screen strong\s*\{[\s\S]*font-size:\s*clamp\(36px,\s*4\.85vw,\s*62px\);/);
});

test("about person cards keep their copy inside the card", async () => {
  const css = await readFile(cssPath, "utf8");

  assert.match(css, /\.about-person-card\s*\{[\s\S]*grid-template-columns:\s*136px\s+minmax\(0,\s*1fr\);[\s\S]*padding:\s*18px;/);
  assert.match(css, /\.about-avatar\s*\{[\s\S]*width:\s*126px;\s*height:\s*126px;/);
  assert.match(css, /\.about-person-copy h2\s*\{[\s\S]*font-size:\s*clamp\(28px,\s*3vw,\s*44px\);/);
  assert.match(css, /\.about-person-copy > p:last-child\s*\{[\s\S]*font-size:\s*clamp\(10px,\s*\.8vw,\s*11px\);[\s\S]*line-height:\s*1\.45;/);
});

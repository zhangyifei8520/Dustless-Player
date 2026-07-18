# 真实播放器与原链接降级设计

## 目标

把当前模拟播放替换为混合播放：Bilibili 卡带在主机 16:9 屏幕内使用官方外链播放器；不支持嵌入的平台显示限制提示，并由用户点击后在新标签页打开原链接。

## 已确认行为

- Bilibili 使用官方 `https://player.bilibili.com/player.html?bvid=...` 外链播放器。
- 播放器始终铺满现有 16:9 `.screen-layer`，不改变主机尺寸或按钮位置。
- 页面内“全屏”继续打开现有压暗遮罩层，并在其中铺满同一播放器。
- 小红书不尝试抓取或绕过平台限制；显示像素风平台限制提示和“打开原链接”按钮。
- 原链接必须由用户点击后以 `noopener,noreferrer` 在新标签页打开。
- 不增加“回看”按钮，不恢复 `PIXEL REPLAY`。
- 保留现有 1.2 秒读盘流程、Power、导航和卡片拖拽逻辑。

## 数据与组件

- `src/lib/playbackTarget.ts` 负责从卡片来源和 URL 生成 `embed` 或 `external` 播放目标。
- `SimulatedPlayer` 保留组件名以减少无关重构，但改为渲染真实 iframe 或外链降级面板。
- Bilibili iframe 允许 `autoplay; encrypted-media; picture-in-picture; fullscreen`，并设置 `allowFullScreen`。

## 验收

- 两张 Bilibili 卡带生成正确 BV 号的官方外链地址。
- 小红书卡带不会生成 iframe。
- 主屏幕和页面内全屏遮罩均能渲染 Bilibili iframe。
- 小红书显示明确提示，按钮打开原链接。
- 自动测试、构建与双桌面视口检查通过。

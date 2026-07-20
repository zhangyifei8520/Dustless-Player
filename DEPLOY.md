# 部署指南 · Dustless Player 不吃灰播放器

本项目可以部署到 **Vercel**(推荐,标准 Next.js)或 **Cloudflare Workers**(项目原生目标)。
两条路的构建都已在本地验证通过。

---

## 方式一:Vercel(推荐)

标准 Next.js App Router 应用,Vercel 自动识别,零额外配置。

### 步骤

1. 把这个仓库推到 GitHub。
2. 打开 [vercel.com](https://vercel.com) → **Add New Project** → 选择该仓库。
3. Framework 会自动识别为 **Next.js**,Build Command 用默认的 `next build`(即 `npm run build`)。
4. 在 **Settings → Environment Variables** 里(可选,启用 AI 智能分类):
   - `ANTHROPIC_API_KEY` = 你的 Anthropic API Key(在 https://console.anthropic.com 申请)
   - `CLASSIFIER_MODEL` = `claude-haiku-4-5`(可选,默认就是它)
5. **Deploy**,几分钟后拿到 `https://<项目名>.vercel.app` 链接。

### 说明

- 收藏数据存在访客浏览器本地(localStorage),每位访客有独立的收藏库,无需登录。

---

## 配 KEY 与不配 KEY 的体验差异

添加收藏的"输入链接 → 入库 → 播放"主流程 **两种情况都完整可用**,区别只在分类的智能程度。

| 环节 | 不配 `ANTHROPIC_API_KEY` | 配了 `ANTHROPIC_API_KEY` |
| --- | --- | --- |
| 抓取真实标题 / 封面 | ✅ 可以(B站、YouTube 免 key) | ✅ 可以 |
| 短链还原(b23.tv 等) | ✅ 可以 | ✅ 可以 |
| 入库 + 主页播放 | ✅ 可以 | ✅ 可以 |
| 内容分类 | 关键词规则:标题/链接含"旅行·美食"→探索,含"健身·减脂"→健康,其余→学习创造 | Claude 语义理解,更准 |
| 无法从标题看出类别的内容 | 兜底归到"学习创造",可能分错 | AI 判断,分类可靠 |

**结论**:只做演示、不配 key 也能真实体验全流程;想让分类稳、不露馅,就配上 key。

---

## 方式二:Cloudflare Workers

项目基于 [vinext](https://github.com/cloudflare/vinext),原生支持 Cloudflare Workers。

### 步骤

```bash
npm run build:cf          # = vinext build,产物在 dist/
npx wrangler login        # 首次需要登录 Cloudflare 账号
npx vinext deploy         # 部署,输出 *.workers.dev 链接
```

### 环境变量(可选,启用 AI 分类)

```bash
npx wrangler secret put ANTHROPIC_API_KEY
# 按提示粘贴 key。nodejs_compat 已开启,代码里的 process.env 能读到它。
```

---

## 两个平台通用的注意点

- **B站视频内嵌播放**依赖 B站播放器的外链策略,部署后请用普通浏览器实测一个 B站卡带确认能播。
- **网页阅读**(非视频内容)走免费的 `r.jina.ai`,有 IP 限流,高频访问可能失败并降级为"摘要卡 + 跳转原链接"。
- **YouTube** 的播放器和封面在中国大陆无法访问。
- 若目标用户/评委在**中国大陆**,`*.vercel.app` 与 `*.workers.dev` 域名都可能访问不稳定。

---

## 本地开发

```bash
npm install
npm run dev        # 标准 Next.js 开发服务器(Vercel 路线),http://localhost:3000
# 或
npm run dev:cf     # vinext 开发服务器(Cloudflare 路线)
npm run test       # 单元测试
```

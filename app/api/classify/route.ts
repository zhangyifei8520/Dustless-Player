const CATEGORIES = ["health", "learn", "explore"] as const;
type Category = (typeof CATEGORIES)[number];

type AiResult = {
  cat: Category;
  title: string;
  desc: string;
  icon: string;
};

type PageMeta = { title?: string; thumb?: string };

function safeUrl(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

async function fetchWithTimeout(url: string, init: RequestInit, ms: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

const SHORT_LINK_HOSTS = new Set(["b23.tv", "xhslink.com"]);

async function resolveShortLink(sourceUrl: string): Promise<string> {
  try {
    const host = new URL(sourceUrl).hostname.replace(/^www\./, "");
    if (!SHORT_LINK_HOSTS.has(host)) return sourceUrl;
    const response = await fetchWithTimeout(sourceUrl, { redirect: "follow" }, 6_000);
    try { await response.body?.cancel(); } catch { /* body already consumed or locked */ }
    return safeUrl(response.url) ?? sourceUrl;
  } catch {
    return sourceUrl;
  }
}

async function fetchBilibiliMeta(bvid: string): Promise<PageMeta> {
  try {
    const response = await fetchWithTimeout(
      `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`,
      { headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" } },
      6_000,
    );
    if (!response.ok) return {};
    const data = (await response.json()) as { code?: number; data?: { title?: string; pic?: string } };
    if (data.code !== 0) return {};
    const thumb = data.data?.pic?.replace(/^http:/, "https:");
    return { ...(data.data?.title ? { title: data.data.title } : {}), ...(thumb ? { thumb } : {}) };
  } catch {
    return {};
  }
}

function youtubeVideoId(url: URL): string | null {
  if (url.hostname === "youtu.be") return url.pathname.split("/").filter(Boolean)[0] ?? null;
  if (url.hostname.includes("youtube.com")) return url.searchParams.get("v");
  return null;
}

async function fetchYoutubeMeta(videoUrl: string, videoId: string): Promise<PageMeta> {
  const thumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  try {
    const response = await fetchWithTimeout(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`,
      { headers: { Accept: "application/json" } },
      6_000,
    );
    if (!response.ok) return { thumb };
    const data = (await response.json()) as { title?: string; thumbnail_url?: string };
    return { ...(data.title ? { title: data.title } : {}), thumb: data.thumbnail_url ?? thumb };
  } catch {
    return { thumb };
  }
}

async function fetchGenericTitle(sourceUrl: string): Promise<PageMeta> {
  try {
    const response = await fetchWithTimeout(
      `https://r.jina.ai/${sourceUrl}`,
      { headers: { Accept: "text/markdown" } },
      6_000,
    );
    if (!response.ok) return {};
    const markdown = await response.text();
    const title = markdown.match(/^Title:\s*(.+)$/m)?.[1]?.trim();
    return title ? { title } : {};
  } catch {
    return {};
  }
}

async function fetchPageMeta(resolved: string): Promise<PageMeta> {
  try {
    const url = new URL(resolved);
    if (url.hostname.includes("bilibili.com")) {
      const bvid = url.pathname.match(/BV[0-9A-Za-z]+/)?.[0];
      if (bvid) return fetchBilibiliMeta(bvid);
    }
    const videoId = youtubeVideoId(url);
    if (videoId) return fetchYoutubeMeta(resolved, videoId);
  } catch { /* fall through to the generic reader below */ }
  return fetchGenericTitle(resolved);
}

function normalizeAiResult(value: unknown): AiResult | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<AiResult>;
  if (!CATEGORIES.includes(candidate.cat as Category)) return null;
  const title = String(candidate.title ?? "").trim().slice(0, 10);
  const desc = String(candidate.desc ?? "").trim().slice(0, 14);
  const icon = /^[A-Z0-9]{1,3}$/.test(candidate.icon ?? "") ? (candidate.icon as string) : "";
  if (!title) return null;
  return { cat: candidate.cat as Category, title, desc, icon };
}

async function classifyWithClaude(
  apiKey: string,
  sourceUrl: string,
  pageTitle: string | null,
  extraText: string,
): Promise<AiResult | null> {
  try {
    const response = await fetchWithTimeout("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.CLASSIFIER_MODEL || "claude-haiku-4-5",
        max_tokens: 200,
        messages: [{
          role: "user",
          content:
            "你是收藏分类器。根据链接和网页标题推断内容,分到三类之一: health(健康生活:运动/饮食/睡眠/身心), learn(学习创造:知识/技能/工具/创作), explore(探索世界:旅行/美食/地点/生活方式)。无法判断时选 learn。只回复 JSON,不要其他文字: {\"cat\":\"health|learn|explore\",\"title\":\"中文标题≤10字\",\"desc\":\"中文简介≤14字\",\"icon\":\"1-3位大写字母或数字\"}\n\n链接: " +
            sourceUrl +
            (pageTitle ? "\n网页标题: " + pageTitle : "") +
            (extraText ? "\n分享文本: " + extraText : ""),
        }],
      }),
    }, 15_000);
    if (!response.ok) return null;
    const data = (await response.json()) as { content?: { type: string; text?: string }[] };
    const text = data.content?.find((block) => block.type === "text")?.text ?? "";
    return normalizeAiResult(JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] ?? ""));
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const sourceUrl = safeUrl(params.get("url"));
  const extraText = (params.get("text") ?? "").slice(0, 200);
  if (!sourceUrl) return Response.json({ error: "无效网页链接" }, { status: 400 });

  const resolved = await resolveShortLink(sourceUrl);
  const meta = await fetchPageMeta(resolved);

  // Metadata (resolved url / real title / cover) works without an API key;
  // AI classification only kicks in when ANTHROPIC_API_KEY is configured.
  const payload: Record<string, unknown> = {
    url: resolved,
    ...(meta.thumb ? { thumb: meta.thumb } : {}),
  };

  const apiKey = process.env.ANTHROPIC_API_KEY;
  const ai = apiKey ? await classifyWithClaude(apiKey, resolved, meta.title ?? null, extraText) : null;
  if (ai) Object.assign(payload, ai);
  else if (meta.title) payload.title = meta.title.trim().slice(0, 10);

  return Response.json(payload);
}

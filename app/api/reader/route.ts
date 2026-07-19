import { parseReaderMarkdown } from "@/src/lib/reader";

function safeUrl(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const sourceUrl = safeUrl(new URL(request.url).searchParams.get("url"));
  if (!sourceUrl) return Response.json({ error: "无效网页链接" }, { status: 400 });

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);
    let markdown = "";

    try {
      const response = await fetch(`https://r.jina.ai/${encodeURI(sourceUrl)}`, {
        headers: { Accept: "text/markdown" },
        signal: controller.signal,
      });
      markdown = await response.text();
      if (!response.ok) throw new Error(`reader response: ${response.status}`);
    } finally {
      clearTimeout(timeout);
    }

    const article = parseReaderMarkdown(markdown);
    if (!article) {
      return Response.json({ error: "暂时无法读取该网页" }, { status: 502 });
    }

    return Response.json(article, {
      headers: { "Cache-Control": "public, max-age=86400" },
    });
  } catch {
    return Response.json({ error: "暂时无法读取该网页" }, { status: 502 });
  }
}

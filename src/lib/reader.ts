export type ReaderBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "image"; src: string; alt: string };

export type ReaderArticle = {
  title: string;
  blocks: ReaderBlock[];
};

const imagePattern = /!\[([^\]]*)\]\((https?:\/\/[^\s)]+)(?:\s+[^)]*)?\)/;

function textOnly(line: string) {
  return line
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`>#]/g, "")
    .trim();
}

export function parseReaderMarkdown(raw: string): ReaderArticle | null {
  const title = raw.match(/^Title:\s*(.+)$/m)?.[1]?.trim() || "收藏网页";
  const content = raw.split("Markdown Content:").at(-1) ?? raw;
  const blocks: ReaderBlock[] = [];

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    const image = line.match(imagePattern);
    if (image) {
      blocks.push({ type: "image", alt: image[1] || "文章图片", src: image[2] });
      continue;
    }
    if (/^#{1,4}\s+/.test(line)) {
      const heading = textOnly(line.replace(/^#{1,4}\s+/, ""));
      if (heading && heading !== title) blocks.push({ type: "heading", text: heading });
      continue;
    }
    if (/^(URL Source:|\* \* \*|\[[^\]]+\]\([^)]*\)$)/.test(line)) continue;
    const text = textOnly(line.replace(/^[-*+]\s+|^\d+\.\s+/, ""));
    if (text.length >= 8) blocks.push({ type: "paragraph", text });
  }

  return blocks.length ? { title, blocks: blocks.slice(0, 36) } : null;
}

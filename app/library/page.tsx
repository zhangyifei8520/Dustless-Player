import Link from "next/link";

export default function LibraryPage() {
  return (
    <main
      style={{
        width: "100%",
        height: "100dvh",
        overflow: "hidden",
        background: "#b9d8fd",
      }}
    >
      <header className="site-header">
        <nav aria-label="主导航">
          <Link href="/">
            <span className="nav-icon nav-home" aria-hidden="true" />
            <span className="nav-label">首页</span>
          </Link>
          <Link href="/library" aria-current="page">
            <span className="nav-icon nav-library" aria-hidden="true" />
            <span className="nav-label">收藏库</span>
          </Link>
          <a href="/about">
            <span className="nav-icon nav-about" aria-hidden="true">?</span>
            <span className="nav-label">关于</span>
          </a>
        </nav>
      </header>
      <iframe
        title="收藏库"
        src="/library-page/index.html"
        style={{ width: "100%", height: "100%", border: 0, display: "block" }}
      />
    </main>
  );
}

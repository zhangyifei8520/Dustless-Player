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
      <iframe
        title="收藏库"
        src="/library-page/index.html"
        style={{ width: "100%", height: "100%", border: 0, display: "block" }}
      />
    </main>
  );
}

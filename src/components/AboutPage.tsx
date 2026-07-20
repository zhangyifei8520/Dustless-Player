import Link from "next/link";

type PixelPortraitProps = {
  name: "Xiya" | "Fifi";
  hairClass: "about-avatar-xiya" | "about-avatar-fifi";
  hairLabel: string;
};

function PixelPortrait({ name, hairClass, hairLabel }: PixelPortraitProps) {
  return (
    <div className={`about-avatar ${hairClass}`} role="img" aria-label={`${name} ${hairLabel}像素头像`}>
      <svg viewBox="0 0 120 120" aria-hidden="true" shapeRendering="crispEdges">
        <circle cx="60" cy="60" r="54" className="about-avatar-disc" />
        <path d="M27 91V39L35 24H81L96 39V93H80V76H39V93Z" className="about-avatar-hair" />
        <path d="M40 39H80V76H40Z" className="about-avatar-face" />
        <rect x="47" y="51" width="7" height="7" className="about-avatar-eye" />
        <rect x="67" y="51" width="7" height="7" className="about-avatar-eye" />
        <rect x="54" y="66" width="20" height="5" className="about-avatar-mouth" />
        <rect x="48" y="45" width="8" height="3" className="about-avatar-highlight" />
        <rect x="72" y="45" width="8" height="3" className="about-avatar-highlight" />
        <path d="M35 78H42V98H35ZM78 76H85V99H78Z" className="about-avatar-hair" />
        <rect x="44" y="94" width="33" height="9" className="about-avatar-shirt" />
      </svg>
      <span>{name}</span>
    </div>
  );
}

export function AboutPage() {
  return (
    <main className="about-page">
      <header className="site-header about-header">
        <nav aria-label="主导航">
          <Link href="/">
            <span className="nav-icon nav-home" aria-hidden="true" />
            <span className="nav-label">首页</span>
          </Link>
          <Link href="/library">
            <span className="nav-icon nav-library" aria-hidden="true" />
            <span className="nav-label">收藏库</span>
          </Link>
          <Link href="/about" aria-current="page">
            <span className="nav-icon nav-about" aria-hidden="true">?</span>
            <span className="nav-label">关于</span>
          </Link>
        </nav>
      </header>

      <section className="about-hero" aria-labelledby="about-title">
        <div className="about-hero-copy">
          <p className="about-kicker">不吃灰 · 播放器</p>
          <h1 id="about-title">把收藏<br /><span>变成人生行动</span></h1>
          <p className="about-lead">一台把收藏链接变成游戏卡带的AI播放器，让想看的内容重新回到你的生活里。</p>
        </div>
        <div className="about-hero-console" aria-hidden="true">
          <div className="about-hero-screen">
            <span>DUSTLESS</span>
            <strong>PLAYER</strong>
          </div>
          <div className="about-hero-slot" />
          <i className="about-hero-pixel about-hero-pixel-one" />
          <i className="about-hero-pixel about-hero-pixel-two" />
        </div>
      </section>

      <section className="about-grid" aria-label="网页游戏使用说明和团队介绍">
        <article className="about-instruction-card">
          <div className="about-card-heading">
            <span className="about-card-icon" aria-hidden="true">+</span>
            <h2>使用说明书</h2>
          </div>
          <p className="about-card-intro">把那些被收藏、却一直没有回看的链接，重新放回可以行动的日常。</p>
          <div className="about-steps">
            <div className="about-step">
              <span>01</span>
              <div><h3>挑一张卡带</h3><p>首页会从收藏库里随机挑出三张每日推荐卡带。</p></div>
            </div>
            <div className="about-step">
              <span>02</span>
              <div><h3>卡带趣味交互</h3><p>点击播放按钮，或把卡带拖进主机中央的插槽。</p></div>
            </div>
            <div className="about-step">
              <span>03</span>
              <div><h3>Ai收藏分析助手</h3><p>收藏库保存链接经过Ai智能化分析分门归类，并智能化分析你的收藏爱好。</p></div>
            </div>
            <div className="about-step">
              <span>04</span>
              <div><h3>每日推荐</h3><p>AI智能分析并推荐三个收藏链接至首页，点击随机按钮可再次随机刷新。</p></div>
            </div>
          </div>
        </article>

        <article className="about-person-card about-person-xiya">
          <PixelPortrait name="Xiya" hairClass="about-avatar-xiya" hairLabel="黑色长头发" />
          <div className="about-person-copy">
            <p className="about-person-role">产品概念与体验架构</p>
            <h2>Xiya</h2>
            <p>负责定义产品概念、PRD及功能框架，构建从“收藏沉淀”到“AI自我探索”的体验逻辑。设计收藏库机制与交互体系，让 AI 从内容整理升级为驱动个人成长的智能伙伴。</p>
          </div>
        </article>

        <article className="about-person-card about-person-fifi">
          <PixelPortrait name="Fifi" hairClass="about-avatar-fifi" hairLabel="红色头发" />
          <div className="about-person-copy">
            <p className="about-person-role">视觉设计与交互体验</p>
            <h2>Fifi</h2>
            <p>负责确立像素风视觉语言与整体交互体验，搭建具有复古游戏氛围的首页场景。设计游戏机核心玩法，让收藏内容从静态浏览变成可探索的趣味互动。</p>
          </div>
        </article>
      </section>

      <footer className="about-footer">
        <p>AI帮你重新发现想成为的自己。</p>
        <Link href="/">回到首页 <span aria-hidden="true">→</span></Link>
      </footer>
    </main>
  );
}

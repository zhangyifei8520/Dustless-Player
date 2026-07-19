"use client";

import { GameConsole } from "./GameConsole";

export function GamePrototype() {
  return (
    <main className="game-page">
      <GameConsole />
      <footer className="site-footer">
        <span><strong>不吃灰播放器</strong> Dustless Player</span>
        <span>© 2026 Version 1.0</span>
      </footer>
    </main>
  );
}

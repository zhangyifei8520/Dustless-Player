"use client";

import { useState, type DragEvent } from "react";
import type { Cartridge } from "../data/cartridges";

type CartridgeCardProps = {
  cartridge: Cartridge;
  active: boolean;
  disabled: boolean;
  onPlay: (cartridge: Cartridge) => void;
};

export function CartridgeCard({
  cartridge,
  active,
  disabled,
  onPlay,
}: CartridgeCardProps) {
  const [dragging, setDragging] = useState(false);

  const handleDragStart = (event: DragEvent<HTMLElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/cartridge-id", cartridge.id);
    setDragging(true);
  };

  return (
    <article
      className={`cartridge cartridge-${cartridge.color} ${dragging ? "is-dragging" : ""} ${active ? "is-active" : ""}`}
      data-testid={`cartridge-${cartridge.id}`}
      draggable={!disabled}
      onClick={() => {
        if (!disabled) onPlay(cartridge);
      }}
      onDragStart={handleDragStart}
      onDragEnd={() => setDragging(false)}
    >
      <header className="cartridge-head">
        <span className="cartridge-notch" aria-hidden="true" />
        <strong>{cartridge.code}</strong>
      </header>
      <div className="cartridge-label">
        <div className="cartridge-source">
          <span>{cartridge.icon}</span>
        </div>
        <h3>{cartridge.title}</h3>
        <p>{cartridge.summary}</p>
      </div>
      <button
        className="cartridge-play"
        type="button"
        data-testid={`play-${cartridge.id}`}
        aria-label={`播放 ${cartridge.title}`}
        disabled={disabled}
        onClick={(event) => {
          event.stopPropagation();
          onPlay(cartridge);
        }}
      >
        <span aria-hidden="true" />
        播放
      </button>
    </article>
  );
}

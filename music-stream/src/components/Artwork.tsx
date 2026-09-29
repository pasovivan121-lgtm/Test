"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

const PALETTES: [string, string, string][] = [
  ["#f43f5e", "#a855f7", "#fb7185"],
  ["#06b6d4", "#3b82f6", "#67e8f9"],
  ["#f59e0b", "#ef4444", "#fbbf24"],
  ["#10b981", "#14b8a6", "#6ee7b7"],
  ["#8b5cf6", "#6366f1", "#c4b5fd"],
  ["#ec4899", "#f97316", "#fda4af"],
  ["#0ea5e9", "#8b5cf6", "#a5f3fc"],
  ["#eab308", "#84cc16", "#fde047"],
  ["#f43f5e", "#fb923c", "#fda4af"],
  ["#22c55e", "#0ea5e9", "#86efac"],
];

function hashCode(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

interface ArtworkProps {
  id: string;
  alt?: string;
  className?: string;
  rounded?: string;
  variant?: "cover" | "artist" | "text";
  seed?: number;
}

export function Artwork({ id, alt = "", className, rounded = "rounded-xl", variant = "cover", seed }: ArtworkProps) {
  const { from, via, to, angle } = useMemo(() => {
    const h = hashCode(id);
    const p = PALETTES[h % PALETTES.length];
    return {
      from: p[0],
      via: p[1],
      to: p[2],
      angle: h % 360,
    };
  }, [id]);

  const initials = useMemo(() => {
    const words = id.replace(/[-_]/g, " ").split(" ").filter(Boolean);
    return words.slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
  }, [id]);

  if (variant === "text") {
    return (
      <div
        className={cn("flex items-center justify-center font-semibold text-white/90 select-none", rounded, className)}
        style={{
          background: `linear-gradient(${angle}deg, ${from}, ${via} 55%, ${to})`,
        }}
        aria-label={alt}
      >
        <span className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]">{initials}</span>
      </div>
    );
  }

  if (variant === "artist") {
    return (
      <div
        className={cn("relative overflow-hidden select-none", rounded, className)}
        style={{ background: `linear-gradient(${angle}deg, ${from}, ${via} 50%, ${to})` }}
        aria-label={alt}
      >
        <div className="absolute inset-0 opacity-60 [background:radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.55),transparent_55%)]" />
        <div className="absolute inset-0 opacity-40 [background:radial-gradient(circle_at_75%_80%,rgba(0,0,0,0.55),transparent_60%)]" />
        <div className="absolute inset-0 flex items-end justify-center pb-[8%]">
          <div className="flex items-end gap-[3%]">
            {[38, 68, 50, 84, 44].map((h, i) => (
              <div
                key={i}
                className="w-[9%] rounded-full bg-white/70"
                style={{ height: `${h}%`, minWidth: 4 }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const s = seed ?? 1;
  return (
    <div
      className={cn("relative overflow-hidden select-none", rounded, className)}
      style={{ background: `linear-gradient(${angle}deg, ${from}, ${via} 50%, ${to})` }}
      aria-label={alt}
    >
      <div className="absolute inset-0 opacity-50 [background:radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.5),transparent_50%)]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-[46%] w-[74%] items-end justify-center gap-[4%]">
          {[s * 30 % 70 + 30, s * 45 % 80 + 20, s * 60 % 60 + 40, s * 25 % 90 + 10, s * 55 % 75 + 25, s * 40 % 60 + 35].map(
            (h, i) => (
              <div
                key={i}
                className="flex-1 rounded-full bg-white/65"
                style={{ height: `${Math.min(100, h)}%` }}
              />
            )
          )}
        </div>
      </div>
      <div className="absolute inset-0 opacity-20 [background:linear-gradient(to_top,rgba(0,0,0,0.6),transparent_60%)]" />
    </div>
  );
}

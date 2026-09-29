"use client";

import { Play, Pause, Shuffle, Heart, Check, MoreHorizontal, Plus, Share2, Download } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Track } from "@/types";
import { Artwork } from "@/components/Artwork";
import { usePlayerStore } from "@/store/player";
import { useLibraryStore } from "@/store/library";
import { useUIStore } from "@/store/ui";
import toast from "react-hot-toast";

interface DetailHeaderProps {
  kind: "album" | "playlist" | "artist" | "show" | "genre" | "episode";
  id: string;
  title: string;
  description?: string;
  meta?: React.ReactNode;
  imageVariant?: "cover" | "artist" | "text";
  rounded?: string;
  seed?: number;
  tracks: Track[];
  source: "playlist" | "album" | "artist" | "radio";
  sourceId?: string;
  metaLine?: string;
  badges?: string[];
  gradientFrom?: string;
  gradientTo?: string;
  stats?: { label: string; value: string }[];
  actions?: React.ReactNode;
  onShuffle?: () => void;
}

export function DetailHeader({
  kind,
  id,
  title,
  description,
  meta,
  imageVariant = "cover",
  rounded = "rounded-2xl",
  seed: seedProp,
  tracks,
  source,
  sourceId,
  metaLine,
  badges = [],
  gradientFrom = "#7c5cff",
  gradientTo = "#06b6d4",
  stats = [],
  actions,
  onShuffle,
}: DetailHeaderProps) {
  const { currentTrack, isPlaying, playTrack, shuffle, toggleShuffle } = usePlayerStore();
  const likedTracks = useLibraryStore((s) => s.likedTracks);
  const toggleLikeTrack = useLibraryStore((s) => s.toggleLikeTrack);
  const openAddToPlaylist = useUIStore((s) => s.openAddToPlaylist);
  const [expanded, setExpanded] = useState(false);

  const isCollection = kind === "album" || kind === "playlist";
  const first = tracks[0];
  const isCurrent = first ? currentTrack?.id === first.id : false;
  const isActive = isCurrent && isPlaying;

  const play = () => {
    if (isCurrent) usePlayerStore.getState().togglePlay();
    else if (first) playTrack(first, tracks, source, sourceId ?? id);
  };

  const allLiked =
    tracks.length > 0 && tracks.every((t) => likedTracks.some((l) => l.id === t.id));

  return (
    <header
      className="relative"
      style={{
        background: `linear-gradient(160deg, ${gradientFrom}22 0%, ${gradientTo}18 38%, transparent 78%)`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background: `radial-gradient(1000px 420px at 12% 0%, ${gradientFrom}33, transparent 62%)`,
        }}
      />
      <div className="relative px-4 pb-6 pt-2 sm:px-6 sm:pb-8 md:pt-4">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-end sm:gap-7 sm:text-left">
          <div className="shrink-0">
            <Artwork
              id={id}
              alt={title}
              variant={imageVariant}
              rounded={cn(
                rounded,
                imageVariant === "artist" && "rounded-full",
                imageVariant === "text" && "rounded-xl"
              )}
              className={cn(
                "w-[150px] shadow-[0_24px_64px_rgba(0,0,0,0.6)] sm:w-[190px] lg:w-[212px]",
                imageVariant === "artist" && "w-[140px] sm:w-[176px] lg:w-[196px]"
              )}
              seed={seedProp ?? title.length}
            />
          </div>

          <div className="flex min-w-0 flex-1 flex-col items-center gap-3 sm:items-start">
            <div className="flex items-center gap-2">
              <span
                className="rounded-md border border-white/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white/80"
              >
                {kind}
              </span>
              {kind === "artist" && <Check className="h-4 w-4 rounded-full bg-accent p-0.5 text-white" strokeWidth={4} />}
              {badges.map((b) => (
                <span key={b} className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/70">
                  {b}
                </span>
              ))}
            </div>

            <h1 className="text-gradient break-words text-[28px] font-black leading-[1.08] tracking-tight sm:text-[40px] lg:text-[48px]">
              {title}
            </h1>

            {description && (
              <p
                className={cn(
                  "max-w-2xl whitespace-pre-line text-[13px] leading-relaxed text-white/55 sm:text-[13.5px]",
                  !expanded && "line-clamp-2"
                )}
              >
                {description}
              </p>
            )}
            {description && description.length > 180 && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="-mt-1 text-[11.5px] font-semibold text-white/50 transition hover:text-white"
              >
                {expanded ? "Show less" : "Show more"}
              </button>
            )}

            {metaLine && <p className="text-[12.5px] font-medium text-white/70">{metaLine}</p>}
            {meta}

            {stats.length > 0 && (
              <div className="mt-1 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 sm:justify-start">
                {stats.map((s) => (
                  <div key={s.label} className="text-center sm:text-left">
                    <div className="text-[15px] font-bold text-white">{s.value}</div>
                    <div className="text-[10.5px] text-white/40">{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action bar */}
        <div className="mt-7 flex items-center gap-3">
          {isCollection && tracks.length > 0 && (
            <button
              onClick={play}
              className="group grid h-14 w-14 shrink-0 place-items-center rounded-full bg-emerald-500 text-black shadow-[0_12px_34px_rgba(16,185,129,0.35)] transition hover:scale-105 active:scale-95"
              aria-label={isActive ? "Pause" : "Play"}
            >
              {isActive ? (
                <Pause className="h-6 w-6 fill-black" />
              ) : (
                <Play className="ml-0.5 h-6 w-6 fill-black" />
              )}
            </button>
          )}

          {isCollection && tracks.length > 0 && (
            <button
              onClick={onShuffle ?? toggleShuffle}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-white/70 transition hover:border-white/50 hover:text-white"
              aria-label="Shuffle"
              title={shuffle ? "Shuffle on" : "Shuffle"}
            >
              <Shuffle className={cn("h-4 w-4", shuffle && "text-emerald-400")} />
            </button>
          )}

          {isCollection && (
            <button
              onClick={() => {
                if (allLiked) {
                  tracks.forEach((t) => {
                    if (likedTracks.some((l) => l.id === t.id)) toggleLikeTrack(t);
                  });
                  toast("Removed all from Liked Songs");
                } else {
                  tracks.forEach((t) => {
                    if (!likedTracks.some((l) => l.id === t.id)) toggleLikeTrack(t);
                  });
                  toast.success("Added to Liked Songs");
                }
              }}
              className={cn(
                "grid h-10 w-10 place-items-center rounded-full border transition",
                allLiked
                  ? "border-emerald-400/50 text-emerald-400"
                  : "border-white/20 text-white/70 hover:border-white/50 hover:text-white"
              )}
              aria-label="Save"
            >
              <Heart className={cn("h-4 w-4", allLiked && "fill-emerald-400")} />
            </button>
          )}

          {isCollection && (
            <button
              onClick={() => openAddToPlaylist(tracks)}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-white/70 transition hover:border-white/50 hover:text-white"
              aria-label="Add to playlist"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}

          {kind === "artist" && actions}

          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={() => toast.success("Downloaded for offline listening", { icon: <Download className="h-3.5 w-3.5" /> })}
              className="grid h-9 w-9 place-items-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white"
              aria-label="Download"
              title="Download"
            >
              <Download className="h-[18px] w-[18px]" />
            </button>
            <button
              onClick={() => toast.success("Link copied to clipboard")}
              className="grid h-9 w-9 place-items-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white"
              aria-label="Share"
              title="Share"
            >
              <Share2 className="h-[18px] w-[18px]" />
            </button>
            <button
              onClick={() => toast.success("Saved to your library")}
              className="grid h-9 w-9 place-items-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white"
              aria-label="More"
            >
              <MoreHorizontal className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

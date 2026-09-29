"use client";

import Link from "next/link";
import { Play, Pause, MoreHorizontal, Heart, Plus } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { cn, formatDuration, formatCount } from "@/lib/utils";
import type { Track } from "@/types";
import { Artwork } from "@/components/Artwork";
import { usePlayerStore } from "@/store/player";
import { useLibraryStore } from "@/store/library";
import { useUIStore } from "@/store/ui";
import { PlayingIndicator } from "@/components/player/PlayerBar";

interface TrackRowProps {
  track: Track;
  index?: number;
  queue?: Track[];
  source?: "playlist" | "album" | "artist" | "search" | "radio" | "queue";
  sourceId?: string;
  showAlbum?: boolean;
  showArtwork?: boolean;
  showIndex?: boolean;
  showPlays?: boolean;
  variant?: "default" | "compact";
}

const menuItem =
  "flex w-full items-center rounded-lg px-3 py-2 text-left text-[12.5px] text-white/80 transition hover:bg-white/10 hover:text-white";

export function TrackRow({
  track,
  index,
  queue,
  source = "playlist",
  sourceId = "",
  showAlbum = true,
  showArtwork = true,
  showIndex = true,
  showPlays = false,
  variant = "default",
}: TrackRowProps) {
  const { currentTrack, isPlaying, playTrack, addToQueue, insertNext, removeFromQueue, playQueueItem, queue: currentQueue } =
    usePlayerStore();
  const likedTracks = useLibraryStore((s) => s.likedTracks);
  const toggleLikeTrack = useLibraryStore((s) => s.toggleLikeTrack);
  const openAddToPlaylist = useUIStore((s) => s.openAddToPlaylist);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const goToQueue = (idx: number) => {
    if (idx >= 0) playQueueItem(idx);
  };

  const isCurrent = currentTrack?.id === track.id;
  const isPlayingThis = isCurrent && isPlaying;
  const liked = likedTracks.some((t) => t.id === track.id);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [menuOpen]);

  const handlePlay = () => {
    if (isCurrent) {
      usePlayerStore.getState().togglePlay();
    } else {
      playTrack(track, queue, source, sourceId);
    }
  };

  const isInQueue = currentQueue.some((q) => q.track.id === track.id);

  return (
    <div
      onDoubleClick={handlePlay}
      className={cn(
        "group grid items-center gap-3 rounded-lg px-2 transition-colors",
        variant === "compact" ? "h-12" : "h-[58px]",
        showArtwork ? "grid-cols-[auto_minmax(0,1fr)_auto]" : "grid-cols-[auto_minmax(0,1fr)_auto]",
        isCurrent ? "bg-white/[0.07]" : "hover:bg-white/[0.045]"
      )}
    >
      {/* Index / artwork / play */}
      <div className="flex h-full w-10 shrink-0 items-center justify-center">
        {showArtwork ? (
          <div className="relative h-10 w-10">
            <Artwork id={track.id} rounded="rounded" className="h-10 w-10" seed={track.title.length} alt={track.title} />
            <button
              onClick={handlePlay}
              className="absolute inset-0 grid place-items-center rounded bg-black/45 opacity-0 transition group-hover:opacity-100"
              aria-label={isPlayingThis ? "Pause" : "Play"}
            >
              {isPlayingThis ? (
                <PlayingIndicator />
              ) : (
                <Play className="h-4 w-4 fill-white text-white" />
              )}
            </button>
            {isPlayingThis && (
              <div className="absolute inset-0 grid place-items-center rounded bg-black/45 opacity-0 transition group-hover:opacity-100">
                <PlayingIndicator />
              </div>
            )}
          </div>
        ) : showIndex ? (
          <div className="w-6 text-center">
            {isCurrent ? (
              <PlayingIndicator />
            ) : (
              <>
                <span
                  className={cn(
                    "text-[13px] tabular-nums transition group-hover:hidden",
                    isCurrent ? "text-white" : "text-white/35"
                  )}
                >
                  {index !== undefined ? index + 1 : "\u2022"}
                </span>
                <button
                  onClick={handlePlay}
                  className="hidden justify-center group-hover:flex"
                  aria-label="Play"
                >
                  {isPlayingThis ? (
                    <Pause className="h-3.5 w-3.5 fill-white text-white" />
                  ) : (
                    <Play className="h-3.5 w-3.5 fill-white text-white" />
                  )}
                </button>
              </>
            )}
          </div>
        ) : null}
      </div>

      {/* Title / artist / album */}
      <div className="min-w-0">
        <div
          className={cn(
            "truncate text-[13.5px] font-medium",
            isCurrent ? "text-emerald-400" : "text-white/90"
          )}
        >
          {track.title}
        </div>
        <div className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-white/45">
          {track.explicit && (
            <span className="grid h-[13px] w-[13px] shrink-0 place-items-center rounded-[3px] bg-white/15 text-[8px] font-bold leading-none text-white/70">
              E
            </span>
          )}
          <Link
            href={`/artist/${track.artist.id}`}
            className="truncate hover:text-white/80 hover:underline"
          >
            {track.artist.name}
          </Link>
          {showAlbum && (
            <>
              <span className="text-white/20">·</span>
              <Link
                href={`/album/${track.album.id}`}
                className="hidden truncate hover:text-white/80 hover:underline sm:inline"
              >
                {track.album.title}
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Right meta */}
      <div className="flex items-center gap-1 pr-1 sm:gap-2">
        <button
          onClick={() => {
            toggleLikeTrack(track);
            toast.success(liked ? "Removed from Liked Songs" : "Added to Liked Songs");
          }}
          className="hidden h-7 w-7 place-items-center rounded-full transition hover:bg-white/10 sm:grid"
          aria-label={liked ? "Unlike" : "Like"}
        >
          <Heart
            className={cn(
              "h-[15px] w-[15px] transition",
              liked ? "fill-emerald-400 text-emerald-400" : "text-white/40 opacity-0 group-hover:opacity-100"
            )}
          />
        </button>
        {showPlays && (
          <span className="hidden w-12 text-right text-[11.5px] tabular-nums text-white/35 lg:block">
            {formatCount(track.playCount)}
          </span>
        )}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="grid h-7 w-7 place-items-center rounded-full text-white/40 opacity-0 transition hover:bg-white/10 hover:text-white group-hover:opacity-100"
            aria-label="More options"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          {menuOpen && (
            <div className="glass absolute right-0 top-8 z-40 w-56 rounded-xl border border-white/10 p-1.5 shadow-2xl">
              <button
                onClick={() => {
                  addToQueue(track, "queue", "manual");
                  setMenuOpen(false);
                  toast.success("Added to queue");
                }}
                className={menuItem}
              >
                Add to queue
              </button>
              <button
                onClick={() => {
                  insertNext(track);
                  setMenuOpen(false);
                  toast.success("Playing next");
                }}
                className={menuItem}
              >
                Play next
              </button>
              <button
                onClick={() => {
                  openAddToPlaylist(track);
                  setMenuOpen(false);
                }}
                className={menuItem}
              >
                Add to playlist
              </button>
              <button
                onClick={() => {
                  if (isInQueue) {
                    removeFromQueue(currentQueue.findIndex((q) => q.track.id === track.id));
                    toast.success("Removed from queue");
                  } else {
                    addToQueue(track, "queue", "manual");
                    toast.success("Added to queue");
                  }
                  setMenuOpen(false);
                }}
                className={menuItem}
              >
                {isInQueue ? "Remove from queue" : "Add to queue"}
              </button>
              <button
                onClick={() => {
                  goToQueue(currentQueue.findIndex((q) => q.track.id === track.id));
                  setMenuOpen(false);
                }}
                className={menuItem}
              >
                Go to queue
              </button>
              <div className="my-1 h-px bg-white/10" />
              <button
                onClick={() => {
                  setMenuOpen(false);
                  toast.success("Share link copied", { icon: <Plus className="h-3.5 w-3.5" /> });
                }}
                className={menuItem}
              >
                Copy link
              </button>
            </div>
          )}
        </div>
        <span className="w-9 text-right text-[11.5px] tabular-nums text-white/40">
          {formatDuration(track.duration)}
        </span>
      </div>
    </div>
  );
}

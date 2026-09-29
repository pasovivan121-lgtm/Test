"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Heart, MoreHorizontal, ExternalLink, Loader2, WifiOff } from "lucide-react";
import toast from "react-hot-toast";
import { cn, formatDuration, formatCount } from "@/lib/utils";
import type { AudiusMappedTrack } from "@/lib/audius";
import { toPlayerTrack } from "@/store/external";
import { usePlayerStore } from "@/store/player";
import { useLibraryStore } from "@/store/library";
import { useUIStore } from "@/store/ui";
import { Artwork } from "@/components/Artwork";
import { PlayingIndicator } from "@/components/player/PlayerBar";

function Cover({ track, className, rounded = "rounded" }: { track: AudiusMappedTrack; className: string; rounded?: string }) {
  const [failed, setFailed] = useState(false);
  if (!track.artwork || failed) {
    return (
      <Artwork
        id={track.id}
        rounded={rounded}
        className={className}
        seed={track.title.length}
        alt={track.title}
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={track.artwork}
      alt={track.title}
      onError={() => setFailed(true)}
      className={cn("object-cover", rounded, className)}
      loading="lazy"
    />
  );
}

export function AudiusRow({
  track,
  queue,
}: {
  track: AudiusMappedTrack;
  queue: AudiusMappedTrack[];
  index?: number;
}) {
  const { currentTrack, isPlaying, playTrack, addToQueue } = usePlayerStore();
  const likedTracks = useLibraryStore((s) => s.likedTracks);
  const toggleLikeTrack = useLibraryStore((s) => s.toggleLikeTrack);
  const openAddToPlaylist = useUIStore((s) => s.openAddToPlaylist);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const playerTrack = toPlayerTrack(track);
  const isCurrent = currentTrack?.id === playerTrack.id;
  const isActive = isCurrent && isPlaying;
  const liked = likedTracks.some((t) => t.id === playerTrack.id);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [menuOpen]);

  const play = () => {
    if (isCurrent) usePlayerStore.getState().togglePlay();
    else playTrack(playerTrack, queue.map(toPlayerTrack), "radio", `audius-${track.id}`);
  };

  const itemClass = "flex w-full items-center rounded-lg px-3 py-2 text-left text-[12.5px] text-white/80 transition hover:bg-white/10 hover:text-white";

  return (
    <div
      onDoubleClick={play}
      className={cn(
        "group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg px-2 transition-colors",
        isCurrent ? "bg-white/[0.07]" : "hover:bg-white/[0.045]"
      )}
    >
      <div className="relative h-10 w-10 shrink-0">
        <Cover track={track} className="h-10 w-10" />
        <button
          onClick={play}
          className="absolute inset-0 grid place-items-center rounded bg-black/45 opacity-0 transition group-hover:opacity-100"
          aria-label={isActive ? "Pause" : "Play"}
        >
          {isActive ? <PlayingIndicator /> : <Play className="h-4 w-4 fill-white text-white" />}
        </button>
      </div>

      <div className="min-w-0">
        <div className={cn("truncate text-[13.5px] font-medium", isCurrent ? "text-emerald-400" : "text-white/90")}>
          {track.title}
        </div>
        <div className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-white/45">
          <span className="truncate">{track.artistName}</span>
          {track.genre && (
            <>
              <span className="text-white/20">·</span>
              <span className="hidden sm:inline">{track.genre}</span>
            </>
          )}
          {track.bpm ? (
            <>
              <span className="text-white/20">·</span>
              <span className="hidden tabular-nums md:inline">{track.bpm} BPM</span>
            </>
          ) : null}
          {!track.isStreamable && (
            <span className="flex items-center gap-1 text-amber-400/80">
              <WifiOff className="h-3 w-3" /> unavailable
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => {
            toggleLikeTrack(playerTrack);
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
                  addToQueue(playerTrack, "queue", "audius");
                  setMenuOpen(false);
                  toast.success("Added to queue");
                }}
                className={itemClass}
              >
                Add to queue
              </button>
              <button
                onClick={() => {
                  openAddToPlaylist(playerTrack);
                  setMenuOpen(false);
                }}
                className={itemClass}
              >
                Add to playlist
              </button>
              <a
                href={track.permalink}
                target="_blank"
                rel="noreferrer noopener"
                className={cn(itemClass, "gap-2")}
              >
                <ExternalLink className="h-3.5 w-3.5" /> Open on Audius
              </a>
              <div className="my-1 h-px bg-white/10" />
              <p className="px-3 py-1.5 text-[10.5px] leading-relaxed text-white/30">
                {track.license}
                {track.copyrightLine ? ` · ${track.copyrightLine}` : ""}
              </p>
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

export function AudiusCard({
  track,
  queue,
}: {
  track: AudiusMappedTrack;
  queue: AudiusMappedTrack[];
}) {
  const { currentTrack, isPlaying, playTrack } = usePlayerStore();
  const [hover, setHover] = useState(false);
  const isCurrent = currentTrack?.id === `audius-${track.id}`;
  const isActive = isCurrent && isPlaying;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group relative"
    >
      <div className="relative">
        <Cover track={track} className="aspect-square w-full shadow-[0_10px_30px_rgba(0,0,0,0.45)]" rounded="rounded-xl" />
        <button
          onClick={() => {
            if (isCurrent) usePlayerStore.getState().togglePlay();
            else playTrack(toPlayerTrack(track), queue.map(toPlayerTrack), "radio", track.id);
          }}
          className={cn(
            "absolute bottom-2 right-2 grid h-11 w-11 place-items-center rounded-full bg-accent text-white shadow-[0_10px_28px_rgba(0,0,0,0.6)] transition-all duration-300 hover:scale-105",
            hover || isActive ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          )}
          aria-label={isActive ? "Pause" : "Play"}
        >
          {isActive ? <PlayingIndicator /> : <Play className="ml-0.5 h-[18px] w-[18px] fill-white" />}
        </button>
      </div>
      <div className="mt-2.5 px-0.5">
        <div className="truncate text-[13px] font-semibold text-white/90">{track.title}</div>
        <div className="truncate text-[11.5px] text-white/45">{track.artistName}</div>
      </div>
    </div>
  );
}

export function AudiusSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <div className="shimmer aspect-square w-full rounded-xl" />
          <div className="shimmer mt-2.5 h-3 w-3/4 rounded" />
          <div className="shimmer mt-1.5 h-2.5 w-1/2 rounded" />
        </div>
      ))}
    </div>
  );
}

export function AudiusStatus({
  loading,
  error,
  count,
  label,
}: {
  loading: boolean;
  error: string | null;
  count: number;
  label: string;
}) {
  if (loading) {
    return (
      <span className="flex items-center gap-1.5 text-[12px] text-white/45">
        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading {label}…
      </span>
    );
  }
  if (error) {
    return (
      <span className="flex items-center gap-1.5 text-[12px] text-rose-400">
        <WifiOff className="h-3.5 w-3.5" /> {error}
      </span>
    );
  }
  return (
    <span className="text-[12px] text-white/45">
      {formatCount(count)} {label}
    </span>
  );
}

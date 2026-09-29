"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  X,
  ChevronDown,
  Heart,
  ListMusic,
  MoreHorizontal,
  Share2,
  Plus,
  Mic2,
  Check,
  Volume2,
  Shuffle,
  Repeat,
  Repeat1,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Rewind,
  FastForward,
} from "lucide-react";
import { cn, formatDuration } from "@/lib/utils";
import type { SyncedLyric } from "@/types";
import { usePlayerStore } from "@/store/player";
import { useUIStore } from "@/store/ui";
import { useLibraryStore } from "@/store/library";
import { Artwork } from "@/components/Artwork";
import toast from "react-hot-toast";

export function NowPlayingView() {
  const open = useUIStore((s) => s.nowPlayingOpen);
  const setOpen = useUIStore((s) => s.setNowPlayingOpen);
  const setQueueOpen = useUIStore((s) => s.setQueueOpen);
  const openAddToPlaylist = useUIStore((s) => s.openAddToPlaylist);
  const lyricsOpen = useUIStore((s) => s.lyricsOpen);
  const setLyricsOpen = useUIStore((s) => s.setLyricsOpen);
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    playNext,
    playPrevious,
    currentTime,
    duration,
    volume,
    muted,
    setVolume,
    toggleMute,
    shuffle,
    toggleShuffle,
    repeatMode,
    cycleRepeat,
    seek,
  } = usePlayerStore();
  const likedTracks = useLibraryStore((s) => s.likedTracks);
  const toggleLikeTrack = useLibraryStore((s) => s.toggleLikeTrack);
  const [view, setView] = useState<"art" | "lyrics">("art");
  const [wasOpen, setWasOpen] = useState(open);
  const seekRef = useRef<HTMLDivElement>(null);

  const liked = currentTrack ? likedTracks.some((t) => t.id === currentTrack.id) : false;
  const total = duration || currentTrack?.duration || 0;
  const progress = total > 0 ? (currentTime / total) * 100 : 0;

  if (open !== wasOpen) {
    setWasOpen(open);
    if (!open) setView("art");
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") setOpen(false);
      if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen, togglePlay]);

  if (!open || !currentTrack) return null;

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!seekRef.current || !total) return;
    const rect = seekRef.current.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    seek(Math.max(0, Math.min(1, ratio)) * total);
  };

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto"
      style={{
        background: `linear-gradient(160deg, #1a1030 0%, #0b0d14 45%, #06070a 100%)`,
      }}
    >
      <div
        className="pointer-events-none fixed inset-0 opacity-80"
        style={{
          background: `radial-gradient(900px 600px at 50% -10%, rgba(124,92,255,0.35), transparent 60%)`,
        }}
      />

      <div className="relative mx-auto flex min-h-dvh w-full max-w-[1200px] flex-col px-5 py-5 sm:px-8">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-full bg-black/30 px-3.5 py-2 text-[12px] font-semibold text-white/80 transition hover:bg-black/50 hover:text-white"
          >
            <ChevronDown className="h-4 w-4" /> Close
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                if (!lyricsOpen) setLyricsOpen(true);
                setView("lyrics");
              }}
              className={cn(
                "grid h-9 w-9 place-items-center rounded-full transition",
                view === "lyrics" || lyricsOpen ? "bg-white text-black" : "text-white/50 hover:bg-white/10 hover:text-white"
              )}
              aria-label="Lyrics"
            >
              <Mic2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => toast.success("Link copied to clipboard")}
              className="grid h-9 w-9 place-items-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white"
              aria-label="Share"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => openAddToPlaylist(currentTrack)}
              className="grid h-9 w-9 place-items-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white"
              aria-label="Add to playlist"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                toggleLikeTrack(currentTrack);
                toast.success(liked ? "Removed from Liked Songs" : "Added to Liked Songs");
              }}
              className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-white/10"
              aria-label="Like"
            >
              <Heart className={cn("h-4 w-4", liked ? "fill-emerald-400 text-emerald-400" : "text-white/50")} />
            </button>
            <button
              onClick={() => setQueueOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white"
              aria-label="Queue"
            >
              <ListMusic className="h-4 w-4" />
            </button>
            <button
              onClick={() => setOpen(false)}
              className="grid h-9 w-9 place-items-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-14">
          {/* Artwork */}
          <div className="mx-auto w-full max-w-[380px] lg:max-w-none">
            <div className="relative aspect-square w-full">
              <div
                className="absolute -inset-8 rounded-full opacity-60 blur-3xl"
                style={{ background: "radial-gradient(circle, rgba(124,92,255,0.5), transparent 68%)" }}
              />
              <Artwork
                id={currentTrack.album.id}
                alt={currentTrack.album.title}
                rounded="rounded-3xl"
                className="relative h-full w-full shadow-[0_40px_100px_rgba(0,0,0,0.7)]"
                seed={currentTrack.title.length}
              />
            </div>
          </div>

          {/* Lyrics / info */}
          <div className="flex min-h-0 flex-col">
            <div className="mb-5">
              <div className="mb-1.5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">
                Playing from album
                <Check className="h-3 w-3" />
              </div>
              <Link
                href={`/album/${currentTrack.album.id}`}
                onClick={() => setOpen(false)}
                className="block truncate text-[13px] font-medium text-white/60 transition hover:text-white hover:underline"
              >
                {currentTrack.album.title}
              </Link>
              <h1 className="mt-3 text-gradient text-[30px] font-black leading-[1.1] tracking-tight sm:text-[44px]">
                {currentTrack.title}
              </h1>
              <div className="mt-3 flex items-center gap-3">
                <Link
                  href={`/artist/${currentTrack.artist.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 transition hover:opacity-80"
                >
                  <Artwork
                    id={currentTrack.artist.id}
                    variant="artist"
                    rounded="rounded-full"
                    className="h-8 w-8"
                  />
                  <span className="text-[15px] font-semibold text-white">{currentTrack.artist.name}</span>
                </Link>
              </div>
            </div>

            {view === "lyrics" && (
              <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]">
                <LyricsView
                  lines={currentTrack.lyrics?.synced ?? []}
                  currentTime={currentTime}
                  onSeek={seek}
                />
              </div>
            )}
          </div>
        </div>

        {/* Transport */}
        <div className="sticky bottom-0 -mx-5 border-t border-white/[0.07] bg-[#06070a]/85 px-5 pb-6 pt-4 backdrop-blur-xl sm:-mx-8 sm:px-8">
          <div
            ref={view === "art" ? seekRef : undefined}
            onClick={handleSeek}
            role="slider"
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={currentTime}
            tabIndex={0}
            className="group relative mb-4 h-4 cursor-pointer"
          >
            <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-white/20">
              <div className="h-full rounded-full bg-gradient-to-r from-accent to-cyan-300 transition-[width] duration-150" style={{ width: `${progress}%` }} />
            </div>
            <div
              className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 shadow-lg transition group-hover:opacity-100"
              style={{ left: `${progress}%` }}
            />
          </div>
          <div className="-mt-3 mb-4 flex justify-between text-[11px] tabular-nums text-white/40">
            <span>{formatDuration(currentTime)}</span>
            <span>-{formatDuration(Math.max(0, total - currentTime))}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                onClick={toggleShuffle}
                className={cn("grid h-10 w-10 place-items-center rounded-full transition", shuffle ? "text-accent-soft" : "text-white/50 hover:text-white")}
                aria-label="Shuffle"
              >
                <Shuffle className="h-[18px] w-[18px]" />
              </button>
              <button
                onClick={toggleMute}
                className="grid h-10 w-10 place-items-center rounded-full text-white/50 transition hover:text-white"
                aria-label="Mute"
              >
                <Volume2 className="h-[18px] w-[18px]" />
              </button>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => seek(Math.max(0, currentTime - 10))}
                className="hidden h-10 w-10 place-items-center rounded-full text-white/50 transition hover:text-white sm:grid"
                aria-label="Back 10 seconds"
              >
                <Rewind className="h-[18px] w-[18px]" />
              </button>
              <button
                onClick={playPrevious}
                className="grid h-11 w-11 place-items-center rounded-full text-white/80 transition hover:text-white"
                aria-label="Previous"
              >
                <SkipBack className="h-6 w-6 fill-current" />
              </button>
              <button
                onClick={togglePlay}
                className="grid h-16 w-16 place-items-center rounded-full bg-white text-black shadow-[0_14px_40px_rgba(0,0,0,0.5)] transition hover:scale-105 active:scale-95"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="h-7 w-7 fill-black" />
                ) : (
                  <Play className="ml-1 h-7 w-7 fill-black" />
                )}
              </button>
              <button
                onClick={playNext}
                className="grid h-11 w-11 place-items-center rounded-full text-white/80 transition hover:text-white"
                aria-label="Next"
              >
                <SkipForward className="h-6 w-6 fill-current" />
              </button>
              <button
                onClick={() => seek(Math.min(total, currentTime + 10))}
                className="hidden h-10 w-10 place-items-center rounded-full text-white/50 transition hover:text-white sm:grid"
                aria-label="Forward 10 seconds"
              >
                <FastForward className="h-[18px] w-[18px]" />
              </button>
            </div>

            <div className="flex items-center gap-1">
              <div className="hidden w-24 items-center gap-2 sm:flex">
                <button
                  onClick={toggleMute}
                  className="grid h-10 w-10 place-items-center rounded-full text-white/50 transition hover:text-white"
                  aria-label="Mute"
                >
                  <Volume2 className="h-[18px] w-[18px]" />
                </button>
                <input
                  type="range"
                  className="rs"
                  min={0}
                  max={1}
                  step={0.01}
                  value={muted ? 0 : volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  aria-label="Volume"
                  style={{ ["--fill" as string]: `${(muted ? 0 : volume) * 100}%` }}
                />
              </div>
              <button
                onClick={cycleRepeat}
                className={cn("grid h-10 w-10 place-items-center rounded-full transition", repeatMode !== "off" ? "text-accent-soft" : "text-white/50 hover:text-white")}
                aria-label="Repeat"
              >
                {repeatMode === "track" ? <Repeat1 className="h-[18px] w-[18px]" /> : <Repeat className="h-[18px] w-[18px]" />}
              </button>
              <button
                onClick={() => {
                  setView((v) => (v === "art" ? "lyrics" : "art"));
                  if (view === "art") setLyricsOpen(true);
                }}
                className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-white/10"
                aria-label="Toggle lyrics"
              >
                <Mic2 className={cn("h-[18px] w-[18px]", view === "lyrics" ? "text-emerald-400" : "text-white/50")} />
              </button>
              <button
                onClick={() => setQueueOpen(true)}
                className="grid h-10 w-10 place-items-center rounded-full text-white/50 transition hover:text-white"
                aria-label="Queue"
              >
                <ListMusic className="h-[18px] w-[18px]" />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full text-white/50 transition hover:text-white"
                aria-label="More"
              >
                <MoreHorizontal className="h-[18px] w-[18px]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LyricsView({
  lines,
  currentTime,
  onSeek,
}: {
  lines: SyncedLyric[];
  currentTime: number;
  onSeek: (time: number) => void;
}) {
  if (lines.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
        <Mic2 className="h-8 w-8 text-white/20" />
        <p className="text-[14px] text-white/50">Lyrics aren&apos;t available for this track</p>
        <p className="max-w-xs text-[12px] text-white/30">
          We&apos;ve requested them from the label. Check back soon.
        </p>
      </div>
    );
  }
  return (
    <div className="h-full overflow-y-auto no-scrollbar px-6 py-10">
      <div className="mx-auto max-w-2xl space-y-1">
        {lines.map((line, i) => {
          const next = lines[i + 1]?.time ?? Infinity;
          const active = currentTime >= line.time && next > currentTime;
          return (
            <button
              key={i}
              onClick={() => onSeek(line.time)}
              className={cn(
                "block w-full rounded-lg px-3 py-1.5 text-left text-[17px] font-bold leading-snug transition-all duration-300 sm:text-[20px]",
                active ? "text-white" : "text-white/25 hover:text-white/60"
              )}
            >
              {line.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}

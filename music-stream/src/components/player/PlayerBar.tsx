"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  Volume1,
  VolumeX,
  ListMusic,
  Maximize2,
  Mic2,
  MonitorSpeaker,
  Laptop2,
  Smartphone,
  Tablet,
  Tv,
  Car,
  Gamepad2,
  Watch,
  AudioLines,
  MoreHorizontal,
  Loader2,
  ChevronUp,
} from "lucide-react";
import { cn, formatDuration } from "@/lib/utils";
import { usePlayerStore } from "@/store/player";
import { useUIStore } from "@/store/ui";
import { useLibraryStore } from "@/store/library";
import { Artwork } from "@/components/Artwork";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";

const DEVICES = [
  { id: "d-1", name: "This Browser", type: "computer" as const, icon: Laptop2, active: true, volume: 100 },
  { id: "d-2", name: "MacBook Pro", type: "computer" as const, icon: Laptop2, active: false, volume: 64 },
  { id: "d-3", name: "iPhone 17 Pro", type: "smartphone" as const, icon: Smartphone, active: false, volume: 40 },
  { id: "d-4", name: "iPad Air", type: "tablet" as const, icon: Tablet, active: false, volume: 55 },
  { id: "d-5", name: "Living Room", type: "speaker" as const, icon: MonitorSpeaker, active: false, volume: 72 },
  { id: "d-6", name: "Bedroom TV", type: "tv" as const, icon: Tv, active: false, volume: 30 },
  { id: "d-7", name: "Car — Bluetooth", type: "car" as const, icon: Car, active: false, volume: 48 },
  { id: "d-8", name: "PlayStation", type: "gaming_console" as const, icon: Gamepad2, active: false, volume: 25 },
  { id: "d-9", name: "Apple Watch", type: "wearable" as const, icon: Watch, active: false, volume: null },
];

function PlayingIndicator() {
  return (
    <span className="eqbar h-3.5 w-4 text-emerald-400">
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}

export function PlayerBar() {
  const {
    currentTrack,
    isPlaying,
    isBuffering,
    currentTime,
    duration,
    volume,
    muted,
    shuffle,
    repeatMode,
    togglePlay,
    playNext,
    playPrevious,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
  } = usePlayerStore();
  const { setQueueOpen, setNowPlayingOpen, setLyricsOpen, lyricsOpen, setUpgradeOpen } = useUIStore();
  const likedTracks = useLibraryStore((s) => s.likedTracks);
  const toggleLikeTrack = useLibraryStore((s) => s.toggleLikeTrack);
  const [expanded, setExpanded] = useState(false);
  const [devicesOpen, setDevicesOpen] = useState(false);
  const [qualityOpen, setQualityOpen] = useState(false);
  const seekRef = useRef<HTMLDivElement>(null);
  const scrubbing = useRef(false);

  const liked = currentTrack ? likedTracks.some((t) => t.id === currentTrack.id) : false;
  const total = duration || currentTrack?.duration || 0;
  const progress = total > 0 ? (currentTime / total) * 100 : 0;

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!seekRef.current || !total) return;
      const rect = seekRef.current.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      seek(Math.max(0, Math.min(1, ratio)) * total);
    },
    [seek, total]
  );

  const onDown = (e: React.MouseEvent<HTMLDivElement>) => {
    scrubbing.current = true;
    handleSeek(e);
  };
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (scrubbing.current) handleSeek(e);
  };
  const onUp = () => {
    scrubbing.current = false;
  };

  const VolumeIcon = muted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  if (!currentTrack) {
    return (
      <div className="glass fixed inset-x-0 bottom-0 z-40 hidden h-[76px] items-center justify-center border-t border-white/[0.07] text-[12.5px] text-white/35 md:flex">
        Pick something to play — your queue is empty.
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          "glass fixed inset-x-0 bottom-[57px] z-40 border-t border-white/[0.08] transition-transform duration-300 md:bottom-0 md:px-3",
          expanded ? "translate-y-[calc(100%-57px-16px)] md:hidden" : "translate-y-0"
        )}
      >
        {/* Mobile expand chevron */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex w-full items-center justify-center py-1 md:hidden"
          aria-label={expanded ? "Collapse player" : "Expand player"}
        >
          <ChevronUp className={cn("h-4 w-4 text-white/40 transition-transform", expanded && "rotate-180")} />
        </button>

        <div className="flex h-[68px] items-center gap-3 px-3 md:h-[76px] md:gap-4 md:px-2">
          {/* LEFT: track info */}
          <div className="flex min-w-0 flex-1 items-center gap-3 md:w-[30%] md:max-w-[30%] md:flex-none">
            <Link
              href={`/album/${currentTrack.album.id}`}
              onClick={() => setExpanded(false)}
              className="shrink-0"
            >
              <Artwork
                id={currentTrack.album.id}
                rounded="rounded-md"
                className="h-11 w-11 shadow-[0_6px_18px_rgba(0,0,0,0.5)] md:h-14 md:w-14"
                seed={currentTrack.title.length}
                alt={currentTrack.album.title}
              />
            </Link>
            <div className="min-w-0 flex-1">
              <Link
                href={`/album/${currentTrack.album.id}`}
                onClick={() => setExpanded(false)}
                className="block truncate text-[12.5px] font-semibold text-white hover:underline"
              >
                {currentTrack.title}
              </Link>
              <Link
                href={`/artist/${currentTrack.artist.id}`}
                onClick={() => setExpanded(false)}
                className="block truncate text-[11px] text-white/45 hover:text-white/80 hover:underline"
              >
                {currentTrack.artist.name}
              </Link>
            </div>
            <button
              onClick={() => {
                toggleLikeTrack(currentTrack);
                toast.success(liked ? "Removed from Liked Songs" : "Added to Liked Songs", {
                  icon: <Heart className={cn("h-3.5 w-3.5", liked ? "fill-emerald-400 text-emerald-400" : "fill-emerald-400 text-emerald-400")} />,
                });
              }}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full transition hover:bg-white/10"
              aria-label={liked ? "Remove from liked" : "Add to liked"}
            >
              <Heart
                className={cn(
                  "h-[17px] w-[17px] transition",
                  liked ? "fill-emerald-400 text-emerald-400" : "text-white/45 hover:text-white"
                )}
              />
            </button>
          </div>

          {/* CENTER: transport */}
          <div className="flex shrink-0 flex-col items-center justify-center gap-1 md:w-[40%] md:max-w-[40%]">
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={toggleShuffle}
                className={cn(
                  "hidden h-8 w-8 place-items-center rounded-full transition sm:grid",
                  shuffle ? "text-accent-soft" : "text-white/45 hover:text-white"
                )}
                aria-label="Shuffle"
                title="Shuffle"
              >
                <Shuffle className="h-4 w-4" strokeWidth={2.2} />
              </button>
              <button
                onClick={playPrevious}
                className="grid h-8 w-8 place-items-center rounded-full text-white/70 transition hover:text-white"
                aria-label="Previous"
              >
                <SkipBack className="h-[17px] w-[17px] fill-current" />
              </button>
              <button
                onClick={togglePlay}
                className="grid h-9 w-9 place-items-center rounded-full bg-white text-black shadow-[0_4px_16px_rgba(0,0,0,0.4)] transition hover:scale-105 active:scale-95"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isBuffering ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="h-4 w-4 fill-black" />
                ) : (
                  <Play className="ml-0.5 h-4 w-4 fill-black" />
                )}
              </button>
              <button
                onClick={playNext}
                className="grid h-8 w-8 place-items-center rounded-full text-white/70 transition hover:text-white"
                aria-label="Next"
              >
                <SkipForward className="h-[17px] w-[17px] fill-current" />
              </button>
              <button
                onClick={cycleRepeat}
                className={cn(
                  "hidden h-8 w-8 place-items-center rounded-full transition sm:grid",
                  repeatMode !== "off" ? "text-accent-soft" : "text-white/45 hover:text-white"
                )}
                aria-label="Repeat"
                title={`Repeat: ${repeatMode}`}
              >
                {repeatMode === "track" ? (
                  <Repeat1 className="h-4 w-4" />
                ) : (
                  <Repeat className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Seek bar */}
            <div className="hidden w-full max-w-[520px] items-center gap-2.5 md:flex">
              <span className="w-9 text-right text-[10.5px] tabular-nums text-white/40">
                {formatDuration(currentTime)}
              </span>
              <div
                ref={seekRef}
                onMouseDown={onDown}
                onMouseMove={onMove}
                onMouseUp={onUp}
                onMouseLeave={onUp}
                onClick={handleSeek}
                role="slider"
                aria-label="Seek"
                aria-valuemin={0}
                aria-valuemax={total}
                aria-valuenow={currentTime}
                tabIndex={0}
                className="group relative h-4 flex-1 cursor-pointer"
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight") seek(Math.min(total, currentTime + 5));
                  if (e.key === "ArrowLeft") seek(Math.max(0, currentTime - 5));
                }}
              >
                <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-white transition-[width] duration-150"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div
                  className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 shadow transition group-hover:opacity-100"
                  style={{ left: `${progress}%` }}
                />
              </div>
              <span className="w-9 text-[10.5px] tabular-nums text-white/40">
                {formatDuration(total)}
              </span>
            </div>
          </div>

          {/* RIGHT: secondary controls */}
          <div className="hidden items-center justify-end gap-1 md:flex md:w-[30%] md:max-w-[30%]">
            <button
              onClick={() => setLyricsOpen(!lyricsOpen)}
              className={cn(
                "grid h-8 w-8 place-items-center rounded-full transition hover:bg-white/10",
                lyricsOpen ? "text-accent-soft" : "text-white/45 hover:text-white"
              )}
              aria-label="Lyrics"
              title="Lyrics"
            >
              <Mic2 className="h-4 w-4" />
            </button>

            <div className="relative">
              <button
                onClick={() => {
                  setQualityOpen((v) => !v);
                  setDevicesOpen(false);
                }}
                className="flex h-8 items-center gap-1 rounded-full px-2 text-[11px] font-semibold text-white/50 transition hover:bg-white/10 hover:text-white"
                title="Audio quality"
              >
                <AudioLines className="h-4 w-4" />
                <span className="hidden xl:inline">Lossless</span>
              </button>
              {qualityOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setQualityOpen(false)} />
                  <div className="glass absolute right-0 top-10 z-50 w-60 rounded-xl border border-white/10 p-1.5 shadow-2xl">
                    {(
                      [
                        ["low", "Low", "96 kbps"],
                        ["normal", "Normal", "160 kbps"],
                        ["high", "High", "320 kbps"],
                        ["very_high", "Lossless", "1411 kbps FLAC"],
                      ] as const
                    ).map(([id, label, sub]) => (
                      <button
                        key={id}
                        onClick={() => {
                          usePlayerStore.setState({ audioQuality: id });
                          setQualityOpen(false);
                          toast.success(`Audio quality: ${label}`);
                        }}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition hover:bg-white/10"
                      >
                        <span>
                          <span className="block text-[12.5px] font-medium text-white">{label}</span>
                          <span className="block text-[11px] text-white/40">{sub}</span>
                        </span>
                        {usePlayerStore.getState().audioQuality === id && (
                          <span className="h-1.5 w-1.5 rounded-full bg-accent-soft" />
                        )}
                      </button>
                    ))}
                    <div className="my-1 h-px bg-white/10" />
                    <p className="px-3 py-1.5 text-[11px] leading-relaxed text-white/35">
                      Always plays the best quality available for your connection.
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="group/vol flex items-center gap-1.5">
              <button
                onClick={toggleMute}
                className="grid h-8 w-8 place-items-center rounded-full text-white/45 transition hover:bg-white/10 hover:text-white"
                aria-label="Mute"
              >
                <VolumeIcon className="h-4 w-4" />
              </button>
              <div className="w-0 overflow-hidden opacity-0 transition-all duration-300 group-hover/vol:w-20 group-hover/vol:opacity-100">
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
            </div>

            <div className="relative">
              <button
                onClick={() => {
                  setDevicesOpen((v) => !v);
                  setQualityOpen(false);
                }}
                className="grid h-8 w-8 place-items-center rounded-full text-white/45 transition hover:bg-white/10 hover:text-white"
                aria-label="Devices"
                title="Devices"
              >
                <MonitorSpeaker className="h-4 w-4" />
              </button>
              {devicesOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setDevicesOpen(false)} />
                  <div className="glass absolute right-0 top-10 z-50 w-72 rounded-xl border border-white/10 p-2 shadow-2xl">
                    <p className="px-2 pb-1.5 pt-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/35">
                      Play on
                    </p>
                    {DEVICES.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => {
                          setDevicesOpen(false);
                          toast.success(`Playing on ${d.name}`);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition hover:bg-white/10"
                      >
                        <d.icon className="h-4 w-4 shrink-0 text-white/60" />
                        <span className="flex-1 truncate text-[12.5px] text-white/80">{d.name}</span>
                        {d.active && (
                          <span className="text-[10.5px] font-semibold text-emerald-400">Active</span>
                        )}
                        {d.volume !== null && (
                          <span className="text-[10.5px] tabular-nums text-white/35">{d.volume}%</span>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => setQueueOpen(true)}
              className="grid h-8 w-8 place-items-center rounded-full text-white/45 transition hover:bg-white/10 hover:text-white"
              aria-label="Queue"
              title="Queue"
            >
              <ListMusic className="h-4 w-4" />
            </button>

            <button
              onClick={() => setNowPlayingOpen(true)}
              className="grid h-8 w-8 place-items-center rounded-full text-white/45 transition hover:bg-white/10 hover:text-white"
              aria-label="Full screen player"
              title="Full screen"
            >
              <Maximize2 className="h-4 w-4" />
            </button>

            <button
              onClick={() => setUpgradeOpen(true)}
              className="grid h-8 w-8 place-items-center rounded-full text-white/45 transition hover:bg-white/10 hover:text-white"
              aria-label="More"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-1 md:hidden">
            <button
              onClick={playPrevious}
              className="grid h-9 w-9 place-items-center rounded-full text-white/70"
              aria-label="Previous"
            >
              <SkipBack className="h-[18px] w-[18px] fill-current" />
            </button>
            <button
              onClick={togglePlay}
              className="grid h-10 w-10 place-items-center rounded-full bg-white text-black"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 fill-black" />
              ) : (
                <Play className="ml-0.5 h-5 w-5 fill-black" />
              )}
            </button>
            <button
              onClick={playNext}
              className="grid h-9 w-9 place-items-center rounded-full text-white/70"
              aria-label="Next"
            >
              <SkipForward className="h-[18px] w-[18px] fill-current" />
            </button>
          </div>
        </div>

        {/* Mobile seek */}
        <div
          onMouseDown={onDown}
          onMouseMove={onMove}
          onMouseUp={onUp}
          onClick={handleSeek}
          role="slider"
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={currentTime}
          className="h-1 w-full cursor-pointer bg-white/20 md:hidden"
        >
          <div className="h-full bg-white" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </>
  );
}

export { PlayingIndicator };

"use client";

import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { TrackRow } from "@/components/media/TrackRow";
import { Shelf, MediaCard } from "@/components/media/Cards";
import { useLibraryStore } from "@/store/library";
import { usePlayerStore } from "@/store/player";
import { Heart, Play } from "lucide-react";
import { formatLongDuration } from "@/lib/utils";
import { PlayingIndicator } from "@/components/player/PlayerBar";
import { PLAYLISTS } from "@/data/mock";

export default function LikedSongsPage() {
  const likedTracks = useLibraryStore((s) => s.likedTracks);
  const { playTrack, currentTrack, isPlaying } = usePlayerStore();
  const first = likedTracks[0];
  const isActive = first ? currentTrack?.id === first.id && isPlaying : false;
  const duration = likedTracks.reduce((s, t) => s + t.duration, 0);

  return (
    <>
      <TopBar />
      <div className="px-4 pb-10 sm:px-6">
        <div className="mb-7 flex flex-col items-start gap-5 rounded-3xl border border-white/[0.08] bg-gradient-to-br from-emerald-500/15 via-accent/10 to-transparent p-6 sm:flex-row sm:items-center">
          <div className="relative shrink-0">
            <div className="grid h-[150px] w-[150px] place-items-center rounded-2xl bg-gradient-to-br from-accent to-rose-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <Heart className="h-16 w-16 fill-white text-white" />
            </div>
            {first && (
              <button
                onClick={() => playTrack(first, likedTracks, "playlist", "liked")}
                className="absolute -bottom-2 -right-2 grid h-14 w-14 place-items-center rounded-full bg-emerald-500 text-black shadow-[0_12px_30px_rgba(16,185,129,0.5)] transition hover:scale-105"
                aria-label="Play liked songs"
              >
                {isActive ? <PlayingIndicator /> : <Play className="ml-0.5 h-6 w-6 fill-black" />}
              </button>
            )}
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/40">Playlist</div>
            <h1 className="text-gradient mt-1 text-[32px] font-black tracking-tight sm:text-[48px]">
              Liked Songs
            </h1>
            <p className="mt-1.5 text-[13px] text-white/50">
              {likedTracks.length} song{likedTracks.length === 1 ? "" : "s"} · {formatLongDuration(duration)}
            </p>
            <Link
              href="/library"
              className="mt-3 inline-block text-[12.5px] font-semibold text-white/45 transition hover:text-white"
            >
              ← Back to library
            </Link>
          </div>
        </div>

        {likedTracks.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2.5 rounded-2xl border border-dashed border-white/12 py-20 text-center">
            <Heart className="h-8 w-8 text-white/15" />
            <p className="text-[14px] font-semibold text-white/65">Nothing liked yet</p>
            <p className="max-w-sm text-[12.5px] leading-relaxed text-white/35">
              Tap the heart on any track to save it here. Your likes are private to you.
            </p>
          </div>
        ) : (
          <div className="max-w-4xl">
            {likedTracks.map((t, i) => (
              <TrackRow
                key={t.id}
                track={t}
                index={i}
                queue={likedTracks}
                source="playlist"
                sourceId="liked"
                showPlays
              />
            ))}
          </div>
        )}

        {likedTracks.length > 0 && (
          <Shelf title="From your playlists">
            {PLAYLISTS.slice(0, 8).map((p) => (
              <MediaCard
                key={p.id}
                id={p.id}
                title={p.title}
                subtitle={p.description}
                href={`/playlist/${p.id}`}
                queue={p.tracks}
                seed={p.title.length}
              />
            ))}
          </Shelf>
        )}
      </div>
    </>
  );
}

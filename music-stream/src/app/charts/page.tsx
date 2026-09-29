"use client";

import { useMemo, useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { TrackRow } from "@/components/media/TrackRow";
import { Shelf, MediaCard, ArtistRow } from "@/components/media/Cards";
import { Artwork } from "@/components/Artwork";
import { ALBUMS, ARTISTS, PLAYLISTS, TRACKS } from "@/data/mock";
import { cn, formatCount } from "@/lib/utils";
import { usePlayerStore } from "@/store/player";
import { Flame, Trophy, Play, TrendingUp, Sparkles } from "lucide-react";
import { PlayingIndicator } from "@/components/player/PlayerBar";

const RANGES = ["Daily", "Weekly", "Monthly", "Yearly"] as const;
type Range = (typeof RANGES)[number];

export default function ChartsPage() {
  const [range, setRange] = useState<Range>("Weekly");
  const { currentTrack, isPlaying, playTrack } = usePlayerStore();

  const tracks = useMemo(
    () => [...TRACKS].sort((a, b) => b.playCount - a.playCount),
    []
  );
  const albums = useMemo(
    () => [...ALBUMS].sort((a, b) => b.tracks.reduce((s, t) => s + t.playCount, 0) - a.tracks.reduce((s, t) => s + t.playCount, 0)),
    []
  );
  const artists = useMemo(() => [...ARTISTS].sort((a, b) => b.monthlyListeners - a.monthlyListeners), []);

  const top = tracks[0];
  const topActive = top && currentTrack?.id === top.id && isPlaying;

  return (
    <>
      <TopBar />
      <div className="px-4 pb-10 sm:px-6">
        <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[12px] font-semibold text-emerald-400">
              <Trophy className="h-3.5 w-3.5" /> Resonance Charts
            </div>
            <h1 className="text-gradient mt-1.5 text-[30px] font-black tracking-tight sm:text-[40px]">
              {range === "Daily" ? "Songs · Today" : range === "Weekly" ? "Songs · This Week" : range === "Monthly" ? "Songs · This Month" : "Songs · This Year"}
            </h1>
            <p className="mt-0.5 text-[13px] text-white/45">
              The {formatCount(tracks.reduce((s, t) => s + t.playCount, 0))} most-played tracks, updated daily.
            </p>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-white/[0.06] p-1">
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition",
                  range === r ? "bg-white text-black" : "text-white/55 hover:text-white"
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </header>

        {/* Chart hero */}
        <section className="mb-9 overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-accent/20 via-cyan-500/10 to-transparent p-5 sm:p-7">
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="relative shrink-0">
              <div className="absolute -inset-4 rounded-full bg-rose-500/30 blur-3xl" />
              <div className="relative">
                <Artwork
                  id={top.id}
                  rounded="rounded-2xl"
                  className="h-[150px] w-[150px] shadow-[0_24px_60px_rgba(0,0,0,0.6)] sm:h-[180px] sm:w-[180px]"
                  seed={top.title.length}
                />
                <span className="absolute -left-3 -top-3 grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-rose-500 to-orange-400 text-[20px] font-black text-white shadow-lg">
                  1
                </span>
              </div>
            </div>
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <div className="mb-1.5 flex items-center justify-center gap-1.5 sm:justify-start">
                <Flame className="h-3.5 w-3.5 text-orange-400" />
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/50">
                  #1 {range}
                </span>
              </div>
              <h2 className="text-gradient text-[26px] font-black leading-tight tracking-tight sm:text-[38px]">
                {top.title}
              </h2>
              <p className="mt-1.5 text-[13.5px] text-white/60">
                {top.artist.name} · {formatCount(top.playCount)} plays
              </p>
              <div className="mt-4 flex items-center justify-center gap-2 sm:justify-start">
                <button
                  onClick={() =>
                    topActive
                      ? usePlayerStore.getState().togglePlay()
                      : playTrack(top, tracks, "search", "charts")
                  }
                  className="grid h-11 w-11 place-items-center rounded-full bg-white text-black transition hover:scale-105 active:scale-95"
                  aria-label={topActive ? "Pause" : "Play"}
                >
                  {topActive ? <PlayingIndicator /> : <Play className="ml-0.5 h-5 w-5 fill-black" />}
                </button>
                <button
                  onClick={() => playTrack(top, tracks, "search", "charts")}
                  className="rounded-full border border-white/20 px-4 py-2.5 text-[12.5px] font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
                >
                  Play all
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Tracked chart */}
        <section className="mb-10">
          <h2 className="mb-2 flex items-center gap-2 text-[20px] font-bold text-white">
            <TrendingUp className="h-5 w-5 text-emerald-400" /> Top 50
          </h2>
          <div className="grid gap-x-6 lg:grid-cols-2">
            {tracks.slice(0, 20).map((t, i) => (
              <TrackRow
                key={t.id}
                track={t}
                index={i}
                queue={tracks}
                source="search"
                sourceId="charts"
                showPlays
              />
            ))}
          </div>
        </section>

        <Shelf title="Trending albums" viewAllHref="/search">
          {albums.slice(0, 10).map((a) => (
            <MediaCard
              key={a.id}
              id={a.id}
              title={a.title}
              subtitle={`${a.artist.name} · ${formatCount(a.tracks.reduce((s, t) => s + t.playCount, 0))} plays`}
              href={`/album/${a.id}`}
              queue={a.tracks}
              seed={a.title.length}
            />
          ))}
        </Shelf>

        <section className="mb-9">
          <h2 className="mb-2 flex items-center gap-2 text-[20px] font-bold text-white">
            <Sparkles className="h-5 w-5 text-accent-soft" /> Trending artists
          </h2>
          <div className="grid gap-x-6 lg:grid-cols-2">
            {artists.slice(0, 8).map((a, i) => (
              <ArtistRow key={a.id} artist={a} index={i} />
            ))}
          </div>
        </section>

        <Shelf title="Rising playlists">
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
      </div>
    </>
  );
}

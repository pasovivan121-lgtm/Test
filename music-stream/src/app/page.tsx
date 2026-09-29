"use client";

import Link from "next/link";
import { useMemo, useEffect, useState } from "react";
import { Play, Sparkles, TrendingUp, Clock, Flame } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { MediaCard, Shelf, ArtistCard, LiveCatalogueShelf } from "@/components/media/Cards";
import { TrackRow } from "@/components/media/TrackRow";
import { Artwork } from "@/components/Artwork";
import { usePlayerStore } from "@/store/player";
import { useLibraryStore } from "@/store/library";
import {
  ALBUMS,
  ARTISTS,
  CATEGORIES,
  GENRES,
  MOODS,
  PLAYLISTS,
  TRACKS,
  TRENDING_TRACKS,
} from "@/data/mock";
import { formatCount, cn } from "@/lib/utils";
import { PlayingIndicator } from "@/components/player/PlayerBar";

const GREETING_HOURS = () => {
  const h = new Date().getHours();
  if (h < 5) return "Still up";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};

function useGreeting() {
  const [greeting, setGreeting] = useState<string | null>(null);
  useEffect(() => {
    const id = setTimeout(() => setGreeting(GREETING_HOURS()), 0);
    return () => clearTimeout(id);
  }, []);
  return greeting;
}

export default function HomePage() {
  const { playTrack, currentTrack, isPlaying } = usePlayerStore();
  const history = useLibraryStore((s) => s.history);
  const followedArtists = useLibraryStore((s) => s.followedArtists);
  const playlists = useLibraryStore((s) => s.playlists);
  const greeting = useGreeting() ?? "Welcome back";

  // "Jump back in" picks recently played; falls back to curated picks.
  const jumpBackIn = useMemo(() => {
    if (history.length >= 3) {
      return history.slice(0, 6).map((t) => ({
        id: t.album.id,
        title: t.album.title,
        subtitle: t.artist.name,
        href: `/album/${t.album.id}`,
        queue: t.album.tracks,
        seed: t.title.length,
      }));
    }
    return ALBUMS.slice(0, 6).map((a) => ({
      id: a.id,
      title: a.title,
      subtitle: a.artist.name,
      href: `/album/${a.id}`,
      queue: a.tracks,
      seed: a.title.length,
    }));
  }, [history]);

  const madeForYou = useMemo(() => {
    const pool = [...PLAYLISTS, ...(playlists.length > 0 ? playlists : [])];
    return pool.slice(0, 8);
  }, [playlists]);

  const newReleases = useMemo(
    () => [...ALBUMS].sort((a, b) => +new Date(b.releaseDate) - +new Date(a.releaseDate)).slice(0, 10),
    []
  );

  const moodPlaylists = useMemo(() => MOODS.filter((m) => m.playlists.length > 0), []);

  const quickPicks = useMemo(
    () => [
      ...followedArtists.flatMap((a) => a.topTracks.slice(0, 2)),
      ...TRACKS.filter((t) => t.mood.includes("Dreamy")).slice(0, 4),
    ].slice(0, 6),
    [followedArtists]
  );

  return (
    <>
      <TopBar />
      <div className="px-4 pb-6 sm:px-6">
        <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[12.5px] font-medium text-white/40">{greeting}</p>
            <h1 className="text-gradient mt-1 text-[30px] font-black tracking-tight sm:text-[40px]">
              What do you want to hear?
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/charts"
              className="flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-3.5 py-2 text-[12.5px] font-semibold text-white/80 transition hover:bg-white/10"
            >
              <TrendingUp className="h-4 w-4 text-emerald-400" /> Charts
            </Link>
            <Link
              href="/library"
              className="flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-3.5 py-2 text-[12.5px] font-semibold text-white/80 transition hover:bg-white/10"
            >
              <Clock className="h-4 w-4 text-cyan-400" /> Your library
            </Link>
          </div>
        </header>

        {/* Quick picks */}
        {quickPicks.length > 0 && (
          <section className="mb-9">
            <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
              {quickPicks.map((t) => {
                const isCurrent = currentTrack?.id === t.id;
                return (
                  <Link
                    key={t.id}
                    href={`/album/${t.album.id}`}
                    className="group flex items-center gap-3.5 overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.035] p-2.5 transition-all hover:border-white/15 hover:bg-white/[0.075]"
                  >
                    <Artwork
                      id={t.album.id}
                      rounded="rounded-lg"
                      className="h-12 w-12 shrink-0"
                      seed={t.title.length}
                    />
                    <div className="min-w-0 flex-1">
                      <div
                        className={cn(
                          "truncate text-[13px] font-semibold",
                          isCurrent ? "text-emerald-400" : "text-white/90"
                        )}
                      >
                        {t.title}
                      </div>
                      <div className="truncate text-[11.5px] text-white/45">{t.artist.name}</div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (isCurrent) usePlayerStore.getState().togglePlay();
                        else playTrack(t, [t], "search", "quickpick");
                      }}
                      className="mr-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-white opacity-0 shadow-lg transition group-hover:opacity-100 hover:scale-105"
                      aria-label="Play"
                    >
                      {isCurrent && isPlaying ? (
                        <PlayingIndicator />
                      ) : (
                        <Play className="ml-0.5 h-4 w-4 fill-white" />
                      )}
                    </button>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Jump back in */}
        <Shelf
          title="Jump back in"
          subtitle={history.length > 0 ? "Pick up where you left off" : "Start with something essential"}
          viewAllHref="/library"
        >
          {jumpBackIn.map((item) => (
            <MediaCard key={item.id} {...item} />
          ))}
        </Shelf>

        {/* Live catalogue — Audius */}
        <LiveCatalogueShelf />

        {/* Made for you */}
        <Shelf
          title="Made for you"
          subtitle="Personalised mixes, updated daily"
          viewAllHref="/library?tab=playlists"
        >
          {madeForYou.map((p) => (
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

        {/* Moods */}
        <Shelf title="Browse by mood" subtitle="How do you want to feel?">
          {moodPlaylists.map((m) => (
            <Link
              key={m.id}
              href={`/mood/${m.id}`}
              className="group relative flex aspect-square w-full flex-col justify-end overflow-hidden rounded-2xl p-4 transition-transform duration-300 hover:scale-[1.02]"
              style={{
                background: `linear-gradient(150deg, ${m.color}dd, ${m.color}55)`,
              }}
            >
              <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_75%_20%,rgba(255,255,255,0.6),transparent_60%)]" />
              <div className="absolute -right-3 -top-3 h-20 w-20 rounded-full bg-white/20 blur-xl transition group-hover:scale-125" />
              <div className="relative">
                <div className="text-[15px] font-bold text-white">{m.name}</div>
                <div className="mt-0.5 text-[11.5px] text-white/70">
                  {m.playlists.length} playlist{m.playlists.length === 1 ? "" : "s"}
                </div>
              </div>
            </Link>
          ))}
        </Shelf>

        {/* New releases */}
        <Shelf title="New releases" subtitle="Fresh music from the artists you follow" viewAllHref="/charts">
          {newReleases.map((a) => (
            <MediaCard
              key={a.id}
              id={a.id}
              title={a.title}
              subtitle={`${a.artist.name} · ${a.type === "album" ? "Album" : a.type.toUpperCase()}`}
              href={`/album/${a.id}`}
              queue={a.tracks}
              badge={a.type === "single" ? "Single" : undefined}
              seed={a.title.length}
            />
          ))}
        </Shelf>

        {/* Trending tracks */}
        <section className="mb-9">
          <div className="mb-3 flex items-end justify-between gap-4 px-3">
            <div>
              <h2 className="flex items-center gap-2 text-[19px] font-bold tracking-tight text-white sm:text-[21px]">
                <Flame className="h-5 w-5 text-orange-400" /> Trending now
              </h2>
              <p className="mt-0.5 text-[12.5px] text-white/45">The most-played tracks this week</p>
            </div>
            <Link
              href="/charts"
              className="shrink-0 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-white/40 transition hover:text-white"
            >
              Show all
            </Link>
          </div>
          <div className="grid gap-x-6 lg:grid-cols-2">
            {TRENDING_TRACKS.slice(0, 10).map((t, i) => (
              <TrackRow
                key={t.id}
                track={t}
                index={i}
                queue={TRENDING_TRACKS}
                source="search"
                sourceId="trending"
                showPlays
                showIndex={false}
              />
            ))}
          </div>
        </section>

        {/* Genres */}
        <Shelf title="Explore genres" subtitle="Find your next obsession" viewAllHref="/charts">
          {GENRES.map((g) => (
            <Link
              key={g.id}
              href={`/genre/${g.id}`}
              className="group relative flex aspect-square w-full flex-col justify-end overflow-hidden rounded-2xl p-4 transition-transform duration-300 hover:scale-[1.02]"
            >
              <Artwork
                id={g.id}
                variant="artist"
                rounded="rounded-2xl"
                className="absolute inset-0 h-full w-full opacity-80"
                alt={g.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="relative">
                <div className="text-[15px] font-bold text-white">{g.name}</div>
                <div className="mt-0.5 line-clamp-2 text-[11px] text-white/60">{g.description}</div>
              </div>
            </Link>
          ))}
        </Shelf>

        {/* Artists */}
        <Shelf title="Artists you should know" viewAllHref="/charts">
          {ARTISTS.map((a) => (
            <ArtistCard key={a.id} artist={a} queue={a.topTracks} />
          ))}
        </Shelf>

        {/* Categories */}
        <Shelf title="Browse all" viewAllHref="/charts">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              href={`/charts?c=${c.id}`}
              className="group relative flex aspect-[4/3] w-full flex-col justify-end overflow-hidden rounded-2xl p-4 transition-transform duration-300 hover:scale-[1.02]"
              style={{ background: `linear-gradient(150deg, ${c.gradients[0]}, ${c.gradients[1]})` }}
            >
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/20 blur-2xl transition group-hover:scale-125" />
              <div className="relative text-[14.5px] font-bold text-white drop-shadow">{c.name}</div>
            </Link>
          ))}
        </Shelf>

        {/* Premium banner */}
        <section className="mt-4 overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-accent/25 via-cyan-500/10 to-transparent p-6 sm:p-8">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.14em] text-white/80">
                <Sparkles className="h-3 w-3" /> Resonance Premium
              </span>
              <h3 className="text-gradient text-[24px] font-black tracking-tight sm:text-[30px]">
                Music without the noise.
              </h3>
              <p className="mt-1.5 max-w-lg text-[13px] leading-relaxed text-white/55">
                Lossless audio, offline downloads, on-demand playback and no ads — ever. Over{" "}
                {formatCount(TRACKS.length * 1_240_000)} tracks, {ARTISTS.length * 6} artists, always ad-free.
              </p>
            </div>
            <Link
              href="/premium"
              className="shrink-0 rounded-full bg-white px-6 py-3 text-[13px] font-bold text-black transition hover:scale-105"
            >
              Try Premium free
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

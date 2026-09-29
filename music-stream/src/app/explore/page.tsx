"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search as SearchIcon,
  Disc3,
  Radio,
  X,
  Play,
  Pause,
  Music4,
  Sparkles,
  Users,
  TrendingUp,
  Heart,
  ListPlus,
} from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { AudiusRow, AudiusSkeleton, AudiusStatus } from "@/components/media/AudiusRow";
import { useAudiusSearch, useAudiusPlaylists } from "@/hooks/useAudius";
import { GENRES } from "@/lib/audius";
import { usePlayerStore } from "@/store/player";
import { toPlayerTrack } from "@/store/external";
import { useLibraryStore } from "@/store/library";
import { cn, formatCount } from "@/lib/utils";
import { Artwork } from "@/components/Artwork";

const QUICK = ["electronic", "jazz", "ambient", "lo-fi", "techno", "soul", "ambient", "trap", "house"];

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");
  const { tracks, loading, error } = useAudiusSearch(query, genre);
  const { playlists } = useAudiusPlaylists(12);
  const { playTrack, currentTrack, isPlaying } = usePlayerStore();
  const likedTracks = useLibraryStore((s) => s.likedTracks);

  const first = tracks[0];
  const isActive = first ? currentTrack?.id === `audius-${first.id}` && isPlaying : false;

  const playAll = () => {
    if (tracks.length === 0) return;
    if (isActive) usePlayerStore.getState().togglePlay();
    else playTrack(toPlayerTrack(first), tracks.map(toPlayerTrack), "radio", "audius-browse");
  };

  const likedExternal = likedTracks.filter((t) => t.id.startsWith("audius-"));

  return (
    <>
      <TopBar />

      {/* Hero */}
      <div
        className="relative"
        style={{ background: "linear-gradient(165deg, rgba(16,185,129,0.24) 0%, rgba(124,92,255,0.14) 45%, transparent 78%)" }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(900px 400px at 15% 0%, rgba(16,185,129,0.28), transparent 62%)" }}
        />
        <div className="relative px-4 pb-7 pt-4 sm:px-6 sm:pb-9 sm:pt-8">
          <div className="mb-4 flex items-center gap-2 text-[12px] font-semibold text-emerald-400">
            <Radio className="h-3.5 w-3.5" /> Live catalogue · Audius network
          </div>
          <h1 className="text-gradient text-[32px] font-black leading-[1.06] tracking-tight sm:text-[46px]">
            Millions of real songs.
            <br />
            Streaming free, no ads.
          </h1>
          <p className="mt-2.5 max-w-2xl text-[13.5px] leading-relaxed text-white/55">
            Every track below is pulled live from Audius — an independent, artist-owned network where
            creators keep their rights and share revenue directly. No ads, no skips, no subscription.
            Play them all right here in Resonance.
          </p>

          {/* Search */}
          <div className="mt-6 max-w-xl">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-white/35" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search millions of tracks — artist, genre, mood…"
                aria-label="Search the live catalogue"
                className="h-12 w-full rounded-full border border-white/10 bg-white/[0.07] pl-12 pr-11 text-[14px] text-white placeholder:text-white/35 outline-none transition focus:border-white/30 focus:bg-white/[0.10]"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-white/40 transition hover:text-white"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {["", ...GENRES].slice(0, 12).map((g) => (
                <button
                  key={g || "all"}
                  onClick={() => setGenre(g)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-[11.5px] font-semibold transition",
                    genre === g ? "bg-white text-black" : "bg-white/[0.07] text-white/60 hover:bg-white/15 hover:text-white"
                  )}
                >
                  {g || "All"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pb-12 sm:px-6">
        {/* Quick search suggestions */}
        {!query && !genre && (
          <div className="mb-8 flex flex-wrap gap-2">
            {QUICK.filter((q, i) => QUICK.indexOf(q) === i).map((q) => (
              <button
                key={q}
                onClick={() => setQuery(q)}
                className="rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-[12.5px] font-medium text-white/75 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Trending section */}
        <section className="mb-10">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-[21px] font-bold text-white">
                {query ? (
                  <>
                    <SearchIcon className="h-5 w-5 text-accent-soft" /> Results for &ldquo;{query}
                    {genre ? ` · ${genre}` : ""}&rdquo;
                  </>
                ) : genre ? (
                  <>
                    <Disc3 className="h-5 w-5 text-accent-soft" /> Best in {genre}
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-5 w-5 text-emerald-400" /> Trending on Audius
                  </>
                )}
              </h2>
              <div className="mt-0.5">
                <AudiusStatus loading={loading} error={error} count={tracks.length} label="tracks" />
              </div>
            </div>
            {tracks.length > 0 && (
              <button
                onClick={playAll}
                className="flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-[12.5px] font-bold text-black transition hover:scale-105"
              >
                {isActive ? <Pause className="h-3.5 w-3.5 fill-black" /> : <Play className="h-3.5 w-3.5 fill-black" />}
                {isActive ? "Pause" : "Play all"}
              </button>
            )}
          </div>

          {loading && tracks.length === 0 ? (
            <AudiusSkeleton count={10} />
          ) : tracks.length === 0 && !error ? (
            <div className="rounded-2xl border border-dashed border-white/12 py-16 text-center">
              <Music4 className="mx-auto mb-3 h-7 w-7 text-white/15" />
              <p className="text-[14px] font-semibold text-white/65">No tracks matched</p>
              <p className="mt-1 text-[12.5px] text-white/35">Try a different word or clear the genre filter.</p>
            </div>
          ) : (
            <div className="max-w-4xl">
              {tracks.map((t, i) => (
                <AudiusRow key={t.id} track={t} queue={tracks} index={i} />
              ))}
            </div>
          )}
        </section>

        {/* Trending playlists */}
        {playlists.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-3 flex items-center gap-2 text-[21px] font-bold text-white">
              <ListPlus className="h-5 w-5 text-accent-soft" /> Trending playlists
            </h2>
            <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
              {playlists.map((p) => (
                <a
                  key={p.id}
                  href={`https://audius.co/${p.id}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group block"
                >
                  <div className="relative">
                    {p.artwork ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.artwork}
                        alt={p.title}
                        loading="lazy"
                        className="aspect-square w-full rounded-xl object-cover shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition group-hover:brightness-110"
                      />
                    ) : (
                      <Artwork id={p.id} rounded="rounded-xl" className="aspect-square w-full" seed={p.title.length} />
                    )}
                  </div>
                  <div className="mt-2.5 px-0.5">
                    <div className="truncate text-[13px] font-semibold text-white/90">{p.title}</div>
                    <div className="truncate text-[11.5px] text-white/45">
                      {p.ownerName} · {formatCount(p.playCount)} plays
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Liked from the live catalogue */}
        {likedExternal.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-3 flex items-center gap-2 text-[21px] font-bold text-white">
              <Heart className="h-5 w-5 fill-emerald-400 text-emerald-400" /> Liked from Audius
            </h2>
            <div className="max-w-4xl">
              {likedExternal.slice(0, 8).map((t) => (
                <AudiusRow
                  key={t.id}
                  track={{
                    id: t.id.replace("audius-", ""),
                    title: t.title,
                    artistName: t.artist.name,
                    artistId: t.artist.id,
                    artistHandle: "",
                    artistAvatar: t.artist.imageUrl,
                    duration: t.duration,
                    genre: t.genre[0] ?? "Other",
                    mood: t.mood,
                    artwork: t.coverUrl,
                    playCount: t.playCount,
                    favoriteCount: 0,
                    releaseDate: t.releaseDate,
                    audioUrl: t.audioUrl,
                    description: "",
                    isExplicit: t.explicit,
                    isStreamable: !!t.audioUrl,
                    license: t.album.copyright,
                    copyrightLine: t.album.copyright,
                    bpm: null,
                    musicalKey: null,
                    source: "audius",
                    sourceId: t.id,
                    permalink: "https://audius.co",
                  }}
                  queue={[]}
                />
              ))}
            </div>
            <Link
              href="/library"
              className="mt-3 inline-block text-[12px] font-semibold text-white/45 transition hover:text-white"
            >
              View all in your library →
            </Link>
          </section>
        )}

        {/* How it works */}
        <section className="overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-emerald-500/12 via-accent/8 to-transparent p-6 sm:p-8">
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: Users,
                title: "Artist-owned",
                body: "Creators upload and keep ownership. No labels, no middlemen, no gatekeepers.",
              },
              {
                icon: Sparkles,
                title: "Always ad-free",
                body: "The network is funded by listeners and artists, so there are no ads to sit through.",
              },
              {
                icon: Disc3,
                title: "Open catalogue",
                body: "A public, permanent index of music with an open API — no gatekeeping algorithm.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title}>
                <span className="mb-2.5 grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/20">
                  <Icon className="h-[18px] w-[18px] text-emerald-300" />
                </span>
                <h3 className="text-[14px] font-bold text-white">{title}</h3>
                <p className="mt-1 text-[12.5px] leading-relaxed text-white/50">{body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

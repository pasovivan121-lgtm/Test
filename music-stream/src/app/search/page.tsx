"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TopBar } from "@/components/layout/TopBar";
import { MediaCard, Shelf, ArtistCard, EpisodeRow } from "@/components/media/Cards";
import { TrackRow } from "@/components/media/TrackRow";
import { Artwork } from "@/components/Artwork";
import {
  ALBUMS,
  ARTISTS,
  CATEGORIES,
  EPISODES,
  GENRES,
  MOODS,
  PLAYLISTS,
  
  TRACKS,
} from "@/data/mock";
import { cn } from "@/lib/utils";
import { Search as SearchIcon, TrendingUp, X } from "lucide-react";

type Tab = "all" | "tracks" | "artists" | "albums" | "playlists" | "podcasts";

const TABS: { id: Tab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "tracks", label: "Songs" },
  { id: "artists", label: "Artists" },
  { id: "albums", label: "Albums" },
  { id: "playlists", label: "Playlists" },
  { id: "podcasts", label: "Podcasts" },
];

const TRENDING_SEARCHES = [
  "Luna Reyes",
  "late night drive",
  "lossless jazz",
  "study focus",
  "reverb",
  "odessa grey",
  "disco house",
  "ambient rain",
];

function SearchContent() {
  const params = useSearchParams();
  const query = params.get("q") ?? "";
  const [tab, setTab] = useState<Tab>("all");
  const [lastQuery, setLastQuery] = useState(query);

  if (query !== lastQuery) {
    setLastQuery(query);
    setTab("all");
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    const match = (...fields: (string | string[] | undefined)[]) =>
      fields.some((f) =>
        Array.isArray(f) ? f.some((x) => x.toLowerCase().includes(q)) : (f ?? "").toLowerCase().includes(q)
      );

    return {
      tracks: TRACKS.filter((t) => match(t.title, t.artist.name, t.album.title, t.genre, t.mood)),
      artists: ARTISTS.filter((a) => match(a.name, a.genres, a.bio)),
      albums: ALBUMS.filter((a) => match(a.title, a.artist.name, a.genres, a.label)),
      playlists: PLAYLISTS.filter((p) => match(p.title, p.description, p.tags, p.mood)),
      episodes: EPISODES.filter((e) => match(e.title, e.show.title, e.show.publisher)),
      genres: GENRES.filter((g) => match(g.name, g.description, g.subGenres)),
    };
  }, [query]);

  const total = results
    ? results.tracks.length +
      results.artists.length +
      results.albums.length +
      results.playlists.length +
      results.episodes.length
    : 0;

  if (!query) {
    return (
      <div className="px-4 pb-8 sm:px-6">
        <h1 className="text-gradient mb-1 text-[30px] font-black tracking-tight sm:text-[38px]">Search</h1>
        <p className="mb-7 text-[13px] text-white/45">
          Find tracks, artists, albums, playlists and podcasts.
        </p>

        <section className="mb-9">
          <h2 className="mb-3 flex items-center gap-2 text-[15px] font-bold text-white">
            <TrendingUp className="h-4 w-4 text-emerald-400" /> Trending searches
          </h2>
          <div className="flex flex-wrap gap-2">
            {TRENDING_SEARCHES.map((t) => (
              <a
                key={t}
                href={`/search?q=${encodeURIComponent(t)}`}
                className="rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-[12.5px] font-medium text-white/75 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
              >
                {t}
              </a>
            ))}
          </div>
        </section>

        <Shelf title="Browse genres">
          {GENRES.map((g) => (
            <a
              key={g.id}
              href={`/search?q=${encodeURIComponent(g.name)}`}
              className="group relative flex aspect-square w-full flex-col justify-end overflow-hidden rounded-2xl p-4 transition-transform hover:scale-[1.02]"
            >
              <Artwork
                id={g.id}
                variant="artist"
                rounded="rounded-2xl"
                className="absolute inset-0 h-full w-full opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="relative text-[15px] font-bold text-white">{g.name}</div>
            </a>
          ))}
        </Shelf>

        <Shelf title="Browse moods">
          {MOODS.map((m) => (
            <a
              key={m.id}
              href={`/mood/${m.id}`}
              className="relative flex aspect-square w-full flex-col justify-end overflow-hidden rounded-2xl p-4 transition-transform hover:scale-[1.02]"
              style={{ background: `linear-gradient(150deg, ${m.color}dd, ${m.color}55)` }}
            >
              <div className="relative text-[15px] font-bold text-white">{m.name}</div>
              <div className="relative mt-0.5 text-[11px] text-white/70">{m.playlists.length} playlists</div>
            </a>
          ))}
        </Shelf>

        <Shelf title="Categories">
          {CATEGORIES.map((c) => (
            <a
              key={c.id}
              href={`/search?q=${encodeURIComponent(c.name)}`}
              className="relative flex aspect-[4/3] w-full items-end rounded-2xl p-4 transition-transform hover:scale-[1.02]"
              style={{ background: `linear-gradient(150deg, ${c.gradients[0]}, ${c.gradients[1]})` }}
            >
              <span className="text-[14.5px] font-bold text-white drop-shadow">{c.name}</span>
            </a>
          ))}
        </Shelf>
      </div>
    );
  }

  const showTracks = tab === "all" || tab === "tracks";
  const showArtists = tab === "all" || tab === "artists";
  const showAlbums = tab === "all" || tab === "albums";
  const showPlaylists = tab === "all" || tab === "playlists";
  const showPodcasts = tab === "all" || tab === "podcasts";

  return (
    <div className="px-4 pb-8 sm:px-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-gradient text-[26px] font-black tracking-tight sm:text-[34px]">{query}</h1>
          <p className="mt-0.5 text-[12.5px] text-white/45">
            {total} result{total === 1 ? "" : "s"}
          </p>
        </div>
        <a
          href="/search"
          className="flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.05] px-3.5 py-2 text-[12.5px] font-semibold text-white/75 transition hover:bg-white/10"
        >
          <X className="h-3.5 w-3.5" /> Clear
        </a>
      </div>

      <div className="no-scrollbar mb-7 flex gap-2 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-[12.5px] font-semibold transition",
              tab === t.id ? "bg-white text-black" : "bg-white/[0.07] text-white/65 hover:bg-white/15 hover:text-white"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {total === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <SearchIcon className="h-9 w-9 text-white/15" />
          <p className="text-[15px] font-semibold text-white/70">No results for &ldquo;{query}&rdquo;</p>
          <p className="max-w-sm text-[12.5px] text-white/40">
            Try a different spelling, or search for an artist, album or playlist name.
          </p>
        </div>
      ) : (
        <div className="space-y-9">
          {showTracks && results!.tracks.length > 0 && (
            <section>
              <h2 className="mb-2 text-[19px] font-bold text-white">Songs</h2>
              <div className="grid gap-x-6 lg:grid-cols-2">
                {results!.tracks.slice(0, 10).map((t, i) => (
                  <TrackRow
                    key={t.id}
                    track={t}
                    index={i}
                    queue={results!.tracks}
                    source="search"
                    sourceId={query}
                    showPlays
                  />
                ))}
              </div>
            </section>
          )}

          {showArtists && results!.artists.length > 0 && (
            <section>
              <h2 className="mb-2 text-[19px] font-bold text-white">Artists</h2>
              <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-5">
                {results!.artists.map((a) => (
                  <ArtistCard key={a.id} artist={a} queue={a.topTracks} />
                ))}
              </div>
            </section>
          )}

          {showAlbums && results!.albums.length > 0 && (
            <Shelf title="Albums">
              {results!.albums.map((a) => (
                <MediaCard
                  key={a.id}
                  id={a.id}
                  title={a.title}
                  subtitle={`${a.artist.name} · ${a.totalTracks} tracks`}
                  href={`/album/${a.id}`}
                  queue={a.tracks}
                  seed={a.title.length}
                />
              ))}
            </Shelf>
          )}

          {showPlaylists && results!.playlists.length > 0 && (
            <Shelf title="Playlists">
              {results!.playlists.map((p) => (
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

          {showPodcasts && results!.episodes.length > 0 && (
            <section>
              <h2 className="mb-2 text-[19px] font-bold text-white">Podcasts</h2>
              {results!.episodes.map((e, i) => (
                <EpisodeRow key={e.id} episode={e} index={i} />
              ))}
            </section>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <>
      <TopBar />
      <Suspense fallback={<div className="px-6 py-20 text-center text-white/40">Searching…</div>}>
        <SearchContent />
      </Suspense>
    </>
  );
}

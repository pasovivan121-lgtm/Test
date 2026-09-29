"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Play,
  
  Heart,
  Clock,
  Plus,
  Download,
  ListFilter,
  Grid3x3,
  List as ListIcon,
  ArrowUpDown,
  Check,
  
  Disc3,
  Users,
  
  Search,
  FolderHeart,
  X,
} from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { MediaCard, Shelf } from "@/components/media/Cards";
import { TrackRow } from "@/components/media/TrackRow";
import { Artwork } from "@/components/Artwork";
import { useLibraryStore } from "@/store/library";
import { usePlayerStore } from "@/store/player";
import { useUIStore } from "@/store/ui";
import { ALBUMS, ARTISTS, PLAYLISTS } from "@/data/mock";
import { cn, formatCount, formatRelativeDate, formatLongDuration } from "@/lib/utils";
import { PlayingIndicator } from "@/components/player/PlayerBar";

type LibTab = "Playlists" | "Artists" | "Albums" | "Liked" | "History" | "Downloads";
type SortKey = "recent" | "alpha" | "creator" | "plays";
type Playlist = ReturnType<typeof useLibraryStore.getState>["playlists"][number];

const SORT_LABELS: Record<SortKey, string> = {
  recent: "Recency",
  alpha: "Alphabetical",
  creator: "Creator",
  plays: "Most played",
};

function sortPlaylists(list: Playlist[], sort: SortKey): Playlist[] {
  const copy = [...list];
  switch (sort) {
    case "alpha":
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    case "creator":
      return copy.sort((a, b) => a.owner.displayName.localeCompare(b.owner.displayName));
    case "plays":
      return copy.sort(
        (a, b) =>
          b.tracks.reduce((s, t) => s + t.playCount, 0) - a.tracks.reduce((s, t) => s + t.playCount, 0)
      );
    default:
      return copy.sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
  }
}

const TABS: { id: LibTab; icon: typeof Heart }[] = [
  { id: "Playlists", icon: ListFilter },
  { id: "Artists", icon: Users },
  { id: "Albums", icon: Disc3 },
  { id: "Liked", icon: Heart },
  { id: "History", icon: Clock },
  { id: "Downloads", icon: Download },
];

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2.5 rounded-2xl border border-dashed border-white/12 py-20 text-center">
      <FolderHeart className="h-8 w-8 text-white/15" />
      <p className="text-[14px] font-semibold text-white/65">{title}</p>
      <p className="max-w-sm text-[12.5px] leading-relaxed text-white/35">{body}</p>
    </div>
  );
}

export default function LibraryPage() {
  const [tab, setTab] = useState<LibTab>("Playlists");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState<SortKey>("recent");
  const [query, setQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const playlists = useLibraryStore((s) => s.playlists);
  const likedTracks = useLibraryStore((s) => s.likedTracks);
  const likedAlbums = useLibraryStore((s) => s.likedAlbums);
  const followedArtists = useLibraryStore((s) => s.followedArtists);
  const history = useLibraryStore((s) => s.history);
  const { currentTrack, isPlaying, playTrack } = usePlayerStore();
  const setCreatePlaylistOpen = useUIStore((s) => s.setCreatePlaylistOpen);

  const userAlbums = useMemo(() => {
    if (likedAlbums.length > 0) return likedAlbums;
    return ALBUMS.filter((a) => followedArtists.some((f) => f.id === a.artist.id));
  }, [likedAlbums, followedArtists]);

  const userArtists = useMemo(() => {
    if (followedArtists.length > 0) return followedArtists;
    return ARTISTS.slice(0, 5);
  }, [followedArtists]);

  const allPlaylists = useMemo(() => [...playlists], [playlists]);

  const sorted = useMemo(
    () => sortPlaylists(allPlaylists, sort).filter((p) => p.title.toLowerCase().includes(query.toLowerCase())),
    [allPlaylists, sort, query]
  );

  const likedDuration = likedTracks.reduce((s, t) => s + t.duration, 0);
  const likedFirst = likedTracks[0];

  return (
    <>
      <TopBar />
      <div className="px-4 pb-10 sm:px-6">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-gradient text-[30px] font-black tracking-tight sm:text-[38px]">
              Your Library
            </h1>
            <p className="mt-0.5 text-[13px] text-white/45">
              {playlists.length} playlist{playlists.length === 1 ? "" : "s"} · {followedArtists.length} artist
              {followedArtists.length === 1 ? "" : "s"} · {likedTracks.length} liked
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCreatePlaylistOpen(true)}
              className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2.5 text-[12.5px] font-bold text-black transition hover:scale-105"
            >
              <Plus className="h-3.5 w-3.5" /> New playlist
            </button>
            <div className="relative">
              <button
                onClick={() => setFilterOpen((v) => !v)}
                className="flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.05] px-3.5 py-2.5 text-[12.5px] font-semibold text-white/75 transition hover:bg-white/10"
              >
                <ArrowUpDown className="h-3.5 w-3.5" />
                {SORT_LABELS[sort]}
              </button>
              {filterOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setFilterOpen(false)} />
                  <div className="glass absolute right-0 top-11 z-50 w-52 rounded-xl border border-white/10 p-1.5 shadow-2xl">
                    {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
                      <button
                        key={k}
                        onClick={() => {
                          setSort(k);
                          setFilterOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[12.5px] transition hover:bg-white/10",
                          sort === k ? "text-white" : "text-white/60"
                        )}
                      >
                        {SORT_LABELS[k]}
                        {sort === k && <Check className="h-3.5 w-3.5 text-accent-soft" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="hidden items-center rounded-full border border-white/12 sm:flex">
              <button
                onClick={() => setView("grid")}
                className={cn(
                  "grid h-9 w-9 place-items-center rounded-l-full transition",
                  view === "grid" ? "bg-white text-black" : "text-white/50 hover:text-white"
                )}
                aria-label="Grid view"
              >
                <Grid3x3 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setView("list")}
                className={cn(
                  "grid h-9 w-9 place-items-center rounded-r-full transition",
                  view === "list" ? "bg-white text-black" : "text-white/50 hover:text-white"
                )}
                aria-label="List view"
              >
                <ListIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </header>

        <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto">
          {TABS.map(({ id, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-[12.5px] font-semibold transition",
                tab === id ? "bg-white text-black" : "bg-white/[0.07] text-white/60 hover:bg-white/15 hover:text-white"
              )}
            >
              <Icon className="h-3.5 w-3.5" /> {id}
            </button>
          ))}
        </div>

        {(tab === "Playlists" || tab === "Albums") && (
          <div className="relative mb-5 max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Filter ${tab.toLowerCase()}`}
              className="h-10 w-full rounded-full border border-white/[0.08] bg-white/[0.05] pl-9 pr-8 text-[12.5px] text-white placeholder:text-white/30 outline-none focus:border-white/25"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 hover:text-white"
                aria-label="Clear"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}

        {tab === "Playlists" &&
          (sorted.length === 0 ? (
            <EmptyState
              title="No playlists yet"
              body="Create your first playlist and start collecting the music you love."
            />
          ) : view === "grid" ? (
            <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
              {sorted.map((p) => (
                <MediaCard
                  key={p.id}
                  id={p.id}
                  title={p.title}
                  subtitle={`${p.tracks.length} songs · ${p.owner.displayName}`}
                  href={`/playlist/${p.id}`}
                  queue={p.tracks}
                  seed={p.title.length}
                />
              ))}
              <button
                onClick={() => setCreatePlaylistOpen(true)}
                className="flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 p-3 transition hover:border-white/35 hover:bg-white/[0.03]"
              >
                <span className="grid h-11 w-11 place-items-center rounded-full bg-white/10">
                  <Plus className="h-5 w-5 text-white/70" />
                </span>
                <span className="text-[12.5px] font-semibold text-white/60">New playlist</span>
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              {sorted.map((p) => {
                const isCurrent = p.tracks[0] && currentTrack?.id === p.tracks[0].id;
                return (
                  <div
                    key={p.id}
                    className="group flex items-center gap-4 rounded-xl p-2.5 transition hover:bg-white/[0.06]"
                  >
                    <Link href={`/playlist/${p.id}`} className="relative shrink-0">
                      <Artwork id={p.id} rounded="rounded-lg" className="h-14 w-14" seed={p.title.length} />
                      {p.tracks[0] && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            playTrack(p.tracks[0], p.tracks, "playlist", p.id);
                          }}
                          className="absolute inset-0 grid place-items-center rounded-lg bg-black/50 opacity-0 transition group-hover:opacity-100"
                          aria-label="Play"
                        >
                          {isCurrent && isPlaying ? (
                            <PlayingIndicator />
                          ) : (
                            <Play className="h-5 w-5 fill-white text-white" />
                          )}
                        </button>
                      )}
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/playlist/${p.id}`}
                        className={cn(
                          "block truncate text-[14px] font-semibold",
                          isCurrent ? "text-emerald-400" : "text-white/90"
                        )}
                      >
                        {p.title}
                      </Link>
                      <div className="truncate text-[11.5px] text-white/40">
                        {p.tracks.length} songs · {formatLongDuration(p.tracks.reduce((s, t) => s + t.duration, 0))}
                      </div>
                    </div>
                    <div className="hidden text-right text-[11.5px] text-white/35 sm:block">
                      <div>{formatRelativeDate(p.updatedAt)}</div>
                      <div>{formatCount(p.followers)} followers</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

        {tab === "Artists" && (
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
            {userArtists.map((a) => (
              <div key={a.id} className="flex flex-col items-center p-3 text-center">
                <Link href={`/artist/${a.id}`} className="relative w-full">
                  <Artwork
                    id={a.id}
                    variant="artist"
                    rounded="rounded-full"
                    className="aspect-square w-full"
                    alt={a.name}
                  />
                </Link>
                <Link href={`/artist/${a.id}`} className="mt-3 w-full">
                  <div className="truncate text-[13px] font-semibold text-white/90">{a.name}</div>
                </Link>
                <div className="text-[11.5px] text-white/40">
                  {formatCount(a.monthlyListeners)} listeners
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "Albums" && (
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
            {userAlbums
              .filter((a) => a.title.toLowerCase().includes(query.toLowerCase()))
              .map((a) => (
                <MediaCard
                  key={a.id}
                  id={a.id}
                  title={a.title}
                  subtitle={`${a.artist.name} · ${a.releaseDate.slice(0, 4)}`}
                  href={`/album/${a.id}`}
                  queue={a.tracks}
                  seed={a.title.length}
                />
              ))}
          </div>
        )}

        {tab === "Liked" &&
          (likedTracks.length === 0 ? (
            <EmptyState
              title="Nothing liked yet"
              body="Tap the heart on any track to save it here — it'll be there when you get back."
            />
          ) : (
            <div>
              <div className="mb-6 flex flex-col items-start gap-5 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-emerald-500/12 to-transparent p-5 sm:flex-row sm:items-center">
                <div className="relative shrink-0">
                  <div className="grid h-[140px] w-[140px] place-items-center rounded-2xl bg-gradient-to-br from-accent to-rose-500 shadow-[0_18px_44px_rgba(0,0,0,0.5)]">
                    <Heart className="h-14 w-14 fill-white text-white" />
                  </div>
                  {likedFirst && (
                    <button
                      onClick={() => playTrack(likedFirst, likedTracks, "playlist", "liked")}
                      className="absolute -bottom-2 -right-2 grid h-12 w-12 place-items-center rounded-full bg-emerald-500 text-black shadow-[0_10px_28px_rgba(16,185,129,0.5)] transition hover:scale-105"
                      aria-label="Play liked songs"
                    >
                      {currentTrack?.id === likedFirst.id && isPlaying ? (
                        <PlayingIndicator />
                      ) : (
                        <Play className="ml-0.5 h-5 w-5 fill-black" />
                      )}
                    </button>
                  )}
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/40">
                    Playlist
                  </div>
                  <h2 className="text-gradient mt-1 text-[32px] font-black tracking-tight sm:text-[44px]">
                    Liked Songs
                  </h2>
                  <p className="mt-1 text-[12.5px] text-white/50">
                    {likedTracks.length} songs · {formatLongDuration(likedDuration)}
                  </p>
                </div>
              </div>
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
            </div>
          ))}

        {tab === "History" &&
          (history.length === 0 ? (
            <EmptyState title="No listening history" body="Tracks you play will show up here, most recent first." />
          ) : (
            <div className="grid gap-x-6 lg:grid-cols-2">
              {history.map((t, i) => (
                <TrackRow
                  key={`${t.id}-${i}`}
                  track={t}
                  index={i}
                  queue={history}
                  source="queue"
                  showPlays
                />
              ))}
            </div>
          ))}

        {tab === "Downloads" && (
          <EmptyState
            title="No offline downloads"
            body="Premium members can download any album, playlist or podcast for offline listening."
          />
        )}

        <Shelf title="Recommended for you" viewAllHref="/search">
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

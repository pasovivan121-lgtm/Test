"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { useMemo, useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Shelf, MediaCard, ArtistCard } from "@/components/media/Cards";
import { TrackRow } from "@/components/media/TrackRow";
import { getArtist, PLAYLISTS } from "@/data/mock";
import { formatCount, cn } from "@/lib/utils";
import { useLibraryStore } from "@/store/library";
import { usePlayerStore } from "@/store/player";
import { Play, Pause, Check, Bell, MoreHorizontal, Share2, BadgeCheck } from "lucide-react";
import toast from "react-hot-toast";

type Tab = "Overview" | "Popular" | "Albums" | "Related" | "About";

export default function ArtistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const artist = getArtist(id);
  const [tab, setTab] = useState<Tab>("Overview");
  const followed = useLibraryStore((s) => s.followedArtists);
  const toggleFollow = useLibraryStore((s) => s.toggleFollowArtist);
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();

  const isFollowed = artist ? followed.some((a) => a.id === artist.id) : false;

  const artistPlaylists = useMemo(
    () => (artist ? PLAYLISTS.filter((p) => p.tracks.some((t) => t.artist.id === artist.id)) : []),
    [artist]
  );

  if (!artist) notFound();

  const top = artist.topTracks;
  const first = top[0];
  const isActive = first ? currentTrack?.id === first.id && isPlaying : false;

  const TABS: Tab[] = ["Overview", "Popular", "Albums", "Related", "About"];

  return (
    <>
      <TopBar />
      <div
        className="relative"
        style={{
          background:
            "linear-gradient(170deg, rgba(124,92,255,0.30) 0%, rgba(6,182,212,0.14) 42%, transparent 78%)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(900px 420px at 18% 0%, rgba(124,92,255,0.3), transparent 62%)" }}
        />
        <div className="relative flex flex-col items-center gap-6 px-4 pb-6 text-center sm:flex-row sm:items-end sm:gap-8 sm:px-6 sm:pb-8 sm:text-left">
          <div className="shrink-0">
            <div className="relative">
              <div
                className="absolute -inset-3 rounded-full opacity-70 blur-2xl"
                style={{ background: "radial-gradient(circle, rgba(124,92,255,0.55), transparent 68%)" }}
              />
              <div className="relative h-[150px] w-[150px] overflow-hidden rounded-full border-2 border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.6)] sm:h-[190px] sm:w-[190px] lg:h-[212px] lg:w-[212px]">
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(140deg, hsl(${(artist.id.charCodeAt(3) * 47) % 360} 80% 62%), hsl(${(artist.id.charCodeAt(3) * 47 + 70) % 360} 75% 45%))`,
                  }}
                />
                <div className="absolute inset-0 opacity-50 [background:radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.6),transparent_55%)]" />
                <div className="absolute inset-x-0 bottom-[18%] flex items-end justify-center gap-[6%]">
                  {[46, 78, 58, 92, 50].map((h, i) => (
                    <div key={i} className="w-[8%] rounded-full bg-white/70" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
              {artist.verified && (
                <span className="absolute -bottom-1 -right-1 grid h-9 w-9 place-items-center rounded-full bg-accent ring-4 ring-canvas">
                  <Check className="h-4 w-4 text-white" strokeWidth={3.4} />
                </span>
              )}
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col items-center gap-3 sm:items-start">
            <span className="flex items-center gap-1.5 rounded-md border border-white/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white/80">
              <BadgeCheck className="h-3 w-3 text-accent-soft" /> Verified artist
            </span>
            <h1 className="text-gradient break-words text-[30px] font-black leading-[1.05] tracking-tight sm:text-[46px] lg:text-[56px]">
              {artist.name}
            </h1>
            <p className="text-[13px] font-semibold text-white/80">
              {formatCount(artist.monthlyListeners)} monthly listeners
            </p>
            <p className="max-w-2xl text-[12.5px] leading-relaxed text-white/50">{artist.bio}</p>
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:justify-start">
              {artist.genres.map((g) => (
                <span
                  key={g}
                  className="rounded-full bg-white/[0.07] px-2.5 py-1 text-[10.5px] font-medium text-white/55"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="relative flex flex-wrap items-center gap-3 px-4 pb-6 sm:px-6">
          {first && (
            <button
              onClick={() => {
                if (currentTrack?.id === first.id) togglePlay();
                else playTrack(first, top, "artist", artist.id);
              }}
              className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-emerald-500 text-black shadow-[0_12px_34px_rgba(16,185,129,0.35)] transition hover:scale-105 active:scale-95"
              aria-label={isActive ? "Pause" : "Play"}
            >
              {isActive ? (
                <Pause className="h-6 w-6 fill-black" />
              ) : (
                <Play className="ml-0.5 h-6 w-6 fill-black" />
              )}
            </button>
          )}
          <button
            onClick={() => {
              toggleFollow(artist);
              toast.success(isFollowed ? `Unfollowed ${artist.name}` : `Following ${artist.name}`);
            }}
            className={cn(
              "rounded-full border px-5 py-2.5 text-[12.5px] font-bold transition",
              isFollowed
                ? "border-white/20 text-white/80 hover:border-white/40 hover:text-white"
                : "border-white/70 text-white hover:bg-white hover:text-black"
            )}
          >
            {isFollowed ? "Following" : "Follow"}
          </button>
          <button
            onClick={() => toast.success("You'll be notified about new releases")}
            className="flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2.5 text-[12.5px] font-semibold text-white/70 transition hover:border-white/35 hover:text-white"
          >
            <Bell className="h-3.5 w-3.5" /> Notify
          </button>
          <button
            onClick={() => toast.success("Artist link copied")}
            className="grid h-10 w-10 place-items-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white"
            aria-label="Share"
          >
            <Share2 className="h-4 w-4" />
          </button>
          <button
            className="grid h-10 w-10 place-items-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white"
            aria-label="More"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="relative flex gap-1 overflow-x-auto border-b border-white/[0.07] px-4 no-scrollbar sm:px-6">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "shrink-0 border-b-2 px-4 py-3 text-[12.5px] font-semibold transition",
                tab === t
                  ? "border-white text-white"
                  : "border-transparent text-white/45 hover:text-white/75"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pb-10 sm:px-6">
        {tab === "Overview" && (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
            <div className="max-w-4xl">
              <h2 className="mb-2 text-[19px] font-bold text-white">Popular</h2>
              {top.slice(0, 6).map((t, i) => (
                <div key={t.id}>
                  <TrackRow
                    track={t}
                    index={i}
                    queue={top}
                    source="artist"
                    sourceId={artist.id}
                    showPlays
                  />
                </div>
              ))}
            </div>
            <div>
              <h2 className="mb-2 text-[19px] font-bold text-white">About</h2>
              <div className="space-y-3 text-[12.5px] text-white/55">
                <p>{artist.bio}</p>
                <div className="flex flex-wrap gap-4 pt-1">
                  <div>
                    <div className="text-[17px] font-bold text-white">
                      {formatCount(artist.followers)}
                    </div>
                    <div className="text-[11px] text-white/40">Followers</div>
                  </div>
                  <div>
                    <div className="text-[17px] font-bold text-white">
                      {formatCount(artist.monthlyListeners)}
                    </div>
                    <div className="text-[11px] text-white/40">Monthly listeners</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "Popular" && (
          <div className="max-w-4xl">
            {top.map((t, i) => (
              <TrackRow
                key={t.id}
                track={t}
                index={i}
                queue={top}
                source="artist"
                sourceId={artist.id}
                showPlays
              />
            ))}
          </div>
        )}

        {tab === "Albums" && (
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-5">
            {artist.albums.map((a) => (
              <MediaCard
                key={a.id}
                id={a.id}
                title={a.title}
                subtitle={`${a.releaseDate.slice(0, 4)} · ${a.totalTracks} tracks`}
                href={`/album/${a.id}`}
                queue={a.tracks}
                badge={a.type === "single" ? "Single" : undefined}
                seed={a.title.length}
              />
            ))}
          </div>
        )}

        {tab === "Related" && (
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-5">
            {artist.relatedArtists.map((a) => (
              <ArtistCard key={a.id} artist={a} queue={a.topTracks} />
            ))}
          </div>
        )}

        {tab === "About" && (
          <div className="max-w-2xl space-y-5 text-[13.5px] leading-relaxed text-white/60">
            <p className="text-[16px] font-semibold text-white/90">{artist.name}</p>
            <p>{artist.bio}</p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                ["Followers", formatCount(artist.followers)],
                ["Monthly listeners", formatCount(artist.monthlyListeners)],
                ["Releases", String(artist.albums.length)],
                ["Top track plays", formatCount(artist.topTracks[0]?.playCount ?? 0)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-3.5">
                  <div className="text-[18px] font-bold text-white">{value}</div>
                  <div className="mt-0.5 text-[11px] text-white/40">{label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {artistPlaylists.length > 0 && (
          <Shelf title="Featuring {artist.name}">
            {artistPlaylists.map((p) => (
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

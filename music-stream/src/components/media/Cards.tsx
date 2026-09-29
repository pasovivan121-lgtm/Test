"use client";

import Link from "next/link";
import { Play, Check } from "lucide-react";
import { useState } from "react";
import { cn, formatCount, formatDate } from "@/lib/utils";
import type { Artist, Episode } from "@/types";
import { Artwork } from "@/components/Artwork";
import { usePlayerStore } from "@/store/player";
import { useLibraryStore } from "@/store/library";
import toast from "react-hot-toast";
import { PlayingIndicator } from "@/components/player/PlayerBar";

/* ------------------------------------------------------------------ */
/*  Media card (album / playlist / single)                             */
/* ------------------------------------------------------------------ */

interface MediaCardProps {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  variant?: "cover" | "artist" | "text";
  rounded?: string;
  seed?: number;
  badge?: string;
  queue?: import("@/types").Track[];
  shape?: "card" | "circle" | "wide";
}

export function MediaCard({
  id,
  title,
  subtitle,
  href,
  variant = "cover",
  rounded = "rounded-xl",
  seed = 3,
  badge,
  queue,
  shape = "card",
}: MediaCardProps) {
  const { currentTrack, isPlaying, playTrack } = usePlayerStore();
  const first = queue?.[0];
  const isCurrent = first ? currentTrack?.id === first.id : false;
  const isActive = isCurrent && isPlaying;
  const [hover, setHover] = useState(false);

  return (
    <Link
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={cn(
        "group relative block w-full rounded-2xl p-3 transition-all duration-300",
        "hover:bg-white/[0.055]"
      )}
    >
      <div className="relative">
        <Artwork
          id={id}
          alt={title}
          variant={variant}
          rounded={cn(
            rounded,
            shape === "circle" && "rounded-full",
            shape === "wide" && "rounded-2xl"
          )}
          className={cn(
            "aspect-square w-full shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition-transform duration-500",
            shape === "wide" && "aspect-[16/10]"
          )}
          seed={seed}
        />
        {badge && (
          <span className="absolute left-2 top-2 rounded-md bg-black/65 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
            {badge}
          </span>
        )}
        {queue && (
          <button
            onClick={(e) => {
              e.preventDefault();
              if (isCurrent) usePlayerStore.getState().togglePlay();
              else if (first) playTrack(first, queue, "playlist", id);
            }}
            onMouseEnter={() => setHover(true)}
            className={cn(
              "absolute bottom-2 right-2 grid h-11 w-11 place-items-center rounded-full bg-accent text-white shadow-[0_10px_28px_rgba(0,0,0,0.6)] transition-all duration-300 hover:scale-105 active:scale-95",
              hover || isActive ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            )}
            aria-label={isActive ? "Pause" : "Play"}
          >
            {isActive ? (
              <PlayingIndicator />
            ) : (
              <Play className="ml-0.5 h-[18px] w-[18px] fill-white" />
            )}
          </button>
        )}
      </div>
      <div className="mt-3 px-0.5">
        <div className="truncate text-[13.5px] font-semibold text-white/90">{title}</div>
        <div className="mt-0.5 line-clamp-2 text-[11.5px] leading-snug text-white/45">{subtitle}</div>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Big artist card (circular)                                          */
/* ------------------------------------------------------------------ */

export function ArtistCard({
  artist,
  queue,
}: {
  artist: Artist;
  queue?: import("@/types").Track[];
}) {
  const { currentTrack, isPlaying, playTrack } = usePlayerStore();
  const followed = useLibraryStore((s) => s.followedArtists);
  const toggleFollow = useLibraryStore((s) => s.toggleFollowArtist);
  const isFollowed = followed.some((a) => a.id === artist.id);
  const first = queue?.[0];
  const isCurrent = first ? currentTrack?.id === first.id : false;
  const isActive = isCurrent && isPlaying;
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group relative flex flex-col items-center px-2 py-4 text-center"
    >
      <Link href={`/artist/${artist.id}`} className="relative block w-full">
        <Artwork
          id={artist.id}
          alt={artist.name}
          variant="artist"
          rounded="rounded-full"
          className="aspect-square w-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-500 group-hover:scale-[1.02]"
        />
        {artist.verified && (
          <span className="absolute -bottom-0.5 right-0 grid h-6 w-6 place-items-center rounded-full bg-accent ring-[3px] ring-canvas">
            <Check className="h-3.5 w-3.5 text-white" strokeWidth={3.2} />
          </span>
        )}
      </Link>
      {queue && (
        <button
          onClick={() => {
            if (isCurrent) usePlayerStore.getState().togglePlay();
            else if (first) playTrack(first, queue, "artist", artist.id);
          }}
          className={cn(
            "absolute bottom-[38%] right-[6%] grid h-10 w-10 place-items-center rounded-full bg-accent text-white shadow-[0_8px_22px_rgba(0,0,0,0.6)] transition-all duration-300 hover:scale-105",
            hover || isActive ? "opacity-100" : "opacity-0"
          )}
          aria-label={isActive ? "Pause" : "Play artist"}
        >
          {isActive ? <PlayingIndicator /> : <Play className="ml-0.5 h-4 w-4 fill-white" />}
        </button>
      )}
      <Link href={`/artist/${artist.id}`} className="mt-3 w-full">
        <div className="truncate text-[13px] font-semibold text-white/90">{artist.name}</div>
      </Link>
      <div className="mt-0.5 text-[11.5px] text-white/45">{formatCount(artist.monthlyListeners)} listeners</div>
      <button
        onClick={() => {
          toggleFollow(artist);
          toast.success(isFollowed ? `Unfollowed ${artist.name}` : `Following ${artist.name}`);
        }}
        className={cn(
          "mt-2.5 w-full max-w-[150px] rounded-full border px-3 py-1.5 text-[11.5px] font-semibold transition",
          isFollowed
            ? "border-white/15 text-white/70 hover:border-white/30 hover:text-white"
            : "border-white/70 text-white hover:bg-white hover:text-black"
        )}
      >
        {isFollowed ? "Following" : "Follow"}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  List rows for artists / episodes                                    */
/* ------------------------------------------------------------------ */

export function ArtistRow({ artist, index }: { artist: Artist; index: number }) {
  return (
    <Link
      href={`/artist/${artist.id}`}
      className="group flex items-center gap-4 rounded-xl p-2.5 transition hover:bg-white/[0.06]"
    >
      <span className="w-5 shrink-0 text-center text-[15px] font-bold tabular-nums text-white/30 transition group-hover:text-white/70">
        {index + 1}
      </span>
      <Artwork
        id={artist.id}
        variant="artist"
        rounded="rounded-full"
        className="h-12 w-12 shrink-0"
        alt={artist.name}
      />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[14px] font-semibold text-white/90">{artist.name}</div>
        <div className="truncate text-[11.5px] text-white/45">{artist.genres.join(" · ")}</div>
      </div>
      <span className="hidden text-[12px] tabular-nums text-white/40 sm:block">
        {formatCount(artist.monthlyListeners)}
      </span>
    </Link>
  );
}

export function EpisodeRow({ episode, index }: { episode: Episode; index: number }) {
  const { currentTrack, isPlaying, playTrack } = usePlayerStore();
  const isActive = isPlaying && currentTrack?.id === episode.id;

  return (
    <div
      onDoubleClick={() => playTrack(episode as unknown as import("@/types").Track, [episode as unknown as import("@/types").Track], "radio", episode.id)}
      className="group flex items-center gap-4 rounded-xl p-2.5 transition hover:bg-white/[0.06]"
    >
      <span className="w-5 shrink-0 text-center text-[14px] font-bold tabular-nums text-white/30">
        {index + 1}
      </span>
      <div className="relative shrink-0">
        <Artwork
          id={episode.id}
          rounded="rounded-lg"
          className="h-12 w-12"
          alt={episode.title}
        />
        <button
          onClick={() =>
            playTrack(
              episode as unknown as import("@/types").Track,
              [episode as unknown as import("@/types").Track],
              "radio",
              episode.id
            )
          }
          className="absolute inset-0 grid place-items-center rounded-lg bg-black/50 opacity-0 transition group-hover:opacity-100"
          aria-label="Play episode"
        >
          {isActive ? <PlayingIndicator /> : <Play className="h-4 w-4 fill-white text-white" />}
        </button>
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[14px] font-semibold text-white/90">{episode.title}</div>
        <div className="truncate text-[11.5px] text-white/45">
          {formatDate(episode.releaseDate)} · {episode.show.publisher}
        </div>
      </div>
      <span className="hidden text-[12px] text-white/40 sm:block">
        {Math.round(episode.duration / 60)} min
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Shelf: horizontal scroll of cards                                   */
/* ------------------------------------------------------------------ */

export function Shelf({
  title,
  subtitle,
  items,
  viewAllHref,
  children,
}: {
  title: string;
  subtitle?: string;
  items?: unknown[];
  viewAllHref?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <div className="mb-1 flex items-end justify-between gap-4 px-3">
        <div className="min-w-0">
          <h2 className="truncate text-[19px] font-bold tracking-tight text-white sm:text-[21px]">{title}</h2>
          {subtitle && <p className="mt-0.5 truncate text-[12.5px] text-white/45">{subtitle}</p>}
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="shrink-0 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-white/40 transition hover:text-white"
          >
            Show all
          </Link>
        )}
      </div>
      <div className="-mx-1 overflow-x-auto no-scrollbar">
        <div className="grid auto-cols-[minmax(150px,1fr)] grid-flow-col gap-1 px-1 sm:auto-cols-[minmax(168px,1fr)] lg:auto-cols-[minmax(186px,1fr)]">
          {children}
        </div>
      </div>
      {items && <span className="sr-only">{items.length} items</span>}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Small stat tile                                                     */
/* ------------------------------------------------------------------ */

export function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-3.5 py-3">
      <div className="text-[17px] font-bold text-white">{value}</div>
      <div className="mt-0.5 text-[11px] text-white/40">{label}</div>
    </div>
  );
}

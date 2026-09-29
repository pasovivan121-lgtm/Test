"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { useMemo, useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { DetailHeader } from "@/components/media/DetailHeader";
import { TrackRow } from "@/components/media/TrackRow";
import { Shelf, MediaCard } from "@/components/media/Cards";
import { Disc3 } from "lucide-react";
import { ALBUMS, ARTISTS, getAlbum } from "@/data/mock";
import { formatDate, formatLongDuration, formatCount } from "@/lib/utils";
import { usePlayerStore } from "@/store/player";

export default function AlbumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const album = getAlbum(id);
  const [showLyrics, setShowLyrics] = useState(false);

  const related = useMemo(() => {
    if (!album) return [];
    return ALBUMS.filter(
      (a) => a.id !== album.id && a.artist.id !== album.artist.id && a.genres.some((g) => album.genres.includes(g))
    ).slice(0, 8);
  }, [album]);

  const moreByArtist = useMemo(
    () => (album ? ARTISTS.find((a) => a.id === album.artist.id)?.albums.filter((a) => a.id !== album.id) ?? [] : []),
    [album]
  );

  const byArtist = useMemo(
    () => (album ? ARTISTS.find((a) => a.id === album.artist.id)?.topTracks.filter((t) => t.album.id !== album.id) ?? [] : []),
    [album]
  );

  if (!album) notFound();

  return (
    <>
      <TopBar />
      <DetailHeader
        kind="album"
        id={album.id}
        title={album.title}
        description={`${album.artist.name} · ${album.copyright}`}
        metaLine={`${album.artist.name} · ${album.releaseDate.slice(0, 4)} · ${album.totalTracks} tracks · ${formatLongDuration(album.duration)}`}
        tracks={album.tracks}
        source="album"
        sourceId={album.id}
        seed={album.title.length}
        badges={[album.type.toUpperCase()]}
        stats={[
          { label: "Tracks", value: String(album.totalTracks) },
          { label: "Duration", value: formatLongDuration(album.duration).replace(" sec", "") },
          {
            label: "Plays",
            value: formatCount(album.tracks.reduce((s, t) => s + t.playCount, 0)),
          },
        ]}
        onShuffle={() => {
          usePlayerStore.getState().toggleShuffle();
          usePlayerStore.getState().setQueue(album.tracks, 0, "album", album.id);
        }}
        meta={
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowLyrics((v) => !v)}
              className="rounded-full border border-white/15 px-3 py-1.5 text-[11.5px] font-semibold text-white/65 transition hover:border-white/35 hover:text-white"
            >
              {showLyrics ? "Hide lyrics" : "Show lyrics"}
            </button>
            {album.genres.map((g) => (
              <span key={g} className="text-[11.5px] text-white/40">
                #{g.replace(/\s/g, "")}
              </span>
            ))}
          </div>
        }
      />

      <div className="px-4 pb-10 sm:px-6">
        <div className="mt-2 max-w-4xl">
          {album.tracks.map((t, i) => (
            <div key={t.id}>
              <TrackRow
                track={t}
                index={i}
                queue={album.tracks}
                source="album"
                sourceId={album.id}
                showArtwork={false}
                showPlays
              />
              {showLyrics && t.lyrics && (
                <pre className="whitespace-pre-wrap px-14 py-3 font-sans text-[12px] leading-relaxed text-white/40">
                  {t.lyrics.unsynced}
                </pre>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-2 text-[11.5px] text-white/30">
          <Disc3 className="h-3.5 w-3.5" />
          {album.label} · Released {formatDate(album.releaseDate)}
        </div>

        {byArtist.length > 0 && (
          <Shelf title={`More from ${album.artist.name}`} viewAllHref={`/artist/${album.artist.id}`}>
            {byArtist.map((t) => (
              <div key={t.id} className="min-w-0">
                <div className="px-1">
                  <MediaCard
                    id={t.id}
                    title={t.title}
                    subtitle={t.album.title}
                    href={`/album/${t.album.id}`}
                    queue={album.tracks}
                    seed={t.title.length}
                  />
                </div>
              </div>
            ))}
          </Shelf>
        )}

        {moreByArtist.length > 0 && (
          <Shelf title="More by this artist" viewAllHref={`/artist/${album.artist.id}`}>
            {moreByArtist.map((a) => (
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

        {related.length > 0 && (
          <Shelf title="Listeners also enjoyed">
            {related.map((a) => (
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
      </div>
    </>
  );
}

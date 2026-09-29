"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { TopBar } from "@/components/layout/TopBar";
import { DetailHeader } from "@/components/media/DetailHeader";
import { TrackRow } from "@/components/media/TrackRow";
import { Shelf, MediaCard, ArtistCard } from "@/components/media/Cards";
import { GENRES, ALBUMS } from "@/data/mock";

export default function GenrePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const genre = GENRES.find((g) => g.id === id || g.name.toLowerCase().replace(/\s/g, "-") === id);

  if (!genre) notFound();

  const tracks = genre.topPlaylists.flatMap((p) => p.tracks).slice(0, 14);
  const moreAlbums = ALBUMS.filter((a) => a.genres.some((g) => genre.name.includes(g) || g.includes(genre.name))).slice(0, 10);

  return (
    <>
      <TopBar />
      <DetailHeader
        kind="genre"
        id={genre.id}
        title={genre.name}
        description={genre.description}
        metaLine={`${genre.subGenres.join(" · ")}`}
        tracks={tracks}
        source="radio"
        imageVariant="artist"
        stats={[
          { label: "Top artists", value: String(genre.topArtists.length) },
          { label: "Playlists", value: String(genre.topPlaylists.length) },
          { label: "Sub-genres", value: String(genre.subGenres.length) },
        ]}
        badges={genre.subGenres}
      />

      <div className="px-4 pb-10 sm:px-6">
        <div className="mt-2 max-w-4xl">
          {tracks.map((t, i) => (
            <TrackRow
              key={t.id}
              track={t}
              index={i}
              queue={tracks}
              source="radio"
              sourceId={genre.id}
              showPlays
            />
          ))}
        </div>

        {genre.topPlaylists.length > 0 && (
          <Shelf title={`${genre.name} playlists`}>
            {genre.topPlaylists.map((p) => (
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

        {genre.topArtists.length > 0 && (
          <Shelf title="Leading artists" viewAllHref="/charts">
            {genre.topArtists.map((a) => (
              <ArtistCard key={a.id} artist={a} queue={a.topTracks} />
            ))}
          </Shelf>
        )}

        {moreAlbums.length > 0 && (
          <Shelf title="Essential albums">
            {moreAlbums.map((a) => (
              <MediaCard
                key={a.id}
                id={a.id}
                title={a.title}
                subtitle={a.artist.name}
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

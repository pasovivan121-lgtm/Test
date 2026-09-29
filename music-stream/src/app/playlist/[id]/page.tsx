"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { useMemo } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { DetailHeader } from "@/components/media/DetailHeader";
import { TrackRow } from "@/components/media/TrackRow";
import { Shelf, MediaCard } from "@/components/media/Cards";
import { PLAYLISTS, getPlaylist } from "@/data/mock";
import { formatCount, formatRelativeDate, formatLongDuration } from "@/lib/utils";
import { useLibraryStore } from "@/store/library";
import { usePlayerStore } from "@/store/player";
import { Users, Lock, Globe, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function PlaylistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const userPlaylists = useLibraryStore((s) => s.playlists);
  const removeFromPlaylist = useLibraryStore((s) => s.removeFromPlaylist);
  const deletePlaylist = useLibraryStore((s) => s.deletePlaylist);

  const playlist = useMemo(
    () => getPlaylist(id) ?? userPlaylists.find((p) => p.id === id),
    [id, userPlaylists]
  );

  const related = useMemo(
    () => (playlist ? PLAYLISTS.filter((p) => p.id !== playlist.id).slice(0, 8) : []),
    [playlist]
  );

  if (!playlist) notFound();

  const duration = playlist.tracks.reduce((s, t) => s + t.duration, 0);
  const isUserPlaylist = userPlaylists.some((p) => p.id === playlist.id);

  return (
    <>
      <TopBar />
      <DetailHeader
        kind="playlist"
        id={playlist.id}
        title={playlist.title}
        description={playlist.description}
        metaLine={`By ${playlist.owner.displayName} · ${playlist.tracks.length} songs · ${formatLongDuration(duration)}`}
        tracks={playlist.tracks}
        source="playlist"
        sourceId={playlist.id}
        seed={playlist.title.length}
        badges={playlist.collaborative ? ["Collaborative"] : undefined}
        stats={[
          { label: "Followers", value: formatCount(playlist.followers) },
          { label: "Tracks", value: String(playlist.tracks.length) },
          { label: "Updated", value: formatRelativeDate(playlist.updatedAt) },
        ]}
        meta={
          <div className="flex flex-wrap items-center gap-2">
            {playlist.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-white/[0.07] px-2.5 py-1 text-[10.5px] font-medium text-white/50"
              >
                #{t}
              </span>
            ))}
          </div>
        }
        onShuffle={() => {
          usePlayerStore.getState().toggleShuffle();
          usePlayerStore.getState().setQueue(playlist.tracks, 0, "playlist", playlist.id);
        }}
      />

      <div className="px-4 pb-10 sm:px-6">
        <div className="mt-2 max-w-4xl">
          {playlist.tracks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/12 py-16 text-center">
              <p className="text-[14px] font-semibold text-white/60">This playlist is empty</p>
              <p className="mt-1 text-[12.5px] text-white/35">
                Find something you love and use the ⋯ menu to add it.
              </p>
            </div>
          ) : (
            playlist.tracks.map((t, i) => (
              <div key={`${t.id}-${i}`} className="group/row">
                <TrackRow
                  track={t}
                  index={i}
                  queue={playlist.tracks}
                  source="playlist"
                  sourceId={playlist.id}
                  showAlbum
                />
                {isUserPlaylist && (
                  <div className="flex justify-end px-2">
                    <button
                      onClick={() => {
                        removeFromPlaylist(playlist.id, t.id);
                        toast.success("Removed from playlist");
                      }}
                      className="text-[11px] text-white/0 transition group-hover/row:text-white/30 hover:!text-rose-400"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {isUserPlaylist && (
          <div className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
            <div className="flex items-center gap-2 text-[12.5px] text-white/55">
              {playlist.collaborative ? (
                <Users className="h-4 w-4 text-accent-soft" />
              ) : playlist.public ? (
                <Globe className="h-4 w-4 text-emerald-400" />
              ) : (
                <Lock className="h-4 w-4 text-white/40" />
              )}
              {playlist.public ? "Public playlist" : "Private playlist"}
              {playlist.collaborative && " · Collaborative"}
            </div>
            <button
              onClick={() => {
                if (confirm("Delete this playlist? This cannot be undone.")) {
                  deletePlaylist(playlist.id);
                  toast.success("Playlist deleted");
                }
              }}
              className="ml-auto flex items-center gap-1.5 rounded-lg border border-white/12 px-3 py-1.5 text-[11.5px] font-semibold text-white/60 transition hover:border-rose-400/50 hover:text-rose-400"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete playlist
            </button>
          </div>
        )}

        {related.length > 0 && (
          <Shelf title="More playlists for you" viewAllHref="/search">
            {related.map((p) => (
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

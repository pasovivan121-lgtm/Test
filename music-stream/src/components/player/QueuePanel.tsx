"use client";

import { useState } from "react";
import { X, GripVertical, Trash2, ListPlus, Clock } from "lucide-react";
import { cn, formatDuration, formatLongDuration } from "@/lib/utils";
import { usePlayerStore } from "@/store/player";
import { useLibraryStore } from "@/store/library";
import { useUIStore } from "@/store/ui";
import { Artwork } from "@/components/Artwork";
import { TrackRow } from "@/components/media/TrackRow";
import toast from "react-hot-toast";

export function QueuePanel() {
  const open = useUIStore((s) => s.queueOpen);
  const setOpen = useUIStore((s) => s.setQueueOpen);
  const { queue, queueIndex, currentTrack, removeFromQueue, clearQueue, reorderQueue, setSleepTimer, sleepTimerEnd } =
    usePlayerStore();
  const history = useLibraryStore((s) => s.history);
  const openAddToPlaylist = useUIStore((s) => s.openAddToPlaylist);
  const [tab, setTab] = useState<"queue" | "history">("queue");
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const nowPlaying = queue.slice(Math.max(0, queueIndex));
  const totalDuration = nowPlaying.reduce((sum, q) => sum + q.track.duration, 0);
  const tracks = nowPlaying.map((q) => q.track);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm md:hidden"
        onClick={() => setOpen(false)}
      />
      <aside
        className={cn(
          "glass fixed inset-y-0 right-0 z-50 flex w-full max-w-[400px] flex-col border-l border-white/[0.08] shadow-2xl transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3.5">
          <div className="flex items-center gap-2.5">
            <ListPlus className="h-4 w-4 text-white/60" />
            <h2 className="text-[14px] font-semibold text-white">Queue</h2>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                clearQueue();
                toast("Queue cleared");
              }}
              className="rounded-lg px-2.5 py-1.5 text-[11.5px] font-medium text-white/45 transition hover:bg-white/10 hover:text-white"
            >
              Clear
            </button>
            <button
              onClick={() => setOpen(false)}
              className="grid h-8 w-8 place-items-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white"
              aria-label="Close queue"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 border-b border-white/[0.07] px-4 py-2.5">
          {(["queue", "history"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "text-[12.5px] font-semibold capitalize transition",
                tab === t ? "text-white" : "text-white/40 hover:text-white/70"
              )}
            >
              {t === "queue" ? "Now playing" : "History"}
            </button>
          ))}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
          {tab === "queue" ? (
            tracks.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
                <p className="text-[13px] text-white/50">Your queue is empty</p>
                <p className="text-[11.5px] text-white/30">
                  Play something, or add tracks with the ⋯ menu.
                </p>
              </div>
            ) : (
              <>
                {nowPlaying.length > 0 && (
                  <>
                    <div className="flex items-center gap-3 px-2 py-2">
                      <Artwork
                        id={currentTrack?.id ?? "none"}
                        rounded="rounded-md"
                        className="h-12 w-12"
                        seed={currentTrack?.title.length ?? 3}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[12.5px] font-semibold text-white">
                          {currentTrack?.title}
                        </p>
                        <p className="truncate text-[11px] text-white/45">
                          {currentTrack?.artist.name}
                        </p>
                      </div>
                    </div>
                    <p className="px-2 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/30">
                      Next up
                    </p>
                  </>
                )}
                {tracks.map((t, i) => (
                  <div
                    key={`${t.id}-${i}`}
                    draggable
                    onDragStart={() => setDragIndex(i)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (dragIndex !== null && dragIndex !== i) reorderQueue(dragIndex, i);
                      setDragIndex(null);
                    }}
                    className="group/q flex items-center gap-1"
                  >
                    <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-white/15 opacity-0 transition group-hover/q:opacity-100" />
                    <div className="min-w-0 flex-1">
                      <TrackRow
                        track={t}
                        index={i}
                        showArtwork
                        showAlbum={false}
                        showPlays={false}
                        source="queue"
                        queue={tracks}
                      />
                    </div>
                    <button
                      onClick={() => removeFromQueue(queueIndex + 1 + i)}
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-white/25 opacity-0 transition hover:bg-white/10 hover:text-rose-400 group-hover/q:opacity-100"
                      aria-label="Remove from queue"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </>
            )
          ) : history.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
              <Clock className="mb-1 h-6 w-6 text-white/20" />
              <p className="text-[13px] text-white/50">Nothing played yet</p>
            </div>
          ) : (
            history.map((t, i) => (
              <TrackRow
                key={`${t.id}-h${i}`}
                track={t}
                index={i}
                queue={history}
                source="queue"
                showAlbum
              />
            ))
          )}
        </div>

        <div className="border-t border-white/[0.07] px-4 py-3">
          <div className="mb-2.5 flex items-center justify-between text-[11.5px] text-white/45">
            <span>{tracks.length} tracks remaining</span>
            <span className="tabular-nums">{formatLongDuration(totalDuration)}</span>
          </div>
          <button
            onClick={() => {
              openAddToPlaylist(tracks);
              setOpen(false);
            }}
            className="w-full rounded-xl bg-white/10 py-2.5 text-[12.5px] font-semibold text-white transition hover:bg-white/15"
          >
            Save queue as playlist
          </button>
          <div className="mt-3">
            <p className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/30">
              Sleep timer
            </p>
            <div className="flex flex-wrap gap-1.5">
              {[5, 10, 15, 30, 45, 60].map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setSleepTimer(sleepTimerEnd ? null : m);
                    toast.success(
                      sleepTimerEnd ? "Sleep timer cleared" : `Sleep timer set for ${m} minutes`
                    );
                  }}
                  className={cn(
                    "rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition",
                    sleepTimerEnd
                      ? "bg-accent text-white"
                      : "bg-white/[0.07] text-white/60 hover:bg-white/15 hover:text-white"
                  )}
                >
                  {m}m
                </button>
              ))}
            </div>
          </div>
          <p className="mt-3 text-[10.5px] text-white/25">
            Next: {nowPlaying[0] ? `${nowPlaying[0].track.title} — ${nowPlaying[0].track.artist.name}` : "—"}
            <span className="tabular-nums"> · {formatDuration(currentTrack?.duration ?? 0)}</span>
          </p>
        </div>
      </aside>
    </>
  );
}

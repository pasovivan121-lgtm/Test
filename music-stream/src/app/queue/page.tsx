"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { TrackRow } from "@/components/media/TrackRow";
import { usePlayerStore } from "@/store/player";
import { useLibraryStore } from "@/store/library";
import { ListMusic, Trash2, Play, Clock, GripVertical, X, ListX } from "lucide-react";
import { formatLongDuration, cn } from "@/lib/utils";
import { PlayingIndicator } from "@/components/player/PlayerBar";

export default function QueuePage() {
  const [tab, setTab] = useState<"upcoming" | "history">("upcoming");
  const { queue, queueIndex, currentTrack, isPlaying, removeFromQueue, clearQueue, reorderQueue } =
    usePlayerStore();
  const history = useLibraryStore((s) => s.history);

  const upcoming = queue.slice(queueIndex + 1);
  const totalDuration = upcoming.reduce((s, q) => s + q.track.duration, 0);

  return (
    <>
      <TopBar />
      <div className="px-4 pb-10 sm:px-6">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-gradient text-[30px] font-black tracking-tight sm:text-[38px]">Queue</h1>
            <p className="mt-0.5 text-[13px] text-white/45">
              {upcoming.length} track{upcoming.length === 1 ? "" : "s"} queued ·{" "}
              {formatLongDuration(totalDuration)} remaining
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => clearQueue()}
              className="flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.05] px-3.5 py-2.5 text-[12.5px] font-semibold text-white/75 transition hover:border-rose-400/50 hover:text-rose-400"
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear queue
            </button>
          </div>
        </header>

        {currentTrack && (
          <section className="mb-8 flex flex-col items-start gap-5 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-accent/15 to-transparent p-5 sm:flex-row sm:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-500/20">
                {isPlaying ? (
                  <PlayingIndicator />
                ) : (
                  <Play className="h-4 w-4 fill-emerald-400 text-emerald-400" />
                )}
              </span>
              <div className="min-w-0">
                <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-white/40">
                  Now playing
                </div>
                <div className="truncate text-[15px] font-semibold text-white">{currentTrack.title}</div>
                <div className="truncate text-[12px] text-white/45">{currentTrack.artist.name}</div>
              </div>
            </div>
            {queueIndex >= 0 && (
              <div className="text-[12px] text-white/40">
                Track {queueIndex + 1} of {queue.length}
              </div>
            )}
          </section>
        )}

        <div className="mb-5 flex gap-2">
          {(
            [
              ["upcoming", "Up next", ListMusic],
              ["history", "History", Clock],
            ] as const
          ).map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-4 py-2 text-[12.5px] font-semibold transition",
                tab === id ? "bg-white text-black" : "bg-white/[0.07] text-white/60 hover:bg-white/15 hover:text-white"
              )}
            >
              <Icon className="h-3.5 w-3.5" /> {label}
            </button>
          ))}
        </div>

        {tab === "upcoming" ? (
          upcoming.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2.5 rounded-2xl border border-dashed border-white/12 py-20 text-center">
              <ListX className="h-8 w-8 text-white/15" />
              <p className="text-[14px] font-semibold text-white/65">Nothing queued up</p>
              <p className="max-w-sm text-[12.5px] leading-relaxed text-white/35">
                Use the ⋯ menu on any track to add it to your queue.
              </p>
            </div>
          ) : (
            <div className="max-w-4xl">
              {upcoming.map((q, i) => (
                <div
                  key={`${q.track.id}-${i}`}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("text/plain", String(i))}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const from = Number(e.dataTransfer.getData("text/plain"));
                    if (!Number.isNaN(from) && from !== i) reorderQueue(queueIndex + 1 + from, queueIndex + 1 + i);
                  }}
                  className="group/q flex items-center gap-1"
                >
                  <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-white/15 opacity-0 transition group-hover/q:opacity-100" />
                  <div className="min-w-0 flex-1">
                    <TrackRow
                      track={q.track}
                      index={i}
                      queue={queue.map((x) => x.track)}
                      source="queue"
                      showPlays
                    />
                  </div>
                  <button
                    onClick={() => removeFromQueue(queueIndex + 1 + i)}
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-white/25 opacity-0 transition hover:bg-white/10 hover:text-rose-400 group-hover/q:opacity-100"
                    aria-label="Remove from queue"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2.5 rounded-2xl border border-dashed border-white/12 py-20 text-center">
            <Clock className="h-8 w-8 text-white/15" />
            <p className="text-[14px] font-semibold text-white/65">No listening history</p>
          </div>
        ) : (
          <div className="max-w-4xl">
            {history.map((t, i) => (
              <TrackRow key={`${t.id}-h${i}`} track={t} index={i} queue={history} source="queue" showPlays />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

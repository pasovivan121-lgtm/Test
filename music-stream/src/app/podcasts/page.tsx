"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Artwork } from "@/components/Artwork";
import { EpisodeRow, Shelf, MediaCard } from "@/components/media/Cards";
import { EPISODES, SHOWS } from "@/data/mock";
import { formatCount } from "@/lib/utils";
import { Podcast, Play, Mic2, Headphones, Bell, Share2 } from "lucide-react";
import { usePlayerStore } from "@/store/player";
import type { Track } from "@/types";
import toast from "react-hot-toast";

export default function PodcastsPage() {
  const [playing, setPlaying] = useState<string | null>(null);
  const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayerStore();

  const playEpisode = (id: string) => {
    const ep = EPISODES.find((e) => e.id === id);
    if (!ep) return;
    if (currentTrack?.id === id) {
      togglePlay();
      return;
    }
    setPlaying(id);
    playTrack(ep as unknown as Track, [ep as unknown as Track], "radio", id);
  };

  return (
    <>
      <TopBar />
      <div className="px-4 pb-10 sm:px-6">
        <header className="mb-7">
          <div className="flex items-center gap-2 text-[12px] font-semibold text-accent-soft">
            <Podcast className="h-3.5 w-3.5" /> Podcasts
          </div>
          <h1 className="text-gradient mt-1.5 text-[30px] font-black tracking-tight sm:text-[40px]">
            Stories worth hearing
          </h1>
          <p className="mt-0.5 max-w-2xl text-[13px] leading-relaxed text-white/45">
            Original shows, live sets and long-form conversations. Download them and they&apos;re yours
            forever — no ads, no algorithmic filler.
          </p>
        </header>

        <div className="mb-9 grid gap-4 lg:grid-cols-3">
          {SHOWS.map((show) => {
            const latest = show.episodes[0];
            return (
              <div
                key={show.id}
                className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] p-5 transition hover:border-white/18 hover:bg-white/[0.055]"
              >
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <Artwork
                      id={show.id}
                      variant="artist"
                      rounded="rounded-2xl"
                      className="h-20 w-20"
                      alt={show.title}
                    />
                    {latest && (
                      <button
                        onClick={() => playEpisode(latest.id)}
                        className="absolute -bottom-2 -right-2 grid h-10 w-10 place-items-center rounded-full bg-emerald-500 text-black shadow-lg transition hover:scale-105"
                        aria-label={`Play ${show.title}`}
                      >
                        {playing === latest.id && isPlaying ? (
                          <Headphones className="h-4 w-4" />
                        ) : (
                          <Play className="ml-0.5 h-4 w-4 fill-black" />
                        )}
                      </button>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-[15px] font-bold text-white">{show.title}</h3>
                    <p className="mt-0.5 text-[11.5px] font-medium text-white/45">{show.publisher}</p>
                    <p className="mt-2 line-clamp-3 text-[11.5px] leading-relaxed text-white/40">
                      {show.description}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3 text-[10.5px] text-white/35">
                  <span>{formatCount(show.followers)} followers</span>
                  <span className="h-1 w-1 rounded-full bg-white/20" />
                  <span>{show.episodes.length} episodes</span>
                  {show.explicit && (
                    <>
                      <span className="h-1 w-1 rounded-full bg-white/20" />
                      <span className="rounded bg-white/15 px-1.5 py-0.5 text-[9px] font-bold">E</span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <section className="mb-10">
          <h2 className="mb-3 flex items-center gap-2 text-[20px] font-bold text-white">
            <Mic2 className="h-5 w-5 text-accent-soft" /> Latest episodes
          </h2>
          <div className="max-w-4xl">
            {EPISODES.map((e, i) => (
              <div key={e.id} className="group/ep">
                <EpisodeRow episode={e} index={i} />
                <div className="flex justify-end gap-3 px-2 opacity-0 transition group-hover/ep:opacity-100">
                  <button
                    onClick={() => {
                      playEpisode(e.id);
                      toast.success("Added to queue");
                    }}
                    className="text-[11px] text-white/45 transition hover:text-white"
                  >
                    Add to queue
                  </button>
                  <button
                    onClick={() => toast.success("Episode downloaded")}
                    className="text-[11px] text-white/45 transition hover:text-white"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => toast.success("Followed show — new episodes will appear here")}
                    className="flex items-center gap-1 text-[11px] text-white/45 transition hover:text-white"
                  >
                    <Bell className="h-3 w-3" /> Follow
                  </button>
                  <button
                    onClick={() => toast.success("Episode link copied")}
                    className="flex items-center gap-1 text-[11px] text-white/45 transition hover:text-white"
                  >
                    <Share2 className="h-3 w-3" /> Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Shelf title="Music shows">
          {SHOWS.map((s) => (
            <MediaCard
              key={s.id}
              id={s.id}
              title={s.title}
              subtitle={s.publisher}
              href={`/podcasts#${s.id}`}
              variant="artist"
              rounded="rounded-2xl"
              seed={s.title.length}
            />
          ))}
        </Shelf>
      </div>
    </>
  );
}

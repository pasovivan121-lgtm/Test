"use client";

import { useMemo } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Artwork } from "@/components/Artwork";
import { MediaCard, Shelf } from "@/components/media/Cards";
import { ALBUMS, ARTISTS, PLAYLISTS, TRACKS } from "@/data/mock";
import { formatCount } from "@/lib/utils";
import { Play, Radio, Sparkles, TrendingUp } from "lucide-react";
import { usePlayerStore } from "@/store/player";

export default function RadioPage() {
  const { playTrack } = usePlayerStore();

  const stations = useMemo(
    () => [
      { id: "r-1", name: "Morning Kickstart", desc: "Bright, upbeat and made for the commute.", seed: ARTISTS[3], queue: TRACKS.filter((t) => t.mood.includes("Confident") || t.mood.includes("Energetic")) },
      { id: "r-2", name: "Deep Focus", desc: "Instrumental textures that won't steal your attention.", seed: ARTISTS[4], queue: TRACKS.filter((t) => t.genre.includes("Ambient")) },
      { id: "r-3", name: "Late Night Drive", desc: "Synth-lit highways with no destination.", seed: ARTISTS[0], queue: TRACKS.filter((t) => t.mood.includes("Dreamy")) },
      { id: "r-4", name: "Kitchen Disco", desc: "Extended mixes for cooking and dancing badly.", seed: ARTISTS[5], queue: TRACKS.filter((t) => t.genre.includes("Disco") || t.genre.includes("House")) },
      { id: "r-5", name: "Sunday Soul", desc: "Warm R&B and neo-soul for slow starts.", seed: ARTISTS[3], queue: TRACKS.filter((t) => t.genre.includes("R&B") || t.genre.includes("Neo Soul")) },
      { id: "r-6", name: "Wall of Sound", desc: "Shoegaze and noise, endlessly layered.", seed: ARTISTS[7], queue: TRACKS.filter((t) => t.genre.includes("Shoegaze") || t.genre.includes("Noise")) },
    ],
    []
  );

  return (
    <>
      <TopBar />
      <div className="px-4 pb-10 sm:px-6">
        <header className="mb-7">
          <div className="flex items-center gap-2 text-[12px] font-semibold text-accent-soft">
            <Radio className="h-3.5 w-3.5" /> Radio
          </div>
          <h1 className="text-gradient mt-1.5 text-[30px] font-black tracking-tight sm:text-[40px]">
            Stations tuned to you
          </h1>
          <p className="mt-0.5 max-w-2xl text-[13px] leading-relaxed text-white/45">
            Endless, personalised stations built from the artists, albums and genres you spend the most
            time with. No ads, no interruptions, no algorithm shouting.
          </p>
        </header>

        <div className="mb-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {stations.map((s) => (
            <div
              key={s.id}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 transition hover:border-white/15 hover:bg-white/[0.06]"
            >
              <div className="flex items-center gap-3.5">
                <div className="relative shrink-0">
                  <Artwork
                    id={s.id}
                    rounded="rounded-xl"
                    className="h-16 w-16"
                    seed={s.name.length}
                  />
                  {s.queue[0] && (
                    <button
                      onClick={() => playTrack(s.queue[0], s.queue, "radio", s.id)}
                      className="absolute inset-0 grid place-items-center rounded-xl bg-black/55 opacity-0 transition group-hover:opacity-100"
                      aria-label={`Play ${s.name}`}
                    >
                      <Play className="h-5 w-5 fill-white text-white" />
                    </button>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14px] font-semibold text-white">{s.name}</div>
                  <div className="mt-0.5 line-clamp-2 text-[11.5px] leading-snug text-white/45">
                    {s.desc}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-3 text-[10.5px] text-white/35">
                <span>{s.queue.length} tracks</span>
                <span className="h-1 w-1 rounded-full bg-white/20" />
                <span>Seeded by {s.seed.name}</span>
              </div>
            </div>
          ))}
        </div>

        <Shelf title="Start from an artist">
          {ARTISTS.map((a) => (
            <MediaCard
              key={a.id}
              id={a.id}
              title={a.name}
              subtitle={`${formatCount(a.monthlyListeners)} listeners`}
              href={`/artist/${a.id}`}
              queue={a.topTracks}
              variant="artist"
              rounded="rounded-full"
              seed={a.name.length}
            />
          ))}
        </Shelf>

        <Shelf title="Start from an album" viewAllHref="/charts">
          {ALBUMS.map((a) => (
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

        <Shelf title="Start from a playlist" viewAllHref="/search">
          {PLAYLISTS.map((p) => (
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

        <section className="mt-4 overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-cyan-500/15 via-accent/10 to-transparent p-6">
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10">
              <TrendingUp className="h-5 w-5 text-cyan-300" />
            </span>
            <div>
              <h3 className="flex items-center gap-2 text-[16px] font-bold text-white">
                <Sparkles className="h-4 w-4 text-accent-soft" /> Your Daily Mix is ready
              </h3>
              <p className="mt-1 max-w-xl text-[12.5px] leading-relaxed text-white/50">
                A 30-track mix built from the last 30 days of listening, refreshed every morning.
              </p>
              {TRACKS[0] && (
                <button
                  onClick={() => playTrack(TRACKS[0], TRACKS, "radio", "daily-mix")}
                  className="mt-3 flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[12.5px] font-bold text-black transition hover:scale-105"
                >
                  <Play className="h-3.5 w-3.5 fill-black" /> Play Daily Mix
                </button>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

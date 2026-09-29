"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { TopBar } from "@/components/layout/TopBar";
import { MediaCard, Shelf } from "@/components/media/Cards";
import { TrackRow } from "@/components/media/TrackRow";
import { MOODS, TRACKS } from "@/data/mock";

export default function MoodPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const mood = MOODS.find((m) => m.id === id);
  if (!mood) notFound();

  const tracks = TRACKS.filter((t) => t.mood.includes(mood.name)).slice(0, 12);

  return (
    <>
      <TopBar />
      <div
        className="relative"
        style={{ background: `linear-gradient(165deg, ${mood.color}33 0%, transparent 72%)` }}
      >
        <div className="relative px-4 pb-8 pt-6 sm:px-6 sm:pt-10">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <div
              className="grid h-28 w-28 shrink-0 place-items-center rounded-3xl text-5xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] sm:h-36 sm:w-36"
              style={{ background: `linear-gradient(150deg, ${mood.color}, ${mood.color}88)` }}
            >
              <span className="font-black text-white/95">{mood.name[0]}</span>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/45">
                Mood
              </div>
              <h1 className="text-gradient mt-1 text-[34px] font-black tracking-tight sm:text-[46px]">
                {mood.name}
              </h1>
              <p className="mt-1.5 text-[13px] text-white/50">
                {mood.playlists.length} playlists curated for this mood.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pb-10 sm:px-6">
        {tracks.length > 0 && (
          <section className="mb-9 max-w-4xl">
            <h2 className="mb-2 text-[19px] font-bold text-white">Songs for {mood.name.toLowerCase()}</h2>
            {tracks.map((t, i) => (
              <TrackRow
                key={t.id}
                track={t}
                index={i}
                queue={tracks}
                source="radio"
                sourceId={mood.id}
                showPlays
              />
            ))}
          </section>
        )}

        {mood.playlists.length > 0 ? (
          <Shelf title={`${mood.name} playlists`}>
            {mood.playlists.map((p) => (
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
        ) : (
          <div className="rounded-2xl border border-dashed border-white/12 py-16 text-center">
            <p className="text-[14px] font-semibold text-white/60">Nothing here yet</p>
            <p className="mt-1 text-[12.5px] text-white/35">
              We&apos;re building new mixes for this mood. Check back soon.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

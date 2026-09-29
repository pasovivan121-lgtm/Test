"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Shelf } from "@/components/media/Cards";
import { useUIStore } from "@/store/ui";
import { useLibraryStore } from "@/store/library";
import { Settings, ChevronRight, Shield, LogOut, Share2, Crown, Music4, Radio, Users, Zap } from "lucide-react";
import toast from "react-hot-toast";
import { formatCount } from "@/lib/utils";
import { ARTISTS, TRACKS, GENRES } from "@/data/mock";

const LINKS = [
  { id: "account", label: "Account", icon: Users, desc: "Profile, subscription and devices" },
  { id: "privacy", label: "Privacy", icon: Shield, desc: "Who can see your listening activity" },
  { id: "quality", label: "Music quality", icon: Zap, desc: "Streaming and download quality" },
  { id: "radio", label: "Radio & autoplay", icon: Radio, desc: "Tune your station preferences" },
] as const;

export default function SettingsPage() {
  const setSettingsOpen = useUIStore((s) => s.setSettingsOpen);
  const setUpgradeOpen = useUIStore((s) => s.setUpgradeOpen);
  const history = useLibraryStore((s) => s.history);
  const likedTracks = useLibraryStore((s) => s.likedTracks);
  const playlists = useLibraryStore((s) => s.playlists);
  const followed = useLibraryStore((s) => s.followedArtists);

  const topGenres = useState(() => {
    const counts = new Map<string, number>();
    history.forEach((t) => t.genre.forEach((g) => counts.set(g, (counts.get(g) ?? 0) + 1)));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  })[0];

  const topTracks = history.slice(0, 8);

  return (
    <>
      <TopBar />
      <div className="px-4 pb-10 sm:px-6">
        <header className="mb-7">
          <h1 className="text-gradient text-[30px] font-black tracking-tight sm:text-[38px]">Profile</h1>
          <p className="mt-0.5 text-[13px] text-white/45">Your account, listening and preferences</p>
        </header>

        <div className="mb-8 flex flex-col items-start gap-5 rounded-3xl border border-white/[0.08] bg-gradient-to-br from-accent/18 via-cyan-500/8 to-transparent p-6 sm:flex-row sm:items-center">
          <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-gradient-to-br from-accent to-cyan-400 shadow-[0_14px_40px_rgba(124,92,255,0.4)]">
            <Music4 className="h-9 w-9 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-[24px] font-black tracking-tight text-white">Music Lover</h2>
            <p className="mt-1 text-[13px] text-white/50">
              Collecting moments, one track at a time.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-5">
              {[
                [String(playlists.length), "Playlists"],
                [String(likedTracks.length), "Liked"],
                [String(followed.length), "Following"],
                [String(history.length), "Played"],
              ].map(([v, l]) => (
                <div key={l}>
                  <div className="text-[16px] font-bold text-white">{v}</div>
                  <div className="text-[10.5px] text-white/40">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <button
              onClick={() => setSettingsOpen(true)}
              className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2.5 text-[12.5px] font-bold text-black transition hover:scale-105"
            >
              <Settings className="h-3.5 w-3.5" /> Edit settings
            </button>
            <button
              onClick={() => toast.success("Profile link copied")}
              className="flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2.5 text-[12.5px] font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
            >
              <Share2 className="h-3.5 w-3.5" /> Share
            </button>
          </div>
        </div>

        <section className="mb-9">
          <h2 className="mb-3 text-[18px] font-bold text-white">Settings</h2>
          <div className="overflow-hidden rounded-2xl border border-white/[0.08]">
            {LINKS.map(({ id, label, icon: Icon, desc }) => (
              <button
                key={id}
                onClick={() => setSettingsOpen(true)}
                className="flex w-full items-center gap-3.5 border-b border-white/[0.06] p-4 text-left transition last:border-0 hover:bg-white/[0.045]"
              >
                <Icon className="h-4 w-4 shrink-0 text-white/40" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[13.5px] font-medium text-white">{label}</span>
                  <span className="block truncate text-[11.5px] text-white/40">{desc}</span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-white/25" />
              </button>
            ))}
            <button
              onClick={() => setUpgradeOpen(true)}
              className="flex w-full items-center gap-3.5 p-4 text-left transition hover:bg-white/[0.045]"
            >
              <Crown className="h-4 w-4 shrink-0 text-amber-400" />
              <span className="min-w-0 flex-1">
                <span className="block text-[13.5px] font-medium text-white">Upgrade to Premium</span>
                <span className="block truncate text-[11.5px] text-white/40">
                  Lossless audio, offline downloads, no limits
                </span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-white/25" />
            </button>
            <button
              onClick={() => toast("Signed out of this demo session")}
              className="flex w-full items-center gap-3.5 border-t border-white/[0.06] p-4 text-left transition hover:bg-white/[0.045]"
            >
              <LogOut className="h-4 w-4 shrink-0 text-white/40" />
              <span className="text-[13.5px] font-medium text-white">Log out</span>
            </button>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section>
            <h2 className="mb-3 text-[18px] font-bold text-white">Your top genres</h2>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
              {topGenres.length === 0 ? (
                <p className="py-6 text-center text-[12.5px] text-white/35">
                  Play some music and your top genres will appear here.
                </p>
              ) : (
                <div className="space-y-3">
                  {topGenres.map(([genre, count], i) => {
                    const max = topGenres[0][1];
                    return (
                      <div key={genre}>
                        <div className="mb-1 flex items-center justify-between text-[12px]">
                          <span className="font-medium text-white/80">{genre}</span>
                          <span className="tabular-nums text-white/35">{count} plays</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-accent to-cyan-400"
                            style={{ width: `${(count / max) * 100}%` }}
                          />
                        </div>
                        <span className="sr-only">Rank {i + 1}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-[18px] font-bold text-white">Your top artists</h2>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
              {followed.length === 0 ? (
                <p className="py-6 text-center text-[12.5px] text-white/35">
                  Follow artists to see them here.
                </p>
              ) : (
                <div className="space-y-3">
                  {followed.slice(0, 6).map((a, i) => (
                    <div key={a.id} className="flex items-center gap-3">
                      <span className="w-4 text-[13px] font-bold tabular-nums text-white/25">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13px] font-medium text-white/85">{a.name}</div>
                        <div className="text-[11px] text-white/40">
                          {formatCount(a.monthlyListeners)} listeners
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        {topTracks.length > 0 && (
          <Shelf title="Recently played" viewAllHref="/library">
            {topTracks.map((t) => (
              <div key={t.id} className="min-w-0">
                <a href={`/album/${t.album.id}`} className="block">
                  <div className="flex flex-col gap-2 p-1">
                    <div className="text-[12.5px] font-semibold text-white/90">{t.title}</div>
                    <div className="text-[11px] text-white/40">{t.artist.name}</div>
                  </div>
                </a>
              </div>
            ))}
          </Shelf>
        )}

        <p className="mt-8 text-center text-[11.5px] text-white/25">
          Resonance · {TRACKS.length} tracks · {ARTISTS.length} artists · {GENRES.length} genres · No ads, ever.
        </p>
      </div>
    </>
  );
}

"use client";

import { useUIStore } from "@/store/ui";
import { TopBar } from "@/components/layout/TopBar";
import { Download, Wifi, Smartphone, Check, HardDriveDownload, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { formatCount, cn } from "@/lib/utils";
import { ALBUMS, PLAYLISTS } from "@/data/mock";

export default function DownloadsPage() {
  const setUpgradeOpen = useUIStore((s) => s.setUpgradeOpen);

  const STORAGE = [
    { id: "d-1", name: "Afterglow Avenue", artist: "Luna Reyes", quality: "Lossless", size: "412 MB", sizeMb: 412, done: true },
    { id: "d-2", name: "Midnight Drive", artist: "Nova Reyes", quality: "High", size: "186 MB", sizeMb: 186, done: true },
    { id: "d-3", name: "Harbour Light Sessions", artist: "The Paper Kites Society", quality: "High", size: "148 MB", sizeMb: 148, done: true },
    { id: "d-4", name: "GLASS CATHEDRAL", artist: "KORVYN", quality: "Lossless", size: "298 MB", sizeMb: 298, done: false, progress: 64 },
    { id: "d-5", name: "Coffee & Rain", artist: "Milo Adeyemi", quality: "Normal", size: "96 MB", sizeMb: 96, done: false, progress: 22 },
  ];

  const used = STORAGE.reduce((s, d) => s + (d.done ? d.sizeMb : 0), 0);
  const total = 5000;
  const pct = (used / total) * 100;

  return (
    <>
      <TopBar />
      <div className="px-4 pb-10 sm:px-6">
        <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-gradient text-[30px] font-black tracking-tight sm:text-[38px]">Downloads</h1>
            <p className="mt-0.5 text-[13px] text-white/45">Listen anywhere, even without a connection</p>
          </div>
          <button
            onClick={() => setUpgradeOpen(true)}
            className="rounded-full bg-white px-4 py-2.5 text-[12.5px] font-bold text-black transition hover:scale-105"
          >
            Get 10 GB offline
          </button>
        </header>

        {/* Storage */}
        <section className="mb-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-[15px] font-bold text-white">
              <HardDriveDownload className="h-4 w-4 text-accent-soft" /> Storage
            </h2>
            <div className="text-[12.5px] text-white/50">
              {(used / 1024).toFixed(2)} GB of {(total / 1024).toFixed(0)} GB used
            </div>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent to-cyan-400 transition-[width] duration-700"
              style={{ width: `${Math.max(2, pct)}%` }}
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-[11.5px] text-white/40">
            <span className="flex items-center gap-1.5">
              <Wifi className="h-3.5 w-3.5" /> Download over Wi-Fi only
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-emerald-400" /> Auto-download liked songs
            </span>
            <span className="flex items-center gap-1.5">
              <Smartphone className="h-3.5 w-3.5" /> 3 of 5 devices
            </span>
          </div>
        </section>

        {/* Downloads list */}
        <section className="mb-9">
          <h2 className="mb-3 text-[18px] font-bold text-white">Available offline</h2>
          <div className="overflow-hidden rounded-2xl border border-white/[0.08]">
            {STORAGE.map((d) => (
              <div
                key={d.id}
                className="flex items-center gap-4 border-b border-white/[0.06] p-4 last:border-0"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white/[0.06]">
                  <Download className={cn(d.done ? "text-emerald-400" : "text-white/35")} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13.5px] font-semibold text-white">{d.name}</div>
                  <div className="truncate text-[11.5px] text-white/40">
                    {d.artist} · {d.quality} · {d.size}
                  </div>
                  {!d.done && (
                    <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-accent" style={{ width: `${d.progress}%` }} />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => toast.success(`Removed ${d.name} from downloads`)}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-white/30 transition hover:bg-white/10 hover:text-rose-400"
                  aria-label="Remove download"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-cyan-500/15 via-accent/10 to-transparent p-6">
          <h3 className="text-gradient text-[20px] font-black tracking-tight">Take it with you</h3>
          <p className="mt-1.5 max-w-lg text-[12.5px] leading-relaxed text-white/50">
            Premium members can download {formatCount(ALBUMS.length * 1000)} albums, every playlist and all
            podcasts. Your downloads stay yours even if you cancel.
          </p>
          <button
            onClick={() => setUpgradeOpen(true)}
            className="mt-4 rounded-full bg-white px-5 py-2.5 text-[12.5px] font-bold text-black transition hover:scale-105"
          >
            Start free trial
          </button>
          <p className="mt-3 text-[11px] text-white/30">{PLAYLISTS.length} playlists available offline</p>
        </section>
      </div>
    </>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import {
  Home,
  Search,
  Library,
  Radio,
  Podcast,
  Globe2,
  BarChart3,
  Plus,
  Heart,
  Clock,
  Music4,
  Disc3,
  
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Artwork } from "@/components/Artwork";
import { useLibraryStore } from "@/store/library";
import { usePlayerStore } from "@/store/player";
import { useUIStore } from "@/store/ui";

const NAV = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/library", label: "Your Library", icon: Library },
];

const EXPLORE = [
  { href: "/explore", label: "Live catalogue", icon: Globe2 },
  { href: "/charts", label: "Charts", icon: BarChart3 },
  { href: "/genre/alt-pop", label: "Genres", icon: Disc3 },
  { href: "/radio", label: "Radio", icon: Radio },
  { href: "/podcasts", label: "Podcasts", icon: Podcast },
];

export function Sidebar() {
  const pathname = usePathname();
  const playlists = useLibraryStore((s) => s.playlists);
  const history = useLibraryStore((s) => s.history);
  const likedTracks = useLibraryStore((s) => s.likedTracks);
  const createPlaylist = useLibraryStore((s) => s.createPlaylist);
  const playTrack = usePlayerStore((s) => s.playTrack);
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const closeSidebar = useUIStore((s) => s.closeSidebar);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const recent = useMemo(() => history.slice(0, 8), [history]);

  const handleCreate = () => {
    const p = createPlaylist("New Playlist", "");
    useUIStore.getState().openCreatePlaylist(p.id);
  };

  return (
    <>
      <div
        onClick={closeSidebar}
        className={cn(
          "fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity md:hidden",
          sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[248px] shrink-0 flex-col gap-2 border-r border-white/[0.07] bg-[#08090d]/95 p-3 backdrop-blur-2xl transition-transform duration-300 md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="mb-1 flex items-center justify-between px-2 py-1.5">
          <Link href="/" className="flex items-center gap-2.5" onClick={closeSidebar}>
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-accent to-cyan-400 shadow-[0_6px_20px_rgba(124,92,255,0.5)]">
              <Music4 className="h-4 w-4 text-white" strokeWidth={2.5} />
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-white">Resonance</span>
          </Link>
          <button
            onClick={closeSidebar}
            className="grid h-8 w-8 place-items-center rounded-lg text-white/50 transition hover:bg-white/10 hover:text-white md:hidden"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex flex-col gap-0.5">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={closeSidebar}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-all",
                isActive(href)
                  ? "bg-white/10 text-white"
                  : "text-white/55 hover:bg-white/[0.06] hover:text-white"
              )}
            >
              <Icon
                className={cn("h-[18px] w-[18px]", isActive(href) && "text-accent-soft")}
                strokeWidth={2.1}
              />
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-1 px-3 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/30">
          Explore
        </div>
        <nav className="flex flex-col gap-0.5">
          {EXPLORE.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={closeSidebar}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-all",
                isActive(href)
                  ? "bg-white/10 text-white"
                  : "text-white/55 hover:bg-white/[0.06] hover:text-white"
              )}
            >
              <Icon
                className={cn("h-[18px] w-[18px]", isActive(href) && "text-accent-soft")}
                strokeWidth={2.1}
              />
              {label}
            </Link>
          ))}
        </nav>

        <div className="mx-1 my-2 h-px bg-white/[0.07]" />

        <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto no-scrollbar">
          <div className="flex items-center justify-between px-3 py-1">
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/30">
              Playlists
            </span>
            <button
              onClick={handleCreate}
              className="grid h-6 w-6 place-items-center rounded-md text-white/40 transition hover:bg-white/10 hover:text-white"
              aria-label="Create playlist"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          {playlists.length === 0 ? (
            <p className="px-3 py-1 text-[12px] leading-relaxed text-white/30">
              Your playlists will appear here.
            </p>
          ) : (
            playlists.map((p) => (
              <Link
                key={p.id}
                href={`/playlist/${p.id}`}
                onClick={closeSidebar}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition",
                  pathname === `/playlist/${p.id}`
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:bg-white/[0.06] hover:text-white"
                )}
              >
                <Artwork
                  id={p.id}
                  variant="text"
                  rounded="rounded"
                  className="h-8 w-8 shrink-0 text-[10px]"
                  seed={p.title.length}
                />
                <span className="truncate text-[12.5px] font-medium">{p.title}</span>
              </Link>
            ))
          )}

          {likedTracks.length > 0 && (
            <Link
              href="/library/liked"
              onClick={closeSidebar}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition",
                pathname === "/library/liked"
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/[0.06] hover:text-white"
              )}
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded bg-gradient-to-br from-accent to-rose-500">
                <Heart className="h-3.5 w-3.5 fill-white text-white" />
              </span>
              <span className="truncate text-[12.5px] font-medium">Liked Songs</span>
            </Link>
          )}

          {recent.length > 0 && (
            <>
              <div className="mt-3 flex items-center gap-1.5 px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/30">
                <Clock className="h-3 w-3" /> Recently played
              </div>
              {recent.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    playTrack(t, recent, "search", "recent");
                    closeSidebar();
                  }}
                  className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition hover:bg-white/[0.06]"
                >
                  <Artwork
                    id={t.id}
                    rounded="rounded"
                    className="h-8 w-8 shrink-0"
                    seed={t.title.length}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12.5px] font-medium text-white/70">
                      {t.title}
                    </span>
                    <span className="block truncate text-[11px] text-white/35">{t.artist.name}</span>
                  </span>
                </button>
              ))}
            </>
          )}
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-gradient-to-br from-accent/20 via-cyan-500/10 to-transparent p-3.5">
          <div className="mb-1 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-accent-soft" />
            <span className="text-[12px] font-semibold text-white">Resonance Premium</span>
          </div>
          <p className="text-[11px] leading-relaxed text-white/45">
            Lossless audio, offline downloads, on-demand everything. Zero ads, ever.
          </p>
          <button
            onClick={() => useUIStore.getState().openUpgrade()}
            className="mt-2.5 w-full rounded-lg bg-white px-3 py-1.5 text-[12px] font-semibold text-black transition hover:bg-white/90"
          >
            Explore Premium
          </button>
        </div>
      </aside>
    </>
  );
}

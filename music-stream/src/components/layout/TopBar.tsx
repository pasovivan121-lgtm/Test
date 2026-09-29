"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import {
  Menu,
  Search,
  ChevronLeft,
  ChevronRight,
  Bell,
  Settings,
  User,
  Download,
  Check,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui";
import { useLibraryStore } from "@/store/library";

export function TopBar() {
  return (
    <Suspense fallback={<div className="h-[64px]" />}>
      <TopBarInner />
    </Suspense>
  );
}

function TopBarInner() {
  const router = useRouter();
  const params = useSearchParams();
  const searchQuery = params.get("q") ?? "";
  const [query, setQuery] = useState(searchQuery);
  const [lastQuery, setLastQuery] = useState(searchQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const setSettingsOpen = useUIStore((s) => s.setSettingsOpen);
  const history = useLibraryStore((s) => s.history);

  if (searchQuery !== lastQuery) {
    setLastQuery(searchQuery);
    setQuery(searchQuery);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !(e.target as HTMLElement)?.closest("input,textarea")) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    inputRef.current?.blur();
  };

  return (
    <header className="sticky top-0 z-30 flex items-center gap-2 px-3 py-3 sm:gap-3 sm:px-6 sm:py-4">
      <div className="flex items-center gap-2">
        <button
          onClick={toggleSidebar}
          className="grid h-9 w-9 place-items-center rounded-full bg-black/40 text-white/80 transition hover:bg-black/60 md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-[18px] w-[18px]" />
        </button>
        <div className="hidden items-center gap-2 md:flex">
          <button
            onClick={() => router.back()}
            className="grid h-8 w-8 place-items-center rounded-full bg-black/40 text-white/70 transition hover:bg-black/60"
            aria-label="Go back"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => router.forward()}
            className="grid h-8 w-8 place-items-center rounded-full bg-black/40 text-white/70 transition hover:bg-black/60"
            aria-label="Go forward"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <form onSubmit={submit} className="relative min-w-0 flex-1 max-w-[440px]">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What do you want to listen to?"
          aria-label="Search"
          className="h-10 w-full rounded-full border border-white/[0.07] bg-white/[0.06] pl-10 pr-10 text-[13.5px] text-white placeholder:text-white/35 outline-none transition focus:border-white/20 focus:bg-white/[0.10]"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-1.5 text-[10px] font-semibold uppercase tracking-wide text-white/50 transition hover:text-white"
          >
            Clear
          </button>
        )}
      </form>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <Link
          href="/downloads"
          className="hidden h-8 items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-3 text-[12px] font-medium text-white/70 transition hover:border-white/25 hover:text-white sm:flex"
        >
          {history.length > 0 ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Download className="h-3.5 w-3.5" />}
          Downloads
        </Link>
        <button
          className="relative grid h-8 w-8 place-items-center rounded-full bg-black/40 text-white/70 transition hover:bg-black/60 hover:text-white"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-rose-500 ring-2 ring-canvas" />
        </button>
        <button
          onClick={() => setSettingsOpen(true)}
          className="grid h-8 w-8 place-items-center rounded-full bg-black/40 text-white/70 transition hover:bg-black/60 hover:text-white"
          aria-label="Settings"
        >
          <Settings className="h-4 w-4" />
        </button>
        <Link
          href="/settings"
          className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-accent to-cyan-400 p-[1.5px] transition hover:scale-105"
          aria-label="Profile"
        >
          <span className="grid h-full w-full place-items-center rounded-full bg-[#12141b]">
            <User className="h-4 w-4 text-white" />
          </span>
        </Link>
      </div>
    </header>
  );
}

export function SectionHeading({
  title,
  subtitle,
  action,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-4 flex items-end justify-between gap-4", className)}>
      <div className="min-w-0">
        <h2 className="truncate text-[20px] font-bold tracking-tight text-white sm:text-[22px]">{title}</h2>
        {subtitle && <p className="mt-0.5 truncate text-[13px] text-white/45">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

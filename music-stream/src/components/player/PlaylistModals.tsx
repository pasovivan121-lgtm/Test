"use client";

import { useState } from "react";
import { X, Plus, Check, ListMusic, Lock, Globe, Users } from "lucide-react";
import { useUIStore } from "@/store/ui";
import { useLibraryStore } from "@/store/library";
import { Artwork } from "@/components/Artwork";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

export function AddToPlaylistModal() {
  const open = useUIStore((s) => s.addToPlaylistOpen);
  const close = useUIStore((s) => s.closeAddToPlaylist);
  const tracks = useUIStore((s) => s.addToPlaylistTracks);
  const playlists = useLibraryStore((s) => s.playlists);
  const addToPlaylist = useLibraryStore((s) => s.addToPlaylist);
  const createPlaylist = useLibraryStore((s) => s.createPlaylist);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [visibility, setVisibility] = useState<"private" | "public" | "collaborative">("private");

  if (!open) return null;

  const handleCreate = () => {
    if (!name.trim()) return;
    const p = createPlaylist(name.trim());
    addToPlaylist(p.id, tracks);
    setName("");
    setCreating(false);
    close();
    toast.success(`Created "${p.title}" and added ${tracks.length} track${tracks.length > 1 ? "s" : ""}`);
  };

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={close} />
      <div className="glass relative w-full max-w-md animate-[rise_280ms_cubic-bezier(0.22,1,0.36,1)_both] rounded-2xl border border-white/10 p-5 shadow-2xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-[16px] font-bold text-white">Add to playlist</h3>
            <p className="mt-0.5 text-[12px] text-white/45">
              {tracks.length} track{tracks.length > 1 ? "s" : ""} selected
            </p>
          </div>
          <button
            onClick={close}
            className="grid h-8 w-8 place-items-center rounded-full text-white/45 transition hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {creating ? (
          <div className="space-y-3">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="Playlist name"
              className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.06] px-3.5 text-[13px] text-white placeholder:text-white/30 outline-none transition focus:border-white/30"
            />
            <div className="flex gap-1.5">
              {(
                [
                  ["private", "Private", Lock],
                  ["public", "Public", Globe],
                  ["collaborative", "Collaborative", Users],
                ] as const
              ).map(([id, label, Icon]) => (
                <button
                  key={id}
                  onClick={() => setVisibility(id)}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[11.5px] font-semibold transition",
                    visibility === id
                      ? "bg-accent text-white"
                      : "bg-white/[0.07] text-white/55 hover:bg-white/15 hover:text-white"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" /> {label}
                </button>
              ))}
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => {
                  setCreating(false);
                  setName("");
                }}
                className="flex-1 rounded-xl bg-white/[0.07] py-2.5 text-[12.5px] font-semibold text-white/70 transition hover:bg-white/15 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!name.trim()}
                className="flex-1 rounded-xl bg-white py-2.5 text-[12.5px] font-semibold text-black transition hover:bg-white/90 disabled:opacity-30"
              >
                Create
              </button>
            </div>
          </div>
        ) : (
          <>
            <button
              onClick={() => setCreating(true)}
              className="mb-3 flex w-full items-center gap-3 rounded-xl border border-dashed border-white/20 p-3 text-left transition hover:border-white/40 hover:bg-white/[0.04]"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10">
                <Plus className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-[13px] font-semibold text-white">New playlist</span>
                <span className="block text-[11.5px] text-white/40">Start a fresh collection</span>
              </span>
            </button>

            <div className="max-h-[280px] space-y-1 overflow-y-auto">
              {playlists.length === 0 && (
                <p className="py-6 text-center text-[12.5px] text-white/35">
                  You have no playlists yet.
                </p>
              )}
              {playlists.map((p) => {
                const has = tracks.length > 0 && tracks.every((t) => p.tracks.some((x) => x.id === t.id));
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      addToPlaylist(p.id, tracks);
                      close();
                      toast.success(`Added to ${p.title}`);
                    }}
                    className="group flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition hover:bg-white/[0.07]"
                  >
                    <Artwork
                      id={p.id}
                      variant="text"
                      rounded="rounded"
                      className="h-11 w-11 shrink-0 text-[11px]"
                      seed={p.title.length}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] font-semibold text-white">{p.title}</div>
                      <div className="truncate text-[11px] text-white/40">
                        {p.tracks.length} track{p.tracks.length === 1 ? "" : "s"}
                        {p.collaborative && " · Collaborative"}
                      </div>
                    </div>
                    {has ? (
                      <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                    ) : (
                      <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/70 opacity-0 transition group-hover:opacity-100">
                        Add
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {tracks.length > 0 && tracks.length <= 3 && (
          <div className="mt-4 flex items-center gap-2 border-t border-white/[0.07] pt-4">
            {tracks.map((t) => (
              <div key={t.id} className="flex min-w-0 items-center gap-2">
                <Artwork id={t.id} rounded="rounded" className="h-9 w-9 shrink-0" seed={t.title.length} />
                <div className="min-w-0">
                  <div className="truncate text-[11.5px] font-medium text-white">{t.title}</div>
                  <div className="truncate text-[10.5px] text-white/40">{t.artist.name}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function CreatePlaylistModal() {
  const open = useUIStore((s) => s.createPlaylistOpen);
  const close = useUIStore((s) => s.closeCreatePlaylist);
  const createPlaylist = useLibraryStore((s) => s.createPlaylist);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={close} />
      <div className="glass relative w-full max-w-md animate-[rise_280ms_cubic-bezier(0.22,1,0.36,1)_both] rounded-2xl border border-white/10 p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-[16px] font-bold text-white">
            <ListMusic className="h-4 w-4 text-accent-soft" /> New playlist
          </h3>
          <button
            onClick={close}
            className="grid h-8 w-8 place-items-center rounded-full text-white/45 hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="mb-2.5 h-11 w-full rounded-xl border border-white/10 bg-white/[0.06] px-3.5 text-[13px] text-white placeholder:text-white/30 outline-none focus:border-white/30"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          rows={3}
          className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.06] p-3.5 text-[13px] text-white placeholder:text-white/30 outline-none focus:border-white/30"
        />
        <div className="mt-4 flex gap-2">
          <button
            onClick={close}
            className="flex-1 rounded-xl bg-white/[0.07] py-2.5 text-[12.5px] font-semibold text-white/70 transition hover:bg-white/15"
          >
            Cancel
          </button>
          <button
            disabled={!name.trim()}
            onClick={() => {
              createPlaylist(name.trim(), description.trim());
              setName("");
              setDescription("");
              close();
              toast.success("Playlist created");
            }}
            className="flex-1 rounded-xl bg-white py-2.5 text-[12.5px] font-semibold text-black transition hover:bg-white/90 disabled:opacity-30"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

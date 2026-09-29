"use client";

import { create } from "zustand";
import type { Track } from "@/types";

interface UIState {
  sidebarOpen: boolean;
  nowPlayingOpen: boolean;
  queueOpen: boolean;
  lyricsOpen: boolean;
  upgradeOpen: boolean;
  settingsOpen: boolean;
  createPlaylistOpen: boolean;
  addToPlaylistTracks: Track[];
  addToPlaylistOpen: boolean;
  activeSheet: string | null;
  searchQuery: string;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  setNowPlayingOpen: (open: boolean) => void;
  setQueueOpen: (open: boolean) => void;
  setLyricsOpen: (open: boolean) => void;
  setUpgradeOpen: (open: boolean) => void;
  openUpgrade: () => void;
  setSettingsOpen: (open: boolean) => void;
  openCreatePlaylist: (id: string) => void;
  setCreatePlaylistOpen: (open: boolean) => void;
  closeCreatePlaylist: () => void;
  openAddToPlaylist: (tracks: Track | Track[]) => void;
  closeAddToPlaylist: () => void;
  setSearchQuery: (q: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  nowPlayingOpen: false,
  queueOpen: false,
  lyricsOpen: false,
  upgradeOpen: false,
  settingsOpen: false,
  createPlaylistOpen: false,
  addToPlaylistTracks: [],
  addToPlaylistOpen: false,
  activeSheet: null,
  searchQuery: "",

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  closeSidebar: () => set({ sidebarOpen: false }),
  setNowPlayingOpen: (nowPlayingOpen) => set({ nowPlayingOpen }),
  setQueueOpen: (queueOpen) => set({ queueOpen }),
  setLyricsOpen: (lyricsOpen) => set({ lyricsOpen }),
  setUpgradeOpen: (upgradeOpen) => set({ upgradeOpen }),
  openUpgrade: () => set({ upgradeOpen: true }),
  setSettingsOpen: (settingsOpen) => set({ settingsOpen }),
  openCreatePlaylist: (id) => set({ createPlaylistOpen: true, activeSheet: id }),
  setCreatePlaylistOpen: (createPlaylistOpen) =>
    set({ createPlaylistOpen, activeSheet: createPlaylistOpen ? "new" : null }),
  closeCreatePlaylist: () => set({ createPlaylistOpen: false, activeSheet: null }),
  openAddToPlaylist: (tracks) =>
    set({ addToPlaylistOpen: true, addToPlaylistTracks: Array.isArray(tracks) ? tracks : [tracks] }),
  closeAddToPlaylist: () => set({ addToPlaylistOpen: false, addToPlaylistTracks: [] }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));

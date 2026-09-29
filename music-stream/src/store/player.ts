"use client";

import { create } from "zustand";
import type { PlaybackState, QueueItem, Track } from "@/types";
import { shuffleArray } from "@/lib/utils";

interface PlayerStore extends PlaybackState {
  isBuffering: boolean;
  error: string | null;
  sleepTimerActive: boolean;
  sleepTimerEnd: number | null;
  fullscreenQueue: boolean;
  setQueue: (tracks: Track[], startIndex?: number, source?: QueueItem["source"], sourceId?: string) => void;
  addToQueue: (tracks: Track | Track[], source?: QueueItem["source"], sourceId?: string) => void;
  insertNext: (tracks: Track | Track[]) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  reorderQueue: (from: number, to: number) => void;
  playTrack: (track: Track, queue?: Track[], source?: QueueItem["source"], sourceId?: string) => void;
  playQueueItem: (index: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  pause: () => void;
  resume: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setRepeatMode: (mode: PlaybackState["repeatMode"]) => void;
  cycleRepeat: () => void;
  toggleShuffle: () => void;
  toggleCrossfade: () => void;
  setQueueIndex: (index: number) => void;
  setBuffering: (buffering: boolean) => void;
  setError: (error: string | null) => void;
  setSleepTimer: (minutes: number | null) => void;
  clearSleepTimer: () => void;
  setFullscreenQueue: (open: boolean) => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  isPlaying: false,
  currentTrack: null,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  muted: false,
  repeatMode: "off",
  shuffle: false,
  queue: [],
  queueIndex: -1,
  crossfade: false,
  gaplessPlayback: true,
  audioQuality: "high",
  isBuffering: false,
  error: null,
  sleepTimerActive: false,
  sleepTimerEnd: null,
  fullscreenQueue: false,

  setQueue: (tracks, startIndex = 0, source = "playlist", sourceId = "") => {
    const items: QueueItem[] = tracks.map((track, i) => ({
      track,
      source,
      sourceId,
      addedAt: i,
    }));
    set({
      queue: items,
      queueIndex: startIndex,
      currentTrack: tracks[startIndex] ?? null,
      currentTime: 0,
      duration: 0,
      isPlaying: !!tracks[startIndex],
    });
  },

  addToQueue: (tracks, source = "queue", sourceId = "") => {
    const list = Array.isArray(tracks) ? tracks : [tracks];
    set((state) => ({
      queue: [
        ...state.queue,
        ...list.map((track, i) => ({
          track,
          source,
          sourceId,
          addedAt: state.queue.length + i,
        })),
      ],
    }));
  },

  insertNext: (tracks) =>
    set((state) => {
      const list = Array.isArray(tracks) ? tracks : [tracks];
      const items: QueueItem[] = list.map((track, i) => ({
        track,
        source: "queue" as const,
        sourceId: "",
        addedAt: state.queueIndex + 1 + i,
      }));
      const at = state.queueIndex + 1;
      const queue = [...state.queue.slice(0, at), ...items, ...state.queue.slice(at)];
      return { queue };
    }),

  removeFromQueue: (index) =>
    set((state) => {
      const queue = state.queue.filter((_, i) => i !== index);
      let queueIndex = state.queueIndex;
      if (index < state.queueIndex) queueIndex -= 1;
      else if (index === state.queueIndex) queueIndex = Math.min(queueIndex, queue.length - 1);
      return { queue, queueIndex, currentTrack: queue[queueIndex]?.track ?? state.currentTrack };
    }),

  clearQueue: () => set({ queue: [], queueIndex: -1 }),

  reorderQueue: (from, to) =>
    set((state) => {
      const queue = [...state.queue];
      const [moved] = queue.splice(from, 1);
      queue.splice(to, 0, moved);
      const currentItem = state.currentTrack;
      const newIndex = queue.findIndex((q) => q.track.id === currentItem?.id);
      return { queue, queueIndex: newIndex >= 0 ? newIndex : state.queueIndex };
    }),

  playTrack: (track, queue, source = "playlist", sourceId = "") => {
    if (queue && queue.length > 0) {
      const list = get().shuffle ? shuffleArray(queue) : queue;
      const index = Math.max(0, list.findIndex((t) => t.id === track.id));
      set({
        queue: list.map((t, i) => ({ track: t, source, sourceId, addedAt: i })),
        queueIndex: index,
        currentTrack: list[index],
        isPlaying: true,
        currentTime: 0,
        duration: 0,
      });
    } else {
      set({
        queue: [{ track, source, sourceId, addedAt: 0 }],
        queueIndex: 0,
        currentTrack: track,
        isPlaying: true,
        currentTime: 0,
        duration: 0,
      });
    }
  },

  playQueueItem: (index) =>
    set((state) => {
      const item = state.queue[index];
      if (!item) return {};
      return {
        queueIndex: index,
        currentTrack: item.track,
        isPlaying: true,
        currentTime: 0,
        duration: 0,
      };
    }),

  playNext: () => {
    const { queue, queueIndex, repeatMode, shuffle } = get();
    if (queue.length === 0) return;
    let nextIndex: number;
    if (repeatMode === "track") {
      nextIndex = queueIndex;
    } else if (shuffle) {
      if (queue.length === 1) nextIndex = 0;
      else {
        do {
          nextIndex = Math.floor(Math.random() * queue.length);
        } while (nextIndex === queueIndex);
      }
    } else {
      nextIndex = queueIndex + 1;
      if (nextIndex >= queue.length) {
        if (repeatMode === "context") nextIndex = 0;
        else {
          set({ isPlaying: false, currentTime: 0 });
          return;
        }
      }
    }
    get().playQueueItem(nextIndex);
  },

  playPrevious: () => {
    const { queueIndex, currentTime } = get();
    if (currentTime > 3) {
      set({ currentTime: 0 });
      return;
    }
    const prevIndex = queueIndex - 1;
    if (prevIndex < 0) {
      set({ currentTime: 0 });
      return;
    }
    get().playQueueItem(prevIndex);
  },

  pause: () => set({ isPlaying: false }),
  resume: () => set({ isPlaying: true }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  seek: (time) => set({ currentTime: Math.max(0, time) }),
  setDuration: (duration) => set({ duration }),
  setVolume: (volume) => set({ volume: Math.min(1, Math.max(0, volume)), muted: false }),
  toggleMute: () => set((state) => ({ muted: !state.muted })),

  setRepeatMode: (repeatMode) => set({ repeatMode }),
  cycleRepeat: () =>
    set((state) => ({
      repeatMode:
        state.repeatMode === "off" ? "context" : state.repeatMode === "context" ? "track" : "off",
    })),
  toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),
  toggleCrossfade: () => set((state) => ({ crossfade: !state.crossfade })),
  setQueueIndex: (queueIndex) => set({ queueIndex }),

  setBuffering: (isBuffering) => set({ isBuffering }),
  setError: (error) => set({ error }),

  setSleepTimer: (minutes) =>
    set({
      sleepTimerActive: minutes !== null,
      sleepTimerEnd: minutes === null ? null : Date.now() + minutes * 60_000,
    }),
  clearSleepTimer: () => set({ sleepTimerActive: false, sleepTimerEnd: null }),
  setFullscreenQueue: (fullscreenQueue) => set({ fullscreenQueue }),
}));

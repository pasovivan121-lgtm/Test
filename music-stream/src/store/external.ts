"use client";

import { create } from "zustand";
import type { Track } from "@/types";
import type { AudiusMappedTrack } from "@/lib/audius";
import { getArtist } from "@/data/mock";

/**
 * Bridges externally-sourced tracks into the existing player model.
 * Audius tracks carry a real `audioUrl`, so the player store's audio
 * path handles them with no special casing.
 */
export function toPlayerTrack(m: AudiusMappedTrack): Track {
  // Audius artists are not in the local catalogue; synthesise a stub so
  // Track's artist references stay valid for the row/link components.
  const known = getArtist(m.artistId);
  const artist =
    known ??
    ({
      id: m.artistId || `audius-artist-${m.artistName}`,
      name: m.artistName,
      imageUrl: m.artistAvatar,
      headerUrl: "",
      bio: "",
      verified: false,
      monthlyListeners: m.playCount,
      followers: m.favoriteCount,
      genres: [m.genre],
      topTracks: [],
      albums: [],
      relatedArtists: [],
    } satisfies Track["artist"]);

  const stubAlbum = {
    id: `audius-album-${m.id}`,
    title: m.artistName,
    artist,
    coverUrl: m.artwork,
    releaseDate: m.releaseDate,
    totalTracks: 1,
    duration: m.duration,
    type: "single" as const,
    label: "Audius",
    copyright: m.license,
    tracks: [],
    genres: [m.genre],
    mood: m.mood,
  } satisfies Track["album"];

  return {
    id: `audius-${m.id}`,
    title: m.title,
    artist,
    album: stubAlbum,
    duration: m.duration,
    coverUrl: m.artwork,
    audioUrl: m.audioUrl,
    playCount: m.playCount,
    liked: false,
    explicit: m.isExplicit,
    trackNumber: 1,
    discNumber: 1,
    releaseDate: m.releaseDate,
    genre: [m.genre],
    mood: m.mood,
  };
}

type QueryState = "idle" | "loading" | "ready" | "error";

interface ExternalState {
  query: string;
  status: QueryState;
  error: string | null;
  results: AudiusMappedTrack[];
  activeGenre: string;
  recentSearches: string[];

  setQuery: (q: string) => void;
  setActiveGenre: (g: string) => void;
  setStatus: (s: QueryState, error?: string | null) => void;
  setResults: (r: AudiusMappedTrack[]) => void;
  pushRecent: (q: string) => void;
  clearRecent: () => void;
}

export const useExternalStore = create<ExternalState>((set) => ({
  query: "",
  status: "idle",
  error: null,
  results: [],
  activeGenre: "",
  recentSearches: [],

  setQuery: (query) => set({ query }),
  setActiveGenre: (activeGenre) => set({ activeGenre }),
  setStatus: (status, error = null) => set({ status, error }),
  setResults: (results) => set({ results }),
  pushRecent: (q) =>
    set((s) => ({
      recentSearches: [q, ...s.recentSearches.filter((x) => x !== q)].slice(0, 12),
    })),
  clearRecent: () => set({ recentSearches: [] }),
}));

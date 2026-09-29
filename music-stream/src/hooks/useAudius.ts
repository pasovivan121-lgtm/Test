"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  searchTracks,
  trendingTracks,
  trendingPlaylists,
  mapTracks,
  mapPlaylist,
  type AudiusMappedTrack,
  type AudiusMappedPlaylist,
} from "@/lib/audius";

/** Debounced live track search against the Audius catalogue. */
export function useAudiusSearch(query: string, genre: string, enabled = true) {
  const [tracks, setTracks] = useState<AudiusMappedTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const run = useCallback(
    async (q: string, g: string) => {
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      setLoading(true);
      setError(null);
      try {
        const list = q.trim()
          ? await searchTracks(q.trim(), 40, g || undefined, ctrl.signal)
          : await trendingTracks(40, g || undefined, ctrl.signal);
        setTracks(mapTracks(list));
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
        setError(e instanceof Error ? e.message : "Search failed");
        setTracks([]);
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!enabled) return;
    const id = setTimeout(() => void run(query, genre), query ? 350 : 0);
    return () => clearTimeout(id);
  }, [query, genre, enabled, run]);

  useEffect(() => () => abortRef.current?.abort(), []);

  return { tracks, loading, error, refresh: () => run(query, genre) };
}

/** Trending Audius playlists, for the catalogue browse views. */
export function useAudiusPlaylists(limit = 20) {
  const [playlists, setPlaylists] = useState<AudiusMappedPlaylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    trendingPlaylists(limit, ctrl.signal)
      .then((list) => setPlaylists(list.map(mapPlaylist).filter((p) => !p.isAlbum)))
      .catch((e) => {
        if (e.name !== "AbortError") setError(e instanceof Error ? e.message : "Failed to load");
      })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, [limit]);

  return { playlists, loading, error };
}

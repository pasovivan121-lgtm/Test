"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Album, Artist, Playlist, Track, User } from "@/types";
import { uid } from "@/lib/utils";

interface LibraryState {
  user: User;
  likedTracks: Track[];
  likedAlbums: Album[];
  followedArtists: Artist[];
  playlists: Playlist[];
  history: Track[];
  playCounts: Record<string, number>;
  toggleLikeTrack: (track: Track) => void;
  toggleLikeAlbum: (album: Album) => void;
  toggleFollowArtist: (artist: Artist) => void;
  createPlaylist: (title: string, description?: string) => Playlist;
  addToPlaylist: (playlistId: string, tracks: Track | Track[]) => void;
  removeFromPlaylist: (playlistId: string, trackId: string) => void;
  deletePlaylist: (playlistId: string) => void;
  addToHistory: (track: Track) => void;
  clearHistory: () => void;
  isTrackLiked: (trackId: string) => boolean;
  isAlbumLiked: (albumId: string) => boolean;
  isArtistFollowed: (artistId: string) => boolean;
}

const emptyUser: User = {
  id: "user-1",
  username: "listener",
  displayName: "Music Lover",
  avatarUrl: "https://i.pravatar.cc/300?img=12",
  bannerUrl: "",
  bio: "Collecting moments, one track at a time.",
  followers: 0,
  following: 0,
  playlists: [],
  likedTracks: [],
  likedAlbums: [],
  followedArtists: [],
  recentlyPlayed: [],
  topTracks: [],
  topArtists: [],
  topGenres: [],
};

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      user: emptyUser,
      likedTracks: [],
      likedAlbums: [],
      followedArtists: [],
      playlists: [],
      history: [],
      playCounts: {},

      toggleLikeTrack: (track) =>
        set((state) => {
          const exists = state.likedTracks.some((t) => t.id === track.id);
          return {
            likedTracks: exists
              ? state.likedTracks.filter((t) => t.id !== track.id)
              : [track, ...state.likedTracks],
          };
        }),

      toggleLikeAlbum: (album) =>
        set((state) => {
          const exists = state.likedAlbums.some((a) => a.id === album.id);
          return {
            likedAlbums: exists
              ? state.likedAlbums.filter((a) => a.id !== album.id)
              : [album, ...state.likedAlbums],
          };
        }),

      toggleFollowArtist: (artist) =>
        set((state) => {
          const exists = state.followedArtists.some((a) => a.id === artist.id);
          return {
            followedArtists: exists
              ? state.followedArtists.filter((a) => a.id !== artist.id)
              : [artist, ...state.followedArtists],
          };
        }),

      createPlaylist: (title, description = "") => {
        const playlist: Playlist = {
          id: uid("pl"),
          title,
          description,
          coverUrl: "",
          owner: get().user,
          collaborative: false,
          public: true,
          tracks: [],
          followers: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tags: [],
          mood: [],
        };
        set((state) => ({ playlists: [playlist, ...state.playlists] }));
        return playlist;
      },

      addToPlaylist: (playlistId, tracks) =>
        set((state) => {
          const list = Array.isArray(tracks) ? tracks : [tracks];
          return {
            playlists: state.playlists.map((p) => {
              if (p.id !== playlistId) return p;
              const existing = new Set(p.tracks.map((t) => t.id));
              const newTracks = list.filter((t) => !existing.has(t.id));
              const tracksToAdd = newTracks.length > 0 ? newTracks : list.slice(0, 1);
              return {
                ...p,
                tracks: [...p.tracks, ...tracksToAdd],
                coverUrl: p.coverUrl || tracksToAdd[0]?.coverUrl || "",
                updatedAt: new Date().toISOString(),
              };
            }),
          };
        }),

      removeFromPlaylist: (playlistId, trackId) =>
        set((state) => ({
          playlists: state.playlists.map((p) =>
            p.id === playlistId ? { ...p, tracks: p.tracks.filter((t) => t.id !== trackId) } : p
          ),
        })),

      deletePlaylist: (playlistId) =>
        set((state) => ({ playlists: state.playlists.filter((p) => p.id !== playlistId) })),

      addToHistory: (track) =>
        set((state) => {
          const history = [track, ...state.history.filter((t) => t.id !== track.id)].slice(0, 100);
          return {
            history,
            playCounts: { ...state.playCounts, [track.id]: (state.playCounts[track.id] ?? 0) + 1 },
            user: { ...state.user, recentlyPlayed: history.slice(0, 20) },
          };
        }),

      clearHistory: () => set({ history: [], user: { ...get().user, recentlyPlayed: [] } }),

      isTrackLiked: (trackId) => get().likedTracks.some((t) => t.id === trackId),
      isAlbumLiked: (albumId) => get().likedAlbums.some((a) => a.id === albumId),
      isArtistFollowed: (artistId) => get().followedArtists.some((a) => a.id === artistId),
    }),
    {
      name: "resonance-library",
      partialize: (state) => ({
        likedTracks: state.likedTracks,
        likedAlbums: state.likedAlbums,
        followedArtists: state.followedArtists,
        playlists: state.playlists,
        history: state.history,
        playCounts: state.playCounts,
      }),
    }
  )
);

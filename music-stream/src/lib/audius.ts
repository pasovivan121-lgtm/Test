/**
 * Audius catalogue client.
 *
 * Audius is a free, artist-owned, open music network. Its discovery API requires
 * no key and serves CORS `*`, so it can be queried straight from the browser.
 * Streams are served as real MP3 over HTTP range requests.
 *
 * Docs: https://docs.audius.org/api
 */

const API = "https://discoveryprovider.audius.co/v1";
const APP = "resonance";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface AudiusUser {
  id: string;
  name: string;
  handle?: string;
  profile_picture?: AudiusArtwork | null;
  follower_count?: number;
  track_count?: number;
  bio?: string;
  is_verified?: boolean;
}

export interface AudiusArtwork {
  "150x150"?: string;
  "480x480"?: string;
  "1000x1000"?: string;
}

export interface AudiusTrack {
  id: string;
  title: string;
  duration: number;
  genre: string;
  mood?: string | null;
  tags?: string[];
  play_count: number;
  favorite_count?: number;
  repost_count?: number;
  release_date?: string;
  description?: string;
  is_streamable: boolean;
  is_downloadable?: boolean;
  is_explicit?: boolean;
  license?: string;
  bpm?: number | null;
  musical_key?: string | null;
  artwork?: AudiusArtwork | null;
  user: AudiusUser;
  copyright_line?: string;
  contributors?: { user_id: string }[];
}

export interface AudiusPlaylist {
  id: string;
  playlist_name: string;
  description?: string;
  total_play_count: number;
  is_album: boolean;
  artwork?: AudiusArtwork | null;
  user: AudiusUser;
  tracks?: AudiusTrack[];
}

export interface AudiusPage<T> {
  data: T[];
  next?: { next_page_url?: string | null } | null;
}

/* ------------------------------------------------------------------ */
/*  Core requests                                                      */
/* ------------------------------------------------------------------ */

function withApp(url: string): string {
  return url.includes("app_name=") ? url : `${url}${url.includes("?") ? "&" : "?"}app_name=${APP}`;
}

export class AudiusError extends Error {
  constructor(
    message: string,
    readonly status?: number
  ) {
    super(message);
    this.name = "AudiusError";
  }
}

async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(withApp(path), {
    signal,
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = (await res.json()) as { error?: string };
      if (body?.error) detail = body.error;
    } catch {
      /* non-JSON error body */
    }
    throw new AudiusError(detail, res.status);
  }
  return (await res.json()) as T;
}

const clean = (s?: string | null) => (s ?? "").trim();
const strip = (s?: string | null) => clean(s).replace(/\s+/g, " ");

/* ------------------------------------------------------------------ */
/*  Public queries                                                     */
/* ------------------------------------------------------------------ */

export function searchTracks(query: string, limit = 30, genre?: string, signal?: AbortSignal) {
  const params = new URLSearchParams({ query, limit: String(limit) });
  if (genre) params.set("genre", genre);
  return request<AudiusPage<AudiusTrack>>(`/tracks/search?${params}`, signal).then((r) => r.data ?? []);
}

export function trendingTracks(limit = 30, genre?: string, signal?: AbortSignal) {
  const params = new URLSearchParams({ limit: String(limit) });
  if (genre) params.set("genre", genre);
  return request<AudiusPage<AudiusTrack>>(`/tracks/trending?${params}`, signal).then((r) => r.data ?? []);
}

export function trendingPlaylists(limit = 20, signal?: AbortSignal) {
  return request<AudiusPage<AudiusPlaylist>>(
    `/playlists/trending?limit=${limit}`,
    signal
  ).then((r) => r.data ?? []);
}

export function playlist(playlistId: string, signal?: AbortSignal) {
  return request<{ data?: AudiusPlaylist }>(`/playlists/${playlistId}`, signal).then((r) => r.data!);
}

export function artistTracks(userId: string, limit = 50, signal?: AbortSignal) {
  return request<AudiusPage<AudiusTrack>>(`/users/${userId}/tracks?limit=${limit}`, signal).then(
    (r) => r.data ?? []
  );
}

export function track(trackId: string, signal?: AbortSignal) {
  return request<{ data?: AudiusTrack }>(`/tracks/${trackId}`, signal).then((r) => r.data!);
}

/** Direct MP3 URL. The API 302s to a signed CDN link that the audio element follows. */
export function streamUrl(trackId: string): string {
  return withApp(`${API}/tracks/${trackId}/stream`);
}

export function artworkUrl(
  artwork: AudiusArtwork | null | undefined,
  size: "150x150" | "480x480" | "1000x1000" = "480x480"
): string {
  return artwork?.[size] ?? artwork?.["480x480"] ?? artwork?.["150x150"] ?? "";
}

/** Genres observed across the catalogue, used for the browse filter. */
export const GENRES = [
  "Electronic",
  "Hip-Hop",
  "Jazz",
  "Pop",
  "R&B",
  "Rock",
  "Metal",
  "Techno",
  "House",
  "Ambient",
  "Classical",
  "Folk",
  "Punk",
  "Trap",
  "Lo-Fi",
  "Soul",
  "Reggae",
  "Country",
  "Gospel",
  "Experimental",
] as const;

export type AudiusGenre = (typeof GENRES)[number];

/* ------------------------------------------------------------------ */
/*  Domain mapping                                                     */
/* ------------------------------------------------------------------ */

export interface AudiusMappedTrack {
  id: string;
  title: string;
  artistName: string;
  artistId: string;
  artistHandle: string;
  artistAvatar: string;
  duration: number;
  genre: string;
  mood: string[];
  artwork: string;
  playCount: number;
  favoriteCount: number;
  releaseDate: string;
  audioUrl: string;
  description: string;
  isExplicit: boolean;
  isStreamable: boolean;
  license: string;
  bpm: number | null;
  musicalKey: string | null;
  source: "audius";
  sourceId: string;
  permalink: string;
}

export function mapTrack(t: AudiusTrack): AudiusMappedTrack {
  const genres = [t.genre, ...(t.tags ?? []).map((x) => x.split(":")[0])].filter(Boolean);
  const moods = [t.mood, t.musical_key].filter((x): x is string => !!x && x !== "None");
  return {
    id: t.id,
    title: strip(t.title) || "Untitled",
    artistName: strip(t.user?.name) || "Unknown artist",
    artistId: t.user?.id ?? "",
    artistHandle: t.user?.handle ?? "",
    artistAvatar: artworkUrl(t.user?.profile_picture, "150x150"),
    duration: t.duration ?? 0,
    genre: t.genre || "Other",
    mood: [...new Set(moods)],
    artwork: artworkUrl(t.artwork),
    playCount: t.play_count ?? 0,
    favoriteCount: t.favorite_count ?? 0,
    releaseDate: t.release_date ?? "",
    audioUrl: t.is_streamable ? streamUrl(t.id) : "",
    description: strip(t.description),
    isExplicit: !!t.is_explicit,
    isStreamable: !!t.is_streamable,
    license: t.license ?? "All rights reserved",
    bpm: t.bpm ?? null,
    musicalKey: t.musical_key && t.musical_key !== "None" ? t.musical_key : null,
    source: "audius" as const,
    sourceId: t.id,
    permalink: t.user?.handle ? `https://audius.co/${t.user.handle}/${t.id}` : `https://audius.co`,
  };
}

export function mapTracks(list: AudiusTrack[]): AudiusMappedTrack[] {
  return list.filter((t) => t && t.id).map(mapTrack);
}

export interface AudiusMappedPlaylist {
  id: string;
  title: string;
  description: string;
  artwork: string;
  trackCount: number;
  playCount: number;
  isAlbum: boolean;
  ownerName: string;
  ownerAvatar: string;
  source: "audius";
}

export function mapPlaylist(p: AudiusPlaylist): AudiusMappedPlaylist {
  return {
    id: p.id,
    title: strip(p.playlist_name) || "Untitled playlist",
    description: strip(p.description),
    artwork: artworkUrl(p.artwork),
    trackCount: Array.isArray(p.tracks) ? p.tracks.length : 0,
    playCount: p.total_play_count ?? 0,
    isAlbum: !!p.is_album,
    ownerName: strip(p.user?.name) || "Unknown",
    ownerAvatar: artworkUrl(p.user?.profile_picture, "150x150"),
    source: "audius" as const,
  };
}

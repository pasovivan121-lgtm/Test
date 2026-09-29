export interface Track {
  id: string;
  title: string;
  artist: Artist;
  album: Album;
  duration: number;
  coverUrl: string;
  audioUrl: string;
  playCount: number;
  liked: boolean;
  explicit: boolean;
  trackNumber: number;
  discNumber: number;
  releaseDate: string;
  genre: string[];
  mood: string[];
  lyrics?: Lyrics;
  credits?: Credit[];
}

export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
  headerUrl: string;
  bio: string;
  verified: boolean;
  monthlyListeners: number;
  followers: number;
  genres: string[];
  topTracks: Track[];
  albums: Album[];
  relatedArtists: Artist[];
}

export interface Album {
  id: string;
  title: string;
  artist: Artist;
  coverUrl: string;
  releaseDate: string;
  totalTracks: number;
  duration: number;
  type: 'album' | 'single' | 'ep' | 'compilation';
  label: string;
  copyright: string;
  tracks: Track[];
  genres: string[];
  mood: string[];
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  owner: User;
  collaborative: boolean;
  public: boolean;
  tracks: Track[];
  followers: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  mood: string[];
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bannerUrl: string;
  bio: string;
  followers: number;
  following: number;
  playlists: Playlist[];
  likedTracks: Track[];
  likedAlbums: Album[];
  followedArtists: Artist[];
  recentlyPlayed: Track[];
  topTracks: Track[];
  topArtists: Artist[];
  topGenres: string[];
}

export interface Lyrics {
  synced: SyncedLyric[];
  unsynced: string;
  language: string;
}

export interface SyncedLyric {
  time: number;
  text: string;
}

export interface Credit {
  role: string;
  name: string;
  artist?: Artist;
}

export interface QueueItem {
  track: Track;
  source: 'playlist' | 'album' | 'artist' | 'search' | 'radio' | 'queue';
  sourceId: string;
  addedAt: number;
}

export interface PlaybackState {
  isPlaying: boolean;
  currentTrack: Track | null;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  repeatMode: 'off' | 'context' | 'track';
  shuffle: boolean;
  queue: QueueItem[];
  queueIndex: number;
  crossfade: boolean;
  gaplessPlayback: boolean;
  audioQuality: 'low' | 'normal' | 'high' | 'very_high';
}

export interface SearchResult {
  tracks: Track[];
  artists: Artist[];
  albums: Album[];
  playlists: Playlist[];
  profiles: User[];
  shows: Show[];
  episodes: Episode[];
}

export interface Show {
  id: string;
  title: string;
  publisher: string;
  coverUrl: string;
  description: string;
  episodes: Episode[];
  followers: number;
  explicit: boolean;
  language: string;
}

export interface Episode {
  id: string;
  title: string;
  show: Show;
  duration: number;
  releaseDate: string;
  coverUrl: string;
  audioUrl: string;
  description: string;
  explicit: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  gradients: string[];
}

export interface Mood {
  id: string;
  name: string;
  icon: string;
  color: string;
  playlists: Playlist[];
}

export interface Genre {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  subGenres: string[];
  topArtists: Artist[];
  topPlaylists: Playlist[];
  topAlbums: Album[];
}

export interface RadioStation {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  seed: Track | Artist | Album | Playlist;
  tracks: Track[];
}

export interface Recommendation {
  id: string;
  type: 'track' | 'album' | 'playlist' | 'artist' | 'show';
  reason: string;
  seed: Track | Artist | Album | Playlist;
  item: Track | Album | Playlist | Artist | Show;
  score: number;
}

export interface Notification {
  id: string;
  type: 'new_release' | 'concert' | 'playlist_update' | 'follow' | 'mention' | 'system';
  title: string;
  message: string;
  imageUrl?: string;
  actionUrl?: string;
  read: boolean;
  createdAt: string;
}

export interface Device {
  id: string;
  name: string;
  type: 'computer' | 'smartphone' | 'tablet' | 'speaker' | 'tv' | 'car' | 'gaming_console' | 'wearable' | 'other';
  volume: number;
  isActive: boolean;
  isPrivateSession: boolean;
  supportsVolumeControl: boolean;
}

export interface EqualizerPreset {
  id: string;
  name: string;
  bands: number[];
  genre?: string;
}

export interface SleepTimer {
  duration: number;
  endTime: number;
  active: boolean;
}

export interface CrossfadeSettings {
  enabled: boolean;
  duration: number;
}

export interface DataSaverSettings {
  enabled: boolean;
  audioQuality: 'low' | 'normal';
  videoQuality: 'low' | 'normal';
  downloadQuality: 'low' | 'normal';
}

export interface SocialSettings {
  showActivity: boolean;
  showListeningHistory: boolean;
  showFollowedArtists: boolean;
  allowMessages: boolean;
}

export interface AccessibilitySettings {
  reduceMotion: boolean;
  highContrast: boolean;
  screenReaderOptimized: boolean;
  keyboardNavigation: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra_large';
}

export interface PlaybackSettings {
  crossfade: CrossfadeSettings;
  gaplessPlayback: boolean;
  automix: boolean;
  normalizeVolume: boolean;
  audioQuality: 'low' | 'normal' | 'high' | 'very_high';
  downloadQuality: 'low' | 'normal' | 'high' | 'very_high';
  streamingQuality: 'low' | 'normal' | 'high' | 'very_high';
}

export interface AppSettings {
  playback: PlaybackSettings;
  dataSaver: DataSaverSettings;
  social: SocialSettings;
  accessibility: AccessibilitySettings;
  language: string;
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  hardwareAcceleration: boolean;
}
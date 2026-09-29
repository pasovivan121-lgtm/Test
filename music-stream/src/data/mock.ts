import type { Album, Artist, Category, Episode, Genre, Mood, Playlist, Show, Track } from "@/types";

export const ARTISTS: Artist[] = [
  {
    id: "ar-1",
    name: "Luna Reyes",
    verified: true,
    monthlyListeners: 28_400_000,
    followers: 8_920_000,
    genres: ["Alt Pop", "Dream Pop"],
    bio: "Luna Reyes writes music for the hour after midnight — neon-soft synths, close-mic vocals and lyrics that feel like a half-remembered conversation. Raised between Madrid and Los Angeles, she records everything to tape first and trusts the imperfection.",
    imageUrl: "",
    headerUrl: "",
    topTracks: [],
    albums: [],
    relatedArtists: [],
  },
  {
    id: "ar-2",
    name: "KORVYN",
    verified: true,
    monthlyListeners: 14_100_000,
    followers: 3_310_000,
    genres: ["Electronic", "Hyperpop"],
    bio: "A masked producer known for glitchy, maximalist club music. KORVYN never shows a face — only a silhouette, a signature distortion pedal and an absurdly modular studio.",
    imageUrl: "",
    headerUrl: "",
    topTracks: [],
    albums: [],
    relatedArtists: [],
  },
  {
    id: "ar-3",
    name: "The Paper Kites Society",
    verified: false,
    monthlyListeners: 6_240_000,
    followers: 820_000,
    genres: ["Folk", "Indie"],
    bio: "Four friends, four guitars, one very old recording booth. The Paper Kites Society have been writing since university and still refuse to use a click track.",
    imageUrl: "",
    headerUrl: "",
    topTracks: [],
    albums: [],
    relatedArtists: [],
  },
  {
    id: "ar-4",
    name: "Odessa Grey",
    verified: true,
    monthlyListeners: 41_700_000,
    followers: 15_600_000,
    genres: ["R&B", "Neo Soul"],
    bio: "Odessa Grey turns small observations into enormous records. Three number-one albums, one legendary live band and a vocal range her engineers refuse to discuss.",
    imageUrl: "",
    headerUrl: "",
    topTracks: [],
    albums: [],
    relatedArtists: [],
  },
  {
    id: "ar-5",
    name: "Night Orchard",
    verified: true,
    monthlyListeners: 9_800_000,
    followers: 2_100_000,
    genres: ["Ambient", "Post-Rock"],
    bio: "Night Orchard make music for empty train platforms at 5am. Long, patient pieces built from tape loops, bowed cymbals and field recordings.",
    imageUrl: "",
    headerUrl: "",
    topTracks: [],
    albums: [],
    relatedArtists: [],
  },
  {
    id: "ar-6",
    name: "DJ HALCYON",
    verified: true,
    monthlyListeners: 19_300_000,
    followers: 5_400_000,
    genres: ["House", "Disco"],
    bio: "Resident DJ for a club that technically does not exist. HALCYON plays disco edits with a jazz sensibility and a flawless read of a room.",
    imageUrl: "",
    headerUrl: "",
    topTracks: [],
    albums: [],
    relatedArtists: [],
  },
  {
    id: "ar-7",
    name: "Mika Sørensen",
    verified: false,
    monthlyListeners: 3_200_000,
    followers: 410_000,
    genres: ["Jazz", "Soul"],
    bio: "A Norwegian vocalist and arranger with a voice like warm wood. Her trio records live, in one take, in a room with the windows open.",
    imageUrl: "",
    headerUrl: "",
    topTracks: [],
    albums: [],
    relatedArtists: [],
  },
  {
    id: "ar-8",
    name: "Static Bloom",
    verified: true,
    monthlyListeners: 7_600_000,
    followers: 1_240_000,
    genres: ["Shoegaze", "Noise"],
    bio: "Static Bloom make beautiful noise. Four people, eight pedals and a wall of vintage fuzz units that must be carried up two flights of stairs.",
    imageUrl: "",
    headerUrl: "",
    topTracks: [],
    albums: [],
    relatedArtists: [],
  },
];

const artist = (id: string) => ARTISTS.find((a) => a.id === id)!;

interface TrackSeed {
  id: string;
  title: string;
  artistId: string;
  albumId: string;
  duration: number;
  playCount: number;
  explicit?: boolean;
  trackNumber: number;
  discNumber?: number;
  releaseDate: string;
  genre: string[];
  mood: string[];
  lyrics?: { time: number; text: string }[];
}

const TRACK_SEEDS: TrackSeed[] = [
  { id: "t-1", title: "Afterglow Avenue", artistId: "ar-1", albumId: "al-1", duration: 214, playCount: 512_000_000, trackNumber: 1, releaseDate: "2025-03-14", genre: ["Alt Pop"], mood: ["Dreamy", "Romantic"] },
  { id: "t-2", title: "Paper Moons", artistId: "ar-1", albumId: "al-1", duration: 198, playCount: 341_000_000, trackNumber: 2, releaseDate: "2025-03-14", genre: ["Alt Pop"], mood: ["Nostalgic"] },
  { id: "t-3", title: "Half-Light", artistId: "ar-1", albumId: "al-1", duration: 265, playCount: 288_000_000, trackNumber: 3, releaseDate: "2025-03-14", genre: ["Dream Pop"], mood: ["Melancholy"] },
  { id: "t-4", title: "Violet Static", artistId: "ar-1", albumId: "al-1", duration: 231, playCount: 197_000_000, trackNumber: 4, releaseDate: "2025-03-14", genre: ["Alt Pop"], mood: ["Dreamy"] },
  { id: "t-5", title: "Coin Laundry", artistId: "ar-1", albumId: "al-2", duration: 187, playCount: 154_000_000, trackNumber: 1, releaseDate: "2025-11-07", genre: ["Alt Pop"], mood: ["Warm"] },
  { id: "t-6", title: "Nocturne for Six Strings", artistId: "ar-3", albumId: "al-3", duration: 254, playCount: 88_000_000, trackNumber: 1, releaseDate: "2024-08-02", genre: ["Folk"], mood: ["Acoustic", "Calm"] },
  { id: "t-7", title: "Harbour Light", artistId: "ar-3", albumId: "al-3", duration: 221, playCount: 64_000_000, trackNumber: 2, releaseDate: "2024-08-02", genre: ["Folk"], mood: ["Calm"] },
  { id: "t-8", title: "Copper Wire", artistId: "ar-3", albumId: "al-3", duration: 302, playCount: 41_000_000, trackNumber: 3, releaseDate: "2024-08-02", genre: ["Folk"], mood: ["Melancholy"] },
  { id: "t-9", title: "GLASS CATHEDRAL", artistId: "ar-2", albumId: "al-4", duration: 176, playCount: 620_000_000, trackNumber: 1, releaseDate: "2026-01-20", genre: ["Hyperpop"], mood: ["Energetic", "Chaotic"] },
  { id: "t-10", title: "Softcore Machine", artistId: "ar-2", albumId: "al-4", duration: 143, playCount: 430_000_000, trackNumber: 2, releaseDate: "2026-01-20", genre: ["Electronic"], mood: ["Energetic"] },
  { id: "t-11", title: "Broke My Own Rules", artistId: "ar-2", albumId: "al-4", duration: 198, playCount: 288_000_000, trackNumber: 3, releaseDate: "2026-01-20", genre: ["Hyperpop"], mood: ["Defiant"] },
  { id: "t-12", title: "Sugar Static", artistId: "ar-2", albumId: "al-4", duration: 161, playCount: 210_000_000, trackNumber: 4, releaseDate: "2026-01-20", genre: ["Electronic"], mood: ["Playful"] },
  { id: "t-13", title: "Tell Me Twice", artistId: "ar-4", albumId: "al-5", duration: 232, playCount: 890_000_000, trackNumber: 1, releaseDate: "2025-05-30", genre: ["R&B"], mood: ["Warm", "Romantic"] },
  { id: "t-14", title: "Come Over Slow", artistId: "ar-4", albumId: "al-5", duration: 247, playCount: 740_000_000, trackNumber: 2, releaseDate: "2025-05-30", genre: ["Neo Soul"], mood: ["Warm"] },
  { id: "t-15", title: "Gold Teeth Smile", artistId: "ar-4", albumId: "al-5", duration: 208, playCount: 660_000_000, trackNumber: 3, releaseDate: "2025-05-30", genre: ["R&B"], mood: ["Confident"] },
  { id: "t-16", title: "Sunday Devotion", artistId: "ar-4", albumId: "al-5", duration: 289, playCount: 512_000_000, trackNumber: 4, releaseDate: "2025-05-30", genre: ["R&B"], mood: ["Soulful"] },
  { id: "t-17", title: "Third Platform, 4am", artistId: "ar-5", albumId: "al-6", duration: 421, playCount: 42_000_000, trackNumber: 1, releaseDate: "2024-10-11", genre: ["Ambient"], mood: ["Calm", "Cinematic"] },
  { id: "t-18", title: "Signal Fade", artistId: "ar-5", albumId: "al-6", duration: 367, playCount: 31_000_000, trackNumber: 2, releaseDate: "2024-10-11", genre: ["Post-Rock"], mood: ["Cinematic"] },
  { id: "t-19", title: "Winterlight", artistId: "ar-5", albumId: "al-6", duration: 512, playCount: 22_000_000, trackNumber: 3, releaseDate: "2024-10-11", genre: ["Ambient"], mood: ["Calm"] },
  { id: "t-20", title: "Basement Groove (Extended)", artistId: "ar-6", albumId: "al-7", duration: 428, playCount: 310_000_000, trackNumber: 1, releaseDate: "2025-02-14", genre: ["House"], mood: ["Energetic", "Groovy"] },
  { id: "t-21", title: "Love Language", artistId: "ar-6", albumId: "al-7", duration: 312, playCount: 265_000_000, trackNumber: 2, releaseDate: "2025-02-14", genre: ["Disco"], mood: ["Groovy"] },
  { id: "t-22", title: "Tangerine Disco", artistId: "ar-6", albumId: "al-7", duration: 287, playCount: 194_000_000, trackNumber: 3, releaseDate: "2025-02-14", genre: ["Disco"], mood: ["Playful"] },
  { id: "t-23", title: "Oslo Rain", artistId: "ar-7", albumId: "al-8", duration: 276, playCount: 28_000_000, trackNumber: 1, releaseDate: "2025-09-05", genre: ["Jazz"], mood: ["Calm", "Warm"] },
  { id: "t-24", title: "Blue Hour Blues", artistId: "ar-7", albumId: "al-8", duration: 334, playCount: 19_000_000, trackNumber: 2, releaseDate: "2025-09-05", genre: ["Soul"], mood: ["Melancholy"] },
  { id: "t-25", title: "Northern Air", artistId: "ar-7", albumId: "al-8", duration: 298, playCount: 12_000_000, trackNumber: 3, releaseDate: "2025-09-05", genre: ["Jazz"], mood: ["Calm"] },
  { id: "t-26", title: "Fuzz Cathedral", artistId: "ar-8", albumId: "al-9", duration: 341, playCount: 54_000_000, trackNumber: 1, explicit: true, releaseDate: "2026-03-01", genre: ["Shoegaze"], mood: ["Chaotic", "Dreamy"] },
  { id: "t-27", title: "Feedback Lullaby", artistId: "ar-8", albumId: "al-9", duration: 267, playCount: 38_000_000, trackNumber: 2, releaseDate: "2026-03-01", genre: ["Noise"], mood: ["Dreamy"] },
  { id: "t-28", title: "Reverb Tank", artistId: "ar-8", albumId: "al-9", duration: 389, playCount: 21_000_000, trackNumber: 3, releaseDate: "2026-03-01", genre: ["Shoegaze"], mood: ["Cinematic"] },
  { id: "t-29", title: "Midnight Rewind", artistId: "ar-1", albumId: "al-10", duration: 245, playCount: 176_000_000, trackNumber: 1, releaseDate: "2025-07-18", genre: ["Alt Pop"], mood: ["Nostalgic", "Energetic"] },
  { id: "t-30", title: "Telephone Weather", artistId: "ar-1", albumId: "al-10", duration: 212, playCount: 143_000_000, trackNumber: 2, releaseDate: "2025-07-18", genre: ["Alt Pop"], mood: ["Playful"] },
  { id: "t-31", title: "Cassette Sunburn", artistId: "ar-1", albumId: "al-10", duration: 226, playCount: 98_000_000, trackNumber: 3, releaseDate: "2025-07-18", genre: ["Dream Pop"], mood: ["Warm"] },
  { id: "t-32", title: "Velvet Antenna", artistId: "ar-4", albumId: "al-11", duration: 258, playCount: 402_000_000, trackNumber: 1, releaseDate: "2026-02-13", genre: ["R&B"], mood: ["Warm"] },
  { id: "t-33", title: "Slow Burn Rumour", artistId: "ar-4", albumId: "al-11", duration: 271, playCount: 356_000_000, trackNumber: 2, releaseDate: "2026-02-13", genre: ["Neo Soul"], mood: ["Defiant"] },
  { id: "t-34", title: "Honeycomb", artistId: "ar-4", albumId: "al-11", duration: 234, playCount: 288_000_000, trackNumber: 3, releaseDate: "2026-02-13", genre: ["R&B"], mood: ["Confident"] },
];

interface AlbumSeed {
  id: string;
  title: string;
  artistId: string;
  releaseDate: string;
  type: Album["type"];
  label: string;
  tracks: string[];
  genres: string[];
  mood: string[];
  copyright: string;
}

const ALBUM_SEEDS: AlbumSeed[] = [
  { id: "al-1", title: "Afterglow Avenue", artistId: "ar-1", releaseDate: "2025-03-14", type: "album", label: "Solstice Records", tracks: ["t-1", "t-2", "t-3", "t-4"], genres: ["Alt Pop", "Dream Pop"], mood: ["Dreamy", "Melancholy"], copyright: "℗ 2025 Solstice Records" },
  { id: "al-2", title: "Coin Laundry", artistId: "ar-1", releaseDate: "2025-11-07", type: "single", label: "Solstice Records", tracks: ["t-5"], genres: ["Alt Pop"], mood: ["Warm"], copyright: "℗ 2025 Solstice Records" },
  { id: "al-3", title: "Harbour Light Sessions", artistId: "ar-3", releaseDate: "2024-08-02", type: "ep", label: "Fieldnote", tracks: ["t-6", "t-7", "t-8"], genres: ["Folk", "Indie"], mood: ["Calm", "Acoustic"], copyright: "℗ 2024 Fieldnote" },
  { id: "al-4", title: "GLASS CATHEDRAL", artistId: "ar-2", releaseDate: "2026-01-20", type: "album", label: "NULL/VOID", tracks: ["t-9", "t-10", "t-11", "t-12"], genres: ["Hyperpop", "Electronic"], mood: ["Energetic", "Chaotic"], copyright: "℗ 2026 NULL/VOID" },
  { id: "al-5", title: "Tell Me Twice", artistId: "ar-4", releaseDate: "2025-05-30", type: "album", label: "Meridian", tracks: ["t-13", "t-14", "t-15", "t-16"], genres: ["R&B", "Neo Soul"], mood: ["Warm", "Soulful"], copyright: "℗ 2025 Meridian" },
  { id: "al-6", title: "Third Platform", artistId: "ar-5", releaseDate: "2024-10-11", type: "album", label: "Longform", tracks: ["t-17", "t-18", "t-19"], genres: ["Ambient", "Post-Rock"], mood: ["Calm", "Cinematic"], copyright: "℗ 2024 Longform" },
  { id: "al-7", title: "Basement Sessions Vol. 3", artistId: "ar-6", releaseDate: "2025-02-14", type: "compilation", label: "Subterranean", tracks: ["t-20", "t-21", "t-22"], genres: ["House", "Disco"], mood: ["Energetic", "Groovy"], copyright: "℗ 2025 Subterranean" },
  { id: "al-8", title: "Oslo Rain", artistId: "ar-7", releaseDate: "2025-09-05", type: "album", label: "Vinter", tracks: ["t-23", "t-24", "t-25"], genres: ["Jazz", "Soul"], mood: ["Calm", "Warm"], copyright: "℗ 2025 Vinter" },
  { id: "al-9", title: "Reverb Tank", artistId: "ar-8", releaseDate: "2026-03-01", type: "album", label: "Feedback Works", tracks: ["t-26", "t-27", "t-28"], genres: ["Shoegaze", "Noise"], mood: ["Chaotic", "Dreamy"], copyright: "℗ 2026 Feedback Works" },
  { id: "al-10", title: "Midnight Rewind", artistId: "ar-1", releaseDate: "2025-07-18", type: "ep", label: "Solstice Records", tracks: ["t-29", "t-30", "t-31"], genres: ["Alt Pop"], mood: ["Nostalgic", "Energetic"], copyright: "℗ 2025 Solstice Records" },
  { id: "al-11", title: "Velvet Antenna", artistId: "ar-4", releaseDate: "2026-02-13", type: "album", label: "Meridian", tracks: ["t-32", "t-33", "t-34"], genres: ["R&B"], mood: ["Warm", "Defiant"], copyright: "℗ 2026 Meridian" },
];

const LYRIC_LINES: Record<string, { time: number; text: string }[]> = {
  "t-1": [
    { time: 0, text: "[Verse 1]" },
    { time: 8, text: "Streetlights fold the evening out" },
    { time: 14, text: "Your name is all I'm thinking about" },
    { time: 21, text: "We were running down the avenue" },
    { time: 27, text: "Chasing every memory into you" },
    { time: 36, text: "[Chorus]" },
    { time: 38, text: "Meet me in the afterglow" },
    { time: 45, text: "Where the colours don't let go" },
    { time: 52, text: "Meet me in the afterglow" },
    { time: 59, text: "Don't be scared, don't be cold" },
    { time: 68, text: "[Verse 2]" },
    { time: 70, text: "Radio hums a borrowed song" },
    { time: 76, text: "We were certain we could never be wrong" },
    { time: 83, text: "Now the summer's in reverse" },
    { time: 90, text: "Every little thing still cuts" },
    { time: 98, text: "[Chorus]" },
    { time: 100, text: "Meet me in the afterglow" },
    { time: 107, text: "Where the colours don't let go" },
    { time: 114, text: "Meet me in the afterglow" },
    { time: 121, text: "Don't be scared, don't be cold" },
  ],
  "t-13": [
    { time: 0, text: "[Verse 1]" },
    { time: 9, text: "I got a habit of saying the wrong thing" },
    { time: 16, text: "Then you tell me twice, and it's a song" },
    { time: 24, text: "I got a heart with a lock on the hinge" },
    { time: 31, text: "But you keep the key where the good things go" },
    { time: 41, text: "[Chorus]" },
    { time: 43, text: "Tell me twice, tell me slow" },
    { time: 50, text: "Every word got a place to go" },
    { time: 57, text: "Tell me twice, say it right" },
    { time: 64, text: "Stay till the street turns light" },
  ],
  "t-9": [
    { time: 0, text: "[Intro]" },
    { time: 12, text: "(build)" },
    { time: 30, text: "[Drop]" },
    { time: 32, text: "I built a cathedral out of glass" },
    { time: 38, text: "And every sermon was a flash" },
    { time: 44, text: "You can see the cracks from space" },
    { time: 50, text: "But you came anyway, you came anyway" },
  ],
};

const albumStubs: Record<string, Album> = {};
const trackStubs: Record<string, Track> = {};

TRACK_SEEDS.forEach((seed) => {
  const track: Track = {
    id: seed.id,
    title: seed.title,
    artist: artist(seed.artistId),
    album: albumStubs[seed.albumId],
    duration: seed.duration,
    coverUrl: "",
    audioUrl: "",
    playCount: seed.playCount,
    liked: false,
    explicit: !!seed.explicit,
    trackNumber: seed.trackNumber,
    discNumber: seed.discNumber ?? 1,
    releaseDate: seed.releaseDate,
    genre: seed.genre,
    mood: seed.mood,
    lyrics: LYRIC_LINES[seed.id]
      ? {
          synced: LYRIC_LINES[seed.id],
          unsynced: LYRIC_LINES[seed.id].map((l) => l.text).join("\n"),
          language: "en",
        }
      : undefined,
    credits: [
      { role: "Primary Artist", name: artist(seed.artistId).name },
      { role: "Producer", name: artist(seed.artistId).name },
      { role: "Mixing", name: "A. Kestrel" },
    ],
  };
  trackStubs[seed.id] = track;
});

export const ALBUMS: Album[] = ALBUM_SEEDS.map((seed) => {
  const albumTracks = seed.tracks.map((tid) => trackStubs[tid]);
  const album: Album = {
    id: seed.id,
    title: seed.title,
    artist: artist(seed.artistId),
    coverUrl: "",
    releaseDate: seed.releaseDate,
    totalTracks: albumTracks.length,
    duration: albumTracks.reduce((sum, t) => sum + t.duration, 0),
    type: seed.type,
    label: seed.label,
    copyright: seed.copyright,
    genres: seed.genres,
    mood: seed.mood,
    tracks: albumTracks,
  };
  albumStubs[seed.id] = album;
  albumTracks.forEach((t) => (t.album = album));
  return album;
});

export const TRACKS: Track[] = ALBUM_SEEDS.flatMap((seed) => seed.tracks.map((tid) => trackStubs[tid]));
ARTISTS.forEach((a) => {
  a.topTracks = TRACKS.filter((t) => t.artist.id === a.id).sort((x, y) => y.playCount - x.playCount);
  a.albums = ALBUMS.filter((al) => al.artist.id === a.id);
  a.imageUrl = "";
  a.headerUrl = "";
});
ARTISTS.forEach((a) => {
  a.relatedArtists = ARTISTS.filter((x) => x.id !== a.id)
    .sort((x, y) => {
      const score = (art: Artist) => art.genres.filter((g) => a.genres.includes(g)).length;
      return score(y) - score(x);
    })
    .slice(0, 6);
});

export const PLAYLISTS: Playlist[] = [
  {
    id: "pl-1",
    title: "Midnight Drive",
    description: "Neon synths and open roads. No destinations, just the hum of the engine and the city blurring past.",
    coverUrl: "",
    owner: { id: "user-2", username: "nova", displayName: "Nova Reyes", avatarUrl: "", bannerUrl: "", bio: "", followers: 12000, following: 240, playlists: [], likedTracks: [], likedAlbums: [], followedArtists: [], recentlyPlayed: [], topTracks: [], topArtists: [], topGenres: [] },
    collaborative: false,
    public: true,
    tracks: ["t-1", "t-29", "t-13", "t-9", "t-5"].map((id) => TRACKS.find((t) => t.id === id)!),
    followers: 184_000,
    createdAt: "2025-01-10T00:00:00Z",
    updatedAt: "2026-08-01T00:00:00Z",
    tags: ["synth", "night", "driving"],
    mood: ["Dreamy", "Energetic"],
  },
  {
    id: "pl-2",
    title: "Coffee & Rain",
    description: "For slow mornings, warm mugs and windows that streak with weather.",
    coverUrl: "",
    owner: { id: "user-3", username: "milo", displayName: "Milo Adeyemi", avatarUrl: "", bannerUrl: "", bio: "", followers: 5400, following: 190, playlists: [], likedTracks: [], likedAlbums: [], followedArtists: [], recentlyPlayed: [], topTracks: [], topArtists: [], topGenres: [] },
    collaborative: true,
    public: true,
    tracks: ["t-6", "t-7", "t-23", "t-19", "t-8", "t-25"].map((id) => TRACKS.find((t) => t.id === id)!),
    followers: 42_000,
    createdAt: "2024-12-02T00:00:00Z",
    updatedAt: "2026-06-14T00:00:00Z",
    tags: ["acoustic", "morning", "jazz"],
    mood: ["Calm", "Warm"],
  },
  {
    id: "pl-3",
    title: "Euphoria: The After Hours",
    description: "Peak-hour serotonin. Bass that moves before you do.",
    coverUrl: "",
    owner: { id: "user-4", username: "djvale", displayName: "Vale", avatarUrl: "", bannerUrl: "", bio: "", followers: 310000, following: 88, playlists: [], likedTracks: [], likedAlbums: [], followedArtists: [], recentlyPlayed: [], topTracks: [], topArtists: [], topGenres: [] },
    collaborative: false,
    public: true,
    tracks: ["t-9", "t-10", "t-11", "t-20", "t-21", "t-12", "t-22"].map((id) => TRACKS.find((t) => t.id === id)!),
    followers: 1_240_000,
    createdAt: "2026-01-22T00:00:00Z",
    updatedAt: "2026-09-01T00:00:00Z",
    tags: ["dance", "club", "energy"],
    mood: ["Energetic", "Chaotic"],
  },
  {
    id: "pl-4",
    title: "Warm Kitchen",
    description: "Soul, R&B and the kind of records that sound like a hug.",
    coverUrl: "",
    owner: { id: "user-5", username: "sol", displayName: "Sol Marchetti", avatarUrl: "", bannerUrl: "", bio: "", followers: 21000, following: 320, playlists: [], likedTracks: [], likedAlbums: [], followedArtists: [], recentlyPlayed: [], topTracks: [], topArtists: [], topGenres: [] },
    collaborative: false,
    public: true,
    tracks: ["t-13", "t-14", "t-15", "t-16", "t-32", "t-33", "t-34"].map((id) => TRACKS.find((t) => t.id === id)!),
    followers: 96_000,
    createdAt: "2025-05-31T00:00:00Z",
    updatedAt: "2026-09-10T00:00:00Z",
    tags: ["soul", "rnb", "cozy"],
    mood: ["Warm", "Soulful"],
  },
  {
    id: "pl-5",
    title: "Weightless Focus",
    description: "Long, patient ambient pieces for deep work and slow afternoons.",
    coverUrl: "",
    owner: { id: "user-6", username: "iris", displayName: "Iris Chen", avatarUrl: "", bannerUrl: "", bio: "", followers: 78000, following: 150, playlists: [], likedTracks: [], likedAlbums: [], followedArtists: [], recentlyPlayed: [], topTracks: [], topArtists: [], topGenres: [] },
    collaborative: false,
    public: true,
    tracks: ["t-17", "t-18", "t-19", "t-28"].map((id) => TRACKS.find((t) => t.id === id)!),
    followers: 133_000,
    createdAt: "2024-11-20T00:00:00Z",
    updatedAt: "2026-04-18T00:00:00Z",
    tags: ["ambient", "focus", "cinematic"],
    mood: ["Calm", "Cinematic"],
  },
  {
    id: "pl-6",
    title: "Kitchen Disco Vol. 2",
    description: "Disco edits, extended mixes, zero shame.",
    coverUrl: "",
    owner: { id: "user-4", username: "djvale", displayName: "Vale", avatarUrl: "", bannerUrl: "", bio: "", followers: 310000, following: 88, playlists: [], likedTracks: [], likedAlbums: [], followedArtists: [], recentlyPlayed: [], topTracks: [], topArtists: [], topGenres: [] },
    collaborative: true,
    public: true,
    tracks: ["t-20", "t-21", "t-22", "t-30"].map((id) => TRACKS.find((t) => t.id === id)!),
    followers: 88_000,
    createdAt: "2025-08-01T00:00:00Z",
    updatedAt: "2026-08-20T00:00:00Z",
    tags: ["disco", "house", "party"],
    mood: ["Groovy", "Energetic"],
  },
  {
    id: "pl-7",
    title: "Wall of Fuzz",
    description: "Shoegaze, noise pop and beautiful chaos.",
    coverUrl: "",
    owner: { id: "user-7", username: "reverb", displayName: "Reverb Girl", avatarUrl: "", bannerUrl: "", bio: "", followers: 15000, following: 400, playlists: [], likedTracks: [], likedAlbums: [], followedArtists: [], recentlyPlayed: [], topTracks: [], topArtists: [], topGenres: [] },
    collaborative: false,
    public: true,
    tracks: ["t-26", "t-27", "t-28", "t-3", "t-4"].map((id) => TRACKS.find((t) => t.id === id)!),
    followers: 34_000,
    createdAt: "2026-03-05T00:00:00Z",
    updatedAt: "2026-09-12T00:00:00Z",
    tags: ["shoegaze", "noise", "dreamy"],
    mood: ["Chaotic", "Dreamy"],
  },
  {
    id: "pl-8",
    title: "Sunday Jazz",
    description: "Brushed drums, upright bass, and nowhere to be.",
    coverUrl: "",
    owner: { id: "user-8", username: "brass", displayName: "Brass & Bone", avatarUrl: "", bannerUrl: "", bio: "", followers: 41000, following: 210, playlists: [], likedTracks: [], likedAlbums: [], followedArtists: [], recentlyPlayed: [], topTracks: [], topArtists: [], topGenres: [] },
    collaborative: false,
    public: true,
    tracks: ["t-23", "t-24", "t-25", "t-7"].map((id) => TRACKS.find((t) => t.id === id)!),
    followers: 61_000,
    createdAt: "2025-09-10T00:00:00Z",
    updatedAt: "2026-02-02T00:00:00Z",
    tags: ["jazz", "soul", "sunday"],
    mood: ["Calm", "Warm"],
  },
];

export const CATEGORIES: Category[] = [
  { id: "c-1", name: "Made For You", icon: "sparkles", color: "#f43f5e", gradients: ["#f43f5e", "#7c3aed"] },
  { id: "c-2", name: "New Releases", icon: "sparkle", color: "#06b6d4", gradients: ["#06b6d4", "#3b82f6"] },
  { id: "c-3", name: "Pop", icon: "star", color: "#ec4899", gradients: ["#ec4899", "#f97316"] },
  { id: "c-4", name: "Hip-Hop", icon: "mic", color: "#f59e0b", gradients: ["#f59e0b", "#ef4444"] },
  { id: "c-5", name: "Electronic", icon: "zap", color: "#8b5cf6", gradients: ["#8b5cf6", "#06b6d4"] },
  { id: "c-6", name: "Jazz", icon: "music", color: "#14b8a6", gradients: ["#14b8a6", "#0ea5e9"] },
  { id: "c-7", name: "R&B", icon: "heart", color: "#f43f5e", gradients: ["#f43f5e", "#ec4899"] },
  { id: "c-8", name: "Indie", icon: "leaf", color: "#22c55e", gradients: ["#22c55e", "#84cc16"] },
  { id: "c-9", name: "Ambient", icon: "wind", color: "#3b82f6", gradients: ["#3b82f6", "#6366f1"] },
  { id: "c-10", name: "Classical", icon: "landmark", color: "#a78bfa", gradients: ["#a78bfa", "#e879f9"] },
  { id: "c-11", name: "Folk", icon: "tree", color: "#84cc16", gradients: ["#84cc16", "#22c55e"] },
  { id: "c-12", name: "Disco", icon: "disc", color: "#f97316", gradients: ["#f97316", "#eab308"] },
];

export const MOODS: Mood[] = [
  { id: "m-1", name: "Chill", icon: "wind", color: "#3b82f6", playlists: PLAYLISTS.filter((p) => p.mood.includes("Calm")) },
  { id: "m-2", name: "Energize", icon: "zap", color: "#f97316", playlists: PLAYLISTS.filter((p) => p.mood.includes("Energetic")) },
  { id: "m-3", name: "Romance", icon: "heart", color: "#ec4899", playlists: PLAYLISTS.filter((p) => p.mood.includes("Romantic")) },
  { id: "m-4", name: "Focus", icon: "target", color: "#14b8a6", playlists: PLAYLISTS.filter((p) => p.mood.includes("Calm") || p.tags.includes("focus")) },
  { id: "m-5", name: "Party", icon: "party", color: "#eab308", playlists: PLAYLISTS.filter((p) => p.tags.includes("party") || p.tags.includes("club")) },
  { id: "m-6", name: "Melancholy", icon: "cloud", color: "#6366f1", playlists: PLAYLISTS.filter((p) => p.mood.includes("Melancholy") || p.mood.includes("Nostalgic")) },
  { id: "m-7", name: "Dreamy", icon: "moon", color: "#a855f7", playlists: PLAYLISTS.filter((p) => p.mood.includes("Dreamy")) },
  { id: "m-8", name: "Workout", icon: "dumbbell", color: "#ef4444", playlists: PLAYLISTS.filter((p) => p.mood.includes("Chaotic") || p.mood.includes("Energetic")) },
];

export const GENRES: Genre[] = [
  { id: "g-1", name: "Alt Pop", imageUrl: "", description: "Pop with a little weather in it.", subGenres: ["Dream Pop", "Indie Pop", "Bedroom Pop"], topArtists: [ARTISTS[0]], topPlaylists: [PLAYLISTS[0]], topAlbums: [ALBUMS[0]] },
  { id: "g-2", name: "Electronic", imageUrl: "", description: "Machines with soul.", subGenres: ["House", "Hyperpop", "Ambient", "Techno"], topArtists: [ARTISTS[1], ARTISTS[5]], topPlaylists: [PLAYLISTS[2], PLAYLISTS[5]], topAlbums: [ALBUMS[3]] },
  { id: "g-3", name: "R&B", imageUrl: "", description: "Grooves that breathe.", subGenres: ["Neo Soul", "Trap", "Quiet Storm"], topArtists: [ARTISTS[3]], topPlaylists: [PLAYLISTS[3]], topAlbums: [ALBUMS[4], ALBUMS[10]] },
  { id: "g-4", name: "Jazz", imageUrl: "", description: "Late rooms and warm horns.", subGenres: ["Soul", "Bebop", "Cool Jazz"], topArtists: [ARTISTS[6]], topPlaylists: [PLAYLISTS[7]], topAlbums: [ALBUMS[7]] },
  { id: "g-5", name: "Folk", imageUrl: "", description: "Wood, wind and storytelling.", subGenres: ["Indie", "Singer-Songwriter"], topArtists: [ARTISTS[2]], topPlaylists: [PLAYLISTS[1]], topAlbums: [ALBUMS[2]] },
  { id: "g-6", name: "Shoegaze", imageUrl: "", description: "Beautifully loud.", subGenres: ["Noise Pop", "Dream Pop"], topArtists: [ARTISTS[7]], topPlaylists: [PLAYLISTS[6]], topAlbums: [ALBUMS[8]] },
];

export const SHOWS: Show[] = [
  {
    id: "s-1",
    title: "The Listening Room",
    publisher: "Resonance Originals",
    coverUrl: "",
    description: "Unscripted conversations with the artists shaping the year. Recorded live, no edits, no talking over the good part.",
    followers: 1_200_000,
    explicit: false,
    language: "English",
    episodes: [],
  },
  {
    id: "s-2",
    title: "Basement Transmission",
    publisher: "Subterranean",
    coverUrl: "",
    description: "A DJ and a sound engineer argue about a kick drum, then play something beautiful about it.",
    followers: 430_000,
    explicit: true,
    language: "English",
    episodes: [],
  },
  {
    id: "s-3",
    title: "Field Recordings",
    publisher: "Longform",
    coverUrl: "",
    description: "Ambient, minimal and occasionally silent. For working, reading or staring out of windows.",
    followers: 260_000,
    explicit: false,
    language: "English",
    episodes: [],
  },
];

const EPISODE_SEEDS: [string, string, number, string][] = [
  ["ep-1", "Luna Reyes on writing songs at 3am", 3620, "s-1"],
  ["ep-2", "Odessa Grey: the vocal warm-up nobody sees", 4180, "s-1"],
  ["ep-3", "Night Orchard in a train station", 5410, "s-1"],
  ["ep-4", "Why every club needs a bad sound system", 2760, "s-2"],
  ["ep-5", "DJ HALCYON on reading a room", 3120, "s-2"],
  ["ep-6", "Making a beat with one oscillator", 4810, "s-2"],
  ["ep-7", "One hour of rain, recorded in Oslo", 5820, "s-3"],
  ["ep-8", "The sound of an empty warehouse at dawn", 6240, "s-3"],
];

export const EPISODES: Episode[] = EPISODE_SEEDS.map(([id, title, duration, showId]) => {
  const show = SHOWS.find((s) => s.id === showId)!;
  return {
    id,
    title,
    show,
    duration,
    releaseDate: "2026-08-15T00:00:00Z",
    coverUrl: "",
    audioUrl: "",
    description: `${title}. A Resonance Originals production.`,
    explicit: show.explicit,
  };
});

SHOWS.forEach((show) => {
  show.episodes = EPISODES.filter((e) => e.show.id === show.id);
});

export const TRENDING_TRACKS = [...TRACKS].sort((a, b) => b.playCount - a.playCount).slice(0, 12);

export const CHART_ARTISTS = [...ARTISTS].sort((a, b) => b.monthlyListeners - a.monthlyListeners);

export const getTrack = (id: string) => TRACKS.find((t) => t.id === id);
export const getAlbum = (id: string) => ALBUMS.find((a) => a.id === id);
export const getArtist = (id: string) => ARTISTS.find((a) => a.id === id);
export const getPlaylist = (id: string) => PLAYLISTS.find((p) => p.id === id);

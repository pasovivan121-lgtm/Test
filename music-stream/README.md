# Resonance

A premium, ad-free music streaming experience — the full Spotify + YouTube feature surface, built as a
production-quality Next.js 16 app.

**Zero advertising anywhere in the product.** No pre-roll, no mid-roll, no banners, no ad-gated playback.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
```

## What's here

### Playback engine
- Real `HTMLAudioElement` transport with play/pause, seek, ±10s skip, previous/next
- Shuffle, repeat-off / repeat-context / repeat-one
- Volume, mute, per-device volume targeting
- Live queue: add, remove, **drag to reorder**, play-next, clear
- **Sleep timer** (5–60 min) that pauses playback on expiry
- Audio-quality selector (Low / Normal / High / Lossless FLAC)
- Crossfade + gapless playback toggles
- Seek-sync across the compact bar, the full-screen view and the queue panel
- **Local synth fallback** (`src/hooks/useAudioEngine.ts`) — when a track has no stream URL, a
  detuned Web Audio pad plus a simulated timeline keep playback fully functional offline

### Spotify-parity features
- **Home** — greeting, quick picks, "Jump back in", Made For You, mood browse, new releases, trending
- **Search** — full-text across songs / artists / albums / playlists / podcasts, with type tabs
- **Library** — Playlists, Artists, Albums, Liked Songs, History, Downloads, grid + list views,
  4 sort modes, live text filter
- **Album / Playlist / Artist detail** — hero headers with dynamic gradient theming, stats, tabbed
  artist pages (Overview / Popular / Albums / Related / About)
- **Queue** — reorderable upcoming list, listening history tab, session summary
- **Radio** — personalised stations seeded by artist, album and playlist
- **Charts** — daily/weekly/monthly/yearly, #1 hero, Top 50, trending albums and artists
- **Genres & Moods** — browse and filter by feel
- **Liked songs** with persisted likes, follows and playlists (`zustand/persist` → localStorage)
- **Podcast platform** — shows, episodes, publish dates, durations, per-show pages
- **Settings** — playback, audio quality, Wi-Fi/cellular/offline quality, data saver, explicit content,
  language, social privacy, private session, accessibility, clear listening history
- **Downloads** — storage meter, per-item progress, device limits
- **Premium upsell** — plan comparison, feature grid, trial flow
- **Devices** — 9 targets (laptop, phone, tablet, speaker, TV, car, console, watch) with active device

### YouTube-parity features
- **Podcasts** with shows and episodes
- **Full-screen Now Playing** — large artwork with ambient glow, click-to-seek
  time-scrubbed **synced lyrics**, ±10s transport, queue and share
- **Continuous playback** across albums → radio → queue with autoplay on end
- **Auto-advancing queue** that survives track completion
- **Share links** and cross-device "play on" handoff
- **Deep search** with trending queries and browse entry points

### Design
- Dark, near-black canvas with accent/cyan gradient theming — no default framework look
- Deterministic generated artwork (gradient + waveform bars) so the UI is fully self-contained
  with zero external image dependencies
- Glassmorphism surfaces, 10-layer backdrop blur, custom scrollbars
- Animated equalizer bars, hover-reveal play buttons, staggered entrance animations
- Fully responsive: desktop sidebar, mobile drawer + bottom tab bar + collapsible player
- `prefers-reduced-motion` respected throughout
- Accessible: ARIA roles/sliders, keyboard seek, focus-visible rings, ≥44px touch targets

## Structure

```
src/
├── app/                      # 16 routes (home, search, library, album, artist, playlist,
│                             #   charts, radio, podcasts, genre, mood, queue, settings,
│                             #   downloads, premium, liked)
├── components/
│   ├── layout/               # Sidebar, TopBar, MobileNav, AppShell
│   ├── media/                # Cards, TrackRow, DetailHeader
│   └── player/               # PlayerBar, QueuePanel, NowPlayingView, modals, settings
├── data/mock.ts              # 8 artists · 11 albums · 34 tracks · 8 playlists · 3 shows
│                             #   8 episodes · 6 genres · 8 moods · 12 categories
├── hooks/useAudioEngine.ts   # shared audio element + synth fallback
├── lib/utils.ts              # formatting, class merging
├── store/                    # zustand: player · library (persisted) · ui
└── types/index.ts            # full domain model
```

## Notes

Catalogue data is local and fictional — no label, artist or audio asset is used or implied. Playback
runs through a local Web Audio engine so the experience is complete and functional with no network
dependency. Swapping in a real catalogue means populating `Track.audioUrl`; the engine picks it up
automatically and uses the HTML audio path instead of the synth fallback.

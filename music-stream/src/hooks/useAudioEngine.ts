"use client";

import { useEffect, useRef } from "react";
import { usePlayerStore } from "@/store/player";
import { useLibraryStore } from "@/store/library";

/* ------------------------------------------------------------------ */
/*  Shared audio element                                               */
/* ------------------------------------------------------------------ */

let sharedAudio: HTMLAudioElement | null = null;

function getAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!sharedAudio) {
    sharedAudio = new Audio();
    sharedAudio.preload = "auto";
    sharedAudio.crossOrigin = "anonymous";
  }
  return sharedAudio;
}

/* ------------------------------------------------------------------ */
/*  Local synth fallback                                               */
/*  Used when a track has no stream URL, so playback always works.     */
/* ------------------------------------------------------------------ */

interface SynthState {
  ctx: AudioContext;
  gain: GainNode;
  nodes: AudioScheduledSourceNode[];
}

let synth: SynthState | null = null;
let synthTimer: ReturnType<typeof setInterval> | null = null;

function stopSynth() {
  if (synthTimer) {
    clearInterval(synthTimer);
    synthTimer = null;
  }
  if (synth) {
    const { ctx, nodes } = synth;
    nodes.forEach((n) => {
      try {
        n.stop();
      } catch {
        /* already stopped */
      }
    });
    synth = null;
    ctx.close().catch(() => {});
  }
}

function startSynth(volume: number, muted: boolean) {
  if (synth) return;
  const track = usePlayerStore.getState().currentTrack;
  const seed = track ? Number(track.id.replace(/\D/g, "")) || 7 : 7;
  const base = (seed % 5) * 22 + 110;
  const scale = [0, 3, 5, 7, 10, 12, 15];

  const startTimeline = () => {
    if (synthTimer) clearInterval(synthTimer);
    synthTimer = setInterval(() => {
      const s = usePlayerStore.getState();
      const total = s.currentTrack?.duration ?? 0;
      if (total <= 0) return;
      const next = Math.min(total, s.currentTime + 0.25);
      usePlayerStore.setState({ currentTime: next });
      if (next >= total) {
        stopSynth();
        s.playNext();
      }
    }, 250);
  };

  let Ctor: typeof AudioContext | null = null;
  if (typeof window !== "undefined") {
    Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext ??
      null;
  }
  if (!Ctor) {
    startTimeline();
    return;
  }

  try {
    const ctx = new Ctor();
    const gain = ctx.createGain();
    gain.gain.value = 0;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 900;

    gain.connect(filter);
    filter.connect(ctx.destination);

    const nodes: AudioScheduledSourceNode[] = [];
    for (let i = 0; i < 4; i++) {
      const osc = ctx.createOscillator();
      osc.type = i % 2 === 0 ? "sine" : "triangle";
      const semi = scale[(seed + i * 2) % scale.length];
      osc.frequency.value = base * Math.pow(2, semi / 12);
      osc.detune.value = (i - 1.5) * 6;

      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.05 + i * 0.03;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = base * 0.004;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      osc.connect(gain);
      osc.start();
      lfo.start();
      nodes.push(osc, lfo);
    }

    gain.gain.setTargetAtTime(muted ? 0 : volume * 0.16, ctx.currentTime, 0.6);
    synth = { ctx, gain, nodes };
    startTimeline();
  } catch {
    startTimeline();
  }
}

function setSynthVolume(volume: number, muted: boolean) {
  if (!synth) return;
  synth.gain.gain.setTargetAtTime(muted ? 0 : volume * 0.16, synth.ctx.currentTime, 0.08);
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useAudioEngine() {
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const volume = usePlayerStore((s) => s.volume);
  const muted = usePlayerStore((s) => s.muted);
  const addToHistory = useLibraryStore((s) => s.addToHistory);
  const playedRef = useRef<string | null>(null);

  // Media element listeners (bound once).
  useEffect(() => {
    const audio = getAudio();
    if (!audio) return;

    const store = usePlayerStore.getState();
    const onLoaded = () => {
      usePlayerStore.getState().setBuffering(false);
      if (Number.isFinite(audio.duration)) {
        usePlayerStore.getState().setDuration(audio.duration);
      }
    };
    const onEnded = () => {
      if (usePlayerStore.getState().repeatMode === "track") {
        audio.currentTime = 0;
        audio.play().catch(() => {});
        return;
      }
      usePlayerStore.getState().playNext();
    };
    const onWaiting = () => usePlayerStore.getState().setBuffering(true);
    const onPlaying = () => usePlayerStore.getState().setBuffering(false);
    // Mirror playback position into the store so every UI surface (player bar,
    // full-screen view, lyrics, queue) stays in sync.
    const onTimeUpdate = () => {
      usePlayerStore.setState({ currentTime: audio.currentTime });
    };
    const onError = () => {
      usePlayerStore.getState().setBuffering(false);
      usePlayerStore.getState().setError("Stream unavailable — using local audio engine");
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("error", onError);
    void store;

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("error", onError);
    };
  }, []);

  // Track changes.
  useEffect(() => {
    const audio = getAudio();
    if (!audio || !currentTrack) return;

    if (playedRef.current !== currentTrack.id) {
      playedRef.current = currentTrack.id;
      addToHistory(currentTrack);
    }

    if (currentTrack.audioUrl) {
      audio.src = currentTrack.audioUrl;
    } else {
      audio.removeAttribute("src");
    }
    audio.currentTime = 0;
    usePlayerStore.getState().setDuration(currentTrack.duration);
    usePlayerStore.getState().setError(null);
  }, [currentTrack, addToHistory]);

  // Transport.
  useEffect(() => {
    const audio = getAudio();
    if (!audio || !currentTrack) return;

    if (isPlaying) {
      if (currentTrack.audioUrl) {
        audio.play().catch(() => {
          usePlayerStore.getState().setError("Unable to start playback");
        });
      } else {
        startSynth(volume, muted);
      }
    } else {
      audio.pause();
      stopSynth();
    }
  }, [isPlaying, currentTrack, volume, muted]);

  // Seek.
  useEffect(() => {
    const audio = getAudio();
    if (!audio || !isPlaying) return;
    const unsub = usePlayerStore.subscribe((state, prev) => {
      if (state.currentTime !== prev.currentTime && Math.abs(audio.currentTime - state.currentTime) > 0.5) {
        audio.currentTime = state.currentTime;
      }
    });
    return unsub;
  }, [isPlaying]);

  // Volume.
  useEffect(() => {
    const audio = getAudio();
    if (audio) audio.volume = muted ? 0 : volume;
    setSynthVolume(volume, muted);
  }, [volume, muted]);

  // Pause on unload.
  useEffect(() => {
    const onBeforeUnload = () => {
      stopSynth();
      getAudio()?.pause();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);
}

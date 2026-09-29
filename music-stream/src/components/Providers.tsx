"use client";

import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useAudioEngine } from "@/hooks/useAudioEngine";
import { usePlayerStore } from "@/store/player";

function AudioEngine() {
  useAudioEngine();
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const sleepTimerEnd = usePlayerStore((s) => s.sleepTimerEnd);
  const sleepTimerActive = usePlayerStore((s) => s.sleepTimerActive);

  useEffect(() => {
    if (!sleepTimerActive || !sleepTimerEnd) return;
    const check = () => {
      if (Date.now() >= sleepTimerEnd) {
        const store = usePlayerStore.getState();
        store.clearSleepTimer();
        store.pause();
      }
    };
    check();
    const id = setInterval(check, 1000);
    return () => clearInterval(id);
  }, [sleepTimerActive, sleepTimerEnd]);

  return (
    <>
      <AudioEngine />
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2600,
          style: {
            background: "rgba(20, 23, 31, 0.94)",
            color: "#f4f5f7",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: "14px",
            fontSize: "13.5px",
            fontWeight: 500,
            backdropFilter: "blur(20px)",
            boxShadow: "0 18px 50px rgba(0,0,0,0.55)",
          },
        }}
      />
    </>
  );
}

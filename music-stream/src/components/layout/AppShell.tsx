"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative flex min-w-0 flex-1 flex-col md:pl-[248px]">
      <div
        className={cn(
          "pointer-events-none fixed inset-x-0 top-0 z-30 h-24 bg-gradient-to-b from-black/55 to-transparent opacity-0 transition-opacity duration-500 md:inset-x-[248px]",
          scrolled && "opacity-100"
        )}
      />
      <div
        key={pathname}
        className="animate-[fade_320ms_ease_both]"
      >
        {children}
      </div>
    </div>
  );
}

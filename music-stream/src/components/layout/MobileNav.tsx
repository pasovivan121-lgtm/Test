"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Library, ListMusic, User } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/library", label: "Library", icon: Library },
  { href: "/queue", label: "Queue", icon: ListMusic },
  { href: "/settings", label: "Profile", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="glass fixed inset-x-0 bottom-0 z-30 flex items-stretch justify-around border-t border-white/[0.08] pb-[env(safe-area-inset-bottom)] md:hidden">
      {ITEMS.map(({ href, label, icon: Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition",
              active ? "text-white" : "text-white/40"
            )}
          >
            <Icon className={cn("h-5 w-5", active && "text-accent-soft")} strokeWidth={active ? 2.4 : 2} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

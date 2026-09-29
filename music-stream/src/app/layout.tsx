import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Sidebar } from "@/components/layout/Sidebar";
import { PlayerBar } from "@/components/player/PlayerBar";
import { MobileNav } from "@/components/layout/MobileNav";
import { AppShell } from "@/components/layout/AppShell";
import { QueuePanel } from "@/components/player/QueuePanel";
import { NowPlayingView } from "@/components/player/NowPlayingView";
import { AddToPlaylistModal, CreatePlaylistModal } from "@/components/player/PlaylistModals";
import { SettingsPanel, UpgradeModal } from "@/components/player/SettingsPanel";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Resonance — Music without noise",
  description:
    "A premium, ad-free music streaming experience. Lossless audio, offline listening, no interruptions.",
  applicationName: "Resonance",
  keywords: ["music", "streaming", "ad-free", "lossless", "playlists", "podcasts"],
  openGraph: {
    title: "Resonance — Music without noise",
    description: "Premium ad-free music streaming. Lossless audio, offline listening, zero interruptions.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#06070a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-dvh antialiased">
        <Providers>
          <div className="flex min-h-dvh w-full">
            <Sidebar />
            {/* The sidebar is fixed (out of flow), so main content is offset manually. */}
            <AppShell>
              <main className="min-w-0 flex-1 pb-40 md:pb-32 lg:pb-28">{children}</main>
            </AppShell>
          </div>
          <PlayerBar />
          <MobileNav />
          <QueuePanel />
          <NowPlayingView />
          <AddToPlaylistModal />
          <CreatePlaylistModal />
          <SettingsPanel />
          <UpgradeModal />
        </Providers>
      </body>
    </html>
  );
}

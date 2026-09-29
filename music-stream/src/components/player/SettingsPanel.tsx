"use client";

import { useState } from "react";
import {
  X,
  AudioLines,
  Wifi,
  Users,
  Accessibility,
  Bell,
  Palette,
  Shield,
  Trash2,
  Check,
  Sparkles,
  Zap,
  Infinity as InfinityIcon,
  Download,
  Mic2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui";
import { usePlayerStore } from "@/store/player";
import { useLibraryStore } from "@/store/library";
import toast from "react-hot-toast";

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      role="switch"
      aria-checked={on}
      className={cn(
        "relative h-6 w-10 shrink-0 rounded-full transition-colors",
        on ? "bg-emerald-500" : "bg-white/15"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
          on ? "translate-x-[18px]" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

function Row({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof AudioLines;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] py-3.5 last:border-0">
      <div className="flex min-w-0 items-start gap-3">
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-white/40" />
        <div className="min-w-0">
          <div className="text-[13px] font-medium text-white">{title}</div>
          {description && <div className="mt-0.5 text-[11.5px] leading-relaxed text-white/40">{description}</div>}
        </div>
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  );
}

export function SettingsPanel() {
  const open = useUIStore((s) => s.settingsOpen);
  const close = useUIStore((s) => s.setSettingsOpen);
  const setOpen = close;
  const { crossfade, gaplessPlayback, audioQuality, toggleCrossfade } = usePlayerStore();
  const [normalize, setNormalize] = useState(true);
  const [automix, setAutomix] = useState(false);
  const [dataSaver, setDataSaver] = useState(false);
  const [downloadQuality, setDownloadQuality] = useState("High");
  const [showActivity, setShowActivity] = useState(true);
  const [allowMessages, setAllowMessages] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [language, setLanguage] = useState("English (US)");
  const [explicit, setExplicit] = useState(true);
  const [offlineQuality, setOfflineQuality] = useState("Wi-Fi only");
  const history = useLibraryStore((s) => s.history);
  const clearHistory = useLibraryStore((s) => s.clearHistory);

  if (!open) return null;

  const sections = [
    {
      id: "playback",
      title: "Playback",
      icon: AudioLines,
      content: (
        <>
          <Row icon={Zap} title="Crossfade" description="Fade between tracks for a seamless mix">
            <Toggle on={crossfade} onChange={toggleCrossfade} />
          </Row>
          <Row icon={AudioLines} title="Gapless playback" description="Play tracks without silence between them">
            <Toggle on={gaplessPlayback} onChange={() => usePlayerStore.setState({ gaplessPlayback: !gaplessPlayback })} />
          </Row>
          <Row icon={InfinityIcon} title="Normalize volume" description="Level the loudness across your library">
            <Toggle on={normalize} onChange={setNormalize} />
          </Row>
          <Row icon={Zap} title="Automix" description="Blend tracks for a longer, uninterrupted session">
            <Toggle on={automix} onChange={setAutomix} />
          </Row>
          <Row icon={AudioLines} title="Audio quality" description="Higher quality uses more data">
            <select
              value={audioQuality}
              onChange={(e) =>
                usePlayerStore.setState({ audioQuality: e.target.value as typeof audioQuality })
              }
              className="rounded-lg border border-white/10 bg-white/[0.07] px-2.5 py-1.5 text-[12px] font-medium text-white outline-none"
            >
              <option value="low">Low · 96 kbps</option>
              <option value="normal">Normal · 160 kbps</option>
              <option value="high">High · 320 kbps</option>
              <option value="very_high">Lossless · FLAC</option>
            </select>
          </Row>
        </>
      ),
    },
    {
      id: "quality",
      title: "Music quality",
      icon: Download,
      content: (
        <>
          <Row icon={Wifi} title="Wi-Fi quality" description="Quality used on unmetered connections">
            <select
              value={audioQuality}
              onChange={(e) => usePlayerStore.setState({ audioQuality: e.target.value as typeof audioQuality })}
              className="rounded-lg border border-white/10 bg-white/[0.07] px-2.5 py-1.5 text-[12px] font-medium text-white outline-none"
            >
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="very_high">Lossless</option>
            </select>
          </Row>
          <Row icon={Wifi} title="Cellular quality" description="Quality used on mobile data">
            <select
              value={downloadQuality}
              onChange={(e) => setDownloadQuality(e.target.value)}
              className="rounded-lg border border-white/10 bg-white/[0.07] px-2.5 py-1.5 text-[12px] font-medium text-white outline-none"
            >
              <option>Normal</option>
              <option>High</option>
              <option>Lossless</option>
            </select>
          </Row>
          <Row icon={Download} title="Offline downloads" description="Only download over Wi-Fi">
            <select
              value={offlineQuality}
              onChange={(e) => setOfflineQuality(e.target.value)}
              className="rounded-lg border border-white/10 bg-white/[0.07] px-2.5 py-1.5 text-[12px] font-medium text-white outline-none"
            >
              <option>Wi-Fi only</option>
              <option>Any connection</option>
            </select>
          </Row>
          <Row icon={Zap} title="Data saver" description="Reduce data usage on cellular networks">
            <Toggle on={dataSaver} onChange={setDataSaver} />
          </Row>
        </>
      ),
    },
    {
      id: "account",
      title: "Account",
      icon: Users,
      content: (
        <>
          <Row icon={Shield} title="Explicit content" description="Allow playback of explicit tracks">
            <Toggle on={explicit} onChange={setExplicit} />
          </Row>
          <Row icon={Bell} title="Notifications" description="New releases, concerts and playlist updates">
            <Toggle on={notifications} onChange={setNotifications} />
          </Row>
          <Row icon={Palette} title="Language">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="rounded-lg border border-white/10 bg-white/[0.07] px-2.5 py-1.5 text-[12px] font-medium text-white outline-none"
            >
              <option>English (US)</option>
              <option>English (UK)</option>
              <option>Español</option>
              <option>Français</option>
              <option>Deutsch</option>
              <option>日本語</option>
              <option>Português (BR)</option>
            </select>
          </Row>
        </>
      ),
    },
    {
      id: "social",
      title: "Social",
      icon: Users,
      content: (
        <>
          <Row icon={Users} title="Show listening activity" description="Let friends see what you're playing">
            <Toggle on={showActivity} onChange={setShowActivity} />
          </Row>
          <Row icon={Mic2} title="Allow messages" description="Let other users send you messages">
            <Toggle on={allowMessages} onChange={setAllowMessages} />
          </Row>
          <Row icon={Shield} title="Private session" description="Your activity is hidden from friends">
            <Toggle
              on={false}
              onChange={(v) => toast(v ? "Private session started" : "Private session ended")}
            />
          </Row>
        </>
      ),
    },
    {
      id: "accessibility",
      title: "Accessibility",
      icon: Accessibility,
      content: (
        <>
          <Row icon={Accessibility} title="Reduce motion" description="Minimise animations and transitions">
            <Toggle on={reduceMotion} onChange={setReduceMotion} />
          </Row>
          <Row icon={Mic2} title="Screen reader labels" description="Enhanced labels for assistive technology">
            <Toggle on={true} onChange={() => toast("Always enabled for best accessibility")} />
          </Row>
          <Row icon={Palette} title="Text size">
            <select className="rounded-lg border border-white/10 bg-white/[0.07] px-2.5 py-1.5 text-[12px] font-medium text-white outline-none">
              <option>Default</option>
              <option>Large</option>
              <option>Extra large</option>
            </select>
          </Row>
        </>
      ),
    },
    {
      id: "privacy",
      title: "Privacy & data",
      icon: Shield,
      content: (
        <>
          <Row icon={Trash2} title="Clear listening history" description={`${history.length} entries stored`}>
            <button
              onClick={() => {
                clearHistory();
                toast.success("Listening history cleared");
              }}
              className="rounded-lg border border-white/15 px-3 py-1.5 text-[11.5px] font-semibold text-white/70 transition hover:border-rose-400/50 hover:text-rose-400"
            >
              Clear
            </button>
          </Row>
        </>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 z-[70] flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <aside className="glass relative flex h-full w-full max-w-[440px] animate-[rise_320ms_cubic-bezier(0.22,1,0.36,1)_both] flex-col border-l border-white/10 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
          <div>
            <h2 className="text-[15px] font-bold text-white">Settings</h2>
            <p className="text-[11.5px] text-white/40">Everything, tuned your way</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="grid h-8 w-8 place-items-center rounded-full text-white/45 transition hover:bg-white/10 hover:text-white"
            aria-label="Close settings"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-3">
          {sections.map((s) => (
            <section key={s.id} className="mb-6">
              <h3 className="mb-1.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white/35">
                <s.icon className="h-3.5 w-3.5" /> {s.title}
              </h3>
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-3.5">
                {s.content}
              </div>
            </section>
          ))}
        </div>
        <div className="border-t border-white/[0.08] px-5 py-3.5">
          <button
            onClick={() => useUIStore.getState().openUpgrade()}
            className="w-full rounded-xl bg-gradient-to-r from-accent to-cyan-500 py-2.5 text-[12.5px] font-bold text-white transition hover:brightness-110"
          >
            <Sparkles className="mr-1.5 inline h-3.5 w-3.5" />
            Upgrade to Premium
          </button>
        </div>
      </aside>
    </div>
  );
}

export function UpgradeModal() {
  const open = useUIStore((s) => s.upgradeOpen);
  const close = useUIStore((s) => s.setUpgradeOpen);
  const [plan, setPlan] = useState<"monthly" | "yearly">("yearly");

  if (!open) return null;

  const PLANS = [
    {
      id: "free" as const,
      name: "Free",
      price: "$0",
      period: "forever",
      features: ["Ad-free playback", "Curated radio", "Basic quality", "Limited skips"],
      cta: "Current plan",
    },
    {
      id: "premium" as const,
      name: "Premium",
      price: plan === "yearly" ? "$10.99" : "$13.99",
      period: plan === "yearly" ? "/month, billed yearly" : "/month",
      features: [
        "Lossless audio (24-bit FLAC)",
        "Offline downloads on 5 devices",
        "On-demand everything",
        "No shuffle limits",
        "Extended song skipping",
        "Collaborative playlists",
      ],
      cta: "Start 30-day free trial",
    },
    {
      id: "family" as const,
      name: "Family",
      price: plan === "yearly" ? "$19.99" : "$24.99",
      period: plan === "yearly" ? "/month, billed yearly" : "/month",
      features: ["Everything in Premium", "6 separate accounts", "Kids profiles", "Shared playlists", "Ad-free podcasts"],
      cta: "Choose Family",
    },
  ];

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => close(false)} />
      <div className="glass relative my-8 w-full max-w-4xl animate-[rise_300ms_cubic-bezier(0.22,1,0.36,1)_both] rounded-3xl border border-white/10 p-6 shadow-2xl sm:p-8">
        <div className="mb-6 text-center">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-accent-soft">
            <Sparkles className="h-3 w-3" /> Go Premium
          </span>
          <h2 className="text-gradient text-[26px] font-black tracking-tight sm:text-[34px]">
            Every note. Every album. No ads.
          </h2>
          <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-white/50">
            We don&apos;t run ads, ever. Premium funds the artists you actually listen to.
          </p>

          <div className="mt-5 inline-flex rounded-full bg-white/[0.07] p-1">
            {(["monthly", "yearly"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPlan(p)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-[12px] font-semibold capitalize transition",
                  plan === p ? "bg-white text-black" : "text-white/55 hover:text-white"
                )}
              >
                {p}
                {p === "yearly" && (
                  <span className={cn("ml-1.5 text-[10px]", plan === p ? "text-emerald-600" : "text-emerald-400")}>
                    Save 22%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.id}
              className={cn(
                "relative flex flex-col rounded-2xl border p-5 transition",
                p.id === "premium"
                  ? "border-accent/50 bg-gradient-to-b from-accent/15 to-transparent shadow-[0_0_50px_rgba(124,92,255,0.18)]"
                  : "border-white/[0.09] bg-white/[0.02]"
              )}
            >
              {p.id === "premium" && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  Most popular
                </span>
              )}
              <h3 className="text-[15px] font-bold text-white">{p.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-[30px] font-black tracking-tight text-white">{p.price}</span>
                <span className="text-[11.5px] text-white/45">{p.period}</span>
              </div>
              <ul className="mt-4 flex-1 space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[12.5px] text-white/65">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => {
                  close(false);
                  toast.success(
                    p.id === "free"
                      ? "You're already on Free"
                      : `Welcome to ${p.name} — your trial has started`
                  );
                }}
                className={cn(
                  "mt-5 w-full rounded-xl py-2.5 text-[12.5px] font-bold transition",
                  p.id === "premium"
                    ? "bg-white text-black hover:bg-white/90"
                    : p.id === "free"
                      ? "bg-white/[0.07] text-white/45 hover:bg-white/15"
                      : "border border-white/25 text-white hover:bg-white hover:text-black"
                )}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="mt-5 text-center text-[11px] text-white/30">
          Cancel anytime. Student and Military plans available with verification.
        </p>
      </div>
    </div>
  );
}

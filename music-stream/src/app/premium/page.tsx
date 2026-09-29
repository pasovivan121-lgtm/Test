"use client";

import { TopBar } from "@/components/layout/TopBar";
import { useUIStore } from "@/store/ui";
import { Check, Sparkles, Music4, Download, Zap, Radio as RadioIcon, Users, Infinity as InfinityIcon, AudioLines, Heart, Gauge, Ban, Fingerprint, Receipt, CreditCard, HelpCircle } from "lucide-react";
import { ARTISTS, TRACKS, PLAYLISTS } from "@/data/mock";
import { formatCount } from "@/lib/utils";

const FEATURES = [
  { icon: AudioLines, title: "Lossless audio", body: "24-bit FLAC and Hi-Res up to 192 kHz, on every device." },
  { icon: Ban, title: "Zero advertising", body: "No pre-roll, no mid-roll, no banner. We don't sell your attention." },
  { icon: Download, title: "Offline listening", body: "Download anything and keep it forever, on up to 5 devices." },
  { icon: InfinityIcon, title: "Unlimited skips", body: "No cap on skips, replays or song repeats — ever." },
  { icon: Zap, title: "On-demand everything", body: "Play any track, album or artist the moment you want it." },
  { icon: Gauge, title: "Data saver mode", body: "Compress audio automatically on mobile data to save your plan." },
  { icon: RadioIcon, title: "Premium radio", body: "Ad-free stations built around what you actually play." },
  { icon: Users, title: "Collaborative playlists", body: "Plan a trip or a party together, in real time." },
  { icon: Heart, title: "Blend playlists", body: "Mix any two artists or genres into a fresh discovery mix." },
  { icon: Fingerprint, title: "Cross-device sync", body: "Start on your phone, finish on your laptop, seamlessly." },
  { icon: Music4, title: "Artist-first payouts", body: "The majority of revenue goes directly to the people you play." },
  { icon: Receipt, title: "Student pricing", body: "Half price with a verified student ID, plus student-only features." },
];

const COMPARISON = [
  { feature: "Ad-free playback", free: true, premium: true },
  { feature: "Lossless audio", free: false, premium: true },
  { feature: "Offline downloads", free: false, premium: true },
  { feature: "On-demand any song", free: false, premium: true },
  { feature: "Unlimited skips", free: false, premium: true },
  { feature: "Offline podcast episodes", free: false, premium: true },
  { feature: "Collaborative playlists", free: false, premium: true },
];

export default function PremiumPage() {
  const setUpgradeOpen = useUIStore((s) => s.setUpgradeOpen);

  return (
    <>
      <TopBar />
      <div className="px-4 pb-12 sm:px-6">
        {/* Hero */}
        <header className="relative mb-10 overflow-hidden rounded-3xl border border-white/[0.08] p-7 text-center sm:p-12">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/30 via-cyan-500/15 to-transparent" />
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-accent/30 blur-3xl" />
          <div className="absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="relative">
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white/85">
              <Sparkles className="h-3 w-3" /> Resonance Premium
            </span>
            <h1 className="text-gradient mx-auto max-w-3xl text-[34px] font-black leading-[1.06] tracking-tight sm:text-[56px]">
              Music without the noise.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-[14px] leading-relaxed text-white/60 sm:text-[15px]">
              No ads. No interruptions. No selling your data. Just{" "}
              {formatCount(TRACKS.length * 1_240_000)} tracks, {ARTISTS.length * 6} artists and every
              album they&apos;ve ever made — in lossless quality, on every device you own.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setUpgradeOpen(true)}
                className="rounded-full bg-white px-7 py-3.5 text-[14px] font-bold text-black transition hover:scale-105 active:scale-95"
              >
                Try 30 days free
              </button>
              <button
                onClick={() => setUpgradeOpen(true)}
                className="rounded-full border border-white/25 px-7 py-3.5 text-[14px] font-semibold text-white/85 transition hover:border-white/50 hover:text-white"
              >
                View all plans
              </button>
            </div>
            <p className="mt-3 text-[11.5px] text-white/35">
              Then {`$`}11.99/month. Cancel in two taps, keep your downloads.
            </p>
          </div>
        </header>

        {/* Features */}
        <section className="mb-12">
          <h2 className="mb-6 text-center text-[24px] font-black tracking-tight text-white sm:text-[30px]">
            What you get
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 transition hover:border-white/15 hover:bg-white/[0.045]"
              >
                <span className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-accent/25 to-cyan-500/20">
                  <Icon className="h-[18px] w-[18px] text-accent-soft" />
                </span>
                <h3 className="text-[14px] font-bold text-white">{title}</h3>
                <p className="mt-1 text-[12.5px] leading-relaxed text-white/50">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison */}
        <section className="mb-12">
          <h2 className="mb-5 text-center text-[24px] font-black tracking-tight text-white sm:text-[30px]">
            Free vs Premium
          </h2>
          <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-white/[0.08]">
            <div className="grid grid-cols-[1fr_70px_90px] border-b border-white/[0.08] bg-white/[0.04] px-4 py-3 text-[12px] font-bold text-white/70 sm:grid-cols-[1fr_120px_140px]">
              <span>Feature</span>
              <span className="text-center">Free</span>
              <span className="text-center text-accent-soft">Premium</span>
            </div>
            {COMPARISON.map((row) => (
              <div
                key={row.feature}
                className="grid grid-cols-[1fr_70px_90px] items-center border-b border-white/[0.05] px-4 py-3 text-[12.5px] last:border-0 sm:grid-cols-[1fr_120px_140px]"
              >
                <span className="text-white/70">{row.feature}</span>
                <span className="grid place-items-center">
                  {row.free ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <span className="text-white/20">—</span>
                  )}
                </span>
                <span className="grid place-items-center">
                  {row.premium ? (
                    <Check className="h-4 w-4 text-accent-soft" />
                  ) : (
                    <span className="text-white/20">—</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Artists */}
        <section className="mb-12 overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-rose-500/12 via-accent/10 to-transparent p-7 sm:p-9">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <h2 className="text-gradient text-[24px] font-black tracking-tight sm:text-[30px]">
                Artists keep more when you subscribe
              </h2>
              <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-white/55">
                On the free tier, ad revenue is split by stream share and pays roughly a third of a cent
                per play. Premium moves the majority of every subscription directly to rights holders, with
                per-stream reporting artists can actually audit.
              </p>
              <ul className="mt-4 space-y-2">
                {[
                  "Transparent per-artist payout reporting",
                  "Direct support for independent labels",
                  "No algorithmic placement bought with ad money",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2 text-[12.5px] text-white/60">
                    <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" /> {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:w-[320px]">
              {[
                [formatCount(ARTISTS.length * 6), "Artists paid"],
                ["71%", "To rights holders"],
                ["0", "Ads served"],
              ].map(([v, l]) => (
                <div
                  key={l}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 text-center"
                >
                  <div className="text-[22px] font-black text-white">{v}</div>
                  <div className="mt-0.5 text-[10.5px] text-white/45">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-7 text-center sm:p-10">
          <h2 className="text-gradient text-[26px] font-black tracking-tight sm:text-[32px]">
            Ready when you are
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-[13px] leading-relaxed text-white/50">
            {PLAYLISTS.length} playlists, {TRACKS.length} tracks and every release to come. Free for 30
            days, no card required.
          </p>
          <button
            onClick={() => setUpgradeOpen(true)}
            className="mt-6 rounded-full bg-gradient-to-r from-accent to-cyan-500 px-8 py-3.5 text-[14px] font-bold text-white transition hover:brightness-110 active:scale-95"
          >
            Start my free trial
          </button>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-5 text-[11.5px] text-white/35">
            <span className="flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5" /> No charge for 30 days
            </span>
            <span className="flex items-center gap-1.5">
              <HelpCircle className="h-3.5 w-3.5" /> Cancel anytime
            </span>
            <span className="flex items-center gap-1.5">
              <Download className="h-3.5 w-3.5" /> Keep your downloads
            </span>
          </div>
        </section>
      </div>
    </>
  );
}

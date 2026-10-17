"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Download, ListMusic, Play, Radio } from "lucide-react";
import { PLAYLISTS, SITE } from "@/lib/tracks";
import { FALLBACK_TRACKS, getVibe, VIBES } from "@/lib/vibes";
import { useLocalPlayer } from "@/lib/useLocalPlayer";
import Particles from "../Particles";
import GlassModal from "./GlassModal";
import PlayerBar from "./PlayerBar";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}

type ModalKind = "songs" | "playlists" | "install" | "vibes" | null;

function BrandSpotify({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm4.6 14.4a.8.8 0 01-1.1.3c-3-1.8-6.8-2.2-11.2-1.2a.8.8 0 11-.4-1.6c4.8-1.1 9-.6 12.4 1.4.4.2.5.7.3 1.1zm1.2-2.7a1 1 0 01-1.4.3c-3.4-2.1-8.6-2.7-12.6-1.5a1 1 0 11-.6-1.9c4.6-1.4 10.3-.7 14.2 1.7.5.3.6 1 .4 1.4zm.1-2.8C14.2 8.5 8 8.3 4.2 9.5a1.2 1.2 0 01-.7-2.3C7.9 5.9 14.8 6.1 19 8.6a1.2 1.2 0 01-1.2 2.1z" />
    </svg>
  );
}

function BrandYouTube({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M23 12s0-3.2-.4-4.7a2.5 2.5 0 00-1.8-1.8C19.2 5 12 5 12 5s-7.2 0-8.8.5A2.5 2.5 0 001.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 001.8 1.8C4.8 19 12 19 12 19s7.2 0 8.8-.5a2.5 2.5 0 001.8-1.8C23 15.2 23 12 23 12zM9.8 15.3V8.7l6.2 3.3-6.2 3.3z" />
    </svg>
  );
}

const pillClass =
  "flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium text-white/75 transition-colors hover:bg-white/10 hover:text-white sm:px-3.5";

export default function SaloonExperience() {
  const [modal, setModal] = useState<ModalKind>(null);
  const [clock, setClock] = useState("");
  const [vibeId, setVibeId] = useState(VIBES[0].id);
  const [started, setStarted] = useState(false);
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);

  const vibe = getVibe(vibeId);
  const localTracks = vibe.tracks ?? FALLBACK_TRACKS;
  const player = useLocalPlayer(localTracks);
  const displayTrack = player.track ?? FALLBACK_TRACKS[0];

  useEffect(() => {
    const tick = () => {
      setClock(
        new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      );
    };
    const boot = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 1000);
    return () => {
      window.clearTimeout(boot);
      window.clearInterval(id);
    };
  }, []);

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const playAll = useCallback(() => {
    setStarted(true);
    player.play();
  }, [player]);

  const toggleAll = useCallback(() => {
    setStarted(true);
    player.toggle();
  }, [player]);

  const selectTrack = (index: number) => {
    setStarted(true);
    player.select(index);
    player.play();
    setModal(null);
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0 transition-colors duration-1000"
          style={{
            background: `radial-gradient(120% 120% at 15% 0%, ${vibe.palette[2]} 0%, ${vibe.palette[1]} 42%, ${vibe.palette[0]} 100%)`,
          }}
        />
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute -left-1/4 top-[-30%] h-[70vh] w-[70vh] rounded-full opacity-30 blur-[120px]"
            style={{
              background: vibe.accent,
              animation: "aurora-shift 18s ease-in-out infinite",
            }}
          />
          <div
            className="absolute right-[-20%] bottom-[-25%] h-[60vh] w-[60vh] rounded-full opacity-20 blur-[140px]"
            style={{
              background: "#ffffff",
              animation: "aurora-shift 24s ease-in-out infinite reverse",
            }}
          />
        </div>
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: vibe.photo ? 1 : 0 }}
          aria-hidden
        >
          <div
            className="absolute -inset-8 scale-110 bg-center bg-cover opacity-70 blur-2xl"
            style={{ backgroundImage: `url(${vibe.photo ?? "/saloon-bg.jpg"})` }}
          />
          <div
            className="absolute inset-0 hidden bg-center bg-cover bg-no-repeat sm:block"
            style={{ backgroundImage: `url(${vibe.photo ?? "/saloon-bg.jpg"})` }}
          />
          <div
            className="absolute inset-0 bg-no-repeat sm:hidden"
            style={{
              backgroundImage: `url(${vibe.photo ?? "/saloon-bg.jpg"})`,
              backgroundSize: "100% auto",
              backgroundPosition: "center 12%",
            }}
          />
        </div>
      </div>
      <div className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-t from-black/85 via-black/15 to-black/55" />
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 30%, transparent 40%, rgba(0,0,0,0.45) 100%)",
        }}
      />
      <Particles scene={vibe} />

      <header className="fixed inset-x-0 top-0 z-20 px-3 pt-3 sm:px-6 sm:pt-5">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2 sm:justify-between">
          <div className="glass-nav flex items-center rounded-full px-3.5 py-2">
            <time
              className="font-roboto text-sm leading-none tracking-wide text-white text-shadow-warm tabular-nums"
              suppressHydrationWarning
            >
              {clock || "--:--"}
            </time>
          </div>

          <button
            type="button"
            onClick={() => setModal("vibes")}
            className="glass-nav group flex items-center gap-2 rounded-full px-3 py-1.5 transition-colors hover:bg-white/[0.12]"
            aria-label="Change the vibe"
          >
            <span className="text-lg leading-none">{vibe.emoji}</span>
            <span className="flex flex-col items-start leading-none">
              <span className="font-roboto text-[9px] uppercase tracking-[0.25em] text-white/45">
                vibe
              </span>
              <span className="font-hindi text-xs text-white">{vibe.name}</span>
            </span>
            <ChevronDown className="h-4 w-4 text-white/60 transition-transform group-hover:translate-y-0.5" />
          </button>

          <nav className="glass-nav flex items-center gap-0.5 rounded-full p-1">
            <a
              href={SITE.spotifySearchUrl}
              target="_blank"
              rel="noreferrer"
              className={pillClass}
            >
              <BrandSpotify className="h-4 w-4 text-[#1DB954]" />
              <span className="hidden sm:inline">Spotify</span>
            </a>
            <a
              href={SITE.youtubeUrl}
              target="_blank"
              rel="noreferrer"
              className={pillClass}
            >
              <BrandYouTube className="h-4 w-4 text-[#FF0033]" />
              <span className="hidden sm:inline">YT Music</span>
            </a>
            <button
              type="button"
              onClick={() => setModal("playlists")}
              className={pillClass}
            >
              <ListMusic className="h-4 w-4" />
              <span className="hidden sm:inline">Playlists</span>
            </button>
            <button
              type="button"
              onClick={() => setModal("songs")}
              className={pillClass}
            >
              <Radio className="h-4 w-4" />
              <span className="hidden sm:inline">Songs</span>
            </button>
            <button
              type="button"
              onClick={() => setModal("install")}
              className={pillClass}
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Install</span>
            </button>
          </nav>
        </div>
      </header>

      <AnimatePresence>
        {!started && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="pointer-events-none fixed inset-0 z-10 grid place-items-center px-6"
          >
            <button
              type="button"
              onClick={playAll}
              className="group pointer-events-auto flex flex-col items-center gap-4"
              aria-label="Tap to play music"
            >
              <span className="relative grid h-24 w-24 place-items-center">
                <span
                  className="cta-ring absolute inset-0 rounded-full border"
                  style={{ borderColor: `${vibe.accent}80` }}
                />
                <span className="glass float-soft grid h-20 w-20 place-items-center rounded-full transition-transform group-hover:scale-105">
                  <Play
                    className="ml-1 h-8 w-8"
                    fill="currentColor"
                    style={{ color: vibe.accent }}
                  />
                </span>
              </span>
              <span className="glass-soft rounded-full px-5 py-2.5 text-center text-sm text-white/90">
                Tap to play · {vibe.latin}
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed inset-x-0 bottom-0 z-30 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6 sm:pb-5">
        <div className="mx-auto max-w-5xl">
          <PlayerBar
            track={displayTrack}
            playing={player.playing}
            currentTime={player.currentTime}
            duration={player.duration}
            volume={player.volume}
            canSkip={player.canSkip}
            onToggle={toggleAll}
            onNext={player.next}
            onPrev={player.prev}
            onSeek={player.seek}
            onVolume={player.setVolume}
          />
          <p className="mt-2 text-center font-roboto text-[11px] text-white/55 text-shadow-warm">
            <span>Deluxe Saloon · open all hours</span>
            <span className="hidden sm:inline">
              {" · "}
              <a
                href={`mailto:${SITE.contactEmail}`}
                className="underline decoration-white/25 underline-offset-2 transition-colors hover:text-white/85"
              >
                {SITE.contactEmail}
              </a>
            </span>
          </p>
        </div>
      </div>

      <GlassModal
        open={modal === "vibes"}
        onClose={() => setModal(null)}
        title="Apna mahol badlo"
        subtitle="Ek vibe chuno — bas dekh ke hi samajh aa jaayega"
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {VIBES.map((item) => {
            const active = item.id === vibe.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setVibeId(item.id);
                  player.select(0);
                  setModal(null);
                }}
                className={`relative flex flex-col items-start gap-1 rounded-2xl border p-3 text-left transition-all ${
                  active
                    ? "border-white/40 bg-white/15"
                    : "border-white/10 bg-white/[0.04] hover:border-white/25 hover:bg-white/[0.08]"
                }`}
              >
                <span className="flex w-full items-center justify-between">
                  <span className="text-3xl leading-none">{item.emoji}</span>
                  {active ? (
                    <Check className="h-4 w-4 text-white/80" />
                  ) : (
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: item.accent }}
                    />
                  )}
                </span>
                <span className="mt-1 font-hindi text-sm text-white">
                  {item.name}
                </span>
                <span className="font-roboto text-[10px] uppercase tracking-wider text-white/45">
                  {item.latin}
                </span>
                <span className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-white/50">
                  {item.tagline}
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[11px] leading-relaxed text-white/45">
          Vibe badalte hi background, accent aur gaane — sab badal jaate hain. Play
          button dabao aur dekho.
        </p>
      </GlassModal>

      <GlassModal
        open={modal === "songs"}
        onClose={() => setModal(null)}
        title={`${vibe.latin} · Radio Queue`}
        subtitle="Abhi baj raha hai, aur aage kya"
      >
        <ul className="flex flex-col gap-1">
          {localTracks.map((item, index) => {
            const active = index === player.index;
            return (
              <li key={item.src}>
                <button
                  type="button"
                  onClick={() => selectTrack(index)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors ${
                    active ? "bg-white/15" : "hover:bg-white/[0.07]"
                  }`}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 font-roboto text-[11px] text-white/70">
                    {active ? "▶" : index + 1}
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate text-sm text-white/95">{item.title}</span>
                    <span className="truncate font-roboto text-[11px] text-white/50">
                      {item.artist}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[11px] leading-relaxed text-white/45">
          Vibes ke gaane <code className="text-white/70">src/lib/vibes.ts</code> me{" "}
          <code className="text-white/70">tracks</code> array se aate hain — files{" "}
          <code className="text-white/70">public/audio/&lt;vibe&gt;/</code> me rakho.
        </p>
      </GlassModal>

      <GlassModal
        open={modal === "playlists"}
        onClose={() => setModal(null)}
        title="Vintage Playlists"
        subtitle="Ek baithak, ek mood"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {PLAYLISTS.map((list) => (
            <div
              key={list.name}
              className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 transition-colors hover:border-white/25"
            >
              <span className="text-2xl">{list.emoji}</span>
              <p className="mt-2 text-sm font-medium text-white/90">{list.name}</p>
              <p className="mt-0.5 font-roboto text-[11px] text-white/45">
                {list.tagline}
              </p>
            </div>
          ))}
        </div>
      </GlassModal>

      <GlassModal
        open={modal === "install"}
        onClose={() => setModal(null)}
        title="Install Deluxe Saloon"
        subtitle="Full-screen app, no app store"
      >
        <div className="flex flex-col gap-4">
          <button
            type="button"
            disabled={!installEvent}
            onClick={() => {
              void installEvent?.prompt();
            }}
            className="rounded-full bg-[#f4efe6] px-6 py-3 text-sm font-semibold text-[#2a1512] transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-40"
          >
            {installEvent ? "Install app" : "Use browser menu to install"}
          </button>
          <div className="flex flex-col gap-3 text-xs leading-relaxed text-white/55">
            <p>
              <span className="text-white/80">iPhone / iPad:</span> Share button dabao →
              &ldquo;Add to Home Screen&rdquo;.
            </p>
            <p>
              <span className="text-white/80">Android:</span> Menu (⋮) → &ldquo;Install
              app&rdquo; ya &ldquo;Add to Home screen&rdquo;.
            </p>
            <p>
              <span className="text-white/80">Desktop:</span> Address bar ke install icon
              pe click karo.
            </p>
          </div>
        </div>
      </GlassModal>
    </div>
  );
}

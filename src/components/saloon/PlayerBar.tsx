"use client";

import { Pause, Play, SkipBack, SkipForward, Volume2 } from "lucide-react";
import type { Track } from "@/lib/tracks";

interface PlayerBarProps {
  track: Track;
  playing: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  hissOn: boolean;
  canSkip: boolean;
  onToggle: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (seconds: number) => void;
  onVolume: (volume: number) => void;
  onToggleHiss: () => void;
}

function formatTime(value: number): string {
  if (!Number.isFinite(value) || value < 0) return "0:00";
  const total = Math.floor(value);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function EqBars() {
  return (
    <span className="flex h-3 items-end gap-[3px] text-[#f6e7c9]" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="eq-bar"
          style={{ animationDelay: `${i * 0.18}s` }}
        />
      ))}
    </span>
  );
}

export default function PlayerBar({
  track,
  playing,
  currentTime,
  duration,
  volume,
  hissOn,
  canSkip,
  onToggle,
  onNext,
  onPrev,
  onSeek,
  onVolume,
  onToggleHiss,
}: PlayerBarProps) {
  const progress = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;
  const spinning = playing;

  const hissClass = `flex h-9 items-center justify-center gap-1.5 rounded-full border px-3 text-xs transition-all ${
    hissOn
      ? "border-[#f6e7c9]/60 bg-[#f6e7c9]/20 text-[#f6e7c9] shadow-[0_0_18px_rgba(246,231,201,0.35)]"
      : "border-white/15 bg-white/5 text-white/65 hover:border-white/30 hover:text-white"
  }`;

  return (
    <div className="glass flex w-full flex-col gap-2.5 rounded-[26px] px-3.5 py-3 sm:px-5 sm:py-3.5">
      <div className="flex items-center gap-3 sm:gap-4">
        <div
          className={`relative h-11 w-11 shrink-0 rounded-full sm:h-12 sm:w-12 ${
            spinning ? "vinyl-spin" : ""
          }`}
          style={{
            background:
              "repeating-radial-gradient(circle at 50% 50%, #2a1512 0 3px, #3a1d18 3px 5px)",
            boxShadow: "0 0 0 3px rgba(0,0,0,0.35), inset 0 0 12px rgba(0,0,0,0.8)",
          }}
        >
          <span
            className="absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: "linear-gradient(135deg,#f6e7c9,#c8a878)" }}
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex items-center gap-2">
            {playing && <EqBars />}
            <span className="truncate text-sm font-medium text-white text-shadow-warm">
              {track.title}
            </span>
          </div>
          <span className="truncate font-roboto text-[11px] text-white/55">
            {track.artist}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={onPrev}
            disabled={!canSkip}
            className="hidden h-9 w-9 items-center justify-center rounded-full text-white/75 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30 sm:flex"
            aria-label="Previous track"
          >
            <SkipBack className="h-4 w-4" fill="currentColor" />
          </button>

          <button
            type="button"
            onClick={onToggle}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f4efe6] text-[#2a1512] shadow-lg transition-transform hover:scale-105 active:scale-95"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? (
              <Pause className="h-5 w-5" fill="currentColor" />
            ) : (
              <Play className="ml-0.5 h-5 w-5" fill="currentColor" />
            )}
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={!canSkip}
            className="hidden h-9 w-9 items-center justify-center rounded-full text-white/75 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30 sm:flex"
            aria-label="Next track"
          >
            <SkipForward className="h-4 w-4" fill="currentColor" />
          </button>
        </div>

        <div className="hidden items-center gap-3 pl-1 md:flex md:border-l md:border-white/10 md:pl-4">
          <Volume2 className="h-4 w-4 text-white/60" />
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={volume}
            onChange={(event) => onVolume(Number(event.target.value))}
            className="saloon-range w-24"
            style={{
              background: `linear-gradient(to right, #f6e7c9 ${volume}%, rgba(255,255,255,0.22) ${volume}%)`,
            }}
            aria-label="Volume"
          />
          <button
            type="button"
            onClick={onToggleHiss}
            className={hissClass}
            aria-pressed={hissOn}
            aria-label="Toggle vinyl hiss"
            title="Vintage vinyl crackle"
          >
            <span aria-hidden>📻</span>
            <span>Hiss</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onToggleHiss}
          className={`${hissClass} w-9 px-0 md:hidden`}
          aria-pressed={hissOn}
          aria-label="Toggle vinyl hiss"
          title="Vintage vinyl crackle"
        >
          <span aria-hidden>📻</span>
        </button>
      </div>

      <div className="flex items-center gap-3">
        <span className="shrink-0 font-roboto text-[10px] tabular-nums text-white/55">
          {formatTime(currentTime)}
        </span>
        <input
          type="range"
          min={0}
          max={duration > 0 ? duration : 100}
          step={1}
          value={duration > 0 ? Math.min(currentTime, duration) : 0}
          onChange={(event) => onSeek(Number(event.target.value))}
          disabled={duration <= 0}
          className="saloon-range flex-1"
          style={{
            background: `linear-gradient(to right, #f6e7c9 ${progress}%, rgba(255,255,255,0.22) ${progress}%)`,
          }}
          aria-label="Seek"
        />
        <span className="shrink-0 font-roboto text-[10px] tabular-nums text-white/55">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}

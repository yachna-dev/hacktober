"use client";

import { Volume1, Volume2 } from "lucide-react";
import type { CSSProperties } from "react";

interface LayerSliderProps {
  label: string;
  hint: string;
  volume: number;
  accent: string;
  onChange: (value: number) => void;
}

export default function LayerSlider({
  label,
  hint,
  volume,
  accent,
  onChange,
}: LayerSliderProps) {
  const Icon = volume > 0.5 ? Volume2 : Volume1;

  return (
    <div className="group flex flex-col gap-2 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors group-hover:border-white/20"
            style={{ color: accent }}
          >
            <Icon className="h-3.5 w-3.5" />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-medium tracking-wide text-white/90">
              {label}
            </span>
            <span className="text-[11px] italic text-white/40">{hint}</span>
          </div>
        </div>
        <span
          className="font-mono text-[11px] tabular-nums text-white/50"
          style={{ color: volume > 0.02 ? accent : undefined }}
        >
          {Math.round(volume * 100)}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={(event) => onChange(Number(event.target.value))}
        className="vibe-slider"
        style={{ "--slider-accent": accent } as CSSProperties}
        aria-label={label}
      />
    </div>
  );
}

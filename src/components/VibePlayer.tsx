"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Mic, Pause, Play, Shuffle, Sparkles, Volume2 } from "lucide-react";
import { AmbientEngine } from "@/lib/audio/engine";
import { getScene, SCENES } from "@/lib/scenes";
import LayerSlider from "./LayerSlider";
import Particles from "./Particles";
import Visualizer from "./Visualizer";

const VOICE_LINES: Record<string, string> = {
  saloon: "आइए भाई, बाल कटवाइए, और पुराने गाने का आनंद लीजिए।",
  bus: "बस छूट रही है, अंदर आ जाइए, खिड़की के पास बैठिए।",
  cafe: "बारिश तेज़ हो रही है, चाय ले लीजिए और आराम से बैठिए।",
  shaam: "शाम हो गई है, चिड़ियाँ घर लौट रही हैं, शहर की रौनक जाग रही है।",
};

type VoiceState = "idle" | "loading" | "ready" | "locked" | "error";

function initialVolumes(): Record<string, Record<string, number>> {
  return Object.fromEntries(
    SCENES.map((scene) => [
      scene.id,
      Object.fromEntries(scene.layers.map((layer) => [layer.id, layer.volume])),
    ]),
  );
}

export default function VibePlayer() {
  const [sceneId, setSceneId] = useState(SCENES[0].id);
  const [playing, setPlaying] = useState(false);
  const [master, setMaster] = useState(0.9);
  const [volumes, setVolumes] = useState(initialVolumes);
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");

  const engineRef = useRef<AmbientEngine | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const scene = useMemo(() => getScene(sceneId), [sceneId]);
  const sceneVolumes = volumes[scene.id];

  useEffect(() => {
    engineRef.current = new AmbientEngine();
    return () => {
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    if (!playing) {
      engine.stopAll();
      return;
    }
    const specs = scene.layers.map((layer) => ({
      id: layer.id,
      volume: sceneVolumes[layer.id] ?? layer.volume,
    }));
    void engine.setScene(specs, scene.id);
  }, [playing, scene, sceneVolumes]);

  useEffect(() => {
    engineRef.current?.setMasterVolume(master);
  }, [master]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const updateVolume = useCallback(
    (layerId: string, value: number) => {
      setVolumes((prev) => ({
        ...prev,
        [scene.id]: { ...prev[scene.id], [layerId]: value },
      }));
    },
    [scene.id],
  );

  const togglePlay = useCallback(async () => {
    const engine = engineRef.current;
    if (!engine) return;
    if (!playing) {
      await engine.start();
    }
    setPlaying((prev) => !prev);
  }, [playing]);

  const shuffle = useCallback(() => {
    setVolumes((prev) => ({
      ...prev,
      [scene.id]: Object.fromEntries(
        scene.layers.map((layer) => [layer.id, 0.25 + Math.random() * 0.7]),
      ),
    }));
  }, [scene]);

  const speakScene = useCallback(async () => {
    if (voiceState === "loading") return;
    const line = VOICE_LINES[scene.id] ?? scene.tagline;
    setVoiceState("loading");
    try {
      const res = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: line, sceneId: scene.id }),
      });
      if (res.status === 501) {
        setVoiceState("locked");
        return;
      }
      if (!res.ok) throw new Error("voice failed");
      const data = (await res.json()) as { audio?: string; mime?: string };
      if (!data.audio) throw new Error("no audio");
      const audio = new Audio(`data:${data.mime ?? "audio/mpeg"};base64,${data.audio}`);
      audioRef.current?.pause();
      audioRef.current = audio;
      await audio.play();
      setVoiceState("ready");
    } catch {
      setVoiceState("error");
    }
  }, [scene.id, scene.tagline, voiceState]);

  const getSpectrum = useCallback(
    () => engineRef.current?.getSpectrum() ?? new Uint8Array(0),
    [],
  );

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <div
        className="absolute inset-0 z-0 transition-colors duration-1000"
        style={{
          background: `radial-gradient(120% 120% at 15% 0%, ${scene.palette[2]} 0%, ${scene.palette[1]} 42%, ${scene.palette[0]} 100%)`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute -left-1/4 top-[-30%] h-[70vh] w-[70vh] rounded-full opacity-40 blur-[120px]"
          style={{
            background: scene.accent,
            animation: "aurora-shift 18s ease-in-out infinite",
          }}
        />
        <div
          className="absolute right-[-20%] bottom-[-25%] h-[60vh] w-[60vh] rounded-full opacity-25 blur-[140px]"
          style={{
            background: "#ffffff",
            animation: "aurora-shift 24s ease-in-out infinite reverse",
          }}
        />
      </div>
      <Particles scene={scene} />

      <header className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-10">
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-full text-lg shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${scene.accent}, ${scene.palette[2]})`,
            }}
          >
            🎧
          </span>
          <div className="flex flex-col leading-none">
            <span className="font-hindi text-xl text-white">माहौल</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/45">
              mahol
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-md">
          <span
            className={`h-1.5 w-1.5 rounded-full ${playing ? "animate-pulse" : ""}`}
            style={{ background: playing ? scene.accent : "rgba(255,255,255,0.3)" }}
          />
          <span className="font-mono text-[10px] uppercase tracking-widest text-white/60">
            {playing ? "on air" : "paused"}
          </span>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 gap-6 px-5 pb-10 sm:px-10 lg:grid-cols-[1.55fr_1fr]">
        <section className="flex flex-col gap-6">
          <div className="relative flex flex-1 flex-col overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-7 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={scene.id}
                initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -14, filter: "blur(8px)" }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-1"
              >
                <span className="text-3xl">{scene.emoji}</span>
                <h1 className="font-hindi text-5xl leading-tight text-white sm:text-6xl">
                  {scene.name}
                </h1>
                <p className="font-display text-2xl italic text-white/70">
                  {scene.latin}
                </p>
                <p className="mt-2 max-w-md text-sm text-white/50">{scene.tagline}</p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center gap-4">
              <button
                type="button"
                onClick={togglePlay}
                className="flex h-14 w-14 items-center justify-center rounded-full text-black shadow-lg transition-transform hover:scale-105 active:scale-95"
                style={{ background: scene.accent }}
                aria-label={playing ? "Pause" : "Play"}
              >
                {playing ? (
                  <Pause className="h-6 w-6" fill="currentColor" />
                ) : (
                  <Play className="ml-0.5 h-6 w-6" fill="currentColor" />
                )}
              </button>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white/85">
                  {playing ? "Chal raha hai" : "Chalao aur suno"}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-widest text-white/40">
                  {scene.layers.length} layers · headphones recommended
                </span>
              </div>
            </div>

            <div className="mt-auto h-24 w-full pt-8">
              <Visualizer getData={getSpectrum} accent={scene.accent} active={playing} />
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {SCENES.map((s) => {
              const active = s.id === scene.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSceneId(s.id)}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition-all ${
                    active
                      ? "border-white/25 bg-white/15 text-white shadow-lg"
                      : "border-white/10 bg-white/[0.03] text-white/55 hover:border-white/20 hover:text-white/85"
                  }`}
                >
                  <span>{s.emoji}</span>
                  <span className="font-hindi">{s.name.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>
        </section>

        <aside className="flex flex-col gap-5 rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">
                mixer
              </span>
              <span className="text-lg text-white/90">Apna mahol banao</span>
            </div>
            <button
              type="button"
              onClick={shuffle}
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 transition-colors hover:border-white/25 hover:text-white"
            >
              <Shuffle className="h-3.5 w-3.5" />
              Shuffle
            </button>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
            <Volume2 className="h-4 w-4 text-white/50" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={master}
              onChange={(event) => setMaster(Number(event.target.value))}
              className="vibe-slider"
              style={{ "--slider-accent": "#ffffff" } as CSSProperties}
              aria-label="Master volume"
            />
            <span className="w-8 text-right font-mono text-[11px] tabular-nums text-white/50">
              {Math.round(master * 100)}
            </span>
          </div>

          <div className="flex flex-col divide-y divide-white/5">
            {scene.layers.map((layer) => (
              <LayerSlider
                key={layer.id}
                label={layer.label}
                hint={layer.hint}
                accent={scene.accent}
                volume={sceneVolumes[layer.id] ?? layer.volume}
                onChange={(value) => updateVolume(layer.id, value)}
              />
            ))}
          </div>

          <div className="mt-auto flex flex-col gap-3 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" style={{ color: scene.accent }} />
              <span className="text-sm text-white/85">Awaaz mode</span>
              <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-white/40">
                elevenlabs
              </span>
            </div>
            <p className="text-xs leading-relaxed text-white/45">
              Is scene ki Hindi narration ek asli awaaz me suno — sponsor tech se
              generate hoti hai.
            </p>
            <button
              type="button"
              onClick={speakScene}
              disabled={voiceState === "loading"}
              className="flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-black transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-70"
              style={{ background: scene.accent }}
            >
              {voiceState === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
              {voiceState === "loading" ? "Bun rahi hai…" : "Scene ki awaaz suno"}
            </button>
            {voiceState === "locked" && (
              <p className="text-[11px] text-amber-300/80">
                ELEVENLABS_API_KEY set karo (.env.local) — phir yeh chalu ho jayega.
              </p>
            )}
            {voiceState === "error" && (
              <p className="text-[11px] text-rose-300/80">
                Awaaz nahi ban paayi. Dobara try karo.
              </p>
            )}
            {voiceState === "ready" && (
              <p className="text-[11px] text-emerald-300/80">
                Suna? Yeh ElevenLabs ki awaaz hai. 🎙️
              </p>
            )}
          </div>
        </aside>
      </main>

      <footer className="relative z-10 px-5 pb-6 text-center sm:px-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/25">
          memory-radio · built for the joy of it
        </p>
      </footer>
    </div>
  );
}

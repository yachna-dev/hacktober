"use client";

import { useMemo, type CSSProperties } from "react";
import type { Scene } from "@/lib/scenes";

interface ParticleSpec {
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  opacity: number;
}

function hash(value: number): number {
  const x = Math.sin(value) * 43758.5453;
  return x - Math.floor(x);
}

function round(value: number, decimals = 4): number {
  return Number(value.toFixed(decimals));
}

function makeParticles(scene: Scene): ParticleSpec[] {
  const count =
    scene.particle === "rain" ? 70 : scene.particle === "float" ? 18 : 30;
  const seedBase = scene.id.length * 97 + scene.particle.length * 31;

  return Array.from({ length: count }, (_, i) => {
    const r = (k: number) => hash(seedBase + i * 7.13 + k * 1.7);
    const size =
      scene.particle === "dust" ? 1.5 + r(2) * 2.5 : 6 + r(2) * 12;
    return {
      left: round(r(1) * 100),
      top: round(r(6) * 100),
      size: round(size),
      duration: round(
        scene.particle === "rain" ? 1.4 + r(4) * 1.6 : 12 + r(4) * 16,
        3,
      ),
      delay: round(r(5) * 14, 3),
      drift: round((r(7) - 0.5) * 120, 2),
      opacity: round(0.12 + r(3) * 0.4, 4),
    };
  });
}

export default function Particles({ scene }: { scene: Scene }) {
  const particles = useMemo(() => makeParticles(scene), [scene]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p, i) => {
        const isRain = scene.particle === "rain";
        const isFloat = scene.particle === "float";
        return (
          <span
            key={`${scene.id}-${i}`}
            className="particle"
            style={
              {
                left: `${p.left}%`,
                top: isRain ? "-8%" : isFloat ? `${p.top}%` : "105%",
                width: isRain ? "1.5px" : `${p.size}px`,
                height: isRain ? `${14 + p.size * 2}px` : `${p.size}px`,
                background: isRain
                  ? "linear-gradient(to bottom, transparent, rgba(190,220,255,0.7))"
                  : scene.accent,
                opacity: p.opacity,
                filter: isFloat ? "blur(1.5px)" : "none",
                "--drift-x": `${p.drift}px`,
                "--particle-opacity": `${p.opacity}`,
                animation: isRain
                  ? `rain-fall ${p.duration}s linear ${p.delay}s infinite`
                  : isFloat
                    ? `slow-float ${p.duration}s ease-in-out ${p.delay}s infinite`
                    : `drift-up ${p.duration}s linear ${p.delay}s infinite`,
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
}

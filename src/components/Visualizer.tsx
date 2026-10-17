"use client";

import { useEffect, useRef } from "react";

interface VisualizerProps {
  getData: () => Uint8Array;
  accent: string;
  active: boolean;
}

const BAR_COUNT = 52;

export default function Visualizer({ getData, accent, active }: VisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    const levels = new Array<number>(BAR_COUNT).fill(0);
    const idle = new Array<number>(BAR_COUNT).fill(0);

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (time: number) => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      ctx.clearRect(0, 0, width, height);

      const data = active ? getData() : new Uint8Array(0);
      const barWidth = width / BAR_COUNT;

      for (let i = 0; i < BAR_COUNT; i++) {
        let target: number;
        if (data.length > 0) {
          const stride = Math.max(1, Math.floor(data.length / 2 / BAR_COUNT));
          let sum = 0;
          for (let s = 0; s < stride; s++) {
            sum += data[i * stride + s] ?? 0;
          }
          target = sum / stride / 255;
          target = Math.pow(target, 0.75) * 1.25;
        } else {
          idle[i] = 0.1 + Math.sin(time / 900 + i * 0.5) * 0.05;
          target = idle[i];
        }
        levels[i] += (target - levels[i]) * 0.22;
        const barHeight = Math.max(3, levels[i] * height);

        const x = i * barWidth + barWidth * 0.18;
        const w = barWidth * 0.64;
        const y = height - barHeight;

        const gradient = ctx.createLinearGradient(0, height, 0, 0);
        gradient.addColorStop(0, accent);
        gradient.addColorStop(1, "rgba(255,255,255,0.75)");
        ctx.fillStyle = gradient;
        ctx.globalAlpha = active ? 0.9 : 0.28;

        const radius = Math.min(w / 2, 3);
        ctx.beginPath();
        ctx.moveTo(x, height);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.lineTo(x + w - radius, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
        ctx.lineTo(x + w, height);
        ctx.closePath();
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [accent, active, getData]);

  return <canvas ref={canvasRef} className="h-full w-full" aria-hidden />;
}

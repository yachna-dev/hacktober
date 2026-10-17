type Ctx = AudioContext;

interface Voice {
  stop: () => void;
}

type VoiceFactory = (ctx: Ctx, dest: GainNode) => Voice;

function noiseBuffer(
  ctx: Ctx,
  kind: "white" | "pink" | "brown" = "brown",
  seconds = 3,
): AudioBuffer {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  let b0 = 0;
  let b1 = 0;
  let b2 = 0;

  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    if (kind === "white") {
      data[i] = white * 0.6;
    } else if (kind === "brown") {
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.2;
    } else {
      b0 = 0.99765 * b0 + white * 0.099046;
      b1 = 0.963 * b1 + white * 0.2965164;
      b2 = 0.57 * b2 + white * 1.0526913;
      data[i] = (b0 + b1 + b2 + white * 0.1848) * 0.15;
    }
  }
  return buffer;
}

function looped(ctx: Ctx, buffer: AudioBuffer): AudioBufferSourceNode {
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.loop = true;
  return src;
}

function gainOf(ctx: Ctx, value: number, dest: AudioNode): GainNode {
  const g = ctx.createGain();
  g.gain.value = value;
  g.connect(dest);
  return g;
}

const VOICES = {
  hum: (ctx, dest) => {
    const out = gainOf(ctx, 0.55, dest);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 190;
    lp.Q.value = 0.7;
    lp.connect(out);

    const rumble = looped(ctx, noiseBuffer(ctx, "brown", 4));
    rumble.connect(lp);

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.13;
    const lfoAmt = ctx.createGain();
    lfoAmt.gain.value = 0.22;
    lfo.connect(lfoAmt);
    lfoAmt.connect(out.gain);

    rumble.start();
    lfo.start();
    return {
      stop: () => {
        stopSources(rumble, lfo);
        out.disconnect();
      },
    };
  },

  buzz: (ctx, dest) => {
    const out = gainOf(ctx, 0.34, dest);
    const am = ctx.createGain();
    am.gain.value = 1;
    am.connect(out);

    const osc = ctx.createOscillator();
    osc.type = "square";
    osc.frequency.value = 118;
    const osc2 = ctx.createOscillator();
    osc2.type = "sawtooth";
    osc2.frequency.value = 237;

    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 2400;
    bp.Q.value = 1.1;

    const air = ctx.createGain();
    air.gain.value = 0.5;
    const nz = looped(ctx, noiseBuffer(ctx, "white", 2));
    nz.connect(air);
    air.connect(am);

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 31;
    const lfoAmt = ctx.createGain();
    lfoAmt.gain.value = 0.65;
    lfo.connect(lfoAmt);
    lfoAmt.connect(am.gain);

    osc.connect(bp);
    osc2.connect(bp);
    bp.connect(am);

    osc.start();
    osc2.start();
    nz.start();
    lfo.start();
    return {
      stop: () => {
        stopSources(osc, osc2, nz, lfo);
        out.disconnect();
      },
    };
  },

  snips: (ctx, dest) => {
    const out = gainOf(ctx, 0.5, dest);
    const buffer = noiseBuffer(ctx, "white", 0.4);
    const timer = window.setInterval(() => {
      if (Math.random() > 0.5) {
        const s = ctx.createBufferSource();
        s.buffer = buffer;
        const hp = ctx.createBiquadFilter();
        hp.type = "highpass";
        hp.frequency.value = 3200;
        const env = ctx.createGain();
        const t = ctx.currentTime;
        env.gain.setValueAtTime(0.0001, t);
        env.gain.linearRampToValueAtTime(0.03 + Math.random() * 0.05, t + 0.004);
        env.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
        s.connect(hp);
        hp.connect(env);
        env.connect(out);
        s.start(t, Math.random() * 0.3);
        s.stop(t + 0.09);
      }
    }, 250);
    return {
      stop: () => {
        window.clearInterval(timer);
        out.disconnect();
      },
    };
  },

  radio: (ctx, dest) => {
    const out = gainOf(ctx, 0.5, dest);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 1500;
    lp.Q.value = 0.6;
    lp.connect(out);

    const scale = [0, 3, 5, 7, 10, 12, 15];
    const root = 196;
    const notes = scale.map((s) => root * Math.pow(2, s / 12));
    const play = () => {
      const o = ctx.createOscillator();
      o.type = Math.random() < 0.5 ? "sine" : "triangle";
      o.frequency.value = notes[Math.floor(Math.random() * notes.length)];
      const env = ctx.createGain();
      const t = ctx.currentTime;
      const dur = 1.3 + Math.random() * 1.5;
      env.gain.setValueAtTime(0.0001, t);
      env.gain.linearRampToValueAtTime(0.055, t + 0.18);
      env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(env);
      env.connect(lp);
      o.start(t);
      o.stop(t + dur + 0.05);
    };
    play();
    const timer = window.setInterval(play, 1350);
    return {
      stop: () => {
        window.clearInterval(timer);
        out.disconnect();
      },
    };
  },

  murmur: (ctx, dest) => {
    const out = gainOf(ctx, 0.3, dest);
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 720;
    bp.Q.value = 0.85;
    bp.connect(out);
    const src = looped(ctx, noiseBuffer(ctx, "pink", 4));
    src.connect(bp);
    const timer = window.setInterval(() => {
      const t = ctx.currentTime;
      const target = 0.14 + Math.random() * 0.4;
      out.gain.cancelScheduledValues(t);
      out.gain.setValueAtTime(out.gain.value, t);
      out.gain.linearRampToValueAtTime(target, t + 0.3 + Math.random() * 0.5);
    }, 650);
    src.start();
    return {
      stop: () => {
        window.clearInterval(timer);
        stopSources(src);
        out.disconnect();
      },
    };
  },

  rain: (ctx, dest) => {
    const out = gainOf(ctx, 0.38, dest);
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 950;
    hp.connect(out);
    const src = looped(ctx, noiseBuffer(ctx, "white", 4));
    src.connect(hp);
    const buffer = noiseBuffer(ctx, "white", 0.2);
    const timer = window.setInterval(() => {
      const s = ctx.createBufferSource();
      s.buffer = buffer;
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 1800 + Math.random() * 2600;
      bp.Q.value = 6;
      const env = ctx.createGain();
      const t = ctx.currentTime;
      env.gain.setValueAtTime(0.0001, t);
      env.gain.linearRampToValueAtTime(0.04, t + 0.005);
      env.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
      s.connect(bp);
      bp.connect(env);
      env.connect(out);
      s.start(t, Math.random() * 0.15);
      s.stop(t + 0.11);
    }, 220);
    src.start();
    return {
      stop: () => {
        window.clearInterval(timer);
        stopSources(src);
        out.disconnect();
      },
    };
  },

  traffic: (ctx, dest) => {
    const out = gainOf(ctx, 0.32, dest);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 640;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 90;
    hp.connect(out);
    lp.connect(hp);
    const src = looped(ctx, noiseBuffer(ctx, "brown", 4));
    src.connect(lp);
    const timer = window.setInterval(() => {
      const t = ctx.currentTime;
      const target = 0.18 + Math.random() * 0.45;
      out.gain.cancelScheduledValues(t);
      out.gain.setValueAtTime(out.gain.value, t);
      out.gain.linearRampToValueAtTime(target, t + 1.4 + Math.random());
    }, 1600);
    src.start();
    return {
      stop: () => {
        window.clearInterval(timer);
        stopSources(src);
        out.disconnect();
      },
    };
  },

  horn: (ctx, dest) => {
    const out = gainOf(ctx, 0.32, dest);
    let timer = 0;
    const blow = () => {
      const o = ctx.createOscillator();
      o.type = "sawtooth";
      o.frequency.value = 311;
      const o2 = ctx.createOscillator();
      o2.type = "sawtooth";
      o2.frequency.value = 466;
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 1400;
      const env = ctx.createGain();
      const t = ctx.currentTime;
      const dur = 0.5 + Math.random() * 0.5;
      env.gain.setValueAtTime(0.0001, t);
      env.gain.linearRampToValueAtTime(0.09, t + 0.06);
      env.gain.setValueAtTime(0.09, t + dur * 0.7);
      env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(lp);
      o2.connect(lp);
      lp.connect(env);
      env.connect(out);
      o.start(t);
      o2.start(t);
      o.stop(t + dur + 0.05);
      o2.stop(t + dur + 0.05);
    };
    const schedule = () => {
      timer = window.setTimeout(() => {
        if (Math.random() > 0.4) blow();
        schedule();
      }, 4000 + Math.random() * 9000);
    };
    schedule();
    return {
      stop: () => {
        window.clearTimeout(timer);
        out.disconnect();
      },
    };
  },

  clinks: (ctx, dest) => {
    const out = gainOf(ctx, 0.4, dest);
    const timer = window.setInterval(() => {
      if (Math.random() < 0.4) return;
      const partials = [1, 2.41, 3.83];
      const base = 900 + Math.random() * 1400;
      const t = ctx.currentTime;
      partials.forEach((p, i) => {
        const o = ctx.createOscillator();
        o.type = "sine";
        o.frequency.value = base * p;
        const env = ctx.createGain();
        const amp = 0.05 / (i + 1);
        env.gain.setValueAtTime(0.0001, t);
        env.gain.linearRampToValueAtTime(amp, t + 0.003);
        env.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
        o.connect(env);
        env.connect(out);
        o.start(t);
        o.stop(t + 0.65);
      });
    }, 1500);
    return {
      stop: () => {
        window.clearInterval(timer);
        out.disconnect();
      },
    };
  },

  birds: (ctx, dest) => {
    const out = gainOf(ctx, 0.28, dest);
    const timer = window.setInterval(() => {
      if (Math.random() < 0.55) return;
      const chirps = 2 + Math.floor(Math.random() * 3);
      const t = ctx.currentTime;
      for (let i = 0; i < chirps; i++) {
        const at = t + i * 0.12;
        const o = ctx.createOscillator();
        o.type = "sine";
        const start = 2200 + Math.random() * 1400;
        o.frequency.setValueAtTime(start, at);
        o.frequency.exponentialRampToValueAtTime(start * 1.35, at + 0.07);
        const env = ctx.createGain();
        env.gain.setValueAtTime(0.0001, at);
        env.gain.linearRampToValueAtTime(0.05, at + 0.02);
        env.gain.exponentialRampToValueAtTime(0.0001, at + 0.1);
        o.connect(env);
        env.connect(out);
        o.start(at);
        o.stop(at + 0.12);
      }
    }, 2600);
    return {
      stop: () => {
        window.clearInterval(timer);
        out.disconnect();
      },
    };
  },
} satisfies Record<string, VoiceFactory>;

export type VoiceId = keyof typeof VOICES;

function stopSources(...sources: AudioScheduledSourceNode[]) {
  for (const src of sources) {
    try {
      src.stop();
    } catch {
      // already stopped
    }
  }
}

export function hasVoice(id: string): id is VoiceId {
  return id in VOICES;
}

interface ActiveLayer {
  gain: GainNode;
  voice: Voice;
}

export interface EngineLayer {
  id: string;
  volume: number;
}

export class AmbientEngine {
  private ctx: Ctx | null = null;
  private master: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private layers = new Map<string, ActiveLayer>();
  private sceneId: string | null = null;

  private ensureContext(): Ctx {
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.ctx = new Ctor();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.9;
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 1024;
      this.analyser.smoothingTimeConstant = 0.85;
      this.master.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  async start(): Promise<void> {
    const ctx = this.ensureContext();
    if (ctx.state === "suspended") {
      await ctx.resume();
    }
  }

  async setScene(layers: EngineLayer[], sceneId: string): Promise<void> {
    const ctx = this.ensureContext();
    if (ctx.state === "suspended") {
      await ctx.resume();
    }
    if (this.sceneId !== sceneId) {
      this.stopAll();
      this.sceneId = sceneId;
    }
    const master = this.master;
    if (!master) return;

    const wanted = new Set(layers.map((l) => l.id));
    for (const [id, layer] of this.layers) {
      if (!wanted.has(id)) {
        layer.voice.stop();
        layer.gain.disconnect();
        this.layers.delete(id);
      }
    }
    for (const layer of layers) {
      const existing = this.layers.get(layer.id);
      if (existing) {
        existing.gain.gain.setTargetAtTime(
          layer.volume,
          ctx.currentTime,
          0.05,
        );
        continue;
      }
      if (!hasVoice(layer.id)) continue;
      const gain = ctx.createGain();
      gain.gain.value = 0;
      gain.connect(master);
      const voice = VOICES[layer.id](ctx, gain);
      gain.gain.setTargetAtTime(layer.volume, ctx.currentTime, 0.08);
      this.layers.set(layer.id, { gain, voice });
    }
  }

  setLayerVolume(id: string, volume: number): void {
    const layer = this.layers.get(id);
    if (!layer || !this.ctx) return;
    layer.gain.gain.setTargetAtTime(volume, this.ctx.currentTime, 0.04);
  }

  setMasterVolume(volume: number): void {
    if (!this.master || !this.ctx) return;
    this.master.gain.setTargetAtTime(volume, this.ctx.currentTime, 0.05);
  }

  getWaveform(): Uint8Array {
    if (!this.analyser) return new Uint8Array(0);
    const data = new Uint8Array(this.analyser.fftSize);
    this.analyser.getByteTimeDomainData(data);
    return data;
  }

  getSpectrum(): Uint8Array {
    if (!this.analyser) return new Uint8Array(0);
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }

  stopAll(): void {
    for (const layer of this.layers.values()) {
      layer.voice.stop();
      layer.gain.disconnect();
    }
    this.layers.clear();
    this.sceneId = null;
  }

  dispose(): void {
    this.stopAll();
    this.ctx?.close();
    this.ctx = null;
    this.master = null;
    this.analyser = null;
  }
}

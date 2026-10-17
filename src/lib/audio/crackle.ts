type Ctx = AudioContext;

function makeNoise(ctx: Ctx, kind: "white" | "brown", seconds: number): AudioBuffer {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    if (kind === "white") {
      data[i] = white * 0.6;
    } else {
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.2;
    }
  }
  return buffer;
}

export class VinylHiss {
  private ctx: Ctx | null = null;
  private master: GainNode | null = null;
  private popBuffer: AudioBuffer | null = null;
  private popTimer = 0;
  private running = false;
  private volume = 0.55;

  private ensure(): Ctx {
    if (this.ctx) return this.ctx;
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new Ctor();
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    const hiss = ctx.createBufferSource();
    hiss.buffer = makeNoise(ctx, "white", 3);
    hiss.loop = true;
    const hissHp = ctx.createBiquadFilter();
    hissHp.type = "highpass";
    hissHp.frequency.value = 1400;
    const hissGain = ctx.createGain();
    hissGain.gain.value = 0.22;
    hiss.connect(hissHp);
    hissHp.connect(hissGain);
    hissGain.connect(master);
    hiss.start();

    const rumble = ctx.createBufferSource();
    rumble.buffer = makeNoise(ctx, "brown", 4);
    rumble.loop = true;
    const rumbleLp = ctx.createBiquadFilter();
    rumbleLp.type = "lowpass";
    rumbleLp.frequency.value = 150;
    const rumbleGain = ctx.createGain();
    rumbleGain.gain.value = 0.3;
    rumble.connect(rumbleLp);
    rumbleLp.connect(rumbleGain);
    rumbleGain.connect(master);
    rumble.start();

    this.ctx = ctx;
    this.master = master;
    this.popBuffer = makeNoise(ctx, "white", 0.25);
    return ctx;
  }

  private schedulePop(): void {
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master || !this.popBuffer) return;

    this.popTimer = window.setTimeout(() => {
      if (!this.running) return;
      const src = ctx.createBufferSource();
      src.buffer = this.popBuffer;
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 1100 + Math.random() * 3600;
      bp.Q.value = 2.5;
      const env = ctx.createGain();
      const t = ctx.currentTime;
      env.gain.setValueAtTime(0.0001, t);
      env.gain.linearRampToValueAtTime(0.12 + Math.random() * 0.5, t + 0.002);
      env.gain.exponentialRampToValueAtTime(0.0001, t + 0.03 + Math.random() * 0.05);
      src.connect(bp);
      bp.connect(env);
      env.connect(master);
      src.start(t, Math.random() * 0.15);
      src.stop(t + 0.09);
      this.schedulePop();
    }, 90 + Math.random() * 900);
  }

  async start(): Promise<void> {
    const ctx = this.ensure();
    if (ctx.state === "suspended") await ctx.resume();
    if (!this.master) return;
    this.running = true;
    this.master.gain.setTargetAtTime(this.volume, ctx.currentTime, 0.08);
    this.schedulePop();
  }

  stop(): void {
    this.running = false;
    window.clearTimeout(this.popTimer);
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.06);
    }
  }

  setVolume(volume: number): void {
    this.volume = volume;
    if (this.running && this.master && this.ctx) {
      this.master.gain.setTargetAtTime(volume, this.ctx.currentTime, 0.05);
    }
  }

  dispose(): void {
    this.stop();
    void this.ctx?.close();
    this.ctx = null;
    this.master = null;
  }
}

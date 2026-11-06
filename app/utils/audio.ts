// Web Audio API Generative Sound Synthesizer (Zero asset download, ultra-low latency)
let audioCtx: AudioContext | null = null;
let soundEnabled = true;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export const SoundEngine = {
  isEnabled(): boolean {
    return soundEnabled;
  },
  toggle(): boolean {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
      this.playPop(520);
    }
    return soundEnabled;
  },
  setEnabled(enabled: boolean) {
    soundEnabled = enabled;
  },

  // Subtle typewriter / hover tick (high-frequency, ultra-short 8ms impulse)
  playTick(freq = 1200) {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq + Math.random() * 200, ctx.currentTime);
      gain.gain.setValueAtTime(0.018, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.015);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.018);
    } catch {
      // Ignore audio errors
    }
  },

  // UI button click / toggle pop (pleasant mid-tone)
  playPop(freq = 440) {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.045, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.055);
    } catch {
      // Ignore
    }
  },

  // Success / Add-to-cart harmonic chime (three-tone chord)
  playChime() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(f, ctx.currentTime + idx * 0.04);
        gain.gain.setValueAtTime(0.04, ctx.currentTime + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.04 + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.04);
        osc.stop(ctx.currentTime + idx * 0.04 + 0.3);
      });
    } catch {
      // Ignore
    }
  },

  // Warning / Human-in-the-loop alarm (two-tone alert)
  playAlarm() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      [0, 0.1].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(880, ctx.currentTime + delay);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + delay + 0.04);
        gain.gain.setValueAtTime(0.035, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.09);
      });
    } catch {
      // Ignore
    }
  },

  // Material change whoosh
  playWhoosh() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.13);
    } catch {
      // Ignore
    }
  },
};

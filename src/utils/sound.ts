// Sound system using native Web Audio API for Retro GBA/Minish Cap sound effects
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playSound(type: 'punch' | 'gatling' | 'whip' | 'dash' | 'hit' | 'pickup' | 'unlock' | 'victory' | 'gameover') {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    switch (type) {
      case 'punch': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
        break;
      }
      case 'gatling': {
        for (let i = 0; i < 4; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'square';
          osc.frequency.setValueAtTime(450 - i * 50, now + i * 0.06);
          osc.frequency.exponentialRampToValueAtTime(80, now + i * 0.06 + 0.05);
          gain.gain.setValueAtTime(0.15, now + i * 0.06);
          gain.gain.linearRampToValueAtTime(0.01, now + i * 0.06 + 0.05);
          osc.start(now + i * 0.06);
          osc.stop(now + i * 0.06 + 0.05);
        }
        break;
      }
      case 'whip': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
        break;
      }
      case 'dash': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
        break;
      }
      case 'hit': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.linearRampToValueAtTime(30, now + 0.2);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
        break;
      }
      case 'pickup': {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.type = 'sine';
        osc2.type = 'triangle';
        osc1.frequency.setValueAtTime(523, now);
        osc1.frequency.setValueAtTime(659, now + 0.08);
        osc1.frequency.setValueAtTime(784, now + 0.16);
        osc1.frequency.setValueAtTime(1046, now + 0.24);
        osc2.frequency.setValueAtTime(1046, now + 0.24);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
        osc1.start(now);
        osc1.stop(now + 0.4);
        osc2.start(now + 0.24);
        osc2.stop(now + 0.4);
        break;
      }
      case 'unlock': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.setValueAtTime(330, now + 0.1);
        osc.frequency.setValueAtTime(440, now + 0.2);
        osc.frequency.setValueAtTime(554, now + 0.3);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
        break;
      }
      case 'victory': {
        const notes = [261, 329, 392, 523, 659, 784, 1046];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, now + idx * 0.1);
          gain.gain.setValueAtTime(0.15, now + idx * 0.1);
          gain.gain.linearRampToValueAtTime(0.01, now + idx * 0.1 + 0.3);
          osc.start(now + idx * 0.1);
          osc.stop(now + idx * 0.1 + 0.3);
        });
        break;
      }
      case 'gameover': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(55, now + 0.8);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.8);
        osc.start(now);
        osc.stop(now + 0.8);
        break;
      }
    }
  } catch (error) {
    console.warn("Audio Context blocked or failed to initialize", error);
  }
}

// ─── Ambient Music System ─────────────────────────────────────────────────────
// Generates looping background music per zone using Web Audio API oscillators.
// No external files needed — all synthesized in-browser like a GBA cartridge.

let ambientNodes: { oscs: OscillatorNode[]; gains: GainNode[]; masterGain: GainNode } | null = null;
let currentAmbientZone: string | null = null;

// Zone music configs — each has a melody pattern and a bass pad
const ZONE_THEMES: Record<string, { melody: number[]; bass: number[]; tempo: number; waveform: OscillatorType; label: string }> = {
  ship: {
    label: 'Barco de Alvida 🏴‍☠️',
    melody: [220, 247, 262, 294, 330, 294, 262, 247],   // A minor haunting pirate melody
    bass:   [110, 110, 131, 131, 110, 110, 98,  98],
    tempo:  0.35,
    waveform: 'triangle',
  },
  shellport: {
    label: 'Shellport — Cubierta ⚓',
    melody: [262, 294, 330, 349, 392, 349, 330, 294],   // C major town theme
    bass:   [131, 131, 147, 147, 196, 196, 147, 131],
    tempo:  0.28,
    waveform: 'square',
  },
  dungeon: {
    label: 'Mazmorra — Prisión 🔒',
    melody: [185, 196, 185, 175, 165, 175, 185, 196],   // Tense Dm dungeon loop
    bass:   [93,  93,  87,  87,  82,  82,  87,  93],
    tempo:  0.4,
    waveform: 'sawtooth',
  },
  boss: {
    label: 'Batalla de Jefe ⚔️',
    melody: [440, 494, 523, 587, 659, 587, 523, 440],   // Intense A major boss theme
    bass:   [220, 220, 261, 261, 329, 329, 261, 220],
    tempo:  0.18,
    waveform: 'square',
  },
  victory: {
    label: 'Victoria 🏆',
    melody: [523, 587, 659, 698, 784, 698, 659, 784],   // Bright F major fanfare
    bass:   [261, 261, 329, 329, 392, 392, 329, 349],
    tempo:  0.22,
    waveform: 'triangle',
  },
};

export type AmbientZone = keyof typeof ZONE_THEMES;

export function getAmbientZoneForLevel(level: number): AmbientZone {
  if (level === 1) return 'ship';
  if (level === 2) return 'shellport';
  if (level === 3) return 'dungeon';
  if (level === 4) return 'boss';
  if (level === 5) return 'dungeon';
  return 'ship';
}

export function playAmbientMusic(zone: AmbientZone) {
  if (currentAmbientZone === zone) return; // Already playing this zone
  stopAmbientMusic();

  try {
    const ctx = getAudioContext();
    const theme = ZONE_THEMES[zone];
    if (!theme) return;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 2.0); // Fade in over 2s
    masterGain.connect(ctx.destination);

    const oscs: OscillatorNode[] = [];
    const gains: GainNode[] = [];

    // Schedule looping melody — runs indefinitely
    let melodyTime = ctx.currentTime + 0.1;
    const scheduleLoop = () => {
      theme.melody.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.connect(g);
        g.connect(masterGain);
        osc.type = theme.waveform;
        osc.frequency.setValueAtTime(freq, melodyTime + i * theme.tempo);
        g.gain.setValueAtTime(0.4, melodyTime + i * theme.tempo);
        g.gain.linearRampToValueAtTime(0.0, melodyTime + i * theme.tempo + theme.tempo * 0.9);
        osc.start(melodyTime + i * theme.tempo);
        osc.stop(melodyTime + i * theme.tempo + theme.tempo * 0.9);
        oscs.push(osc);
        gains.push(g);
      });

      theme.bass.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.connect(g);
        g.connect(masterGain);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, melodyTime + i * theme.tempo);
        g.gain.setValueAtTime(0.25, melodyTime + i * theme.tempo);
        g.gain.linearRampToValueAtTime(0.0, melodyTime + i * theme.tempo + theme.tempo * 1.8);
        osc.start(melodyTime + i * theme.tempo);
        osc.stop(melodyTime + i * theme.tempo + theme.tempo * 1.9);
        oscs.push(osc);
        gains.push(g);
      });

      melodyTime += theme.melody.length * theme.tempo;
    };

    // Schedule 12 repetitions (~5-10 mins of music)
    for (let rep = 0; rep < 12; rep++) {
      scheduleLoop();
    }

    ambientNodes = { oscs, gains, masterGain };
    currentAmbientZone = zone;
  } catch (e) {
    console.warn('Ambient music failed:', e);
  }
}

export function stopAmbientMusic() {
  if (!ambientNodes) return;
  try {
    const { masterGain, oscs } = ambientNodes;
    const ctx = getAudioContext();
    masterGain.gain.linearRampToValueAtTime(0.0, ctx.currentTime + 1.0); // Fade out
    setTimeout(() => {
      oscs.forEach(o => { try { o.stop(); } catch (_) {} });
    }, 1100);
  } catch (_) {}
  ambientNodes = null;
  currentAmbientZone = null;
}

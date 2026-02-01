import { Howl } from 'howler';

// Piano note frequencies for Web Audio API synthesis
const NOTE_FREQUENCIES: Record<string, number> = {
  C4: 261.63,
  'C#4': 277.18,
  D4: 293.66,
  'D#4': 311.13,
  E4: 329.63,
  F4: 349.23,
  'F#4': 369.99,
  G4: 392.00,
  'G#4': 415.30,
  A4: 440.00,
  'A#4': 466.16,
  B4: 493.88,
  C5: 523.25,
  'C#5': 554.37,
};

// Audio context for synthesized piano sounds
let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

// Resume audio context on user interaction (for iOS/Safari)
export const resumeAudioContext = async (): Promise<void> => {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }
};

// Play a synthesized piano note
export const playNote = (note: string, duration: number = 0.8, volume: number = 0.8): void => {
  const frequency = NOTE_FREQUENCIES[note];
  if (!frequency) return;

  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Create oscillator for the fundamental
    const oscillator = ctx.createOscillator();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(frequency, now);

    // Create second oscillator for harmonics
    const oscillator2 = ctx.createOscillator();
    oscillator2.type = 'sine';
    oscillator2.frequency.setValueAtTime(frequency * 2, now);

    // Gain nodes for envelope
    const gainNode = ctx.createGain();
    const gainNode2 = ctx.createGain();
    const masterGain = ctx.createGain();

    // Piano-like ADSR envelope
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(volume * 0.7, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(volume * 0.4, now + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    gainNode2.gain.setValueAtTime(0, now);
    gainNode2.gain.linearRampToValueAtTime(volume * 0.3, now + 0.01);
    gainNode2.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.5);

    masterGain.gain.setValueAtTime(volume, now);

    // Connect nodes
    oscillator.connect(gainNode);
    oscillator2.connect(gainNode2);
    gainNode.connect(masterGain);
    gainNode2.connect(masterGain);
    masterGain.connect(ctx.destination);

    // Start and stop
    oscillator.start(now);
    oscillator2.start(now);
    oscillator.stop(now + duration);
    oscillator2.stop(now + duration);
  } catch (e) {
    console.error('Error playing note:', e);
  }
};

// Animal sounds (fun mode)
const animalSounds: Record<string, string> = {
  C4: '🐱 Meow!',
  D4: '🐶 Woof!',
  E4: '🐮 Moo!',
  F4: '🐷 Oink!',
  G4: '🐸 Ribbit!',
  A4: '🐔 Cluck!',
  B4: '🦁 Roar!',
  C5: '🐱 Meow!',
};

export const getAnimalEmoji = (note: string): string => {
  return animalSounds[note] || '🎵';
};

// Synthesize a quick sound effect
export const playSuccessSound = (): void => {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  [523.25, 659.25, 783.99].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + i * 0.1);
    gain.gain.setValueAtTime(0.3, now + i * 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + i * 0.1);
    osc.stop(now + i * 0.1 + 0.3);
  });
};

export const playFailSound = (): void => {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(200, now);
  osc.frequency.linearRampToValueAtTime(150, now + 0.2);
  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.3);
};

export const playStarSound = (): void => {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  [880, 1108.73, 1318.51].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + i * 0.05);
    gain.gain.setValueAtTime(0.2, now + i * 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + i * 0.05);
    osc.stop(now + i * 0.05 + 0.4);
  });
};

// Pre-defined melodies - Extended library
export const MELODIES = {
  'twinkle-twinkle': {
    name: 'Twinkle Twinkle',
    notes: ['C4', 'C4', 'G4', 'G4', 'A4', 'A4', 'G4', 'F4', 'F4', 'E4', 'E4', 'D4', 'D4', 'C4'],
    tempo: 450,
  },
  'mary-lamb': {
    name: 'Mary Had A Little Lamb',
    notes: ['E4', 'D4', 'C4', 'D4', 'E4', 'E4', 'E4', 'D4', 'D4', 'D4', 'E4', 'G4', 'G4'],
    tempo: 400,
  },
  'happy-birthday': {
    name: 'Happy Birthday',
    notes: ['C4', 'C4', 'D4', 'C4', 'F4', 'E4', 'C4', 'C4', 'D4', 'C4', 'G4', 'F4'],
    tempo: 450,
  },
  'ode-to-joy': {
    name: 'Ode to Joy',
    notes: ['E4', 'E4', 'F4', 'G4', 'G4', 'F4', 'E4', 'D4', 'C4', 'C4', 'D4', 'E4', 'E4', 'D4', 'D4'],
    tempo: 400,
  },
  'jingle-bells': {
    name: 'Jingle Bells',
    notes: ['E4', 'E4', 'E4', 'E4', 'E4', 'E4', 'E4', 'G4', 'C4', 'D4', 'E4', 'F4', 'F4', 'F4', 'F4', 'E4', 'E4', 'E4', 'E4', 'D4', 'D4', 'E4', 'D4', 'G4'],
    tempo: 300,
  },
  'hot-cross-buns': {
    name: 'Hot Cross Buns',
    notes: ['E4', 'D4', 'C4', 'E4', 'D4', 'C4', 'C4', 'C4', 'C4', 'C4', 'D4', 'D4', 'D4', 'D4', 'E4', 'D4', 'C4'],
    tempo: 400,
  },
  'london-bridge': {
    name: 'London Bridge',
    notes: ['G4', 'A4', 'G4', 'F4', 'E4', 'F4', 'G4', 'D4', 'E4', 'F4', 'E4', 'F4', 'G4', 'G4', 'A4', 'G4', 'F4', 'E4', 'F4', 'G4', 'D4', 'G4', 'E4', 'C4'],
    tempo: 350,
  },
  'row-your-boat': {
    name: 'Row Your Boat',
    notes: ['C4', 'C4', 'C4', 'D4', 'E4', 'E4', 'D4', 'E4', 'F4', 'G4', 'C5', 'C5', 'C5', 'G4', 'G4', 'G4', 'E4', 'E4', 'E4', 'C4', 'C4', 'C4', 'G4', 'F4', 'E4', 'D4', 'C4'],
    tempo: 350,
  },
  'old-macdonald': {
    name: 'Old MacDonald',
    notes: ['G4', 'G4', 'G4', 'D4', 'E4', 'E4', 'D4', 'B4', 'B4', 'A4', 'A4', 'G4', 'D4', 'G4', 'G4', 'G4', 'D4', 'E4', 'E4', 'D4'],
    tempo: 350,
  },
  'baa-baa-sheep': {
    name: 'Baa Baa Black Sheep',
    notes: ['G4', 'G4', 'D4', 'D4', 'E4', 'F4', 'G4', 'A4', 'G4', 'F4', 'E4', 'E4', 'D4', 'C4', 'D4', 'E4', 'F4', 'G4'],
    tempo: 400,
  },
};

export type MelodyId = keyof typeof MELODIES;

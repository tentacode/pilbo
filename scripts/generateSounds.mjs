import { Buffer } from "node:buffer";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const SAMPLE_RATE = 44100;
const PEAK_AMPLITUDE = 0.6;
const OUTPUT_DIRECTORY = "assets/sounds";

const NOTE_OFFSETS = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 };

function frequencyOf(note) {
  const [, letter, accidental, octave] = note.match(/^([A-G])(#|b)?(\d)$/);
  const accidentalOffset = accidental === "#" ? 1 : accidental === "b" ? -1 : 0;
  const semitonesFromA4 = NOTE_OFFSETS[letter] + accidentalOffset + (Number(octave) - 4) * 12;
  return 440 * 2 ** (semitonesFromA4 / 12);
}

function createRandom(seed) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function createBuffer(durationInSeconds) {
  return new Float32Array(Math.ceil(durationInSeconds * SAMPLE_RATE));
}

function addSample(buffer, index, value) {
  if (index >= 0 && index < buffer.length) buffer[index] += value;
}

function envelope(time, duration, attack, release) {
  if (time < attack) return time / attack;
  if (time > duration - release) return Math.max(0, (duration - time) / release);
  return 1;
}

function addBeep(buffer, { start, frequency, duration, volume = 1 }) {
  const startIndex = Math.round(start * SAMPLE_RATE);
  const length = Math.round(duration * SAMPLE_RATE);
  for (let index = 0; index < length; index++) {
    const time = index / SAMPLE_RATE;
    const value = Math.sin(2 * Math.PI * frequency * time) * envelope(time, duration, 0.008, 0.04);
    addSample(buffer, startIndex + index, value * volume);
  }
}

function addPartials(
  buffer,
  { start, frequency, duration, volume = 1, partials, attack = 0.004, tremolo = 0 },
) {
  const startIndex = Math.round(start * SAMPLE_RATE);
  const length = Math.round(duration * SAMPLE_RATE);
  for (let index = 0; index < length; index++) {
    const time = index / SAMPLE_RATE;
    let value = 0;
    for (const { ratio, amplitude, decay } of partials) {
      value +=
        amplitude * Math.exp(-time / decay) * Math.sin(2 * Math.PI * frequency * ratio * time);
    }
    const tremoloGain = 1 - tremolo * (0.5 - 0.5 * Math.cos(2 * Math.PI * 5 * time));
    addSample(
      buffer,
      startIndex + index,
      value * volume * tremoloGain * envelope(time, duration, attack, 0.05),
    );
  }
}

const PIANO = [
  { ratio: 1, amplitude: 1, decay: 0.9 },
  { ratio: 2.001, amplitude: 0.35, decay: 0.5 },
  { ratio: 3.003, amplitude: 0.12, decay: 0.3 },
  { ratio: 4.006, amplitude: 0.05, decay: 0.2 },
];

const MUSIC_BOX = [
  { ratio: 1, amplitude: 1, decay: 0.7 },
  { ratio: 2, amplitude: 0.2, decay: 0.25 },
  { ratio: 4.07, amplitude: 0.12, decay: 0.08 },
  { ratio: 5.93, amplitude: 0.05, decay: 0.04 },
];

const PLUCK = [
  { ratio: 1, amplitude: 1, decay: 0.6 },
  { ratio: 2, amplitude: 0.5, decay: 0.25 },
  { ratio: 3, amplitude: 0.25, decay: 0.12 },
];

const VIBRAPHONE = [
  { ratio: 1, amplitude: 1, decay: 1.1 },
  { ratio: 4, amplitude: 0.25, decay: 0.12 },
  { ratio: 10, amplitude: 0.05, decay: 0.03 },
];

function addWhistle(buffer, { start, frequency, duration, volume = 1, random }) {
  const startIndex = Math.round(start * SAMPLE_RATE);
  const length = Math.round(duration * SAMPLE_RATE);
  let phase = 0;
  let lowNoise = 0;
  for (let index = 0; index < length; index++) {
    const time = index / SAMPLE_RATE;
    const vibratoDepth = 0.004 * Math.min(1, Math.max(0, (time - 0.18) / 0.25));
    const currentFrequency = frequency * (1 + vibratoDepth * Math.sin(2 * Math.PI * 5.5 * time));
    phase += (2 * Math.PI * currentFrequency) / SAMPLE_RATE;
    const noise = random() * 2 - 1;
    lowNoise += 0.08 * (noise - lowNoise);
    const breath = noise - lowNoise;
    const tone = Math.sin(phase) + 0.12 * Math.sin(2 * phase) + 0.04 * Math.sin(3 * phase);
    const value = (tone + breath * 0.02) * envelope(time, duration, 0.025, 0.06);
    addSample(buffer, startIndex + index, value * volume);
  }
}

function addDrop(buffer, { start, fromFrequency, toFrequency, volume = 1 }) {
  const startIndex = Math.round(start * SAMPLE_RATE);
  const duration = 0.16;
  const length = Math.round(duration * SAMPLE_RATE);
  let phase = 0;
  for (let index = 0; index < length; index++) {
    const time = index / SAMPLE_RATE;
    const glide = Math.min(1, time / 0.05);
    const frequency = fromFrequency * (toFrequency / fromFrequency) ** glide;
    phase += (2 * Math.PI * frequency) / SAMPLE_RATE;
    const value = Math.sin(phase) * Math.exp(-time / 0.045) * envelope(time, duration, 0.003, 0.02);
    addSample(buffer, startIndex + index, value * volume);
  }
}

const BOTTLE_MODES = [
  { frequency: 950, decay: 0.012, amplitude: 0.5 },
  { frequency: 1720, decay: 0.008, amplitude: 0.35 },
  { frequency: 2850, decay: 0.005, amplitude: 0.25 },
];

function createPills(random, count) {
  return Array.from({ length: count }, () => ({
    modes: [
      { frequency: 3000 + random() * 2500, decay: 0.002 + random() * 0.002, amplitude: 1 },
      { frequency: 6000 + random() * 3000, decay: 0.001 + random() * 0.001, amplitude: 0.5 },
    ],
  }));
}

function addImpact(buffer, { start, velocity, modes, random }) {
  const startIndex = Math.round(start * SAMPLE_RATE);
  const length = Math.round(0.04 * SAMPLE_RATE);
  const detune = 1 + (random() - 0.5) * 0.06;
  for (let index = 0; index < length; index++) {
    const time = index / SAMPLE_RATE;
    let value = time < 0.0008 ? (random() * 2 - 1) * 0.6 : 0;
    for (const { frequency, decay, amplitude } of modes) {
      value +=
        amplitude * Math.exp(-time / decay) * Math.sin(2 * Math.PI * frequency * detune * time);
    }
    addSample(buffer, startIndex + index, value * velocity);
  }
}

function addShake(buffer, { start, strength, pills, random }) {
  for (const pill of pills) {
    let time = start + random() * 0.03;
    let velocity = strength * (0.6 + random() * 0.4);
    const bounceCount = 1 + Math.floor(random() * 3);
    for (let bounce = 0; bounce <= bounceCount; bounce++) {
      addImpact(buffer, { start: time, velocity, modes: pill.modes, random });
      if (bounce === 0) {
        addImpact(buffer, { start: time, velocity: velocity * 0.5, modes: BOTTLE_MODES, random });
      }
      time += 0.012 + random() * 0.03;
      velocity *= 0.35 + random() * 0.2;
    }
  }
}

function addReverb(buffer, mix) {
  const combDelays = [1116, 1188, 1277, 1356];
  const allpassDelays = [556, 441];
  const wet = new Float32Array(buffer.length);
  for (const delay of combDelays) {
    const line = new Float32Array(delay);
    let filtered = 0;
    for (let index = 0; index < buffer.length; index++) {
      const position = index % delay;
      const output = line[position];
      filtered = output * 0.7 + filtered * 0.3;
      line[position] = buffer[index] + filtered * 0.78;
      wet[index] += output / combDelays.length;
    }
  }
  for (const delay of allpassDelays) {
    const line = new Float32Array(delay);
    for (let index = 0; index < wet.length; index++) {
      const position = index % delay;
      const delayed = line[position];
      const output = -wet[index] + delayed;
      line[position] = wet[index] + delayed * 0.5;
      wet[index] = output;
    }
  }
  return buffer.map((sample, index) => sample * (1 - mix) + wet[index] * mix);
}

function writeWave(name, buffer) {
  const fadeLength = Math.round(0.03 * SAMPLE_RATE);
  const peak = buffer.reduce((maximum, sample) => Math.max(maximum, Math.abs(sample)), 0);
  const gain = peak > 0 ? PEAK_AMPLITUDE / peak : 0;
  const data = Buffer.alloc(buffer.length * 2);
  buffer.forEach((sample, index) => {
    const fade = Math.min(1, (buffer.length - index) / fadeLength);
    const value = Math.round(sample * gain * fade * 32767);
    data.writeInt16LE(value, index * 2);
  });
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(SAMPLE_RATE, 24);
  header.writeUInt32LE(SAMPLE_RATE * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(data.length, 40);
  writeFileSync(join(OUTPUT_DIRECTORY, `${name}.wav`), Buffer.concat([header, data]));
}

function playMelody(melody, { tempo, onNote }) {
  let time = 0;
  for (const [note, length] of melody) {
    if (note) onNote({ start: time, frequency: frequencyOf(note), duration: length * tempo });
    time += length * tempo;
  }
  return time;
}

function generateShortBeep() {
  const buffer = createBuffer(0.4);
  addBeep(buffer, { start: 0, frequency: 880, duration: 0.15 });
  addBeep(buffer, { start: 0.23, frequency: 1320, duration: 0.15 });
  writeWave("beep_short", buffer);
}

function generateNocturne() {
  const eighth = 0.38;
  const pickup = 1.15;
  const buffer = createBuffer(6);
  const melody = [
    ["Bb4", pickup],
    ["G5", 4],
    ["F5", 1],
    ["G5", 1],
    ["F5", 3],
    ["Eb5", 4],
  ];
  playMelody(melody, {
    tempo: eighth,
    onNote: ({ start, frequency, duration }) =>
      addPartials(buffer, { start, frequency, duration: duration + 0.3, partials: PIANO }),
  });
  const accompaniment = [
    ["Eb2", ["G3", "Eb4"], ["Bb3", "Eb4", "G4"]],
    ["Eb3", ["Ab3", "D4"], ["Cb4", "D4", "Ab4"]],
    ["Eb2", ["G3", "Eb4"], ["Bb3", "Eb4", "G4"]],
  ];
  accompaniment.forEach(([bass, ...chords], beat) => {
    const beatStart = (pickup + beat * 3) * eighth;
    addPartials(buffer, {
      start: beatStart,
      frequency: frequencyOf(bass),
      duration: 1.4,
      volume: 0.3,
      partials: PIANO,
    });
    chords.forEach((chord, index) => {
      for (const note of chord) {
        addPartials(buffer, {
          start: beatStart + (index + 1) * eighth,
          frequency: frequencyOf(note),
          duration: 0.8,
          volume: 0.1,
          partials: PIANO,
        });
      }
    });
  });
  const finalStart = (pickup + 9) * eighth;
  ["Eb2", "Bb2", "G3", "Bb3", "Eb4"].forEach((note, index) => {
    addPartials(buffer, {
      start: finalStart + index * 0.06,
      frequency: frequencyOf(note),
      duration: 2,
      volume: index === 0 ? 0.3 : 0.12,
      partials: PIANO,
    });
  });
  writeWave("nocturne", addReverb(buffer, 0.25));
}

function generateShire() {
  const beat = 0.55;
  const random = createRandom(1);
  const buffer = createBuffer(5.2);
  const melody = [
    ["D5", 0.5],
    ["E5", 0.5],
    ["F#5", 1.5],
    ["A5", 0.5],
    ["F#5", 1],
    ["E5", 1],
    ["D5", 2.5],
  ];
  playMelody(melody, {
    tempo: beat,
    onNote: ({ start, frequency, duration }) =>
      addWhistle(buffer, { start, frequency, duration, random }),
  });
  for (const [start, notes] of [
    [1 * beat, ["D3", "A3", "F#4"]],
    [4 * beat, ["A2", "E3", "C#4"]],
    [5 * beat, ["D3", "A3", "F#4"]],
  ]) {
    notes.forEach((note, index) => {
      addPartials(buffer, {
        start: start + index * 0.05,
        frequency: frequencyOf(note),
        duration: 1.6,
        volume: 0.25,
        partials: PLUCK,
      });
    });
  }
  writeWave("shire", addReverb(buffer, 0.2));
}

function generateChime() {
  const buffer = createBuffer(2);
  ["G5", "B5", "D6"].forEach((note, index) => {
    addPartials(buffer, {
      start: index * 0.15,
      frequency: frequencyOf(note),
      duration: 1.4,
      partials: MUSIC_BOX,
    });
  });
  writeWave("chime", addReverb(buffer, 0.25));
}

function generateDrop() {
  const buffer = createBuffer(0.8);
  addDrop(buffer, { start: 0, fromFrequency: 650, toFrequency: 1400 });
  addDrop(buffer, { start: 0.2, fromFrequency: 850, toFrequency: 1800, volume: 0.8 });
  writeWave("drop", addReverb(buffer, 0.2));
}

function generatePillRattle() {
  const random = createRandom(7);
  const pills = createPills(random, 9);
  const buffer = createBuffer(0.9);
  [1, 0.8, 0.9, 0.55].forEach((strength, index) => {
    addShake(buffer, { start: index * 0.16, strength, pills, random });
  });
  writeWave("pill_rattle", addReverb(buffer, 0.08));
}

function generateGentleAlert(name, [firstEnding, secondEnding]) {
  const buffer = createBuffer(2.7);
  [
    ["E6", 0, 1],
    ["C6", 0.16, 1],
    [firstEnding, 0.32, 1],
    ["E6", 0.85, 0.6],
    ["C6", 1.01, 0.6],
    [secondEnding, 1.17, 0.6],
  ].forEach(([note, start, volume]) => {
    addPartials(buffer, {
      start,
      frequency: frequencyOf(note),
      duration: 1.3,
      volume,
      partials: VIBRAPHONE,
      tremolo: 0.25,
    });
  });
  writeWave(name, addReverb(buffer, 0.25));
}

function generateSilence() {
  writeWave("silence", createBuffer(0.5));
}

generateShortBeep();
generateNocturne();
generateShire();
generateChime();
generateDrop();
generatePillRattle();
generateGentleAlert("gentle_alert_resolved", ["G#5", "A5"]);
generateSilence();

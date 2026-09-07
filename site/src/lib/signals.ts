/**
 * Synthetic — but physiologically shaped — waveform generators.
 *
 * Every generator maps (x, t) -> amplitude in roughly [-1, 1], where `x` is a
 * normalized position along the trace (0..1) and `t` is seconds. Keeping them
 * pure functions of (x, t) is what makes the hero morph possible: to blend two
 * modalities we just lerp their outputs at the same x.
 */

export type SignalId = "ecg" | "ppg" | "eda" | "acc" | "gyr" | "mouse" | "eeg";

export interface SignalSpec {
  id: SignalId;
  label: string;
  full: string;
  unit: string;
  rate: string;
  color: string;
  /** where this signal shows up in the work */
  where: string;
  blurb: string;
  fn: (x: number, t: number) => number;
}

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

const TAU = Math.PI * 2;

const gauss = (x: number, mu: number, sigma: number) =>
  Math.exp(-((x - mu) ** 2) / (2 * sigma * sigma));

/** cheap deterministic hash noise — stable across frames for a given seed */
const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

/** smooth value noise in 1D */
const vnoise = (x: number) => {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  return (hash(i) * (1 - u) + hash(i + 1) * u) * 2 - 1;
};

const fbm = (x: number, octaves = 4) => {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < octaves; i++) {
    sum += vnoise(x * freq) * amp;
    amp *= 0.5;
    freq *= 2.07;
  }
  return sum;
};

/* ------------------------------------------------------------------ */
/* modality generators                                                 */
/* ------------------------------------------------------------------ */

/**
 * ECG — sum of gaussians approximating the P-QRS-T complex.
 * Beat phase advances with time so the trace actually travels.
 */
export function ecg(x: number, t: number): number {
  const bpm = 68;
  const beats = 4.2; // complexes visible across the trace
  const phase = (x * beats + t * (bpm / 60)) % 1;

  const p = 0.11 * gauss(phase, 0.16, 0.028);
  const q = -0.13 * gauss(phase, 0.365, 0.0075);
  const r = 1.0 * gauss(phase, 0.4, 0.0092);
  const s = -0.24 * gauss(phase, 0.437, 0.011);
  const tw = 0.24 * gauss(phase, 0.63, 0.045);

  // baseline wander + mains/EMG noise, the stuff you actually filter out
  const wander = 0.035 * Math.sin(TAU * (x * 0.7 + t * 0.09));
  const emg = 0.012 * fbm(x * 190 + t * 5, 3);

  return (p + q + r + s + tw) * 0.92 + wander + emg;
}

/** PPG — systolic peak with a dicrotic notch on the downstroke. */
export function ppg(x: number, t: number): number {
  const beats = 3.4;
  const phase = (x * beats + t * 1.08) % 1;

  const systolic = gauss(phase, 0.3, 0.075);
  const dicrotic = 0.36 * gauss(phase, 0.52, 0.062);
  const tail = 0.1 * gauss(phase, 0.72, 0.13);

  const resp = 0.09 * Math.sin(TAU * (x * 0.34 + t * 0.14)); // respiratory sinus
  return (systolic + dicrotic + tail) * 1.3 - 0.62 + resp;
}

/** EDA — slow tonic drift with sparse phasic skin-conductance responses. */
export function eda(x: number, t: number): number {
  const u = x * 3 + t * 0.16;
  const tonic = 0.34 * Math.sin(TAU * u * 0.28) + 0.12 * fbm(u * 1.4, 2);

  // phasic bursts: fast rise, slow exponential recovery
  let phasic = 0;
  for (let k = 0; k < 4; k++) {
    const onset = (hash(k * 9.7) * 0.9 + k * 0.24 - t * 0.06) % 1.35;
    const d = u * 0.32 - onset * 1.35;
    if (d > 0) phasic += 0.55 * Math.exp(-d * 2.6) * (1 - Math.exp(-d * 26));
  }
  return tonic + phasic - 0.15;
}

/** Accelerometer — gait-like rhythm plus fidget bursts (the FidgetSense case). */
export function acc(x: number, t: number): number {
  const u = x * 8 + t * 1.5;
  const stride = 0.42 * Math.sin(TAU * u * 0.5) + 0.18 * Math.sin(TAU * u * 1.0 + 0.7);

  // intermittent high-frequency bursts = repetitive fidgeting
  const burstEnv = Math.max(0, Math.sin(TAU * (x * 1.15 + t * 0.11)) - 0.35) / 0.65;
  const burst = burstEnv * 0.52 * Math.sin(TAU * u * 6.3);

  return (stride + burst + 0.16 * fbm(u * 3.1, 3)) * 0.95;
}

/** Gyroscope — sharper rotational transients, quieter between them. */
export function gyr(x: number, t: number): number {
  const u = x * 6 + t * 1.25;
  let s = 0.22 * Math.sin(TAU * u * 0.42 + 1.1);
  for (let k = 0; k < 5; k++) {
    const c = (hash(k * 3.3) + k * 0.2 + t * 0.05) % 1;
    s += 0.72 * Math.sign(hash(k * 7.1) - 0.5) * gauss(x, c, 0.021);
  }
  return s + 0.1 * fbm(u * 4.2, 3);
}

/** Mouse dynamics — smooth pursuit toward targets, with micro-corrections. */
export function mouse(x: number, t: number): number {
  const u = x * 2.6 + t * 0.42;
  // piecewise sigmoid moves between dwell points = drag-and-drop trajectories
  let s = 0;
  for (let k = 0; k < 6; k++) {
    const c = k * 0.42 + 0.1;
    const dir = hash(k * 5.5) > 0.5 ? 1 : -1;
    s += dir * 0.42 * Math.tanh((u - c) * 7);
  }
  const tremor = 0.05 * Math.sin(TAU * u * 17) * (0.5 + 0.5 * Math.sin(TAU * u * 1.3));
  return s * 0.36 + tremor;
}

/** EEG — mixed alpha/beta bands, the prototype MUSE headset stream. */
export function eeg(x: number, t: number): number {
  const u = x * 10 + t * 2.2;
  const alpha = 0.42 * Math.sin(TAU * u * 1.0 + 0.4); // ~10 Hz
  const beta = 0.2 * Math.sin(TAU * u * 2.2 + 1.9);
  const theta = 0.26 * Math.sin(TAU * u * 0.55);
  return (alpha + beta + theta) * 0.72 + 0.16 * fbm(u * 5, 3);
}

/* ------------------------------------------------------------------ */
/* catalogue                                                           */
/* ------------------------------------------------------------------ */

export const SIGNALS: SignalSpec[] = [
  {
    id: "ecg",
    label: "ECG",
    full: "Electrocardiogram",
    unit: "mV",
    rate: "250–1000 Hz",
    color: "#e11d48",
    where: "Minder · CareWear",
    blurb:
      "Arm-worn ECG streamed over 6+ hour sessions. Pan–Tompkins for R-peak detection, then RR intervals into heart-rate variability.",
    fn: ecg,
  },
  {
    id: "ppg",
    label: "PPG",
    full: "Photoplethysmogram",
    unit: "a.u.",
    rate: "25–100 Hz",
    color: "#ea580c",
    where: "CareWear · CarePortal",
    blurb:
      "Optical pulse from the wrist. Cheap to wear, hard to trust — most of the work is deciding which minutes are real.",
    fn: ppg,
  },
  {
    id: "eda",
    label: "EDA",
    full: "Electrodermal Activity",
    unit: "µS",
    rate: "4–32 Hz",
    color: "#059669",
    where: "Minder",
    blurb:
      "Tonic drift carries arousal; the phasic bursts on top are what a stress model actually keys on.",
    fn: eda,
  },
  {
    id: "acc",
    label: "ACC",
    full: "Accelerometer",
    unit: "g",
    rate: "30–100 Hz",
    color: "#0891b2",
    where: "FidgetSense · Kaya",
    blurb:
      "Three axes at the wrist. Repetitive, rhythmic bursts are the signature of fidgeting — which is why frequency-domain features won.",
    fn: acc,
  },
  {
    id: "gyr",
    label: "GYR",
    full: "Gyroscope",
    unit: "°/s",
    rate: "30–100 Hz",
    color: "#0284c7",
    where: "FidgetSense · Kaya",
    blurb:
      "Rotation catches what linear acceleration misses: twirling, turning, the wrist rolling through a tremor.",
    fn: gyr,
  },
  {
    id: "mouse",
    label: "MOUSE",
    full: "Cursor Dynamics",
    unit: "px",
    rate: "event-driven",
    color: "#7c3aed",
    where: "MindGame",
    blurb:
      "The surprise result: cursor trajectories inside a puzzle game were more stable than the wearable stream beside them.",
    fn: mouse,
  },
  {
    id: "eeg",
    label: "EEG",
    full: "Electroencephalogram",
    unit: "µV",
    rate: "256 Hz",
    color: "#2563eb",
    where: "MindGame — in progress",
    blurb:
      "A MUSE headset folded into the game rig, extending the platform toward neurological signal.",
    fn: eeg,
  },
];

export const SIGNAL_BY_ID = Object.fromEntries(
  SIGNALS.map((s) => [s.id, s]),
) as Record<SignalId, SignalSpec>;

/* ------------------------------------------------------------------ */
/* color utils for the morph                                           */
/* ------------------------------------------------------------------ */

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

/** gamma-correct rgb lerp — avoids the muddy midpoint of naive blending */
export function mixRgb(
  a: [number, number, number],
  b: [number, number, number],
  k: number,
): [number, number, number] {
  return [0, 1, 2].map((i) => {
    const av = (a[i] / 255) ** 2.2;
    const bv = (b[i] / 255) ** 2.2;
    return Math.round(((av + (bv - av) * k) ** (1 / 2.2)) * 255);
  }) as [number, number, number];
}

export const rgba = (c: [number, number, number], a: number) =>
  `rgba(${c[0]},${c[1]},${c[2]},${a})`;

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
/** smoothstep — the easing that makes a scrub feel like it has weight */
export const smooth = (k: number) => {
  const t = clamp01(k);
  return t * t * (3 - 2 * t);
};

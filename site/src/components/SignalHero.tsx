"use client";

import { useEffect, useRef } from "react";
import { BEATS } from "@/lib/data";
import {
  SIGNAL_BY_ID,
  hexToRgb,
  mixRgb,
  rgba,
  clamp01,
  smooth,
  lerp,
} from "@/lib/signals";

/**
 * The pinned opening act.
 *
 * A single luminous trace that retunes, modality by modality, as you scroll:
 * ECG -> PPG -> accelerometer -> cursor -> EEG. The morph is done with a
 * left-to-right "sweep": ahead of the sweep line the old signal is still
 * running, behind it the new one has locked in. That is what an instrument
 * changing range actually looks like, and it reads far better than a crossfade.
 *
 * Pinning is CSS `position: sticky` rather than a JS pin — no pin-spacer, no
 * layout thrash, and scroll stays native-feeling on touch.
 */

const SEGMENT_VH = 88; // scroll distance per beat

export default function SignalHero() {
  const trackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beatsRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const canvas = canvasRef.current;
    if (!track || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let running = true;

    /* ---------------- sizing ---------------- */
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    /* ---------------- scroll progress ---------------- */
    const segments = BEATS.length - 1;
    let sTarget = 0; // 0..segments, raw from scroll
    let sEased = 0; // smoothed — this is what actually draws

    const readScroll = () => {
      const r = track.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      const p = span > 0 ? clamp01(-r.top / span) : 0;
      sTarget = p * segments;
    };
    readScroll();
    sEased = sTarget;

    /* ---------------- beat text ---------------- */
    const beatEls = beatsRef.current
      ? Array.from(beatsRef.current.children) as HTMLElement[]
      : [];
    const railEls = railRef.current
      ? Array.from(railRef.current.children) as HTMLElement[]
      : [];

    const paintText = (s: number) => {
      for (let i = 0; i < beatEls.length; i++) {
        const d = Math.abs(s - i);
        const o = 1 - smooth((d - 0.26) / 0.46);
        const el = beatEls[i];
        el.style.opacity = String(o);
        el.style.transform = `translate3d(0, ${(s - i) * -46}px, 0)`;
        el.style.filter = o > 0.99 ? "none" : `blur(${(1 - o) * 7}px)`;
        el.style.visibility = o < 0.01 ? "hidden" : "visible";
      }
      for (let i = 0; i < railEls.length; i++) {
        const on = Math.abs(s - i) < 0.5;
        railEls[i].style.opacity = on ? "1" : "0.3";
        railEls[i].style.transform = `scaleX(${on ? 1 : 0.4})`;
      }
      if (cueRef.current) {
        cueRef.current.style.opacity = String(clamp01(1 - s * 2.4));
      }
    };

    /* ---------------- the trace ---------------- */

    /** value of the blended waveform at normalised x */
    const sample = (
      x: number,
      t: number,
      fnA: (x: number, t: number) => number,
      fnB: (x: number, t: number) => number,
      sweep: number,
    ) => {
      if (sweep <= 0) return fnA(x, t);
      if (sweep >= 1) return fnB(x, t);
      // soft edge: 0 ahead of the sweep, 1 behind it
      const k = smooth((sweep - x) / 0.14 + 0.5);
      const a = fnA(x, t);
      const b = fnB(x, t);
      // amplitude dips right at the sweep edge — the "re-lock"
      const dip = 1 - 0.55 * Math.exp(-(((x - sweep) / 0.05) ** 2));
      return lerp(a, b, k) * dip;
    };

    const draw = (time: number) => {
      const t = reduced ? 0 : time / 1000;
      const s = sEased;

      const idx = Math.min(Math.floor(s), segments - 1);
      const q = clamp01(s - idx);

      const beatA = BEATS[idx];
      const beatB = BEATS[Math.min(idx + 1, BEATS.length - 1)];
      const sigA = SIGNAL_BY_ID[beatA.signal];
      const sigB = SIGNAL_BY_ID[beatB.signal];

      // the retune happens mid-segment, after text has settled
      const sweep = smooth((q - 0.34) / 0.5);
      const colA = hexToRgb(sigA.color);
      const colB = hexToRgb(sigB.color);
      const col = mixRgb(colA, colB, sweep);

      ctx.clearRect(0, 0, w, h);

      // The trace gets out of the way of the copy: centred beats push it low,
      // side-aligned beats let it run through the middle of the frame.
      const bias = (b: (typeof BEATS)[number]) => (b.align === "center" ? 0.72 : 0.5);
      const midY = h * lerp(bias(beatA), bias(beatB), smooth(q));
      const amp = Math.min(h * 0.19, 176);

      /* ---- backdrop: a faint wash of the active signal's hue ---- */
      const g = ctx.createRadialGradient(w * 0.5, midY, 0, w * 0.5, midY, Math.max(w, h) * 0.72);
      g.addColorStop(0, rgba(col, 0.07));
      g.addColorStop(0.5, rgba(col, 0.02));
      g.addColorStop(1, "rgba(250,250,250,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      /* ---- drifting grid: chart paper ---- */
      const gap = 58;
      const off = reduced ? 0 : (t * 11) % gap;
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(9,9,11,0.045)";
      ctx.beginPath();
      for (let x = -off; x < w + gap; x += gap) {
        ctx.moveTo(Math.round(x) + 0.5, 0);
        ctx.lineTo(Math.round(x) + 0.5, h);
      }
      for (let y = midY % gap; y < h; y += gap) {
        ctx.moveTo(0, Math.round(y) + 0.5);
        ctx.lineTo(w, Math.round(y) + 0.5);
      }
      ctx.stroke();

      // baseline
      ctx.strokeStyle = rgba(col, 0.28);
      ctx.beginPath();
      ctx.moveTo(0, Math.round(midY) + 0.5);
      ctx.lineTo(w, Math.round(midY) + 0.5);
      ctx.stroke();

      /* ---- build the path once, reuse for every glow pass ---- */
      const step = w < 640 ? 2.2 : 1.5;
      const pts: [number, number][] = [];
      for (let px = 0; px <= w; px += step) {
        const x = px / w;
        const v = sample(x, t, sigA.fn, sigB.fn, sweep);
        pts.push([px, midY - v * amp]);
      }

      const stroke = (lw: number, alpha: number, blur: number, color: string) => {
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
        ctx.lineWidth = lw;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.globalAlpha = alpha;
        ctx.shadowBlur = blur;
        ctx.shadowColor = rgba(col, 0.9);
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      };

      // soft ink shadow under the trace — on paper this reads as depth where a
      // glow would just wash the page out
      ctx.save();
      ctx.translate(0, 5);
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.strokeStyle = rgba(col, 0.1);
      ctx.lineWidth = 5;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.restore();

      // two passes: a soft colour bloom, then a crisp ink-weight core
      stroke(6, 0.14, 12, rgba(col, 1));
      stroke(1.9, 1, 0, rgba(col, 1));

      /* ---- the sweep edge ---- */
      if (sweep > 0.001 && sweep < 0.999) {
        const sx = sweep * w;
        const lg = ctx.createLinearGradient(sx - 30, 0, sx + 30, 0);
        lg.addColorStop(0, rgba(col, 0));
        lg.addColorStop(0.5, rgba(col, 0.14));
        lg.addColorStop(1, rgba(col, 0));
        ctx.fillStyle = lg;
        ctx.fillRect(sx - 30, 0, 60, h);

        ctx.strokeStyle = rgba(col, 0.55);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(sx + 0.5, midY - amp * 1.5);
        ctx.lineTo(sx + 0.5, midY + amp * 1.5);
        ctx.stroke();
      }

      /* ---- readout at the leading edge ---- */
      const last = pts[pts.length - 1];
      ctx.beginPath();
      ctx.arc(last[0] - 1, last[1], 4.5, 0, Math.PI * 2);
      ctx.fillStyle = "#fafafa";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(last[0] - 1, last[1], 3.2, 0, Math.PI * 2);
      ctx.fillStyle = rgba(col, 1);
      ctx.fill();

      /* ---- instrument readout: what is being measured, and where ---- */
      const shown = sweep > 0.5 ? sigB : sigA;
      const shownBeat = sweep > 0.5 ? beatB : beatA;
      const fade = 0.45 + 0.55 * Math.abs(Math.cos((sweep - 0.5) * Math.PI));
      // anchored near the top-left, like the channel label on an instrument —
      // pinning it out of the way of the copy and the scroll cue
      const pad = w < 640 ? 20 : 34;
      const baseY = 104;

      ctx.textAlign = "left";

      // tick mark, so the readout reads as part of the instrument
      ctx.strokeStyle = rgba(col, 0.45 * fade);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad, baseY - 13);
      ctx.lineTo(pad, baseY + 14);
      ctx.stroke();

      ctx.font = "500 11.5px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.fillStyle = rgba(col, 0.95 * fade);
      ctx.fillText(
        `${shown.label}  ·  ${shown.unit}  ·  ${shown.rate}`,
        pad + 12,
        baseY - 2,
      );

      ctx.font = "400 10.5px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.fillStyle = `rgba(107,114,128,${0.95 * fade})`;
      const stamp =
        w < 640 ? shownBeat.stamp.split(" · ")[0] : shownBeat.stamp;
      ctx.fillText(stamp, pad + 12, baseY + 14);
    };

    /* ---------------- loop ---------------- */
    // NB: no visibilitychange handling here. rAF is already suspended by the
    // browser on a hidden tab, and pausing it by hand risks stopping the loop
    // immediately after a clearRect — which leaves the canvas blank.
    const frame = (time: number) => {
      if (!running) return;
      readScroll();
      // critically-damped-ish follow: the scrub keeps weight without lagging
      sEased += (sTarget - sEased) * (reduced ? 1 : 0.12);
      if (Math.abs(sTarget - sEased) < 0.0004) sEased = sTarget;
      paintText(sEased);
      draw(time);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <section
      id="top"
      ref={trackRef}
      style={{ height: `${100 + (BEATS.length - 1) * SEGMENT_VH}vh` }}
      className="relative"
      aria-label="Introduction"
    >
      <div className="sticky top-0 h-svh overflow-hidden bg-[radial-gradient(120%_80%_at_50%_45%,var(--color-void)_0%,var(--color-ground)_62%)]">
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
        />

        {/* vignette keeps the type legible over the brightest part of the trace */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_70%_at_50%_55%,transparent_30%,rgba(250,250,250,0.82)_100%)]"
        />

        {/* beat copy */}
        <div ref={beatsRef} className="absolute inset-0">
          {BEATS.map((b, i) => (
            <div
              key={i}
              className={[
                "absolute inset-0 flex items-center px-[clamp(20px,5vw,72px)] py-24",
                // centred beats sit above the low-riding trace
                b.align === "center" ? "pb-[30vh]" : "",
              ].join(" ")}
              style={{ willChange: "opacity, transform, filter" }}
            >
              {/* side-aligned beats let the trace run behind the copy, so the
                  text side gets a directional wash of the page ground */}
              {b.align !== "center" && (
                <span
                  aria-hidden="true"
                  className={[
                    "pointer-events-none absolute inset-y-0 w-[68%]",
                    b.align === "left"
                      ? "left-0 bg-[linear-gradient(to_right,var(--color-ground)_0%,rgba(250,250,250,0.95)_48%,rgba(250,250,250,0)_100%)]"
                      : "right-0 bg-[linear-gradient(to_left,var(--color-ground)_0%,rgba(250,250,250,0.95)_48%,rgba(250,250,250,0)_100%)]",
                  ].join(" ")}
                />
              )}

              <div
                className={[
                  "u-shell relative w-full",
                  b.align === "center" ? "text-center" : "",
                ].join(" ")}
              >
                <div
                  className={[
                    b.align === "center"
                      ? "max-w-[min(900px,94vw)] mx-auto"
                      : b.align === "right"
                        ? "max-w-[min(520px,92vw)] ml-auto text-right"
                        : "max-w-[min(520px,92vw)] mr-auto",
                  ].join(" ")}
                >
                  <span className="u-eyebrow mb-5 block">{b.eyebrow}</span>
                  {i === 0 ? (
                    <h1 className="u-lume whitespace-pre-line text-[clamp(2.4rem,6.4vw,5rem)] font-bold tracking-[-0.045em]">
                      {b.title}
                    </h1>
                  ) : (
                    <h2 className="u-lume whitespace-pre-line text-[clamp(1.75rem,3.6vw,2.9rem)]">
                      {b.title}
                    </h2>
                  )}
                  <p
                    className={[
                      "mt-5 text-[clamp(0.98rem,1.5vw,1.1rem)] text-ink-2 [text-wrap:pretty]",
                      b.align === "center"
                        ? "mx-auto max-w-[58ch]"
                        : b.align === "right"
                          ? "ml-auto max-w-[46ch]"
                          : "max-w-[46ch]",
                    ].join(" ")}
                  >
                    {b.body}
                  </p>

                  {b.specs && (
                    <ul
                      className={[
                        "mt-7 flex flex-col gap-2 font-mono text-[0.74rem] text-ink-3",
                        b.align === "right" ? "items-end" : "items-start",
                      ].join(" ")}
                    >
                      {b.specs.map((sp) => (
                        <li key={sp} className="flex items-center gap-2.5">
                          <span
                            aria-hidden="true"
                            className="h-px w-4 bg-[var(--color-line-2)]"
                          />
                          {sp}
                        </li>
                      ))}
                    </ul>
                  )}

                  {i === 0 && (
                    <div className="pointer-events-auto mt-9 flex flex-wrap justify-center gap-3">
                      <a
                        href="#projects"
                        className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ground transition-transform duration-200 hover:-translate-y-0.5 hover:bg-ink/90"
                      >
                        View projects
                      </a>
                      <a
                        href="#interests"
                        className="rounded-full border border-[var(--color-line-2)] bg-ground/85 px-6 py-3 text-sm font-semibold text-ink-2 backdrop-blur-sm transition-colors duration-200 hover:border-accent hover:text-accent"
                      >
                        Research interests
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* beat rail */}
        <div
          ref={railRef}
          aria-hidden="true"
          className="absolute right-[clamp(16px,3vw,40px)] top-1/2 hidden -translate-y-1/2 flex-col gap-4 md:flex"
        >
          {BEATS.map((_, i) => (
            <span
              key={i}
              className="block h-px w-6 origin-right bg-ink/45 transition-all duration-500"
            />
          ))}
        </div>

        {/* scroll cue */}
        <div
          ref={cueRef}
          aria-hidden="true"
          className="pointer-events-none absolute bottom-7 left-1/2 -translate-x-1/2 text-center"
        >
          <span className="u-eyebrow">Scroll</span>
          <span className="mx-auto mt-2 block h-9 w-px bg-gradient-to-b from-[var(--color-line-2)] to-transparent" />
        </div>
      </div>
    </section>
  );
}

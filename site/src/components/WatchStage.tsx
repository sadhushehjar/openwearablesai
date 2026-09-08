"use client";

import { useEffect, useRef } from "react";
import { SIGNAL_BY_ID, hexToRgb, rgba, clamp01, smooth } from "@/lib/signals";

/**
 * The smartwatch band.
 *
 * A Galaxy Watch rendered in the page, its face streaming the signal the
 * platforms actually collect, scrubbed by scroll. It marks where the
 * wrist-worn work starts and separates it from the armband, glove and
 * dashboard projects that follow.
 *
 * The watch is drawn rather than photographed so the face can carry a live
 * trace; the real device photograph sits in the CareWear panel below.
 */

const STAGES = [
  {
    signal: "acc" as const,
    version: "v0.0.0",
    note: "Galaxy Studio prototype",
    detail: "First build. Too many toggles, and it would not hold a sample rate.",
  },
  {
    signal: "ppg" as const,
    version: "v1.0.0",
    note: "Used in study",
    detail: "On-board heart-rate quality checks, one file written every five minutes.",
  },
  {
    signal: "gyr" as const,
    version: "v2.0.0",
    note: "Used in study",
    detail: "Background timer work, and the dropouts that came with it.",
  },
  {
    signal: "ecg" as const,
    version: "v3.0.0",
    note: "Current",
    detail: "Simpler backend holding a wake lock, publishing over MQTT.",
  },
];

export default function WatchStage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stageEls = stagesRef.current
      ? Array.from(stagesRef.current.querySelectorAll<HTMLElement>("[data-stage]"))
      : [];

    let w = 0;
    let h = 0;
    let raf = 0;
    let progress = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
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

    const segments = STAGES.length - 1;

    const read = () => {
      const r = root.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      progress = span > 0 ? clamp01(-r.top / span) : 0;
    };

    const frame = (time: number) => {
      read();
      const t = reduced ? 0 : time / 1000;
      const s = progress * segments;
      const idx = Math.min(Math.floor(s), segments - 1);
      const q = clamp01(s - idx);

      const a = STAGES[idx];
      const b = STAGES[Math.min(idx + 1, STAGES.length - 1)];
      const shown = q > 0.5 ? b : a;
      const spec = SIGNAL_BY_ID[shown.signal];
      const col = hexToRgb(spec.color);

      // copy for the active version
      for (const el of stageEls) {
        const i = Number(el.dataset.stage);
        const d = Math.abs(s - i);
        const o = 1 - smooth((d - 0.3) / 0.25);
        el.style.opacity = String(o);
        el.style.visibility = o < 0.01 ? "hidden" : "visible";
        el.style.transform = `translate3d(0, ${(s - i) * -22}px, 0)`;
      }

      /* ---- the watch face ---- */
      ctx.clearRect(0, 0, w, h);
      if (!w || !h) {
        raf = requestAnimationFrame(frame);
        return;
      }

      const mid = h / 2;
      const amp = h * 0.3;

      // faint grid, as on the device
      ctx.strokeStyle = "rgba(255,255,255,0.07)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < w; x += 22) {
        ctx.moveTo(Math.round(x) + 0.5, 0);
        ctx.lineTo(Math.round(x) + 0.5, h);
      }
      ctx.stroke();

      // the trace, drawn light-on-dark because the watch face is black
      ctx.beginPath();
      for (let px = 0; px <= w; px += 1.4) {
        const y = mid - spec.fn(px / w, t) * amp;
        px === 0 ? ctx.moveTo(px, y) : ctx.lineTo(px, y);
      }
      ctx.strokeStyle = spec.color;
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.shadowBlur = 14;
      ctx.shadowColor = rgba(col, 0.9);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // channel label, as the app shows it
      ctx.font = "600 10px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.fillStyle = rgba(col, 0.95);
      ctx.textAlign = "center";
      ctx.fillText(`${spec.label}  ${shown.version}`, w / 2, h - 8);

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={rootRef} className="relative h-[260vh] lg:h-[300vh]">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <div className="u-shell grid w-full items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* the device */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative">
              {/* band */}
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 h-[420px] w-[92px] -translate-x-1/2 -translate-y-1/2 rounded-[46px] bg-[linear-gradient(180deg,#d9d5cf_0%,#efece7_18%,#efece7_82%,#d9d5cf_100%)]"
              />
              {/* case */}
              <div className="relative h-[220px] w-[220px] rounded-[62px] bg-[linear-gradient(150deg,#3a3a3e_0%,#101014_55%,#26262b_100%)] p-[10px] shadow-[0_30px_60px_-20px_rgba(9,9,11,0.55)]">
                {/* crown */}
                <span
                  aria-hidden="true"
                  className="absolute top-[74px] -right-[5px] h-9 w-[6px] rounded-r-md bg-[#4a4a50]"
                />
                <span
                  aria-hidden="true"
                  className="absolute top-[124px] -right-[4px] h-7 w-[5px] rounded-r-md bg-[#3d3d43]"
                />
                {/* screen */}
                <div className="relative h-full w-full overflow-hidden rounded-[54px] bg-[#050507]">
                  <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
                  <span className="absolute inset-x-0 top-5 text-center font-mono text-[9px] tracking-[0.18em] text-white/45">
                    CAREWEAR
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* the versions */}
          <div>
            <span className="u-eyebrow">Smartwatch platforms</span>
            <h3 className="mt-4 text-[clamp(1.7rem,3.2vw,2.5rem)]">
              Four builds of the
              <br />
              <span className="text-ink-3">Galaxy Watch app.</span>
            </h3>

            <div ref={stagesRef} className="relative mt-8 h-[190px]">
              {STAGES.map((st, i) => (
                <div
                  key={st.version}
                  data-stage={i}
                  className="absolute inset-x-0 top-0"
                  style={{ willChange: "opacity, transform" }}
                >
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-[2rem] font-semibold tracking-[-0.04em]">
                      {st.version}
                    </span>
                    <span className="rounded-full border border-[var(--color-line)] px-2.5 py-1 font-mono text-[0.64rem] text-ink-3">
                      {st.note}
                    </span>
                  </div>
                  <p className="mt-3 max-w-[44ch] text-[0.95rem] leading-relaxed text-ink-2">
                    {st.detail}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-2 max-w-[50ch] text-[0.9rem] text-ink-3">
              Three of the studies below run on a consumer Samsung Galaxy Watch,
              sampling at 30 Hz. Getting a commodity device to hold a rate and
              survive a session was its own body of work.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

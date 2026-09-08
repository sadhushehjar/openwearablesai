"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SYSTEMS, INTERESTS, METRICS, type System } from "@/lib/data";
import WatchStage from "./WatchStage";
import { SIGNAL_BY_ID } from "@/lib/signals";

/**
 * Two bodies of work, kept apart on purpose.
 *
 * The wrist-worn studies share a device, a sample rate and a set of problems
 * that come from running research on consumer hardware. The rest — an armband,
 * e-textile gloves, clinician dashboards, an agentic analysis tool — do not.
 * Interleaving them made the range look like one undifferentiated list.
 */
const WATCH = SYSTEMS.filter((s) => s.group === "Smartwatch");
const OTHER = SYSTEMS.filter((s) => s.group !== "Smartwatch");

/**
 * The product panels — alternating, full-bleed, with the image drifting slower
 * than the copy beside it. Parallax is kept to decorative layers only and the
 * whole thing is skipped under reduced motion.
 */
export default function Systems() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -7, scale: 1.1 },
          {
            yPercent: 7,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement!,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          },
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  // count-up on the metrics, which moved in from the old interests section
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const nums = Array.from(root.querySelectorAll<HTMLElement>("[data-count]"));
    const fmt = new Intl.NumberFormat("en-US");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nums.forEach((n) => (n.textContent = fmt.format(Number(n.dataset.count))));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          io.unobserve(el);
          const target = Number(el.dataset.count);
          const t0 = performance.now();
          const step = (now: number) => {
            const k = Math.min(1, (now - t0) / 1400);
            const eased = k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
            el.textContent = fmt.format(Math.round(target * eased));
            if (k < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.5 },
    );
    nums.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="projects"
      ref={rootRef}
      className="u-hairline relative py-[clamp(80px,11vw,150px)]"
    >
      <div className="u-shell">
        <div data-reveal className="max-w-3xl">
          <span className="u-eyebrow">Research Projects</span>
          <h2 className="mt-4 text-[clamp(2rem,4.4vw,3.2rem)]">
            Research projects.
            <br />
            <span className="text-ink-3">Eight platforms deployed to human studies.</span>
          </h2>
          <p className="mt-6 max-w-[58ch] text-ink-2">
            Each platform was developed under an approved IRB protocol and
            evaluated with participants in laboratory, clinical or in-home
            settings, in collaboration with clinical and industry partners.
          </p>
        </div>

        {/* the interests that run through the work, and what it adds up to */}
        <dl
          data-reveal
          className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-y border-[var(--color-line)] py-7 sm:grid-cols-4"
        >
          {METRICS.map((m) => (
            <div key={m.label}>
              <dd className="font-display text-[clamp(1.8rem,3vw,2.4rem)] font-semibold tracking-[-0.04em] tabular-nums">
                <span data-count={m.value}>0</span>
              </dd>
              <dt className="mt-0.5 text-[0.86rem] font-medium text-ink-2">
                {m.label}
              </dt>
              <p className="font-mono text-[0.64rem] text-ink-4">{m.sub}</p>
            </div>
          ))}
        </dl>

        <ul className="mt-10 grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {INTERESTS.map((it, i) => (
            <li
              key={it.title}
              data-reveal
              style={{ "--reveal-delay": `${i * 50}ms` } as React.CSSProperties}
            >
              <h3 className="flex items-baseline gap-2.5 text-[0.98rem] font-semibold tracking-[-0.015em]">
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                />
                {it.title}
              </h3>
              <p className="mt-1.5 pl-4 text-[0.9rem] leading-relaxed text-ink-3">
                {it.body}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* ---------- wrist-worn ---------- */}
      <div className="mt-[clamp(48px,7vw,96px)] border-y border-[var(--color-line)] bg-surface py-[clamp(24px,4vw,48px)]">
        <WatchStage />
      </div>

      <div className="mt-[clamp(48px,7vw,96px)] flex flex-col gap-[clamp(64px,9vw,128px)]">
        {WATCH.map((sys, i) => (
          <Panel key={sys.id} sys={sys} index={i} />
        ))}
      </div>

      {/* ---------- everything else ---------- */}
      <div className="u-shell mt-[clamp(80px,11vw,150px)]">
        <div data-reveal className="border-t border-[var(--color-line)] pt-10">
          <span className="u-eyebrow">Beyond the wrist</span>
          <h2 className="mt-4 max-w-3xl text-[clamp(1.8rem,3.8vw,2.8rem)]">
            Armbands, e-textile gloves,
            <br />
            <span className="text-ink-3">clinician dashboards and agentic AI.</span>
          </h2>
          <p className="mt-5 max-w-[58ch] text-ink-2">
            Work that does not sit on the wrist: custom sensing hardware, the
            cloud infrastructure behind it, the interfaces clinicians read it
            through, and a tool that reasons about signal quality on its own.
          </p>
        </div>
      </div>

      <div className="mt-14 flex flex-col gap-[clamp(64px,9vw,128px)]">
        {OTHER.map((sys, i) => (
          <Panel key={sys.id} sys={sys} index={i} />
        ))}
      </div>
    </section>
  );
}

/** One project: figure on one side, specification on the other, sides alternating. */
function Panel({ sys, index }: { sys: System; index: number }) {
  const flip = index % 2 === 1;
  return (
    <article className="u-shell">
      <div
        className={[
          "grid items-center gap-10 lg:grid-cols-2 lg:gap-16",
          flip ? "lg:[&>*:first-child]:order-2" : "",
        ].join(" ")}
      >
        <div
          data-reveal
          className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[var(--color-line)] bg-surface"
        >
          <Image
            src={sys.image}
            alt={sys.alt}
            fill
            data-parallax
            sizes="(max-width: 1024px) 92vw, 46vw"
            className="object-contain will-change-transform"
            priority={index === 0}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_0_0_1px_rgba(9,9,11,0.06)]"
          />
          <span className="absolute left-4 top-4 rounded-full border border-[var(--color-line-2)] bg-[rgba(255,255,255,0.88)] px-3 py-1 font-mono text-[0.64rem] tracking-[0.14em] text-ink-2 uppercase backdrop-blur">
            {sys.status}
          </span>
        </div>

        <div data-reveal style={{ "--reveal-delay": "90ms" } as React.CSSProperties}>
          <div className="flex items-baseline gap-3">
            <span className="u-eyebrow">{sys.year}</span>
            <span aria-hidden="true" className="h-px flex-1 bg-[var(--color-line)]" />
          </div>

          <h3 className="mt-4 text-[clamp(1.7rem,3.2vw,2.5rem)]">{sys.name}</h3>
          <p className="mt-2 text-[1.05rem] font-medium text-ink-2">{sys.tagline}</p>
          <p className="mt-5 max-w-[52ch] text-[0.96rem] leading-relaxed text-ink-3">
            {sys.body}
          </p>

          {sys.signals.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {sys.signals.map((sid) => {
                const sig = SIGNAL_BY_ID[sid];
                return (
                  <li
                    key={sid}
                    className="flex items-center gap-1.5 rounded-full border border-[var(--color-line)] px-2.5 py-1 font-mono text-[0.66rem] text-ink-3"
                  >
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: sig.color }}
                    />
                    {sig.label}
                  </li>
                );
              })}
            </ul>
          )}

          <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-[var(--color-line)] pt-6">
            {sys.facts.map((f) => (
              <div key={f.k}>
                <dt className="font-mono text-[0.64rem] tracking-[0.12em] text-ink-4 uppercase">
                  {f.k}
                </dt>
                <dd className="mt-1 text-[0.92rem] font-medium text-ink">{f.v}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 font-mono text-[0.68rem] text-ink-4">
            {sys.stack.join("  ·  ")}
          </p>
        </div>
      </div>
    </article>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SYSTEMS } from "@/lib/data";
import { SIGNAL_BY_ID } from "@/lib/signals";

/** Smartwatch work leads; Array#sort is stable, so order within a group holds. */
const ORDERED = [...SYSTEMS].sort((a, b) =>
  a.group === b.group ? 0 : a.group === "Smartwatch" ? -1 : 1,
);

/** the first system of each group carries that group's heading */
const GROUP_HEADS: Record<string, { label: string; note: string }> = {};
{
  const seen = new Set<string>();
  for (const s of ORDERED) {
    if (seen.has(s.group)) continue;
    seen.add(s.group);
    GROUP_HEADS[s.id] =
      s.group === "Smartwatch"
        ? {
            label: "Smartwatch platforms",
            note: "Consumer wrist-worn hardware applied to clinical research questions.",
          }
        : {
            label: "Further platforms",
            note: "Armbands, e-textile gloves, clinician dashboards and web portals.",
          };
  }
}

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

  return (
    <section
      id="projects"
      ref={rootRef}
      className="u-hairline relative py-[clamp(80px,11vw,150px)]"
    >
      <div className="u-shell">
        <div data-reveal className="max-w-3xl">
          <span className="u-eyebrow">Projects</span>
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
      </div>

      <div className="mt-16 flex flex-col gap-[clamp(64px,9vw,128px)]">
        {ORDERED.map((sys, i) => {
          const flip = i % 2 === 1;
          const heading = GROUP_HEADS[sys.id];
          return (
            <article key={sys.id} className="u-shell">
              {heading && (
                <div
                  data-reveal
                  className={[
                    "mb-12 flex items-baseline gap-4 border-t border-[var(--color-line)] pt-6",
                    i === 0 ? "" : "mt-[clamp(24px,4vw,56px)]",
                  ].join(" ")}
                >
                  <span className="u-eyebrow whitespace-nowrap">{heading.label}</span>
                  <span className="text-[0.86rem] text-ink-3">{heading.note}</span>
                  <span aria-hidden="true" className="h-px flex-1 bg-[var(--color-line)]" />
                </div>
              )}
              <div
                className={[
                  "grid items-center gap-10 lg:grid-cols-2 lg:gap-16",
                  flip ? "lg:[&>*:first-child]:order-2" : "",
                ].join(" ")}
              >
                {/* visual */}
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
                    className="object-cover will-change-transform"
                    priority={i === 0}
                  />
                  {/* the source figures are mostly white-backed, so the frame
                      gets an inset hairline rather than a scrim */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_0_0_1px_rgba(9,9,11,0.06)]"
                  />
                  <span className="absolute left-4 top-4 rounded-full border border-[var(--color-line-2)] bg-[rgba(255,255,255,0.88)] px-3 py-1 font-mono text-[0.64rem] tracking-[0.14em] text-ink-2 uppercase backdrop-blur">
                    {sys.status}
                  </span>
                </div>

                {/* copy */}
                <div data-reveal style={{ "--reveal-delay": "90ms" } as React.CSSProperties}>
                  <div className="flex items-baseline gap-3">
                    <span className="u-eyebrow">{sys.year}</span>
                    <span aria-hidden="true" className="h-px flex-1 bg-[var(--color-line)]" />
                  </div>

                  <h3 className="mt-4 text-[clamp(1.7rem,3.2vw,2.5rem)]">
                    {sys.name}
                  </h3>
                  <p className="mt-2 text-[1.05rem] font-medium text-ink-2">
                    {sys.tagline}
                  </p>
                  <p className="mt-5 max-w-[52ch] text-[0.96rem] leading-relaxed text-ink-3">
                    {sys.body}
                  </p>

                  {/* signal chips */}
                  {sys.signals.length > 0 && (
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {sys.signals.map((sid) => {
                        const s = SIGNAL_BY_ID[sid];
                        return (
                          <li
                            key={sid}
                            className="flex items-center gap-1.5 rounded-full border border-[var(--color-line)] px-2.5 py-1 font-mono text-[0.66rem] text-ink-3"
                          >
                            <span
                              aria-hidden="true"
                              className="h-1.5 w-1.5 rounded-full"
                              style={{ background: s.color }}
                            />
                            {s.label}
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  {/* spec table */}
                  <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-[var(--color-line)] pt-6">
                    {sys.facts.map((f) => (
                      <div key={f.k}>
                        <dt className="font-mono text-[0.64rem] tracking-[0.12em] text-ink-4 uppercase">
                          {f.k}
                        </dt>
                        <dd className="mt-1 text-[0.92rem] font-medium text-ink">
                          {f.v}
                        </dd>
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
        })}
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { PERSON, INTERESTS, METRICS } from "@/lib/data";

const fmt = new Intl.NumberFormat("en-US");

/** Research Interests — the home-page section from the previous site. */
export default function Interests() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const nums = Array.from(root.querySelectorAll<HTMLElement>("[data-count]"));
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
      id="interests"
      ref={rootRef}
      className="u-hairline bg-surface py-[clamp(80px,11vw,150px)]"
    >
      <div className="u-shell">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:gap-20">
          {/* portrait + identity */}
          <div data-reveal className="max-w-[320px]">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-[var(--color-line)]">
              <Image
                src="/media/portrait-face.jpg"
                alt={`Portrait of ${PERSON.name} in the laboratory.`}
                fill
                sizes="320px"
                priority
                className="object-cover"
              />
            </div>

            <div className="mt-5">
              <p className="text-[1.05rem] font-semibold tracking-[-0.02em]">
                {PERSON.name}{" "}
                <span className="font-mono text-[0.7rem] font-normal text-ink-4">
                  ({PERSON.pronouns})
                </span>
              </p>
              <p className="mt-1 text-[0.88rem] text-ink-3">{PERSON.role}</p>
              <p className="text-[0.88rem] text-ink-4">{PERSON.org}</p>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href={PERSON.scholar}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[var(--color-line-2)] px-4 py-2 text-[0.78rem] font-medium text-ink-2 transition-colors duration-200 hover:border-accent hover:text-accent"
              >
                Google Scholar
              </a>
              <a
                href={PERSON.medium}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[var(--color-line-2)] px-4 py-2 text-[0.78rem] font-medium text-ink-2 transition-colors duration-200 hover:border-accent hover:text-accent"
              >
                Medium
              </a>
              <a
                href={PERSON.cv}
                className="rounded-full border border-[var(--color-line-2)] px-4 py-2 text-[0.78rem] font-medium text-ink-2 transition-colors duration-200 hover:border-accent hover:text-accent"
              >
                CV
              </a>
            </div>
          </div>

          {/* statement */}
          <div
            data-reveal
            style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
          >
            <span className="u-eyebrow">Research Interests</span>
            <h2 className="mt-4 text-[clamp(1.8rem,3.6vw,2.6rem)]">
              Wearable sensing and artificial intelligence
              <br />
              <span className="text-ink-3">
                for remote psycho-physiological monitoring.
              </span>
            </h2>

            <div className="mt-7 space-y-5 text-[1rem] leading-relaxed text-ink-2">
              <p>
                My research designs Internet of Medical Things platforms that
                integrate wearable sensors and artificial intelligence to
                support remote health monitoring. This work spans device
                firmware, mobile and cloud infrastructure, signal processing and
                the clinician-facing interfaces through which longitudinal data
                is ultimately interpreted.
              </p>
              <p>
                I hold a PhD in Electrical Engineering from the University of
                Rhode Island, conferred in {PERSON.grad}, supervised by Dr Kunal
                Mankodiya and Dr Dhaval Solanki in the Wearable Biosensing Lab,
                where I also completed an MS in Electrical Engineering and a
                dual BS in Computer Science and Data Science.
              </p>
            </div>

            {/* metrics */}
            <dl className="mt-9 grid grid-cols-2 gap-x-8 gap-y-6 border-y border-[var(--color-line)] py-7 sm:grid-cols-4">
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

            {/* interest areas */}
            <ul className="mt-9 grid gap-x-10 gap-y-7 sm:grid-cols-2">
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
        </div>
      </div>
    </section>
  );
}

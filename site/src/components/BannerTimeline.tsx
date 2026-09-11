import { TIMELINE } from "@/lib/data";

/**
 * The route through, read newest first, on the right edge of the banner.
 *
 * The spine draws downward on load, then each milestone arrives outward from
 * it in sequence, and the current position keeps a slow beat — the same
 * pulse language the signal traces use elsewhere on the page.
 *
 * Motion is CSS keyframes rather than a scroll trigger, because this sits
 * above the fold and has already played by the time anything scrolls.
 */
export default function BannerTimeline() {
  return (
    <div className="relative w-[212px] shrink-0">
      <span className="u-eyebrow mb-5 block">The route through</span>

      <ol className="relative">
        {/* the spine */}
        <span
          aria-hidden="true"
          className="tl-spine absolute top-1.5 bottom-1.5 left-[5px] w-px bg-[linear-gradient(to_bottom,var(--color-accent),rgba(9,9,11,0.18)_65%,transparent)]"
        />

        {TIMELINE.map((m, i) => (
          <li
            key={m.year + m.title}
            className="tl-item relative pb-5 pl-7 last:pb-0"
            style={{ "--tl-delay": `${350 + i * 110}ms` } as React.CSSProperties}
          >
            {/* node */}
            <span
              aria-hidden="true"
              className={[
                "absolute top-[5px] left-0 block h-[11px] w-[11px] rounded-full border-2",
                m.now
                  ? "border-accent bg-accent"
                  : "border-[var(--color-line-2)] bg-ground",
              ].join(" ")}
            />
            {m.now && (
              <span
                aria-hidden="true"
                className="tl-beat absolute top-[5px] left-0 block h-[11px] w-[11px] rounded-full bg-accent"
              />
            )}

            <div className="flex items-baseline gap-2">
              <span className="font-display text-[0.98rem] font-semibold tracking-[-0.02em]">
                {m.year}
              </span>
              <span className="font-mono text-[0.6rem] tracking-[0.1em] text-ink-4 uppercase">
                {m.span}
              </span>
            </div>

            <h3 className="mt-0.5 text-[0.86rem] leading-snug font-medium text-ink-2">
              {m.title}
            </h3>
            <p className="mt-1 text-[0.74rem] leading-snug text-ink-4">
              {m.detail}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

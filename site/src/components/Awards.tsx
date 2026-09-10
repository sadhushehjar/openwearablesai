import { AWARDS } from "@/lib/data";

/** Awards and honours, kept apart from News so neither dilutes the other. */
export default function Awards() {
  return (
    <section id="awards" className="u-hairline py-[clamp(80px,11vw,150px)]">
      <div className="u-shell">
        <div data-reveal className="max-w-2xl">
          <span className="u-eyebrow">Awards</span>
          <h2 className="mt-4 text-[clamp(2rem,4.4vw,3rem)]">
            Awards and honours.
          </h2>
          <p className="mt-5 max-w-[56ch] text-ink-2">
            Recognition from IEEE conferences, national workshops and the
            University of Rhode Island, spanning undergraduate research through
            to the doctoral work.
          </p>
        </div>

        <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-line)] sm:grid-cols-2">
          {AWARDS.map((a, i) => (
            <li
              key={a.title + a.year}
              data-reveal
              style={{ "--reveal-delay": `${i * 45}ms` } as React.CSSProperties}
              className="flex gap-5 bg-ground p-6"
            >
              <span className="shrink-0 pt-0.5 font-mono text-[0.72rem] whitespace-nowrap text-accent">
                {a.year}
              </span>
              <div>
                <h3 className="text-[1rem] leading-snug font-semibold tracking-[-0.015em]">
                  {a.title}
                </h3>
                <p className="mt-1.5 text-[0.9rem] leading-relaxed text-ink-3">
                  {a.body}
                </p>
                {a.project && (
                  <span className="mt-3 inline-block rounded-full border border-[var(--color-line)] px-2.5 py-1 font-mono text-[0.62rem] text-ink-4">
                    {a.project}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

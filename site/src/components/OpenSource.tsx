import { OPEN_SOURCE, PERSON } from "@/lib/data";

export default function OpenSource() {
  return (
    <section
      id="open-source"
      className="u-hairline bg-surface py-[clamp(80px,11vw,150px)]"
    >
      <div className="u-shell">
        <div data-reveal className="max-w-2xl">
          <span className="u-eyebrow">Open Source</span>
          <h2 className="mt-4 text-[clamp(2rem,4.4vw,3rem)]">
            Datasets and software
            <br />
            <span className="text-ink-3">released for reuse.</span>
          </h2>
          <p className="mt-6 max-w-[58ch] text-ink-2">
            Where participant consent and institutional review permit, study
            data and platform code are released so that results can be
            independently verified and extended.
          </p>
        </div>

        <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-line)] md:grid-cols-3">
          {OPEN_SOURCE.map((o, i) => {
            const inner = (
              <>
                <span className="font-mono text-[0.64rem] tracking-[0.14em] text-ink-4 uppercase">
                  {o.kind}
                </span>
                <h3 className="mt-3 text-[1.1rem] font-semibold tracking-[-0.02em] transition-colors duration-200 group-hover:text-accent">
                  {o.name}
                </h3>
                <p className="mt-3 flex-1 text-[0.9rem] leading-relaxed text-ink-3">
                  {o.body}
                </p>
                <span className="mt-6 flex items-center gap-2 border-t border-[var(--color-line)] pt-4 font-mono text-[0.68rem] text-ink-4">
                  {o.meta}
                  {o.href && (
                    <svg
                      aria-hidden="true"
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    >
                      <path d="M7 17 17 7M9 7h8v8" />
                    </svg>
                  )}
                </span>
              </>
            );

            return (
              <li
                key={o.name}
                data-reveal
                style={{ "--reveal-delay": `${i * 60}ms` } as React.CSSProperties}
                className="bg-surface"
              >
                {o.href ? (
                  <a
                    href={o.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full flex-col p-7 transition-colors duration-300 hover:bg-surface-2"
                  >
                    {inner}
                  </a>
                ) : (
                  <div className="group flex h-full flex-col p-7">{inner}</div>
                )}
              </li>
            );
          })}
        </ul>

        <p
          data-reveal
          className="mt-8 text-[0.9rem] text-ink-3"
        >
          For access to data or code not listed here, please{" "}
          <a
            href={`mailto:${PERSON.email}`}
            className="font-medium text-accent underline underline-offset-4"
          >
            get in touch
          </a>
          .
        </p>
      </div>
    </section>
  );
}

import { PERSON } from "@/lib/data";

const LINKS = [
  { label: "Email", value: PERSON.email, href: `mailto:${PERSON.email}` },
  { label: "Google Scholar", value: "142 citations · h-index 5", href: PERSON.scholar },
  { label: "Curriculum vitae", value: "PDF", href: PERSON.cv },
  { label: "Writing", value: "Medium", href: PERSON.medium },
];

export default function Contact() {
  return (
    <>
      <section
        id="contact"
        className="u-hairline relative overflow-hidden bg-[radial-gradient(90%_120%_at_50%_100%,var(--color-void)_0%,var(--color-ground)_65%)] py-[clamp(90px,13vw,180px)]"
      >
        <div className="u-shell text-center">
          <div data-reveal>
            <span className="u-eyebrow">Contact</span>
            <h2 className="u-lume mx-auto mt-5 max-w-[18ch] text-[clamp(2.1rem,5.4vw,3.8rem)] font-semibold">
              Open to research collaboration.
            </h2>
            <p className="mx-auto mt-6 max-w-[54ch] text-[1.05rem] text-ink-2">
              I welcome enquiries regarding research positions, collaboration on
              wearable digital health studies, and access to the datasets and
              platforms described here.
            </p>
          </div>

          <div
            data-reveal
            style={{ "--reveal-delay": "100ms" } as React.CSSProperties}
            className="mt-10 flex flex-wrap justify-center gap-3"
          >
            <a
              href={`mailto:${PERSON.email}`}
              className="rounded-full bg-ink px-7 py-3.5 text-[0.92rem] font-semibold text-ground transition-transform duration-200 hover:-translate-y-0.5"
            >
              Email me
            </a>
            <a
              href={PERSON.cv}
              className="rounded-full border border-[var(--color-line-2)] px-7 py-3.5 text-[0.92rem] font-semibold text-ink-2 transition-colors duration-200 hover:border-accent hover:text-accent"
            >
              Download CV
            </a>
          </div>

          <ul className="mx-auto mt-16 grid max-w-3xl gap-px overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-line)] text-left sm:grid-cols-2 lg:grid-cols-4">
            {LINKS.map((l, i) => (
              <li
                key={l.label}
                data-reveal
                style={{ "--reveal-delay": `${i * 60}ms` } as React.CSSProperties}
              >
                <a
                  href={l.href}
                  {...(l.href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="group block h-full bg-ground p-6 transition-colors duration-300 hover:bg-surface"
                >
                  <span className="font-mono text-[0.63rem] tracking-[0.14em] text-ink-4 uppercase">
                    {l.label}
                  </span>
                  <span className="mt-2 flex items-center gap-2 text-[0.92rem] font-medium break-words text-ink transition-colors group-hover:text-accent">
                    {l.value}
                    <svg
                      aria-hidden="true"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="shrink-0 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="u-hairline py-10">
        <div className="u-shell flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p className="font-mono text-[0.68rem] text-ink-4">
            © {new Date().getFullYear()} {PERSON.name} · Kingston, Rhode Island
          </p>
          <p className="font-mono text-[0.68rem] text-ink-4">
            Wearable Biosensing Lab · University of Rhode Island
          </p>
        </div>
      </footer>
    </>
  );
}

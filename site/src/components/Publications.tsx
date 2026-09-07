"use client";

import { useMemo, useState } from "react";
import { PUBS, PERSON } from "@/lib/data";

type Filter = "All" | "First author" | "Journal" | "Conference";
const FILTERS: Filter[] = ["All", "First author", "Journal", "Conference"];

/** bold the author's own name in the byline without dangerously setting HTML */
function Byline({ authors }: { authors: string }) {
  const parts = authors.split(/(Sadhu S)/g);
  return (
    <p className="font-mono text-[0.7rem] leading-relaxed text-ink-4">
      {parts.map((p, i) =>
        p === "Sadhu S" ? (
          <strong key={i} className="font-semibold text-ink-2">
            {p}
          </strong>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </p>
  );
}

export default function Publications() {
  const [filter, setFilter] = useState<Filter>("All");

  const shown = useMemo(() => {
    if (filter === "All") return PUBS;
    if (filter === "First author") return PUBS.filter((p) => p.first);
    return PUBS.filter((p) => p.kind === filter);
  }, [filter]);

  return (
    <section
      id="publications"
      className="u-hairline bg-surface py-[clamp(80px,11vw,150px)]"
    >
      <div className="u-shell">
        <div
          data-reveal
          className="flex flex-wrap items-end justify-between gap-8"
        >
          <div className="max-w-2xl">
            <span className="u-eyebrow">Publications</span>
            <h2 className="mt-4 text-[clamp(2rem,4.4vw,3.2rem)]">
              Peer-reviewed publications.
            </h2>
          </div>

          <a
            href={PERSON.scholar}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-line-2)] px-5 py-2.5 text-[0.82rem] font-medium text-ink-2 transition-colors duration-200 hover:border-accent hover:text-accent"
          >
            Google Scholar
            <svg
              aria-hidden="true"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </a>
        </div>

        {/* filters */}
        <div
          data-reveal
          role="group"
          aria-label="Filter publications"
          className="mt-10 flex flex-wrap gap-2"
        >
          {FILTERS.map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(f)}
                className={[
                  "cursor-pointer rounded-full px-4 py-2 text-[0.8rem] font-medium transition-colors duration-200",
                  active
                    ? "bg-ink text-ground"
                    : "border border-[var(--color-line)] text-ink-3 hover:border-[var(--color-line-2)] hover:text-ink",
                ].join(" ")}
              >
                {f}
              </button>
            );
          })}
        </div>

        <ol className="mt-10 border-t border-[var(--color-line)]">
          {shown.map((p) => {
            const Row = (
              <>
                <div className="flex shrink-0 flex-col gap-1 sm:w-28">
                  <span className="font-mono text-[0.72rem] text-ink-2">
                    {p.year}
                  </span>
                  <span className="font-mono text-[0.64rem] tracking-[0.1em] text-ink-4 uppercase">
                    {p.kind}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-[1.02rem] leading-snug font-medium tracking-[-0.015em] text-ink transition-colors duration-200 group-hover:text-accent">
                    {p.title}
                  </h3>
                  <p className="mt-1.5 text-[0.86rem] text-ink-3">{p.venue}</p>
                  <div className="mt-2">
                    <Byline authors={p.authors} />
                  </div>
                </div>

                <div className="flex shrink-0 items-start gap-3 sm:w-32 sm:justify-end">
                  {p.cites !== undefined && (
                    <span className="rounded-full border border-[var(--color-line)] px-2.5 py-1 font-mono text-[0.64rem] text-ink-3">
                      {p.cites} cites
                    </span>
                  )}
                  {p.note && (
                    <span className="font-mono text-[0.64rem] text-ink-4">
                      {p.note}
                    </span>
                  )}
                </div>
              </>
            );

            return (
              <li
                key={p.title}
                data-reveal
                className="border-b border-[var(--color-line)]"
              >
                {p.url ? (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col gap-3 py-6 sm:flex-row sm:gap-8"
                  >
                    {Row}
                  </a>
                ) : (
                  <div className="group flex flex-col gap-3 py-6 sm:flex-row sm:gap-8">
                    {Row}
                  </div>
                )}
              </li>
            );
          })}
        </ol>

        <p aria-live="polite" className="mt-6 font-mono text-[0.7rem] text-ink-4">
          Showing {shown.length} of {PUBS.length}
        </p>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { NAV, PERSON } from "@/lib/data";

export default function Nav() {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // reading-progress hairline
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = barRef.current;
      if (el) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        el.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // which section am I in? nav needs to say so — without it a long page gives
  // no sense of place.
  useEffect(() => {
    const ids = NAV.map((n) => n.href.slice(1));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      // a band across the upper-middle of the viewport, so the active item
      // changes when a section genuinely takes over the screen
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.25, 0.5] },
    );
    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500",
        stuck
          ? "border-b border-[var(--color-line)] bg-[rgba(250,250,250,0.78)] backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent bg-transparent",
      ].join(" ")}
    >
      <nav className="u-shell flex h-14 items-center gap-6" aria-label="Primary">
        <a
          href="#top"
          className="font-display text-[0.95rem] font-semibold tracking-tight whitespace-nowrap"
        >
          {PERSON.name}
        </a>

        <ul className="mx-auto hidden items-center gap-7 md:flex">
          {NAV.map((n) => {
            const on = active === n.href;
            return (
              <li key={n.href}>
                <a
                  href={n.href}
                  aria-current={on ? "true" : undefined}
                  className={[
                    "relative text-[0.8rem] transition-colors duration-200 hover:text-ink",
                    on ? "text-ink" : "text-ink-3",
                  ].join(" ")}
                >
                  {n.label}
                  <span
                    aria-hidden="true"
                    className={[
                      "absolute -bottom-1.5 left-0 h-px w-full origin-left bg-accent transition-transform duration-300",
                      on ? "scale-x-100" : "scale-x-0",
                    ].join(" ")}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <a
            href={PERSON.cv}
            className="hidden rounded-full border border-[var(--color-line-2)] px-4 py-2 text-[0.8rem] font-medium text-ink-2 transition-colors duration-200 hover:border-accent hover:text-accent sm:inline-block"
          >
            CV
          </a>
          <a
            href="#contact"
            className="rounded-full bg-ink px-4 py-2 text-[0.8rem] font-semibold text-ground transition-transform duration-200 hover:-translate-y-0.5"
          >
            Get in touch
          </a>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 cursor-pointer place-items-center md:hidden"
          >
            <span className="relative block h-3 w-5">
              <span
                className={[
                  "absolute left-0 block h-px w-5 bg-ink transition-transform duration-300",
                  open ? "top-1.5 rotate-45" : "top-0",
                ].join(" ")}
              />
              <span
                className={[
                  "absolute left-0 block h-px w-5 bg-ink transition-transform duration-300",
                  open ? "top-1.5 -rotate-45" : "top-3",
                ].join(" ")}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* reading progress */}
      <div
        ref={barRef}
        aria-hidden="true"
        className="h-px origin-left scale-x-0 bg-accent"
      />

      {/* mobile sheet */}
      <div
        className={[
          "u-plate fixed inset-x-0 top-14 origin-top overflow-hidden transition-all duration-400 md:hidden",
          open ? "max-h-96 opacity-100" : "pointer-events-none max-h-0 opacity-0",
        ].join(" ")}
      >
        <ul className="u-shell flex flex-col py-3">
          {[...NAV, { href: PERSON.cv, label: "Curriculum vitae" }].map((n) => (
            <li key={n.href}>
              <a
                href={n.href}
                onClick={() => setOpen(false)}
                className="block border-b border-[var(--color-line)] py-4 text-base text-ink-2"
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}

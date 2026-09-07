"use client";

import { useEffect } from "react";

/**
 * One observer for every [data-reveal] on the page.
 *
 * Cheaper than a ScrollTrigger per element, and because the initial state lives
 * in CSS the content is still present for crawlers and for reduced-motion users
 * (where the stylesheet forces it visible).
 */
export default function Reveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!els.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target); // one-shot: no re-animation on scroll-up
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}

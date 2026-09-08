"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * One rAF loop for the whole page.
 *
 * Lenis owns the scroll position; GSAP's ticker drives Lenis; ScrollTrigger is
 * told to read from Lenis rather than the native scroller. Running them off a
 * single clock is what keeps pinned sections from shearing away from the
 * content that scrolls past them.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      // lerp tracks the input pointer-for-pointer; the duration/easing mode
      // schedules a ~1s animation per wheel tick, which reads as lag and is
      // what makes a long pinned section feel unresponsive.
      lerp: 0.14,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      // native scrolling on touch — smoothing a finger drag always feels wrong
      syncTouch: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    /**
     * Anchor jumps, tweened by hand.
     *
     * Lenis is configured in lerp mode, and in that mode a `duration` passed to
     * `scrollTo` is silently ignored — the call returns and nothing moves. Its
     * `lock` option suppresses the scroll outright rather than just guarding
     * against interruption. `immediate: true` is the one form that reliably
     * moves the instance, so we run the easing ourselves and push each frame
     * in through it.
     */
    let jumpRaf = 0;
    const cancelJump = () => cancelAnimationFrame(jumpRaf);

    const jumpTo = (top: number) => {
      cancelJump();
      const start = window.scrollY;
      const dist = top - start;
      if (Math.abs(dist) < 2) return;

      // longer trips get a little more time, but never a sluggish amount
      const dur = Math.min(1100, Math.max(450, Math.abs(dist) * 0.55));
      const t0 = performance.now();

      const step = (now: number) => {
        const k = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - k, 3); // easeOutCubic
        lenis.scrollTo(start + dist * eased, { immediate: true });
        if (k < 1) jumpRaf = requestAnimationFrame(step);
      };
      jumpRaf = requestAnimationFrame(step);
    };

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest?.('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      jumpTo(el.getBoundingClientRect().top + window.scrollY - 8);
    };
    document.addEventListener("click", onClick);

    // reaching for the wheel mid-jump should win — that is what "intuitive"
    // means here: the page never fights the user's own input
    window.addEventListener("wheel", cancelJump, { passive: true });
    window.addEventListener("touchstart", cancelJump, { passive: true });

    // fonts and images shift layout; re-measure once they land
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    return () => {
      cancelJump();
      document.removeEventListener("click", onClick);
      window.removeEventListener("wheel", cancelJump);
      window.removeEventListener("touchstart", cancelJump);
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(tick);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return null;
}

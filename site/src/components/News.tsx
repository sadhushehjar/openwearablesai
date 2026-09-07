"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NEWS } from "@/lib/data";

const GALLERY = [
  {
    image: "/media/statehouse-team.jpg",
    alt: "The Wearable Biosensing Lab team on the steps of the Rhode Island State House with demonstration equipment.",
    caption: "Rhode Island State House",
  },
  {
    image: "/media/lab-team.jpg",
    alt: "The laboratory group touring a textile fabrication facility, and a group photograph at the Fabric Discovery Center.",
    caption: "AFFOA industry visit",
  },
  {
    image: "/media/chase-2022.jpg",
    alt: "Conference presentation at IEEE CHASE 2022.",
    caption: "IEEE/ACM CHASE 2022",
  },
];

/**
 * News — each entry's rule draws itself in as the row enters, so the list
 * assembles rather than simply appearing.
 */
export default function News() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-rule]").forEach((el) => {
        gsap.fromTo(
          el,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.9,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 92%" },
          },
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="news"
      ref={rootRef}
      className="u-hairline py-[clamp(80px,11vw,150px)]"
    >
      <div className="u-shell">
        <div data-reveal className="max-w-2xl">
          <span className="u-eyebrow">News</span>
          <h2 className="mt-4 text-[clamp(2rem,4.4vw,3rem)]">
            Recent awards,
            <br />
            <span className="text-ink-3">talks and features.</span>
          </h2>
        </div>

        <ol className="mt-12">
          {NEWS.map((n, i) => (
            <li key={n.title + n.year} data-reveal>
              <span
                data-rule={i}
                aria-hidden="true"
                className="block h-px origin-left bg-[var(--color-line)]"
              />
              <div className="grid gap-2 py-6 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-8">
                <span className="font-mono text-[0.74rem] text-ink-4">
                  {n.year}
                </span>
                <div>
                  <h3 className="text-[1.05rem] font-semibold tracking-[-0.02em]">
                    {n.title}
                  </h3>
                  <p className="mt-1.5 max-w-[62ch] text-[0.92rem] leading-relaxed text-ink-3">
                    {n.body}
                  </p>
                </div>
              </div>
            </li>
          ))}
          <li>
            <span
              aria-hidden="true"
              className="block h-px bg-[var(--color-line)]"
            />
          </li>
        </ol>

        <ul className="mt-12 grid gap-6 sm:grid-cols-3">
          {GALLERY.map((g, i) => (
            <li
              key={g.caption}
              data-reveal
              style={{ "--reveal-delay": `${i * 70}ms` } as React.CSSProperties}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[var(--color-line)]">
                <Image
                  src={g.image}
                  alt={g.alt}
                  fill
                  sizes="(max-width: 640px) 92vw, 30vw"
                  className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] hover:scale-[1.04]"
                />
              </div>
              <p className="mt-3 font-mono text-[0.7rem] text-ink-4">
                {g.caption}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

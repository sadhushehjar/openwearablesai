# shehjarsadhu.com — personal research site

Next.js 16 (App Router, Turbopack) · React 19 · Tailwind CSS v4 · GSAP 3 · Lenis.

## Run

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

```bash
npm run build   # production build
npm start       # serve the production build
```

## Where things live

| Path | What it is |
| --- | --- |
| `src/lib/data.ts` | **All page content.** Bio, research interests, projects, news, publications, open-source releases. Edit here, not in components. |
| `src/lib/signals.ts` | The waveform generators (ECG, PPG, EDA, accelerometer, gyroscope, cursor, EEG) and the colour utilities used by the hero. |
| `src/components/SignalHero.tsx` | The scroll-scrubbed opening sequence. |
| `src/app/globals.css` | Design tokens — colours, type, spacing, the reveal primitive. |
| `public/media/` | Project and gallery imagery. |
| `public/Shehjar_Sadhu_CV.pdf` | CV linked from the nav, Research Interests and Contact. |

## The hero animation

A single canvas trace that retunes through each sensing modality as you scroll,
following the arc of the research: ECG (Minder) → PPG (CareWear) →
accelerometer (FidgetSense) → cursor dynamics (MindGame) → EEG (BiosignalViz).

The morph is a left-to-right **sweep**: ahead of the sweep line the previous
signal is still running, behind it the new one has locked in, with the amplitude
dipping at the boundary. That is what an instrument changing range looks like,
and it reads far better than a crossfade.

Each beat is defined in `BEATS` in `src/lib/data.ts` — the `signal` field picks
the waveform, `stamp` is the project label drawn onto the canvas readout. Adding
or removing a beat automatically lengthens or shortens the scroll track.

Pinning uses CSS `position: sticky`, not a JS pin, so there is no pin-spacer and
scrolling stays native-feeling on touch.

## Motion and accessibility

- Lenis owns the scroll position and drives GSAP's ScrollTrigger from one rAF
  loop, so pinned content never shears away from the page.
- Every animation is behind `prefers-reduced-motion`. With it enabled, Lenis is
  not started, reveals render in their final state, and the hero draws a static
  frame.
- Body ink tokens are all ≥ 4.5:1 against the page ground; per-signal colours are
  darkened for legibility on paper.
- Reveals set their initial state in CSS and are cleared by one shared
  IntersectionObserver, so content is present for crawlers.

## Editing content

Almost everything is data-driven. To add a project, append to `SYSTEMS` in
`src/lib/data.ts`; `group: "Smartwatch"` places it in the leading group, anything
else falls into "Further platforms". Panels alternate sides automatically.

## Deploying

The site is fully static. Vercel needs no configuration. For a static host
(GitHub Pages, Netlify), add to `next.config.ts`:

```ts
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};
```

then `npm run build` and publish `out/`.

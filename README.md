# openwearablesai.com

The personal research site of **Shehjar Sadhu**, PhD — wearable digital health,
Internet of Medical Things platforms, and psycho-physiological signal analysis.

Live at **[openwearablesai.com](https://openwearablesai.com)**.

---

## The site

A single page in six sections: an opening scroll-scrubbed sequence, then
Research Projects, News, Publications, Open Source and Contact.

The hero is the part worth explaining. It is a tall pinned stage where scroll
position drives a film of the research journey. Each beat is a project, its own
photograph dissolving into the next, with a live biosignal trace running over
the footage as the connective thread:

| Beat | Scene | Signal |
| --- | --- | --- |
| Title | Portrait | ECG |
| Minder | Textile armband and cloud pipeline | ECG |
| CareWear | Chest belt and smartwatch session | PPG |
| FidgetSense | Behaviour classification | Accelerometer |
| MindGame | Puzzle platform | Cursor dynamics |
| Clinical insight | Clinician dashboard | EEG |

The waveforms are not video or looped assets. They are generated per frame from
physiologically shaped functions in [`src/lib/signals.ts`](site/src/lib/signals.ts):
the ECG is a sum of gaussians approximating the P-QRS-T complex with baseline
wander and EMG noise, PPG carries a dicrotic notch, and the accelerometer has the
rhythmic burst signature that made frequency-domain features win in FidgetSense.

Transitions between modalities use a left-to-right **sweep**: ahead of the sweep
line the previous signal is still running, behind it the new one has locked in,
with the amplitude dipping at the boundary. That is what an instrument changing
range looks like, and it reads better than a crossfade.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · Tailwind CSS v4 · GSAP 3 · Lenis.
Exported as static HTML and served by GitHub Pages.

## Run it

```bash
cd site && npm install
```

```bash
npm run dev
```

Then open http://localhost:3000. Files under `site/src/` hot-reload.

```bash
npm run build
```

Writes the static export to `site/out/`. Note that `npm start` will **not** work —
the project is configured for static export, so there is no server to start. To
preview the built output, serve the folder:

```bash
cd site/out && python3 -m http.server 4321
```

## Where things live

| Path | What it is |
| --- | --- |
| `site/src/lib/data.ts` | **All page content.** Bio, hero beats, projects, news, publications, open-source releases. Edit here, not in components. |
| `site/src/lib/signals.ts` | Waveform generators and the colour utilities the hero draws with. |
| `site/src/components/SignalHero.tsx` | The scroll-scrubbed opening sequence. |
| `site/src/components/Systems.tsx` | Research Projects: interests, figures, and the project panels. |
| `site/src/app/globals.css` | Design tokens — colour, type, spacing, the reveal primitive. |
| `site/public/media/` | Project and gallery imagery. |
| `site/public/CNAME` | Keeps the custom domain attached through redeploys. Do not delete. |
| `.github/workflows/deploy.yml` | Builds and publishes on every push to `main`. |

## Editing content

Almost everything is data-driven. To add a project, append to `SYSTEMS` in
`site/src/lib/data.ts`; `group: "Smartwatch"` places it in the leading group and
anything else falls into "Further platforms". Panels alternate sides
automatically. To change the hero sequence, edit `BEATS` — the `signal` field
picks the waveform, `image` is the scene, and `stamp` is the label drawn onto the
canvas readout. Adding or removing a beat resizes the scroll track by itself.

## Deploying

Every push to `main` triggers `.github/workflows/deploy.yml`, which runs
`npm ci`, `npm run build`, and publishes `site/out` to Pages. Pages is configured
with **Source: GitHub Actions**, not a branch.

DNS lives at GoDaddy: four `A` records on the apex pointing at GitHub's Pages
addresses, plus a `CNAME` on `www`. See [DEPLOY.md](DEPLOY.md) for the exact
records and the HTTPS ordering.

## Accessibility and motion

Every animation sits behind `prefers-reduced-motion`. With it enabled Lenis is
never started, scroll reveals render in their final state, and the hero draws a
static frame. Ink tokens meet 4.5:1 against the page ground, controls meet the
44px touch target on phones, and the desktop navigation collapses to a sheet
below 1024px.

## Research

Publications are listed on the site and on
[Google Scholar](https://scholar.google.com/citations?user=pOj-vwUAAAAJ&hl=en).
The MindGame wearable dataset is released on Zenodo at
[10.5281/zenodo.16113318](https://doi.org/10.5281/zenodo.16113318).

## Licence

Code is free to reference. The written content, photographs and research figures
are not — they document real studies and belong to their authors and
collaborating institutions.

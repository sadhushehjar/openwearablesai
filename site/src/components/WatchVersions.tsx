import Image from "next/image";
import { asset } from "@/lib/data";

/**
 * Four builds of the Galaxy Watch app, as a plain reference table.
 *
 * Deliberately static: this is a changelog, and a changelog is read, not
 * watched. It marks where the wrist-worn work begins and separates it from
 * the armband, glove and dashboard projects that follow.
 */

const VERSIONS = [
  {
    v: "v0.0.0",
    era: "The past",
    shot: "/media/watch-app-v0.png",
    alt: "The first Wearable DAQ watch screen: accelerometer, gyroscope and heart rate, each with a sample-rate selector and an on/off toggle.",
    notes: ["Too many toggles", "Did not support a range of sample rates"],
    used: false,
  },
  {
    v: "v1.0.0",
    era: "The past",
    shot: "/media/watch-app-v1.jpg",
    alt: "The watch worn on the wrist, stepping through the stress-test protocol: Rest 1, Prepare Speech, Give Speech.",
    notes: [
      "Started giving high data dropouts",
      "One file saved every five minutes",
      "Background timer complexities",
    ],
    used: true,
  },
  {
    v: "v2.0.0",
    era: "The present",
    shot: null,
    alt: "",
    notes: ["On-board heart-rate quality checks", "Simpler backend with a wake lock"],
    used: true,
  },
  {
    v: "v3.0.0",
    era: "The future",
    shot: "/media/watch-mqtt.jpg",
    alt: "The current watch app showing internet connection status, MQTT state and the watch identifier, with start and stop controls.",
    notes: ["Publishes and subscribes over MQTT", "Paired with the Galaxy Studio dashboard"],
    used: false,
  },
];

export default function WatchVersions() {
  return (
    <div className="u-shell py-[clamp(48px,7vw,88px)]">
      <div data-reveal className="max-w-2xl">
        <span className="u-eyebrow">Smartwatch platforms</span>
        <h3 className="mt-4 text-[clamp(1.7rem,3.2vw,2.5rem)]">
          Four builds of the
          <br />
          <span className="text-ink-3">Galaxy Watch app.</span>
        </h3>
        <p className="mt-5 max-w-[58ch] text-ink-2">
          Three of the studies below run on a consumer Samsung Galaxy Watch
          sampling at 30 Hz. Getting a commodity device to hold a rate and
          survive a full session was its own body of work.
        </p>
      </div>

      <ol className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-line)] sm:grid-cols-2 lg:grid-cols-4">
        {VERSIONS.map((r, i) => (
          <li
            key={r.v}
            data-reveal
            style={{ "--reveal-delay": `${i * 60}ms` } as React.CSSProperties}
            className="flex flex-col bg-surface p-5"
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-display text-[1.6rem] font-semibold tracking-[-0.04em]">
                {r.v}
              </span>
              <span className="font-mono text-[0.6rem] tracking-[0.12em] text-ink-4 uppercase">
                {r.era}
              </span>
            </div>

            <div className="relative mt-4 aspect-square overflow-hidden rounded-xl border border-[var(--color-line)] bg-[#101014]">
              {r.shot ? (
                <Image
                  src={asset(r.shot)}
                  alt={r.alt}
                  fill
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 260px"
                  className="object-contain"
                />
              ) : (
                <span className="absolute inset-0 grid place-items-center px-4 text-center font-mono text-[0.62rem] leading-relaxed text-white/40">
                  Screenshot not in the
                  <br />
                  exported deck
                </span>
              )}
            </div>

            <ul className="mt-4 flex-1 space-y-2">
              {r.notes.map((n) => (
                <li
                  key={n}
                  className="flex gap-2 text-[0.84rem] leading-snug text-ink-3"
                >
                  <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                  {n}
                </li>
              ))}
            </ul>

            {r.used && (
              <span className="mt-4 self-start rounded-full border border-[var(--color-line)] px-2.5 py-1 font-mono text-[0.6rem] text-ink-2">
                Used in study
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

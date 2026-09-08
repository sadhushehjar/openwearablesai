import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { PERSON } from "@/lib/data";

const display = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600"],
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

/** The canonical home. Search engines are pointed here regardless of where a
 *  given deploy is served from, so indexing consolidates on one address. */
const SITE_URL = "https://openwearablesai.com";

const DESCRIPTION =
  "Shehjar Sadhu, PhD in Electrical Engineering from the University of Rhode Island. Wearable digital health research: Internet of Medical Things platforms, biosignal processing and applied machine learning for remote psycho-physiological monitoring.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    // the name leads, because the search that matters most is the name itself
    default: `${PERSON.name} — Wearable Digital Health Research`,
    template: `%s · ${PERSON.name}`,
  },
  description: DESCRIPTION,
  applicationName: PERSON.name,
  authors: [{ name: PERSON.name, url: SITE_URL }],
  creator: PERSON.name,
  publisher: PERSON.name,
  alternates: { canonical: "/" },
  keywords: [
    "Shehjar Sadhu",
    "Shehjar Sadhu URI",
    "wearable digital health",
    "biosignal processing",
    "ECG",
    "PPG",
    "machine learning",
    "ADHD",
    "Parkinson's disease",
    "University of Rhode Island",
  ],
  openGraph: {
    type: "profile",
    url: SITE_URL,
    siteName: PERSON.name,
    title: `${PERSON.name} — Wearable Digital Health Research`,
    description: DESCRIPTION,
    locale: "en_US",
    firstName: "Shehjar",
    lastName: "Sadhu",
    images: [
      {
        url: "/media/portrait-face.jpg",
        width: 440,
        height: 440,
        alt: `${PERSON.name}, ${PERSON.role}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${PERSON.name} — Wearable Digital Health Research`,
    description: DESCRIPTION,
    images: ["/media/portrait-face.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export const viewport: Viewport = {
  themeColor: "#fafafa",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="antialiased">
        <a
          href="#projects"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-ground"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}

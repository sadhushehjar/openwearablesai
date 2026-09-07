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

const DESCRIPTION =
  "PhD candidate in Electrical Engineering at the University of Rhode Island, building wearable digital-health systems that carry physiological signal from the body to the clinic.";

export const metadata: Metadata = {
  title: {
    default: `${PERSON.name} — Wearable Digital Health`,
    template: `%s · ${PERSON.name}`,
  },
  description: DESCRIPTION,
  authors: [{ name: PERSON.name }],
  keywords: [
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
    title: `${PERSON.name} — Wearable Digital Health`,
    description: DESCRIPTION,
    type: "profile",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#050507",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="antialiased">
        <a
          href="#interests"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-ground"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}

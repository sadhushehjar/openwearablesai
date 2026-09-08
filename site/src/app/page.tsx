import SmoothScroll from "@/components/SmoothScroll";
import Reveal from "@/components/Reveal";
import Nav from "@/components/Nav";
import SignalHero from "@/components/SignalHero";
import Systems from "@/components/Systems";
import News from "@/components/News";
import Publications from "@/components/Publications";
import OpenSource from "@/components/OpenSource";
import Contact from "@/components/Contact";
import { PERSON } from "@/lib/data";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: PERSON.name,
  jobTitle: PERSON.role,
  email: `mailto:${PERSON.email}`,
  affiliation: {
    "@type": "CollegeOrUniversity",
    name: "University of Rhode Island",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "University of Rhode Island",
  },
  sameAs: [PERSON.scholar, PERSON.medium],
  knowsAbout: [
    "Wearable digital health",
    "Internet of Medical Things",
    "Biosignal processing",
    "Applied machine learning",
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      <SmoothScroll />
      <Reveal />
      <Nav />

      <main>
        <SignalHero />
        <Systems />
        <News />
        <Publications />
        <OpenSource />
        <Contact />
      </main>
    </>
  );
}

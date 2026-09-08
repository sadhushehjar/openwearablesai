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

const SITE_URL = "https://openwearablesai.com";

/**
 * Person plus WebSite, graphed together.
 *
 * `sameAs` is the part that matters for a name search: it tells Google that the
 * Scholar profile, the GitHub account and this site are one person, so the
 * authority already sitting on those profiles counts toward this page.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: PERSON.name,
      givenName: "Shehjar",
      familyName: "Sadhu",
      jobTitle: PERSON.role,
      description: PERSON.summary,
      url: SITE_URL,
      image: `${SITE_URL}/media/portrait-face.jpg`,
      email: `mailto:${PERSON.email}`,
      gender: "Female",
      worksFor: {
        "@type": "ResearchOrganization",
        name: "Wearable Biosensing Lab, University of Rhode Island",
        url: "https://web.uri.edu/wbl/",
      },
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "University of Rhode Island",
        url: "https://www.uri.edu/",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kingston",
        addressRegion: "RI",
        addressCountry: "US",
      },
      sameAs: [
        PERSON.scholar,
        PERSON.medium,
        "https://github.com/sadhushehjar",
      ],
      knowsAbout: [
        "Wearable digital health",
        "Internet of Medical Things",
        "Biosignal processing",
        "Electrocardiography",
        "Photoplethysmography",
        "Applied machine learning",
        "ADHD",
        "Parkinson's disease",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: `${PERSON.name} — Wearable Digital Health Research`,
      inLanguage: "en-US",
      about: { "@id": `${SITE_URL}/#person` },
      publisher: { "@id": `${SITE_URL}/#person` },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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

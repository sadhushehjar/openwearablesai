import type { SignalId } from "./signals";

/** set when the site is served from a subpath rather than its own domain */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Prefix a file in public/ with the deploy base path.
 *
 * next/image normally applies basePath itself, but NOT when `unoptimized` is
 * set — which static export requires — so every media src has to be prefixed
 * here or it 404s wherever the site is served from a subpath.
 */
export const asset = (path: string) => `${BASE}${path}`;

export const PERSON = {
  name: "Shehjar Sadhu",
  pronouns: "she/her",
  role: "PhD, Electrical Engineering",
  org: "Wearable Biosensing Lab · University of Rhode Island",
  email: "shehjar_sadhu@uri.edu",
  scholar: "https://scholar.google.com/citations?user=pOj-vwUAAAAJ&hl=en",
  medium: "https://medium.com/@shehjarsadhu",
  cv: asset("/Shehjar_Sadhu_CV.pdf"),
  grad: "2026",
  summary:
    "My research centres on Internet of Medical Things platforms that integrate wearable sensors and artificial intelligence to support remote psycho-physiological health monitoring.",
} as const;

export const NAV = [
  { href: "#projects", label: "Research Projects" },
  { href: "#news", label: "News" },
  { href: "#publications", label: "Publications" },
  { href: "#awards", label: "Awards" },
  { href: "#open-source", label: "Open Source" },
];

/* ------------------------------------------------------------------ */
/* hero beats — the scroll-scrubbed signal sequence                     */
/* ------------------------------------------------------------------ */

export interface Beat {
  signal: SignalId;
  eyebrow: string;
  title: string;
  /** secondary line under the name on the opening beat */
  subtitle?: string;
  /** a trimmed body for narrow screens, where the full one runs too long */
  bodyShort?: string;
  body: string;
  align: "center" | "left" | "right";
  /** drawn onto the canvas readout — anchors each beat to a project */
  stamp: string;
  /** shown in the opening banner, so the visitor meets the person first */
  portrait?: string;
  /** the scene behind this beat: real imagery from that project */
  image?: string;
  imageAlt?: string;
  specs?: string[];
}

export const BEATS: Beat[] = [
  {
    signal: "ecg",
    eyebrow: "PhD · Electrical Engineering",
    title: "Shehjar Sadhu",
    subtitle: "Wearable digital health research.",
    body: "I design Internet of Medical Things platforms end to end: device firmware, mobile and cloud infrastructure, signal processing, and the clinician-facing interfaces where longitudinal data is finally read. The recurring question across all of it is which parts of a real-world stream can be trusted.",
    bodyShort: "Internet of Medical Things platforms that integrate wearable sensors and AI for remote psycho-physiological health monitoring.",
    align: "center",
    stamp: "WEARABLE BIOSENSING LAB · UNIVERSITY OF RHODE ISLAND",
    portrait: asset("/media/portrait-face.jpg"),
  },
  {
    signal: "ecg",
    eyebrow: "01 — Cardiac signal",
    title: "Continuous\ncardiac monitoring.",
    body: "Arm-worn electrocardiography acquired over multi-hour sessions and synchronised through a serverless cloud pipeline. Pan–Tompkins detection yields R-peaks, and the resulting RR intervals support heart-rate variability analysis.",
    align: "left",
    stamp: "MINDER · 2024 — PRESENT",
    image: asset("/media/minder-armband.jpg"),
    imageAlt: "The Minder textile armband worn on the upper arm, streaming ECG, EDA and IR telemetry to a cloud pipeline, beside tablet screens showing live plots and a timestamped annotation log.",
    specs: [
      "Minder · NIH R01 · UMass Chan Medical School",
      "arm-ECG, EDA and PPG acquisition",
      "Best Demo Award, IEEE BSN 2025",
    ],
  },
  {
    signal: "ppg",
    eyebrow: "02 — Optical pulse",
    title: "Wrist-based\nphysiological sensing.",
    body: "Consumer smartwatches provide continuous heart-rate data at low participant burden. The research contribution lies in establishing which segments meet the quality threshold required for downstream inference.",
    align: "right",
    stamp: "CAREWEAR · 2024 — PRESENT",
    image: asset("/media/carewear-session.jpg"),
    imageAlt: "A CareWear data collection session: a participant wearing a chest belt and smartwatch, beside a laptop receiving a live acceleration stream.",
    specs: [
      "CareWear · 27 participants",
      "Trier Social Stress Test protocol",
      "Over 16 GB of physiological data",
    ],
  },
  {
    signal: "acc",
    eyebrow: "03 — Inertial motion",
    title: "Motion as a\nbehavioural marker.",
    body: "Twenty children observed across structured and unstructured school-like activities, with approximately sixteen hours of video annotated by seven trained raters. Power-spectral-density features outperformed time-domain features, consistent with the repetitive character of fidgeting behaviour.",
    align: "left",
    stamp: "FIDGETSENSE · 2025",
    image: asset("/media/fidgetsense-behaviors.jpg"),
    imageAlt: "FidgetSense behaviour classification: tri-axial motion traces feeding labelled fidgeting behaviours into a separated scatter plot.",
    specs: [
      "FidgetSense · Galaxy Watch 4 at 30 Hz",
      "83.97% balanced accuracy · 0.92 ROC AUC",
      "ADHD vs. neurotypical, p = 0.0033",
    ],
  },
  {
    signal: "mouse",
    eyebrow: "04 — Interaction data",
    title: "Interaction data as\na digital biomarker.",
    body: "Within a browser-based puzzle platform, cursor dynamics demonstrated greater stability than the concurrently recorded wearable stream — a finding that informed the design of subsequent data-quality controls.",
    align: "right",
    stamp: "MINDGAME · 2024 — 2025",
    image: asset("/media/mindgame-puzzle.jpg"),
    imageAlt: "The MindGame tangram puzzle interface used in the ADHD behaviour study, with a shape palette, target silhouette and completion meter.",
    specs: [
      "MindGame · ACM IoT 2025, Vienna",
      "2,427 puzzle sessions recorded",
      "Dataset released on Zenodo",
    ],
  },
  {
    signal: "eeg",
    eyebrow: "05 — Clinical translation",
    title: "From multimodal signal\nto clinical insight.",
    body: "Seven sensing modalities across eight platforms, directed towards a single objective: reducing the distance between what a sensor records and what a clinical team can act upon.",
    align: "center",
    stamp: "BIOSIGNALVIZ · 2026",
    image: asset("/media/careportal-dashboard.jpg"),
    imageAlt: "A clinician-facing wearable data dashboard showing daily heart-rate charts with range selection and summary views.",
  },
];

/* ------------------------------------------------------------------ */
/* research interests                                                  */
/* ------------------------------------------------------------------ */

export const INTERESTS = [
  {
    title: "Wearable digital health systems",
    body: "End-to-end Internet of Medical Things platforms spanning device firmware, mobile applications, cloud infrastructure and clinician-facing interfaces.",
  },
  {
    title: "Psycho-physiological signal analysis",
    body: "Processing and interpretation of ECG, PPG, electrodermal activity and inertial data for the assessment of stress, attention and motor function.",
  },
  {
    title: "Applied machine learning",
    body: "Feature engineering, classical models and deep architectures for multimodal sensor fusion, with attention to validation strategy and generalisability.",
  },
  {
    title: "Data quality and reliability",
    body: "Quantifying the reliability of participant-generated wearable data in remote and naturalistic settings, and designing quality controls that operate in real time.",
  },
  {
    title: "User-centred clinical design",
    body: "Participatory design of analytics platforms with clinicians, so that longitudinal sensor data is presented in a form suited to clinical decision-making.",
  },
  {
    title: "Clinical domains",
    body: "ADHD, Parkinson's disease, epilepsy, opioid use disorder, dementia caregiving and stress management.",
  },
];

export const METRICS = [
  { value: 142, label: "Citations", sub: "Google Scholar" },
  { value: 5, label: "h-index", sub: "i10-index 4" },
  { value: 16, label: "Publications", sub: "peer-reviewed" },
  { value: 8, label: "Research platforms", sub: "deployed to studies" },
];

/* ------------------------------------------------------------------ */
/* research projects                                                   */
/* ------------------------------------------------------------------ */

export interface System {
  id: string;
  name: string;
  tagline: string;
  status:
    | "Ongoing"
    | "Deployed"
    | "Published"
    | "Submitted"
    | "Under preparation"
    | "Independent";
  /** smartwatch work leads the showcase; other platforms follow */
  group: "Smartwatch" | "Other";
  year: string;
  body: string;
  image: string;
  alt: string;
  signals: SignalId[];
  facts: { k: string; v: string }[];
  stack: string[];
  partner: string;
}

export const SYSTEMS: System[] = [
  {
    id: "carewear",
    group: "Smartwatch",
    name: "CareWear",
    tagline: "Multimodal stress detection platform for mental health.",
    status: "Under preparation",
    year: "2024 — present",
    body: "Twenty-seven participants completed a Trier Social Stress Test while wearing a consumer smartwatch and a custom chest belt, with a Biopac system providing reference physiology. The processing pipeline cleans and merges more than 16 GB of data, then benchmarks classical machine-learning models against DeepFusionNet, a per-sensor CNN–LSTM architecture with attention that learns heart-rate and motion representations before fusion.",
    image: asset("/media/carewear-session.jpg"),
    alt: "CareWear data collection session: a seated participant wearing a chest belt and smartwatch using an under-desk exercise bike, beside a laptop displaying the companion application receiving a live acceleration stream.",
    signals: ["ecg", "ppg", "acc"],
    facts: [
      { k: "Participants", v: "27 (13 M · 14 F)" },
      { k: "Data volume", v: "Over 16 GB" },
      { k: "DeepFusionNet", v: "0.67 b-acc · 0.76 F1 (ACC+HR)" },
      { k: "Combined set", v: "0.77 b-acc · 0.83 F1" },
    ],
    stack: ["PyTorch", "Pan–Tompkins", "scikit-learn", "Kotlin"],
    partner: "Brown Health",
  },
  {
    id: "fidgetsense",
    group: "Smartwatch",
    name: "FidgetSense",
    tagline: "Fidgeting behaviour detection in children with ADHD.",
    status: "Submitted",
    year: "2025",
    body: "Twenty children aged 6–11 completed school-like activities — academic worksheets, structured and unstructured magnetic-tile tasks, and free play — while wearing a Galaxy Watch 4 sampling at 30 Hz under video observation. Seven raters, blinded to diagnostic status, annotated approximately sixteen hours of recordings. Frequency-domain features provided the strongest discrimination, consistent with the rhythmic and repetitive nature of the target behaviours.",
    image: asset("/media/fidgetsense-behaviors.jpg"),
    alt: "FidgetSense concept diagram: a hand icon and three overlaid tri-axial motion traces feeding labelled behaviours — moving chair, twirling hair and finger tapping — into a scatter plot separated by a decision boundary.",
    signals: ["acc", "gyr"],
    facts: [
      { k: "Cohort", v: "20 children · 6 with ADHD" },
      { k: "Annotation", v: "~16 h video · 7 raters" },
      { k: "Best model", v: "Gradient Boosting · PSD features" },
      { k: "Balanced accuracy", v: "83.97% · AUC 0.92" },
    ],
    stack: ["Galaxy Watch 4", "scikit-learn", "StratifiedGroupKFold"],
    partner: "Q2Behave LLC · URI Psychology",
  },
  {
    id: "mindgame",
    group: "Smartwatch",
    name: "MindGame",
    tagline:
      "Internet of Medical Things puzzle platform for ADHD behaviour analysis.",
    status: "Published",
    year: "2024 — 2025",
    body: "An IoMT platform pairing a browser-based tangram game with a smartwatch, capturing cursor dynamics and wearable sensor streams on a common clock. Across 2,427 puzzle sessions the study assessed whether wearable data is sufficiently reliable for remote behaviour monitoring, and established a set of data-quality metrics for in-lab versus at-home comparison.",
    image: asset("/media/mindgame-puzzle.jpg"),
    alt: "MindGame interface: a tangram puzzle level showing a palette of coloured shapes on the left, a grey target silhouette in the centre, and a countdown timer with a completion meter.",
    signals: ["mouse", "acc", "gyr", "ppg", "eeg"],
    facts: [
      { k: "Participants", v: "12 (5 with ADHD)" },
      { k: "Sessions recorded", v: "2,427 puzzles" },
      { k: "Venue", v: "ACM IoT 2025, Vienna" },
      { k: "Dataset", v: "Public — Zenodo" },
    ],
    stack: ["Flask", "Google Cloud", "MQTT", "Wear OS", "MUSE EEG"],
    partner: "URI Psychology",
  },
  {
    id: "minder",
    group: "Other",
    name: "Minder",
    tagline: "Cloud system for a wearable armband monitoring opioid use disorder.",
    status: "Ongoing",
    year: "2024 — present",
    body: "A serverless extract-transform-load pipeline on AWS ingests and temporally aligns high-frequency arm-ECG, electrodermal activity and PPG from a custom textile armband across sessions exceeding six hours. A cross-platform Flutter application manages device pairing, event annotation and cloud synchronisation. The system is currently in active data collection towards a target of fifty participants.",
    image: asset("/media/minder-armband.jpg"),
    alt: "Minder system diagram: a textile armband worn on the upper arm streaming ECG, EDA, IR and battery telemetry to AWS, beside tablet screens showing live ECG and EDA plots and a timestamped event-annotation log.",
    signals: ["ecg", "eda", "ppg"],
    facts: [
      { k: "Funding", v: "NIH R01" },
      { k: "Collaboration", v: "UMass Chan Medical School" },
      { k: "Recognition", v: "Best Demo Award, IEEE BSN 2025" },
      { k: "Session length", v: "6+ hours continuous" },
    ],
    stack: ["AWS Lambda", "Amazon S3", "Flutter", "Python"],
    partner: "UMass Chan Medical School",
  },
  {
    id: "riseabove",
    group: "Other",
    name: "RiseAbove",
    tagline: "Epilepsy stigma self-management platform.",
    status: "Deployed",
    year: "2023 — 2025",
    body: "A containerised Flask application deployed on Google Cloud Platform, developed in collaboration with a neuropsychologist to deliver an online stigma-reduction programme. The deployment supported a feasibility and acceptability study and three peer-reviewed publications in Epilepsy & Behavior.",
    image: asset("/media/riseabove-portal.jpg"),
    alt: "RiseAbove portal: a participant at a desktop monitor displaying the stress-management module with before-and-after mood rating scales for deep breathing and relaxation exercises.",
    signals: [],
    facts: [
      { k: "Publications", v: "3 · Epilepsy & Behavior" },
      { k: "Funding", v: "Epilepsy Foundation New England" },
      { k: "Infrastructure", v: "GCP Cloud Run" },
      { k: "Collaboration", v: "Brown Health" },
    ],
    stack: ["Flask", "Docker", "Google Cloud Platform"],
    partner: "Brown Health",
  },
  {
    id: "kaya",
    group: "Other",
    name: "Kaya / iTex",
    tagline: "E-textile glove system for Parkinson's disease tele-assessment.",
    status: "Published",
    year: "2022 — 2023",
    body: "Finger-flex sensors and an inertial measurement unit integrated into a textile glove, with a Raspberry Pi companion tablet guiding participants through standardised motor examinations in the home. Machine-learning models achieved approximately 90% accuracy for tremor and rigidity assessment, and a follow-up study characterised the effect of medication intake on in-home motor exam performance.",
    image: asset("/media/kaya-gloves.jpg"),
    alt: "Kaya system: e-textile gloves with finger flex sensors and an ESP32 microcontroller on the left, and a tablet companion application with a Raspberry Pi on the right.",
    signals: ["acc", "gyr"],
    facts: [
      { k: "Accuracy", v: "~90% tremor and rigidity" },
      { k: "Funding", v: "NSF CAREER" },
      { k: "Venues", v: "IEEE BSN · MDPI Sensors" },
      { k: "Setting", v: "In-home motor examination" },
    ],
    stack: ["ESP32", "Raspberry Pi", "scikit-learn"],
    partner: "Brown Health",
  },
  {
    id: "careportal",
    group: "Other",
    name: "CarePortal",
    tagline: "Clinician-centred dashboard for wearable data analytics.",
    status: "Published",
    year: "2023",
    body: "A wearable-data dashboard developed through participatory design with twenty-one clinician interviews, forming the basis of my master's thesis. Each interface affordance — carousel navigation, range selection, axis reset and export — was derived from documented clinician workflow requirements rather than assumed need.",
    image: asset("/media/careportal-dashboard.jpg"),
    alt: "CarePortal dashboard: four variants of a daily heart-rate chart annotated with carousel navigation, a range slider, download and reset controls, and a box-plot summary view.",
    signals: ["ppg"],
    facts: [
      { k: "Method", v: "21 clinician interviews" },
      { k: "Journal", v: "JMIR Formative Research" },
      { k: "Setting", v: "Hospital emergency department" },
      { k: "Funding", v: "NIH R01" },
    ],
    stack: ["Plotly", "Flask", "Participatory design"],
    partner: "Brown University",
  },
  {
    id: "biosignalviz",
    group: "Other",
    name: "BiosignalViz",
    tagline: "Multimodal biosignal dashboard with agentic pipeline recommendation.",
    status: "Independent",
    year: "2025 — present",
    body: "A high-throughput dashboard for visualising multimodal biosignals, incorporating an agentic module that assesses signal quality and recommends an appropriate processing pipeline for artefact removal, filtering and resampling. System scalability and rendering latency were benchmarked against the MIT-BIH Arrhythmia Database.",
    image: asset("/media/biosignal-processing.jpg"),
    alt: "Multi-panel biosignal output: an ECG trace in millivolts with detected R-peaks marked, the heart rate derived from those intervals, and the reference heart rate reported by the acquisition system for comparison.",
    signals: ["ecg"],
    facts: [
      { k: "Benchmark", v: "MIT-BIH Arrhythmia Database" },
      { k: "Agent", v: "Signal quality → pipeline selection" },
      { k: "Backend", v: "Firebase" },
      { k: "Status", v: "In submission" },
    ],
    stack: ["Gemini API", "Firebase", "Python"],
    partner: "Independent",
  },
];

/* ------------------------------------------------------------------ */
/* news                                                                */
/* ------------------------------------------------------------------ */

export const NEWS = [
  {
    year: "2025",
    title: "MindGame featured in Rhody Today",
    body: "The University of Rhode Island news office published a feature on the ADHD puzzle-game platform and its wearable data collection.",
  },
  {
    year: "2025",
    title: "ACM IoT 2025, Vienna",
    body: "Presented the MindGame data-reliability study at the 15th International Conference on the Internet of Things.",
  },
  {
    year: "2025",
    title: "Wearable Biosensing Lab news feature",
    body: "Laboratory-wide feature covering digital health research across ADHD, Parkinson's disease and stress monitoring.",
  },
  {
    year: "2025",
    title: "Industry visit — AFFOA",
    body: "Visited Advanced Functional Fabrics of America with the laboratory to review e-textile fabrication processes.",
  },
  {
    year: "2024",
    title: "Invited to the Rhode Island State House",
    body: "Presented wearable health research to state legislators alongside the Wearable Biosensing Lab team.",
  },
];

/* ------------------------------------------------------------------ */
/* awards and honours                                                  */
/* ------------------------------------------------------------------ */

export interface Award {
  year: string;
  title: string;
  body: string;
  /** the work it was given for, where that is a named project */
  project?: string;
}

export const AWARDS: Award[] = [
  {
    year: "2025",
    title: "Best Demo Award",
    body: "IEEE International Conference on Body Sensor Networks, for the armband system and its cloud pipeline.",
    project: "Minder",
  },
  {
    year: "2025",
    title: "Enhancement of Graduate Research Award",
    body: "University of Rhode Island, for Samya: a jewellery-like wrist wearable for managing stress in women with polycystic ovary syndrome.",
  },
  {
    year: "2024, 2023",
    title: "IEEE BSN Student Travel Award",
    body: "Awarded on two occasions to attend the IEEE International Conference on Body Sensor Networks.",
  },
  {
    year: "2022",
    title: "IEEE CHASE Student Travel Award",
    body: "International Conference on Connected Health: Applications, Systems and Engineering Technologies.",
  },
  {
    year: "2022",
    title: "NSF–NIH Smart Health Workshop",
    body: "Proposal selected for presentation at the national workshop.",
    project: "CareHub",
  },
  {
    year: "2022",
    title: "Enhancement of Graduate Research Award",
    body: "University of Rhode Island, for a smart diet system for polycystic kidney disorder.",
  },
  {
    year: "2020",
    title: "IEEE CASS COVID-19 Special Student Design Competition",
    body: "Third place, for RespDetect: a smart mask for respiratory monitoring.",
    project: "RespDetect",
  },
  {
    year: "2019",
    title: "Undergraduate Research Grant",
    body: "University of Rhode Island, for remote homology detection. Principal investigator: Dr Noah Daniels.",
  },
];

/* ------------------------------------------------------------------ */
/* education and milestones — the banner timeline                      */
/* ------------------------------------------------------------------ */

export interface Milestone {
  year: string;
  span: string;
  title: string;
  detail: string;
  /** the current position on the spine */
  now?: boolean;
}

export const TIMELINE: Milestone[] = [
  {
    year: "2026",
    span: "May 2026",
    title: "PhD, Electrical Engineering",
    detail: "University of Rhode Island. Advisors: Dr Kunal Mankodiya and Dr Dhaval Solanki.",
    now: true,
  },
  {
    year: "2025",
    span: "IEEE BSN",
    title: "Best Demo Award",
    detail: "For the Minder armband system.",
  },
  {
    year: "2022",
    span: "Jan 2022",
    title: "PhD begins",
    detail: "Digital health, artificial intelligence and wearable sensors.",
  },
  {
    year: "2021",
    span: "Dec 2021",
    title: "MS, Electrical Engineering",
    detail: "Thesis: CarePortal, a clinician-centred digital health portal for wearable data analytics.",
  },
  {
    year: "2020",
    span: "May 2020",
    title: "BS, Computer Science & Data Science",
    detail: "Dual degree, Department of Computer Science and Statistics.",
  },
  {
    year: "2016",
    span: "Sep 2016",
    title: "Arrived at URI",
    detail: "From New Delhi to Kingston, Rhode Island.",
  },
];

/* ------------------------------------------------------------------ */
/* open source                                                         */
/* ------------------------------------------------------------------ */

export const OPEN_SOURCE = [
  {
    name: "MindGame wearable dataset",
    kind: "Dataset",
    body: "Multimodal recordings from twelve participants across 2,427 puzzle sessions, comprising accelerometer, gyroscope, heart-rate and cursor activity together with the data-quality metrics reported in the ACM IoT 2025 paper.",
    meta: "Zenodo · 10.5281/zenodo.16113318",
    href: "https://doi.org/10.5281/zenodo.16113318",
  },
  {
    name: "CareWear dataset",
    kind: "Dataset — under preparation",
    body: "A multimodal psycho-physiological dataset collected from a consumer smartwatch and custom chest belt under a Trier Social Stress Test protocol, with concurrent Biopac reference physiology.",
    meta: "Release pending publication",
  },
  {
    name: "MindGame platform",
    kind: "Software",
    body: "The IoMT puzzle-game stack: Flask backend, browser-based tangram client, MQTT bridge and the Wear OS companion application used for synchronised multimodal capture.",
    meta: "Available on request",
  },
];

/* ------------------------------------------------------------------ */
/* publications                                                        */
/* ------------------------------------------------------------------ */

export interface Pub {
  authors: string;
  title: string;
  venue: string;
  year: string;
  kind: "Journal" | "Conference";
  first: boolean;
  cites?: number;
  note?: string;
  url?: string;
}

export const PUBS: Pub[] = [
  {
    authors:
      "Sadhu S, Ravichandran V, Bhagat N, Beatty A, Mankodiya K, Weyandt L, Costea G, Solanki D",
    title:
      "FidgetSense: Commodity Smartwatch-Based Monitoring of Fidgeting Behaviors in Children with ADHD",
    venue: "ACM Transactions on Computing for Healthcare",
    year: "2026",
    kind: "Journal",
    first: true,
    note: "Submitted",
  },
  {
    authors: "Sadhu S, Bhagat N, Castillo E, Weyandt L, Mankodiya K, Solanki D",
    title:
      "Is wearable data reliable for monitoring behavior? Design of a wearable-based IoMT puzzle game for remote behavior monitoring",
    venue:
      "ACM International Conference on the Internet of Things (IoT '25), Vienna",
    year: "2025",
    kind: "Conference",
    first: true,
    url: "https://doi.org/10.1145/3770501.3770523",
  },
  {
    authors: "Sadhu S, Solanki D, Mankodiya K, Al Rumon MA",
    title:
      "CareWear: A multimodal physiological dataset collected via a consumer-based wearable device for stress monitoring",
    venue: "Under preparation",
    year: "2026",
    kind: "Journal",
    first: true,
  },
  {
    authors: "Sadhu S, Solanki D, Brick LA, Nugent NR, Mankodiya K",
    title:
      "Designing a Clinician-Centered Wearable Data Dashboard (CarePortal): Participatory Design Study",
    venue: "JMIR Formative Research",
    year: "2023",
    kind: "Journal",
    first: true,
    cites: 16,
  },
  {
    authors:
      "Sadhu S, Solanki D, Constant N, Ravichandran V, Cay G, Saikia MJ, Akbar U, Mankodiya K",
    title:
      "Towards a telehealth infrastructure supported by machine learning on edge/fog for Parkinson's movement screening",
    venue: "Smart Health",
    year: "2022",
    kind: "Journal",
    first: true,
    cites: 16,
  },
  {
    authors: "Sadhu S, Castillo E, Weyandt L, Solanki D, Mankodiya K",
    title:
      "Feasibility of a Digital Health Puzzle Game for Detecting Computer Mouse Behavioral Patterns in ADHD",
    venue: "IEEE International Conference on Body Sensor Networks (BSN)",
    year: "2024",
    kind: "Conference",
    first: true,
  },
  {
    authors:
      "Sadhu S, Ravichandran V, Constant N, Akbar U, Mankodiya K, Solanki D",
    title:
      "Exploring the Impact of Parkinson's Medication Intake on Motor Exams Performed in-home Using Smart Gloves",
    venue: "IEEE International Conference on Body Sensor Networks (BSN)",
    year: "2023",
    kind: "Conference",
    first: true,
  },
  {
    authors: "Sadhu S, Yerule A, Constant N, Akbar U, Mankodiya K",
    title: "Motor exercise classification using machine learning",
    venue: "IEEE MIT Undergraduate Research Technology Conference (URTC)",
    year: "2019",
    kind: "Conference",
    first: true,
  },
  {
    authors:
      "Ravichandran V, Sadhu S, Convey D, Guerrier S, Chomal S, Dupre AM, Akbar U, Solanki D, Mankodiya K",
    title:
      "iTex Gloves: Design and In-Home Evaluation of an E-Textile Glove System for Tele-Assessment of Parkinson's Disease",
    venue: "Sensors",
    year: "2023",
    kind: "Journal",
    first: false,
    cites: 31,
  },
  {
    authors:
      "Cay G, Ravichandran V, Sadhu S, Zisk AH, Salisbury AL, Solanki D, Mankodiya K",
    title:
      "Recent advancement in sleep technologies: A literature review on clinical standards, sensors, apps, and AI methods",
    venue: "IEEE Access",
    year: "2022",
    kind: "Journal",
    first: false,
    cites: 49,
  },
  {
    authors:
      "Chapman KR, Maynard T, Sadhu S, Mankodiya K, Uebelacker L, Davis JD, Ott BR, Tremont G",
    title:
      "Beta Test of a Multicomponent Mobile Health Application for Dementia Caregivers",
    venue: "Journal of Technology in Behavioral Science",
    year: "2023",
    kind: "Journal",
    first: false,
  },
  {
    authors:
      "Prieto S, Kiriakopoulos ET, Goldstein A, Kaden S, Tremont G, Mankodiya K, Castillo E, Sadhu S, Solanki D, Davis JD, Margolis SA",
    title: "Toward a multimodal model of internalized epilepsy stigma",
    venue: "Epilepsy & Behavior",
    year: "2026",
    kind: "Journal",
    first: false,
  },
  {
    authors:
      "Prieto S, Kiriakopoulos ET, Goldstein A, Kaden S, Tremont G, Mankodiya K, Castillo E, Sadhu S, Solanki D, Davis JD, Margolis SA",
    title:
      "Stigma intersectionality and its impact on an epilepsy stigma self-management program",
    venue: "Epilepsy & Behavior",
    year: "2025",
    kind: "Journal",
    first: false,
    cites: 5,
  },
  {
    authors:
      "Margolis SA, Prieto S, Goldstein A, Kaden S, Castillo E, Sadhu S, Solanki D, Larracey ET, Tremont G, Mankodiya K, Kiriakopoulos ET",
    title:
      "Feasibility and acceptability of an online epilepsy stigma self-management program",
    venue: "Epilepsy & Behavior",
    year: "2025",
    kind: "Journal",
    first: false,
    cites: 7,
  },
  {
    authors:
      "Hicking F, Sadhu S, Ravichandran V, Weyandt L, Costea GO, Mankodiya K, Solanki D",
    title:
      "Comparative Investigation of Smartwatch Data in Children with ADHD and Non-ADHD",
    venue: "IEEE International Conference on Body Sensor Networks (BSN)",
    year: "2024",
    kind: "Conference",
    first: false,
  },
  {
    authors:
      "Seckin M, Sadhu S, Al Rumon MA, Gravel M, DiFazio H, Johnson N, Perry K, Solanki D, Mankodiya K",
    title:
      "MedDock: A 3D-Printed Smart Pill Dispenser with Sensitive Textile Sensor for Adherence Monitoring",
    venue: "IEEE International Conference on Body Sensor Networks (BSN)",
    year: "2024",
    kind: "Conference",
    first: false,
  },
];

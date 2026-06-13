export type TaskStage =
  | "before-arrival"
  | "first-48-hours"
  | "first-week"
  | "first-month"
  | "first-90-days";

export type TaskCategory =
  | "registration"
  | "housing"
  | "cpr"
  | "mitid"
  | "healthcare"
  | "doctor"
  | "bank"
  | "tax"
  | "insurance"
  | "transport"
  | "school"
  | "essentials";

export type TaskStatus = "not-started" | "in-progress" | "done" | "blocked";

export type Priority = "high" | "medium" | "low";

export interface RelocationTask {
  id: string;
  title: string;
  description: string;
  stage: TaskStage;
  category: TaskCategory;
  priority: Priority;
  status: TaskStatus;
  documents: string[];
  officialLink: string;
  daysFromArrival: number;
  blockedBy?: string;
  forFamily?: boolean;
  forCouple?: boolean;
  explainer: {
    what: string;
    why: string;
    docs: string;
    risks: string;
    next: string;
  };
  template?: {
    type: "landlord" | "employer" | "municipality" | "request" | "appointment";
    subject: string;
    body: string;
  };
}

export const STAGES: { id: TaskStage; label: string; sub: string }[] = [
  { id: "before-arrival", label: "Before Arrival", sub: "Plan & pack" },
  { id: "first-48-hours", label: "First 48 Hours", sub: "Land & settle" },
  { id: "first-week", label: "First Week", sub: "Register & connect" },
  { id: "first-month", label: "First Month", sub: "Build foundations" },
  { id: "first-90-days", label: "First 90 Days", sub: "Settle in fully" },
];

export const TASKS: RelocationTask[] = [
  {
    id: "passport-check",
    title: "Valid Passport Check",
    description: "Ensure your passport is valid for at least 6 months beyond entry.",
    stage: "before-arrival",
    category: "registration",
    priority: "high",
    status: "done",
    documents: ["Passport"],
    officialLink: "https://www.nyidanmark.dk/",
    daysFromArrival: -30,
    explainer: {
      what: "Your passport must remain valid for at least 6 months past your planned entry.",
      why: "Danish border control will deny entry on a soon-to-expire document.",
      docs: "Current passport, renewal receipt if applicable.",
      risks: "Denied boarding at your home airport, even with a visa.",
      next: "Photograph your passport and store a copy in cloud storage.",
    },
  },
  {
    id: "temp-housing",
    title: "Secure Temporary Housing",
    description:
      "Required for CPR registration. The lease must explicitly allow you to register your address.",
    stage: "before-arrival",
    category: "housing",
    priority: "high",
    status: "in-progress",
    documents: ["Rental Agreement", "Landlord Consent Form"],
    officialLink: "https://www.boligportal.dk/",
    daysFromArrival: -14,
    explainer: {
      what: "A short-term, registrable address you can use to apply for CPR.",
      why: "Without a registrable Danish address, you cannot get a CPR number — the key to everything.",
      docs: "Signed lease that explicitly mentions 'folkeregister registration'.",
      risks: "Many sublets and Airbnbs are NOT registrable. Confirm in writing.",
      next: "Ask the landlord to sign a registration consent letter.",
    },
    template: {
      type: "landlord",
      subject: "Confirmation of address registration (folkeregister)",
      body:
        "Hi [Landlord],\n\nThanks for accepting my tenancy at [Address]. To apply for my CPR number, I need written confirmation that I may register my address with the Danish folkeregister at this property.\n\nWould you reply confirming this is allowed under our agreement?\n\nThank you,\n[Your name]",
    },
  },
  {
    id: "employment-contract",
    title: "Sign Employment Contract",
    description: "Required for residence/work permits and bank account opening.",
    stage: "before-arrival",
    category: "registration",
    priority: "high",
    status: "done",
    documents: ["Employment Contract"],
    officialLink: "https://www.workindenmark.dk/",
    daysFromArrival: -45,
    explainer: {
      what: "A signed Danish employment contract stating role, salary, and start date.",
      why: "Banks, SIRI, and the municipality all ask for proof of employment.",
      docs: "PDF of signed contract with both signatures and date.",
      risks: "Verbal offers are not accepted by SIRI.",
      next: "Save the PDF and bring 2 printed copies.",
    },
  },
  {
    id: "international-house",
    title: "Book International House Appointment",
    description: "One-stop shop for CPR, tax card, health card and residence registration.",
    stage: "first-48-hours",
    category: "cpr",
    priority: "high",
    status: "not-started",
    documents: ["Passport", "Employment Contract", "Lease"],
    officialLink: "https://ihcph.kk.dk/",
    daysFromArrival: 1,
    explainer: {
      what: "International House Copenhagen handles registration for newcomers in one visit.",
      why: "Walking in without an appointment can mean a 3+ week wait.",
      docs: "Originals + copies of passport, contract, lease, and EU registration certificate if applicable.",
      risks: "Showing up with missing docs forces a rebooking.",
      next: "Book the earliest slot and add it to your calendar.",
    },
    template: {
      type: "appointment",
      subject: "International House appointment checklist",
      body:
        "Bring originals + 1 photocopy of:\n• Passport\n• Employment contract\n• Lease with registration clause\n• EU residence certificate (if EU/EEA)\n• Marriage certificate (if applicable)\n• Children's birth certificates (if applicable)",
    },
  },
  {
    id: "sim-card",
    title: "Get a Danish SIM Card",
    description: "Required for MitID activation and most appointment bookings.",
    stage: "first-48-hours",
    category: "essentials",
    priority: "medium",
    status: "not-started",
    documents: [],
    officialLink: "https://www.lebara.dk/",
    daysFromArrival: 1,
    explainer: {
      what: "A prepaid Danish mobile number.",
      why: "MitID requires a Danish phone number; many service portals SMS verification codes.",
      docs: "Passport for prepaid activation.",
      risks: "Some carriers require CPR — start with Lebara or Lyca which don't.",
      next: "Buy at the airport 7-Eleven or a kiosk in the city.",
    },
  },
  {
    id: "rejsekort",
    title: "Get a Rejsekort",
    description: "The universal transit card for buses, metro, and trains across Denmark.",
    stage: "first-48-hours",
    category: "transport",
    priority: "medium",
    status: "not-started",
    documents: [],
    officialLink: "https://www.rejsekort.dk/",
    daysFromArrival: 2,
    explainer: {
      what: "Tap-on/tap-off travel card for all Danish public transport.",
      why: "Single tickets are 2–3× the price of Rejsekort fares.",
      docs: "Just your address (for the registered version).",
      risks: "Anonymous cards work but can't be refunded if lost.",
      next: "Buy at any DSB station kiosk.",
    },
  },
  {
    id: "cpr-application",
    title: "Apply for CPR Number",
    description: "Your 10-digit Danish ID. Required for banking, healthcare, and contracts.",
    stage: "first-week",
    category: "cpr",
    priority: "high",
    status: "not-started",
    documents: ["Passport", "Lease", "Employment Contract"],
    officialLink: "https://lifeindenmark.borger.dk/",
    daysFromArrival: 3,
    blockedBy: "international-house",
    explainer: {
      what: "Central Person Register number — the key to Denmark.",
      why: "Without it you cannot open a bank account, get healthcare, or sign a phone plan.",
      docs: "Passport, lease, employment contract; spouse/children documents if applicable.",
      risks: "Wrong address format on lease delays issuance by weeks.",
      next: "Bring originals to your International House appointment.",
    },
  },
  {
    id: "mitid-setup",
    title: "Activate MitID",
    description: "Denmark's national digital identity. Locks unlock once you have CPR.",
    stage: "first-week",
    category: "mitid",
    priority: "high",
    status: "not-started",
    documents: ["CPR Letter", "Passport"],
    officialLink: "https://www.mitid.dk/",
    daysFromArrival: 7,
    blockedBy: "cpr-application",
    explainer: {
      what: "Your digital signature for tax, banking, healthcare, and government services.",
      why: "Without MitID you cannot log in to almost any Danish digital service.",
      docs: "CPR letter, passport, Danish phone number.",
      risks: "If you lose your activation code, you must visit a Borgerservice in person.",
      next: "Visit a Borgerservice with your CPR letter.",
    },
  },
  {
    id: "yellow-health-card",
    title: "Receive Yellow Health Card",
    description: "Arrives by mail 2–3 weeks after CPR registration. Choose a doctor.",
    stage: "first-week",
    category: "healthcare",
    priority: "medium",
    status: "not-started",
    documents: ["CPR Letter"],
    officialLink: "https://www.sundhed.dk/",
    daysFromArrival: 10,
    blockedBy: "cpr-application",
    explainer: {
      what: "Your sundhedskort grants free access to public healthcare.",
      why: "You'll need it at every doctor and hospital visit.",
      docs: "CPR letter, choice of GP (huslæge).",
      risks: "If you don't actively pick a GP, one is auto-assigned in your district.",
      next: "Pick a GP near home on sundhed.dk before the card is printed.",
    },
  },
  {
    id: "bank-account",
    title: "Open Bank Account (NemKonto)",
    description: "Required to receive salary and government payments.",
    stage: "first-week",
    category: "bank",
    priority: "high",
    status: "not-started",
    documents: ["CPR Letter", "Passport", "Employment Contract", "Lease"],
    officialLink: "https://www.danskebank.dk/",
    daysFromArrival: 10,
    blockedBy: "cpr-application",
    explainer: {
      what: "A regular bank account designated as your NemKonto for public payments.",
      why: "Salary and tax refunds can only be paid into a NemKonto.",
      docs: "CPR, passport, contract, lease. Some banks require an in-person meeting.",
      risks: "Some banks take 2+ weeks to open accounts for newcomers — book early.",
      next: "Book an appointment with Danske, Nordea, or Lunar.",
    },
    template: {
      type: "request",
      subject: "Account opening — newly arrived in Denmark",
      body:
        "Hi,\n\nI recently moved to Copenhagen and have my CPR number. I'd like to open a personal bank account (designated as my NemKonto).\n\nI can bring:\n• Passport\n• CPR letter\n• Employment contract\n• Lease\n\nWhat's your earliest available appointment?\n\nThanks,\n[Your name]",
    },
  },
  {
    id: "tax-card",
    title: "Set Up Tax Card (Skattekort)",
    description: "SKAT needs your tax preferences so your employer withholds correctly.",
    stage: "first-week",
    category: "tax",
    priority: "high",
    status: "not-started",
    documents: ["CPR", "Employment Contract"],
    officialLink: "https://www.skat.dk/",
    daysFromArrival: 7,
    blockedBy: "cpr-application",
    explainer: {
      what: "Your digital tax card tells your employer how much income tax to withhold.",
      why: "Without one, you are taxed at the highest rate (55%) by default.",
      docs: "CPR, salary details, expected income for the year.",
      risks: "Forgetting this is the most expensive newcomer mistake.",
      next: "Log in to skat.dk with MitID and complete the forskudsopgørelse.",
    },
  },
  {
    id: "doctor-registration",
    title: "Register with a GP",
    description: "Pick your huslæge (family doctor) for free healthcare visits.",
    stage: "first-month",
    category: "doctor",
    priority: "medium",
    status: "not-started",
    documents: ["Yellow Health Card"],
    officialLink: "https://www.borger.dk/",
    daysFromArrival: 20,
    explainer: {
      what: "Choosing a general practitioner near your home.",
      why: "All non-emergency care must go through your GP first.",
      docs: "Just your yellow health card.",
      risks: "Popular GPs fill up — book early.",
      next: "Search by postcode on sundhed.dk.",
    },
  },
  {
    id: "home-insurance",
    title: "Get Home Contents Insurance",
    description: "Indboforsikring covers theft, water damage, and personal liability.",
    stage: "first-month",
    category: "insurance",
    priority: "medium",
    status: "not-started",
    documents: ["CPR", "Lease"],
    officialLink: "https://www.tryg.dk/",
    daysFromArrival: 25,
    explainer: {
      what: "Standard renter's insurance bundled with personal liability.",
      why: "Liability cover is essential — Danish law makes you personally liable for damage.",
      docs: "CPR, lease, list of high-value items.",
      risks: "Cycling without liability cover can be financially ruinous.",
      next: "Get 3 quotes from Tryg, Alka, or Topdanmark.",
    },
  },
  {
    id: "daycare-waitlist",
    title: "Join Daycare Waitlist",
    description: "Apply for vuggestue or børnehave through Pladsanvisning.",
    stage: "first-month",
    category: "school",
    priority: "high",
    status: "not-started",
    documents: ["Children's CPR", "Parents' CPR"],
    officialLink: "https://pasningsanvisning.kk.dk/",
    daysFromArrival: 14,
    forFamily: true,
    explainer: {
      what: "Copenhagen's central daycare allocation system.",
      why: "Spots are scarce; the earlier you apply, the better your chances.",
      docs: "All family CPR numbers, MitID, preferences for area.",
      risks: "Waiting until after arrival can mean 3–6 month waits.",
      next: "Apply via Pladsanvisning the day you receive CPR.",
    },
    template: {
      type: "municipality",
      subject: "Daycare placement request — newly arrived family",
      body:
        "Hello Pladsanvisning,\n\nOur family recently moved to Copenhagen and we have CPR numbers for both parents and our child [Name, DOB].\n\nWe would like to apply for a daycare spot in [district]. Please confirm receipt and let us know expected wait times.\n\nKind regards,\n[Your name]",
    },
  },
  {
    id: "school-registration",
    title: "Register Child for School",
    description: "Public folkeskole or international/private school enrollment.",
    stage: "first-month",
    category: "school",
    priority: "high",
    status: "not-started",
    documents: ["Children's CPR", "Previous School Records"],
    officialLink: "https://www.kk.dk/skole",
    daysFromArrival: 21,
    forFamily: true,
    explainer: {
      what: "Enrolling your child in a Copenhagen primary or international school.",
      why: "School attendance is mandatory; placement takes time.",
      docs: "CPR, vaccination records, previous transcripts translated.",
      risks: "International schools (CIS, Rygaards) have multi-year waitlists.",
      next: "Contact 2–3 schools directly to confirm availability.",
    },
  },
  {
    id: "partner-jobseeker",
    title: "Partner: Register as Jobseeker",
    description: "Trailing partners can register with jobcentret for support.",
    stage: "first-month",
    category: "registration",
    priority: "medium",
    status: "not-started",
    documents: ["Partner CPR", "CV"],
    officialLink: "https://www.workindenmark.dk/",
    daysFromArrival: 30,
    forCouple: true,
    explainer: {
      what: "Free job-search support for the accompanying partner.",
      why: "Access to language courses, networking events, and CV reviews.",
      docs: "CPR, CV, education documents.",
      risks: "Skipping this means missing free Danish lessons (Lær Dansk).",
      next: "Book an intro session at your local jobcenter.",
    },
  },
  {
    id: "language-course",
    title: "Enroll in Free Danish Course",
    description: "Lær Dansk offers free Danish lessons to new arrivals.",
    stage: "first-90-days",
    category: "essentials",
    priority: "low",
    status: "not-started",
    documents: ["CPR"],
    officialLink: "https://www.studieskolen.dk/",
    daysFromArrival: 60,
    explainer: {
      what: "Three years of free Danish lessons subsidised by the municipality.",
      why: "Eligibility is time-limited — you must enroll within 6 months.",
      docs: "CPR, MitID.",
      risks: "Missing the 6-month window costs €1500+ to enroll privately.",
      next: "Apply via your municipality's portal.",
    },
  },
];

export interface SoftLandingItem {
  id: string;
  title: string;
  subtitle: string;
  category: "events" | "meetups" | "coworking" | "networking" | "sports" | "cafes" | "host" | "match" | "guide";
  audience: "individual" | "couple" | "family" | "all";
  image?: string;
  date?: string;
  attendees?: number;
  matchScore?: number;
}

export const SOFT_LANDING: SoftLandingItem[] = [
  {
    id: "sl-1",
    title: "The Sunday Coffee Program",
    subtitle: "Matched with a Danish family for a casual home dinner or coffee.",
    category: "host",
    audience: "all",
  },
  {
    id: "sl-2",
    title: "Newcomer Canal Tours",
    subtitle: "Weekly group tours led by locals who share hidden city gems.",
    category: "meetups",
    audience: "individual",
    date: "Sundays, 14:00",
    attendees: 18,
  },
  {
    id: "sl-3",
    title: "The Landing Pad",
    subtitle: "Dedicated desks at partner hubs for your first 30 days.",
    category: "coworking",
    audience: "individual",
  },
  {
    id: "sl-4",
    title: "InterNations Copenhagen Mixer",
    subtitle: "Monthly expat networking at Vesterbro Bryghus.",
    category: "networking",
    audience: "individual",
    date: "First Thursday • 19:00",
    attendees: 120,
  },
  {
    id: "sl-5",
    title: "Family Picnic at Frederiksberg Have",
    subtitle: "Casual meetup for newcomer families with kids 0–10.",
    category: "events",
    audience: "family",
    date: "Saturday • 11:00",
    attendees: 24,
  },
  {
    id: "sl-6",
    title: "The Jensens — Local Host Family",
    subtitle: "Vesterbro family with two kids (4 & 6). Expert on school registration.",
    category: "match",
    audience: "family",
    matchScore: 98,
  },
  {
    id: "sl-7",
    title: "Couple-to-Couple Match: The Larsens",
    subtitle: "Østerbro couple, both 30s, love hiking and board games.",
    category: "match",
    audience: "couple",
    matchScore: 92,
  },
  {
    id: "sl-8",
    title: "Solo-Friendly Café Guide",
    subtitle: "12 cafés where it's normal to spend an afternoon alone with a book.",
    category: "cafes",
    audience: "individual",
  },
  {
    id: "sl-9",
    title: "FCK Football Newcomer Section",
    subtitle: "Join other expats at home games in Parken.",
    category: "sports",
    audience: "all",
  },
  {
    id: "sl-10",
    title: "Børnehaven Survival Guide",
    subtitle: "How to navigate the Copenhagen daycare waitlist.",
    category: "guide",
    audience: "family",
  },
];

export const FIRST_WEEK_MISSIONS = [
  "Buy a rugbrød and try smørrebrød at a local café",
  "Take the harbour bus from Nyhavn to Refshaleøen",
  "Visit your local library — they offer free Danish conversation hours",
  "Bike to work once (rent a Donkey Republic bike)",
  "Say 'hej' to one neighbour",
  "Try a fredagsbar (Friday afterwork) at a local workplace",
  "Visit one of: Louisiana, SMK, or the Design Museum",
];

// Demo employer dashboard
export const EMPLOYER_STATS = {
  employees: 142,
  avgCompletion: 67,
  softLandingUsers: 89,
  riskFlags: 4,
  topStressors: [
    { label: "Finding English-speaking daycare", count: 38 },
    { label: "CPR appointment wait times", count: 31 },
    { label: "Opening a bank account", count: 22 },
    { label: "Understanding tax cards", count: 18 },
  ],
  blockedSteps: [
    { label: "MitID activation", percent: 34 },
    { label: "Bank account opening", percent: 28 },
    { label: "Daycare placement", percent: 21 },
  ],
  riskUsers: [
    { id: "EMP-0042", name: "Anonymized #0042", progress: 12, arrival: "21 days ago" },
    { id: "EMP-0098", name: "Anonymized #0098", progress: 18, arrival: "14 days ago" },
    { id: "EMP-0117", name: "Anonymized #0117", progress: 22, arrival: "30 days ago" },
    { id: "EMP-0203", name: "Anonymized #0203", progress: 25, arrival: "9 days ago" },
  ],
};

export type RelocType = "individual" | "couple" | "family";

export const DEMO_USER: {
  name: string;
  email: string;
  type: RelocType;
  origin: string;
  euStatus: "eu" | "non-eu";
  arrivalDate: string;
  reason: string;
  destination: string;
  partnerEmployed: boolean;
  children: string[];
} = {
  name: "Maya Okafor",
  email: "maya@example.com",
  type: "family",
  origin: "Nigeria",
  euStatus: "non-eu",
  arrivalDate: "2025-09-15",
  reason: "work",
  destination: "Copenhagen",
  partnerEmployed: false,
  children: ["4-6", "7-10"],
};

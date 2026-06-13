export type TaskStage =
  | "before-arrival"
  | "first-48-hours"
  | "first-week"
  | "first-month"
  | "first-90-days";

export type TaskCategory =
  | "identity"
  | "permits"
  | "housing"
  | "banking"
  | "tax"
  | "health"
  | "digital"
  | "education"
  | "social"
  | "essentials";

export type TaskStatus = "not-started" | "in-progress" | "done" | "blocked";

export type Priority = "high" | "medium" | "low";

export type AppliesTo =
  | "everyone"
  | "non-eu"
  | "eu"
  | "family"
  | "couple"
  | "students"
  | "employed";

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
  appliesTo: AppliesTo[];
  commonMistake: string;
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
  { id: "before-arrival", label: "Before Arrival", sub: "4–8 weeks before move" },
  { id: "first-48-hours", label: "First 48 Hours", sub: "Days 1–3 after arrival" },
  { id: "first-week", label: "First Week", sub: "Days 4–14" },
  { id: "first-month", label: "First Month", sub: "Weeks 3–4" },
  { id: "first-90-days", label: "First 90 Days", sub: "Months 2–3 and beyond" },
];

export const CATEGORY_LABELS: Record<TaskCategory, string> = {
  identity: "Identity & Registration",
  permits: "Residence & Work Permits",
  housing: "Housing",
  banking: "Banking & Finance",
  tax: "Tax",
  health: "Health",
  digital: "Digital Denmark",
  education: "Education & Childcare",
  social: "Social Security",
  essentials: "Essentials",
};

const OFFICIAL = {
  borger: "https://www.borger.dk/",
  lifeindk: "https://lifeindenmark.borger.dk/",
  siri: "https://www.nyidanmark.dk/",
  workindk: "https://www.workindenmark.dk/",
  ihcph: "https://ihcph.kk.dk/",
  mitid: "https://www.mitid.dk/",
  eboks: "https://www.e-boks.dk/",
  nemkonto: "https://www.nemkonto.dk/",
  skat: "https://www.skat.dk/",
  sundhed: "https://www.sundhed.dk/",
  sprog: "https://www.sprogcenter.dk/",
  kkschool: "https://www.kk.dk/skole",
  pladsanvisning: "https://pasningsanvisning.kk.dk/",
};

export const TASKS: RelocationTask[] = [
  // ---------- Stage 0: Before Arrival ----------
  {
    id: "gather-documents",
    title: "Gather required documents",
    description: "Passport, contract, lease, marriage and birth certificates with apostille if needed.",
    stage: "before-arrival",
    category: "identity",
    priority: "high",
    status: "in-progress",
    documents: ["Passport", "Employment contract", "Lease/host letter", "Marriage certificate", "Birth certificates"],
    officialLink: OFFICIAL.lifeindk,
    daysFromArrival: -42,
    appliesTo: ["everyone"],
    commonMistake: "Forgetting that marriage and birth certificates from non-EU countries need an apostille — and often a Danish translation — before Borgerservice will accept them.",
    explainer: {
      what: "A single packet of originals and copies you'll bring to every appointment in your first weeks.",
      why: "Borgerservice, SIRI and banks each ask for slightly different documents — having everything together avoids second visits.",
      docs: "Passport, signed employment contract, lease or host confirmation, marriage and birth certificates (apostilled).",
      risks: "Missing apostilles can delay CPR by weeks.",
      next: "Scan everything to cloud storage and bring two printed copies of each.",
    },
  },
  {
    id: "passport-photos",
    title: "Get passport photos taken",
    description: "Bring 2–4 recent biometric passport photos (35x45 mm).",
    stage: "before-arrival",
    category: "identity",
    priority: "medium",
    status: "not-started",
    documents: ["Passport photos"],
    officialLink: OFFICIAL.lifeindk,
    daysFromArrival: -30,
    appliesTo: ["everyone"],
    commonMistake: "Showing up with selfie-style photos that don't meet biometric specs — SIRI and Borgerservice will refuse them.",
    explainer: {
      what: "Standard biometric photos for residence permit, MitID activation, transit card.",
      why: "Several Danish authorities still require physical photos.",
      docs: "Photos taken to ICAO standards.",
      risks: "Non-compliant photos mean a return trip to the photo studio.",
      next: "Use a chemist or photo booth at home — much cheaper than in Denmark.",
    },
  },
  {
    id: "temp-housing",
    title: "Arrange temporary accommodation",
    description: "Lease must explicitly allow folkeregister registration — many sublets and Airbnbs don't.",
    stage: "before-arrival",
    category: "housing",
    priority: "high",
    status: "not-started",
    documents: ["Lease or host letter", "Landlord consent"],
    officialLink: "https://www.boligportal.dk/",
    daysFromArrival: -21,
    appliesTo: ["everyone"],
    commonMistake: "Booking an Airbnb without confirming you can register your address there — without a registrable address, you can't get a CPR number.",
    explainer: {
      what: "A short-term, registrable address you can use to apply for CPR.",
      why: "Without a registrable Danish address, you cannot get a CPR number — the key to everything.",
      docs: "Signed lease that explicitly mentions folkeregister registration.",
      risks: "Most Airbnbs are NOT registrable. Confirm in writing.",
      next: "Ask the landlord to sign a registration consent letter.",
    },
    template: {
      type: "landlord",
      subject: "Confirmation of address registration (folkeregister)",
      body: "Hi [Landlord],\n\nThanks for accepting my tenancy at [Address]. To apply for my CPR number, I need written confirmation that I may register my address with the Danish folkeregister at this property.\n\nWould you reply confirming this is allowed under our agreement?\n\nThank you,\n[Your name]",
    },
  },
  {
    id: "employer-cpr-support",
    title: "Contact employer about CPR support",
    description: "Ask whether HR provides a confirmation letter and has initiated SIRI if applicable.",
    stage: "before-arrival",
    category: "identity",
    priority: "medium",
    status: "not-started",
    documents: ["Employment contract"],
    officialLink: OFFICIAL.workindk,
    daysFromArrival: -28,
    appliesTo: ["employed"],
    commonMistake: "Assuming the employer will handle the CPR appointment for you — most don't, and waiting on them costs precious days.",
    explainer: {
      what: "A quick alignment with HR on what they file and what you file.",
      why: "Some employers initiate SIRI applications and provide letters that speed up Borgerservice.",
      docs: "Employment contract, CVR number.",
      risks: "Surprises on day 1 if employer assumed you'd do it all yourself.",
      next: "Send a short email asking the three key questions.",
    },
    template: {
      type: "employer",
      subject: "Support for CPR registration in Denmark",
      body: "Hi [Name],\n\nI'm getting ready to register my address and apply for my CPR number in Denmark. Could you let me know:\n\n1. Whether your company has an HR contact or relocation support for this process\n2. Whether you can provide a letter confirming my employment, start date and salary\n3. Whether my work permit application (if applicable) has been submitted via SIRI\n\nI'd like to complete registration within my first 3 days in Copenhagen.\n\nBest,\n[Your name]",
    },
  },

  // ---------- Stage 1: First 48 Hours ----------
  {
    id: "register-address",
    title: "Register your address at Borgerservice",
    description: "Legal requirement within 5 days of arrival. Book via borger.dk.",
    stage: "first-48-hours",
    category: "identity",
    priority: "high",
    status: "not-started",
    documents: ["Passport", "Lease/host letter"],
    officialLink: OFFICIAL.borger,
    daysFromArrival: 2,
    appliesTo: ["everyone"],
    commonMistake: "Walking in without an appointment and being told to come back in 3 weeks — always book online first.",
    explainer: {
      what: "The official act of telling Denmark where you live.",
      why: "It's a legal requirement and the prerequisite for CPR, banking and almost everything else.",
      docs: "Passport and signed lease or host confirmation letter.",
      risks: "Address typos on the lease delay CPR issuance by weeks.",
      next: "Book the earliest Borgerservice or International House slot.",
    },
    template: {
      type: "appointment",
      subject: "Borgerservice checklist",
      body: "Bring originals + 1 photocopy of:\n• Passport\n• Signed lease with registration clause\n• Employment contract or enrollment letter\n• EU residence certificate (if EU/EEA)\n• Marriage certificate (if applicable)\n• Children's birth certificates (if applicable)",
    },
  },
  {
    id: "cpr-application",
    title: "Apply for CPR number",
    description: "Your 10-digit Danish ID. Usually combined with address registration.",
    stage: "first-48-hours",
    category: "identity",
    priority: "high",
    status: "not-started",
    documents: ["Passport", "Lease", "Employment contract"],
    officialLink: OFFICIAL.lifeindk,
    daysFromArrival: 2,
    blockedBy: "register-address",
    appliesTo: ["everyone"],
    commonMistake: "Bringing only copies — Borgerservice insists on seeing originals of every document.",
    explainer: {
      what: "Central Person Register number — the key to Denmark.",
      why: "Without it you cannot open a bank account, get healthcare, or sign a phone plan.",
      docs: "Passport, lease, contract; spouse/children docs if applicable.",
      risks: "Wrong address format on the lease delays issuance.",
      next: "Bring originals to your International House appointment.",
    },
  },
  {
    id: "sim-card",
    title: "Get a Danish SIM card",
    description: "Required for MitID activation and most appointment bookings.",
    stage: "first-48-hours",
    category: "essentials",
    priority: "medium",
    status: "not-started",
    documents: ["Passport"],
    officialLink: "https://www.lebara.dk/",
    daysFromArrival: 1,
    appliesTo: ["everyone"],
    commonMistake: "Picking a carrier that requires a CPR number before you have one — start with Lebara or Lyca instead.",
    explainer: {
      what: "A prepaid Danish mobile number.",
      why: "MitID requires a Danish phone; many service portals SMS verification codes.",
      docs: "Passport for prepaid activation.",
      risks: "Some carriers require CPR up front.",
      next: "Buy at the airport 7-Eleven or any kiosk in the city.",
    },
  },

  // ---------- Stage 2: First Week ----------
  {
    id: "siri-permit",
    title: "Apply for residence / work permit",
    description: "Via SIRI on newtodenmark.dk. Ideally started before arrival.",
    stage: "first-week",
    category: "permits",
    priority: "high",
    status: "not-started",
    documents: ["Passport", "Employment contract", "CVR number", "Fee receipt"],
    officialLink: OFFICIAL.siri,
    daysFromArrival: 5,
    appliesTo: ["non-eu"],
    commonMistake: "Starting work before the permit is approved — it's illegal and risks the application.",
    explainer: {
      what: "SIRI's online application followed by an in-person biometrics appointment.",
      why: "Non-EU nationals cannot legally work or stay long-term without it.",
      docs: "Passport (6+ months validity), signed contract, employer CVR, fee receipt.",
      risks: "Working before approval can void the application.",
      next: "Confirm with HR whether the company has already filed for you.",
    },
  },
  {
    id: "eu-registration",
    title: "Register as EU citizen",
    description: "Within 3 months of arrival. SIRI office or Borgerservice.",
    stage: "first-week",
    category: "permits",
    priority: "high",
    status: "not-started",
    documents: ["EU passport or ID", "Proof of employment or self-sufficiency"],
    officialLink: OFFICIAL.siri,
    daysFromArrival: 7,
    appliesTo: ["eu"],
    commonMistake: "Missing the 3-month window — late registration can trigger fines and complicates CPR renewal.",
    explainer: {
      what: "EU residence certificate (registreringsbevis) for EU/EEA/Swiss nationals.",
      why: "Free movement still requires you to register if you stay over 3 months.",
      docs: "EU ID or passport, employment contract or proof of self-sufficiency.",
      risks: "Late registration complicates CPR renewal.",
      next: "Book an appointment at International House.",
    },
  },
  {
    id: "bank-account",
    title: "Open a Danish bank account",
    description: "Required to receive salary. Recommended: Lunar, Nordea, Danske Bank.",
    stage: "first-week",
    category: "banking",
    priority: "high",
    status: "not-started",
    documents: ["CPR letter", "Passport", "Employment contract", "Lease"],
    officialLink: "https://www.danskebank.dk/",
    daysFromArrival: 10,
    blockedBy: "cpr-application",
    appliesTo: ["everyone"],
    commonMistake: "Waiting until after the first payday to book the appointment — most banks take 1–3 weeks to onboard a newcomer.",
    explainer: {
      what: "A regular bank account designated as your NemKonto for public payments.",
      why: "Salary and tax refunds can only be paid into a Danish NemKonto.",
      docs: "CPR, passport, contract, lease. Some banks require an in-person meeting.",
      risks: "Some banks take 2+ weeks to open accounts for newcomers.",
      next: "Book with Danske, Nordea or Lunar this week.",
    },
    template: {
      type: "request",
      subject: "Account opening — newly arrived in Denmark",
      body: "Hi,\n\nI recently moved to Copenhagen and have my CPR number. I'd like to open a personal bank account (designated as my NemKonto).\n\nI can bring:\n• Passport\n• CPR letter\n• Employment contract\n• Lease\n\nWhat's your earliest available appointment?\n\nThanks,\n[Your name]",
    },
  },
  {
    id: "mitid-setup",
    title: "Activate MitID",
    description: "Denmark's national digital identity. Unlocks bank, tax, e-Boks.",
    stage: "first-week",
    category: "digital",
    priority: "high",
    status: "not-started",
    documents: ["CPR letter", "Passport"],
    officialLink: OFFICIAL.mitid,
    daysFromArrival: 7,
    blockedBy: "cpr-application",
    appliesTo: ["everyone"],
    commonMistake: "Losing the activation code — if you do, you must visit a Borgerservice in person to restart.",
    explainer: {
      what: "Your digital signature for tax, banking, healthcare and government services.",
      why: "Without MitID you cannot log into almost any Danish digital service.",
      docs: "CPR letter, passport, Danish phone number.",
      risks: "Lost activation code forces a Borgerservice visit.",
      next: "Activate at Borgerservice the same day you get CPR.",
    },
  },
  {
    id: "eboks-setup",
    title: "Set up e-Boks",
    description: "Secure digital post from government. Set up via e-boks.dk with MitID.",
    stage: "first-week",
    category: "digital",
    priority: "medium",
    status: "not-started",
    documents: ["MitID"],
    officialLink: OFFICIAL.eboks,
    daysFromArrival: 8,
    blockedBy: "mitid-setup",
    appliesTo: ["everyone"],
    commonMistake: "Treating e-Boks like spam and ignoring it — official letters with deadlines arrive here, not in your inbox.",
    explainer: {
      what: "Denmark's official secure digital mailbox.",
      why: "All official letters — tax, health, residence — arrive here.",
      docs: "MitID login.",
      risks: "Missed letters can mean missed deadlines.",
      next: "Enable email notifications inside e-Boks.",
    },
  },
  {
    id: "skat-contact",
    title: "Contact Skat about tax card",
    description: "Initiate your tax card so payroll can withhold correctly.",
    stage: "first-week",
    category: "tax",
    priority: "high",
    status: "not-started",
    documents: ["CPR", "Employment contract"],
    officialLink: OFFICIAL.skat,
    daysFromArrival: 9,
    blockedBy: "mitid-setup",
    appliesTo: ["employed"],
    commonMistake: "Not filing before payday — without a tax card, you're taxed at 55% by default and waiting months for the refund.",
    explainer: {
      what: "The first conversation with SKAT to set up your tax profile.",
      why: "Without a tax card, your employer withholds at the highest rate.",
      docs: "CPR, salary details, expected annual income.",
      risks: "Forgetting this is the most expensive newcomer mistake.",
      next: "Log in to skat.dk with MitID and start the forskudsopgørelse.",
    },
  },

  // ---------- Stage 3: First Month ----------
  {
    id: "nemkonto-activate",
    title: "Activate NemKonto",
    description: "Link your Danish bank account to your CPR via nemkonto.dk.",
    stage: "first-month",
    category: "banking",
    priority: "high",
    status: "not-started",
    documents: ["MitID", "Bank account number"],
    officialLink: OFFICIAL.nemkonto,
    daysFromArrival: 18,
    blockedBy: "bank-account",
    appliesTo: ["everyone"],
    commonMistake: "Assuming the bank does this automatically — most don't, and your first tax refund won't land until you do.",
    explainer: {
      what: "Linking your bank account to your CPR for public payments.",
      why: "Tax refunds, benefits and many salaries route through NemKonto.",
      docs: "MitID, account number, sort code.",
      risks: "Public payments will bounce or queue without this.",
      next: "Log in to nemkonto.dk with MitID — takes 10 minutes.",
    },
  },
  {
    id: "tax-card",
    title: "Set up tax card (Skattekort)",
    description: "Complete forskudsopgørelse on skat.dk before first payday.",
    stage: "first-month",
    category: "tax",
    priority: "high",
    status: "not-started",
    documents: ["CPR", "Employment contract", "MitID"],
    officialLink: OFFICIAL.skat,
    daysFromArrival: 20,
    blockedBy: "mitid-setup",
    appliesTo: ["employed"],
    commonMistake: "Underestimating annual income to lower withholding — you'll owe a large lump sum the following spring.",
    explainer: {
      what: "Your digital tax card tells your employer how much income tax to withhold.",
      why: "Without one, you are taxed at the highest rate (55%) by default.",
      docs: "CPR, salary details, expected income.",
      risks: "Forgetting this is the most expensive newcomer mistake.",
      next: "Log in to skat.dk and complete the forskudsopgørelse.",
    },
  },
  {
    id: "language-course",
    title: "Enroll in Danish language course",
    description: "Free Danskuddannelse. Non-EU under integration programme must enroll within 30 days.",
    stage: "first-month",
    category: "education",
    priority: "medium",
    status: "not-started",
    documents: ["CPR", "Residence documentation"],
    officialLink: OFFICIAL.sprog,
    daysFromArrival: 25,
    appliesTo: ["everyone"],
    commonMistake: "Missing the 6-month eligibility window — after that it costs €1,500+ at a private school.",
    explainer: {
      what: "Three years of free Danish lessons subsidised by the municipality.",
      why: "Required for non-EU on integration programmes; strongly recommended for EU.",
      docs: "CPR, MitID.",
      risks: "Missing the window means paying privately.",
      next: "Apply via your municipality's portal.",
    },
  },
  {
    id: "school-registration",
    title: "Register children for school",
    description: "Children have a legal right to school — register as soon as address is set.",
    stage: "first-month",
    category: "education",
    priority: "high",
    status: "not-started",
    documents: ["Children's CPR", "Proof of address", "Previous school records"],
    officialLink: OFFICIAL.kkschool,
    daysFromArrival: 21,
    forFamily: true,
    appliesTo: ["family"],
    commonMistake: "Only contacting international schools — most have multi-year waitlists; folkeskole placement is much faster.",
    explainer: {
      what: "Enrolling your child in a Copenhagen primary or international school.",
      why: "School attendance is mandatory; placement takes time.",
      docs: "CPR, vaccination records, previous transcripts translated.",
      risks: "International schools (CIS, Rygaards) have long waitlists.",
      next: "Contact 2–3 schools directly to confirm availability.",
    },
  },
  {
    id: "daycare-waitlist",
    title: "Join daycare waitlist",
    description: "Apply for vuggestue or børnehave through Pladsanvisning.",
    stage: "first-month",
    category: "education",
    priority: "high",
    status: "not-started",
    documents: ["Children's CPR", "Parents' CPR"],
    officialLink: OFFICIAL.pladsanvisning,
    daysFromArrival: 16,
    forFamily: true,
    appliesTo: ["family"],
    commonMistake: "Waiting until after arrival to apply — spots fill 3–6 months out and you'll be unable to return to work.",
    explainer: {
      what: "Copenhagen's central daycare allocation system.",
      why: "Spots are scarce; the earlier you apply, the better your chances.",
      docs: "All family CPR numbers, MitID, preferences for area.",
      risks: "Waiting can mean 3–6 month placement delays.",
      next: "Apply via Pladsanvisning the day you receive CPR.",
    },
    template: {
      type: "municipality",
      subject: "Daycare placement request — newly arrived family",
      body: "Hello Pladsanvisning,\n\nOur family recently moved to Copenhagen and we have CPR numbers for both parents and our child [Name, DOB].\n\nWe would like to apply for a daycare spot in [district]. Please confirm receipt and let us know expected wait times.\n\nKind regards,\n[Your name]",
    },
  },

  // ---------- Stage 4: First 90 Days ----------
  {
    id: "gp-register",
    title: "Register with a GP (fastlæge)",
    description: "Choose your family doctor on sundhed.dk after your yellow card arrives.",
    stage: "first-90-days",
    category: "health",
    priority: "medium",
    status: "not-started",
    documents: ["CPR", "Yellow card"],
    officialLink: OFFICIAL.sundhed,
    daysFromArrival: 45,
    appliesTo: ["everyone"],
    commonMistake: "Accepting the auto-assigned GP without checking distance and language — switching later takes 5 business days each time.",
    explainer: {
      what: "Choosing the general practitioner who becomes your primary doctor.",
      why: "Non-emergency care must be referred by your GP.",
      docs: "Yellow health card, MitID.",
      risks: "Popular English-speaking GPs fill up fast.",
      next: "Search by postcode on sundhed.dk.",
    },
  },
  {
    id: "pension-setup",
    title: "Set up pension contributions",
    description: "Confirm pension scheme and contribution rate with your employer.",
    stage: "first-90-days",
    category: "social",
    priority: "low",
    status: "not-started",
    documents: ["Employment contract"],
    officialLink: OFFICIAL.workindk,
    daysFromArrival: 60,
    appliesTo: ["employed"],
    commonMistake: "Not opting in within the trial period — many schemes lock contribution levels after 3 months.",
    explainer: {
      what: "Your employer-linked pension (often PFA, PensionDanmark or Velliv).",
      why: "Contribution decisions made early compound over your whole Danish career.",
      docs: "Contract, payroll details.",
      risks: "Default options may not match your tax situation.",
      next: "Book a 30-minute call with your pension provider.",
    },
  },
  {
    id: "akasse-join",
    title: "Join an A-kasse",
    description: "Voluntary unemployment fund. Pays up to 90% of salary for up to 2 years.",
    stage: "first-90-days",
    category: "social",
    priority: "low",
    status: "not-started",
    documents: ["CPR", "Employment contract"],
    officialLink: "https://www.akasser.dk/",
    daysFromArrival: 70,
    appliesTo: ["employed"],
    commonMistake: "Joining too late — benefits require 12 months of membership before you can claim.",
    explainer: {
      what: "Industry unemployment insurance fund.",
      why: "Without an A-kasse, you have no income protection if you lose your job.",
      docs: "CPR, employment contract.",
      risks: "12-month qualifying period delays your first claim.",
      next: "Pick an A-kasse aligned with your industry.",
    },
  },
  {
    id: "first-tax-return",
    title: "Submit first Danish tax return",
    description: "Årsopgørelse arrives in e-Boks in March. Review and adjust by 1 May.",
    stage: "first-90-days",
    category: "tax",
    priority: "medium",
    status: "not-started",
    documents: ["MitID", "Bank statements"],
    officialLink: OFFICIAL.skat,
    daysFromArrival: 180,
    appliesTo: ["everyone"],
    commonMistake: "Ignoring the pre-filled return — half of all newcomers are owed a refund or owe extra tax due to mid-year arrival.",
    explainer: {
      what: "Annual reconciliation of your Danish tax for the previous year.",
      why: "Catches over- or under-withholding from your first months.",
      docs: "MitID, bank statements, foreign income summary.",
      risks: "Missing the May deadline means interest on any underpayment.",
      next: "Review the årsopgørelse in e-Boks each spring.",
    },
  },
  {
    id: "permit-renewal",
    title: "Renew residence permit",
    description: "Track expiry and submit renewal at least 3 months before.",
    stage: "first-90-days",
    category: "permits",
    priority: "medium",
    status: "not-started",
    documents: ["Current permit", "Updated contract"],
    officialLink: OFFICIAL.siri,
    daysFromArrival: 330,
    appliesTo: ["non-eu"],
    commonMistake: "Letting the permit expire while waiting on SIRI — even a 1-day gap can cost your right to work.",
    explainer: {
      what: "Renewal of your SIRI-issued work or residence permit.",
      why: "Lapsed permits cancel your right to live and work in Denmark.",
      docs: "Current permit, updated employment contract, fee receipt.",
      risks: "SIRI processing can take 2–3 months — start early.",
      next: "Calendar a reminder 4 months before expiry.",
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

// ---------------- Document checklist ----------------

export type DocAudience =
  | "everyone"
  | "individual"
  | "couple"
  | "family"
  | "eu"
  | "non-eu"
  | "worker"
  | "student";

export type DocStatus = "missing" | "ready" | "uploaded" | "n/a";

export interface RelocationDocument {
  id: string;
  name: string;
  why: string;
  supportsTaskIds: string[];
  audience: DocAudience[];
  status: DocStatus;
}

export const DOCUMENTS: RelocationDocument[] = [
  {
    id: "passport",
    name: "Valid passport (or EU national ID)",
    why: "Primary ID for border control, Borgerservice, banks and SIRI. Must be valid 6+ months past entry.",
    supportsTaskIds: ["register-address", "cpr-application", "siri-permit", "eu-registration", "bank-account"],
    audience: ["everyone"],
    status: "uploaded",
  },
  {
    id: "passport-photos",
    name: "2–4 biometric passport photos (35×45 mm)",
    why: "Required by SIRI for permit cards and by some Borgerservice offices for MitID activation.",
    supportsTaskIds: ["siri-permit", "mitid-setup"],
    audience: ["everyone"],
    status: "missing",
  },
  {
    id: "employment-contract",
    name: "Signed employment contract",
    why: "Proof of income for CPR, SIRI, banks and SKAT. Banks won't open NemKonto without it.",
    supportsTaskIds: ["cpr-application", "siri-permit", "bank-account", "skat-contact", "tax-card"],
    audience: ["worker"],
    status: "uploaded",
  },
  {
    id: "enrollment-letter",
    name: "University enrollment letter",
    why: "Replaces the employment contract for students applying for CPR and residence registration.",
    supportsTaskIds: ["cpr-application", "register-address", "siri-permit"],
    audience: ["student"],
    status: "n/a",
  },
  {
    id: "lease",
    name: "Signed lease / host confirmation letter",
    why: "Proves a registrable Copenhagen address — the gateway to CPR.",
    supportsTaskIds: ["temp-housing", "register-address", "cpr-application", "bank-account"],
    audience: ["everyone"],
    status: "ready",
  },
  {
    id: "marriage-cert",
    name: "Marriage certificate (apostilled)",
    why: "Required to register a spouse and access family-reunification residence rights.",
    supportsTaskIds: ["register-address", "cpr-application", "siri-permit"],
    audience: ["couple", "family"],
    status: "missing",
  },
  {
    id: "birth-certs",
    name: "Children's birth certificates (apostilled)",
    why: "Required to register children at Borgerservice and to enroll them in school or daycare.",
    supportsTaskIds: ["cpr-application", "school-registration", "daycare-waitlist"],
    audience: ["family"],
    status: "missing",
  },
  {
    id: "prev-insurance",
    name: "Previous health insurance / coverage proof",
    why: "Bridges the 2–3 week gap before your yellow card arrives.",
    supportsTaskIds: ["register-address"],
    audience: ["everyone"],
    status: "ready",
  },
  {
    id: "work-permit-confirmation",
    name: "Work permit application confirmation",
    why: "Non-EU nationals need this if SIRI was filed before travel — speeds up Borgerservice.",
    supportsTaskIds: ["siri-permit", "cpr-application"],
    audience: ["non-eu", "worker"],
    status: "missing",
  },
  {
    id: "employer-cvr",
    name: "Employer's CVR number",
    why: "Mandatory field on every SIRI residence-permit application.",
    supportsTaskIds: ["siri-permit"],
    audience: ["non-eu", "worker"],
    status: "ready",
  },
  {
    id: "siri-fee-receipt",
    name: "SIRI application fee receipt",
    why: "SIRI will not start processing without proof of payment (DKK 3,545+).",
    supportsTaskIds: ["siri-permit"],
    audience: ["non-eu"],
    status: "missing",
  },
  {
    id: "eu-residence-cert",
    name: "EU residence proof (employment or self-sufficiency)",
    why: "EU nationals registering as residents must show employment, study or means.",
    supportsTaskIds: ["eu-registration"],
    audience: ["eu"],
    status: "n/a",
  },
  {
    id: "bank-iban",
    name: "Bank account number (IBAN)",
    why: "Needed to link NemKonto and to set up tax refunds with SKAT.",
    supportsTaskIds: ["nemkonto-activate", "tax-card"],
    audience: ["everyone"],
    status: "missing",
  },
  {
    id: "school-records",
    name: "Previous school report / transcripts",
    why: "Folkeskole and international schools use these for grade placement.",
    supportsTaskIds: ["school-registration"],
    audience: ["family"],
    status: "ready",
  },
  {
    id: "vaccination-record",
    name: "Children's vaccination record",
    why: "Recommended for school enrollment and your child's first GP visit.",
    supportsTaskIds: ["school-registration", "gp-register"],
    audience: ["family"],
    status: "ready",
  },
];

export const DOC_AUDIENCE_LABELS: Record<DocAudience, string> = {
  everyone: "Everyone",
  individual: "Individual",
  couple: "Couple",
  family: "Family",
  eu: "EU citizen",
  "non-eu": "Non-EU citizen",
  worker: "Worker",
  student: "Student",
};

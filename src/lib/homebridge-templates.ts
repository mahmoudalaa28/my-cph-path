export type RecipientType =
  | "employer-hr"
  | "landlord"
  | "municipality"
  | "bank"
  | "school"
  | "insurance";

export const RECIPIENT_LABELS: Record<RecipientType, string> = {
  "employer-hr": "Employer HR",
  landlord: "Landlord",
  municipality: "Municipality (Borgerservice)",
  bank: "Bank",
  school: "School / Daycare",
  insurance: "Insurance provider",
};

export interface MessageTemplate {
  id: string;
  title: string;
  recipient: RecipientType;
  relevantTaskId: string;
  relevantTaskTitle: string;
  subject: string;
  body: string;
}

// Placeholders supported: {{name}} {{city}} {{arrivalDate}} {{relocationType}}
// {{originCountry}} {{euStatus}} {{employer}} {{address}}

export const TEMPLATES: MessageTemplate[] = [
  {
    id: "tpl-hr-relocation-support",
    title: "Ask HR for relocation support",
    recipient: "employer-hr",
    relevantTaskId: "employer-coordination",
    relevantTaskTitle: "Coordinate paperwork with employer HR",
    subject: "Relocation support — paperwork for my move to {{city}}",
    body: `Hi HR team,

I'm preparing my move to {{city}} (arrival {{arrivalDate}}) as a {{relocationType}} relocator from {{originCountry}}.

To complete my Danish registration smoothly, could you confirm:

1. The employment letter I can use for CPR registration (start date, salary, position)
2. Whether the company will cover or sponsor my SIRI work permit fee (if applicable)
3. The official CVR number I should reference on forms
4. Any relocation contact or partner service available to me

I'd like to have everything ready before my appointment at Borgerservice in the first week.

Thank you,
{{name}}`,
  },
  {
    id: "tpl-hr-start-date",
    title: "Confirm start date and onboarding",
    recipient: "employer-hr",
    relevantTaskId: "employer-coordination",
    relevantTaskTitle: "Coordinate paperwork with employer HR",
    subject: "Confirming first day and onboarding logistics",
    body: `Hi,

Just confirming my arrival in {{city}} on {{arrivalDate}}. Could you share:

- The exact first-day location and time
- Anyone I should ask for on arrival
- Documents I should bring (passport, contract, residence permit decision)
- Whether IT setup happens day one

Looking forward to joining the team.

Best,
{{name}}`,
  },
  {
    id: "tpl-landlord-address-confirmation",
    title: "Request address registration confirmation",
    recipient: "landlord",
    relevantTaskId: "landlord-confirmation",
    relevantTaskTitle: "Get landlord confirmation for CPR registration",
    subject: "Written confirmation for folkeregister address registration",
    body: `Hi,

Thanks for accepting my tenancy at {{address}}, {{city}}. I'm arriving on {{arrivalDate}} and need to register the address with the Danish folkeregister to receive my CPR number.

Could you reply confirming, in writing, that I am permitted to register this address as my official residence under our agreement? A short email reply is enough — Borgerservice accepts it as proof.

Thanks very much,
{{name}}`,
  },
  {
    id: "tpl-landlord-keys-handover",
    title: "Arrange keys and move-in",
    recipient: "landlord",
    relevantTaskId: "housing-move-in",
    relevantTaskTitle: "Move-in and handover",
    subject: "Move-in plan for {{arrivalDate}}",
    body: `Hi,

I land in {{city}} on {{arrivalDate}}. To plan the handover, could you confirm:

- Where and when I pick up the keys
- Whether the move-in inspection happens together
- Meter readings (electricity, water, heating) at handover
- Wi‑Fi / utility provider already in place

Happy to share my flight details if helpful.

Best,
{{name}}`,
  },
  {
    id: "tpl-municipality-cpr-appointment",
    title: "Book CPR / address registration appointment",
    recipient: "municipality",
    relevantTaskId: "cpr-registration",
    relevantTaskTitle: "Register address and get CPR number",
    subject: "Appointment for address registration — new arrival",
    body: `Hello Borgerservice,

I recently arrived in {{city}} on {{arrivalDate}} as a {{relocationType}} relocator from {{originCountry}} ({{euStatus}}). I'd like to book an appointment to register my address and apply for my CPR number.

I will bring:
• Passport
• Signed lease and landlord confirmation letter
• Employment contract (if relevant)
• Marriage / birth certificates with apostille (if relevant)

Please let me know the earliest available slot.

Kind regards,
{{name}}`,
  },
  {
    id: "tpl-municipality-correction",
    title: "Correct registered details",
    recipient: "municipality",
    relevantTaskId: "cpr-registration",
    relevantTaskTitle: "Register address and get CPR number",
    subject: "Correction request — registered details",
    body: `Hello,

My name is {{name}}, CPR registered after arrival on {{arrivalDate}} at {{address}}, {{city}}.

I noticed the following detail is incorrect on my registration: [describe issue].

Could you advise the correct procedure to update it, and whether I need to come in person?

Thank you,
{{name}}`,
  },
  {
    id: "tpl-bank-account-appointment",
    title: "Request bank account appointment",
    recipient: "bank",
    relevantTaskId: "bank-account",
    relevantTaskTitle: "Open a Danish bank account & NemKonto",
    subject: "New resident — opening a personal account and NemKonto",
    body: `Hi,

I recently moved to {{city}} from {{originCountry}} (arrival {{arrivalDate}}) and have my CPR number. I'd like to open a personal account and designate it as my NemKonto.

I can bring:
• Passport
• CPR letter (yellow card)
• Employment contract
• Lease

What's the earliest appointment available, and is there anything else I should prepare in advance?

Thanks,
{{name}}`,
  },
  {
    id: "tpl-school-enrolment",
    title: "Enrol child in school / daycare",
    recipient: "school",
    relevantTaskId: "school-enrollment",
    relevantTaskTitle: "Enrol children in school or daycare",
    subject: "Enrolment enquiry — new family in {{city}}",
    body: `Hello,

Our family recently relocated to {{city}} on {{arrivalDate}} from {{originCountry}}. We have CPR numbers for the parents and our child(ren) [Name, date of birth].

We'd like to:
- Apply for a place starting [preferred date]
- Understand the current waiting time
- Confirm any documents you need (CPR letter, vaccination record, prior school records)

Could you let me know the next steps? Happy to come in for a visit.

Kind regards,
{{name}}`,
  },
  {
    id: "tpl-school-language-support",
    title: "Ask about Danish language support",
    recipient: "school",
    relevantTaskId: "school-enrollment",
    relevantTaskTitle: "Enrol children in school or daycare",
    subject: "Language support for international student",
    body: `Hello,

Our child will join your school after our move to {{city}} on {{arrivalDate}}. Their first language is not Danish.

Could you share:
- What Danish-as-a-second-language support is available
- Whether classroom instruction is in Danish or includes English
- Any onboarding meeting we should attend

Thank you,
{{name}}`,
  },
  {
    id: "tpl-insurance-contents",
    title: "Quote for home contents insurance",
    recipient: "insurance",
    relevantTaskId: "insurance-setup",
    relevantTaskTitle: "Set up health & home insurance",
    subject: "Contents insurance quote — new resident in {{city}}",
    body: `Hi,

I'm a new resident in {{city}} (arrived {{arrivalDate}}, {{relocationType}} from {{originCountry}}) and would like a quote for home contents insurance at {{address}}.

Apartment details:
- Size: [m²]
- Number of rooms: [n]
- Estimated value of contents: [DKK]
- Bicycle cover required: yes/no

Could you send a quote and confirm what's covered (theft, water damage, liability, travel)?

Thanks,
{{name}}`,
  },
  {
    id: "tpl-insurance-health-supplement",
    title: "Ask about supplementary health insurance",
    recipient: "insurance",
    relevantTaskId: "healthcare-setup",
    relevantTaskTitle: "Activate Danish healthcare (yellow card)",
    subject: "Supplementary private health cover — new arrival",
    body: `Hello,

I'm covered by the Danish public health system after registering on {{arrivalDate}} in {{city}}. I'd like a quote for supplementary private cover, especially for:

- Faster access to specialists
- Dental
- Physiotherapy

Could you outline plans suitable for a {{relocationType}} setup and any waiting periods?

Thank you,
{{name}}`,
  },
];

export interface TemplateProfile {
  name: string;
  city: string;
  arrivalDate: string;
  relocationType: string;
  originCountry: string;
  euStatus: string;
  employer: string;
  address: string;
}

export function fillTemplate(text: string, p: TemplateProfile): string {
  return text
    .replaceAll("{{name}}", p.name || "[Your name]")
    .replaceAll("{{city}}", p.city || "Copenhagen")
    .replaceAll("{{arrivalDate}}", p.arrivalDate || "[arrival date]")
    .replaceAll("{{relocationType}}", p.relocationType || "individual")
    .replaceAll("{{originCountry}}", p.originCountry || "[country]")
    .replaceAll("{{euStatus}}", p.euStatus || "")
    .replaceAll("{{employer}}", p.employer || "[employer]")
    .replaceAll("{{address}}", p.address || "[address]");
}

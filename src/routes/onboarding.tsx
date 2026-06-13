import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteNav, SiteFooter } from "@/components/site-nav";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Onboarding — HomeBridge" },
      { name: "description", content: "Tell us about your move so we can build your personalized Copenhagen relocation roadmap." },
    ],
  }),
  component: OnboardingPage,
});

type RelocType = "individual" | "couple" | "family";
type ChildAge = "under-6" | "6-15" | "16-18";
type StatusKey = "address-registration" | "cpr" | "healthcare" | "bank" | "tax";

interface ChildRow {
  id: string;
  age: ChildAge;
}

function OnboardingPage() {
  const navigate = useNavigate();

  // Core answers
  const [type, setType] = useState<RelocType>("individual");
  const [destination, setDestination] = useState("Copenhagen");
  const [reason, setReason] = useState("job-offer");
  const [origin, setOrigin] = useState("eu");
  const [originCountry, setOriginCountry] = useState("");
  const [job, setJob] = useState("signed-contract");
  const [cvr, setCvr] = useState("");
  const [housing, setHousing] = useState("confirmed");
  const [moveDate, setMoveDate] = useState("");
  const [danish, setDanish] = useState("none");

  // Status snapshot
  const [statuses, setStatuses] = useState<Record<StatusKey, "yes" | "in-progress" | "no">>({
    "address-registration": "no",
    cpr: "no",
    healthcare: "no",
    bank: "no",
    tax: "no",
  });
  const [stress, setStress] = useState("");

  // Family
  const [children, setChildren] = useState<ChildRow[]>([{ id: "c1", age: "under-6" }]);
  const [schoolNeeded, setSchoolNeeded] = useState("yes");

  // Couple
  const [partnerStatus, setPartnerStatus] = useState("accompanying");
  const [partnerDanish, setPartnerDanish] = useState("none");

  // Step list adapts to type
  const steps = useMemo<string[]>(() => {
    const base = ["intro", "who", "reason", "origin", "job", "housing", "date"];
    if (type === "family") base.push("children");
    if (type === "couple") base.push("partner");
    base.push("danish", "status", "stress");
    return base;
  }, [type]);

  const [stepIndex, setStepIndex] = useState(0);
  const currentStep = steps[Math.min(stepIndex, steps.length - 1)];
  const isIntro = currentStep === "intro";
  const questionIndex = Math.max(0, stepIndex - 1);
  const questionSteps = steps.length - 1;
  const stepNum = questionIndex + 1;
  const totalSteps = questionSteps;
  const pct = isIntro ? 0 : Math.round((stepNum / totalSteps) * 100);

  const setStatus = (k: StatusKey, v: "yes" | "in-progress" | "no") =>
    setStatuses((s) => ({ ...s, [k]: v }));

  const addChild = () =>
    setChildren((c) => [...c, { id: `c${c.length + 1}`, age: "under-6" }]);
  const removeChild = (id: string) =>
    setChildren((c) => (c.length > 1 ? c.filter((x) => x.id !== id) : c));
  const updateChild = (id: string, age: ChildAge) =>
    setChildren((c) => c.map((x) => (x.id === id ? { ...x, age } : x)));

  const next = () => setStepIndex((i) => Math.min(steps.length - 1, i + 1));
  const back = () => setStepIndex((i) => Math.max(0, i - 1));

  const finish = () => {
    // Persist answers for the dashboard to read
    if (typeof window !== "undefined") {
      const profile = {
        type,
        destination,
        reason,
        origin,
        originCountry,
        job,
        cvr,
        housing,
        moveDate,
        danish,
        statuses,
        stress,
        children: type === "family" ? children : [],
        schoolNeeded: type === "family" ? schoolNeeded : null,
        partnerStatus: type === "couple" ? partnerStatus : null,
        partnerDanish: type === "couple" ? partnerDanish : null,
        completedAt: new Date().toISOString(),
      };
      try {
        localStorage.setItem("homebridge.profile", JSON.stringify(profile));
      } catch {
        /* ignore */
      }
    }
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-canvas font-sans text-ink">
      <SiteNav />

      <main className="px-6 py-12 lg:py-20">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
              {isIntro ? "Onboarding" : `Onboarding · Step ${stepNum} of ${totalSteps}`}
            </span>
            {!isIntro && <span className="text-xs text-muted-foreground">{pct}%</span>}
          </div>
          <div className="h-1 bg-muted rounded-full overflow-hidden mb-10">
            <div
              className="h-full bg-accent transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className="bg-surface rounded-2xl ring-1 ring-border shadow-sm p-8 md:p-12">
            {currentStep === "intro" && (
              <div className="text-center">
                <h2 className="font-serif text-2xl md:text-3xl font-medium leading-tight">
                  Let's build your Copenhagen roadmap.
                </h2>
                <p className="mt-4 text-muted-foreground leading-relaxed max-w-md mx-auto">
                  We'll ask 10 quick questions. Your answers generate a task roadmap that is specific to your nationality, family situation, job status, and arrival date.
                </p>
                <button
                  onClick={next}
                  className="mt-8 bg-ink text-canvas px-6 py-3 rounded-lg font-medium ring-1 ring-ink hover:bg-ink/90 transition-colors"
                >
                  Start →
                </button>
              </div>
            )}

            {currentStep === "who" && (
              <Section
                title="Who are you moving as?"
                subtitle="So we tailor the right tasks — and skip anything that doesn't apply."
              >
                <Choices
                  value={type}
                  onChange={(v) => setType(v as RelocType)}
                  options={[
                    { v: "individual", l: "Individual", d: "Moving alone" },
                    { v: "couple", l: "Couple", d: "Together, no children" },
                    { v: "family", l: "Family", d: "With one or more children" },
                  ]}
                />
                <Field label="Destination city">
                  <input
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg ring-1 ring-border bg-canvas focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </Field>
              </Section>
            )}

            {currentStep === "reason" && (
              <Section
                title="What brings you to Copenhagen?"
                subtitle="This determines your residence path and which authorities you'll deal with."
              >
                <Choices
                  value={reason}
                  onChange={setReason}
                  options={[
                    { v: "job-offer", l: "Job offer / employment", d: "I have a contract" },
                    { v: "job-search", l: "Job search", d: "Looking once I arrive" },
                    { v: "student", l: "Student / academic" },
                    { v: "eu-freedom", l: "EU freedom of movement", d: "Self-employed or not yet working" },
                    { v: "accompanying", l: "Accompanying partner / spouse" },
                    { v: "entrepreneur", l: "Entrepreneur", d: "Starting a business" },
                  ]}
                />
              </Section>
            )}

            {currentStep === "origin" && (
              <Section
                title="Where are you coming from?"
                subtitle="Your citizenship region decides whether you need a work or residence permit."
              >
                <Choices
                  value={origin}
                  onChange={setOrigin}
                  options={[
                    { v: "eu", l: "EU / EEA / Switzerland", d: "No work permit needed" },
                    { v: "uk", l: "United Kingdom", d: "Post-Brexit rules apply" },
                    { v: "anglo", l: "USA / Canada / Australia / NZ" },
                    { v: "row", l: "Rest of world", d: "Non-EU" },
                  ]}
                />
                <Field label="Country of origin (optional)">
                  <input
                    value={originCountry}
                    onChange={(e) => setOriginCountry(e.target.value)}
                    placeholder="e.g. Brazil"
                    className="w-full px-4 py-3 rounded-lg ring-1 ring-border bg-canvas focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </Field>
              </Section>
            )}

            {currentStep === "job" && (
              <Section
                title="Do you have a job lined up?"
                subtitle="Used for SIRI, tax setup, and bank-account requirements."
              >
                <Choices
                  value={job}
                  onChange={setJob}
                  options={[
                    { v: "signed-contract", l: "Yes — signed contract" },
                    { v: "unsigned-offer", l: "Yes — not signed yet" },
                    { v: "job-hunting", l: "No — job hunting" },
                    { v: "freelance", l: "Self-employed / freelance" },
                    { v: "student", l: "I'm a student" },
                  ]}
                />
                {job === "signed-contract" && (
                  <Field label="Employer's CVR number (optional)">
                    <input
                      value={cvr}
                      onChange={(e) => setCvr(e.target.value)}
                      placeholder="e.g. 12345678"
                      className="w-full px-4 py-3 rounded-lg ring-1 ring-border bg-canvas focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </Field>
                )}
              </Section>
            )}

            {currentStep === "housing" && (
              <Section
                title="Do you have housing sorted?"
                subtitle="A registrable address is the gateway to CPR — and almost everything else."
              >
                <Choices
                  value={housing}
                  onChange={setHousing}
                  options={[
                    { v: "confirmed", l: "Yes — confirmed Copenhagen address" },
                    { v: "temporary", l: "Temporarily", d: "Hotel / Airbnb / friends" },
                    { v: "searching", l: "No — still searching" },
                  ]}
                />
              </Section>
            )}

            {currentStep === "date" && (
              <Section
                title="When is your move date?"
                subtitle="We use this to calculate every deadline on your roadmap."
              >
                <Field label="Planned arrival date">
                  <input
                    type="date"
                    value={moveDate}
                    onChange={(e) => setMoveDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg ring-1 ring-border bg-canvas focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </Field>
              </Section>
            )}

            {currentStep === "children" && (
              <Section
                title="Tell us about your children"
                subtitle="Used to surface daycare, school enrollment, and waitlist deadlines."
              >
                <div className="space-y-3">
                  {children.map((child, idx) => (
                    <div
                      key={child.id}
                      className="flex flex-wrap items-center gap-3 p-4 rounded-xl ring-1 ring-border bg-canvas"
                    >
                      <span className="text-sm font-medium w-16">Child {idx + 1}</span>
                      <div className="flex flex-wrap gap-2 flex-1">
                        {(
                          [
                            { v: "under-6", l: "Under 6" },
                            { v: "6-15", l: "6–15" },
                            { v: "16-18", l: "16–18" },
                          ] as { v: ChildAge; l: string }[]
                        ).map((o) => {
                          const active = child.age === o.v;
                          return (
                            <button
                              key={o.v}
                              type="button"
                              onClick={() => updateChild(child.id, o.v)}
                              className={`px-3 py-1.5 rounded-full text-sm ring-1 ${
                                active
                                  ? "bg-ink text-canvas ring-ink"
                                  : "bg-canvas ring-border hover:bg-muted"
                              }`}
                            >
                              {o.l}
                            </button>
                          );
                        })}
                      </div>
                      {children.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeChild(child.id)}
                          className="text-xs text-muted-foreground hover:text-ink"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addChild}
                    className="text-sm font-medium text-accent hover:underline"
                  >
                    + Add another child
                  </button>
                </div>

                <Choices
                  label="Do they need school or daycare enrollment?"
                  value={schoolNeeded}
                  onChange={setSchoolNeeded}
                  options={[
                    { v: "yes", l: "Yes" },
                    { v: "no", l: "No" },
                    { v: "unsure", l: "Not sure" },
                  ]}
                />
              </Section>
            )}

            {currentStep === "partner" && (
              <Section
                title="About your partner"
                subtitle="Trailing partners often qualify for free jobseeker support and language classes."
              >
                <Choices
                  label="Partner's situation"
                  value={partnerStatus}
                  onChange={setPartnerStatus}
                  options={[
                    { v: "employed", l: "Employed", d: "Has a Danish job" },
                    { v: "job-hunting", l: "Job hunting" },
                    { v: "student", l: "Student" },
                    { v: "accompanying", l: "Accompanying", d: "Not working yet" },
                  ]}
                />
                <Choices
                  label="Partner's Danish level"
                  value={partnerDanish}
                  onChange={setPartnerDanish}
                  options={[
                    { v: "none", l: "None" },
                    { v: "some", l: "A little" },
                    { v: "comfortable", l: "Comfortable" },
                  ]}
                />
              </Section>
            )}

            {currentStep === "danish" && (
              <Section
                title="What's your current Danish?"
                subtitle="If you're eligible, we'll flag the free Lær Dansk course window."
              >
                <Choices
                  value={danish}
                  onChange={setDanish}
                  options={[
                    { v: "none", l: "I don't speak any Danish" },
                    { v: "some", l: "I know a little" },
                    { v: "comfortable", l: "I'm reasonably comfortable" },
                  ]}
                />
              </Section>
            )}

            {currentStep === "status" && (
              <Section
                title="Where are you right now?"
                subtitle="A quick snapshot of what's done, in progress, or not started."
              >
                <StatusRow
                  label="Address registration (folkeregister)"
                  value={statuses["address-registration"]}
                  onChange={(v) => setStatus("address-registration", v)}
                />
                <StatusRow
                  label="CPR number"
                  value={statuses.cpr}
                  onChange={(v) => setStatus("cpr", v)}
                />
                <StatusRow
                  label="Healthcare / yellow card"
                  value={statuses.healthcare}
                  onChange={(v) => setStatus("healthcare", v)}
                />
                <StatusRow
                  label="Danish bank account (NemKonto)"
                  value={statuses.bank}
                  onChange={(v) => setStatus("bank", v)}
                />
                <StatusRow
                  label="Tax card (SKAT)"
                  value={statuses.tax}
                  onChange={(v) => setStatus("tax", v)}
                />
              </Section>
            )}

            {currentStep === "stress" && (
              <Section
                title="What's your biggest relocation stress?"
                subtitle="Optional — helps us prioritize what to surface first on your dashboard."
              >
                <Field label="In one or two sentences">
                  <textarea
                    value={stress}
                    onChange={(e) => setStress(e.target.value)}
                    rows={4}
                    placeholder="e.g. Getting CPR before my contract start so I can be paid on time."
                    className="w-full px-4 py-3 rounded-lg ring-1 ring-border bg-canvas focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                  />
                </Field>
              </Section>
            )}

            <div className="mt-10 flex items-center justify-between pt-6 border-t border-border">
              <button
                onClick={back}
                disabled={stepIndex === 0}
                className="text-sm font-medium text-muted-foreground hover:text-ink disabled:opacity-40"
              >
                ← Back
              </button>

              {stepIndex < steps.length - 1 ? (
                <button
                  onClick={next}
                  className="bg-ink text-canvas px-6 py-2.5 rounded-lg font-medium hover:bg-ink/90 text-sm"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={finish}
                  className="bg-ink text-canvas px-6 py-2.5 rounded-lg font-medium hover:bg-ink/90 text-sm"
                >
                  Build my roadmap →
                </button>
              )}
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Already set up?{" "}
            <Link to="/dashboard" className="text-accent font-medium hover:underline">
              Go to your dashboard
            </Link>
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl md:text-3xl font-medium leading-tight">{title}</h2>
        <p className="mt-2 text-muted-foreground">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      {children}
    </div>
  );
}

function Choices({
  label,
  value,
  onChange,
  options,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  options: { v: string; l: string; d?: string }[];
}) {
  return (
    <div>
      {label && <label className="block text-sm font-medium mb-2">{label}</label>}
      <div className="grid sm:grid-cols-2 gap-2">
        {options.map((o) => {
          const active = value === o.v;
          return (
            <button
              key={o.v}
              type="button"
              onClick={() => onChange(o.v)}
              className={`text-left p-4 rounded-xl ring-1 transition-all ${
                active ? "bg-ink text-canvas ring-ink" : "bg-canvas ring-border hover:ring-ink/30"
              }`}
            >
              <p className="text-sm font-medium">{o.l}</p>
              {o.d && (
                <p
                  className={`text-xs mt-0.5 ${
                    active ? "text-canvas/60" : "text-muted-foreground"
                  }`}
                >
                  {o.d}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StatusRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: "yes" | "in-progress" | "no";
  onChange: (v: "yes" | "in-progress" | "no") => void;
}) {
  const opts: { v: "yes" | "in-progress" | "no"; l: string }[] = [
    { v: "yes", l: "Done" },
    { v: "in-progress", l: "In progress" },
    { v: "no", l: "Not yet" },
  ];
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-border last:border-b-0">
      <span className="text-sm">{label}</span>
      <div className="flex gap-1">
        {opts.map((o) => (
          <button
            key={o.v}
            type="button"
            onClick={() => onChange(o.v)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium ring-1 transition-colors ${
              value === o.v
                ? "bg-ink text-canvas ring-ink"
                : "bg-canvas ring-border hover:bg-muted"
            }`}
          >
            {o.l}
          </button>
        ))}
      </div>
    </div>
  );
}

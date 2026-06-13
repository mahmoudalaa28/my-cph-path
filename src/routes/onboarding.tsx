import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
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

function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [type, setType] = useState<RelocType>("individual");
  const [origin, setOrigin] = useState("");
  const [eu, setEu] = useState<"eu" | "non-eu">("non-eu");
  const [arrival, setArrival] = useState("");
  const [reason, setReason] = useState("work");
  const [stress, setStress] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [social, setSocial] = useState("medium");

  const totalSteps = 4;
  const pct = Math.round((step / totalSteps) * 100);

  const toggleInterest = (i: string) =>
    setInterests((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));

  return (
    <div className="min-h-screen bg-canvas font-sans text-ink">
      <SiteNav />

      <main className="px-6 py-12 lg:py-20">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
              Onboarding · Step {step} of {totalSteps}
            </span>
            <span className="text-xs text-muted-foreground">{pct}%</span>
          </div>
          <div className="h-1 bg-muted rounded-full overflow-hidden mb-10">
            <div className="h-full bg-accent transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>

          <div className="bg-surface rounded-2xl ring-1 ring-border shadow-sm p-8 md:p-12">
            {step === 1 && (
              <Section title="Who's moving?" subtitle="So we can tailor the right tasks for you.">
                <Choices
                  value={type}
                  onChange={(v) => setType(v as RelocType)}
                  options={[
                    { v: "individual", l: "Just me", d: "Solo relocator" },
                    { v: "couple", l: "Me and my partner", d: "Couple" },
                    { v: "family", l: "My family", d: "With children" },
                  ]}
                />

                <Field label="Destination city">
                  <input
                    className="w-full px-4 py-3 rounded-lg ring-1 ring-border bg-canvas focus:outline-none focus:ring-2 focus:ring-accent"
                    defaultValue="Copenhagen"
                  />
                </Field>

                <Field label="Country of origin">
                  <input
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="e.g. Brazil"
                    className="w-full px-4 py-3 rounded-lg ring-1 ring-border bg-canvas focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </Field>

                <Choices
                  label="Citizenship"
                  value={eu}
                  onChange={(v) => setEu(v as "eu" | "non-eu")}
                  options={[
                    { v: "eu", l: "EU / EEA / Swiss", d: "Simpler residence path" },
                    { v: "non-eu", l: "Non-EU", d: "Likely needs SIRI permit" },
                  ]}
                />
              </Section>
            )}

            {step === 2 && (
              <Section title="When and why?" subtitle="Timing changes which deadlines we surface first.">
                <Field label="Arrival date">
                  <input
                    type="date"
                    value={arrival}
                    onChange={(e) => setArrival(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg ring-1 ring-border bg-canvas focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </Field>
                <Choices
                  label="Reason for moving"
                  value={reason}
                  onChange={setReason}
                  options={[
                    { v: "work", l: "Work" },
                    { v: "study", l: "Study" },
                    { v: "family", l: "Family reunification" },
                    { v: "freelance", l: "Freelance / self-employed" },
                    { v: "other", l: "Other" },
                  ]}
                />
              </Section>
            )}

            {step === 3 && (
              <Section title="Your starting point" subtitle="Don't worry if everything is 'not yet'. That's normal.">
                <YesNo label="Housing arranged?" />
                <YesNo label="Employment / study confirmed?" />
                <YesNo label="Local address registration done?" />
                <YesNo label="CPR / local ID issued?" />
                <YesNo label="Bank account opened?" />
                <YesNo label="Healthcare set up?" />
                <YesNo label="Tax card configured?" />
                <YesNo label="Insurance in place?" />

                {type === "family" && (
                  <div className="mt-6 pt-6 border-t border-border space-y-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Family</p>
                    <Field label="Children's age ranges">
                      <div className="flex flex-wrap gap-2">
                        {["0-3", "4-6", "7-10", "11-15", "16+"].map((a) => (
                          <button
                            key={a}
                            type="button"
                            className="px-3 py-1.5 rounded-full ring-1 ring-border text-sm hover:bg-muted"
                          >
                            {a}
                          </button>
                        ))}
                      </div>
                    </Field>
                    <YesNo label="School or daycare needed?" />
                    <YesNo label="School/daycare placement secured?" />
                  </div>
                )}

                {type === "couple" && (
                  <div className="mt-6 pt-6 border-t border-border space-y-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Partner</p>
                    <YesNo label="Is your partner employed or studying?" />
                    <YesNo label="Does your partner want integration support?" />
                  </div>
                )}
              </Section>
            )}

            {step === 4 && (
              <Section title="The human side" subtitle="Optional — helps us tailor your soft-landing support.">
                <Field label="What's your biggest relocation stress?">
                  <textarea
                    value={stress}
                    onChange={(e) => setStress(e.target.value)}
                    rows={3}
                    placeholder="e.g. Finding an English-speaking daycare on time."
                    className="w-full px-4 py-3 rounded-lg ring-1 ring-border bg-canvas focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                  />
                </Field>

                <Field label="Interests">
                  <div className="flex flex-wrap gap-2">
                    {["Cycling", "Design", "Tech", "Food", "Music", "Running", "Art", "Family activities", "Language exchange"].map((i) => {
                      const active = interests.includes(i);
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => toggleInterest(i)}
                          className={`px-3 py-1.5 rounded-full text-sm ring-1 transition-colors ${
                            active
                              ? "bg-ink text-canvas ring-ink"
                              : "bg-canvas text-ink ring-border hover:bg-muted"
                          }`}
                        >
                          {i}
                        </button>
                      );
                    })}
                  </div>
                </Field>

                <Choices
                  label="Social support preference"
                  value={social}
                  onChange={setSocial}
                  options={[
                    { v: "low", l: "Low", d: "I'll find my own way" },
                    { v: "medium", l: "Medium", d: "A few intros would help" },
                    { v: "high", l: "High", d: "Connect me as much as possible" },
                  ]}
                />
              </Section>
            )}

            <div className="mt-10 flex items-center justify-between pt-6 border-t border-border">
              <button
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
                className="text-sm font-medium text-muted-foreground hover:text-ink disabled:opacity-40"
              >
                ← Back
              </button>

              {step < totalSteps ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="bg-ink text-canvas px-6 py-2.5 rounded-lg font-medium hover:bg-ink/90 text-sm"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={() => navigate({ to: "/dashboard" })}
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
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
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
                <p className={`text-xs mt-0.5 ${active ? "text-canvas/60" : "text-muted-foreground"}`}>
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

function YesNo({ label }: { label: string }) {
  const [v, setV] = useState<"yes" | "no" | "">("");
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <span className="text-sm">{label}</span>
      <div className="flex gap-1">
        {(["yes", "no"] as const).map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => setV(opt)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium ring-1 transition-colors ${
              v === opt ? "bg-ink text-canvas ring-ink" : "bg-canvas ring-border hover:bg-muted"
            }`}
          >
            {opt === "yes" ? "Yes" : "Not yet"}
          </button>
        ))}
      </div>
    </div>
  );
}

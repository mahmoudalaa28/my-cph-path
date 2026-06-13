import { createFileRoute } from "@tanstack/react-router";
import { SiteNav, SiteFooter } from "@/components/site-nav";
import { EMPLOYER_STATS } from "@/lib/homebridge-data";

export const Route = createFileRoute("/employer")({
  head: () => ({
    meta: [
      { title: "Employer dashboard — HomeBridge" },
      { name: "description", content: "Anonymized insights into your team's Copenhagen relocation health for HR teams and relocation agencies." },
    ],
  }),
  component: EmployerPage,
});

function EmployerPage() {
  const s = EMPLOYER_STATS;
  return (
    <div className="min-h-screen bg-canvas font-sans text-ink">
      <SiteNav />
      <main className="px-6 py-12 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
            Employer dashboard · Acme Nordic ApS
          </span>
          <h1 className="mt-2 font-serif text-3xl md:text-4xl font-medium leading-tight">
            Your team's relocation health.
          </h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Anonymized insights only — never individual answers, never documents.
          </p>

          {/* KPI cards */}
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Kpi n={s.employees.toString()} l="Relocated employees" />
            <Kpi n={`${s.avgCompletion}%`} l="Avg admin completion" accent />
            <Kpi n={s.softLandingUsers.toString()} l="Using soft landing" />
            <Kpi n={s.riskFlags.toString()} l="Risk flags" warn />
          </div>

          <div className="mt-8 grid lg:grid-cols-2 gap-6">
            {/* Top stressors */}
            <Panel title="Top stressors">
              <ul className="space-y-4">
                {s.topStressors.map((row) => {
                  const max = s.topStressors[0].count;
                  const pct = Math.round((row.count / max) * 100);
                  return (
                    <li key={row.label}>
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <span>{row.label}</span>
                        <span className="text-muted-foreground">{row.count}</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Panel>

            <Panel title="Most common blocked steps">
              <ul className="space-y-4">
                {s.blockedSteps.map((row) => (
                  <li key={row.label}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span>{row.label}</span>
                      <span className="text-muted-foreground">{row.percent}% blocked</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-ink/70" style={{ width: `${row.percent}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>

          {/* Risk users */}
          <Panel className="mt-6" title="Risk flags · Low progress, > 7 days since arrival">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground border-b border-border">
                    <th className="py-3 pr-4">User</th>
                    <th className="py-3 pr-4">Arrival</th>
                    <th className="py-3 pr-4">Progress</th>
                    <th className="py-3 pr-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {s.riskUsers.map((u) => (
                    <tr key={u.id} className="border-b border-border last:border-0">
                      <td className="py-4 pr-4 font-medium">{u.name}</td>
                      <td className="py-4 pr-4 text-muted-foreground">{u.arrival}</td>
                      <td className="py-4 pr-4 w-1/3">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500" style={{ width: `${u.progress}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground w-10 text-right">{u.progress}%</span>
                        </div>
                      </td>
                      <td className="py-4 pr-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-amber-50 text-amber-700 ring-1 ring-amber-200/50">
                          At risk
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <div className="mt-12 rounded-2xl bg-ink text-canvas p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-6 justify-between">
            <div className="max-w-lg">
              <h3 className="font-serif text-2xl">Want custom onboarding templates?</h3>
              <p className="mt-2 text-canvas/70 text-sm">
                Pilot teams can co-design tasks, official links, and country-specific
                onboarding for your incoming hires.
              </p>
            </div>
            <button className="bg-canvas text-ink px-6 py-3 rounded-lg font-medium hover:bg-canvas/90">
              Request pilot access
            </button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Kpi({ n, l, accent, warn }: { n: string; l: string; accent?: boolean; warn?: boolean }) {
  return (
    <div className="bg-surface p-6 rounded-2xl ring-1 ring-border shadow-sm">
      <p className={`font-serif text-3xl ${accent ? "text-accent" : warn ? "text-amber-700" : "text-ink"}`}>
        {n}
      </p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{l}</p>
    </div>
  );
}

function Panel({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-surface p-6 rounded-2xl ring-1 ring-border shadow-sm ${className}`}>
      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-5">
        {title}
      </h3>
      {children}
    </div>
  );
}

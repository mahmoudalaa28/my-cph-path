import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav, SiteFooter } from "@/components/site-nav";
import { TASKS } from "@/lib/homebridge-data";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — HomeBridge" },
      { name: "description", content: "HomeBridge admin panel: manage tasks, host profiles, events, intro requests, and employers." },
    ],
  }),
  component: AdminPage,
});

const TABS = [
  "Tasks",
  "Host profiles",
  "Intro requests",
  "Events",
  "Employers",
  "User progress",
] as const;

const HOST_PROFILES = [
  { id: "h1", name: "The Jensen Family", area: "Vesterbro", type: "Family host", status: "pending" },
  { id: "h2", name: "The Larsens", area: "Østerbro", type: "Couple host", status: "approved" },
  { id: "h3", name: "Sofia Møller", area: "Nørrebro", type: "Solo host", status: "pending" },
];
const INTRO_REQUESTS = [
  { id: "r1", from: "Maya O.", to: "The Jensen Family", date: "2 days ago", status: "pending" },
  { id: "r2", from: "Daniel R.", to: "Sofia Møller", date: "5 days ago", status: "approved" },
];
const EVENTS = [
  { id: "e1", title: "Frederiksberg Family Picnic", date: "Sat 14:00", spots: "24 / 30" },
  { id: "e2", title: "Newcomer Canal Tour", date: "Sun 11:00", spots: "18 / 25" },
  { id: "e3", title: "InterNations Mixer", date: "Thu 19:00", spots: "120 / 150" },
];
const EMPLOYERS = [
  { id: "c1", name: "Acme Nordic ApS", users: 142, plan: "Pilot" },
  { id: "c2", name: "Maersk Tech", users: 38, plan: "Enterprise" },
  { id: "c3", name: "Nordic Studio", users: 12, plan: "Starter" },
];
const USER_PROGRESS = [
  { id: "u1", name: "Anonymized #0042", progress: 12, type: "Family" },
  { id: "u2", name: "Anonymized #0098", progress: 64, type: "Individual" },
  { id: "u3", name: "Anonymized #0117", progress: 88, type: "Couple" },
];

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const ADMIN_PW = "homebridge2025";

  if (!authed) {
    return (
      <div className="min-h-screen bg-canvas font-sans text-ink flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h1 className="font-serif text-2xl font-medium mb-6">Admin access</h1>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg ring-1 ring-border mb-4"
            onKeyDown={(e) => e.key === "Enter" && pw === ADMIN_PW && setAuthed(true)}
          />
          <button
            onClick={() => pw === ADMIN_PW && setAuthed(true)}
            className="w-full bg-ink text-canvas px-4 py-3 rounded-lg font-medium"
          >
            Log in
          </button>
        </div>
      </div>
    );
  }

  const [tab, setTab] = useState<(typeof TABS)[number]>("Tasks");

  return (
    <div className="min-h-screen bg-canvas font-sans text-ink">
      <SiteNav />
      <main className="px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
            Admin
          </span>
          <h1 className="mt-2 font-serif text-3xl md:text-4xl font-medium leading-tight">
            Operate the bridge.
          </h1>

          <div className="mt-8 border-b border-border flex gap-1 overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  tab === t
                    ? "border-ink text-ink"
                    : "border-transparent text-muted-foreground hover:text-ink"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="mt-8">
            {tab === "Tasks" && (
              <Panel
                title="Relocation tasks"
                action={
                  <button className="bg-ink text-canvas text-sm font-medium px-4 py-2 rounded-lg hover:bg-ink/90">
                    + Add task
                  </button>
                }
              >
                <Table
                  cols={["Title", "Stage", "Category", "Priority", "Official link"]}
                  rows={TASKS.map((t) => [
                    t.title,
                    t.stage,
                    t.category,
                    t.priority,
                    <a
                      key="l"
                      href={t.officialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline truncate inline-block max-w-xs"
                    >
                      {t.officialLink}
                    </a>,
                  ])}
                />
              </Panel>
            )}

            {tab === "Host profiles" && (
              <Panel title="Host & match profiles awaiting approval">
                <Table
                  cols={["Name", "Area", "Type", "Status", "Actions"]}
                  rows={HOST_PROFILES.map((h) => [
                    h.name,
                    h.area,
                    h.type,
                    <StatusPill key="s" status={h.status} />,
                    <div key="a" className="flex gap-2">
                      <button className="text-xs px-2 py-1 bg-ink text-canvas rounded-md">Approve</button>
                      <button className="text-xs px-2 py-1 ring-1 ring-border rounded-md">Reject</button>
                    </div>,
                  ])}
                />
              </Panel>
            )}

            {tab === "Intro requests" && (
              <Panel title="Intro requests">
                <Table
                  cols={["From", "To", "When", "Status"]}
                  rows={INTRO_REQUESTS.map((r) => [
                    r.from,
                    r.to,
                    r.date,
                    <StatusPill key="s" status={r.status} />,
                  ])}
                />
              </Panel>
            )}

            {tab === "Events" && (
              <Panel
                title="Events"
                action={
                  <button className="bg-ink text-canvas text-sm font-medium px-4 py-2 rounded-lg hover:bg-ink/90">
                    + Add event
                  </button>
                }
              >
                <Table
                  cols={["Title", "When", "Capacity"]}
                  rows={EVENTS.map((e) => [e.title, e.date, e.spots])}
                />
              </Panel>
            )}

            {tab === "Employers" && (
              <Panel title="Employer accounts">
                <Table
                  cols={["Company", "Users", "Plan"]}
                  rows={EMPLOYERS.map((c) => [c.name, c.users.toString(), c.plan])}
                />
              </Panel>
            )}

            {tab === "User progress" && (
              <Panel title="User progress (anonymized)">
                <Table
                  cols={["User", "Type", "Progress"]}
                  rows={USER_PROGRESS.map((u) => [
                    u.name,
                    u.type,
                    <div key="p" className="flex items-center gap-3 min-w-[160px]">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-accent" style={{ width: `${u.progress}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground w-10 text-right">{u.progress}%</span>
                    </div>,
                  ])}
                />
              </Panel>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Panel({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="bg-surface p-6 rounded-2xl ring-1 ring-border shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          {title}
        </h3>
        {action}
      </div>
      {children}
    </div>
  );
}

function Table({ cols, rows }: { cols: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground border-b border-border">
            {cols.map((c) => (
              <th key={c} className="py-3 pr-4">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border last:border-0">
              {row.map((cell, j) => (
                <td key={j} className="py-3 pr-4 align-middle">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700 ring-amber-200/50",
    approved: "bg-emerald-50 text-emerald-700 ring-emerald-200/50",
    rejected: "bg-stone-100 text-stone-600 ring-stone-200",
  };
  return (
    <span
      className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ring-1 ${map[status] ?? map.pending}`}
    >
      {status}
    </span>
  );
}

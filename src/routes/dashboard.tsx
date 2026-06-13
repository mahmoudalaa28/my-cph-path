import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteNav, SiteFooter } from "@/components/site-nav";
import { TASKS, STAGES, DEMO_USER, FIRST_WEEK_MISSIONS, DOCUMENTS, DOC_AUDIENCE_LABELS, SOFT_LANDING } from "@/lib/homebridge-data";
import type { RelocationTask, TaskStatus, RelocationDocument, DocStatus, DocAudience } from "@/lib/homebridge-data";
import { ExplainerDialog } from "@/components/task-explainer";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your roadmap — HomeBridge" },
      { name: "description", content: "Your personalized Copenhagen relocation roadmap, progress, and urgent next steps." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const [profile, setProfile] = useState(DEMO_USER);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("homebridge.profile");
      if (raw) setProfile({ ...DEMO_USER, ...JSON.parse(raw) });
    } catch {}
  }, []);

  const [statuses, setStatuses] = useState<Record<string, TaskStatus>>(
    Object.fromEntries(TASKS.map((t) => [t.id, t.status]))
  );
  const [docStatuses, setDocStatuses] = useState<Record<string, DocStatus>>(
    Object.fromEntries(DOCUMENTS.map((d) => [d.id, d.status]))
  );
  const [explainTask, setExplainTask] = useState<{ task: RelocationTask; tab: "explain" | "template" } | null>(null);

  const visible = useMemo(
    () =>
      TASKS.filter((t) => {
        if (t.forFamily && profile.type !== "family") return false;
        if (t.forCouple && profile.type !== "couple") return false;
        return true;
      }),
    [profile.type]
  );

  const visibleDocs = useMemo(() => {
    const type = profile.type;
    const eu = profile.euStatus;
    return DOCUMENTS.filter((d) =>
      d.audience.some(
        (a) =>
          a === "everyone" ||
          a === type ||
          (a === "eu" && eu === "eu") ||
          (a === "non-eu" && eu === "non-eu") ||
          a === "worker" ||
          (a === "student" && profile.reason === "student")
      )
    );
  }, [profile.type, profile.euStatus, profile.reason]);

  const done = visible.filter((t) => statuses[t.id] === "done").length;
  const pct = Math.round((done / visible.length) * 100);

  const urgent = visible
    .filter((t) => statuses[t.id] !== "done" && t.priority === "high")
    .slice(0, 3);

  const blocked = visible.filter(
    (t) => t.blockedBy && statuses[t.blockedBy] !== "done" && statuses[t.id] !== "done"
  );

  // High-priority tasks blocked by missing documents
  const docBlocked = useMemo(() => {
    return visible
      .filter((t) => t.priority === "high" && statuses[t.id] !== "done")
      .map((t) => {
        const missing = visibleDocs.filter(
          (d) =>
            d.supportsTaskIds.includes(t.id) &&
            (docStatuses[d.id] === "missing" || !docStatuses[d.id])
        );
        return { task: t, missing };
      })
      .filter((x) => x.missing.length > 0);
  }, [visible, visibleDocs, statuses, docStatuses]);

  const upcoming = visible
    .filter((t) => statuses[t.id] !== "done")
    .sort((a, b) => a.daysFromArrival - b.daysFromArrival)
    .slice(0, 5);

  const docCounts = useMemo(() => {
    const c = { missing: 0, ready: 0, uploaded: 0, "n/a": 0 } as Record<DocStatus, number>;
    visibleDocs.forEach((d) => {
      c[docStatuses[d.id] ?? "missing"]++;
    });
    return c;
  }, [visibleDocs, docStatuses]);

  const setStatus = (id: string, s: TaskStatus) =>
    setStatuses((prev) => ({ ...prev, [id]: s }));
  const setDocStatus = (id: string, s: DocStatus) =>
    setDocStatuses((prev) => ({ ...prev, [id]: s }));

  return (
    <div className="min-h-screen bg-canvas font-sans text-ink">
      <SiteNav />

      <main className="px-6 py-12">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-10">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
              Your roadmap
            </span>
            <h1 className="mt-2 font-serif text-3xl md:text-4xl font-medium leading-tight">
              Welcome, {profile.name.split(" ")[0]}.
            </h1>
            <p className="mt-2 text-muted-foreground">
              {profile.type === "family" ? "Family of four" : profile.type} · {profile.origin} →{" "}
              {profile.destination} · Arrived {new Date(profile.arrivalDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left column */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="bg-surface p-7 rounded-2xl ring-1 ring-border shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Overall progress</h3>
                  <span className="font-serif text-3xl font-semibold text-accent">{pct}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {done} of {visible.length} tasks complete
                </p>
              </div>

              <Card title="Urgent next steps">
                <ul className="space-y-3">
                  {urgent.map((t) => (
                    <li key={t.id}>
                      <button
                        onClick={() => setExplainTask({ task: t, tab: "explain" })}
                        className="w-full text-left p-3 -mx-2 rounded-xl hover:bg-muted transition-colors flex items-start gap-3"
                      >
                        <span className="mt-1 size-2 rounded-full bg-accent shrink-0" />
                        <span>
                          <p className="text-sm font-medium">{t.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {t.daysFromArrival <= 0 ? "Now" : `Day ${t.daysFromArrival}`}
                          </p>
                        </span>
                      </button>
                    </li>
                  ))}
                  {urgent.length === 0 && (
                    <li className="text-sm text-muted-foreground">All caught up — nice work.</li>
                  )}
                </ul>
              </Card>

              <Card title="Documents at a glance">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <DocStat label="Missing" value={docCounts.missing} tone="warn" />
                  <DocStat label="Ready" value={docCounts.ready} tone="ok" />
                  <DocStat label="Uploaded" value={docCounts.uploaded} tone="ok" />
                  <DocStat label="Not applicable" value={docCounts["n/a"]} tone="mute" />
                </div>
                <a
                  href="#documents-needed"
                  className="mt-4 inline-flex text-xs font-semibold text-accent hover:underline"
                >
                  Manage documents →
                </a>
              </Card>

              <Card title="Upcoming deadlines">
                <ul className="space-y-2.5">
                  {upcoming.map((t) => (
                    <li key={t.id} className="flex items-center justify-between text-sm">
                      <span className="truncate pr-3">{t.title}</span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        Day {t.daysFromArrival}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>

              {blocked.length > 0 && (
                <Card title="Blocked tasks">
                  <ul className="space-y-2">
                    {blocked.map((t) => (
                      <li
                        key={t.id}
                        className="text-sm p-3 rounded-xl bg-stone-50 ring-1 ring-border"
                      >
                        <p className="font-medium">{t.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Waiting on:{" "}
                          {TASKS.find((x) => x.id === t.blockedBy)?.title}
                        </p>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </aside>

            {/* Right column - Stage list */}
            <section className="lg:col-span-8 space-y-6">
              {docBlocked.length > 0 && (
                <div className="rounded-2xl ring-1 ring-amber-300/60 bg-amber-50 p-5">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 size-6 grid place-items-center rounded-full bg-amber-200 text-amber-900 text-xs font-bold">
                      !
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-amber-900">
                        {docBlocked.length} high-priority{" "}
                        {docBlocked.length === 1 ? "task is" : "tasks are"} blocked by missing documents
                      </p>
                      <ul className="mt-2 space-y-1.5 text-xs text-amber-900/90">
                        {docBlocked.slice(0, 4).map(({ task, missing }) => (
                          <li key={task.id}>
                            <span className="font-medium">{task.title}</span> — needs{" "}
                            {missing.map((m) => m.name).join(", ")}
                          </li>
                        ))}
                      </ul>
                      <a
                        href="#documents-needed"
                        className="mt-3 inline-flex text-xs font-semibold text-amber-900 underline underline-offset-2"
                      >
                        Resolve in Documents Needed →
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {STAGES.map((stage) => {
                const stageTasks = visible.filter((t) => t.stage === stage.id);
                if (stageTasks.length === 0) return null;
                const stageDone = stageTasks.filter((t) => statuses[t.id] === "done").length;
                return (
                  <div
                    key={stage.id}
                    className="bg-surface rounded-2xl ring-1 ring-border shadow-sm overflow-hidden"
                  >
                    <div className="p-5 border-b border-border flex items-center justify-between">
                      <div>
                        <h2 className="font-medium">{stage.label}</h2>
                        <p className="text-xs text-muted-foreground">{stage.sub}</p>
                      </div>
                      <span className="text-xs font-medium px-2 py-1 bg-muted text-muted-foreground rounded-md">
                        {stageDone}/{stageTasks.length}
                      </span>
                    </div>
                    <ul>
                      {stageTasks.map((t) => (
                        <TaskRow
                          key={t.id}
                          task={t}
                          status={statuses[t.id]}
                          isBlocked={
                            !!(t.blockedBy && statuses[t.blockedBy] !== "done")
                          }
                          onStatus={(s) => setStatus(t.id, s)}
                        />
                      ))}
                    </ul>
                  </div>
                );
              })}

              {/* Documents Needed */}
              <div
                id="documents-needed"
                className="bg-surface rounded-2xl ring-1 ring-border shadow-sm overflow-hidden scroll-mt-20"
              >
                <div className="p-5 border-b border-border flex items-center justify-between">
                  <div>
                    <h2 className="font-medium">Documents needed</h2>
                    <p className="text-xs text-muted-foreground">
                      Track every document your tasks depend on.
                    </p>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-muted text-muted-foreground rounded-md">
                    {docCounts.uploaded + docCounts.ready}/{visibleDocs.length}
                  </span>
                </div>
                <ul>
                  {visibleDocs.map((d) => (
                    <DocumentRow
                      key={d.id}
                      doc={d}
                      status={docStatuses[d.id] ?? "missing"}
                      onStatus={(s) => setDocStatus(d.id, s)}
                      supportsTitles={d.supportsTaskIds
                        .map((id) => TASKS.find((t) => t.id === id)?.title)
                        .filter(Boolean) as string[]}
                    />
                  ))}
                </ul>
              </div>



              {/* First week missions (soft landing teaser) */}
              <div className="bg-stone-50 rounded-2xl ring-1 ring-border p-7">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                  First 7 days · Social missions
                </span>
                <h3 className="mt-2 font-serif text-xl font-medium">
                  Small wins that make Copenhagen feel like home.
                </h3>
                <ul className="mt-5 grid sm:grid-cols-2 gap-2">
                  {FIRST_WEEK_MISSIONS.map((m, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className="mt-0.5 size-5 grid place-items-center rounded-md bg-surface ring-1 ring-border text-[10px] font-bold text-accent">
                        {i + 1}
                      </span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/soft-landing"
                  className="mt-6 inline-flex text-sm font-semibold text-accent hover:translate-x-1 transition-transform"
                >
                  Explore soft-landing support →
                </Link>
              </div>
            </section>
          </div>

          <FeelAtHomeSection type={profile.type} />
        </div>
      </main>

      {explainTask && (
        <ExplainerDialog
          task={explainTask}
          open={!!explainTask}
          onClose={() => setExplainTask(null)}
        />
      )}

      <SiteFooter />
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface p-6 rounded-2xl ring-1 ring-border shadow-sm">
      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
}

function TaskRow({
  task,
  status,
  isBlocked,
  onStatus,
}: {
  task: RelocationTask;
  status: TaskStatus;
  isBlocked: boolean;
  onStatus: (s: TaskStatus) => void;
}) {
  const done = status === "done";
  const [expanded, setExpanded] = useState(false);
  return (
    <li
      className={`border-b border-border last:border-0 transition-colors ${
        done ? "opacity-60" : "hover:bg-stone-50/60"
      }`}
    >
      <div className="p-5 flex gap-5 items-start">
        <button
          onClick={() => onStatus(done ? "not-started" : "done")}
          className={`mt-1 size-5 shrink-0 rounded grid place-items-center transition-colors ${
            done
              ? "bg-ink text-canvas"
              : "border border-stone-300 hover:border-ink"
          }`}
          aria-label={done ? "Mark not done" : "Mark done"}
        >
          {done && <span className="text-[10px] font-bold">✓</span>}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2 mb-1">
            <h4 className={`font-medium ${done ? "line-through" : ""}`}>{task.title}</h4>
            <PriorityPill p={task.priority} />
            {isBlocked && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-stone-100 text-muted-foreground ring-1 ring-border">
                Blocked
              </span>
            )}
            {status === "in-progress" && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent-soft text-accent ring-1 ring-accent/20">
                In progress
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground max-w-[58ch]">{task.description}</p>

          <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
            {task.appliesTo.map((a) => (
              <span
                key={a}
                className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 ring-1 ring-border capitalize"
              >
                {a.replace("-", " ")}
              </span>
            ))}
          </div>

          {task.commonMistake && (
            <p className="mt-3 text-xs text-amber-800 bg-amber-50 ring-1 ring-amber-200/60 rounded-md px-3 py-2 max-w-[60ch]">
              <span className="font-semibold">Common mistake — </span>
              {task.commonMistake}
            </p>
          )}

          {task.documents.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {task.documents.map((d) => (
                <span
                  key={d}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <span className="size-4 grid place-items-center rounded bg-stone-100 text-[8px] font-bold">
                    DOC
                  </span>
                  {d}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setExpanded((e) => !e)}
              className="text-xs font-medium px-3 py-1.5 bg-ink text-canvas rounded-md hover:bg-ink/90"
            >
              {expanded ? "Hide explanation" : "Explain this step simply"}
            </button>
            {task.template && (
              <button
                className="text-xs font-medium px-3 py-1.5 bg-surface ring-1 ring-border rounded-md hover:bg-muted"
              >
                Open template
              </button>
            )}
            <a
              href={task.officialLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium px-3 py-1.5 text-muted-foreground hover:text-ink"
            >
              Official link ↗
            </a>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="px-5 pb-5">
          <div className="rounded-xl ring-1 ring-border bg-stone-50/80 p-5 space-y-4">
            <ExplainerItem
              label="What this step means"
              text={task.explainer.what}
            />
            <ExplainerItem
              label="Why it matters"
              text={task.explainer.why}
            />
            <ExplainerItem
              label="Documents you'll need"
              text={task.explainer.docs}
            />
            <ExplainerItem
              label="What can go wrong"
              text={task.explainer.risks}
              tone="warn"
            />
            <ExplainerItem
              label="What to do next"
              text={task.explainer.next}
              tone="action"
            />
          </div>
        </div>
      )}
    </li>
  );
}

function ExplainerItem({
  label,
  text,
  tone = "neutral",
}: {
  label: string;
  text: string;
  tone?: "neutral" | "warn" | "action";
}) {
  const toneClasses = {
    neutral: "text-ink",
    warn: "text-amber-800",
    action: "text-accent font-medium",
  };
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-1">
        {label}
      </p>
      <p className={`text-sm leading-relaxed ${toneClasses[tone]}`}>{text}</p>
    </div>
  );
}

function PriorityPill({ p }: { p: "high" | "medium" | "low" }) {
  const map = {
    high: "bg-amber-50 text-amber-700 ring-amber-200/50",
    medium: "bg-stone-100 text-stone-700 ring-stone-200",
    low: "bg-stone-50 text-stone-500 ring-stone-200",
  };
  return (
    <span
      className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ring-1 ${map[p]}`}
    >
      {p}
    </span>
  );
}

function DocStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "ok" | "warn" | "mute";
}) {
  const tones = {
    ok: "bg-emerald-50 text-emerald-800 ring-emerald-200/60",
    warn: "bg-amber-50 text-amber-800 ring-amber-200/60",
    mute: "bg-stone-50 text-stone-600 ring-border",
  };
  return (
    <div className={`rounded-lg px-3 py-2 ring-1 ${tones[tone]}`}>
      <p className="font-serif text-xl leading-none">{value}</p>
      <p className="text-[10px] uppercase tracking-wider mt-1 font-semibold">{label}</p>
    </div>
  );
}

function DocumentRow({
  doc,
  status,
  onStatus,
  supportsTitles,
}: {
  doc: RelocationDocument;
  status: DocStatus;
  onStatus: (s: DocStatus) => void;
  supportsTitles: string[];
}) {
  const tone =
    status === "missing"
      ? "text-amber-700"
      : status === "ready"
      ? "text-emerald-700"
      : status === "uploaded"
      ? "text-emerald-800"
      : "text-muted-foreground";
  const opts: { v: DocStatus; l: string }[] = [
    { v: "missing", l: "Missing" },
    { v: "ready", l: "Ready" },
    { v: "uploaded", l: "Uploaded" },
    { v: "n/a", l: "N/A" },
  ];
  return (
    <li className="p-5 border-b border-border last:border-0">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2">
            <h4 className="font-medium text-sm">{doc.name}</h4>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${tone}`}>
              {opts.find((o) => o.v === status)?.l}
            </span>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground max-w-[60ch]">{doc.why}</p>
          {supportsTitles.length > 0 && (
            <p className="mt-2 text-[11px] text-muted-foreground">
              <span className="font-semibold text-ink/70">Supports:</span>{" "}
              {supportsTitles.join(" · ")}
            </p>
          )}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {doc.audience.map((a: DocAudience) => (
              <span
                key={a}
                className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 ring-1 ring-border"
              >
                {DOC_AUDIENCE_LABELS[a]}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-1 shrink-0">
          {opts.map((o) => (
            <button
              key={o.v}
              type="button"
              onClick={() => onStatus(o.v)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium ring-1 transition-colors ${
                status === o.v
                  ? "bg-ink text-canvas ring-ink"
                  : "bg-canvas ring-border hover:bg-muted"
              }`}
            >
              {o.l}
            </button>
          ))}
        </div>
      </div>
    </li>
  );
}

// ---------------- Feel at home faster (secondary) ----------------

const CATEGORY_HEADINGS: Record<string, string> = {
  events: "Curated events",
  meetups: "Meetups",
  coworking: "Coworking & coffee",
  networking: "Professional networking",
  sports: "Sports & social clubs",
  cafes: "Solo-friendly places",
  host: "Local host families",
  match: "Intro suggestions",
  guide: "Local guides",
};

function FeelAtHomeSection({ type }: { type: "individual" | "couple" | "family" }) {
  const items = SOFT_LANDING.filter((s) => s.audience === type || s.audience === "all");

  // For couples/families, surface intro matches as a separate highlighted strip.
  const intros = items.filter((i) => i.category === "match");
  const rest = items.filter((i) => i.category !== "match");

  const introHeading =
    type === "couple"
      ? "Couple-to-couple intros"
      : type === "family"
      ? "Family-to-family intros"
      : null;

  const missions =
    type === "individual"
      ? FIRST_WEEK_MISSIONS.slice(0, 6)
      : type === "couple"
      ? [
          "Bike together along the harbour from Nyhavn to Refshaleøen",
          "Try a 'hygge' Friday dinner at a local wine bar",
          "Visit Louisiana on a Sunday afternoon",
          "Join a couples' run with NBRO (free, every Tuesday)",
        ]
      : [
          "Saturday morning at a local playground in your district",
          "Library story-time in English (most kommune libraries host one)",
          "Picnic at Frederiksberg Have with other newcomer families",
          "Sunday open-house at a folkeskole in your area",
        ];

  return (
    <section className="mt-16">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
            Secondary · Soft landing
          </span>
          <h2 className="mt-2 font-serif text-2xl md:text-3xl font-medium leading-tight">
            Feel at home faster
          </h2>
          <p className="mt-2 text-muted-foreground max-w-2xl text-sm">
            Optional, low-pressure ways to start belonging. Your bureaucracy roadmap above
            stays the priority — this is here when you have a quiet hour.
          </p>
        </div>
        <Link
          to="/soft-landing"
          className="text-sm font-medium text-accent hover:text-accent/80"
        >
          See all soft-landing support →
        </Link>
      </div>

      {introHeading && intros.length > 0 && (
        <div className="mt-8 rounded-2xl ring-1 ring-border bg-accent-soft/40 p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h3 className="font-serif text-lg font-medium">{introHeading}</h3>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
              Optional
            </span>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {intros.map((it) => (
              <article
                key={it.id}
                className="bg-surface rounded-xl ring-1 ring-border p-5 flex flex-col"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                    {CATEGORY_HEADINGS[it.category] ?? it.category}
                  </span>
                  {it.matchScore && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/50">
                      {it.matchScore}% match
                    </span>
                  )}
                </div>
                <h4 className="mt-2 font-serif text-base font-semibold leading-snug">
                  {it.title}
                </h4>
                <p className="mt-1 text-sm text-muted-foreground flex-1">{it.subtitle}</p>
                <button className="mt-4 self-start bg-ink text-canvas text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-ink/90">
                  Request intro
                </button>
              </article>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rest.map((it) => (
          <article
            key={it.id}
            className="bg-surface rounded-2xl ring-1 ring-border p-5 flex flex-col shadow-sm"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
              {CATEGORY_HEADINGS[it.category] ?? it.category}
            </span>
            <h3 className="mt-2 font-serif text-base font-semibold leading-snug">
              {it.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground flex-1">{it.subtitle}</p>
            {(it.date || it.attendees) && (
              <p className="mt-3 text-xs text-muted-foreground">
                {it.date}
                {it.date && it.attendees ? " · " : ""}
                {it.attendees ? `${it.attendees} going` : ""}
              </p>
            )}
          </article>
        ))}
      </div>

      <div className="mt-8 rounded-2xl ring-1 ring-border bg-stone-50 p-6 md:p-8">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
              First-week missions
            </span>
            <h3 className="mt-2 font-serif text-xl font-medium">
              {type === "family"
                ? "Tiny family rituals to settle in"
                : type === "couple"
                ? "Small moments, together"
                : "Low-pressure social missions"}
            </h3>
          </div>
          <span className="text-xs text-muted-foreground">Pick one a day · no pressure</span>
        </div>
        <ul className="mt-5 grid sm:grid-cols-2 gap-3">
          {missions.map((m, i) => (
            <li
              key={i}
              className="flex items-start gap-3 p-4 bg-surface rounded-xl ring-1 ring-border"
            >
              <span className="size-6 grid place-items-center rounded-md bg-accent-soft text-accent text-xs font-bold">
                {i + 1}
              </span>
              <span className="text-sm">{m}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

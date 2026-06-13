import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteNav, SiteFooter } from "@/components/site-nav";
import { TASKS, STAGES, DEMO_USER, FIRST_WEEK_MISSIONS, DOCUMENTS, DOC_AUDIENCE_LABELS } from "@/lib/homebridge-data";
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
  const [statuses, setStatuses] = useState<Record<string, TaskStatus>>(
    Object.fromEntries(TASKS.map((t) => [t.id, t.status]))
  );
  const [explainTask, setExplainTask] = useState<RelocationTask | null>(null);

  const visible = useMemo(
    () =>
      TASKS.filter((t) => {
        if (t.forFamily && DEMO_USER.type !== "family") return false;
        if (t.forCouple && DEMO_USER.type !== "couple") return false;
        return true;
      }),
    []
  );

  const done = visible.filter((t) => statuses[t.id] === "done").length;
  const pct = Math.round((done / visible.length) * 100);

  const urgent = visible
    .filter((t) => statuses[t.id] !== "done" && t.priority === "high")
    .slice(0, 3);

  const blocked = visible.filter(
    (t) => t.blockedBy && statuses[t.blockedBy] !== "done" && statuses[t.id] !== "done"
  );

  const upcoming = visible
    .filter((t) => statuses[t.id] !== "done")
    .sort((a, b) => a.daysFromArrival - b.daysFromArrival)
    .slice(0, 5);

  const allDocs = Array.from(new Set(visible.flatMap((t) => t.documents))).slice(0, 12);

  const setStatus = (id: string, s: TaskStatus) =>
    setStatuses((prev) => ({ ...prev, [id]: s }));

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
              Welcome, {DEMO_USER.name.split(" ")[0]}.
            </h1>
            <p className="mt-2 text-muted-foreground">
              {DEMO_USER.type === "family" ? "Family of four" : DEMO_USER.type} · {DEMO_USER.origin} →{" "}
              {DEMO_USER.destination} · Arrived {new Date(DEMO_USER.arrivalDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
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
                        onClick={() => setExplainTask(t)}
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

              <Card title="Documents you'll need">
                <div className="flex flex-wrap gap-1.5">
                  {allDocs.map((d) => (
                    <span
                      key={d}
                      className="text-xs px-2 py-1 bg-stone-50 ring-1 ring-border rounded-md"
                    >
                      {d}
                    </span>
                  ))}
                </div>
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
                          onExplain={() => setExplainTask(t)}
                        />
                      ))}
                    </ul>
                  </div>
                );
              })}

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
  onExplain,
}: {
  task: RelocationTask;
  status: TaskStatus;
  isBlocked: boolean;
  onStatus: (s: TaskStatus) => void;
  onExplain: () => void;
}) {
  const done = status === "done";
  return (
    <li
      className={`p-5 flex gap-5 items-start border-b border-border last:border-0 transition-colors ${
        done ? "opacity-60" : "hover:bg-stone-50/60"
      }`}
    >
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
            onClick={onExplain}
            className="text-xs font-medium px-3 py-1.5 bg-ink text-canvas rounded-md hover:bg-ink/90"
          >
            Explain this step simply
          </button>
          {task.template && (
            <button
              onClick={onExplain}
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
    </li>
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

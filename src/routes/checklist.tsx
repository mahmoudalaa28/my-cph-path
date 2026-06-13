import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { SiteNav, SiteFooter } from "@/components/site-nav";
import { TASKS, STAGES, DEMO_USER } from "@/lib/homebridge-data";
import type { RelocationTask, TaskStage } from "@/lib/homebridge-data";
import { ExplainerDialog } from "@/components/task-explainer";

export const Route = createFileRoute("/checklist")({
  head: () => ({
    meta: [
      { title: "Bureaucracy checklist — HomeBridge" },
      { name: "description", content: "Stage-by-stage Copenhagen relocation checklist with documents, priorities, and AI explainers." },
    ],
  }),
  component: ChecklistPage,
});

function ChecklistPage() {
  const [stage, setStage] = useState<TaskStage>("before-arrival");
  const [explainTask, setExplainTask] = useState<RelocationTask | null>(null);

  const visible = useMemo(
    () =>
      TASKS.filter((t) => {
        if (t.forFamily && DEMO_USER.type !== "family") return false;
        if (t.forCouple && DEMO_USER.type !== "couple") return false;
        return t.stage === stage;
      }),
    [stage]
  );

  return (
    <div className="min-h-screen bg-canvas font-sans text-ink">
      <SiteNav />
      <main className="px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
            Bureaucracy checklist
          </span>
          <h1 className="mt-2 font-serif text-3xl md:text-4xl font-medium leading-tight">
            Everything, in the right order.
          </h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Filter by stage to focus on what matters right now.
          </p>

          <div className="mt-10 grid lg:grid-cols-12 gap-8 items-start">
            <aside className="lg:col-span-3 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground px-3 mb-2">
                Stages
              </p>
              {STAGES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStage(s.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    s.id === stage
                      ? "bg-ink text-canvas"
                      : "bg-surface ring-1 ring-border hover:bg-muted text-ink"
                  }`}
                >
                  <p className="text-sm font-medium">{s.label}</p>
                  <p className={`text-xs mt-0.5 ${s.id === stage ? "text-canvas/60" : "text-muted-foreground"}`}>
                    {s.sub}
                  </p>
                </button>
              ))}
            </aside>

            <section className="lg:col-span-9 space-y-3">
              {visible.map((t) => (
                <article
                  key={t.id}
                  className="bg-surface p-6 rounded-2xl ring-1 ring-border shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                        {t.category}
                      </span>
                      <h3 className="mt-1 font-serif text-xl font-medium">{t.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground max-w-[60ch]">
                        {t.description}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ring-1 whitespace-nowrap ${
                        t.priority === "high"
                          ? "bg-amber-50 text-amber-700 ring-amber-200/50"
                          : "bg-stone-100 text-stone-700 ring-stone-200"
                      }`}
                    >
                      {t.priority} priority
                    </span>
                  </div>

                  {t.documents.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {t.documents.map((d) => (
                        <span
                          key={d}
                          className="text-xs px-2 py-1 bg-stone-50 ring-1 ring-border rounded-md text-muted-foreground"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-5 flex flex-wrap gap-2">
                    <button
                      onClick={() => setExplainTask(t)}
                      className="text-xs font-medium px-3 py-1.5 bg-ink text-canvas rounded-md hover:bg-ink/90"
                    >
                      Explain this step simply
                    </button>
                    {t.template && (
                      <button
                        onClick={() => setExplainTask(t)}
                        className="text-xs font-medium px-3 py-1.5 bg-surface ring-1 ring-border rounded-md hover:bg-muted"
                      >
                        Use template
                      </button>
                    )}
                    <a
                      href={t.officialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium px-3 py-1.5 text-muted-foreground hover:text-ink"
                    >
                      Official link ↗
                    </a>
                  </div>
                </article>
              ))}
              {visible.length === 0 && (
                <div className="text-center py-16 text-muted-foreground text-sm">
                  No tasks in this stage for your profile.
                </div>
              )}
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

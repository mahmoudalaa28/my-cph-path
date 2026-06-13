import { useState } from "react";
import type { RelocationTask } from "@/lib/homebridge-data";

export function ExplainerDialog({
  task,
  open,
  onClose,
}: {
  task: RelocationTask;
  open: boolean;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"explain" | "template">("explain");
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-end md:items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface w-full max-w-2xl rounded-2xl ring-1 ring-border shadow-xl max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-border flex items-start justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
              {task.category}
            </span>
            <h3 className="mt-2 font-serif text-2xl font-medium leading-tight">{task.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="size-8 grid place-items-center rounded-md hover:bg-muted text-muted-foreground"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {task.template && (
          <div className="px-6 pt-4 flex gap-1 border-b border-border">
            <TabButton active={tab === "explain"} onClick={() => setTab("explain")}>
              AI Explainer
            </TabButton>
            <TabButton active={tab === "template"} onClick={() => setTab("template")}>
              Template
            </TabButton>
          </div>
        )}

        <div className="p-6 overflow-y-auto space-y-6">
          {tab === "explain" && (
            <>
              <Block label="What this means" body={task.explainer.what} />
              <Block label="Why it matters" body={task.explainer.why} />
              <Block label="Documents needed" body={task.explainer.docs} />
              <Block label="What can go wrong" body={task.explainer.risks} accent />
              <Block label="What to do next" body={task.explainer.next} />

              <div className="pt-4 border-t border-border">
                <a
                  href={task.officialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-accent font-medium hover:underline"
                >
                  Official source →
                </a>
              </div>
            </>
          )}

          {tab === "template" && task.template && (
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  {task.template.type} · Subject
                </p>
                <p className="mt-1 font-medium">{task.template.subject}</p>
              </div>
              <pre className="whitespace-pre-wrap text-sm bg-stone-50 ring-1 ring-border rounded-xl p-4 font-sans leading-relaxed text-ink">
                {task.template.body}
              </pre>
              <button
                onClick={() => navigator.clipboard?.writeText(task.template!.body)}
                className="bg-ink text-canvas px-4 py-2 rounded-lg text-sm font-medium hover:bg-ink/90"
              >
                Copy to clipboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Block({ label, body, accent }: { label: string; body: string; accent?: boolean }) {
  return (
    <div className={accent ? "rounded-xl bg-amber-50 ring-1 ring-amber-200/50 p-4" : ""}>
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-ink">{body}</p>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
        active ? "border-ink text-ink" : "border-transparent text-muted-foreground hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

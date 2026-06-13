import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteNav, SiteFooter } from "@/components/site-nav";
import { DEMO_USER } from "@/lib/homebridge-data";
import {
  TEMPLATES,
  RECIPIENT_LABELS,
  fillTemplate,
  type RecipientType,
  type TemplateProfile,
  type MessageTemplate,
} from "@/lib/homebridge-templates";

export const Route = createFileRoute("/templates")({
  head: () => ({
    meta: [
      { title: "Message Templates — HomeBridge" },
      {
        name: "description",
        content:
          "Ready-to-send messages for landlords, HR, municipality, banks, schools and insurers — auto-filled with your relocation details.",
      },
    ],
  }),
  component: TemplatesPage,
});

const RECIPIENTS: { id: RecipientType | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "employer-hr", label: "Employer HR" },
  { id: "landlord", label: "Landlord" },
  { id: "municipality", label: "Municipality" },
  { id: "bank", label: "Bank" },
  { id: "school", label: "School / Daycare" },
  { id: "insurance", label: "Insurance" },
];

function loadProfile(): TemplateProfile {
  const fallback: TemplateProfile = {
    name: DEMO_USER.name,
    city: DEMO_USER.destination,
    arrivalDate: new Date(DEMO_USER.arrivalDate).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    relocationType: DEMO_USER.type,
    originCountry: DEMO_USER.origin,
    euStatus: DEMO_USER.euStatus === "eu" ? "EU citizen" : "non-EU citizen",
    employer: "",
    address: "",
  };
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem("homebridge.profile");
    if (!raw) return fallback;
    const p = JSON.parse(raw);
    return {
      name: p.name || fallback.name,
      city: p.destination || fallback.city,
      arrivalDate: p.moveDate
        ? new Date(p.moveDate).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : fallback.arrivalDate,
      relocationType: p.type || fallback.relocationType,
      originCountry: p.originCountry || fallback.originCountry,
      euStatus:
        p.origin === "eu"
          ? "EU citizen"
          : p.origin === "non-eu"
          ? "non-EU citizen"
          : fallback.euStatus,
      employer: p.employer || "",
      address: p.address || "",
    };
  } catch {
    return fallback;
  }
}

function TemplatesPage() {
  const [profile, setProfile] = useState<TemplateProfile>(() => loadProfile());
  const [filter, setFilter] = useState<RecipientType | "all">("all");
  const [edits, setEdits] = useState<Record<string, { subject: string; body: string }>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(TEMPLATES[0]?.id ?? null);

  useEffect(() => {
    setProfile(loadProfile());
  }, []);

  const visible = useMemo(
    () => (filter === "all" ? TEMPLATES : TEMPLATES.filter((t) => t.recipient === filter)),
    [filter],
  );

  const getDraft = (t: MessageTemplate) => {
    const e = edits[t.id];
    return {
      subject: e?.subject ?? fillTemplate(t.subject, profile),
      body: e?.body ?? fillTemplate(t.body, profile),
    };
  };

  const resetTemplate = (id: string) => {
    setEdits((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const copyTemplate = async (t: MessageTemplate) => {
    const { subject, body } = getDraft(t);
    const text = `Subject: ${subject}\n\n${body}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(t.id);
      setTimeout(() => setCopiedId((c) => (c === t.id ? null : c)), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <SiteNav />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Templates
          </p>
          <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight">
            Ready-to-send messages
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Practical messages for the people involved in your move. Each template auto-fills with
            your relocation details — review, edit, and copy.
          </p>
        </header>

        {/* Profile autofill summary */}
        <section className="mb-6 rounded-2xl border border-border bg-surface p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Auto-filling with
              </p>
              <p className="mt-1 text-sm text-ink">
                <span className="font-medium">{profile.name}</span> · {profile.city} · arrival{" "}
                {profile.arrivalDate} · {profile.relocationType} from {profile.originCountry}
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field
              label="Apartment address"
              placeholder="e.g. Vesterbrogade 12, 2.tv"
              value={profile.address}
              onChange={(v) => setProfile((p) => ({ ...p, address: v }))}
            />
            <Field
              label="Employer"
              placeholder="e.g. Novo Nordisk A/S"
              value={profile.employer}
              onChange={(v) => setProfile((p) => ({ ...p, employer: v }))}
            />
          </div>
        </section>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          {RECIPIENTS.map((r) => {
            const active = filter === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setFilter(r.id)}
                className={
                  "rounded-full px-3 py-1.5 text-xs font-medium ring-1 transition-colors " +
                  (active
                    ? "bg-ink text-canvas ring-ink"
                    : "bg-canvas text-muted-foreground ring-border hover:text-ink")
                }
              >
                {r.label}
              </button>
            );
          })}
        </div>

        {/* List */}
        <div className="space-y-4">
          {visible.map((t) => {
            const draft = getDraft(t);
            const open = openId === t.id;
            const edited = !!edits[t.id];
            return (
              <article
                key={t.id}
                className="overflow-hidden rounded-2xl border border-border bg-surface"
              >
                <button
                  onClick={() => setOpenId(open ? null : t.id)}
                  className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-canvas px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-muted-foreground ring-1 ring-border">
                        {RECIPIENT_LABELS[t.recipient]}
                      </span>
                      {edited && (
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-amber-800 ring-1 ring-amber-200">
                          Edited
                        </span>
                      )}
                    </div>
                    <h2 className="mt-2 font-serif text-lg font-semibold text-ink">{t.title}</h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Supports task: {t.relevantTaskTitle}
                    </p>
                  </div>
                  <span className="mt-1 text-xs text-muted-foreground">{open ? "Hide" : "Open"}</span>
                </button>

                {open && (
                  <div className="border-t border-border px-5 py-5">
                    <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                      Subject
                    </label>
                    <input
                      value={draft.subject}
                      onChange={(e) =>
                        setEdits((prev) => ({
                          ...prev,
                          [t.id]: { subject: e.target.value, body: draft.body },
                        }))
                      }
                      className="mt-2 w-full rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-ink focus:border-ink focus:outline-none"
                    />

                    <label className="mt-4 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
                      Message
                    </label>
                    <textarea
                      value={draft.body}
                      onChange={(e) =>
                        setEdits((prev) => ({
                          ...prev,
                          [t.id]: { subject: draft.subject, body: e.target.value },
                        }))
                      }
                      rows={Math.min(20, Math.max(8, draft.body.split("\n").length + 1))}
                      className="mt-2 w-full resize-y rounded-lg border border-border bg-canvas px-3 py-3 font-mono text-[13px] leading-relaxed text-ink focus:border-ink focus:outline-none"
                    />

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => copyTemplate(t)}
                        className="inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm font-medium text-canvas ring-1 ring-ink hover:bg-ink/90"
                      >
                        {copiedId === t.id ? "Copied ✓" : "Copy message"}
                      </button>
                      {edited && (
                        <button
                          onClick={() => resetTemplate(t.id)}
                          className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-ink"
                        >
                          Reset to template
                        </button>
                      )}
                      <span className="ml-auto text-[11px] text-muted-foreground">
                        Auto-filled: name · city · arrival · type
                      </span>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-ink focus:border-ink focus:outline-none"
      />
    </label>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav, SiteFooter } from "@/components/site-nav";
import { SOFT_LANDING, FIRST_WEEK_MISSIONS } from "@/lib/homebridge-data";

const CATEGORY_COLORS: Record<string, string> = {
  events: "bg-blue-50",
  meetups: "bg-teal-50",
  coworking: "bg-stone-100",
  networking: "bg-indigo-50",
  sports: "bg-green-50",
  cafes: "bg-amber-50",
  host: "bg-rose-50",
  match: "bg-emerald-50",
  guide: "bg-slate-50",
};

function getCategoryEmoji(category: string) {
  const map: Record<string, string> = {
    events: "🎉",
    meetups: "🤝",
    coworking: "💻",
    networking: "🔗",
    sports: "⚽",
    cafes: "☕",
    host: "🏠",
    match: "💚",
    guide: "📘",
  };
  return map[category] ?? "✨";
}

const AUDIENCES = [
  { id: "individual", label: "Individuals" },
  { id: "couple", label: "Couples" },
  { id: "family", label: "Families" },
] as const;

function SoftLandingPage() {
  const [aud, setAud] = useState<"individual" | "couple" | "family">("individual");

  const items = SOFT_LANDING.filter((s) => s.audience === aud || s.audience === "all");

  return (
    <div className="min-h-screen bg-canvas font-sans text-ink">
      <SiteNav />
      <main className="px-6 py-12 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
            Soft landing
          </span>
          <h1 className="mt-2 font-serif text-3xl md:text-4xl font-medium leading-tight max-w-2xl">
            Beyond paperwork. Helping Copenhagen feel like yours.
          </h1>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            Curated for your household type. Browse events, get matched with a local
            host, or pick a low-pressure first-week mission.
          </p>

          <div className="mt-8 inline-flex bg-surface p-1 rounded-lg ring-1 ring-border">
            {AUDIENCES.map((a) => (
              <button
                key={a.id}
                onClick={() => setAud(a.id)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  aud === a.id ? "bg-ink text-canvas" : "text-muted-foreground hover:text-ink"
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>

          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((it, i) => (
              <article
                key={it.id}
                className="bg-surface rounded-2xl ring-1 ring-border overflow-hidden shadow-sm flex flex-col"
              >
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={IMAGE_POOL[i % IMAGE_POOL.length]}
                    alt={it.title}
                    loading="lazy"
                    width={800}
                    height={600}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                      {it.category}
                    </span>
                    {it.matchScore && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/50">
                        {it.matchScore}% match
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="mt-2 font-serif text-lg font-semibold leading-snug flex-1">
                      {it.title}
                    </h3>
                    {(it.category === "match" || it.category === "host") && (
                      <button className="text-[11px] text-muted-foreground hover:text-ink flex items-center gap-1 shrink-0">
                        <span>■</span> Report
                      </button>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground flex-1">{it.subtitle}</p>
                  {(it.date || it.attendees) && (
                    <p className="mt-3 text-xs text-muted-foreground">
                      {it.date}
                      {it.date && it.attendees ? " · " : ""}
                      {it.attendees ? `${it.attendees} going` : ""}
                    </p>
                  )}
                  {it.category === "match" || it.category === "host" ? (
                    <div className="mt-5">
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        All introductions are reviewed by our team. We suggest first meetings in a public place. HomeBridge does not share contact details until both parties confirm.
                      </p>
                      <button className="mt-3 bg-ink text-canvas text-sm font-medium px-4 py-2 rounded-lg hover:bg-ink/90">
                        Request intro (admin reviews within 24h)
                      </button>
                    </div>
                  ) : (
                    <button className="mt-5 bg-ink text-canvas text-sm font-medium px-4 py-2 rounded-lg hover:bg-ink/90">
                      {it.category === "guide" ? "Read guide" : "Join"}
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>

          {/* Missions */}
          <section className="mt-16 bg-stone-50 rounded-2xl ring-1 ring-border p-8 md:p-10">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
              First 7 days
            </span>
            <h2 className="mt-2 font-serif text-2xl md:text-3xl font-medium">
              Low-pressure social missions
            </h2>
            <p className="mt-2 text-muted-foreground max-w-2xl">
              Small, doable things. Pick one a day. No pressure.
            </p>
            <ul className="mt-6 grid sm:grid-cols-2 gap-3">
              {FIRST_WEEK_MISSIONS.map((m, i) => (
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
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

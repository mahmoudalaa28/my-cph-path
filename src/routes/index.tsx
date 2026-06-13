import { createFileRoute, Link } from "@tanstack/react-router";
import heroImage from "@/assets/hero-bridge.jpg";
import hostImage from "@/assets/host-families.jpg";
import canalImage from "@/assets/canal-tours.jpg";
import coworkImage from "@/assets/coworking.jpg";
import { SiteNav, SiteFooter } from "@/components/site-nav";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HomeBridge — Relocate to Copenhagen smoothly" },
      {
        name: "description",
        content:
          "Personalized relocation admin roadmap, document checklist, deadline tracker, and local soft-landing support for newcomers to Copenhagen.",
      },
      { property: "og:title", content: "HomeBridge — Relocate to Copenhagen smoothly" },
      {
        property: "og:description",
        content:
          "Turn confusing Copenhagen relocation bureaucracy into a clear, personalized roadmap.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-canvas font-sans text-ink">
      <SiteNav />

      {/* Hero */}
      <section className="px-6 pt-20 pb-16 lg:pt-28 lg:pb-24">
        <div className="mx-auto max-w-6xl grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
              Copenhagen Relocation Copilot
            </span>
            <h1 className="mt-4 font-serif text-4xl md:text-6xl font-medium leading-[1.05] tracking-tight text-balance">
              Relocate smoothly. Know exactly what to do next.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-[56ch] text-pretty">
              HomeBridge gives newcomers a personalized relocation admin roadmap,
              document checklist, deadline tracker, and local soft-landing support.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/onboarding"
                className="bg-ink text-canvas px-6 py-3 rounded-lg font-medium ring-1 ring-ink hover:bg-ink/90 transition-colors"
              >
                Create my relocation roadmap
              </Link>
              <Link
                to="/employer"
                className="bg-surface text-ink px-6 py-3 rounded-lg font-medium ring-1 ring-border hover:bg-muted transition-colors"
              >
                For employers and relocation teams
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-2xl ring-1 ring-border shadow-sm">
              <img
                src={heroImage}
                alt="A wooden bridge over Copenhagen harbour at dawn"
                width={1600}
                height={1024}
                className="w-full h-auto object-cover aspect-[5/4]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="px-6 py-20 bg-stone-50 border-y border-border">
        <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-12 items-start">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
              The problem
            </span>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl font-medium leading-tight">
              Relocation bureaucracy is confusing — even with a relocation package.
            </h2>
          </div>
          <div className="space-y-5 text-muted-foreground text-pretty">
            <p>
              CPR. MitID. NemKonto. Skattekort. Folkeregister. The acronyms hide a
              sequence of forms, appointments and dependencies that don't fit on any
              single official page.
            </p>
            <p>
              One wrong address line on a lease delays a CPR by weeks. A missed tax
              card means 55% withholding. A late daycare application costs months.
            </p>
            <p className="font-medium text-ink">
              HomeBridge knows the order. We tell you what to do this week, what to
              prepare, and what to ignore for now.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl mb-14">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
              How it works
            </span>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl font-medium leading-tight">
              Five surfaces that turn paperwork into a plan.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { n: "01", t: "Bureaucracy roadmap", d: "A staged path from before arrival to your first 90 days." },
              { n: "02", t: "Document checklist", d: "Know exactly what to bring to each appointment." },
              { n: "03", t: "Deadline tracker", d: "Upcoming dates and what unlocks what." },
              { n: "04", t: "Soft-landing support", d: "Curated events, host families, language clubs." },
              { n: "05", t: "Employer dashboard", d: "Anonymized progress and risk flags for HR teams." },
            ].map((it) => (
              <div
                key={it.n}
                className="rounded-2xl bg-surface ring-1 ring-border p-6 hover:ring-ink/20 transition-colors"
              >
                <span className="font-serif text-accent text-lg">{it.n}</span>
                <h3 className="mt-3 font-serif text-lg font-semibold">{it.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{it.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard preview */}
      <section className="px-6 py-20 bg-stone-50 border-y border-border">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-2xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
              The roadmap dashboard
            </span>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl font-medium leading-tight">
              Your relocation, on one calm page.
            </h2>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-surface p-8 rounded-2xl ring-1 ring-border shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Current Progress</h3>
                  <span className="font-serif text-2xl font-semibold text-accent">34%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-accent w-[34%] rounded-full" />
                </div>
                <div className="mt-6 p-3 bg-stone-50 rounded-xl ring-1 ring-border">
                  <p className="text-sm font-medium">Urgent: CPR Application</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Deadline in 3 days</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="bg-surface rounded-2xl ring-1 ring-border shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <h3 className="font-medium text-lg">Stage 1 · Before Arrival</h3>
                  <span className="text-xs font-medium px-2 py-1 bg-muted text-muted-foreground rounded-md">
                    4 tasks remaining
                  </span>
                </div>

                <div className="p-6 flex gap-5 items-start border-b border-border">
                  <div className="size-5 border border-border rounded mt-1 shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-medium">Secure Temporary Housing</h4>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 ring-1 ring-amber-200/50">
                        High
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground max-w-[56ch]">
                      Required for CPR registration. Ensure your lease explicitly
                      allows folkeregister registration.
                    </p>
                    <button className="mt-4 inline-flex items-center gap-2 text-xs font-medium px-3 py-2 bg-ink text-canvas rounded-lg">
                      Explain this step simply
                    </button>
                  </div>
                </div>

                <div className="p-6 flex gap-5 items-start opacity-60">
                  <div className="size-5 bg-ink rounded mt-1 shrink-0 grid place-items-center text-canvas text-[10px] font-bold">
                    ✓
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Valid Passport Check</h4>
                    <p className="text-sm text-muted-foreground">
                      Ensure your passport is valid for at least 6 months beyond entry.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Soft landing teaser */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-12">
            <div className="max-w-[48ch]">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                Soft landing
              </span>
              <h2 className="mt-3 font-serif text-3xl md:text-4xl font-medium leading-tight">
                Find your feet in Copenhagen.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Bureaucracy is half the journey. Our community layer connects you with
                local host families and fellow newcomers.
              </p>
            </div>
            <Link
              to="/soft-landing"
              className="text-sm font-semibold text-accent inline-flex items-center gap-2 hover:translate-x-1 transition-transform"
            >
              Explore soft-landing support →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { img: hostImage, alt: "Warm Danish living room with candles", tag: "Host Families", title: "The Sunday Coffee Program", desc: "Get matched with a Danish family for a casual home dinner or coffee." },
              { img: canalImage, alt: "People biking along a Copenhagen canal at sunset", tag: "Local Meetups", title: "Newcomer Canal Tours", desc: "Weekly group tours led by locals who share hidden city gems." },
              { img: coworkImage, alt: "Minimalist Danish café with people working", tag: "Coworking", title: "The Landing Pad", desc: "Dedicated desks at our partner hubs for the first 30 days of your move." },
            ].map((c) => (
              <div key={c.title} className="group cursor-pointer">
                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden ring-1 ring-border mb-4">
                  <img
                    src={c.img}
                    alt={c.alt}
                    loading="lazy"
                    width={800}
                    height={600}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                  {c.tag}
                </span>
                <h5 className="mt-1 font-serif text-lg font-semibold">{c.title}</h5>
                <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Employer band */}
      <section className="px-6 py-20 bg-ink text-canvas">
        <div className="mx-auto max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
              For employers & relocation agencies
            </span>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl font-medium leading-tight text-balance">
              Retain global talent. Reduce HR overhead.
            </h2>
            <p className="mt-4 text-canvas/70 max-w-[52ch]">
              Anonymized insights into your team's relocation health. Spot bottlenecks
              before they delay start dates.
            </p>
            <Link
              to="/employer"
              className="mt-8 inline-flex bg-canvas text-ink px-6 py-3 rounded-lg font-medium hover:bg-canvas/90 transition-colors"
            >
              See the employer dashboard
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Stat n="142" l="Active relocations" />
            <Stat n="67%" l="Avg admin completion" />
            <Stat n="89" l="Using soft landing" />
            <Stat n="4" l="Risk flags" />
          </div>
        </div>
      </section>

      {/* Safety */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
            Safety & privacy
          </span>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl font-medium leading-tight">
            Your documents stay yours.
          </h2>
          <p className="mt-4 text-muted-foreground">
            HomeBridge stores only what's needed to power your roadmap. Employers see
            anonymized completion data — never individual answers, never your documents.
            EU-hosted, GDPR-aligned, deletable on request.
          </p>
        </div>
      </section>

      {/* Pilot CTA */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl rounded-3xl bg-stone-100 ring-1 ring-border p-12 md:p-16 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight">
            Join the Copenhagen pilot.
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            We're onboarding the first 200 relocators and 10 employer teams this quarter.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/onboarding"
              className="bg-ink text-canvas px-6 py-3 rounded-lg font-medium hover:bg-ink/90 transition-colors"
            >
              Create my relocation roadmap
            </Link>
            <Link
              to="/employer"
              className="bg-surface text-ink px-6 py-3 rounded-lg font-medium ring-1 ring-border hover:bg-muted transition-colors"
            >
              For employer teams
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className="rounded-2xl bg-canvas/5 ring-1 ring-canvas/10 p-6">
      <p className="font-serif text-3xl">{n}</p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-canvas/50">{l}</p>
    </div>
  );
}

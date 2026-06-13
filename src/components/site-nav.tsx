import { Link } from "@tanstack/react-router";

export function SiteNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-canvas/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-serif text-xl font-semibold tracking-tight text-ink">
            HomeBridge
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
            <Link to="/dashboard" className="hover:text-ink transition-colors" activeProps={{ className: "text-ink" }}>
              Roadmap
            </Link>
            <Link to="/checklist" className="hover:text-ink transition-colors" activeProps={{ className: "text-ink" }}>
              Checklist
            </Link>
            <Link to="/templates" className="hover:text-ink transition-colors" activeProps={{ className: "text-ink" }}>
              Templates
            </Link>
            <Link to="/soft-landing" className="hover:text-ink transition-colors" activeProps={{ className: "text-ink" }}>
              Soft Landing
            </Link>
            <Link to="/employer" className="hover:text-ink transition-colors" activeProps={{ className: "text-ink" }}>
              Employer
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/employer"
            className="hidden sm:inline-flex text-sm font-medium text-muted-foreground px-3 py-2 hover:text-ink"
          >
            Employer Login
          </Link>
          <Link
            to="/onboarding"
            className="inline-flex bg-ink text-canvas text-sm font-medium px-4 py-2 rounded-lg ring-1 ring-ink hover:bg-ink/90 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="py-12 px-6 border-t border-border bg-canvas">
      <div className="mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="font-serif text-lg font-semibold text-ink">HomeBridge</span>
          <p className="text-xs text-muted-foreground">
            © 2026 HomeBridge · Made with care for new Copenhageners
          </p>
        </div>
        <div className="flex gap-8 text-xs font-medium text-muted-foreground uppercase tracking-widest">
          <a href="#" className="hover:text-ink">Privacy</a>
          <a href="#" className="hover:text-ink">Terms</a>
          <a href="#" className="hover:text-ink">Security</a>
          <a href="#" className="hover:text-ink">Contact</a>
        </div>
      </div>
    </footer>
  );
}

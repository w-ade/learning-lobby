"use client";
import { useEffect, useState } from "react";
import type { IconKey } from "./page";
import { ProfileMenu } from "./profile-menu";
import { OverviewFeed } from "./feed";
import { completed, greeting, suggestions, upNext } from "./feed-data";


const rail: { id: string; l: string; i: IconKey }[] = [
  { id: "home", l: "Home", i: "home" },
  { id: "learn", l: "Learn", i: "book" },
  { id: "notes", l: "Notes", i: "note" },
];
const settings = { id: "settings", l: "Settings" };

type Item = { id: string; l: string; i: IconKey; d: string };
const groups: Record<string, { h: string; items: Item[] }[]> = {
  home: [
    { h: "Today", items: [
      { id: "overview", l: "Overview", i: "grid", d: "A snapshot of where you are across every track, and what to pick up next." },
      { id: "continue", l: "Continue learning", i: "play", d: "Jump back into the lesson or lab you were last working on." },
      { id: "schedule", l: "Study plan", i: "calendar", d: "The sessions you've planned for this week, built around your learning goals." },
      { id: "completed", l: "Completed", i: "check", d: "Lessons, labs, and projects you've finished, most recent first." },
    ] },
  ],
  learn: [
    { h: "Tracks", items: [
      { id: "a", l: "Technical Foundations", i: "layers", d: "The computing, engineering, and platform groundwork everything else is built on." },
      { id: "b", l: "Agent Engineering", i: "layers", d: "How agents actually work, from models and tools to loops, memory, safety, and production." },
      { id: "c", l: "Build & Run a Business", i: "layers", d: "Build, launch, and operate a real business from zero, with agents as leverage." },
    ] },
    { h: "Labs & projects", items: [
      { id: "labs", l: "Labs", i: "flask", d: "Hands-on labs that close out each module." },
      { id: "projects", l: "Projects", i: "hammer", d: "Everything you've built from your labs, in progress and shipped." },
    ] },
    { h: "Library", items: [
      { id: "courses", l: "All courses", i: "book", d: "Every course in the curriculum, across all three tracks." },
      { id: "saved", l: "Saved", i: "bookmark", d: "Lessons and courses you've saved for later." },
    ] },
  ],
  notes: [
    { h: "Notes", items: [
      { id: "all", l: "All notes", i: "note", d: "Everything you've written while working through lessons." },
      { id: "highlights", l: "Highlights", i: "highlight", d: "Passages you've highlighted, grouped by lesson." },
      { id: "bookmarks", l: "Bookmarks", i: "bookmark", d: "Places in lessons you've marked to come back to." },
    ] },
  ],
  settings: [
    { h: "Personal settings", items: [
      { id: "profile", l: "Profile", i: "user", d: "Your name, photo, and how you appear to others." },
      { id: "notifications", l: "Notifications", i: "bell", d: "Choose which updates and reminders reach you, and where." },
      { id: "security", l: "Security", i: "lock", d: "Your password and active sessions." },
    ] },
    { h: "Learning preferences", items: [
      { id: "goals", l: "Learning goals", i: "target", d: "What you're working toward and how much time you want to spend each week." },
      { id: "reminders", l: "Study reminders", i: "clock", d: "When we nudge you to keep your streak and study plan on track." },
      { id: "appearance", l: "Appearance", i: "sun", d: "Theme and reading preferences for lessons." },
    ] },
  ],
};

export function Dashboard({ icons: I }: { icons: Record<IconKey, React.ReactNode> }) {
  const [area, setArea] = useState("home");
  const [page, setPage] = useState<Record<string, string>>(() => Object.fromEntries(Object.entries(groups).map(([k, g]) => [k, g[0].items[0].id])));
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  useEffect(() => { setDark(document.documentElement.classList.contains("ll-dark")); }, []);
  const toggleTheme = () => { const d = !dark; setDark(d); document.documentElement.classList.toggle("ll-dark", d); try { localStorage.setItem("ll-theme", d ? "dark" : "light"); } catch {} };

  useEffect(() => {
    const key = (e: KeyboardEvent) => { if (e.key === "[" && !(e.target instanceof HTMLInputElement)) setOpen(o => !o); };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, []);

  const section = area === settings.id ? settings : rail.find(r => r.id === area)!;
  const go = (id: string) => { if (id === area) setOpen(o => !o); else { setArea(id); setOpen(true); } };
  const show = (id: string, pg?: string) => { setArea(id); setOpen(true); if (pg) setPage(p => ({ ...p, [id]: pg })); };
  const list = groups[area] ?? [];
  const cur = list.flatMap(g => g.items).find(it => it.id === page[area]);
  const title = cur?.l ?? section.l;
  const feed = area === "home" && page.home === "overview";

  // Overview is a focused feed: collapse the sidebar on arrival, reopen it when leaving.
  useEffect(() => { setOpen(!feed); }, [feed]);

  return <div className="db">
    <div className="db-shell">
      <aside className="db-rail">
        <div className="db-logo" aria-hidden="true"><i /></div>
        <nav aria-label="Primary">
          {rail.map(r => <button key={r.id} type="button" aria-label={r.l} title={r.l} aria-current={r.id === area ? "page" : undefined}
            onClick={() => go(r.id)}>{I[r.i]}</button>)}
        </nav>
        <button type="button" className="db-theme" aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} title={dark ? "Light mode" : "Dark mode"} onClick={toggleTheme}>
          <span data-on={!dark}>{I.moon}</span><span data-on={dark}>{I.sun}</span>
        </button>
        <ProfileMenu icons={I} onNavigate={show} dark={dark} onToggleTheme={toggleTheme} />
      </aside>

      <aside className="db-side" data-open={open} aria-hidden={!open}>
        <div className="db-side-head">
          <h2>{section.l}</h2>
          <button type="button" className="db-icon-btn" aria-label="Collapse sidebar" title="Collapse sidebar  [" onClick={() => setOpen(false)}>{I.panel}</button>
        </div>
        {list.length ? list.map(g => <div key={g.h} className="db-group">
          <h3>{g.h}</h3>
          {g.items.map(it => <button key={it.id} type="button" aria-current={page[area] === it.id ? "page" : undefined}
            onClick={() => setPage(p => ({ ...p, [area]: it.id }))}>{I[it.i]}{it.l}</button>)}
        </div>) : <p className="db-empty">Nothing here yet.</p>}
      </aside>

      {feed ? <main className="db-main db-main-feed">
        {!open && <button type="button" className="db-icon-btn db-feed-expand" aria-label="Expand sidebar" onClick={() => setOpen(true)} style={{ transform: "scaleX(-1)" }}>{I.panel}</button>}
        <OverviewFeed I={I} greeting={greeting} suggestions={suggestions} upNext={upNext} completed={completed} />
      </main> : <main className="db-main">
        <div className="db-main-head">
          {!open && <button type="button" className="db-icon-btn" aria-label="Expand sidebar" onClick={() => setOpen(true)} style={{ transform: "scaleX(-1)" }}>{I.panel}</button>}
          <h1>{title}</h1>
        </div>
        <p>{cur?.d}</p>
        <div className="db-blank">Content coming soon</div>
      </main>}
    </div>
  </div>;
}

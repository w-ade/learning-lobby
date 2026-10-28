"use client";
import { useEffect, useState } from "react";
import type { IconKey } from "./page";


const rail: { id: string; l: string; i: IconKey }[] = [
  { id: "home", l: "Home", i: "home" },
  { id: "learn", l: "Learn", i: "book" },
  { id: "progress", l: "Progress", i: "chart" },
  { id: "notes", l: "Notes", i: "note" },
  { id: "settings", l: "Settings", i: "gear" },
];

type Item = { id: string; l: string; i: IconKey; d: string };
const groups: Record<string, { h: string; items: Item[] }[]> = {
  home: [
    { h: "Today", items: [
      { id: "overview", l: "Overview", i: "grid", d: "A snapshot of where you are across every track, and what to pick up next." },
      { id: "continue", l: "Continue learning", i: "play", d: "Jump back into the lesson or lab you were last working on." },
      { id: "schedule", l: "Study plan", i: "calendar", d: "The sessions you've planned for this week, built around your learning goals." },
    ] },
  ],
  learn: [
    { h: "Tracks", items: [
      { id: "a", l: "Technical Foundations", i: "layers", d: "The computing, engineering, and platform groundwork everything else is built on." },
      { id: "b", l: "Agent Engineering", i: "layers", d: "How agents actually work, from models and tools to loops, memory, safety, and production." },
      { id: "c", l: "Build & Run a Business", i: "layers", d: "Build, launch, and operate a real business from zero, with agents as leverage." },
    ] },
    { h: "Library", items: [
      { id: "courses", l: "All courses", i: "book", d: "Every course in the curriculum, across all three tracks." },
      { id: "labs", l: "Labs", i: "flask", d: "Hands-on labs that close out each module." },
      { id: "saved", l: "Saved", i: "bookmark", d: "Lessons and courses you've saved for later." },
    ] },
  ],
  progress: [
    { h: "Your progress", items: [
      { id: "summary", l: "Summary", i: "chart", d: "How far you've come in each track, course, and module." },
      { id: "completed", l: "Completed", i: "check", d: "Lessons, labs, and courses you've finished." },
      { id: "streak", l: "Streak", i: "flame", d: "Your daily learning streak and study time over the past weeks." },
      { id: "milestones", l: "Milestones", i: "trophy", d: "Capstones and milestones you've reached along the way." },
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
      { id: "billing", l: "Billing", i: "billing", d: "Your plan, payment method, and invoices." },
    ] },
  ],
};

export function Dashboard({ icons: I }: { icons: Record<IconKey, React.ReactNode> }) {
  const [area, setArea] = useState("home");
  const [page, setPage] = useState<Record<string, string>>(() => Object.fromEntries(Object.entries(groups).map(([k, g]) => [k, g[0].items[0].id])));
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const key = (e: KeyboardEvent) => { if (e.key === "[" && !(e.target instanceof HTMLInputElement)) setOpen(o => !o); };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, []);

  const section = rail.find(r => r.id === area)!;
  const list = groups[area] ?? [];
  const cur = list.flatMap(g => g.items).find(it => it.id === page[area]);
  const title = cur?.l ?? section.l;

  return <div className="db">
    <div className="db-shell">
      <aside className="db-rail">
        <div className="db-logo" aria-hidden="true"><i /></div>
        <nav aria-label="Primary">
          {rail.map(r => <button key={r.id} type="button" aria-label={r.l} title={r.l} aria-current={r.id === area ? "page" : undefined}
            onClick={() => { if (r.id === area) setOpen(o => !o); else { setArea(r.id); setOpen(true); } }}>{I[r.i]}</button>)}
        </nav>
        <div className="db-avatar" aria-label="Account">W</div>
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

      <main className="db-main">
        <div className="db-main-head">
          {!open && <button type="button" className="db-icon-btn" aria-label="Expand sidebar" onClick={() => setOpen(true)} style={{ transform: "scaleX(-1)" }}>{I.panel}</button>}
          <h1>{title}</h1>
        </div>
        <p>{cur?.d}</p>
        <div className="db-blank">Content coming soon</div>
      </main>
    </div>
  </div>;
}

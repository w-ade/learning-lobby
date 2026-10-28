"use client";
import { useEffect, useState } from "react";

const I = {
  home: <svg viewBox="0 0 24 24"><path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z" /></svg>,
  search: <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></svg>,
  bell: <svg viewBox="0 0 24 24"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" /><path d="M10 20.5a2 2 0 0 0 4 0" /></svg>,
  chat: <svg viewBox="0 0 24 24"><path d="M12 4a8 8 0 0 0-6.9 12L4 20l4-1.1A8 8 0 1 0 12 4z" /></svg>,
  gear: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></svg>,
  panel: <svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="14" rx="2" /><path d="M9 5v14M15 10l-2 2 2 2" /></svg>,
  user: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /><circle cx="12" cy="10" r="2.5" /><path d="M7.5 17.5a5 5 0 0 1 9 0" /></svg>,
  lock: <svg viewBox="0 0 24 24"><rect x="6" y="11" width="12" height="9" rx="2" /><path d="M9 11V8a3 3 0 0 1 6 0v3" /></svg>,
  clock: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></svg>,
  team: <svg viewBox="0 0 24 24"><circle cx="9" cy="9" r="3" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0" /><circle cx="17" cy="8" r="2.2" /><path d="M16 13.5a4.5 4.5 0 0 1 5 4.5" /></svg>,
  billing: <svg viewBox="0 0 24 24"><rect x="5" y="3.5" width="14" height="17" rx="2" /><path d="M14 9h-3a1.5 1.5 0 0 0 0 3h2a1.5 1.5 0 0 1 0 3h-3M12 7.5v1.5M12 15v1.5" /></svg>,
  channels: <svg viewBox="0 0 24 24"><circle cx="12" cy="6" r="2.5" /><circle cx="6" cy="18" r="2.5" /><circle cx="18" cy="18" r="2.5" /><path d="M12 8.5v3M12 11.5 7.5 16M12 11.5l4.5 4.5" /></svg>,
  plug: <svg viewBox="0 0 24 24"><circle cx="6" cy="17" r="2.5" /><circle cx="18" cy="17" r="2.5" /><circle cx="12" cy="6" r="2.5" /><path d="M10.8 8.2 7.2 14.8M13.2 8.2l3.6 6.6M8.5 17h7" /></svg>,
  hash: <svg viewBox="0 0 24 24"><path d="M5 9h14M5 15h14M10 4 8 20M16 4l-2 16" /></svg>,
  rules: <svg viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="16" rx="2" /><path d="M9 9h6M9 12h6M9 15h4" /></svg>,
};

const rail = [
  { id: "home", l: "Home", i: I.home },
  { id: "search", l: "Search", i: I.search },
  { id: "notifications", l: "Notifications", i: I.bell },
  { id: "inbox", l: "Inbox", i: I.chat },
  { id: "settings", l: "Settings", i: I.gear },
];

const groups: Record<string, { h: string; items: { id: string; l: string; i: React.ReactNode }[] }[]> = {
  settings: [
    { h: "Personal settings", items: [
      { id: "account", l: "Account details", i: I.user },
      { id: "notifications", l: "Notifications", i: I.bell },
      { id: "security", l: "Security", i: I.lock },
    ] },
    { h: "Workspace settings", items: [
      { id: "general", l: "General", i: I.gear },
      { id: "hours", l: "Business hours", i: I.clock },
      { id: "team", l: "Team", i: I.team },
      { id: "billing", l: "Billing", i: I.billing },
      { id: "channels", l: "Channels", i: I.channels },
      { id: "integrations", l: "Integrations", i: I.plug },
      { id: "tags", l: "Tags", i: I.hash },
      { id: "rules", l: "Rules", i: I.rules },
    ] },
  ],
};

export function Dashboard() {
  const [area, setArea] = useState("settings");
  const [page, setPage] = useState<Record<string, string>>({ settings: "hours" });
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
            onClick={() => { if (r.id === area) setOpen(o => !o); else { setArea(r.id); setOpen(true); } }}>{r.i}</button>)}
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
            onClick={() => setPage(p => ({ ...p, [area]: it.id }))}>{it.i}{it.l}</button>)}
        </div>) : <p className="db-empty">Nothing here yet.</p>}
      </aside>

      <main className="db-main">
        <div className="db-main-head">
          {!open && <button type="button" className="db-icon-btn" aria-label="Expand sidebar" onClick={() => setOpen(true)} style={{ transform: "scaleX(-1)" }}>{I.panel}</button>}
          <h1>{title}</h1>
        </div>
        <p>{area === "settings" ? `Manage ${title.toLowerCase()} for your workspace.` : `Your ${title.toLowerCase()} will show up here.`}</p>
        <div className="db-blank">Content coming soon</div>
      </main>
    </div>
  </div>;
}

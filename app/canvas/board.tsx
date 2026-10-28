"use client";
// Column board for networked notes: keyboard-first, linked notes, backlinks. Our own take, styled to the dashboard. Local to /canvas.
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import type { Icons } from "./cards";

const EASE = [0.23, 1, 0.32, 1] as const;
const COLORS = ["", "#FCE461", "#89F4A2", "#9EC1FF", "#FF9EEF", "#FFBA5B", "#C9B8FF", "#7FE3E0", "#FFB3B3", "#D6D6DA"];
const LINK = /\[\[(.+?)\]\]/g;

export type BNote = { id: string; title: string; body: string; color?: number; tags?: string[] };
export type BCol = { id: string; title: string; emoji?: string; notes: string[] };
type Sel = { c: number; n: number } | null;

const uid = () => Math.random().toString(36).slice(2, 9);
const linksOf = (b: string) => [...b.matchAll(LINK)].map(m => m[1]);

function Inline({ text, onLink }: { text: string; onLink: (t: string) => void }) {
  const parts = text.split(/(\[\[.+?\]\]|`[^`]+`|\*\*[^*]+\*\*|==[^=]+==)/g);
  return <>{parts.map((p, i) => {
    if (p.startsWith("[[")) { const t = p.slice(2, -2); return <button key={i} type="button" className="bd-link" onClick={e => { e.stopPropagation(); onLink(t); }}>{t}</button>; }
    if (p.startsWith("`")) return <code key={i}>{p.slice(1, -1)}</code>;
    if (p.startsWith("**")) return <b key={i}>{p.slice(2, -2)}</b>;
    if (p.startsWith("==")) return <mark key={i}>{p.slice(2, -2)}</mark>;
    return <Fragment key={i}>{p}</Fragment>;
  })}</>;
}

/** Markdown-lite: ## headings (syntax shown faintly), - lists (two-space nesting), paragraphs. */
function Body({ text, onLink }: { text: string; onLink: (t: string) => void }) {
  const blocks = text.split(/\n{2,}/);
  return <div className="bd-body">{blocks.map((b, i) => {
    if (b.startsWith("## ")) return <h4 key={i}><span>## </span>{b.slice(3)}</h4>;
    const lines = b.split("\n");
    if (lines.every(l => /^\s*- /.test(l))) return <ul key={i}>{lines.map((l, j) => <li key={j} data-deep={/^\s{2,}-/.test(l)}><Inline text={l.replace(/^\s*- /, "")} onLink={onLink} /></li>)}</ul>;
    return <p key={i}><Inline text={b} onLink={onLink} /></p>;
  })}</div>;
}

const SHORTCUTS: [string, [string[], string][]][] = [
  ["Capture", [[["Space"], "New note below the selected one"], [["Enter"], "Edit the selected note"], [["Esc"], "Stop editing, then clear the selection"]]],
  ["Navigate", [[["↑", "↓"], "Select a note in the column"], [["←", "→"], "Hop between columns"], [["⌥", "↑↓←→"], "Move the selected note"]]],
  ["Notes", [[["1–9"], "Colour the note"], [["0"], "Clear its colour"], [["/"], "Show or hide “Linked from”"], [["⌫"], "Send the note to the slipbox"]]],
  ["Links", [[["[[ ]]"], "Link to another note while editing"], [["Click"], "Open a link in the next column"], [["?"], "Show these shortcuts"]]],
];

export function NotesColumns({ I, title, notes: initNotes, cols: initCols, height }: { I: Icons; title: string; notes: BNote[]; cols: BCol[]; height: number }) {
  const [notes, setNotes] = useState(() => Object.fromEntries(initNotes.map(n => [n.id, n])));
  const [cols, setCols] = useState(initCols);
  const [sel, setSel] = useState<Sel>(null);
  const [edit, setEdit] = useState(false);
  const [refs, setRefs] = useState<Record<string, boolean>>({});
  const [help, setHelp] = useState(false);
  const [tab, setTab] = useState<"board" | "all">("board");
  const [q, setQ] = useState("");
  const [flash, setFlash] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const area = useRef<HTMLDivElement>(null);

  const all = Object.values(notes);
  const onBoard = new Set(cols.flatMap(c => c.notes));
  const selId = sel ? cols[sel.c]?.notes[sel.n] : undefined;
  const backlinks = useMemo(() => {
    const m: Record<string, BNote[]> = {};
    for (const n of all) for (const t of linksOf(n.body)) { const target = all.find(x => x.title === t); if (target) (m[target.id] ??= []).push(n); }
    return m;
  }, [notes]); // eslint-disable-line react-hooks/exhaustive-deps

  const focusNote = (id: string) => {
    const c = cols.findIndex(col => col.notes.includes(id));
    if (c >= 0) { setSel({ c, n: cols[c].notes.indexOf(id) }); setFlash(id); setTimeout(() => setFlash(f => f === id ? null : f), 700); }
  };
  useEffect(() => {
    if (!selId) return;
    area.current?.querySelector(`[data-note="${selId}"]`)?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  }, [selId]);

  /** Clicking a link: jump to it if it's on the board, otherwise open it in a new column beside the current one. */
  const openLink = (from: number) => (t: string) => {
    let n = all.find(x => x.title === t);
    if (!n) { n = { id: uid(), title: t, body: "" }; const nn = n; setNotes(s => ({ ...s, [nn.id]: nn })); }
    const id = n.id;
    if (onBoard.has(id)) return focusNote(id);
    const at = from + 1;
    setCols(cs => [...cs.slice(0, at), { id: uid(), title: t, notes: [id] }, ...cs.slice(at)]);
    setSel({ c: at, n: 0 });
    if (!n.body) setEdit(true);
  };

  const addBelow = () => {
    const id = uid(), c = sel?.c ?? 0, at = sel ? sel.n + 1 : cols[0].notes.length;
    setNotes(s => ({ ...s, [id]: { id, title: "", body: "" } }));
    setCols(cs => cs.map((col, i) => i === c ? { ...col, notes: [...col.notes.slice(0, at), id, ...col.notes.slice(at)] } : col));
    setSel({ c, n: at }); setEdit(true);
  };
  const moveSel = (dc: number, dn: number) => {
    if (!sel || !selId) return;
    const c2 = Math.max(0, Math.min(cols.length - 1, sel.c + dc));
    setCols(cs => {
      const next = cs.map(col => ({ ...col, notes: col.notes.filter(x => x !== selId) }));
      const n2 = dc ? Math.min(sel.n, next[c2].notes.length) : Math.max(0, Math.min(next[c2].notes.length, sel.n + dn));
      next[c2].notes.splice(n2, 0, selId);
      setSel({ c: c2, n: n2 });
      return next;
    });
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (edit) { if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); setEdit(false); root.current?.focus(); } return; }
    if ((e.target as HTMLElement).closest("input")) { if (e.key === "Escape") root.current?.focus(); return; }
    const k = e.key;
    const handled = () => { e.preventDefault(); e.stopPropagation(); };
    if (k === "?") { handled(); setHelp(h => !h); return; }
    if (help && k === "Escape") { handled(); setHelp(false); return; }
    if (e.altKey && sel && k.startsWith("Arrow")) { handled(); moveSel(k === "ArrowLeft" ? -1 : k === "ArrowRight" ? 1 : 0, k === "ArrowUp" ? -1 : k === "ArrowDown" ? 1 : 0); return; }
    if (k === "ArrowDown" || k === "ArrowUp") {
      handled();
      if (!sel) return setSel({ c: 0, n: 0 });
      const len = cols[sel.c].notes.length;
      setSel({ c: sel.c, n: Math.max(0, Math.min(len - 1, sel.n + (k === "ArrowDown" ? 1 : -1))) });
    } else if (k === "ArrowLeft" || k === "ArrowRight") {
      handled();
      if (!sel) return setSel({ c: 0, n: 0 });
      const c = Math.max(0, Math.min(cols.length - 1, sel.c + (k === "ArrowRight" ? 1 : -1)));
      setSel({ c, n: Math.min(sel.n, Math.max(0, cols[c].notes.length - 1)) });
    } else if (k === "Enter" && selId) { handled(); setEdit(true); }
    else if (k === " ") { handled(); addBelow(); }
    else if (k === "Escape") { handled(); setSel(null); }
    else if (/^[0-9]$/.test(k) && selId) { handled(); const v = Number(k); setNotes(s => ({ ...s, [selId]: { ...s[selId], color: v || undefined } })); }
    else if (k === "/" && selId) { handled(); setRefs(r => ({ ...r, [selId]: !r[selId] })); }
    else if ((k === "Backspace" || k === "Delete") && selId && sel) {
      handled();
      setCols(cs => cs.map((col, i) => i === sel.c ? { ...col, notes: col.notes.filter(x => x !== selId) } : col));
      setSel(s => s && { c: s.c, n: Math.max(0, s.n - 1) });
    }
  };

  const list = (tab === "board" ? all.filter(n => onBoard.has(n.id)) : all).filter(n => n.title.toLowerCase().includes(q.toLowerCase()));
  const tags = [...new Set(all.flatMap(n => n.tags ?? []))];

  return <MotionConfig reducedMotion="user">
    <div ref={root} className="bd" style={{ height }} tabIndex={0} onKeyDown={onKey} aria-label={`${title} board. Press ? for shortcuts.`}>
      <aside className="bd-side">
        <div className="bd-side-head"><span className="bd-back">{I.arrowLeft}</span><b>{title}</b></div>
        <label className="lb-search bd-search">{I.search}<input placeholder="Search titles" value={q} onChange={e => setQ(e.target.value)} /></label>
        <div className="bd-tabs" role="tablist">
          <button type="button" role="tab" aria-selected={tab === "board"} onClick={() => setTab("board")}>This board <span>{onBoard.size}</span></button>
          <button type="button" role="tab" aria-selected={tab === "all"} onClick={() => setTab("all")}>All <span>{all.length}</span></button>
        </div>
        <div className="bd-index">
          {list.map(n => <button key={n.id} type="button" aria-current={n.id === selId} data-off={!onBoard.has(n.id)} onClick={() => onBoard.has(n.id) && focusNote(n.id)}>
            <span>{n.title || "Untitled"}</span>{n.color ? <i style={{ background: COLORS[n.color] }} /> : null}
          </button>)}
        </div>
        <div className="bd-foot">
          {tags.length > 0 && <><h5>Tags</h5><div className="bd-tags">{tags.map(t => <span key={t}>#{t}</span>)}</div></>}
          <button type="button" className="bd-help" onClick={() => setHelp(true)}><kbd>?</kbd>Shortcuts</button>
        </div>
      </aside>

      <div ref={area} className="bd-area">
        {cols.map((col, ci) => <section key={col.id} className="bd-col" data-active={sel?.c === ci}>
          <header className="bd-col-head"><b>{col.emoji ? `${col.emoji} ` : ""}{col.title}</b><span>{col.notes.length}</span></header>
          <AnimatePresence initial={false}>
            {col.notes.map((id, ni) => {
              const n = notes[id], on = sel?.c === ci && sel.n === ni, back = backlinks[id] ?? [], showRefs = refs[id] ?? back.length > 0;
              return <motion.article key={id} layout="position" data-note={id} className="bd-note" data-on={on} data-edit={on && edit} data-flash={flash === id}
                style={n.color ? { background: `color-mix(in srgb, ${COLORS[n.color]} 32%, var(--panel))` } : undefined}
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.22, ease: EASE }}
                onClick={() => { if (!on) { setSel({ c: ci, n: ni }); setEdit(false); } else setEdit(true); root.current?.focus({ preventScroll: true }); }}>
                {on && edit ? <div className="bd-editor" onClick={e => e.stopPropagation()}>
                  <input autoFocus placeholder="Title" value={n.title} onChange={e => setNotes(s => ({ ...s, [id]: { ...s[id], title: e.target.value } }))} />
                  <textarea placeholder="Write… use [[links]], ## headings, - lists" value={n.body} rows={Math.max(4, n.body.split("\n").length + 1)}
                    onChange={e => setNotes(s => ({ ...s, [id]: { ...s[id], body: e.target.value } }))} />
                  <span className="bd-editing">Editing · <kbd>Esc</kbd> to finish</span>
                </div> : <>
                  <h3>{n.title || <span className="bd-untitled">Untitled</span>}</h3>
                  {n.body && <Body text={n.body} onLink={openLink(ci)} />}
                </>}
                {back.length > 0 && <div className="bd-refs" onClick={e => e.stopPropagation()}>
                  <button type="button" className="bd-refs-head" aria-expanded={showRefs} onClick={() => setRefs(r => ({ ...r, [id]: !showRefs }))}>
                    <span className="bd-caret" data-open={showRefs}>{I.chevronRight}</span>Linked from · {back.length}
                  </button>
                  {showRefs && <ol>{back.map(b => {
                    const i = b.body.indexOf(`[[${n.title}]]`), s = Math.max(0, i - 50);
                    const ex = b.body.slice(s, i + n.title.length + 70).replace(LINK, "$1");
                    const [pre, ...rest] = ex.split(n.title);
                    return <li key={b.id}><button type="button" className="bd-link" onClick={() => focusNote(b.id)}>{b.title}</button>
                      <p>{s > 0 ? "…" : ""}{pre}<mark>{n.title}</mark>{rest.join(n.title)}…</p></li>;
                  })}</ol>}
                </div>}
              </motion.article>;
            })}
          </AnimatePresence>
        </section>)}
        <button type="button" className="bd-addcol" aria-label="New column" onClick={() => setCols(cs => [...cs, { id: uid(), title: "New column", notes: [] }])}>{I.plus}</button>
      </div>

      <AnimatePresence>
        {help && <motion.div className="bd-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} onClick={() => setHelp(false)}>
          <motion.div role="dialog" aria-label="Shortcuts" className="bd-sheet" initial={{ opacity: 0, scale: 0.97, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.2, ease: EASE }} onClick={e => e.stopPropagation()}>
            <header><b>Shortcuts</b><button type="button" className="db-icon-btn" aria-label="Close" onClick={() => setHelp(false)}>{I.close}</button></header>
            <div className="bd-sheet-grid">{SHORTCUTS.map(([h, rows]) => <section key={h}><h5>{h}</h5>
              {rows.map(([keys, l]) => <div key={l} className="bd-sc"><span>{keys.map(k => <kbd key={k}>{k}</kbd>)}</span>{l}</div>)}
            </section>)}</div>
          </motion.div>
        </motion.div>}
      </AnimatePresence>
      <p className="bd-status">{edit ? "Editing" : sel ? "Selecting · arrows to move, Enter to edit" : "Click a note or press ↓ to start"} · <kbd>?</kbd></p>
    </div>
  </MotionConfig>;
}

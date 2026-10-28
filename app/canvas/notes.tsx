"use client";
// Networked notes mockups: note card, inbox, stacked panes, board. Local to /canvas until promoted.
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Fragment, useState } from "react";
import type { Icons } from "./cards";
import type { CanvasIconKey } from "./page";

const EASE = [0.23, 1, 0.32, 1] as const;

export type Source = { i: CanvasIconKey; l: string };
export type Note = { id: string; title: string; body: string; source?: Source; tags: string[]; edited: string };
export type Highlight = { id: string; quote: string; source: Source; when: string; color: string };

const LINK = /\[\[(.+?)\]\]/g;
const linksOf = (n: Note) => [...n.body.matchAll(LINK)].map(m => m[1]);
export const backlinks = (notes: Note[], n: Note) => notes.filter(o => o.id !== n.id && linksOf(o).includes(n.title));

function Body({ text, open }: { text: string; open?: (title: string) => void }) {
  return <p className="nt-body">{text.split(LINK).map((part, i) => i % 2
    ? <button key={i} type="button" className="nt-link" onClick={() => open?.(part)}>{part}</button>
    : <Fragment key={i}>{part}</Fragment>)}</p>;
}

function NoteView({ I, note, notes, open }: { I: Icons; note: Note; notes: Note[]; open?: (title: string) => void }) {
  const back = backlinks(notes, note);
  return <>
    <h3 className="nt-title">{note.title}</h3>
    <Body text={note.body} open={open} />
    {note.source && <a href="#" className="nt-source" onClick={e => e.preventDefault()}>{I[note.source.i]}{note.source.l}</a>}
    <div className="nt-tags">{note.tags.map(t => <span key={t}>#{t}</span>)}<span className="nt-edited">{note.edited}</span></div>
    {back.length > 0 && <div className="nt-back">
      <h4>{back.length} backlink{back.length > 1 ? "s" : ""}</h4>
      {back.map(b => <button key={b.id} type="button" className="nt-back-row" onClick={() => open?.(b.title)}>
        <b>{b.title}</b><span>{b.body.replace(LINK, "$1").slice(0, 72)}…</span>
      </button>)}
    </div>}
  </>;
}

export function NoteCard({ I, note, notes }: { I: Icons; note: Note; notes: Note[] }) {
  return <article className="cv-card nt-card"><NoteView I={I} note={note} notes={notes} /></article>;
}

export function NotesInbox({ I, items }: { I: Icons; items: Highlight[] }) {
  const [left, setLeft] = useState(items);
  const [made, setMade] = useState<string[]>([]);
  const done = (id: string) => setLeft(l => l.filter(h => h.id !== id));
  return <MotionConfig reducedMotion="user">
    <section className="pg nt-inbox">
      <header className="nt-inbox-head">
        <h1>Inbox</h1>
        <p className="pg-desc">Highlights from Library and Learn. Turn each one into a note in your own words, or archive it.</p>
        <p className="pg-meta">{left.length} to process</p>
      </header>
      <ul className="nt-hl-list">
        <AnimatePresence initial={false}>
          {left.map(h => <motion.li key={h.id} layout exit={{ opacity: 0, x: 24, transition: { duration: 0.18, ease: EASE } }} transition={{ duration: 0.25, ease: EASE }}>
            <blockquote style={{ borderColor: h.color }}>{h.quote}</blockquote>
            <div className="nt-hl-foot">
              <span className="nt-source nt-source-sm">{I[h.source.i]}{h.source.l}<span className="nt-dot">·</span>{h.when}</span>
              <span className="nt-hl-actions">
                <button type="button" className="cv-btn" aria-pressed={made.includes(h.id)} onClick={() => setMade(m => [...m, h.id])}>{made.includes(h.id) ? <>{I.check}Note created</> : <>{I.note}Make note</>}</button>
                <button type="button" className="db-icon-btn" aria-label="Link to a note" title="Link to a note">{I.link}</button>
                <button type="button" className="db-icon-btn" aria-label="Archive" title="Archive" onClick={() => done(h.id)}>{I.archive}</button>
              </span>
            </div>
          </motion.li>)}
        </AnimatePresence>
        {!left.length && <li className="nt-empty">{I.check}Inbox zero. Everything's been processed.<button type="button" onClick={() => setLeft(items)}>Reset</button></li>}
      </ul>
    </section>
  </MotionConfig>;
}

/** Linked notes open to the right; older panes fold into spines so the thread stays visible. */
export function StackedPanes({ I, notes, start, width }: { I: Icons; notes: Note[]; start: string; width: number }) {
  const [stack, setStack] = useState<string[]>([start]);
  const PANE = 360, SPINE = 40;
  const full = Math.max(1, Math.floor((width - SPINE * (stack.length - 1)) / PANE));
  const open = (from: number) => (title: string) => {
    const n = notes.find(x => x.title === title);
    if (n) setStack(s => [...s.slice(0, from + 1).filter(id => id !== n.id), n.id]);
  };
  return <MotionConfig reducedMotion="user">
    <div className="nt-panes" style={{ width }}>
      <AnimatePresence initial={false} mode="popLayout">
        {stack.map((id, i) => {
          const n = notes.find(x => x.id === id)!, folded = i < stack.length - full;
          return <motion.section key={id} layout className="nt-pane" data-folded={folded}
            initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0, width: folded ? SPINE : PANE }} exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.3, ease: EASE }}>
            {folded
              ? <button type="button" className="nt-spine" onClick={() => setStack(s => s.slice(0, i + 1))}>{n.title}</button>
              : <div className="nt-pane-in">
                <div className="nt-pane-bar">
                  <span>{i === 0 ? "Note" : `${i + 1} deep`}</span>
                  {i > 0 && <button type="button" className="db-icon-btn" aria-label="Close pane" onClick={() => setStack(s => s.slice(0, i))}>{I.close}</button>}
                </div>
                <NoteView I={I} note={n} notes={notes} open={open(i)} />
              </div>}
          </motion.section>;
        })}
      </AnimatePresence>
      <p className="nt-hint">Click a <span className="nt-link">link</span> to open it beside this note.</p>
    </div>
  </MotionConfig>;
}

export type BoardNode = { id: string; x: number; y: number; kind: "note" | "source"; title: string; sub: string; i?: CanvasIconKey };

export function NotesBoard({ I, title, nodes, edges }: { I: Icons; title: string; nodes: BoardNode[]; edges: [string, string][] }) {
  const [hover, setHover] = useState<string | null>(null);
  const at = (id: string) => nodes.find(n => n.id === id)!;
  const W = 180, H = 64;
  return <section className="nt-board">
    <header className="nt-board-head">
      <span className="cv-chip">{I.board}</span>
      <span><b>{title}</b><span>Board · {nodes.filter(n => n.kind === "note").length} notes · {nodes.filter(n => n.kind === "source").length} sources</span></span>
    </header>
    <div className="nt-board-area">
      <svg className="nt-edges" aria-hidden="true">
        {edges.map(([a, b]) => { const p = at(a), q = at(b), on = hover === a || hover === b;
          return <line key={a + b} x1={p.x + W / 2} y1={p.y + H / 2} x2={q.x + W / 2} y2={q.y + H / 2} data-on={on} />; })}
      </svg>
      {nodes.map(n => <button key={n.id} type="button" className="nt-node" data-kind={n.kind} data-dim={!!hover && hover !== n.id && !edges.some(e => e.includes(hover) && e.includes(n.id))}
        style={{ left: n.x, top: n.y, width: W, height: H }} onPointerEnter={() => setHover(n.id)} onPointerLeave={() => setHover(null)} onFocus={() => setHover(n.id)} onBlur={() => setHover(null)}>
        {n.i && <span className="nt-node-i">{I[n.i]}</span>}
        <span className="nt-node-t"><b>{n.title}</b><span>{n.sub}</span></span>
      </button>)}
    </div>
  </section>;
}

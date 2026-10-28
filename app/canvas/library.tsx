"use client";
// Library mockups: books (PDFs), docs sets, links, focus-mode reader, highlight popup. Local to /canvas until promoted.
import { useState } from "react";
import type { Icons } from "./cards";

export type Book = { title: string; author: string; page: number; pages: number; highlights: number; hue: number };
export type DocSet = { name: string; host: string; kind: string; read: number; pages: number; letter: string; color: string };
export type Link = { title: string; url: string; note: string; group: string };

export function BookCard({ I, b }: { I: Icons; b: Book }) {
  const pct = Math.round((b.page / b.pages) * 100);
  return <article className="lb-book">
    <div className="lb-cover" style={{ background: `linear-gradient(160deg, hsl(${b.hue} 70% 72%), hsl(${(b.hue + 40) % 360} 65% 58%))` }}>
      <span>{b.title}</span><i>{b.author}</i>
    </div>
    <h3>{b.title}</h3>
    <p className="lb-sub">{b.author}</p>
    <div className="cv-progress"><b><i style={{ width: `${pct}%` }} /></b><span>p. {b.page}</span></div>
    <p className="lb-sub lb-row">{I.highlight}{b.highlights} highlights</p>
  </article>;
}

export function DocSetCard({ I, d }: { I: Icons; d: DocSet }) {
  return <article className="cv-card">
    <div className="cv-row">
      <span className="cv-chip lb-letter" style={{ color: d.color }}>{d.letter}</span>
      <span className="cv-pill">{d.kind}</span>
    </div>
    <h3 style={{ marginTop: 20 }}>{d.name}</h3>
    <p className="cv-desc lb-host">{I.globe}{d.host}</p>
    <div className="cv-progress"><b><i style={{ width: `${Math.round((d.read / d.pages) * 100)}%` }} /></b><span>{d.read}/{d.pages} pages</span></div>
    <div className="cv-actions">
      <button type="button" className="cv-btn">Continue reading</button>
      <a href="#" className="cv-link" onClick={e => e.preventDefault()}>Contents{I.chevronRight}</a>
    </div>
  </article>;
}

export function LibraryPage({ I, books, docs, links }: { I: Icons; books: Book[]; docs: DocSet[]; links: Link[] }) {
  const [shelf, setShelf] = useState<"books" | "docs" | "links">("books");
  const tabs = [["books", "Books", books.length], ["docs", "Docs", docs.length], ["links", "Links", links.length]] as const;
  return <div className="pg">
    <header className="pg-head">
      <h1>Library</h1>
      <p className="pg-desc">Books, documentation, and links you're studying. Highlights and notes from all of it land in Notes.</p>
    </header>
    <div className="lb-bar">
      <div className="lb-tabs" role="tablist">
        {tabs.map(([id, l, n]) => <button key={id} type="button" role="tab" aria-selected={shelf === id} onClick={() => setShelf(id)}>{l}<span>{n}</span></button>)}
      </div>
      <label className="lb-search">{I.search}<input placeholder={`Search ${shelf}`} /></label>
    </div>
    {shelf === "books" && <div className="lb-shelf">{books.map(b => <BookCard key={b.title} I={I} b={b} />)}</div>}
    {shelf === "docs" && <div className="pg-grid">{docs.map(d => <DocSetCard key={d.name} I={I} d={d} />)}</div>}
    {shelf === "links" && <div className="lb-links">{links.map(l => <a key={l.url} href="#" onClick={e => e.preventDefault()} className="fd-row">
      <span className="fd-row-t"><b>{l.title}</b><span>{l.note}</span></span>
      <span className="cv-pill">{l.group}</span>
    </a>)}</div>}
  </div>;
}

export function HighlightPopup({ I }: { I: Icons }) {
  const [c, setC] = useState(0);
  return <div className="lb-pop" role="toolbar" aria-label="Selection">
    {["#FCE461", "#89F4A2", "#9EC1FF", "#FF9EEF"].map((col, i) => <button key={col} type="button" className="lb-swatch" aria-label={`Highlight color ${i + 1}`} aria-pressed={c === i} onClick={() => setC(i)} style={{ background: col }} />)}
    <span className="cv-sep" />
    <button type="button">{I.highlight}Highlight</button>
    <button type="button">{I.note}Add note</button>
    <button type="button" aria-label="Copy">{I.copy}</button>
  </div>;
}

export function ReaderFocus({ I, book }: { I: Icons; book: Book }) {
  const [focus, setFocus] = useState(true);
  return <div className="lb-reader" data-focus={focus}>
    <div className="lb-top">
      <button type="button" className="db-icon-btn" aria-label="Back to Library">{I.arrowLeft}</button>
      <span className="lb-title"><b>{book.title}</b><span>{book.author}</span></span>
      <span className="lb-page">p. {book.page} / {book.pages}</span>
      <button type="button" className="db-icon-btn" aria-label="Contents">{I.toc}</button>
      <button type="button" className="db-icon-btn" aria-label="Search in book">{I.search}</button>
      <button type="button" className="db-icon-btn" aria-label={focus ? "Exit focus mode" : "Focus mode"} aria-pressed={focus} onClick={() => setFocus(f => !f)}>{I.focus}</button>
    </div>
    <div className="lb-progress"><i style={{ width: `${(book.page / book.pages) * 100}%` }} /></div>
    <div className="lb-spread">
      <article className="lb-page-sheet">
        <p className="lb-chapter">Chapter 4 · The agent loop</p>
        <h2>Observe, decide, act</h2>
        <p>Every agent, however elaborate, runs some version of the same loop. It observes the state of the world, decides what to do next, and acts. Then it looks again.</p>
        <p><mark>The quality of an agent is mostly the quality of its loop: what it chooses to look at, how it decides, and when it knows to stop.</mark> Models get better every year, but a loop that never checks its own work stays brittle.</p>
        <p>A useful exercise is to write the loop down in plain language before writing any code. If you cannot say when the agent should stop, it will not know either.</p>
        <div className="lb-selection-anchor"><HighlightPopup I={I} /></div>
      </article>
      <aside className="lb-margin" aria-label="Margin notes">
        <div className="lb-note">
          <span className="lb-note-mark" />
          <p>This is the B01 idea of model + tools + loop + memory. Link to Lesson 3.</p>
          <span className="lb-note-meta">{I.note}Linked to B01 · Lesson 3</span>
        </div>
      </aside>
    </div>
  </div>;
}

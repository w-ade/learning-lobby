"use client";
// Resource docs: bookmark sets per tool, styled off the Learn track cards. Pins and added links live in this browser for now.
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { categories, docTools, type DocLink, type DocTool } from "./resources-data";
import type { IconKey } from "./page";

type Icons = Record<IconKey, React.ReactNode>;
const EASE = [0.23, 1, 0.32, 1] as const;
const KEY = "ll-resources";
const LIMIT = 3;

type Saved = { pins: string[]; added: Record<string, DocLink[]> };
// Dark letter on light brand colors, white on the rest.
const onColor = (hex: string) => { const n = parseInt(hex.slice(1), 16), [r, g, b] = [n >> 16, (n >> 8) & 255, n & 255]; return 0.299 * r + 0.587 * g + 0.114 * b > 160 ? "#111119" : "#FFFFFF"; };
const host = (u: string) => { try { return new URL(u).host.replace(/^www\./, ""); } catch { return u; } };
const kindIcon: Record<DocLink["kind"], IconKey> = { Docs: "book", Guide: "note", Reference: "layers", API: "stack", Tutorial: "play", Examples: "flask" };

function ToolCard({ I, t, pinned, added, onPin, onAdd }: { I: Icons; t: DocTool; pinned: boolean; added: DocLink[]; onPin: () => void; onAdd: (l: DocLink) => void }) {
  const [all, setAll] = useState(false);
  const [adding, setAdding] = useState(false);
  const [url, setUrl] = useState("");
  const links = [...t.links, ...added];
  const shown = all ? links : links.slice(0, LIMIT);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const u = /^https?:\/\//.test(url.trim()) ? url.trim() : "https://" + url.trim();
    if (!url.trim()) return;
    onAdd({ kind: "Docs", title: host(u), url: u }); setUrl(""); setAdding(false); setAll(true);
  };

  return <article className="fd-sug ln-card rs-card" data-pinned={pinned || undefined}>
    <div className="fd-sug-body">
      <div className="rs-top">
        <div className="fd-icons">
          <span className="ln-mark rs-mark" style={{ background: t.color, color: onColor(t.color) }}>{t.letter}</span>
          <span className="rs-cat">{t.cat}</span>
        </div>
        {pinned && <span className="rs-pin" aria-label="Pinned">{I.bookmark}</span>}
      </div>
      <h3>{t.name}</h3>
      <p>{t.desc}</p>
      <p className="ln-meta">{host(t.home)} · {links.length} link{links.length === 1 ? "" : "s"}</p>
      <p className="fd-why">{I.sparkle}Used in {t.used.map(u => u.length === 1 ? `Track ${u}` : u).join(" · ")}</p>
      <MotionConfig reducedMotion="user">
        <motion.ol className="fd-steps rs-links" layout="size" transition={{ duration: 0.25, ease: EASE }}>
          <AnimatePresence initial={false}>
            {shown.map(l => <motion.li key={l.url} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.1 } }} transition={{ duration: 0.22, ease: EASE }}>
              <a href={l.url} target="_blank" rel="noreferrer">
                <span className="fd-step-i">{I[kindIcon[l.kind]]}</span>
                <span className="rs-link-t"><span className="fd-k">{l.kind}:</span> {l.title}</span>
                <span className="rs-host">{host(l.url)}</span>
              </a>
            </motion.li>)}
          </AnimatePresence>
        </motion.ol>
      </MotionConfig>
      {links.length > LIMIT && <button type="button" className="ln-more" aria-expanded={all} onClick={() => setAll(a => !a)}>
        {all ? "Show less" : `${links.length - LIMIT} more link${links.length - LIMIT === 1 ? "" : "s"}`}
        <motion.span animate={{ rotate: all ? -90 : 90 }} transition={{ duration: 0.2, ease: EASE }}>{I.chevronRight}</motion.span>
      </button>}
      <AnimatePresence initial={false}>
        {adding && <motion.form key="add" className="rs-add" onSubmit={submit}
          initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22, ease: EASE }}>
          <div className="rs-add-row">
            <input autoFocus value={url} onChange={e => setUrl(e.target.value)} placeholder="Paste a link" aria-label={`Add a link to ${t.name}`}
              onKeyDown={e => { if (e.key === "Escape") setAdding(false); }} />
            <button type="submit">Add</button>
          </div>
        </motion.form>}
      </AnimatePresence>
    </div>
    <div className="fd-tray">
      <a className="fd-primary rs-open" href={t.home} target="_blank" rel="noreferrer">{I.globe}Open docs</a>
      <div className="fd-split">
        <button type="button" aria-expanded={adding} onClick={() => setAdding(a => !a)}>{I.plus}Add link</button>
        <button type="button" aria-pressed={pinned} onClick={onPin}>{I.bookmark}{pinned ? "Pinned" : "Pin"}</button>
      </div>
    </div>
  </article>;
}

export function ResourceDocs({ I }: { I: Icons }) {
  const [saved, setSaved] = useState<Saved>({ pins: [], added: {} });
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");
  useEffect(() => { try { const d = JSON.parse(localStorage.getItem(KEY) ?? "null"); if (d && Array.isArray(d.pins)) setSaved({ pins: d.pins, added: d.added ?? {} }); } catch {} }, []);
  const save = (s: Saved) => { setSaved(s); try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {} };
  const pin = (id: string) => save({ ...saved, pins: saved.pins.includes(id) ? saved.pins.filter(x => x !== id) : [...saved.pins, id] });
  const add = (id: string, l: DocLink) => save({ ...saved, added: { ...saved.added, [id]: [...(saved.added[id] ?? []), l] } });

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return docTools
      .filter(t => cat === "All" || t.cat === cat)
      .filter(t => !s || [t.name, t.desc, t.cat, ...t.links.map(l => l.title)].some(x => x.toLowerCase().includes(s)))
      .sort((a, b) => Number(saved.pins.includes(b.id)) - Number(saved.pins.includes(a.id)));
  }, [q, cat, saved.pins]);
  const total = docTools.reduce((n, t) => n + t.links.length + (saved.added[t.id]?.length ?? 0), 0);

  return <div className="ln rs" data-layout="grid">
    <header className="ln-head">
      <div className="fd-hello">
        <h2>Resource docs</h2>
        <p>{docTools.length} tools · {total} links</p>
      </div>
      <label className="rs-search">{I.search}<input value={q} onChange={e => setQ(e.target.value)} placeholder="Search docs" aria-label="Search docs" /></label>
    </header>
    <div className="rs-chips" role="radiogroup" aria-label="Category">
      {["All", ...categories].map(c => <button key={c} type="button" role="radio" aria-checked={cat === c} onClick={() => setCat(c)}>{c}</button>)}
    </div>
    <MotionConfig reducedMotion="user">
      <motion.div className="ln-grid" layout>
        <AnimatePresence initial={false} mode="popLayout">
          {list.map(t => <motion.div key={t.id} layout initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.12 } }} transition={{ duration: 0.28, ease: EASE }}>
            <ToolCard I={I} t={t} pinned={saved.pins.includes(t.id)} added={saved.added[t.id] ?? []} onPin={() => pin(t.id)} onAdd={l => add(t.id, l)} />
          </motion.div>)}
        </AnimatePresence>
      </motion.div>
    </MotionConfig>
    {!list.length && <div className="fd-empty">{I.search}<span>No docs match “{q}”.</span><button type="button" onClick={() => { setQ(""); setCat("All"); }}>Clear</button></div>}
  </div>;
}

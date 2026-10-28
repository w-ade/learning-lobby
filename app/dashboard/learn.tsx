"use client";
// Learn landing: the three tracks as feed-style detail cards. Three layouts to compare: stack, grid, focus.
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useEffect, useState } from "react";
import { counts, tracks, type Track } from "../curriculum";
import type { IconKey } from "./page";

type Icons = Record<IconKey, React.ReactNode>;
const EASE = [0.23, 1, 0.32, 1] as const;

// Placeholder progress until real learner state exists: which course you're on and how far in.
const progress: Record<string, { cur: number; pct: number; why: string }> = {
  a: { cur: -1, pct: 0, why: "Still being written. Read the course outlines in the meantime." },
  b: { cur: 0, pct: 18, why: "Picked up from the feed: two lessons into Module 1." },
  c: { cur: -1, pct: 0, why: "Opens up once you're through Agent Engineering." },
  d: { cur: -1, pct: 0, why: "Starts with a 10-day application sprint: resume, portfolio, and a sprint prototype." },
};

const LAYOUTS = [{ id: "stack", l: "Stack" }, { id: "grid", l: "Grid" }, { id: "focus", l: "Focus" }] as const;
type Layout = typeof LAYOUTS[number]["id"];
const KEY = "ll-learn-layout";

function Mark({ t }: { t: Track }) {
  return <span className="ln-mark" style={{ background: t.color }}>{t.letter}</span>;
}

function Bar({ v, color }: { v: number; color: string }) {
  return <div className="ln-bar" role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100} aria-label="Track progress">
    <b><i style={{ width: `${v}%`, background: color }} /></b><span>{v}%</span>
  </div>;
}

/** One track as a suggestion-style card. The course list expands in place. */
function TrackCard({ I, t, limit = 3 }: { I: Icons; t: Track; limit?: number }) {
  const [all, setAll] = useState(false);
  const p = progress[t.slug];
  const ready = t.courses.filter(c => c.ready);
  const mods = t.courses.reduce((n, c) => n + c.modules.length, 0);
  const labs = t.courses.reduce((n, c) => n + counts(c).labs, 0);
  const shown = all ? t.courses : t.courses.slice(0, limit);
  const cur = p.cur >= 0 ? t.courses[p.cur] : undefined;

  return <article className="fd-sug ln-card">
    <div className="fd-sug-body">
      <div className="fd-icons">
        <Mark t={t} />
        <span className="fd-tag-i">{I.book}</span>
        {labs > 0 && <span className="fd-tag-i">{I.flask}</span>}
      </div>
      <h3>{t.title}</h3>
      <p>{t.desc}</p>
      <p className="ln-meta">{t.courses.length} courses · {mods ? `${mods} modules` : "in planning"}{labs ? ` · ${labs} labs` : ""}{ready.length && ready.length < t.courses.length ? ` · ${ready.length} ready` : ""}</p>
      {p.pct > 0 && <Bar v={p.pct} color={t.color} />}
      <p className="fd-why">{I.sparkle}{p.why}</p>
      <MotionConfig reducedMotion="user">
        <motion.ol className="fd-steps" layout="size" transition={{ duration: 0.25, ease: EASE }}>
          <AnimatePresence initial={false}>
            {shown.map((c, i) => <motion.li key={c.code} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.1 } }} transition={{ duration: 0.22, ease: EASE }}
              data-cur={i === p.cur || undefined} data-done={i < p.cur || undefined} data-planned={!c.ready || undefined}>
              <span className="fd-step-i">{i < p.cur ? I.check : i === p.cur ? I.play : I.stack}</span>
              <span><span className="fd-k">{c.code}:</span> {c.title}</span>
            </motion.li>)}
          </AnimatePresence>
        </motion.ol>
      </MotionConfig>
      {t.courses.length > limit && <button type="button" className="ln-more" aria-expanded={all} onClick={() => setAll(a => !a)}>
        {all ? "Show less" : `${t.courses.length - limit} more courses`}
        <motion.span animate={{ rotate: all ? -90 : 90 }} transition={{ duration: 0.2, ease: EASE }}>{I.chevronRight}</motion.span>
      </button>}
    </div>
    <div className="fd-tray">
      <button type="button" className="fd-primary">{I.play}{cur ? `Continue ${cur.code}` : ready.length ? "Start track" : "Read the outline"}</button>
      <div className="fd-split">
        <button type="button">{I.layers}Syllabus</button>
        <button type="button">{I.bookmark}Save</button>
      </div>
    </div>
  </article>;
}

function Stack({ I }: { I: Icons }) {
  return <div className="ln-stack">{tracks.map(t => <TrackCard key={t.slug} I={I} t={t} />)}</div>;
}

function Grid({ I }: { I: Icons }) {
  return <div className="ln-grid">{tracks.map(t => <TrackCard key={t.slug} I={I} t={t} limit={4} />)}</div>;
}

/** Current track up top, the others as rows; picking a row swaps it in. */
function Focus({ I }: { I: Icons }) {
  const [on, setOn] = useState("b");
  const t = tracks.find(x => x.slug === on)!;
  return <MotionConfig reducedMotion="user">
    <div className="ln-stack">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div key={on} initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.15, ease: EASE } }} transition={{ duration: 0.3, ease: EASE }}>
          <TrackCard I={I} t={t} limit={5} />
        </motion.div>
      </AnimatePresence>
      <motion.section layout className="fd-group">
        <h4>Other tracks</h4>
        {tracks.filter(x => x.slug !== on).map(x => <motion.button layout key={x.slug} type="button" className="fd-row" onClick={() => setOn(x.slug)} transition={{ duration: 0.3, ease: EASE }}>
          <Mark t={x} />
          <span className="fd-row-t">
            <b>{x.title}</b>
            <span>{progress[x.slug].pct ? `${progress[x.slug].pct}% · ` : ""}{x.courses.length} courses</span>
          </span>
          <span className="ln-row-go">{I.chevronRight}</span>
        </motion.button>)}
      </motion.section>
    </div>
  </MotionConfig>;
}

export function LearnTracks({ I }: { I: Icons }) {
  const [layout, setLayout] = useState<Layout>("stack");
  useEffect(() => { try { const v = localStorage.getItem(KEY); if (LAYOUTS.some(l => l.id === v)) setLayout(v as Layout); } catch {} }, []);
  const pick = (v: Layout) => { setLayout(v); try { localStorage.setItem(KEY, v); } catch {} };

  return <div className="ln" data-layout={layout}>
    <header className="ln-head">
      <div className="fd-hello">
        <h2>Learn</h2>
        <p>Pick up where you left off.</p>
      </div>
      <div className="ln-seg" role="radiogroup" aria-label="Prototype layout">
        {LAYOUTS.map(l => <button key={l.id} type="button" role="radio" aria-checked={layout === l.id} onClick={() => pick(l.id)}>{l.l}</button>)}
      </div>
    </header>
    {layout === "stack" ? <Stack I={I} /> : layout === "grid" ? <Grid I={I} /> : <Focus I={I} />}
  </div>;
}

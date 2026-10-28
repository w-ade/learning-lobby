"use client";
// Overview feed: greeting, suggestion stack, up-next list, completed row. Also previewed on /canvas.
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useState } from "react";
export type FeedIconKey = "sparkle" | "check" | "play" | "calendar" | "thumbsDown" | "chevronRight" | "book" | "flask" | "note" | "stack" | "layers";
type Icons = Record<FeedIconKey, React.ReactNode>;

const EASE = [0.23, 1, 0.32, 1] as const;

export type Step = { i: FeedIconKey; k: string; v: string };
export type Suggestion = { id: string; kind: FeedIconKey[]; title: string; desc: string; why: string; steps: Step[]; cta: string };
export type Row = { title: string; i: FeedIconKey; k: string; v: string; tags: FeedIconKey[] };

export function FeedGreeting({ title, sub }: { title: string; sub: string }) {
  return <header className="fd-hello">
    <span className="fd-mark" aria-hidden="true"><i /></span>
    <h2>{title}</h2>
    <p>{sub}</p>
  </header>;
}

function Steps({ I, steps }: { I: Icons; steps: Step[] }) {
  return <ol className="fd-steps">
    {steps.map(s => <li key={s.k + s.v}><span className="fd-step-i">{I[s.i]}</span><span><span className="fd-k">{s.k}:</span> {s.v}</span></li>)}
  </ol>;
}

export function SuggestionStack({ I, items }: { I: Icons; items: Suggestion[] }) {
  const [gone, setGone] = useState<string[]>([]);
  const [done, setDone] = useState<string[]>([]);
  const queue = items.filter(s => !gone.includes(s.id));
  const [top, ...rest] = queue;
  const skip = (id: string) => setGone(g => [...g, id]);

  return <MotionConfig reducedMotion="user">
    <section className="fd-stack" aria-label="Suggested for you">
      <AnimatePresence initial={false}>
        {rest.slice(0, 2).map((s, i) => <motion.div key={"ghost-" + s.id} className="fd-ghost" aria-hidden="true"
          initial={{ opacity: 0, y: -(i + 1) * 10, scale: 1 - (i + 1) * 0.04 }}
          animate={{ opacity: 1, y: -(i + 1) * 10, scale: 1 - (i + 1) * 0.04 }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
          transition={{ duration: 0.3, ease: EASE }} style={{ zIndex: 2 - i }} />)}
      </AnimatePresence>
      <AnimatePresence initial={false} mode="popLayout">
        {top ? <motion.article key={top.id} className="fd-sug"
          initial={{ opacity: 0.6, y: -10, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.98, transition: { duration: 0.18, ease: EASE } }}
          transition={{ duration: 0.32, ease: EASE }} style={{ zIndex: 3 }}>
          <div className="fd-sug-body">
            <div className="fd-icons">
              <span className="fd-agent">{I.sparkle}</span>
              {top.kind.map(k => <span key={k} className="fd-tag-i">{I[k]}</span>)}
            </div>
            <h3>{top.title}</h3>
            <p>{top.desc}</p>
            <p className="fd-why">{I.sparkle}{top.why}</p>
            <Steps I={I} steps={top.steps} />
          </div>
          <div className="fd-tray">
            <button type="button" className="fd-primary" aria-pressed={done.includes(top.id)}
              onClick={() => setDone(d => d.includes(top.id) ? d.filter(x => x !== top.id) : [...d, top.id])}>
              {done.includes(top.id) ? <>{I.check}Started</> : <>{I.play}{top.cta}</>}
            </button>
            <div className="fd-split">
              <button type="button" onClick={() => skip(top.id)}>{I.calendar}Reschedule</button>
              <button type="button" onClick={() => skip(top.id)}>{I.thumbsDown}Not now</button>
            </div>
          </div>
        </motion.article> : <motion.div key="empty" className="fd-empty" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: EASE }}>
          {I.check}<span>You're all caught up for today.</span>
          <button type="button" onClick={() => setGone([])}>Show again</button>
        </motion.div>}
      </AnimatePresence>
    </section>
  </MotionConfig>;
}

export function UpNext({ I, title, rows }: { I: Icons; title: string; rows: Row[] }) {
  return <section className="fd-group">
    <h4>{title}</h4>
    {rows.map(r => <button key={r.title} type="button" className="fd-row">
      <span className="fd-row-t">
        <b>{r.title}</b>
        <span>{I[r.i]}<span className="fd-k">{r.k}:</span> {r.v}</span>
      </span>
      <span className="fd-row-tags">{r.tags.map(t => <span key={t} className="fd-tag-i">{I[t]}</span>)}</span>
    </button>)}
  </section>;
}

export function CompletedRow({ I, items }: { I: Icons; items: { title: string; when: string }[] }) {
  const [open, setOpen] = useState(false);
  return <MotionConfig reducedMotion="user">
    <section className="fd-done">
      <button type="button" className="fd-done-head" aria-expanded={open} onClick={() => setOpen(o => !o)}>
        <span className="fd-done-check">{I.check}</span>Completed <span className="fd-count">[{items.length}]</span>
        <motion.span className="fd-chev" animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.2, ease: EASE }}>{I.chevronRight}</motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && <motion.ul key="list" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: EASE }}>
          {items.map(it => <li key={it.title}><span>{it.title}</span><span className="fd-when">{it.when}</span></li>)}
        </motion.ul>}
      </AnimatePresence>
    </section>
  </MotionConfig>;
}

export function OverviewFeed({ I, greeting, suggestions, upNext, completed }: {
  I: Icons; greeting: { title: string; sub: string }; suggestions: Suggestion[]; upNext: Row[]; completed: { title: string; when: string }[];
}) {
  return <div className="fd-feed">
    <FeedGreeting {...greeting} />
    <SuggestionStack I={I} items={suggestions} />
    <UpNext I={I} title="Up next" rows={upNext} />
    <CompletedRow I={I} items={completed} />
  </div>;
}

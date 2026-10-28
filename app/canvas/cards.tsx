"use client";
// Card mockups for the dashboard: Track, Course, Module, Lesson, Lab. Local to /canvas until promoted.
import { useState } from "react";
import type { CanvasIconKey } from "./page";

export type Icons = Record<CanvasIconKey, React.ReactNode>;

function Progress({ v }: { v: number }) {
  return <div className="cv-progress" role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100} aria-label="Progress">
    <b><i style={{ width: `${v}%` }} /></b><span>{v}%</span>
  </div>;
}

function Actions({ I, primary, link }: { I: Icons; primary: string; link: string }) {
  return <div className="cv-actions">
    <button type="button" className="cv-btn">{primary}</button>
    <a href="#" className="cv-link" onClick={e => e.preventDefault()}>{link}{I.chevronRight}</a>
  </div>;
}

export function TrackCard({ I, label, title, desc, courses, modules, progress, color }: { I: Icons; label: string; title: string; desc: string; courses: number; modules: number; progress: number; color: string }) {
  return <article className="cv-card">
    <span className="cv-chip" style={{ color }}>{I.layers}</span>
    <p className="cv-eyebrow">{label}</p>
    <h3>{title}</h3>
    <p className="cv-desc">{desc}</p>
    <p className="cv-meta">{courses} courses · {modules} modules</p>
    <Progress v={progress} />
    <Actions I={I} primary="Continue track" link="View courses" />
  </article>;
}

export function CourseCard({ I, code, group, title, desc, modules, lessons, labs, progress }: { I: Icons; code: string; group: string; title: string; desc: string; modules: number; lessons: number; labs: number; progress?: number }) {
  return <article className="cv-card">
    <span className="cv-chip">{I.book}</span>
    <p className="cv-eyebrow">{code} · {group}</p>
    <h3>{title}</h3>
    <p className="cv-desc">{desc}</p>
    <p className="cv-meta">{modules} modules · {lessons} lessons · {labs} labs</p>
    {progress !== undefined && <Progress v={progress} />}
    <Actions I={I} primary="Continue" link="Syllabus" />
  </article>;
}

export function ModuleCard({ I, code, n, title, lessons, done }: { I: Icons; code: string; n: number; title: string; lessons: string[]; done: number }) {
  return <article className="cv-card">
    <span className="cv-chip">{I.stack}</span>
    <p className="cv-eyebrow">{code} · Module {n}</p>
    <h3>{title}</h3>
    <ol className="cv-list">
      {lessons.map((l, i) => { const lab = l.startsWith("Lab:"); return <li key={l} data-done={i < done}>
        <span className="cv-list-i">{i < done ? I.check : lab ? I.flask : I.circle}</span>
        <span className="cv-list-t">{l.replace(/^Lab: /, "")}</span>
        {lab && <span className="cv-tag">Lab</span>}
      </li>; })}
    </ol>
    <Actions I={I} primary={done ? "Resume module" : "Start module"} link="Details" />
  </article>;
}

export function LessonCard({ I, code, module, n, title, minutes }: { I: Icons; code: string; module: number; n: number; title: string; minutes: number }) {
  const [done, setDone] = useState(false);
  return <article className="cv-card">
    <div className="cv-row">
      <span className="cv-chip">{I.play}</span>
      <button type="button" className="cv-status" aria-pressed={done} onClick={() => setDone(d => !d)}>{done ? <>{I.check}Completed</> : "Mark complete"}</button>
    </div>
    <p className="cv-eyebrow">{code} · Module {module} · Lesson {n}</p>
    <h3>{title}</h3>
    <p className="cv-meta">{I.clock}{minutes} min read</p>
    <Actions I={I} primary={done ? "Review lesson" : "Start lesson"} link="Notes" />
  </article>;
}

export function LabCard({ I, code, module, title, desc, minutes }: { I: Icons; code: string; module: number; title: string; desc: string; minutes: number }) {
  return <article className="cv-card">
    <span className="cv-chip cv-chip-lab">{I.flask}</span>
    <p className="cv-eyebrow">{code} · Module {module} · Lab</p>
    <h3>{title}</h3>
    <p className="cv-desc">{desc}</p>
    <p className="cv-meta">{I.clock}About {minutes} min · Hands-on</p>
    <Actions I={I} primary="Start lab" link="Instructions" />
  </article>;
}

export function ProjectCard({ I, code, module, title, desc, steps, links }: { I: Icons; code: string; module: number; title: string; desc: string; steps: { l: string; done: boolean }[]; links: { i: CanvasIconKey; l: string }[] }) {
  const [state, setState] = useState(steps);
  const n = state.filter(s => s.done).length, shipped = n === state.length;
  return <article className="cv-card">
    <div className="cv-row">
      <span className="cv-chip">{I.hammer}</span>
      <span className="cv-pill" data-shipped={shipped}>{shipped ? <>{I.check}Shipped</> : "In progress"}</span>
    </div>
    <p className="cv-eyebrow">{code} · Module {module} · Lab project</p>
    <h3>{title}</h3>
    <p className="cv-desc">{desc}</p>
    <ul className="cv-list cv-checks">
      {state.map((s, i) => <li key={s.l} data-done={s.done}>
        <button type="button" className="cv-list-i" aria-pressed={s.done} aria-label={`Mark "${s.l}" ${s.done ? "not done" : "done"}`}
          onClick={() => setState(st => st.map((x, j) => j === i ? { ...x, done: !x.done } : x))}>{s.done ? I.check : I.circle}</button>
        <span className="cv-list-t">{s.l}</span>
      </li>)}
    </ul>
    <p className="cv-meta">{n} of {state.length} steps</p>
    <div className="cv-links">{links.map(l => <a key={l.l} href="#" onClick={e => e.preventDefault()}>{I[l.i]}{l.l}</a>)}</div>
    <Actions I={I} primary={shipped ? "View project" : "Open project"} link="Lab brief" />
  </article>;
}

export function PlannedCourseCard({ I, code, group, title, desc }: { I: Icons; code: string; group?: string; title: string; desc: string }) {
  return <article className="cv-card cv-planned">
    <div className="cv-row">
      <span className="cv-chip">{I.book}</span>
      <span className="cv-pill">In planning</span>
    </div>
    <p className="cv-eyebrow">{code}{group ? ` · ${group}` : ""}</p>
    <h3>{title}</h3>
    <p className="cv-desc">{desc}</p>
    <div className="cv-actions"><a href="#" className="cv-link" onClick={e => e.preventDefault()}>Planning notes{I.chevronRight}</a></div>
  </article>;
}

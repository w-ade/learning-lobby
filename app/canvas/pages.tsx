"use client";
// Learn page mockups: Track, Course, Module, Lesson. Built from app/curriculum.ts. Local to /canvas until promoted.
import { counts, groups, type Course, type Module, type Track } from "../curriculum";
import { CourseCard, ModuleCard, PlannedCourseCard, type Icons } from "./cards";

function Head({ I, crumbs, eyebrow, title, desc, meta }: { I: Icons; crumbs: string[]; eyebrow?: string; title: string; desc?: string; meta?: string }) {
  return <header className="pg-head">
    <nav className="pg-crumbs" aria-label="Breadcrumb">
      {crumbs.map((c, i) => <span key={c}>{i > 0 && I.chevronRight}{i < crumbs.length - 1 ? <a href="#" onClick={e => e.preventDefault()}>{c}</a> : <b>{c}</b>}</span>)}
    </nav>
    {eyebrow && <p className="pg-eyebrow">{eyebrow}</p>}
    <h1>{title}</h1>
    {desc && <p className="pg-desc">{desc}</p>}
    {meta && <p className="pg-meta">{meta}</p>}
  </header>;
}

export function TrackPage({ I, track, limit }: { I: Icons; track: Track; limit?: number }) {
  const ready = track.courses.filter(c => c.ready).length;
  let left = limit ?? Infinity;
  return <div className="pg">
    <Head I={I} crumbs={["Learn", track.title]} eyebrow={`Track ${track.letter}`} title={track.title} desc={track.desc}
      meta={`${track.courses.length} courses · ${ready} ready · ${track.courses.length - ready} in planning`} />
    {groups(track).map(g => {
      if (left <= 0) return null;
      const list = g.courses.slice(0, left); left -= list.length;
      return <section key={g.g} className="pg-section">
        <h2>{g.g}</h2>
        <div className="pg-grid">
          {list.map(c => c.ready
            ? <CourseCard key={c.code} I={I} code={c.code} group={c.group ?? track.title} title={c.title} desc={c.desc} {...counts(c)} />
            : <PlannedCourseCard key={c.code} I={I} code={c.code} group={c.group} title={c.title} desc={c.desc} />)}
        </div>
      </section>;
    })}
  </div>;
}

export function CoursePage({ I, track, course }: { I: Icons; track: Track; course: Course }) {
  const n = counts(course);
  return <div className="pg">
    <Head I={I} crumbs={["Learn", track.title, course.code]} eyebrow={`${course.code}${course.group ? ` · ${course.group}` : ""}`} title={course.title} desc={course.desc}
      meta={`${n.modules} modules · ${n.lessons} lessons · ${n.labs} labs`} />
    {course.outcome && <p className="pg-outcome"><b>You'll walk away with</b>{course.outcome}</p>}
    <section className="pg-section">
      <h2>Modules</h2>
      <div className="pg-grid">
        {course.modules.map(m => <ModuleCard key={m.slug} I={I} code={course.code} n={m.n} title={m.title} lessons={m.items.map(i => (i.kind === "lab" ? "Lab: " : "") + i.title)} done={0} />)}
      </div>
    </section>
  </div>;
}

export function ModulePage({ I, track, course, module }: { I: Icons; track: Track; course: Course; module: Module }) {
  const labs = module.items.filter(i => i.kind === "lab").length;
  return <div className="pg pg-narrow">
    <Head I={I} crumbs={["Learn", track.title, course.code, `Module ${module.n}`]} eyebrow={`${module.code} · ${course.title}`} title={module.title}
      meta={`${module.items.length - labs} lessons · ${labs} lab`} />
    <ol className="pg-items">
      {module.items.map(it => <li key={it.slug}>
        <button type="button" className="pg-item" data-kind={it.kind}>
          <span className="pg-item-n">{it.kind === "lab" ? I.flask : it.n}</span>
          <span className="pg-item-t"><b>{it.title}</b><span>{it.kind === "lab" ? "Lab · hands-on" : `Lesson ${it.n}`}</span></span>
          <span className="pg-item-go">{I.chevronRight}</span>
        </button>
      </li>)}
    </ol>
  </div>;
}

/** Reading view. Sections mirror the lesson's markdown file in content/; empty ones show where to write. */
export function LessonPage({ I, track, course, module, n, file }: { I: Icons; track: Track; course: Course; module: Module; n: number; file: string }) {
  const it = module.items[n - 1], prev = module.items[n - 2], next = module.items[n];
  return <div className="pg pg-read">
    <Head I={I} crumbs={["Learn", track.title, course.code, `Module ${module.n}`, it.kind === "lab" ? "Lab" : `Lesson ${it.n}`]}
      eyebrow={`${course.code} · Module ${module.n} · ${it.kind === "lab" ? "Lab" : `Lesson ${it.n}`}`} title={it.title} />
    {["Objective", "Outline", "Sources"].map(h => <section key={h} className="pg-prose">
      <h2>{h}</h2>
      <p className="pg-empty">Not written yet. Add it under <b>## {h}</b> in <code>{file}</code></p>
    </section>)}
    <nav className="pg-pager" aria-label="Lesson navigation">
      {prev ? <a href="#" onClick={e => e.preventDefault()}><span>Previous</span>{prev.title}</a> : <span />}
      {next && <a href="#" className="pg-next" onClick={e => e.preventDefault()}><span>Next</span>{next.title}</a>}
    </nav>
  </div>;
}

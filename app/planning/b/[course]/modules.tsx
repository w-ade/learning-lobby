"use client";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import type { Mod } from "../../../catalog-data";

export function Modules({ code, mods, icon }: { code: string; mods: Mod[]; icon: React.ReactNode }) {
  const [open, setOpen] = useState<number | null>(null);
  const go = (i: number | null) => {
    const d = document as Document & { startViewTransition?: (f: () => void) => void };
    if (d.startViewTransition) d.startViewTransition(() => flushSync(() => setOpen(i)));
    else setOpen(i);
  };
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") go(null); };
    addEventListener("keydown", k); return () => removeEventListener("keydown", k);
  }, []);
  return <div className="ll-cols ll-grid3">
    {mods.map(([mt, ls], i) => <div key={mt} className={"ll-card ll-mod" + (open === i ? " open" : "")} style={{ viewTransitionName: `m${i}` }}
      onClick={() => go(open === i ? null : i)} role="button" tabIndex={0}>
      <span className="ll-icon">{icon}</span>
      <h2>{code}.{i + 1} / {mt}</h2>
      <p>{ls.length} lessons and labs</p>
      <div className="ll-lesson-pills">
        {ls.map((l, j) => <span key={l} className={"ll-lesson-pill" + (l.startsWith("Lab:") ? " lab" : "")} title={l}>
          Lesson {j + 1}{l.startsWith("Lab:") ? " · Lab" : ""}
        </span>)}
      </div>
      {open === i && <div className="ll-lessons">
        {ls.map((l, j) => <div key={l} className={"ll-lesson" + (l.startsWith("Lab:") ? " lab" : "")} style={{ animationDelay: `${120 + j * 50}ms` }}>
          <h3>{l.startsWith("Lab:") ? "Lab" : `Lesson ${j + 1}`}</h3>
          <p>{l.replace(/^Lab: /, "")}</p>
        </div>)}
      </div>}
    </div>)}
  </div>;
}

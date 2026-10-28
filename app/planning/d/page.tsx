import { Fragment } from "react";
import "../../tree/glide.css";
import "../../split.css";
import Link from "next/link";
import { icon, designCourses, codeD } from "../../catalog-data";
import { Header } from "../header";

export default function Track() {
  return <div className="ll-page">
    <Header title="Design Technologist" sub="Twelve two-week stages from Figma to production. Ship one small build every week, then read every file the AI wrote and change one thing by hand." count={designCourses.length} />
    <div className="ll-cols ll-grid3">
      {designCourses.map((c, n) => <Fragment key={c.t}>{(n === 0 || designCourses[n - 1].g !== c.g) && <div className="ll-group" style={{ gridColumn: "1/-1" }}>{c.g}</div>}{c.m ? <Link href={"/planning/d/" + codeD(n)} className="ll-card ll-link">
        <span className="ll-icon">{icon(c.i)}</span>
        <h2>{codeD(n)} / {c.t}</h2>
        <p>{c.d}</p>
      </Link> : <div className="ll-card ll-empty">
        <span className="ll-icon">{icon(c.i)}</span>
        <h2>{codeD(n)} / {c.t}</h2>
        <p>{c.d}</p>
      </div>}</Fragment>)}
    </div>
  </div>;
}

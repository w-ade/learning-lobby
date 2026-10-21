import { Fragment } from "react";
import "../../tree/glide.css";
import "../../split.css";
import Link from "next/link";
import { icon, businessCourses, codeC } from "../../catalog-data";
import { Header } from "../header";

export default function Track() {
  return <div className="ll-page">
    <Header title="Build & Run a Business with Agents" sub="Build, launch, and operate a real business from zero, with agents as leverage. Yield is the running case study." count={businessCourses.length} />
    <div className="ll-cols ll-grid3">
      {businessCourses.map((c, n) => <Fragment key={c.t}>{(n === 0 || businessCourses[n - 1].g !== c.g) && <div className="ll-group" style={{ gridColumn: "1/-1" }}>{c.g}</div>}{c.m ? <Link href={"/planning/c/" + codeC(n)} className="ll-card ll-link">
        <span className="ll-icon">{icon(c.i)}</span>
        <h2>{codeC(n)} / {c.t}</h2>
        <p>{c.d}</p>
      </Link> : <div className="ll-card ll-empty">
        <span className="ll-icon">{icon(c.i)}</span>
        <h2>{codeC(n)} / {c.t}</h2>
        <p>{c.d}</p>
      </div>}</Fragment>)}
    </div>
  </div>;
}

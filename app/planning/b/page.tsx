import { Fragment } from "react";
import "../../tree/glide.css";
import "../../split.css";
import Link from "next/link";
import { icon, agentCourses, code } from "../../catalog-data";
import { Header } from "../header";

export default function Track() {
  return <div className="ll-page">
    <Header title="Agent Engineering" sub="How agents actually work, from models and tools to loops, memory, safety, and production." count={agentCourses.length} />
    <div className="ll-cols ll-grid3">
      {agentCourses.map((c, n) => <Fragment key={c.t}>{(n === 0 || agentCourses[n - 1].g !== c.g) && <div className="ll-group" style={{ gridColumn: "1/-1" }}>{c.g}</div>}{c.m ? <Link href={"/planning/b/" + code(n)} className="ll-card ll-link">
        <span className="ll-icon">{icon(c.i)}</span>
        <h2>{code(n)} / {c.t}</h2>
        <p>{c.d}</p>
      </Link> : <div className="ll-card ll-empty">
        <span className="ll-icon">{icon(c.i)}</span>
        <h2>{code(n)} / {c.t}</h2>
        <p>{c.d}</p>
      </div>}</Fragment>)}
    </div>
  </div>;
}

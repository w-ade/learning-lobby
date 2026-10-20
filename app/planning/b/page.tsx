import { Fragment } from "react";
import "../../tree/glide.css";
import "../../split.css";
import { icon, agentCourses } from "../../catalog-data";
import { Header } from "../header";

export default function Track() {
  return <div className="ll-page">
    <Header title="Agent Engineering" sub="How agents actually work, from models and tools to loops, memory, safety, and production." count={agentCourses.length} />
    <div className="ll-cols ll-grid3">
      {agentCourses.map((c, n) => <Fragment key={c.t}>{(n === 0 || agentCourses[n - 1].g !== c.g) && <div className="ll-group" style={{ gridColumn: "1/-1" }}>{c.g}</div>}<div className="ll-card">
        <span className="ll-icon">{icon(c.i)}</span>
        <h2>{"B" + String(n + 1).padStart(2, "0")} / {c.t}</h2>
        <p>{c.d}</p>
      </div></Fragment>)}
    </div>
  </div>;
}

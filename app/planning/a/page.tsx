import "../../tree/glide.css";
import "../../split.css";
import { icon, courses } from "../../catalog-data";
import { Header } from "../header";

export default function Track() {
  return <div className="ll-page">
    <Header title="Technical Foundations" sub="The computing, engineering, and platform groundwork everything else is built on." count={courses.length} />
    <div className="ll-cols ll-grid3">
      {courses.map((c, n) => <div key={c.t} className="ll-card">
        <span className="ll-icon">{icon(c.i)}</span>
        <h2>{"A" + String(n + 1).padStart(2, "0")} / {c.t}</h2>
        <p>{c.d}</p>
      </div>)}
    </div>
  </div>;
}

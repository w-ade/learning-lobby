import Link from "next/link";
import "../tree/glide.css";
import "../split.css";

import { icon, courses, agentCourses } from "../catalog-data";

export default function Suggested() {
  return <div className="ll-page">
    <header className="ll-head">
      <div style={{ flex: 1 }}><h1>Learning Labs — Proposed Catalog</h1><p>Chief&apos;s suggested course structure. Trees come next.</p></div>
      <Link href="/themed" className="ll-nav">Themed version</Link>
      <Link href="/" className="ll-nav">Current page</Link>
    </header>
    <h3 className="ll-group">Track A — Technical Foundations</h3>
    <div className="ll-cols ll-grid3">
      {courses.map((c, n) => <div key={c.t} className="ll-card">
        <span className="ll-icon">{icon(c.i)}</span>
        <h2>{String(n + 1).padStart(2, "0")} / {c.t}</h2>
        <p>{c.d}</p>
      </div>)}
    </div>
    <h3 className="ll-group">Track B — Agent Engineering</h3>
    <div className="ll-cols ll-grid3">
      {agentCourses.map((c, n) => <div key={c.t} className="ll-card">
        <span className="ll-icon">{icon(c.i)}</span>
        <h2>B{String(n + 1).padStart(2, "0")} / {c.t}</h2>
        <p>{c.d}</p>
      </div>)}
    </div>
  </div>;
}

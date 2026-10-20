import Link from "next/link";
import { icon, courses, agentCourses } from "../catalog-data";
import "./themed.css";

const lanes = ["c-blue", "c-orange", "c-green", "c-pink", "c-red", "c-yellow"];

function Course({ code, c, tone }: { code: string; c: { t: string; d: string; i: string }; tone: string }) {
  return <div className="rk-card">
    <div className="rk-top">
      <span className="rk-ico">{icon(c.i)}</span>
      <span className={`rk-pill rk-tag ${tone}`}>{code}</span>
    </div>
    <div className="rk-space" />
    <h2>{c.t}</h2>
    <p className="rk-body">{c.d}</p>
  </div>;
}

export default function Themed() {
  return <div className="rk">
    <section className="rk-sheet">
      <header className="rk-head">
        <div><h3>Learning Labs</h3><p className="rk-body">Explore. Understand. Build.</p></div>
        <div className="rk-nav"><Link href="/suggested" className="rk-pill">Plain version</Link><Link href="/" className="rk-pill">Current page</Link></div>
      </header>
      <h4 className="rk-sec">Track A — Technical Foundations</h4>
      <div className="rk-grid">
        {courses.map((c, n) => <Course key={c.t} code={`A${String(n + 1).padStart(2, "0")}`} c={c} tone={lanes[n % lanes.length]} />)}
      </div>

      <h4 className="rk-sec">Track B — Agent Engineering</h4>
      <div className="rk-callout">The priority track. Machinery before frameworks: you build the loop, tools, memory, and guardrails yourself before reaching for an SDK.</div>
      <div className="rk-grid">
        {agentCourses.map((c, n) => <Course key={c.t} code={`B${String(n + 1).padStart(2, "0")}`} c={c} tone="c-red" />)}
      </div>

    </section>
  </div>;
}

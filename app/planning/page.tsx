import Link from "next/link";
import "../tree/glide.css";
import "../split.css";
import { icon, courses, agentCourses, businessCourses } from "../catalog-data";
import { Header } from "./header";

const tracks = [
  { href: "/planning/a", label: "Track A", t: "Technical Foundations", d: "The computing, engineering, and platform groundwork everything else is built on.", n: courses.length, list: courses, i: courses[0].i, bg: "#F2A04A", fg: "#F2A04A" },
  { href: "/planning/b", label: "Track B", t: "Agent Engineering", d: "How agents actually work, from models and tools to loops, memory, safety, and production.", n: agentCourses.length, list: agentCourses, i: agentCourses[0].i, bg: "#E8C928", fg: "#E8C928" },
  { href: "/planning/c", label: "Track C", t: "Build & Run a Business with Agents", d: "Build, launch, and operate a real business from zero, with agents as leverage, not the business model.", n: businessCourses.length, list: businessCourses, i: businessCourses[0].i, bg: "#4CBF6B", fg: "#3FA35B" },
];

export default function Planning() {
  return <div className="ll-page">
    <Header title="Planning" sub="Shaping the curriculum, one track at a time." />
    <div className="ll-cols" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
      {tracks.map(k => <Link key={k.href} href={k.href} className={"ll-card" + ((k as {empty?: boolean}).empty ? " ll-empty" : "")} style={{ textDecoration: "none", color: "inherit", minHeight: 200, background: "transparent", boxShadow: "inset 0 0 0 1px #EDEDED" }}>
        <span className="ll-icon">{icon(k.i)}</span>
        <h2>{k.label} / {k.t}</h2>
        <p>{k.d}</p>
        <span style={{ display: "inline-block", marginTop: 8, padding: "3px 10px", borderRadius: 999, background: "transparent", color: k.fg, border: `1.5px solid ${k.bg}`, fontSize: 12, fontWeight: 500 }}>{(k as {empty?: boolean}).empty ? "In planning" : `${k.n} courses`}</span>
      </Link>)}
    </div>
    {tracks.map((k, ti) => <section key={k.href + "-all"}>
      <h3 className="ll-group" style={{ color: k.fg }}>{k.label} / {k.t}</h3>
      <div className="ll-cols ll-grid3">
        {k.list.map((c, n) => <div key={c.t} className="ll-card" style={{ background: k.bg + "1F", boxShadow: `inset 0 0 0 1px ${k.bg}40` }}>
          <span className="ll-icon" style={{ color: k.fg }}>{icon(c.i)}</span>
          <h2>{"ABC"[ti] + String(n + 1).padStart(2, "0")} / {c.t}</h2>
          <p>{c.d}</p>
        </div>)}
      </div>
    </section>)}
  </div>;
}

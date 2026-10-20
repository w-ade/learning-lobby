import Link from "next/link";
import "../tree/glide.css";
import "../split.css";
import { icon, courses, agentCourses } from "../catalog-data";
import { Header } from "./header";

const tracks = [
  { href: "/planning/a", label: "Track A", t: "Technical Foundations", d: "The computing, engineering, and platform groundwork everything else is built on.", n: courses.length, i: courses[0].i },
  { href: "/planning/b", label: "Track B", t: "Agent Engineering", d: "How agents actually work, from models and tools to loops, memory, safety, and production.", n: agentCourses.length, i: agentCourses[0].i },
];

export default function Planning() {
  return <div className="ll-page">
    <Header title="Planning" sub="Shaping the curriculum, one track at a time." />
    <div className="ll-cols" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
      {tracks.map(k => <Link key={k.href} href={k.href} className="ll-card" style={{ textDecoration: "none", color: "inherit", minHeight: 200 }}>
        <span className="ll-icon">{icon(k.i)}</span>
        <h2>{k.label} / {k.t}</h2>
        <p>{k.d}</p>
        <p>{k.n} courses →</p>
      </Link>)}
    </div>
  </div>;
}

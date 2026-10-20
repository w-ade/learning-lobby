import LearnTree from "./learn/LearnTree";
import agent from "./learn/agent-tree.json";
import foundations from "./learn/foundations-tree.json";
import "./tree/glide.css";
import "./split.css";

const classes = [
  { data: foundations, n: "01", title: "Technical Foundations", desc: "An interconnected map of computing, software, systems, data, design, and AI fundamentals.",
    icon: <svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="2" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="18" r="2" /><path d="M12 7v4m0 0-5 5m5-5 5 5" /></svg> },
  { data: agent, n: "02", title: "Agent Builder", desc: "A hands-on environment for learning to design, build, test, and operate AI agents.",
    icon: <svg viewBox="0 0 24 24"><rect x="5" y="8" width="14" height="10" rx="3" /><path d="M12 5v3" /><path d="M10 13h.01M14 13h.01" /></svg> },
];

export default function Home() {
  return <div className="ll-page">
    <header className="ll-head">
      <svg className="ll-logo" viewBox="0 0 24 24"><rect x="3" y="11" width="7" height="7" rx="1" /><rect x="11" y="11" width="7" height="7" rx="1" /><rect x="13" y="3" width="7" height="7" rx="1" transform="rotate(12 16.5 6.5)" /></svg>
      <div><h1>Learning Labs</h1><p>Explore. Understand. Build.</p></div>
    </header>
    <div className="ll-cols">
      {classes.map((c) => <section key={c.n} className="ll-col">
        <div className="ll-card">
          <span className="ll-icon">{c.icon}</span>
          <h2>{c.n} / {c.title}</h2>
          <p>{c.desc}</p>
        </div>
        <div className="ll-tree"><LearnTree data={c.data} /></div>
      </section>)}
    </div>
  </div>;
}

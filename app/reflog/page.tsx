import "../tree/glide.css";
import "../split.css";
import { Header } from "../planning/header";
import { reflog } from "../reflog-data";

const host = (u: string) => new URL(u).hostname.replace(/^www\./, "");
const total = reflog.reduce((n, g) => n + g.items.length, 0);

export default function Reflog() {
  return <div className="ll-page">
    <Header title="Reflog" sub={`Every reference link sent for Learning Lobby so far. ${total} links.`} />
    {reflog.map(g => <section key={g.group} style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".04em", color: "#85858A", margin: "0 0 8px" }}>{g.group}</h2>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {[...g.items].sort((a, b) => b.date.localeCompare(a.date)).map(r => <li key={r.url} style={{ padding: "12px 0", borderBottom: "1px solid #EBEBEB" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "baseline", flexWrap: "wrap" }}>
            <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 500, color: "inherit" }}>{r.title}</a>
            <span style={{ color: "#999", fontSize: 13 }}>{host(r.url)}</span>
            <span style={{ color: "#999", fontSize: 13, marginLeft: "auto" }}>{r.date}</span>
          </div>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: "#666" }}>{r.note}</p>
        </li>)}
      </ul>
    </section>)}
  </div>;
}

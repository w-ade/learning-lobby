import Link from "next/link";
import LearnTree from "../learn/LearnTree";
import sets from "../learn/structure-tree.json";
import "../tree/glide.css";
import "../split.css";

export default function Structure() {
  return <div className="ll-page">
    <header className="ll-head">
      <div style={{ flex: 1 }}><h1>Structure</h1><p>Naming options, side by side.</p></div>
      <Link href="/" className="ll-nav">Catalog</Link>
    </header>
    <div className="ll-cols" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
      {sets.map((s) => <section key={s.name} className="ll-col">
        <div className="ll-card"><h2 style={{ marginTop: 0 }}>{s.name}</h2>
          <p style={{ marginTop: 8 }}>{s.tree[0].label} → {s.tree[0].children[0].label} → {s.tree[0].children[0].children[0].label} → {s.tree[0].children[0].children[0].children.map((c) => c.label).join(" / ")}</p></div>
        <div className="ll-tree"><LearnTree data={s.tree} /></div>
      </section>)}
    </div>
  </div>;
}

import "../split.css";

const colors = ["#FF3E41", "#FFBA5B", "#FCE461", "#89F4A2", "#3582FA", "#FF9EEF", "#111119", "#FAFAF9"];
const muted = ["#C57879", "#CEB28C", "#CEC490", "#A9D4B3", "#708FBF", "#E2BBDB", "#131317", "#FAFAF9"];
const dark = new Set(["#3582FA", "#111119", "#FF3E41", "#131317", "#708FBF"]);

export default function Scratch() {
  return <div className="ll-page">
    <div className="ll-cols ll-grid3" style={{ display: "grid", gap: 16, paddingTop: 24 }}>
      {colors.map(c => <div key={c} className="ll-card" style={{ background: c, color: dark.has(c) ? "#FFFFFF" : "#111119", minHeight: 160, boxShadow: c === "#FAFAF9" ? "inset 0 0 0 1px #E0E0E0" : undefined }}>
        <h2>{c}</h2>
      </div>)}
    </div>
    <div className="ll-cols ll-grid3" style={{ display: "grid", gap: 16, paddingTop: 24 }}>
      {muted.map(c => <div key={c} className="ll-card" style={{ background: c, color: dark.has(c) ? "#FFFFFF" : "#111119", minHeight: 160, boxShadow: c === "#FAFAF9" ? "inset 0 0 0 1px #E0E0E0" : undefined }}>
        <h2>{c}</h2>
      </div>)}
    </div>
  </div>;
}

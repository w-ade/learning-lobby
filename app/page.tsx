import Link from "next/link";
import { MindMap } from "./mind-map";
import "./split.css";

// New open layout. Previous card version is git tag `login-card`.
const FONT = "var(--font-inter), system-ui, sans-serif";

export default function Login() {
  return (
    <main style={{ minHeight: "100vh", margin: 0, background: "#FFFFFF", fontFamily: FONT, position: "relative" }}>
      <div className="ll-login" style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
      <h1 className="ll-hero" style={{ margin: 0, color: "#111119", fontWeight: 700, fontSize: "calc(100cqw / 12.8)", whiteSpace: "nowrap", lineHeight: 0.92, letterSpacing: "-0.04em" }}>
        Learning Lobby
      </h1>
      <Link href="/login" aria-label="Login" style={{ flexShrink: 0, zoom: 0.71875, display: "inline-flex", alignItems: "center", height: "52px", padding: "0 20px", border: "0.5px solid #FFFFFF1F", borderRadius: "11px", backgroundColor: "#557AF7", backgroundImage: "linear-gradient(180deg, #FFFFFF33 0%, #FFFFFF00 100%)", color: "#FFFFFF", fontFamily: FONT, fontSize: "18px", fontWeight: 500, textDecoration: "none" }}>
        Login</Link>
      </div>
      
      <div style={{ marginTop: "24px" }}><MindMap /></div>
      </div>
    </main>
  );
}

"use client";
import { useActionState } from "react";
import { login } from "./auth-actions";
import { MindMap } from "./mind-map";
import "./split.css";

// New open layout. Previous card version is git tag `login-card`.
const FONT = "var(--font-inter), system-ui, sans-serif";

export default function Login() {
  const [error, action, pending] = useActionState(login, null);
  return (
    <main style={{ minHeight: "100vh", margin: 0, background: "#FFFFFF", fontFamily: FONT, position: "relative" }}>
      <div className="ll-login" style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      <h1 className="ll-hero" style={{ margin: 0, color: "#111119", fontWeight: 700, fontSize: "calc(100cqw / 6.4)", whiteSpace: "nowrap", lineHeight: 0.92, letterSpacing: "-0.04em" }}>
        Learning Lobby
      </h1>
      
      <form action={action} style={{ display: "flex", gap: "8px", width: "448px", maxWidth: "calc((100vw - 40px) / 0.71875)", zoom: 0.71875 }}>
        <input name="password" type="password" placeholder="Password" required
          style={{ flex: 1, height: "52px", padding: "0 16px", border: "1.25px solid #E2E2E4", borderRadius: "11px", fontFamily: FONT, fontSize: "18px", outline: "none", color: error ? "#FF3E41" : "#111111" }} />
        <button disabled={pending} style={{ height: "52px", padding: "0 20px", border: "0.5px solid #FFFFFF1F", borderRadius: "11px", backgroundColor: "#557AF7", backgroundImage: "linear-gradient(180deg, #FFFFFF33 0%, #FFFFFF00 100%)", color: "#FFFFFF", fontFamily: FONT, fontSize: "18px", fontWeight: 500, cursor: "pointer" }}>
          {pending ? "…" : "Enter"}</button>
      </form>
      {error && <p style={{ margin: "-16px 0 0", color: "#FF3E41", fontSize: "13px" }}>{error}</p>}
      <div style={{ marginTop: "24px" }}><MindMap /></div>
      </div>
    </main>
  );
}

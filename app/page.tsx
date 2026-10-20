"use client";
import { useActionState, useEffect, useState } from "react";
import { login } from "./auth-actions";
import { MindMap } from "./mind-map";
import "./split.css";

// New open layout. Previous card version is git tag `login-card`.
const FONT = "var(--font-inter), system-ui, sans-serif";

export default function Login() {
  const [open, setOpen] = useState(false);
  const [error, action, pending] = useActionState(login, null);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", k); return () => removeEventListener("keydown", k);
  }, []);
  return (
    <main style={{ minHeight: "100vh", margin: 0, background: "#FFFFFF", fontFamily: FONT, position: "relative" }}>
      <div className="ll-login" style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
      <h1 className="ll-hero" style={{ margin: 0, color: "#111119", fontWeight: 700, fontSize: "calc(100cqw / 12.8)", whiteSpace: "nowrap", lineHeight: 0.92, letterSpacing: "-0.04em" }}>
        Learning Lobby
      </h1>
      <button type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" style={{ cursor: "pointer",  flexShrink: 0, zoom: 0.71875, display: "inline-flex", alignItems: "center", height: "52px", padding: "0 20px", border: "0.5px solid #FFFFFF1F", borderRadius: "11px", backgroundColor: "#557AF7", backgroundImage: "linear-gradient(180deg, #FFFFFF33 0%, #FFFFFF00 100%)", color: "#FFFFFF", fontFamily: FONT, fontSize: "18px", fontWeight: 500, textDecoration: "none" }}>
        Login</button>
      </div>
      
      <div style={{ marginTop: "24px" }}><MindMap /></div>
      </div>
      {open && (
        <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(17,17,25,0.28)", display: "grid", placeItems: "center", padding: "20px", zIndex: 50 }}>
          <div role="dialog" aria-modal="true" aria-label="Login" onClick={(e) => e.stopPropagation()}
            style={{ zoom: 0.71875, width: "480px", maxWidth: "calc((100vw - 40px) / 0.71875)", boxSizing: "border-box", background: "#FFFFFF", border: "1.25px solid #E2E2E4", borderRadius: "20px", padding: "32px", boxShadow: "0 24px 60px rgba(17,17,25,0.18)" }}>
            <h2 style={{ margin: "0 0 24px", color: "#111119", fontFamily: FONT, fontWeight: 700, fontSize: "32px", letterSpacing: "-0.03em" }}>Learning Lobby</h2>
            <form action={action} style={{ display: "flex", gap: "8px" }}>
              <input name="password" type="password" placeholder="Password" required autoFocus
                style={{ flex: 1, minWidth: 0, height: "52px", padding: "0 16px", border: "1.25px solid #E2E2E4", borderRadius: "11px", fontFamily: FONT, fontSize: "18px", outline: "none", color: error ? "#FF3E41" : "#111111" }} />
              <button disabled={pending} style={{ height: "52px", padding: "0 20px", border: "0.5px solid #FFFFFF1F", borderRadius: "11px", backgroundColor: "#557AF7", backgroundImage: "linear-gradient(180deg, #FFFFFF33 0%, #FFFFFF00 100%)", color: "#FFFFFF", fontFamily: FONT, fontSize: "18px", fontWeight: 500, cursor: "pointer" }}>
                {pending ? "…" : "Enter"}</button>
            </form>
            {error && <p style={{ margin: "12px 0 0", color: "#FF3E41", fontSize: "16px", fontFamily: FONT }}>{error}</p>}
          </div>
        </div>
      )}
    </main>
  );
}

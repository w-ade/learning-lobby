"use client";
import { useActionState } from "react";
import { login } from "./auth-actions";

// Ported from wadecomputer's login card (src/app/page.tsx). QR swapped for a password field.
const SCALE = 0.71875;
const FONT = "var(--font-inter), system-ui, sans-serif";
const text = { boxSizing: "border-box", fontFamily: FONT, fontSize: "18px", fontWeight: 400, left: "16px", lineHeight: "25px", position: "absolute", whiteSpace: "nowrap" } as const;

export default function Login() {
  const [error, action, pending] = useActionState(login, null);
  return (
    <main style={{ minHeight: "100vh", margin: 0, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF" }}>
      <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1.25px solid #E2E2E4", boxSizing: "border-box", height: "502px", overflow: "hidden", width: "480px", position: "relative", flexShrink: 0, zoom: SCALE }}>
        <div style={{ ...text, color: "#1423A8", top: "115px" }}>Learning Labs</div>
        <div style={{ ...text, color: "#BDBDC0", top: "139px" }}>{error ?? "Welcome back"}</div>
        <form action={action} style={{ position: "absolute", left: "16px", right: "16px", bottom: "16px", display: "flex", gap: "8px" }}>
          <input name="password" type="password" placeholder="Password" autoFocus required
            style={{ flex: 1, height: "52px", padding: "0 16px", border: "1.25px solid #E2E2E4", borderRadius: "11px", fontFamily: FONT, fontSize: "18px", outline: "none", color: error ? "#FF3E41" : "#111111" }} />
          <button disabled={pending} style={{ height: "52px", padding: "0 20px", border: "0.5px solid #FFFFFF1F", borderRadius: "11px", backgroundColor: "#557AF7", backgroundImage: "linear-gradient(180deg, #FFFFFF33 0%, #FFFFFF00 100%)", color: "#FFFFFF", fontFamily: FONT, fontSize: "18px", fontWeight: 500, cursor: "pointer" }}>
            {pending ? "…" : "Enter"}</button>
        </form>
      </div>
    </main>
  );
}

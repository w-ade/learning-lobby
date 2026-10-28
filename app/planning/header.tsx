"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { logout } from "../auth-actions";

const _btn = { height: 32, padding: "0 14px", border: "0.5px solid #FFFFFF1F", borderRadius: 8, backgroundColor: "#557AF7", backgroundImage: "linear-gradient(180deg, #FFFFFF33 0%, #FFFFFF00 100%)", color: "#FFFFFF", font: "inherit", fontSize: 13, fontWeight: 500, cursor: "pointer" } as const;
const tabs = [{ href: "/planning/a", l: "Track A" }, { href: "/planning/b", l: "Track B" }];

export function Header({ title, sub, count }: { title: string; sub: string; count?: number }) {
  const path = usePathname();
  const cur = tabs.find(t => t.href === path);
  return <>
    <nav className="ll-bar">
      <Link href="/planning" className="ll-brand">Learning Lobby</Link>
      <Settings />
    </nav>
    <div className="ll-crumbs">
      <Link href="/planning">Planning</Link>
      {cur && <><span>/</span><span className="cur">{cur.l}</span></>}
    </div>
    <div className="ll-title">
      <h1>{title}</h1>
      <p>{sub}</p>
      {count ? <span style={{ display: "inline-block", marginTop: 10, padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: 500, ...(path === "/planning/b" ? { background: "transparent", color: "#E8C928", border: "1.5px solid #E8C928" } : { background: "transparent", color: "#F2A04A", border: "1.5px solid #F2A04A" }) }}>{count} courses</span> : null}
    </div>
  </>;
}

const GEAR = <svg viewBox="0 0 24 24" fill="none" width="20" height="20" aria-hidden="true"><path d="M10.53 3.82729C11.4432 3.31361 12.5583 3.31361 13.4715 3.82729L18.4716 6.63977C19.4162 7.17112 20.0008 8.17067 20.0008 9.2545L20.0008 14.7454C20.0008 15.8292 19.4162 16.8288 18.4715 17.3601L13.4715 20.1726C12.5583 20.6863 11.4432 20.6863 10.53 20.1726L5.53008 17.3604C4.58539 16.8291 4.00077 15.8295 4.00077 14.7456L4.00077 9.25448C4.00077 8.17065 4.58536 7.17109 5.53 6.63974L10.53 3.82729Z" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"/><path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"/></svg>;

const TREE = `Track
└── Course
    └── Module
        ├── Lesson
        └── Lab`;

function Settings() {
  const [open, setOpen] = useState(false);
  const [tree, setTree] = useState(false);
  const [dark, setDark] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { setDark(document.documentElement.classList.contains("ll-dark")); }, []);
  useEffect(() => {
    const click = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); setTree(false); } };
    addEventListener("mousedown", click); addEventListener("keydown", key);
    return () => { removeEventListener("mousedown", click); removeEventListener("keydown", key); };
  }, []);
  const toggle = () => { const d = !dark; setDark(d); document.documentElement.classList.toggle("ll-dark", d); localStorage.setItem("ll-theme", d ? "dark" : "light"); };
  return <div ref={ref} className="ll-set">
    <button type="button" className="ll-gear" aria-label="Settings" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(o => !o)}>{GEAR}</button>
    {open && <div role="menu" className="ll-menu">
      <button role="menuitem" onClick={() => { setTree(true); setOpen(false); }}>Structure</button>
      <button role="menuitemcheckbox" aria-checked={dark} onClick={toggle}>Theme<span className="ll-sw" data-on={dark}><i /></span></button>
      <div className="ll-sep" />
      <form action={logout}><button role="menuitem" type="submit">Log out</button></form>
    </div>}
    {tree && <div className="ll-scrim" onClick={() => setTree(false)}>
      <div role="dialog" aria-modal="true" aria-label="Structure" className="ll-modal" onClick={e => e.stopPropagation()}>
        <h2>Structure</h2>
        <pre>{TREE}</pre>
      </div>
    </div>}
  </div>;
}

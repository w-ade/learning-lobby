"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "../auth-actions";

const btn = { height: 32, padding: "0 14px", border: "0.5px solid #FFFFFF1F", borderRadius: 8, backgroundColor: "#557AF7", backgroundImage: "linear-gradient(180deg, #FFFFFF33 0%, #FFFFFF00 100%)", color: "#FFFFFF", font: "inherit", fontSize: 13, fontWeight: 500, cursor: "pointer" } as const;
const tabs = [{ href: "/planning/a", l: "Track A" }, { href: "/planning/b", l: "Track B" }];

export function Header({ title, sub, count }: { title: string; sub: string; count?: number }) {
  const path = usePathname();
  const cur = tabs.find(t => t.href === path);
  return <>
    <nav className="ll-bar">
      <Link href="/planning" className="ll-brand">Learning Labs</Link>
      <div className="ll-seg">
        {tabs.map(t => <Link key={t.href} href={t.href} className={t.href === path ? "on" : ""}>{t.l}</Link>)}
      </div>
      <form action={logout}><button type="submit" style={btn}>Log out</button></form>
    </nav>
    <div className="ll-crumbs">
      <Link href="/planning">Planning</Link>
      {cur && <><span>/</span><span className="cur">{cur.l}</span></>}
    </div>
    <div className="ll-title">
      <h1>{title}</h1>
      <p>{sub}{count ? ` · ${count} courses` : ""}</p>
    </div>
  </>;
}

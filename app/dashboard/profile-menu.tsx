"use client";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { logout } from "../auth-actions";
import type { IconKey } from "./page";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const pop = {
  initial: { opacity: 0, scale: 0.96, y: 6 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease: EASE_OUT } },
  exit: { opacity: 0, scale: 0.97, y: 4, transition: { duration: 0.15, ease: EASE_OUT } },
};
// Panel swap: slide toward the direction of travel, like a drill-in.
const panel = {
  enter: (d: number) => ({ x: d * 48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d * -48, opacity: 0 }),
};

const SHORTCUTS = [
  { l: "Show or hide sidebar", k: ["["] },
  { l: "Move through menu", k: ["↑", "↓"] },
  { l: "Close menu", k: ["Esc"] },
];

export function ProfileMenu({ icons: I, onNavigate }: { icons: Record<IconKey, React.ReactNode>; onNavigate: (area: string, page?: string) => void }) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"main" | "shortcuts">("main");
  const [dir, setDir] = useState(1);
  const [dark, setDark] = useState(false);
  const [h, setH] = useState<number | "auto">("auto");
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const body = useRef<HTMLDivElement>(null);

  useEffect(() => { setDark(document.documentElement.classList.contains("ll-dark")); }, []);

  const close = (refocus = true) => { setOpen(false); if (refocus) trigger.current?.focus(); };
  const go = (v: "main" | "shortcuts") => { setDir(v === "shortcuts" ? 1 : -1); setView(v); };

  useEffect(() => {
    if (!open) return;
    const click = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) close(false); };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); close(); return; }
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      e.preventDefault();
      const items = [...(body.current?.querySelectorAll<HTMLElement>("[data-item]") ?? [])];
      const i = items.indexOf(document.activeElement as HTMLElement);
      items[(i + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length]?.focus();
    };
    addEventListener("mousedown", click); addEventListener("keydown", key);
    return () => { removeEventListener("mousedown", click); removeEventListener("keydown", key); };
  }, [open]);

  // Card height follows whichever panel is current, so the swap morphs instead of jumping.
  useLayoutEffect(() => {
    if (!open || !body.current) return;
    const el = body.current;
    const ro = new ResizeObserver(() => setH(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, [open, view]);

  useEffect(() => { if (open) requestAnimationFrame(() => body.current?.querySelector<HTMLElement>("[data-item]")?.focus()); }, [open, view]);

  const toggleTheme = () => { const d = !dark; setDark(d); document.documentElement.classList.toggle("ll-dark", d); try { localStorage.setItem("ll-theme", d ? "dark" : "light"); } catch {} };
  const nav = (area: string, page?: string) => { onNavigate(area, page); close(); };

  return <MotionConfig reducedMotion="user">
    <div ref={root} className="db-pm">
      <button ref={trigger} type="button" className="db-avatar" aria-label="Account menu" aria-haspopup="menu" aria-expanded={open}
        onClick={() => { if (!open) { setView("main"); setH("auto"); } setOpen(o => !o); }}>
        <img src="/avatar.png" alt="" width={24} height={24} />
      </button>
      <AnimatePresence>
        {open && <motion.div className="db-pm-pop" role="menu" aria-label="Account" {...pop}>
          <motion.div className="db-pm-card" initial={false} animate={{ height: h }} transition={{ duration: 0.25, ease: EASE_OUT }}>
            <AnimatePresence initial={false} mode="popLayout" custom={dir}>
              <motion.div key={view} ref={el => { if (el) body.current = el; }} className="db-pm-body" custom={dir} variants={panel} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25, ease: EASE_OUT }}>
                {view === "main" ? <>
                  <div className="db-pm-who">
                    <img src="/avatar.png" alt="" width={32} height={32} />
                    <div><b>Wade</b><span>{I.flame}12-day streak</span></div>
                  </div>
                  <div className="db-pm-sep" />
                  <button type="button" role="menuitem" data-item onClick={() => nav("settings", "profile")}>{I.user}Profile</button>
                  <button type="button" role="menuitem" data-item onClick={() => nav("settings")}>{I.gear}Settings</button>
                  <button type="button" role="menuitemcheckbox" aria-checked={dark} data-item onClick={toggleTheme}>{I.moon}Dark mode<span className="db-sw" data-on={dark}><i /></span></button>
                  <button type="button" role="menuitem" data-item onClick={() => go("shortcuts")}>{I.keyboard}Keyboard shortcuts<span className="db-pm-end">{I.chevronRight}</span></button>
                  <button type="button" role="menuitem" data-item onClick={() => close()}>{I.help}Help & feedback</button>
                  <div className="db-pm-sep" />
                  <form action={logout}><button type="submit" role="menuitem" data-item>{I.door}Log out</button></form>
                </> : <>
                  <button type="button" role="menuitem" data-item className="db-pm-back" onClick={() => go("main")}>{I.chevronLeft}Keyboard shortcuts</button>
                  <div className="db-pm-sep" />
                  {SHORTCUTS.map(s => <div key={s.l} className="db-pm-row">{s.l}<span className="db-pm-end">{s.k.map(k => <kbd key={k}>{k}</kbd>)}</span></div>)}
                </>}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>}
      </AnimatePresence>
    </div>
  </MotionConfig>;
}

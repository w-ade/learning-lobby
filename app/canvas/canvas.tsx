"use client";
// Canvas controller: camera, gestures, item placement, saved layout. Knows nothing about card content.
import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Icons } from "./cards";
import { registry, type Entry } from "./registry";

type Cam = { x: number; y: number; z: number };
type Pos = Record<string, { x: number; y: number }>;

const KEY = "ll-canvas:cards";
const Z_MIN = 0.2, Z_MAX = 3, LIM = 100_000;
const RESET: Cam = { x: 64, y: 96, z: 1 };
const fin = (n: unknown, lo: number, hi: number): n is number => typeof n === "number" && Number.isFinite(n) && n >= lo && n <= hi;
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const clampCam = (c: Cam): Cam => ({ x: clamp(c.x, -LIM, LIM), y: clamp(c.y, -LIM, LIM), z: clamp(c.z, Z_MIN, Z_MAX) });
const EDITABLE = "input, textarea, select, [contenteditable=''], [contenteditable='true']";
const INTERACTIVE = `button, a[href], summary, [role='button'], [tabindex]:not([tabindex='-1']), ${EDITABLE}`;

function load(): { cam: Cam | null; pos: Pos } {
  try {
    const d = JSON.parse(localStorage.getItem(KEY) ?? "null");
    if (!d || d.v !== 1 || typeof d !== "object") return { cam: null, pos: {} };
    const ids = new Set(registry.map(e => e.id));
    const pos: Pos = {};
    for (const [id, p] of Object.entries(d.pos ?? {}).slice(0, 500)) {
      const q = p as { x?: unknown; y?: unknown };
      if (ids.has(id) && fin(q?.x, -LIM, LIM) && fin(q?.y, -LIM, LIM)) pos[id] = { x: q.x, y: q.y };
    }
    const c = d.cam;
    const cam = c && fin(c.x, -LIM, LIM) && fin(c.y, -LIM, LIM) && fin(c.z, Z_MIN, Z_MAX) ? { x: c.x, y: c.y, z: c.z } : null;
    return { cam, pos };
  } catch { return { cam: null, pos: {} }; }
}

export function Canvas({ icons }: { icons: Icons }) {
  const shell = useRef<HTMLDivElement>(null);
  const view = useRef<HTMLDivElement>(null);
  const world = useRef<HTMLDivElement>(null);
  const cam = useRef<Cam>(RESET);
  const pos = useRef<Pos>({});
  const frame = useRef(0);
  const saveT = useRef<ReturnType<typeof setTimeout>>(undefined);
  const space = useRef(false);
  const [ready, setReady] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [dark, setDark] = useState(false);
  const [msg, setMsg] = useState("");

  const write = useCallback(() => {
    frame.current = 0;
    const c = cam.current;
    if (world.current) world.current.style.transform = `translate3d(${c.x}px, ${c.y}px, 0) scale(${c.z})`;
    setZoom(Math.round(c.z * 100));
  }, []);
  const schedule = useCallback(() => { if (!frame.current) frame.current = requestAnimationFrame(write); }, [write]);
  const setCam = useCallback((c: Cam) => { cam.current = clampCam(c); schedule(); }, [schedule]);

  const save = useCallback(() => {
    clearTimeout(saveT.current);
    saveT.current = undefined;
    try { localStorage.setItem(KEY, JSON.stringify({ v: 1, cam: cam.current, pos: pos.current })); } catch {}
  }, []);
  const queueSave = useCallback(() => { clearTimeout(saveT.current); saveT.current = setTimeout(save, 300); }, [save]);

  const zoomAt = useCallback((factor: number, sx: number, sy: number) => {
    const c = cam.current, z = clamp(c.z * factor, Z_MIN, Z_MAX);
    // Keep the canvas point under (sx, sy) fixed.
    setCam({ z, x: sx - (sx - c.x) * (z / c.z), y: sy - (sy - c.y) * (z / c.z) });
  }, [setCam]);
  const zoomCenter = useCallback((factor: number) => {
    const r = view.current!.getBoundingClientRect();
    zoomAt(factor, r.width / 2, r.height / 2); queueSave();
  }, [zoomAt, queueSave]);

  const fit = useCallback(() => {
    const v = view.current, w = world.current;
    if (!v || !w) return;
    const els = [...w.querySelectorAll<HTMLElement>("[data-cv-item]")];
    if (!els.length) return;
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const el of els) {
      x0 = Math.min(x0, el.offsetLeft); y0 = Math.min(y0, el.offsetTop);
      x1 = Math.max(x1, el.offsetLeft + el.offsetWidth); y1 = Math.max(y1, el.offsetTop + el.offsetHeight);
    }
    const pad = 64, r = v.getBoundingClientRect();
    const z = clamp(Math.min((r.width - pad * 2) / (x1 - x0), (r.height - pad * 2) / (y1 - y0), 1.25), Z_MIN, Z_MAX);
    setCam({ z, x: (r.width - (x1 - x0) * z) / 2 - x0 * z, y: (r.height - (y1 - y0) * z) / 2 - y0 * z });
    queueSave();
  }, [setCam, queueSave]);

  const reset = useCallback(() => { setCam(RESET); queueSave(); }, [setCam, queueSave]);

  // Load saved layout, apply camera, fit on first visit once layout has settled.
  const [positions, setPositions] = useState<Pos>({});
  useLayoutEffect(() => {
    const s = load();
    pos.current = Object.fromEntries(registry.map(e => [e.id, s.pos[e.id] ?? { x: e.x, y: e.y }]));
    setPositions(pos.current);
    cam.current = s.cam ?? RESET;
    write();
    setReady(true);
    setDark(document.documentElement.classList.contains("ll-dark"));
    if (!s.cam) requestAnimationFrame(() => requestAnimationFrame(fit));
  }, [write, fit]);

  // Block horizontal overscroll (Chrome history swipe) while mounted; restore on teardown.
  useEffect(() => {
    const els = [document.documentElement, document.body];
    const prev = els.map(e => e.style.overscrollBehaviorX);
    els.forEach(e => { e.style.overscrollBehaviorX = "none"; });
    const flush = () => { if (saveT.current) save(); };
    addEventListener("pagehide", flush);
    return () => { els.forEach((e, i) => { e.style.overscrollBehaviorX = prev[i]; }); removeEventListener("pagehide", flush); flush(); cancelAnimationFrame(frame.current); };
  }, [save]);

  // Wheel: modified wheel / pinch zooms; otherwise let nested scrollers scroll, else pan.
  useEffect(() => {
    const v = view.current!;
    const wheel = (e: WheelEvent) => {
      const r = v.getBoundingClientRect();
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        zoomAt(Math.exp(-e.deltaY * (e.deltaMode === 1 ? 0.05 : 0.01)), e.clientX - r.left, e.clientY - r.top);
        queueSave(); return;
      }
      for (let n = e.target as HTMLElement | null; n && n !== v; n = n.parentElement) {
        const st = getComputedStyle(n);
        const canY = /(auto|scroll)/.test(st.overflowY) && (e.deltaY > 0 ? n.scrollTop + n.clientHeight < n.scrollHeight - 1 : e.deltaY < 0 && n.scrollTop > 0);
        const canX = /(auto|scroll)/.test(st.overflowX) && (e.deltaX > 0 ? n.scrollLeft + n.clientWidth < n.scrollWidth - 1 : e.deltaX < 0 && n.scrollLeft > 0);
        if (canY || canX) return;
      }
      e.preventDefault();
      const k = e.deltaMode === 1 ? 16 : 1;
      setCam({ ...cam.current, x: cam.current.x - e.deltaX * k, y: cam.current.y - e.deltaY * k });
      queueSave();
    };
    const noScroll = () => { v.scrollLeft = 0; v.scrollTop = 0; };
    v.addEventListener("wheel", wheel, { passive: false });
    v.addEventListener("scroll", noScroll);
    return () => { v.removeEventListener("wheel", wheel); v.removeEventListener("scroll", noScroll); };
  }, [zoomAt, setCam, queueSave]);

  // Space-to-pan arming; cleared on blur and hidden tabs.
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code !== "Space" || e.repeat) { if (e.code === "Space" && space.current) e.preventDefault(); return; }
      const a = document.activeElement as HTMLElement | null;
      if (a && a !== shell.current && a.closest(INTERACTIVE)) return;
      if (!shell.current?.contains(a) && a !== document.body) return;
      space.current = true; shell.current?.setAttribute("data-space", ""); e.preventDefault();
    };
    const up = (e: KeyboardEvent) => { if (e.code === "Space") clear(); };
    const clear = () => { space.current = false; shell.current?.removeAttribute("data-space"); };
    const vis = () => { if (document.hidden) clear(); };
    addEventListener("keydown", down); addEventListener("keyup", up); addEventListener("blur", clear); document.addEventListener("visibilitychange", vis);
    return () => { removeEventListener("keydown", down); removeEventListener("keyup", up); removeEventListener("blur", clear); document.removeEventListener("visibilitychange", vis); };
  }, []);

  // Pointer pan: empty-space drag, middle button, Space + drag anywhere, touch pan/pinch on empty space.
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pan = useRef<{ moved: boolean; last: { x: number; y: number; d: number } } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    const empty = e.target === view.current || e.target === world.current;
    const explicit = e.button === 1 || (e.button === 0 && space.current);
    if (!(explicit || (empty && e.button === 0))) return;
    if (e.button === 1) e.preventDefault(); // no middle-click autoscroll
    view.current!.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    pan.current = { moved: pan.current?.moved ?? false, last: centroid() };
    shell.current?.setAttribute("data-panning", "");
  };
  const centroid = () => {
    const ps = [...pointers.current.values()];
    const x = ps.reduce((s, p) => s + p.x, 0) / ps.length, y = ps.reduce((s, p) => s + p.y, 0) / ps.length;
    const d = ps.length > 1 ? Math.hypot(ps[0].x - ps[1].x, ps[0].y - ps[1].y) : 0;
    return { x, y, d };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!pan.current || !pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const n = centroid(), l = pan.current.last, r = view.current!.getBoundingClientRect();
    if (Math.abs(n.x - l.x) + Math.abs(n.y - l.y) > 2) pan.current.moved = true;
    let c = { ...cam.current, x: cam.current.x + n.x - l.x, y: cam.current.y + n.y - l.y };
    if (n.d && l.d) {
      const z = clamp(c.z * n.d / l.d, Z_MIN, Z_MAX), sx = n.x - r.left, sy = n.y - r.top;
      c = { z, x: sx - (sx - c.x) * (z / c.z), y: sy - (sy - c.y) * (z / c.z) };
    }
    setCam(c);
    pan.current.last = n;
  };
  const endPointer = (e: React.PointerEvent) => {
    if (!pointers.current.delete(e.pointerId) || !pan.current) return;
    if (pointers.current.size) { pan.current.last = centroid(); return; }
    if (pan.current.moved) {
      // Swallow the click that follows a pan so it can't activate controls or copy labels.
      const stop = (ev: Event) => { ev.stopPropagation(); ev.preventDefault(); };
      addEventListener("click", stop, { capture: true, once: true });
      setTimeout(() => removeEventListener("click", stop, { capture: true }), 0);
    }
    pan.current = null;
    shell.current?.removeAttribute("data-panning");
    queueSave();
  };

  // Keyboard camera when the shell itself has focus.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.target !== shell.current) return;
    const step = e.shiftKey ? 160 : 48, c = cam.current;
    const map: Record<string, () => void> = {
      ArrowLeft: () => setCam({ ...c, x: c.x + step }), ArrowRight: () => setCam({ ...c, x: c.x - step }),
      ArrowUp: () => setCam({ ...c, y: c.y + step }), ArrowDown: () => setCam({ ...c, y: c.y - step }),
      "=": () => zoomCenter(1.2), "+": () => zoomCenter(1.2), "-": () => zoomCenter(1 / 1.2), "0": reset, "1": fit,
    };
    const f = map[e.key];
    if (f) { e.preventDefault(); f(); queueSave(); }
  };

  // Reveal offscreen keyboard focus by moving the camera rather than scrolling.
  const onFocus = (e: React.FocusEvent) => {
    const t = e.target as HTMLElement;
    if (!world.current?.contains(t)) return;
    const v = view.current!.getBoundingClientRect(), r = t.getBoundingClientRect(), m = 48;
    let dx = 0, dy = 0;
    if (r.left < v.left + m) dx = v.left + m - r.left; else if (r.right > v.right - m) dx = v.right - m - r.right;
    if (r.top < v.top + m) dy = v.top + m - r.top; else if (r.bottom > v.bottom - m) dy = v.bottom - m - r.bottom;
    if (dx || dy) { setCam({ ...cam.current, x: cam.current.x + dx, y: cam.current.y + dy }); queueSave(); }
  };

  const move = useCallback((id: string, p: { x: number; y: number }, commit: boolean) => {
    pos.current = { ...pos.current, [id]: { x: clamp(p.x, -LIM, LIM), y: clamp(p.y, -LIM, LIM) } };
    if (commit) { setPositions(pos.current); queueSave(); }
  }, [queueSave]);

  const copy = useCallback(async (name: string) => {
    try {
      if (!navigator.clipboard) throw 0;
      await navigator.clipboard.writeText(name);
      setMsg(`Copied “${name}”`);
      return true;
    } catch { setMsg(`Couldn't copy. Select “${name}” and copy it manually.`); return false; }
  }, []);

  const setTheme = (d: boolean) => {
    setDark(d);
    document.documentElement.classList.toggle("ll-dark", d);
    try { localStorage.setItem("ll-theme", d ? "dark" : "light"); } catch {}
  };

  return <div ref={shell} className="cv" tabIndex={0} aria-label="Card canvas. Arrow keys pan, plus and minus zoom, 0 resets, 1 fits all." onKeyDown={onKeyDown} onFocus={onFocus}>
    <div ref={view} className="cv-view" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={endPointer} onPointerCancel={endPointer} onLostPointerCapture={endPointer}>
      <div ref={world} className="cv-world" style={{ visibility: ready ? "visible" : "hidden" }}>
        {registry.map(e => <Item key={e.id} e={e} p={positions[e.id] ?? e} zoom={cam} icons={icons} move={move} copy={copy} />)}
      </div>
    </div>
    <div className="cv-bar" role="toolbar" aria-label="Canvas controls">
      <button type="button" aria-label="Zoom out" onClick={() => zoomCenter(1 / 1.2)}>{icons.minus}</button>
      <span className="cv-zoom" aria-live="polite">{zoom}%</span>
      <button type="button" aria-label="Zoom in" onClick={() => zoomCenter(1.2)}>{icons.plus}</button>
      <span className="cv-sep" />
      <button type="button" aria-label="Fit all" title="Fit all  1" onClick={fit}>{icons.fit}</button>
      <button type="button" aria-label="Reset camera" title="Reset camera  0" onClick={reset}>{icons.reset}</button>
      <span className="cv-sep" />
      <div className="cv-seg" role="radiogroup" aria-label="Theme">
        <button type="button" role="radio" aria-checked={!dark} onClick={() => setTheme(false)}>Light</button>
        <button type="button" role="radio" aria-checked={dark} onClick={() => setTheme(true)}>Dark</button>
      </div>
    </div>
    <p className="cv-sr" role="status" aria-live="polite">{msg}</p>
  </div>;
}

type ItemProps = { e: Entry; p: { x: number; y: number }; zoom: React.RefObject<Cam>; icons: Icons; move: (id: string, p: { x: number; y: number }, commit: boolean) => void; copy: (name: string) => Promise<boolean> };

const Item = memo(function Item({ e, p, zoom, icons, move, copy }: ItemProps) {
  const el = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: number; sx: number; sy: number; ox: number; oy: number; cur: { x: number; y: number } } | null>(null);
  const [copied, setCopied] = useState<"ok" | "fail" | null>(null);
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(t.current), []);

  const place = (q: { x: number; y: number }) => { if (el.current) { el.current.style.left = `${q.x}px`; el.current.style.top = `${q.y}px`; } };

  const down = (ev: React.PointerEvent<HTMLButtonElement>) => {
    if (ev.button !== 0 || ev.currentTarget.closest("[data-space]")) return; // explicit pan wins
    ev.stopPropagation();
    ev.currentTarget.setPointerCapture(ev.pointerId);
    drag.current = { id: ev.pointerId, sx: ev.clientX, sy: ev.clientY, ox: p.x, oy: p.y, cur: p };
  };
  const moveP = (ev: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== ev.pointerId) return;
    const z = zoom.current.z;
    d.cur = { x: d.ox + (ev.clientX - d.sx) / z, y: d.oy + (ev.clientY - d.sy) / z };
    place(d.cur);
  };
  const up = (ev: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== ev.pointerId) return;
    drag.current = null;
    move(e.id, d.cur, true);
  };
  const key = (ev: React.KeyboardEvent) => {
    const s = ev.shiftKey ? 40 : 8;
    const dx = ev.key === "ArrowLeft" ? -s : ev.key === "ArrowRight" ? s : 0, dy = ev.key === "ArrowUp" ? -s : ev.key === "ArrowDown" ? s : 0;
    if (!dx && !dy) return;
    ev.preventDefault(); ev.stopPropagation();
    move(e.id, { x: p.x + dx, y: p.y + dy }, true);
  };
  const onCopy = async () => {
    const ok = await copy(e.name);
    setCopied(ok ? "ok" : "fail");
    clearTimeout(t.current); t.current = setTimeout(() => setCopied(null), ok ? 1400 : 6000);
  };

  return <div ref={el} data-cv-item className="cv-item" style={{ left: p.x, top: p.y, width: e.w }}>
    <div className="cv-label">
      <button type="button" className="cv-handle" aria-label={`Move ${e.name}. Drag, or use arrow keys; Shift for larger steps.`} title="Drag to move"
        onPointerDown={down} onPointerMove={moveP} onPointerUp={up} onPointerCancel={up} onLostPointerCapture={up} onKeyDown={key}>{icons.grip}</button>
      <button type="button" className="cv-name" title="Click to copy name" onClick={onCopy}>{e.name}</button>
      {copied === "ok" && <span className="cv-copied">Copied</span>}
      {copied === "fail" && <span className="cv-copied cv-select">{e.name}</span>}
    </div>
    <div className="cv-preview" style={{ height: e.h }}>{e.render(icons)}</div>
  </div>;
});

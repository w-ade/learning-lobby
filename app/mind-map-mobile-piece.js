/* Mobile version of the Learning Lobby mind map: a zigzag spine, topics branch off each peak. */
import { Grid, clamp } from "ascii-magic-art/lib/kit.js";
import { meta as wide } from "./mind-map-piece.js";

const TOPICS = [
  ["Foundations", "3", ["computer science", "math for AI"]],
  ["Models", "4", ["how LLMs work", "prompting"]],
  ["Agents", "5", ["agent loop", "multi-agent"]],
  ["Tools", "6", ["tool calling", "evals"]],
  ["Web", "7", ["web platform", "apple"]],
  ["Design", "8", ["design eng", "interfaces"]],
];
const BAND = 5, TOP = 3, L = 20, R = 24;

export const meta = { ...wide, slug: "learning-lobby-mind-map-mobile", name: "Learning Lobby Mind Map (mobile)", cols: 44, rows: TOP + TOPICS.length * BAND };

export default function create() {
  const { cols, rows } = meta;
  const g = new Grid(cols, rows);
  const typed = (x, y, s, co, p) => g.text(x, y, s.slice(0, Math.floor(clamp(p * 1.4) * s.length)), co);
  const spineX = (i, k) => (i % 2 === 0 ? L + k : R - k);
  return (t) => {
    g.clear();
    const LOOP = 11, lt = (t + 0.5) % LOOP;
    const at = (t0, d) => clamp((lt - t0) / d);
    const rp = at(0, 0.8);
    if (rp > 0) { g.box(12, 0, 18, 3, rp >= 1 ? "double" : "round", "a"); typed(14, 1, "Learning Lobby", "9", rp); }
    let stopped = false;
    TOPICS.forEach(([name, co, leaves], i) => {
      if (stopped) return;
      const y = TOP + i * BAND, t0 = 0.6 + i * 0.6, left = i % 2 === 0;
      const sp = at(t0, 0.4);
      const n = Math.round(BAND * sp);
      for (let k = 0; k < n; k++) g.set(spineX(i, k), y + k, left ? "\\" : "/", "2");
      if (sp < 1) { stopped = true; return; }
      const w = name.length + 4, sx = spineX(i, 1);
      const bx = left ? sx - 2 - w : R + 2;
      const cp = at(t0 + 0.4, 0.2);
      if (cp > 0) { const a = left ? bx + w : sx + 1, b = left ? sx - 1 : bx - 1; for (let x = a; x <= b; x++) g.set(x, y + 1, "─", co); }
      const np = at(t0 + 0.55, 0.45);
      if (np > 0) { g.box(bx, y, w, 3, "round", np >= 1 ? co : "2"); typed(bx + 2, y + 1, name, "0", np); }
      leaves.forEach((leaf, j) => {
        const lp = at(t0 + 0.95 + j * 0.25, 0.45);
        if (lp <= 0) return;
        const ly = y + 3 + j, s = "● " + leaf;
        const lx = left ? Math.max(0, Math.min(bx, spineX(i, 3 + j) - 2 - s.length)) : bx;
        g.set(lx, ly, "●", co);
        typed(lx + 2, ly, leaf, "1", lp);
      });
    });
    if (lt > 6.5) { const s = Math.floor(lt * 2) % TOPICS.length; g.set(31, 1, "◆", TOPICS[s][1]); }
    return g.frame();
  };
}

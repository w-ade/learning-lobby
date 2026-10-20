/* Mobile version of the Learning Labs mind map: a tall tree, branches grow down a trunk. */
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

export const meta = { ...wide, slug: "learning-labs-mind-map-mobile", name: "Learning Labs Mind Map (mobile)", cols: 32, rows: 2 + TOPICS.length * 6 };

export default function create() {
  const { cols, rows } = meta;
  const g = new Grid(cols, rows);
  const TX = 2;
  const typed = (x, y, s, co, p) => g.text(x, y, s.slice(0, Math.floor(clamp(p * 1.4) * s.length)), co);
  return (t) => {
    g.clear();
    const LOOP = 11, lt = (t + 0.5) % LOOP;
    const at = (t0, d) => clamp((lt - t0) / d);
    // root
    const rp = at(0, 0.8);
    if (rp > 0) { g.box(0, 0, 17, 3, rp >= 1 ? "double" : "round", "a"); typed(2, 1, "Learning Labs", "9", rp); }
    let stopped = false;
    TOPICS.forEach(([name, co, leaves], i) => {
      if (stopped) return;
      const y = 4 + i * 6, t0 = 0.6 + i * 0.55;
      // trunk down to this branch
      const from = i === 0 ? 3 : y - 5;
      const tp = at(t0, 0.35);
      for (let r = from; r < from + Math.round((y - from) * tp); r++) g.set(TX, r, "│", "2");
      if (tp < 1) { stopped = true; return; }
      const last = i === TOPICS.length - 1;
      g.set(TX, y, last ? "╰" : "├", "2");
      const bp = at(t0 + 0.35, 0.3);
      for (let k = 1; k <= Math.round(3 * bp); k++) g.set(TX + k, y, "─", co);
      const np = at(t0 + 0.6, 0.45);
      if (np > 0) { const w = name.length + 4; g.box(6, y - 1, w, 3, "round", np >= 1 ? co : "2"); typed(8, y, name, "0", np); if (np >= 1) g.set(9, y + 1, "┬", co); }
      leaves.forEach((leaf, j) => {
        const lp = at(t0 + 1.0 + j * 0.25, 0.45);
        if (lp <= 0) return;
        const ly = y + 2 + j;
        g.text(9, ly, j === leaves.length - 1 ? "╰─" : "├─", co);
        g.set(12, ly, "●", co);
        typed(14, ly, leaf, "1", lp);
      });
    });
    if (lt > 6) { const s = Math.floor(lt * 2) % TOPICS.length; g.set(18, 1, "◆", TOPICS[s][1]); }
    return g.frame();
  };
}

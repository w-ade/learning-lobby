/* Adapted from ascii-magic-art "mind-map" (MIT, ASCII Magic). Relabeled for Learning Labs, light palette. */
import { Grid, palette, clamp } from "ascii-magic-art/lib/kit.js";

export const meta = {
  slug: "learning-labs-mind-map", name: "Learning Labs Mind Map", category: "explainers",
  note: "Learning Labs growing out into its subject areas.",
  cols: 100, rows: 30, fps: 24,
  palette: palette(["#111119", "#85858A", "#E0E0E0", "#FF3E41", "#F2A04A", "#E0B800", "#2FBF71", "#3582FA", "#F25CD0", "#111119", "#557AF7"]),
};

const TOPICS = [
  ["Foundations", 19, 5, "3", [["computer science", 2, 1], ["math for AI", 2, 9]]],
  ["Models", 50, 3, "4", [["how LLMs work", 30, 0], ["prompting", 66, 0]]],
  ["Agents", 80, 6, "5", [["agent loop", 85, 1], ["multi-agent", 84, 11]]],
  ["Tools", 80, 22, "6", [["tool calling", 85, 17], ["evals", 84, 27]]],
  ["Web", 49, 26, "7", [["web platform", 30, 29], ["apple", 64, 29]]],
  ["Design", 17, 22, "8", [["design eng", 2, 17], ["interfaces", 2, 27]]],
];

const slopeCh = (dx, dy) => {
  const ax = Math.abs(dx), ay = Math.abs(dy) * 2;
  if (ay < ax * 0.4) return "─";
  if (ax < ay * 0.4) return "│";
  return dx * dy > 0 ? "╲" : "╱";
};

export default function create() {
  const { cols, rows } = meta;
  const g = new Grid(cols, rows);
  const CX = 50, CY = 14;
  const grow = (x0, y0, x1, y1, p, co) => {
    if (p <= 0) return;
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0) * 2);
    const ch = slopeCh(x1 - x0, y1 - y0);
    const m = Math.floor(n * p);
    for (let i = 0; i <= m; i++) { const u = i / n; g.set(Math.round(x0 + (x1 - x0) * u), Math.round(y0 + (y1 - y0) * u), ch, co); }
  };
  const node = (x, y, text, co, p, bold) => {
    if (p <= 0) return;
    const w = text.length + 4, bx = Math.max(0, Math.min(cols - w, x - Math.floor(w / 2)));
    if (bold) g.box(bx, y - 1, w, 3, p >= 1 ? "double" : "round", co);
    else g.box(bx, y - 1, w, 3, "round", p >= 1 ? co : "2");
    const n = Math.floor(clamp(p * 1.4) * text.length);
    for (let i = 0; i < text.length; i++) g.set(bx + 2 + i, y, i < n ? text[i] : " ");
    g.text(bx + 2, y, text.slice(0, n), bold ? "9" : "0");
  };
  const leaf = (x, y, text, co, p) => {
    if (p <= 0) return;
    const n = Math.floor(clamp(p * 1.4) * text.length);
    g.set(x, y, "●", co);
    g.text(x + 2, y, text.slice(0, n), "1");
  };
  return (t) => {
    g.clear();
    const LOOP = 10, lt = (t + 1.6) % LOOP;
    const at = (t0, d) => clamp((lt - t0) / d);
    TOPICS.forEach(([, x, y, co, leaves], i) => {
      const t0 = 0.6 + i * 0.35;
      grow(CX, CY, x, y, at(t0, 0.9), co);
      leaves.forEach(([lt2, lx, ly], j) => {
        const ex = lx + (lx < x ? lt2.length + 2 : -1);
        grow(x, y, lx < x ? ex : lx, ly, at(t0 + 1.4 + j * 0.3, 0.6), co);
      });
    });
    TOPICS.forEach(([name, x, y, co, leaves], i) => {
      const t0 = 0.6 + i * 0.35;
      node(x, y, name, co, at(t0 + 0.8, 0.5), false);
      leaves.forEach(([text, lx, ly], j) => leaf(lx, ly, text, co, at(t0 + 1.9 + j * 0.3, 0.5)));
    });
    node(CX, CY, "Learning Labs", "a", at(-0.5, 0.8), true);
    const sparkle = Math.floor(lt * 2) % 6;
    if (lt > 5) g.set(CX - 10, CY, "◆", TOPICS[sparkle][3]);
    return g.frame();
  };
}

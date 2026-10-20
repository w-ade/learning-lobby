import { useEffect, useState } from "react";
import type { CSSProperties, RefObject } from "react";

// A small layout inspector, like the one in browser devtools. Hover anything
// in the preview and it shows the nearest layout container: its box, padding,
// the gaps between its children, and a label with the numbers.

type Box = { left: number; top: number; width: number; height: number };

const TICK = 10; // a tick every 10px
const MAJOR = 50; // a longer tick and a number every 50px

function px(value: string) {
  return parseFloat(value) || 0;
}

function relativeBox(el: Element, root: HTMLElement): Box {
  const r = el.getBoundingClientRect();
  const o = root.getBoundingClientRect();
  return { left: r.left - o.left, top: r.top - o.top, width: r.width, height: r.height };
}

// Children that take part in layout. The highlight and the math overlay are
// absolutely positioned, so they're left out.
function flowChildren(el: HTMLElement) {
  return [...el.children].filter((c) => {
    const s = getComputedStyle(c);
    return s.position !== "absolute" && s.position !== "fixed" && s.display !== "none";
  });
}

function isLayoutContainer(el: HTMLElement) {
  const d = getComputedStyle(el).display;
  return (d.includes("flex") || d.includes("grid")) && flowChildren(el).length > 1;
}

// Where the pointer is, which box to inspect: the nearest flex or grid
// container around it, so hovering a row shows the list and its gaps.
function pickTarget(hit: Element | null, root: HTMLElement) {
  for (let el = hit as HTMLElement | null; el && el !== root; el = el.parentElement) {
    if (el.dataset.inspectRoot !== undefined) return null;
    if (isLayoutContainer(el)) return el;
  }
  return hit && hit !== root && root.contains(hit) ? (hit as HTMLElement) : null;
}

// Gaps are the empty spans between children along each axis.
function gaps(children: Box[], axis: "x" | "y") {
  const start = axis === "x" ? "left" : "top";
  const size = axis === "x" ? "width" : "height";
  const spans = children
    .map((c) => [c[start], c[start] + c[size]] as const)
    .sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [];
  for (const [a, b] of spans) {
    const last = merged[merged.length - 1];
    if (last && a <= last[1] + 0.5) last[1] = Math.max(last[1], b);
    else merged.push([a, b]);
  }
  return merged.slice(1).map(([a], i) => ({ from: merged[i][1], to: a }));
}

function shorthand(s: CSSStyleDeclaration, prop: "padding" | "margin") {
  const v = (["Top", "Right", "Bottom", "Left"] as const).map((side) =>
    Math.round(px(s[`${prop}${side}`])),
  );
  if (v.every((n) => n === v[0])) return `${v[0]}px`;
  if (v[0] === v[2] && v[1] === v[3]) return `${v[0]}px ${v[1]}px`;
  return v.map((n) => `${n}px`).join(" ");
}

function describe(s: CSSStyleDeclaration) {
  if (s.display.includes("grid")) {
    const cols = s.gridTemplateColumns.split(" ").filter(Boolean).length;
    return `grid ${cols} col`;
  }
  if (s.display.includes("flex"))
    return s.flexDirection.startsWith("column") ? "flex col" : "flex row";
  return s.display;
}

export function Inspector({ root }: { root: RefObject<HTMLElement | null> }) {
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() =>
        setTarget(pickTarget(document.elementFromPoint(e.clientX, e.clientY), el)),
      );
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      setTarget(null);
    };
    const ro = new ResizeObserver(() =>
      setSize({ width: el.clientWidth, height: el.clientHeight }),
    );
    ro.observe(el);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [root]);

  const rootEl = root.current;
  if (!rootEl) return null;
  const rs = getComputedStyle(rootEl);
  const origin = { x: px(rs.paddingLeft), y: px(rs.paddingTop) };

  let detail = null;
  // The hovered element can override the padding/gap colors (see Swatch).
  let colors: CSSProperties | undefined;
  if (target && rootEl.contains(target)) {
    const s = getComputedStyle(target);
    const gapColor = s.getPropertyValue("--swatch-gap").trim();
    const padColor = s.getPropertyValue("--swatch-pad").trim();
    if (gapColor)
      colors = { "--inspect-gap": gapColor, "--inspect-pad": padColor } as CSSProperties;
    const box = relativeBox(target, rootEl);
    const pad = {
      top: px(s.paddingTop) + px(s.borderTopWidth),
      right: px(s.paddingRight) + px(s.borderRightWidth),
      bottom: px(s.paddingBottom) + px(s.borderBottomWidth),
      left: px(s.paddingLeft) + px(s.borderLeftWidth),
    };
    const childEls = isLayoutContainer(target) ? flowChildren(target) : [];
    const children = childEls.map((c) => relativeBox(c, rootEl));
    const inner = {
      left: box.left + pad.left,
      top: box.top + pad.top,
      width: box.width - pad.left - pad.right,
      height: box.height - pad.top - pad.bottom,
    };
    const gapLines = [
      ...gaps(children, "y").map((g) => ({
        ...inner,
        top: g.from,
        height: g.to - g.from,
        axis: "y",
      })),
      ...gaps(children, "x").map((g) => ({
        ...inner,
        left: g.from,
        width: g.to - g.from,
        axis: "x",
      })),
    ];
    const rowGap = Math.round(px(s.rowGap));
    const columnGap = Math.round(px(s.columnGap));
    const gapText =
      children.length === 0
        ? null
        : rowGap === columnGap || !s.display.includes("grid")
          ? `gap ${s.flexDirection.startsWith("column") ? rowGap : columnGap}px`
          : `gap ${rowGap}px ${columnGap}px`;

    detail = (
      <>
        {/* Green strips are the padding, clipped to the box's rounded corners. */}
        <div className="inspect-box" style={{ ...box, borderRadius: s.borderRadius }}>
          <div className="inspect-pad" style={{ left: 0, right: 0, top: 0, height: pad.top }} />
          <div
            className="inspect-pad"
            style={{ left: 0, right: 0, bottom: 0, height: pad.bottom }}
          />
          <div
            className="inspect-pad"
            style={{ left: 0, top: pad.top, bottom: pad.bottom, width: pad.left }}
          />
          <div
            className="inspect-pad"
            style={{ right: 0, top: pad.top, bottom: pad.bottom, width: pad.right }}
          />
        </div>
        {children.map((c, i) => (
          <div
            key={i}
            className="inspect-child"
            style={{ ...c, borderRadius: getComputedStyle(childEls[i]).borderRadius }}
          />
        ))}
        {gapLines.map((g, i) => (
          <div
            key={`gap-${i}`}
            className={`inspect-gap inspect-gap-${g.axis}`}
            style={{ left: g.left, top: g.top, width: g.width, height: g.height }}
          >
            <span>{Math.round(g.axis === "y" ? g.height : g.width)}</span>
          </div>
        ))}
        <div
          className="inspect-label"
          style={{
            left: Math.min(Math.max(box.left, 4), size.width - 200),
            // Above the box; it may overlap the preview header, like devtools.
            top: box.top - 8,
          }}
        >
          <span className="inspect-tag">{target.tagName.toLowerCase()}</span>
          <span>
            {describe(s)} · {Math.round(box.width)} × {Math.round(box.height)}
          </span>
          <span>
            padding {shorthand(s, "padding")} · margin {shorthand(s, "margin")}
          </span>
          {gapText && <span>{gapText}</span>}
        </div>
        <div className="ruler-band ruler-band-x" style={{ left: box.left, width: box.width }} />
        <div className="ruler-band ruler-band-y" style={{ top: box.top, height: box.height }} />
      </>
    );
  }

  const xs = [];
  for (let x = -Math.floor(origin.x / TICK) * TICK; origin.x + x < size.width; x += TICK)
    xs.push(x);
  const ys = [];
  for (let y = -Math.floor(origin.y / TICK) * TICK; origin.y + y < size.height; y += TICK)
    ys.push(y);

  return (
    <div className="inspector" data-inspect-root aria-hidden style={colors}>
      <div className="ruler ruler-x">
        {xs.map((x) => (
          <span
            key={x}
            className={x % MAJOR === 0 ? "tick tick-major" : "tick"}
            style={{ left: origin.x + x }}
          />
        ))}
        {xs
          .filter((x) => x > 0 && x % MAJOR === 0)
          .map((x) => (
            <span key={`n${x}`} className="ruler-number" style={{ left: origin.x + x }}>
              {x}
            </span>
          ))}
      </div>
      <div className="ruler ruler-y">
        {ys.map((y) => (
          <span
            key={y}
            className={y % MAJOR === 0 ? "tick tick-major" : "tick"}
            style={{ top: origin.y + y }}
          />
        ))}
        {ys
          .filter((y) => y > 0 && y % MAJOR === 0)
          .map((y) => (
            <span key={`n${y}`} className="ruler-number" style={{ top: origin.y + y }}>
              {y}
            </span>
          ))}
      </div>
      {detail}
    </div>
  );
}

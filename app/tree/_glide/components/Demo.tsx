import { useContext, useRef } from "react";
import type { FocusEvent, ReactNode } from "react";
import { useFluidHover, type Axis, type FluidHover } from "../lib/useFluidHover";
import { HighlightSpring } from "./HighlightSpring";
import { HighlightMotion } from "./HighlightMotion";
import { SettingsContext } from "../lib/settings";

export type Engine = "spring" | "motion" | "plain";

export type Item = { label: string; description?: string; disabled?: boolean };

type DemoProps = {
  engine: Engine;
  items: Item[];
  axis?: Axis;
  layout: "list" | "tabs" | "grid";
  onPick?: (label: string, how: "row" | "gap") => void;
};

export function Demo({ engine, items, axis = "y", layout, onPick }: DemoProps) {
  const settings = useContext(SettingsContext);
  const container = useRef<HTMLDivElement>(null);
  const hover = useFluidHover(container, {
    axis,
    isItemDisabled: (el) => el.hasAttribute("disabled"),
  });
  const fluid = engine !== "plain";
  const duration = 0.08 * settings.speed;

  // Keyboard: light the focused row, but only for keyboard focus, and turn it
  // off when focus leaves the list. The hook never moves focus itself.
  const onFocus = (i: number) => (e: FocusEvent<HTMLElement>) => {
    if (e.currentTarget.matches(":focus-visible")) hover.setActiveIndex(i);
  };
  const onBlur = (e: FocusEvent<HTMLElement>) => {
    if (!container.current?.contains(e.relatedTarget as Node)) hover.setActiveIndex(null);
  };

  return (
    <div
      ref={container}
      className={`demo demo-${layout}`}
      data-engine={engine}
      onBlur={fluid ? onBlur : undefined}
      {...(fluid ? hover.handlers : {})}
    >
      {engine === "spring" && (
        <HighlightSpring hover={hover} duration={duration} keepVelocity={settings.keepVelocity} />
      )}
      {engine === "motion" && (
        <HighlightMotion hover={hover} transition={{ type: "spring", duration, bounce: 0 }} />
      )}
      {items.map((item, i) => (
        <button
          key={item.label}
          ref={hover.itemRef(i)}
          type="button"
          className="item"
          disabled={item.disabled}
          onFocus={fluid ? onFocus(i) : undefined}
          // A gap click is forwarded with el.click(), which the browser marks
          // as untrusted. That's how the demo tells the two apart.
          onClick={(e) => onPick?.(item.label, e.isTrusted ? "row" : "gap")}
        >
          <span className="item-label">{item.label}</span>
          {item.description && <span className="item-description">{item.description}</span>}
        </button>
      ))}
      {fluid && settings.showMath && (
        <MathOverlay hover={hover} skipped={items.map((item) => !!item.disabled)} />
      )}
    </div>
  );
}

// Draws what the hook is thinking: a dot at each item's center, and for
// lists and strips, the line where "nearest" flips from one item to the next.
// Those lines sit in the middle of each gap, which is why there's no dead zone.
// Skipped (disabled) items get no line: the flip point jumps over them.
function MathOverlay({ hover, skipped }: { hover: FluidHover; skipped: boolean[] }) {
  const rects = hover.itemRects
    .map((r, i) => (r ? { ...r, i } : undefined))
    .filter((r) => r !== undefined);
  const along = hover.axis === "x" ? "left" : "top";
  const size = hover.axis === "x" ? "width" : "height";
  const sorted = rects.filter((r) => !skipped[r.i]).sort((a, b) => a[along] - b[along]);
  const boundaries =
    hover.axis === "xy"
      ? []
      : sorted.slice(1).map((next, k) => {
          const prev = sorted[k];
          return (prev[along] + prev[size] + next[along]) / 2;
        });

  return (
    <div className="math" aria-hidden>
      {rects.map((r) => (
        <span
          key={`box-${r.i}`}
          className="math-box"
          style={{ left: r.left, top: r.top, width: r.width, height: r.height }}
        />
      ))}
      {boundaries.map((p, k) => (
        <span
          key={`line-${k}`}
          className={`math-line math-line-${hover.axis}`}
          style={hover.axis === "x" ? { left: p } : { top: p }}
        />
      ))}
      {rects.map((r) => (
        <span
          key={`dot-${r.i}`}
          className="math-dot"
          data-active={r.i === hover.activeIndex || undefined}
          data-skipped={skipped[r.i] || undefined}
          style={{ left: r.left + r.width / 2, top: r.top + r.height / 2 }}
        />
      ))}
    </div>
  );
}

// Trial: a column can carry its own inspector padding/gap color, so the
// options can be compared side by side. Remove once one is picked.
export type Swatch = { name: string; hex: string };

type ColumnProps = { title: string; note?: string; swatch?: Swatch; children: ReactNode };

export function Column({ title, note, swatch, children }: ColumnProps) {
  return (
    <figure className="column" data-swatch={swatch?.name.toLowerCase()}>
      {children}
      <figcaption>
        <span className="column-title">{title}</span>
        {note && <span className="column-note">{note}</span>}
        {swatch && (
          <span className="swatch-chip">
            <span className="swatch-dot" />
            {swatch.name} {swatch.hex}
          </span>
        )}
      </figcaption>
    </figure>
  );
}

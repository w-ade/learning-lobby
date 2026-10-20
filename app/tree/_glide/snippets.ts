// What the Code tab shows for each preview.

export const listCode = `
import { useRef } from "react";
import { useFluidHover } from "./lib/useFluidHover";
import { HighlightSpring } from "./components/HighlightSpring";
import { HighlightMotion } from "./components/HighlightMotion";

function Menu({ rows }: { rows: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const hover = useFluidHover(ref); // axis defaults to "y"

  return (
    <div ref={ref} className="demo demo-list" {...hover.handlers}>
      {/* pick one: */}
      <HighlightSpring hover={hover} />
      <HighlightMotion hover={hover} />

      {rows.map((row, i) => (
        <button key={row} ref={hover.itemRef(i)} className="item">
          {row}
        </button>
      ))}
    </div>
  );
}

/* Plain :hover, for comparison. It turns off in every gap. */
.item:hover { background: var(--highlight); }
`;

export const tabsCode = `
const hover = useFluidHover(ref, { axis: "x" });

<div ref={ref} className="demo demo-tabs" {...hover.handlers}>
  <HighlightSpring hover={hover} />
  {tabs.map((tab, i) => (
    <button key={tab} ref={hover.itemRef(i)} className="item">{tab}</button>
  ))}
</div>

// The tabs are different widths, so the highlight animates width too.
// Items of the same size only ever move with transform.
`;

export const gridCode = `
const hover = useFluidHover(ref, { axis: "xy" });

<div ref={ref} className="demo demo-grid" {...hover.handlers}>
  <HighlightMotion hover={hover} />
  {cards.map((card, i) => (
    <button key={card.label} ref={hover.itemRef(i)} className="item">
      <span>{card.label}</span>
      <span>{card.description}</span>
    </button>
  ))}
</div>

// "xy" measures the straight-line distance to each card's box,
// so the nearest card wins in any direction.
`;

export const skipCode = `
const hover = useFluidHover(ref, {
  // Never lit, never clicked. Runs on every move, so keep it cheap.
  isItemDisabled: (el) => el.hasAttribute("disabled"),
  // A click between rows goes to the lit row (the default).
  // { maxDistance: 8 } would only allow it within 8px.
  gapClick: true,
});

<button ref={hover.itemRef(2)} className="item" disabled>Agents</button>
`;

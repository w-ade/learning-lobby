import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent, PointerEvent, RefObject } from "react";

// useFluidHover picks which item is lit. It knows nothing about animation:
// both highlights (hand-written spring and motion/react) read the same state.
//
// The whole algorithm is one rule: the item nearest the cursor wins. There
// are no gaps where nothing is lit, so the highlight never blinks.

export type Axis = "y" | "x" | "xy";

// An item's box in the container's own coordinates, i.e. the numbers you
// would give an absolutely positioned child to sit exactly on top of it.
export type ItemRect = { left: number; top: number; width: number; height: number };

export type FluidHoverOptions = {
  axis?: Axis;
  isItemDisabled?: (el: HTMLElement) => boolean;
  gapClick?: boolean | { maxDistance?: number };
};

type State = {
  activeIndex: number | null;
  // The last item that was lit. The highlight stays here while it fades out.
  lastIndex: number | null;
  // True when the next move should jump, not glide: the pointer just came in
  // from outside, or the layout was re-measured.
  snap: boolean;
  rects: (ItemRect | undefined)[];
};

const ACTIVE_ATTR = "data-fluid-hover-active";

// 0 when p is inside [start, end], otherwise the distance to the nearer edge.
function distanceToSpan(p: number, start: number, end: number) {
  return p < start ? start - p : p > end ? p - end : 0;
}

export function useFluidHover(
  containerRef: RefObject<HTMLElement | null>,
  { axis = "y", isItemDisabled, gapClick = true }: FluidHoverOptions = {},
) {
  const [state, setState] = useState<State>({
    activeIndex: null,
    lastIndex: null,
    snap: true,
    rects: [],
  });

  // Everything the pointer handlers touch lives in refs, so a mouse move that
  // lands on the same item costs one loop over the rects and no re-render.
  const items = useRef(new Map<number, HTMLElement>());
  const rects = useRef<(ItemRect | undefined)[]>([]);
  const active = useRef<number | null>(null);
  const options = useRef({ axis, isItemDisabled, gapClick });
  useEffect(() => {
    options.current = { axis, isItemDisabled, gapClick };
  });

  // Converts a viewport point to container coordinates. Dividing by the scale
  // keeps this right when a parent is scaled (e.g. a popup zooming in).
  const toLocal = useCallback(
    (clientX: number, clientY: number) => {
      const c = containerRef.current!;
      const box = c.getBoundingClientRect();
      const sx = box.width / c.offsetWidth || 1;
      const sy = box.height / c.offsetHeight || 1;
      return {
        x: (clientX - box.left) / sx - c.clientLeft + c.scrollLeft,
        y: (clientY - box.top) / sy - c.clientTop + c.scrollTop,
        sx,
        sy,
      };
    },
    [containerRef],
  );

  const measure = useCallback(() => {
    if (!containerRef.current) return;
    const next: (ItemRect | undefined)[] = [];
    for (const [index, el] of items.current) {
      const r = el.getBoundingClientRect();
      const { x, y, sx, sy } = toLocal(r.left, r.top);
      next[index] = { left: x, top: y, width: r.width / sx, height: r.height / sy };
    }
    rects.current = next;
    setState((s) => ({ ...s, rects: next, snap: true }));
  }, [containerRef, toLocal]);

  const setActiveIndex = useCallback((index: number | null) => {
    const prev = active.current;
    if (index === prev) return;
    active.current = index;
    if (prev !== null) items.current.get(prev)?.removeAttribute(ACTIVE_ATTR);
    if (index !== null) items.current.get(index)?.setAttribute(ACTIVE_ATTR, "");
    setState((s) => ({
      ...s,
      activeIndex: index,
      lastIndex: index ?? s.lastIndex,
      snap: prev === null,
    }));
  }, []);

  // The whole algorithm.
  const pick = useCallback((px: number, py: number) => {
    const { axis, isItemDisabled } = options.current;
    let best: number | null = null;
    let bestEdge = Infinity;
    let bestCenter = Infinity;
    rects.current.forEach((r, i) => {
      const el = items.current.get(i);
      if (!r || !el || isItemDisabled?.(el)) return;
      // Distance to the item's box, along the axes that matter. A list only
      // cares how far down you are, not how far across.
      const dx = axis === "y" ? 0 : distanceToSpan(px, r.left, r.left + r.width);
      const dy = axis === "x" ? 0 : distanceToSpan(py, r.top, r.top + r.height);
      const edge = dx * dx + dy * dy;
      // Ties (e.g. the cursor is inside two overlapping boxes) go to the
      // nearer center.
      const cx = axis === "y" ? 0 : px - (r.left + r.width / 2);
      const cy = axis === "x" ? 0 : py - (r.top + r.height / 2);
      const center = cx * cx + cy * cy;
      if (edge < bestEdge || (edge === bestEdge && center < bestCenter)) {
        best = i;
        bestEdge = edge;
        bestCenter = center;
      }
    });
    return { index: best as number | null, distance: Math.sqrt(bestEdge) };
  }, []);

  // Re-measure whenever the container or any item changes size.
  const observer = useRef<ResizeObserver | null>(null);
  useEffect(() => {
    const ro = new ResizeObserver(() => measure());
    observer.current = ro;
    if (containerRef.current) ro.observe(containerRef.current);
    for (const el of items.current.values()) ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef, measure]);

  const registerItem = useCallback((index: number, el: HTMLElement | null) => {
    const prev = items.current.get(index);
    if (prev === el) return;
    if (prev) observer.current?.unobserve(prev);
    if (el) {
      items.current.set(index, el);
      observer.current?.observe(el); // also fires once now, which measures it
    } else {
      items.current.delete(index);
    }
  }, []);

  // A stable callback ref per index, so React doesn't unregister and
  // re-register every item on every render.
  const refCache = useRef(new Map<number, (el: HTMLElement | null) => void>());
  const itemRef = useCallback(
    (index: number) => {
      let ref = refCache.current.get(index);
      if (!ref) {
        ref = (el) => registerItem(index, el);
        refCache.current.set(index, ref);
      }
      return ref;
    },
    [registerItem],
  );

  const handlers = useMemo(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return; // touch has no hover
      if (rects.current.length === 0) measure();
      const { x, y } = toLocal(e.clientX, e.clientY);
      setActiveIndex(pick(x, y).index);
    };
    return {
      onPointerEnter: onMove,
      onPointerMove: onMove,
      onPointerLeave: (e: PointerEvent) => {
        if (e.pointerType === "mouse") setActiveIndex(null);
      },
      // A click in a gap between items goes to the lit item.
      onClick: (e: MouseEvent) => {
        const { gapClick } = options.current;
        if (!gapClick || active.current === null) return;
        const target = e.target as Node;
        for (const el of items.current.values()) if (el.contains(target)) return;
        const { x, y } = toLocal(e.clientX, e.clientY);
        const { index, distance } = pick(x, y);
        const max = typeof gapClick === "object" ? gapClick.maxDistance : undefined;
        if (index === null || (max !== undefined && distance > max)) return;
        items.current.get(index)?.click();
      },
    };
  }, [measure, pick, setActiveIndex, toLocal]);

  return {
    axis,
    handlers,
    registerItem,
    itemRef,
    activeIndex: state.activeIndex,
    lastIndex: state.lastIndex,
    snap: state.snap,
    setActiveIndex,
    itemRects: state.rects,
    isMeasured: state.rects.length > 0,
    remeasure: measure,
  };
}

export type FluidHover = ReturnType<typeof useFluidHover>;

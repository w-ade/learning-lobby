import { useEffect, useLayoutEffect, useRef } from "react";
import type { CSSProperties } from "react";
import type { FluidHover } from "../lib/useFluidHover";
import { isAtRest, omegaForDuration, stepSpring, type Spring } from "../lib/spring";
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion";

// The hand-written highlight. React only tells it where to go; the motion
// itself runs outside React, in one requestAnimationFrame loop that writes
// straight to the element's style. No re-render happens while it glides.

type Props = {
  hover: FluidHover;
  className?: string;
  hidden?: boolean;
  duration?: number; // seconds, same meaning as motion's spring duration
  keepVelocity?: boolean; // carry speed into a new target (motion resets it)
};

type Box = { x: Spring; y: Spring; w: Spring; h: Spring };
const KEYS = ["x", "y", "w", "h"] as const;

export function HighlightSpring({
  hover,
  className,
  hidden = false,
  duration = 0.08,
  keepVelocity = true,
}: Props) {
  const el = useRef<HTMLDivElement>(null);
  const box = useRef<Box | null>(null);
  const frame = useRef(0);
  const reducedMotion = usePrefersReducedMotion();

  const target = hover.lastIndex === null ? undefined : hover.itemRects[hover.lastIndex];
  const visible = !hidden && hover.activeIndex !== null && target !== undefined;

  useLayoutEffect(() => {
    const node = el.current;
    if (!node || !target) return;

    const goal = { x: target.left, y: target.top, w: target.width, h: target.height };
    const jump = hover.snap || reducedMotion || duration === 0 || !box.current;

    if (!box.current) {
      box.current = {
        x: { x: goal.x, v: 0, target: goal.x },
        y: { x: goal.y, v: 0, target: goal.y },
        w: { x: goal.w, v: 0, target: goal.w },
        h: { x: goal.h, v: 0, target: goal.h },
      };
    }
    const b = box.current;
    for (const k of KEYS) {
      b[k].target = goal[k];
      if (jump) {
        b[k].x = goal[k];
        b[k].v = 0;
      } else if (!keepVelocity) {
        b[k].v = 0;
      }
    }

    // Width and height are only written when they change, so items of the
    // same size cost nothing but a transform.
    let lastW = -1;
    let lastH = -1;
    const write = () => {
      node.style.transform = `translate3d(${b.x.x}px, ${b.y.x}px, 0)`;
      if (Math.abs(b.w.x - lastW) > 0.01) node.style.width = `${(lastW = b.w.x)}px`;
      if (Math.abs(b.h.x - lastH) > 0.01) node.style.height = `${(lastH = b.h.x)}px`;
    };

    cancelAnimationFrame(frame.current);
    if (jump) {
      write();
      return;
    }

    const omega = omegaForDuration(duration);
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      for (const k of KEYS) stepSpring(b[k], omega, dt);
      if (KEYS.every((k) => isAtRest(b[k]))) {
        for (const k of KEYS) {
          b[k].x = b[k].target;
          b[k].v = 0;
        }
        write();
        return;
      }
      write();
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }, [target, hover.snap, reducedMotion, duration, keepVelocity]);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  return (
    <div
      ref={el}
      aria-hidden
      className={["highlight", className].filter(Boolean).join(" ")}
      data-visible={visible || undefined}
      style={{ "--fade": `${duration}s` } as CSSProperties}
    />
  );
}

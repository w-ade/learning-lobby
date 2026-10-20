import { motion, useReducedMotion, type Transition } from "motion/react";
import type { FluidHover } from "../lib/useFluidHover";
import { spring } from "../lib/springs";

// The motion/react highlight. Same job as HighlightSpring: describe where the
// box should be and let the library run the spring.

type Props = {
  hover: FluidHover;
  className?: string;
  hidden?: boolean;
  transition?: Transition | false;
};

const NOWHERE = { left: 0, top: 0, width: 0, height: 0 };

export function HighlightMotion({
  hover,
  className,
  hidden = false,
  transition = spring.fast,
}: Props) {
  const reducedMotion = useReducedMotion();
  const rect = (hover.lastIndex !== null && hover.itemRects[hover.lastIndex]) || NOWHERE;
  const visible = !hidden && hover.activeIndex !== null && rect !== NOWHERE;

  // Coming in from outside, or after a re-measure: jump there and fade in,
  // don't slide over from wherever the highlight was last time.
  const travel =
    hover.snap || reducedMotion || transition === false ? { duration: 0 } : transition;
  const fade = transition && "duration" in transition ? transition.duration : 0.08;

  return (
    <motion.div
      aria-hidden
      className={["highlight", className].filter(Boolean).join(" ")}
      initial={false}
      animate={{
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
        opacity: visible ? 1 : 0,
      }}
      transition={{ default: travel, opacity: { duration: fade, ease: "easeOut" } }}
    />
  );
}

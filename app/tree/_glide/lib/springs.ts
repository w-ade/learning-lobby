import type { Transition } from "motion/react";

// The spring tokens from Fluid Functionalism, as motion transitions.
// Hover uses `fast`.
export const spring = {
  fast: { type: "spring", duration: 0.08, bounce: 0 },
  moderate: { type: "spring", duration: 0.16, bounce: 0 },
  slow: { type: "spring", duration: 0.24, bounce: 0.12 },
} satisfies Record<string, Transition>;

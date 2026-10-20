// A critically damped spring: bounce 0, the fastest a spring can settle
// without overshooting its target.
//
// The textbook way to run a spring is to step Newton's law every frame:
//
//   force    = -stiffness * (x - target) - damping * velocity
//   velocity += force * dt
//   x        += velocity * dt
//
// That breaks down here. At 0.08s the spring is so stiff (omega ≈ 115/s)
// that one 16ms frame is longer than the spring's own reaction time
// (omega * dt ≈ 1.85), and the stepped version overshoots and wobbles.
// So we use the exact solution of the same equation instead: given where
// the spring is and how fast it's moving now, it says exactly where it will
// be dt seconds later, whatever the frame rate.

export type Spring = {
  x: number; // current value (px)
  v: number; // current velocity (px/s)
  target: number;
};

// Motion's duration-based springs finish when the remaining distance has
// shrunk to 0.1% of the starting distance. For a critically damped spring
// the remaining fraction after t seconds is (1 + ωt)·e^(−ωt), and that
// equals 0.001 when ωt ≈ 9.2334. So "settle in 0.08s" means ω = 9.2334 / 0.08.
const SETTLE = 9.233413476451586;

export function omegaForDuration(duration: number) {
  return SETTLE / duration;
}

export function stepSpring(s: Spring, omega: number, dt: number) {
  const d = s.x - s.target; // how far from home we are
  const c = s.v + omega * d;
  const decay = Math.exp(-omega * dt);
  s.x = s.target + (d + c * dt) * decay;
  s.v = (s.v - omega * c * dt) * decay;
}

export function isAtRest(s: Spring) {
  return Math.abs(s.x - s.target) < 0.01 && Math.abs(s.v) < 0.5;
}

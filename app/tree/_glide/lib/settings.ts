import { createContext, useState } from "react";

export type Settings = { speed: number; showMath: boolean; keepVelocity: boolean };
export const SettingsContext = createContext<Settings>({
  speed: 1,
  showMath: false,
  keepVelocity: true,
});

// Remembers the last pick in a demo, and whether it came from a gap click.
export function usePickLog() {
  const [log, setLog] = useState<string | null>(null);
  return {
    log,
    onPick: (label: string, how: "row" | "gap") =>
      setLog(`${label}${how === "gap" ? " (clicked in a gap)" : ""}`),
  };
}

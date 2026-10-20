"use client";
import { useEffect, useRef } from "react";

export function MindMap({ wide = false, size }: { wide?: boolean; size?: string }) {
  const ref = useRef<HTMLPreElement>(null);
  useEffect(() => {
    let stop: (() => void) | undefined, dead = false;
    (async () => {
      const [{ play }, piece] = await Promise.all([
        // @ts-expect-error untyped JS module
        import("ascii-magic-art/runtime/player.js"),
        !wide && matchMedia("(max-width: 560px)").matches ? import("./mind-map-mobile-piece.js") : import("./mind-map-piece.js"),
      ]);
      if (!dead && ref.current) stop = play(ref.current, piece, { look: { lift: false } });
    })();
    return () => { dead = true; stop?.(); };
  }, [wide]);
  return <pre ref={ref} className="ll-mm" aria-label="Learning Lobby mind map, animated ASCII art"
    style={{ margin: 0, color: "#111119", fontFamily: "Menlo, Consolas, monospace", fontSize: size ?? "var(--mm-size, calc(100cqw / 60))", maxWidth: "100%", overflow: "hidden", lineHeight: 1.2 }} />;
}

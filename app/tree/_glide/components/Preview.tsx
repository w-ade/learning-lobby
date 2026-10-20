import { useRef, useState } from "react";
import type { ReactNode } from "react";
import { useFluidHover } from "../lib/useFluidHover";
import { HighlightSpring } from "./HighlightSpring";
import { Inspector } from "./Inspector";
import { Switch } from "./Switch";

// The card every demo sits in: Preview / Code tabs, and an Inspect switch
// that lays the layout inspector over the preview.

const views = ["Preview", "Code"] as const;

export function Preview({ code, children }: { code: string; children: ReactNode }) {
  const [view, setView] = useState<(typeof views)[number]>("Preview");
  const [inspect, setInspect] = useState(false);
  const body = useRef<HTMLDivElement>(null);
  const tabList = useRef<HTMLDivElement>(null);
  const tabs = useFluidHover(tabList, { axis: "x" });

  return (
    <div className="preview">
      <div className="preview-header">
        <div ref={tabList} role="tablist" className="tabs" {...tabs.handlers}>
          <HighlightSpring hover={tabs} />
          {views.map((v, i) => (
            <button
              key={v}
              ref={tabs.itemRef(i)}
              type="button"
              role="tab"
              aria-selected={view === v}
              className="tab"
              onClick={() => setView(v)}
            >
              {v}
            </button>
          ))}
        </div>
        {view === "Preview" && <Switch checked={inspect} onChange={setInspect} label="Inspect" />}
      </div>
      {view === "Preview" ? (
        <div ref={body} className="preview-body" data-inspecting={inspect || undefined}>
          {children}
          {inspect && <Inspector root={body} />}
        </div>
      ) : (
        <pre className="preview-code">
          <code>{code.trim()}</code>
        </pre>
      )}
    </div>
  );
}

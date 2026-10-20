import { MindMap } from "../mind-map";

export default function MindMapPage() {
  return (
    <main style={{ background: "#FFFFFF", minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <MindMap wide size="min(calc(94vw / 60), calc(88vh / 36))" />
    </main>
  );
}

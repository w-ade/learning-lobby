"use client";
// Feed empty states and onboarding mockups for the learning tracks. Local to /canvas until promoted.
import "./empty-states.css";

type Glyph = React.ReactNode;
const svg = (children: React.ReactNode, fill = false) =>
  <svg viewBox="0 0 24 24" aria-hidden="true" fill={fill ? "currentColor" : "none"} stroke={fill ? "none" : "currentColor"} strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round">{children}</svg>;

const G = {
  bulb: svg(<><path d="M9 15.2a6 6 0 1 1 6 0v1.6a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-1.6Z" /><path d="M10.5 15.5v3" /><path d="M13.5 15.5v3" /></>),
  question: svg(<><path d="M8.8 8.8a3.3 3.3 0 0 1 6.4 1c0 2.2-3.2 2.6-3.2 4.8" /><path d="M12 19h.01" strokeWidth={3.8} /></>),
  sparkles: svg(<><path d="M15 4c.5 2.8 1.9 4.2 4.7 4.7-2.8.5-4.2 1.9-4.7 4.7-.5-2.8-1.9-4.2-4.7-4.7 2.8-.5 4.2-1.9 4.7-4.7Z" /><path d="M8.5 11.5c.4 2.2 1.5 3.3 3.7 3.7-2.2.4-3.3 1.5-3.7 3.7-.4-2.2-1.5-3.3-3.7-3.7 2.2-.4 3.3-1.5 3.7-3.7Z" /><path d="M6.5 4.5c.2 1 .7 1.5 1.7 1.7-1 .2-1.5.7-1.7 1.7-.2-1-.7-1.5-1.7-1.7 1-.2 1.5-.7 1.7-1.7Z" /><path d="M17.5 16c.2 1 .7 1.5 1.7 1.7-1 .2-1.5.7-1.7 1.7-.2-1-.7-1.5-1.7-1.7 1-.2 1.5-.7 1.7-1.7Z" /></>, true),
  heart: svg(<path d="M12 20.5S3 15.2 3 9a4.6 4.6 0 0 1 9-1.4A4.6 4.6 0 0 1 21 9c0 6.2-9 11.5-9 11.5Z" />, true),
  bolt: svg(<path d="M13.5 2.5 5.5 13.2h6l-1.5 8.3 8-10.7h-6l1.5-8.3Z" />, true),
  check: svg(<path d="m6.5 12.5 3.6 3.5 7.4-7.6" />),
  spin: svg(<>{[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => <path key={a} d="M12 4v3.2" opacity={0.35 + i * 0.09} transform={`rotate(${a} 12 12)`} />)}</>),
  ring: svg(<circle cx="12" cy="12" r="5.5" strokeWidth={3.4} />),
  listPlus: svg(<><path d="M4 6.5h13M4 11.5h13M4 16.5h7M17 14v6M14 17h6" /></>),
  hex: svg(<><path d="M12 2.8 20 7.4v9.2l-8 4.6-8-4.6V7.4l8-4.6Z" fill="currentColor" /><circle cx="12" cy="12" r="3.2" fill="#FFFFFF" stroke="none" /></>),
  x: svg(<path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />),
  plus: svg(<path d="M12 5.5v13M5.5 12h13" />),
  arrow: svg(<><path d="M4.5 12h14.5" /><path d="m13 6 6 6-6 6" /></>),
};

/** Blob mascot: two top buns, wide lobed base, white face. `glyph` replaces the eyes. */
export function Mascot({ body = "#000000", glyph, ink, size = 130 }: { body?: string; glyph?: Glyph; ink?: string; size?: number }) {
  return <span className="es-mascot" style={{ width: size, height: size * 0.76, color: ink }}>
    <svg viewBox="0 0 162 123" aria-hidden="true">
      <path fill={body} d="M81 16C73 5 63 0 52 0 32 0 18 15 17 35 16 46 11 55 6 66 2 74 0 84 0 94c0 17 13 28 30 28 10 0 18-3 26-6 8 5 16 7 25 7s17-2 25-7c8 3 16 6 26 6 17 0 30-11 30-28 0-10-2-20-6-28-5-11-10-20-11-31-1-20-15-35-35-35-11 0-21 5-29 16Z" />
      <rect x="36" y="40" width="90" height="58" rx="29" fill="#FFFFFF" />
      {!glyph && <g fill={body}><circle cx="58" cy="58" r="6.5" /><circle cx="104" cy="58" r="6.5" /></g>}
    </svg>
    {glyph && <span className="es-mascot-glyph">{glyph}</span>}
  </span>;
}

export function AgentsWorking() {
  return <article className="es-card es-working">
    <div className="es-trio" aria-hidden="true">
      <span style={{ background: "#E8A23B" }}>{G.bulb}</span>
      <span style={{ background: "#4CA3E3" }}>{G.question}</span>
      <span style={{ background: "#855FEE" }}>{G.sparkles}</span>
    </div>
    <h3>Your agents are getting to work</h3>
    <p>This feed is where you'll see important insights, questions, and suggestions. Might take a bit to see first updates as your agents analyse your company</p>
  </article>;
}

const crew = [
  { x: -240, s: 0.46, body: "#E7EEFB", ink: "#AFC4EE", glyph: G.ring },
  { x: -141, s: 0.75, body: "#F9DCDF", ink: "#E4566A", glyph: G.heart },
  { x: 0, s: 1, body: "#000000" },
  { x: 141, s: 0.75, body: "#FCF1C6", ink: "#E8A23B", glyph: G.bolt },
  { x: 240, s: 0.46, body: "#EDEDED", ink: "#BDBDBD", glyph: G.ring },
];

export function TeamReady() {
  return <article className="es-card es-ready">
    <div className="es-crew" aria-hidden="true">
      {crew.map(c => <span key={c.x} style={{ transform: `translate(calc(-50% + ${c.x}px), -50%) scale(${c.s})` }}>
        <Mascot body={c.body} ink={c.ink} glyph={c.glyph} />
      </span>)}
    </div>
    <h3>Your AI team is ready for work</h3>
    <p>Deploy your first agent to start automating tasks, monitoring trends, and getting proactive insights</p>
    <button type="button" className="es-cta">Deploy your first agent{G.arrow}</button>
  </article>;
}

const steps = [
  { bg: "#5BB07F", fg: "#FFFFFF", g: G.check },
  { bg: "#4D4D4D", fg: "#FFFFFF", g: G.spin },
  { bg: "#EDEDED", fg: "#7A7A7A", g: G.ring },
  { bg: "#EDEDED", fg: "#7A7A7A", g: G.listPlus },
  { bg: "#EDEDED", fg: "#7A7A7A", g: G.hex },
];

export function Syncing() {
  return <div className="es-sync">
    <Mascot size={55} />
    <h2>8% – Learning how your team works</h2>
    <p className="es-sync-sub">Hang tight, syncing in progress.</p>
    <div className="es-bubbles">
      <p>Analyzing tools, workflows, and patterns.</p>
      <p>This usually takes a few minutes to an hour depending on data volume. Progress updates will appear here.</p>
      <i aria-hidden="true" /><i aria-hidden="true" />
    </div>
    <div className="es-steps" aria-label="Sync steps: 1 of 5 done">
      {steps.map((s, i) => <span key={i} style={{ background: s.bg, color: s.fg }}>{s.g}</span>)}
    </div>
    <article className="es-ask">
      <div className="es-ask-head">
        <Mascot size={54} body="#C9C9C9" ink="#000000" glyph={G.question} />
        <button type="button" className="es-esc">{G.x}esc</button>
      </div>
      <h3>Tell Me About Your Competitors</h3>
      <p>Thanks for helping me! Knowing your main competitors will help me deliver your insights faster</p>
      <label className="es-field">
        <span className="es-field-l">Competitor website</span>
        <span className="es-input">
          <span className="es-prefix">https://</span>
          <input placeholder="acme.com" />
          <button type="button">{G.plus}Add</button>
        </span>
      </label>
    </article>
  </div>;
}

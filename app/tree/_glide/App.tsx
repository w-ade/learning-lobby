"use client";

import { useState } from "react";
import Link from "next/link";
import { Column, Demo, type Item } from "./components/Demo";
import { Preview } from "./components/Preview";
import { Switch } from "./components/Switch";
import { gridCode, listCode, skipCode, tabsCode } from "./snippets";
import { SettingsContext, usePickLog, type Settings } from "./lib/settings";

const mail: Item[] = [
  { label: "Inbox" },
  { label: "Drafts" },
  { label: "Sent" },
  { label: "Archive" },
  { label: "Trash" },
];

const tabs: Item[] = [
  { label: "Library" },
  { label: "Recents" },
  { label: "Favorites" },
  { label: "Settings" },
];

const cards: Item[] = [
  { label: "Inbox", description: "Everything new lands here." },
  { label: "Drafts", description: "Unsent, saved as you type." },
  { label: "Sent", description: "Delivered and archived." },
  { label: "Trash", description: "Emptied after 30 days." },
];

const workspace: Item[] = [
  { label: "Chat" },
  { label: "Today" },
  { label: "Agents", disabled: true },
  { label: "Knowledge" },
  { label: "Runs" },
];

const speeds = [
  { value: 1, label: "1×" },
  { value: 4, label: "4× slower" },
  { value: 12, label: "12× slower" },
];

export default function App() {
  const [settings, setSettings] = useState<Settings>({
    speed: 1,
    showMath: false,
    keepVelocity: true,
  });
  const set = (patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch }));
  const springLog = usePickLog();
  const motionLog = usePickLog();

  return (
    <SettingsContext.Provider value={settings}>
      <main>
        <header className="page-header">
          <Link href="/" className="back-button">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M10 3.5 5.5 8l4.5 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back
          </Link>
          <h1>Tree</h1>
        </header>

        <div className="controls" role="group" aria-label="Playground settings">
          <div className="segmented" role="radiogroup" aria-label="Speed">
            {speeds.map((s) => (
              <button
                key={s.value}
                type="button"
                role="radio"
                aria-checked={settings.speed === s.value}
                onClick={() => set({ speed: s.value })}
              >
                {s.label}
              </button>
            ))}
          </div>
          <Switch
            checked={settings.showMath}
            onChange={(showMath) => set({ showMath })}
            label="Show the math"
          />
          <Switch
            checked={settings.keepVelocity}
            onChange={(keepVelocity) => set({ keepVelocity })}
            label="Hand spring keeps its speed"
          />
        </div>

        <section>
          <h2>Blink or glide</h2>
          <p>
            Move the cursor slowly down each list. Plain <code>:hover</code> turns off in every gap
            between rows, and each flash pulls your eye. The fluid ones always light the nearest
            row, so there's nothing to blink.
          </p>
          <Preview code={listCode}>
            <div className="columns columns-3">
              <Column
                title="Plain :hover"
                note="blinks at every gap"
                swatch={{ name: "Pink", hex: "#F2479B" }}
              >
                <Demo engine="plain" layout="list" items={mail} />
              </Column>
              <Column
                title="Hand-written spring"
                note="rAF + exact spring math"
                swatch={{ name: "Violet", hex: "#8B5CF6" }}
              >
                <Demo engine="spring" layout="list" items={mail} />
              </Column>
              <Column
                title="motion/react"
                note="spring, 0.08s, bounce 0"
                swatch={{ name: "Coral", hex: "#FF6B4A" }}
              >
                <Demo engine="motion" layout="list" items={mail} />
              </Column>
            </div>
          </Preview>
        </section>

        <section>
          <h2>Three axes</h2>
          <p>
            <code>axis</code> sets which distance counts. <code>y</code> only looks at how far down
            you are, <code>x</code> how far across, and <code>xy</code> finds the nearest card in a
            grid. Tabs have different widths, so the highlight changes width as it moves.
          </p>
          <h3>
            <code>axis="x"</code> tabs
          </h3>
          <Preview code={tabsCode}>
            <div className="columns">
              <Column title="Hand-written spring">
                <Demo engine="spring" layout="tabs" axis="x" items={tabs} />
              </Column>
              <Column title="motion/react">
                <Demo engine="motion" layout="tabs" axis="x" items={tabs} />
              </Column>
            </div>
          </Preview>
          <h3>
            <code>axis="xy"</code> grid
          </h3>
          <Preview code={gridCode}>
            <div className="columns">
              <Column title="Hand-written spring">
                <Demo engine="spring" layout="grid" axis="xy" items={cards} />
              </Column>
              <Column title="motion/react">
                <Demo engine="motion" layout="grid" axis="xy" items={cards} />
              </Column>
            </div>
          </Preview>
        </section>

        <section>
          <h2>Skipped rows and gap clicks</h2>
          <p>
            "Agents" is disabled, so the highlight skips over it. Clicking in the space between two
            rows clicks the lit row, so a click can't land on nothing.
          </p>
          <Preview code={skipCode}>
            <div className="columns">
              <Column title="Hand-written spring" note={springLog.log ?? "Click a row or a gap"}>
                <Demo engine="spring" layout="list" items={workspace} onPick={springLog.onPick} />
              </Column>
              <Column title="motion/react" note={motionLog.log ?? "Click a row or a gap"}>
                <Demo engine="motion" layout="list" items={workspace} onPick={motionLog.onPick} />
              </Column>
            </div>
          </Preview>
        </section>

        <section>
          <h2>What's different between the two</h2>
          <p>Set the speed to 12× slower and move quickly back and forth across the grid.</p>
          <ul className="notes">
            <li>
              <strong>Changing direction mid-glide.</strong> The hand spring keeps its current
              speed, so if you reverse, it drifts a little further the old way before turning, like
              something with weight. motion's duration-based springs throw the speed away and start
              every new target from rest, so they turn instantly. Untick "Hand spring keeps its
              speed" to make the hand spring behave like motion.
            </li>
            <li>
              <strong>Who re-renders.</strong> Both engines only update React when the lit item
              changes. While the highlight glides, the hand spring writes <code>transform</code>{" "}
              straight to the element from one <code>requestAnimationFrame</code> loop. motion does
              the same thing inside the library.
            </li>
            <li>
              <strong>Same curve.</strong> The hand spring solves the same critically damped spring
              as motion's <code>duration: 0.08, bounce: 0</code>: ω = 9.2334 / duration, so it
              settles to 0.1% in the same time.
            </li>
            <li>
              <strong>Reduced motion.</strong> Both drop the glide and keep the fade. The hand
              version checks <code>matchMedia</code> itself; motion uses{" "}
              <code>useReducedMotion</code>.
            </li>
          </ul>
        </section>

        <footer className="footnote">
          <p>
            A fluid hover highlight that never blinks. It glides to whichever item is nearest the
            cursor. Built twice: once with a spring written by hand, once with motion/react. Based
            on <a href="https://www.fluidfunctionalism.com/docs/fluid-hover">Fluid Functionalism</a>
            .
          </p>
        </footer>
      </main>
    </SettingsContext.Provider>
  );
}

export type Ref = { url: string; title: string; date: string; note: string };
export type RefGroup = { group: string; items: Ref[] };

// Newest first within each group.
export const reflog: RefGroup[] = [
  { group: "Design & UI", items: [
    { url: "https://www.ascii-magic.com/ascii/mind-map", title: "ASCII Magic — Mind Map", date: "2026-10-20", note: "ASCII mind map graphic for the login page (MIT licensed)." },
    { url: "https://onwend.com/learn", title: "onwend — Learn", date: "2026-10-20", note: "Source of the animated course tree Learning Lobby is built on." },
  ]},
  { group: "Business / Yield", items: [
    { url: "https://x.com/alextalksai/status/2112556295370809688", title: "Selling ~200 websites in 12 months by scraping businesses with bad sites", date: "2026-10-21", note: "Spanish post: a couple scraped local businesses with slow/broken/mobile-unfriendly sites and sold redesigns; ties to Yield's website rescue idea." },
  ]},
  { group: "Tools & Repos", items: [
    { url: "https://nimbalyst.com/", title: "Nimbalyst", date: "2026-10-21", note: "Open-source visual workspace for coding agents; candidate home for project context instead of localhost docs." },
    { url: "https://github.com/Nimbalyst/nimbalyst", title: "Nimbalyst — GitHub", date: "2026-10-21", note: "MIT-licensed source for the Nimbalyst desktop app." },
    { url: "https://github.com/nimbalyst/nimbalyst-wiki", title: "Nimbalyst Wiki — GitHub", date: "2026-10-21", note: "Plugin where agents write a markdown wiki of decisions into your repo." },
    { url: "https://github.com/ephraimduncan/weekday", title: "Weekday — GitHub", date: "2026-10-21", note: "Open-source calendar; UI reference, cloned to Labs (AGPL-3.0)." },
  ]},
  { group: "Other", items: [
    { url: "https://www.fluidfunctionalism.com/docs/fluid-hover", title: "Fluid Functionalism — Fluid Hover", date: "2026-10-20", note: "Hover glide effect credited in the tree component." },
  ]},
];

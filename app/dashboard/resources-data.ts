// Resource docs: the tools, frameworks, and references in daily use, as bookmark sets. Placeholder picks until this is editable.
export type DocLink = { kind: "Docs" | "Guide" | "Reference" | "API" | "Tutorial" | "Examples"; title: string; url: string };
export type DocTool = { id: string; name: string; letter: string; color: string; cat: string; desc: string; home: string; used: string[]; links: DocLink[] };

export const categories = ["Frameworks", "Styling & UI", "Motion", "3D & Graphics", "AI", "Platform", "Web platform"] as const;

export const docTools: DocTool[] = [
  { id: "next", name: "Next.js", letter: "N", color: "#111119", cat: "Frameworks", desc: "App Router, server and client components, routing, data, and metadata.", home: "https://nextjs.org/docs", used: ["D01", "D12"],
    links: [
      { kind: "Docs", title: "Next.js docs", url: "https://nextjs.org/docs" },
      { kind: "Tutorial", title: "Next.js Learn course", url: "https://nextjs.org/learn" },
      { kind: "Guide", title: "Server and client components", url: "https://nextjs.org/docs/app/getting-started/server-and-client-components" },
      { kind: "Reference", title: "Metadata and OG images", url: "https://nextjs.org/docs/app/getting-started/metadata-and-og-images" },
    ] },
  { id: "react", name: "React", letter: "R", color: "#149ECA", cat: "Frameworks", desc: "Components, state, effects, and composition.", home: "https://react.dev/learn", used: ["D01"],
    links: [
      { kind: "Tutorial", title: "Learn React", url: "https://react.dev/learn" },
      { kind: "Reference", title: "Hooks reference", url: "https://react.dev/reference/react/hooks" },
      { kind: "Guide", title: "You might not need an effect", url: "https://react.dev/learn/you-might-not-need-an-effect" },
    ] },
  { id: "ts", name: "TypeScript", letter: "T", color: "#3178C6", cat: "Frameworks", desc: "Types for props, components, and everything in between.", home: "https://www.typescriptlang.org/docs/", used: ["D01"],
    links: [
      { kind: "Docs", title: "TypeScript handbook", url: "https://www.typescriptlang.org/docs/handbook/intro.html" },
      { kind: "Guide", title: "React TypeScript cheatsheet", url: "https://react-typescript-cheatsheet.netlify.app" },
    ] },
  { id: "tailwind", name: "Tailwind CSS", letter: "T", color: "#38BDF8", cat: "Styling & UI", desc: "Utility-first styling, theme tokens, and responsive variants.", home: "https://tailwindcss.com/docs", used: ["D01", "D02", "D08"],
    links: [
      { kind: "Docs", title: "Tailwind docs", url: "https://tailwindcss.com/docs" },
      { kind: "Reference", title: "Theme variables", url: "https://tailwindcss.com/docs/theme" },
    ] },
  { id: "baseui", name: "Base UI", letter: "B", color: "#111119", cat: "Styling & UI", desc: "Unstyled, accessible React primitives. The house default.", home: "https://base-ui.com", used: ["D08"],
    links: [
      { kind: "Docs", title: "Base UI overview", url: "https://base-ui.com/react/overview/quick-start" },
      { kind: "Reference", title: "Components", url: "https://base-ui.com/react/components/accordion" },
    ] },
  { id: "radix", name: "Radix + shadcn/ui", letter: "R", color: "#6E56CF", cat: "Styling & UI", desc: "Headless primitives and copy-in component patterns.", home: "https://www.radix-ui.com/primitives/docs/overview/introduction", used: ["D08"],
    links: [
      { kind: "Docs", title: "Radix Primitives", url: "https://www.radix-ui.com/primitives/docs/overview/introduction" },
      { kind: "Docs", title: "shadcn/ui docs", url: "https://ui.shadcn.com/docs" },
      { kind: "Reference", title: "Design Tokens Community Group", url: "https://www.designtokens.org" },
    ] },
  { id: "motion", name: "Motion", letter: "M", color: "#FFD600", cat: "Motion", desc: "Springs, layout animation, gestures, and exit transitions for React.", home: "https://motion.dev/docs/react", used: ["D03", "D05"],
    links: [
      { kind: "Docs", title: "Motion for React", url: "https://motion.dev/docs/react" },
      { kind: "Guide", title: "Layout animations", url: "https://motion.dev/docs/react-layout-animations" },
      { kind: "Guide", title: "Great animations (Emil Kowalski)", url: "https://emilkowal.ski/ui/great-animations" },
    ] },
  { id: "gsap", name: "GSAP", letter: "G", color: "#0AE448", cat: "Motion", desc: "Timelines, ScrollTrigger, pinning, and scrubbing.", home: "https://gsap.com/docs/v3/", used: ["D04", "D05"],
    links: [
      { kind: "Tutorial", title: "Get started", url: "https://gsap.com/resources/get-started/" },
      { kind: "Reference", title: "ScrollTrigger", url: "https://gsap.com/docs/v3/Plugins/ScrollTrigger/" },
      { kind: "Guide", title: "useGSAP for React", url: "https://gsap.com/resources/React/" },
      { kind: "Examples", title: "Scroll-driven animation demos", url: "https://scroll-driven-animations.style" },
    ] },
  { id: "r3f", name: "React Three Fiber", letter: "3", color: "#111119", cat: "3D & Graphics", desc: "Three.js scenes as React components, plus drei helpers.", home: "https://r3f.docs.pmnd.rs/getting-started/introduction", used: ["D06", "D07"],
    links: [
      { kind: "Docs", title: "R3F docs", url: "https://r3f.docs.pmnd.rs/getting-started/introduction" },
      { kind: "Docs", title: "Three.js manual", url: "https://threejs.org/manual/" },
      { kind: "Tutorial", title: "Three.js Journey", url: "https://threejs-journey.com" },
    ] },
  { id: "shaders", name: "Shaders", letter: "S", color: "#FF6A3D", cat: "3D & Graphics", desc: "GLSL, noise, gradients, and distortion.", home: "https://thebookofshaders.com", used: ["D07"],
    links: [
      { kind: "Tutorial", title: "The Book of Shaders", url: "https://thebookofshaders.com" },
      { kind: "Examples", title: "Shadertoy", url: "https://www.shadertoy.com" },
    ] },
  { id: "claude", name: "Claude Code", letter: "C", color: "#D97757", cat: "AI", desc: "Agentic coding in the terminal: plan, prompt, review, commit.", home: "https://docs.anthropic.com/en/docs/claude-code/overview", used: ["D01", "B"],
    links: [
      { kind: "Docs", title: "Claude Code overview", url: "https://docs.anthropic.com/en/docs/claude-code/overview" },
      { kind: "API", title: "Claude API docs", url: "https://docs.anthropic.com/en/api/overview" },
    ] },
  { id: "aisdk", name: "AI SDK", letter: "A", color: "#111119", cat: "AI", desc: "Streaming chat, tool calls, and agent UI on any model.", home: "https://ai-sdk.dev/docs/introduction", used: ["D10", "B"],
    links: [
      { kind: "Docs", title: "AI SDK docs", url: "https://ai-sdk.dev/docs/introduction" },
      { kind: "Examples", title: "Next.js AI Chatbot template", url: "https://vercel.com/templates/next.js/nextjs-ai-chatbot" },
    ] },
  { id: "vercel", name: "Vercel", letter: "V", color: "#111119", cat: "Platform", desc: "Deploys, previews, domains, and env vars for every project.", home: "https://vercel.com/docs", used: ["D01", "D05"],
    links: [
      { kind: "Docs", title: "Vercel docs", url: "https://vercel.com/docs" },
      { kind: "Reference", title: "Vercel CLI", url: "https://vercel.com/docs/cli" },
    ] },
  { id: "figma", name: "Figma", letter: "F", color: "#A259FF", cat: "Platform", desc: "Variables, Dev Mode, and the plugin API.", home: "https://help.figma.com", used: ["D08", "D11"],
    links: [
      { kind: "API", title: "Plugin docs", url: "https://www.figma.com/plugin-docs/" },
      { kind: "Guide", title: "Variables", url: "https://help.figma.com/hc/en-us/articles/15339657135383-Guide-to-variables-in-Figma" },
    ] },
  { id: "mdn", name: "MDN Web Docs", letter: "M", color: "#3582FA", cat: "Web platform", desc: "The reference for HTML, CSS, and browser APIs.", home: "https://developer.mozilla.org", used: ["D02", "D04"],
    links: [
      { kind: "Reference", title: "CSS reference", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference" },
      { kind: "Guide", title: "CSS scroll-driven animations", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations" },
      { kind: "Guide", title: "Interactive guide to Flexbox", url: "https://www.joshwcomeau.com/css/interactive-guide-to-flexbox/" },
    ] },
  { id: "webdev", name: "web.dev", letter: "W", color: "#1A73E8", cat: "Web platform", desc: "Courses on CSS, performance, and accessibility.", home: "https://web.dev/learn", used: ["D02", "D05", "D09"],
    links: [
      { kind: "Tutorial", title: "Learn Accessibility", url: "https://web.dev/learn/accessibility" },
      { kind: "Tutorial", title: "Learn Performance", url: "https://web.dev/learn/performance" },
      { kind: "Reference", title: "ARIA Authoring Practices", url: "https://www.w3.org/WAI/ARIA/apg/" },
      { kind: "Reference", title: "PageSpeed Insights", url: "https://pagespeed.web.dev" },
    ] },
];

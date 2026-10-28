"use client";
// Canvas items. Add, rename, or remove mockups here; the canvas controller never needs to change.
import { agentCourses, code, type Mod } from "../catalog-data";
import { CourseCard, LabCard, LessonCard, ModuleCard, PlannedCourseCard, ProjectCard, TrackCard, type Icons } from "./cards";
import { CoursePage, LessonPage, ModulePage, TrackPage } from "./pages";
import { tracks } from "../curriculum";
import { reflog } from "../reflog-data";
import { NotesColumns, type BCol, type BNote } from "./board";
import { NoteCard, NotesBoard, NotesInbox, StackedPanes, type BoardNode, type Highlight, type Note } from "./notes";
import { BookCard, DocSetCard, HighlightPopup, LibraryPage, ReaderFocus, type Book, type DocSet, type Link } from "./library";
import { CompletedRow, FeedGreeting, OverviewFeed, SuggestionStack, UpNext } from "../dashboard/feed";
import { completed, greeting, suggestions, upNext } from "../dashboard/feed-data";

export type Entry = { id: string; name: string; x: number; y: number; w: number; h?: number; render: (I: Icons) => React.ReactNode };

const course = agentCourses[0];
const mods = (course.m ?? []) as Mod[];
const lessons = mods.flatMap(([, ls]) => ls);
const labs = lessons.filter(l => l.startsWith("Lab:")).length;
const [modTitle, modLessons] = mods[0];
const lab = modLessons.find(l => l.startsWith("Lab:"))!.replace(/^Lab: /, "");

const [, tB] = tracks;
const b01 = tB.courses[0];
const a01 = tracks[0].courses[0];

// Library samples. Book titles are placeholders until real PDFs are added.
const books: Book[] = [
  { title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", page: 112, pages: 590, highlights: 34, hue: 210 },
  { title: "The Pragmatic Programmer", author: "Hunt & Thomas", page: 288, pages: 352, highlights: 51, hue: 20 },
  { title: "Refactoring UI", author: "Wathan & Schoger", page: 40, pages: 250, highlights: 12, hue: 150 },
  { title: "The Mom Test", author: "Rob Fitzpatrick", page: 0, pages: 136, highlights: 0, hue: 330 },
  { title: "Build", author: "Tony Fadell", page: 65, pages: 400, highlights: 9, hue: 45 },
];
const docs: DocSet[] = [
  { name: "Next.js", host: "nextjs.org/docs", kind: "Framework", read: 18, pages: 160, letter: "N", color: "var(--ink)" },
  { name: "React", host: "react.dev", kind: "Library", read: 41, pages: 90, letter: "R", color: "#149ECA" },
  { name: "Claude API", host: "docs.claude.com", kind: "Platform", read: 7, pages: 120, letter: "C", color: "#D97757" },
  { name: "AI SDK", host: "ai-sdk.dev/docs", kind: "Library", read: 3, pages: 75, letter: "A", color: "var(--ink)" },
  { name: "MDN Web Docs", host: "developer.mozilla.org", kind: "Reference", read: 22, pages: 400, letter: "M", color: "#3582FA" },
  { name: "TypeScript", host: "typescriptlang.org/docs", kind: "Language", read: 0, pages: 85, letter: "T", color: "#3178C6" },
];
const links: Link[] = reflog.flatMap(g => g.items.map(r => ({ title: r.title, url: r.url, note: r.note, group: g.group })));

// Notes samples: a small linked thread about agents (original text).
const notes: Note[] = [
  { id: "n1", title: "An agent is a model in a loop", body: "An agent is a model that can call [[Tools]] inside [[The agent loop]], with some form of [[Agent memory]]. Take away any one and it's a workflow, not an agent.",
    source: { i: "play", l: `${b01.code} · Module 1 · Lesson 3` }, tags: ["agents", "b01"], edited: "Today" },
  { id: "n2", title: "The agent loop", body: "Observe, decide, act, then check. The stopping rule matters more than the model: see [[Stopping conditions]]. Every step costs tokens, so loops need budgets.",
    source: { i: "book", l: `${books[0].title} · p. 112` }, tags: ["agents"], edited: "Yesterday" },
  { id: "n3", title: "Agent memory", body: "Short-term memory is the context window. Long-term memory is anything you retrieve back into it. So memory is a retrieval problem, not a storage problem. Related: [[The agent loop]].",
    source: { i: "globe", l: "Claude API · Context windows" }, tags: ["agents", "memory"], edited: "Mon" },
  { id: "n4", title: "Tools", body: "A tool is a function the model can ask you to run. The model never runs it; your code does, then hands back the result. That's why [[Agent memory]] fills up fast with tool output.",
    source: { i: "globe", l: "AI SDK · Tool calling" }, tags: ["agents", "tools"], edited: "Mon" },
  { id: "n5", title: "Stopping conditions", body: "Stop when the goal is met, a step budget runs out, or there's no progress for N steps. Without one, [[The agent loop]] just burns money.",
    tags: ["agents"], edited: "Sun" },
];
const highlights: Highlight[] = [
  { id: "h1", quote: "The quality of an agent is mostly the quality of its loop: what it chooses to look at, how it decides, and when it knows to stop.", source: { i: "book", l: `${books[0].title} · p. 112` }, when: "2h ago", color: "#FCE461" },
  { id: "h2", quote: "Tool results are returned to the model as messages, so long outputs consume context quickly.", source: { i: "globe", l: "Claude API · Tool use" }, when: "Yesterday", color: "#9EC1FF" },
  { id: "h3", quote: "Picking the simplest thing that works is usually a workflow, not an agent.", source: { i: "play", l: `${b01.code} · Module 2 · Lesson 2` }, when: "Mon", color: "#89F4A2" },
];
const boardNodes: BoardNode[] = [
  { id: "n1", x: 270, y: 30, kind: "note", title: "An agent is a model in a loop", sub: "Note" },
  { id: "n2", x: 40, y: 170, kind: "note", title: "The agent loop", sub: "Note" },
  { id: "n3", x: 500, y: 170, kind: "note", title: "Agent memory", sub: "Note" },
  { id: "n4", x: 270, y: 300, kind: "note", title: "Tools", sub: "Note" },
  { id: "n5", x: 40, y: 330, kind: "note", title: "Stopping conditions", sub: "Note" },
  { id: "s1", x: 40, y: 30, kind: "source", title: books[0].title, sub: "Book · p. 112", i: "book" },
  { id: "s2", x: 500, y: 330, kind: "source", title: "Claude API docs", sub: "Docs · Context windows", i: "globe" },
];
const boardEdges: [string, string][] = [["n1", "n2"], ["n1", "n3"], ["n1", "n4"], ["n2", "n5"], ["n3", "n2"], ["n4", "n3"], ["s1", "n2"], ["s2", "n3"]];

// Column board sample: richer bodies with headings, lists, and links (one points off-board to show opening a new column).
const bNotes: BNote[] = [
  { id: "p1", title: "An agent is a model in a loop", tags: ["agents"], body: "An agent is a model that can call [[Tools]] inside [[The agent loop]], with some form of [[Agent memory]].\n\n## Why it matters\n\n- Take one piece away and it's a workflow\n- Most bugs live in the loop, not the model" },
  { id: "p2", title: "Workflow or agent?", tags: ["agents", "b01"], body: "Pick the simplest thing that works. If the steps are known ahead of time, it's a ==workflow==.\n\nAgents earn their cost when the path depends on what the model finds. See [[An agent is a model in a loop]]." },
  { id: "p3", title: "The agent loop", tags: ["agents"], color: 1, body: "Observe, decide, act, then check.\n\n## The stopping rule\n\n- Goal met\n- Step budget spent\n  - Every step costs tokens\n- No progress for N steps\n\nMore in [[Stopping conditions]]." },
  { id: "p4", title: "Stopping conditions", tags: ["agents"], body: "Without one, [[The agent loop]] just burns money. Budgets are a product decision, not only an engineering one." },
  { id: "p5", title: "Agent memory", tags: ["memory"], body: "Short-term memory is the context window; long-term is anything you **retrieve** back into it.\n\nSo memory is a retrieval problem. Start with [[Context windows]]." },
  { id: "p6", title: "Tools", tags: ["tools"], body: "A tool is a function the model asks you to run. Your code runs it and returns the result as a message, which is why [[Agent memory]] fills up fast.\n\n- Name it like a verb: `search_docs`\n- Describe when *not* to use it" },
];
const bCols: BCol[] = [
  { id: "c1", title: "Foundations", notes: ["p1", "p2"] },
  { id: "c2", title: "The loop", notes: ["p3", "p4"] },
  { id: "c3", title: "Memory & tools", notes: ["p5", "p6"] },
];

export const registry: Entry[] = [
  { id: "track", name: "Track card", x: 0, y: 0, w: 320,
    render: I => <TrackCard I={I} label="Track B" title="Agent Engineering" desc="How agents actually work, from models and tools to loops, memory, safety, and production."
      courses={agentCourses.length} modules={agentCourses.reduce((n, c) => n + (c.m?.length ?? 0), 0)} progress={18} color="#E8C928" /> },
  { id: "course", name: "Course card", x: 360, y: 0, w: 320,
    render: I => <CourseCard I={I} code={code(0)} group={course.g} title={course.t} desc={course.d} modules={mods.length} lessons={lessons.length - labs} labs={labs} progress={42} /> },
  { id: "module", name: "Module card", x: 720, y: 0, w: 320,
    render: I => <ModuleCard I={I} code={code(0)} n={1} title={modTitle} lessons={modLessons} done={2} /> },
  { id: "lesson", name: "Lesson card", x: 0, y: 360, w: 320,
    render: I => <LessonCard I={I} code={code(0)} module={1} n={1} title={modLessons[0]} minutes={8} /> },
  { id: "lab", name: "Lab card", x: 360, y: 360, w: 320,
    render: I => <LabCard I={I} code={code(0)} module={1} title={lab} desc="Put the module into practice: pick three agents you already use and map their model, tools, loop, and memory." minutes={30} /> },
  { id: "project", name: "Project card", x: 720, y: 440, w: 320,
    render: I => <ProjectCard I={I} code={code(0)} module={4} title={mods[3][1].at(-1)!.replace(/^Lab: /, "")}
      desc="Your first working agent project: send one message to a model from your own code and print the reply."
      steps={[{ l: "Create the project from the template", done: true }, { l: "Add your API key as an env var", done: true }, { l: "Make one call and print the reply", done: false }, { l: "Commit and push to GitHub", done: false }]}
      links={[{ i: "branch", l: "hello-agent" }, { i: "note", l: "2 notes" }]} /> },
  { id: "planned-course", name: "Course card · in planning", x: 0, y: 720, w: 320,
    render: I => <PlannedCourseCard I={I} code={a01.code} group={tracks[0].title} title={a01.title} desc={a01.desc} /> },
  { id: "page-track", name: "Track page", x: 0, y: 1400, w: 1040, render: I => <TrackPage I={I} track={tB} limit={9} /> },
  { id: "page-course", name: "Course page", x: 1120, y: 1400, w: 1040, render: I => <CoursePage I={I} track={tB} course={b01} /> },
  { id: "page-module", name: "Module page", x: 2240, y: 1400, w: 720, render: I => <ModulePage I={I} track={tB} course={b01} module={b01.modules[0]} /> },
  { id: "page-lesson", name: "Lesson page", x: 3040, y: 1400, w: 720,
    render: I => <LessonPage I={I} track={tB} course={b01} module={b01.modules[0]} n={1} file="content/b-agent-engineering/B01-agent-engineering-foundations/m01-what-an-agent-is/01-models-programs-and-agents.md" /> },
  { id: "page-library", name: "Library page", x: 0, y: 3200, w: 1040, render: I => <LibraryPage I={I} books={books} docs={docs} links={links} /> },
  { id: "reader-focus", name: "Reader · focus mode", x: 1120, y: 3200, w: 1040, render: I => <ReaderFocus I={I} book={books[0]} /> },
  { id: "book-card", name: "Book card", x: 2240, y: 3200, w: 200, render: I => <BookCard I={I} b={books[1]} /> },
  { id: "docset-card", name: "Docs card", x: 2480, y: 3200, w: 320, render: I => <DocSetCard I={I} d={docs[1]} /> },
  { id: "highlight-popup", name: "Highlight popup", x: 2240, y: 3660, w: 400, render: I => <HighlightPopup I={I} /> },
  { id: "note-card", name: "Note card", x: 0, y: 4300, w: 360, render: I => <NoteCard I={I} note={notes[1]} notes={notes} /> },
  { id: "notes-inbox", name: "Notes inbox", x: 440, y: 4300, w: 720, render: I => <NotesInbox I={I} items={highlights} /> },
  { id: "stacked-panes", name: "Stacked panes", x: 1240, y: 4300, w: 1120, render: I => <StackedPanes I={I} notes={notes} start="n1" width={1120} /> },
  { id: "notes-board", name: "Notes board", x: 2440, y: 4300, w: 760,
    render: I => <NotesBoard I={I} title="How agents work" nodes={boardNodes} edges={boardEdges} /> },
  { id: "notes-columns", name: "Notes board · columns", x: 0, y: 5000, w: 1360, render: I => <NotesColumns I={I} title="How agents work" notes={bNotes} cols={bCols} height={760} /> },
  { id: "overview-feed", name: "Overview feed", x: 1120, y: 0, w: 400,
    render: I => <OverviewFeed I={I} greeting={greeting} suggestions={suggestions} upNext={upNext} completed={completed} /> },
  { id: "feed-greeting", name: "Feed greeting", x: 1600, y: 0, w: 400, render: () => <FeedGreeting {...greeting} /> },
  { id: "suggestion-stack", name: "Suggestion stack", x: 1600, y: 160, w: 400, render: I => <SuggestionStack I={I} items={suggestions} /> },
  { id: "up-next", name: "Up next list", x: 1600, y: 660, w: 400, render: I => <UpNext I={I} title="Up next" rows={upNext} /> },
  { id: "completed-row", name: "Completed row", x: 1600, y: 940, w: 400, render: I => <CompletedRow I={I} items={completed} /> },
];

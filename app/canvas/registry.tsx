"use client";
// Canvas items. Add, rename, or remove mockups here; the canvas controller never needs to change.
import { agentCourses, code, type Mod } from "../catalog-data";
import { CourseCard, LabCard, LessonCard, ModuleCard, ProjectCard, TrackCard, type Icons } from "./cards";
import { CompletedRow, FeedGreeting, OverviewFeed, SuggestionStack, UpNext } from "../dashboard/feed";
import { completed, greeting, suggestions, upNext } from "../dashboard/feed-data";

export type Entry = { id: string; name: string; x: number; y: number; w: number; h?: number; render: (I: Icons) => React.ReactNode };

const course = agentCourses[0];
const mods = (course.m ?? []) as Mod[];
const lessons = mods.flatMap(([, ls]) => ls);
const labs = lessons.filter(l => l.startsWith("Lab:")).length;
const [modTitle, modLessons] = mods[0];
const lab = modLessons.find(l => l.startsWith("Lab:"))!.replace(/^Lab: /, "");

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
  { id: "overview-feed", name: "Overview feed", x: 1120, y: 0, w: 400,
    render: I => <OverviewFeed I={I} greeting={greeting} suggestions={suggestions} upNext={upNext} completed={completed} /> },
  { id: "feed-greeting", name: "Feed greeting", x: 1600, y: 0, w: 400, render: () => <FeedGreeting {...greeting} /> },
  { id: "suggestion-stack", name: "Suggestion stack", x: 1600, y: 160, w: 400, render: I => <SuggestionStack I={I} items={suggestions} /> },
  { id: "up-next", name: "Up next list", x: 1600, y: 660, w: 400, render: I => <UpNext I={I} title="Up next" rows={upNext} /> },
  { id: "completed-row", name: "Completed row", x: 1600, y: 940, w: 400, render: I => <CompletedRow I={I} items={completed} /> },
];

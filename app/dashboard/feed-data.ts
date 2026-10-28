// Placeholder feed content (B01, two lessons into Module 1) until an agent writes the feed.
import { agentCourses, code, type Mod } from "../catalog-data";
import type { Row, Suggestion } from "./feed";

const course = agentCourses[0];
const mods = (course.m ?? []) as Mod[];
const [modTitle, modLessons] = mods[0];
const lab = modLessons.find(l => l.startsWith("Lab:"))!.replace(/^Lab: /, "");
const next = agentCourses[1];
const nextMods = (next.m ?? []) as Mod[];
export const greeting = { title: "You're on a 12-day streak", sub: "Three things picked for today" };
export const suggestions: Suggestion[] = [
  { id: "finish-m1", kind: ["book", "flask"], title: `Finish Module 1: ${modTitle}`, desc: "You're 2 lessons in. One lesson and the lab are left, about 40 minutes.",
    why: "Picked because you're halfway through and usually study in the evening.", cta: "Start lesson 3",
    steps: [{ i: "play", k: "Lesson 3", v: modLessons[2] }, { i: "flask", k: "Lab", v: lab }, { i: "check", k: "Check-in", v: "3 quick questions" }] },
  { id: "review", kind: ["note"], title: `Review: ${modLessons[0]}`, desc: "A 5-minute refresher on what you read three days ago, so it sticks.",
    why: "Spaced review: this is the best moment to revisit it.", cta: "Start review",
    steps: [{ i: "note", k: "Recall", v: "3 key ideas from your notes" }, { i: "check", k: "Quiz", v: "4 questions" }] },
  { id: "next-course", kind: ["book"], title: `Coming up: ${next.t}`, desc: next.d,
    why: "Next in Track B once B01 is done.", cta: "Preview course",
    steps: [...nextMods.slice(0, 2).map(([t], i) => ({ i: "stack" as const, k: `Module ${i + 1}`, v: t })), { i: "layers", k: `${nextMods.length - 2} more`, v: nextMods.slice(2).map(([t]) => t).join(", ") }] },
];
export const upNext: Row[] = [
  { title: modLessons[2], i: "play", k: "Lesson", v: `${code(0)} · Module 1`, tags: ["book"] },
  { title: lab, i: "flask", k: "Lab", v: `${code(0)} · Module 1 · ~30 min`, tags: ["flask"] },
  { title: mods[1][1][0], i: "play", k: "Lesson", v: `${code(0)} · Module 2`, tags: ["book"] },
];
export const completed = [
  { title: modLessons[1], when: "Yesterday" },
  { title: modLessons[0], when: "Mon" },
  { title: `Started ${course.t}`, when: "Mon" },
];


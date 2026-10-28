// One normalized curriculum: Track > Course > Module > Lesson | Lab. Built from catalog-data so /planning and /dashboard never disagree.
import { agentCourses, businessCourses, courses as foundationCourses, type Mod } from "./catalog-data";

export type Item = { n: number; slug: string; title: string; kind: "lesson" | "lab" };
export type Module = { n: number; slug: string; code: string; title: string; items: Item[] };
export type Course = { n: number; slug: string; code: string; group?: string; title: string; desc: string; outcome?: string; icon: string; modules: Module[]; ready: boolean };
export type Track = { slug: string; letter: string; title: string; desc: string; color: string; courses: Course[] };

type Raw = { g?: string; t: string; d: string; o?: string; i: string; m?: Mod[] };

const slugify = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function course(letter: string, c: Raw, i: number): Course {
  const code = letter + String(i + 1).padStart(2, "0");
  const modules = (c.m ?? []).map(([title, ls], j): Module => ({
    n: j + 1, slug: `m${j + 1}`, code: `${code}.${j + 1}`, title,
    items: ls.map((l, k): Item => {
      const lab = l.startsWith("Lab:"), t = l.replace(/^Lab: /, "");
      return { n: k + 1, slug: `${k + 1}-${slugify(t)}`, title: t, kind: lab ? "lab" : "lesson" };
    }),
  }));
  return { n: i + 1, slug: code.toLowerCase(), code, group: c.g, title: c.t, desc: c.d, outcome: c.o, icon: c.i, modules, ready: modules.length > 0 };
}

const track = (slug: string, letter: string, title: string, desc: string, color: string, list: Raw[]): Track =>
  ({ slug, letter, title, desc, color, courses: list.map((c, i) => course(letter, c, i)) });

export const tracks: Track[] = [
  track("a", "A", "Technical Foundations", "The computing, engineering, and platform groundwork everything else is built on.", "#F2A04A", foundationCourses as Raw[]),
  track("b", "B", "Agent Engineering", "How agents actually work, from models and tools to loops, memory, safety, and production.", "#E8C928", agentCourses as Raw[]),
  track("c", "C", "Build & Run a Business with Agents", "Build, launch, and operate a real business from zero, with agents as leverage, not the business model.", "#4CBF6B", businessCourses),
];

export const getTrack = (t: string) => tracks.find(x => x.slug === t);
export const getCourse = (t: string, c: string) => getTrack(t)?.courses.find(x => x.slug === c);
export const getModule = (t: string, c: string, m: string) => getCourse(t, c)?.modules.find(x => x.slug === m);

export const counts = (c: Course) => {
  const items = c.modules.flatMap(m => m.items);
  const labs = items.filter(i => i.kind === "lab").length;
  return { modules: c.modules.length, lessons: items.length - labs, labs };
};

/** Courses grouped by their `group` label, preserving order. */
export const groups = (t: Track) => t.courses.reduce<{ g: string; courses: Course[] }[]>((acc, c) => {
  const g = c.group ?? "Courses", last = acc.at(-1);
  if (last?.g === g) last.courses.push(c); else acc.push({ g, courses: [c] });
  return acc;
}, []);

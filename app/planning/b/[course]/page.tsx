import Link from "next/link";
import { notFound } from "next/navigation";
import "../../../tree/glide.css";
import "../../../split.css";
import { icon, agentCourses, code, type Mod } from "../../../catalog-data";
import { Header } from "../../header";
import { Modules } from "./modules";

export default async function Course({ params }: { params: Promise<{ course: string }> }) {
  const { course } = await params;
  const n = agentCourses.findIndex((_, i) => code(i) === course);
  const c = agentCourses[n];
  if (!c || !c.m) notFound();
  const mods = c.m as Mod[];
  return <div className="ll-page">
    <Header title={c.t} sub={c.d} count={undefined} />
    <div className="ll-back"><Link href="/planning/b">Track B</Link><span>/</span><span>{code(n)}</span></div>
    <Modules code={code(n)} mods={mods} icon={icon(c.i)} />
  </div>;
}

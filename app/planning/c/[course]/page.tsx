import Link from "next/link";
import { notFound } from "next/navigation";
import "../../../tree/glide.css";
import "../../../split.css";
import { icon, businessCourses, codeC as code, type Mod } from "../../../catalog-data";
import { Header } from "../../header";
import { Modules } from "../../b/[course]/modules";

export default async function Course({ params }: { params: Promise<{ course: string }> }) {
  const { course } = await params;
  const n = businessCourses.findIndex((_, i) => code(i) === course);
  const c = businessCourses[n];
  if (!c || !c.m) notFound();
  const mods = c.m as Mod[];
  return <div className="ll-page">
    <Header title={c.t} sub={c.d} count={undefined} />
    <div className="ll-back"><Link href="/planning/c">Track C</Link><span>/</span><span>{code(n)}</span></div>
    {c.o && <p className="ll-output" style={{ margin: "0 0 16px", opacity: .7, fontSize: 14 }}><strong>Course output:</strong> {c.o}</p>}
    <Modules code={code(n)} mods={mods} icon={icon(c.i)} />
  </div>;
}

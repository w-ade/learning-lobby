import { promises as fs } from "fs";
import path from "path";
const FILE = path.join(process.cwd(), "plan.md");
export const dynamic = "force-dynamic";
export async function GET() {
  const text = await fs.readFile(FILE, "utf8").catch(() => "");
  const { mtimeMs } = await fs.stat(FILE).catch(() => ({ mtimeMs: 0 }));
  return Response.json({ text, mtime: mtimeMs });
}
export async function PUT(req: Request) {
  const { text } = await req.json();
  await fs.writeFile(FILE, text, "utf8");
  const { mtimeMs } = await fs.stat(FILE);
  return Response.json({ ok: true, mtime: mtimeMs });
}

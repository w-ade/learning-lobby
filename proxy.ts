import { NextResponse, type NextRequest } from "next/server";
import { authToken } from "./app/auth-token";

export async function proxy(req: NextRequest) {
  const pw = process.env.LL_PASSWORD;
  const ok = !!pw && req.cookies.get("ll_auth")?.value === await authToken(pw);
  const home = req.nextUrl.pathname === "/";
  if (home && ok) return NextResponse.redirect(new URL("/planning", req.url));
  if (!home && !ok) return NextResponse.redirect(new URL("/", req.url));
  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next|favicon.ico|.*\\.(?:png|jpg|svg|ico|webp)).*)"] };

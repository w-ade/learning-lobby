"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authToken } from "./auth-token";

export async function login(_: string | null, form: FormData): Promise<string | null> {
  const pw = String(form.get("password") ?? "");
  if (!process.env.LL_PASSWORD || pw !== process.env.LL_PASSWORD) return "Wrong password";
  (await cookies()).set("ll_auth", await authToken(pw), { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
  redirect("/dashboard");
}

export async function logout() {
  (await cookies()).delete("ll_auth");
  redirect("/");
}

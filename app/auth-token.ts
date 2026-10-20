export async function authToken(pw: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("learninglobby:" + pw));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

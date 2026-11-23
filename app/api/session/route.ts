import { createSession } from "@/lib/auth";

export async function POST(req: Request) {
  const { idToken, accepted } = (await req.json().catch(() => ({}))) as { idToken?: string; accepted?: boolean };
  if (!idToken) return Response.json({ error: "missing token" }, { status: 400 });
  try {
    await createSession(idToken, accepted === true);
    return Response.json({ ok: true });
  } catch (e) {
    if (e instanceof Error && e.message === "terms") return Response.json({ error: "terms" }, { status: 403 });
    if (e instanceof Error && e.message === "waitlist") return Response.json({ error: "waitlist" }, { status: 403 });
    // Log the real cause (bad service account, DB down, missing table) so "sign-in failed" is debuggable.
    console.error("session error:", e);
    const msg = e instanceof Error ? e.message : "unknown";
    return Response.json({ error: "session failed", detail: process.env.NODE_ENV === "production" ? undefined : msg }, { status: 500 });
  }
}

import { sql, earnedCents } from "@/lib/db";
import { userFromBearer } from "@/lib/auth";

// The extension shows these numbers in the VS Code status bar. Amounts are in cents (may be fractional).
export async function GET(req: Request) {
  const u = await userFromBearer(req);
  if (!u) return Response.json({ error: "bad key" }, { status: 401 });
  const tzParam = new URL(req.url).searchParams.get("tz") ?? "UTC";
  const tz = /^[A-Za-z_\/+\-0-9]{1,64}$/.test(tzParam) ? tzParam : "UTC";
  const s = await earnedCents(u.uid);
  let today = 0;
  try {
    const [t] = await sql`SELECT COALESCE(SUM(dev_micro),0)::float8 AS m FROM impressions
      WHERE dev_id=${u.uid} AND (ts AT TIME ZONE ${tz})::date = (now() AT TIME ZONE ${tz})::date`;
    today = t.m / 1000;
  } catch {
    // unknown time zone name: leave today at 0 rather than failing the whole call
  }
  return Response.json({ available_cents: Math.max(0, s.available), lifetime_cents: s.total, today_cents: today, impressions: s.impressions });
}

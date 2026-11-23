import { sql } from "@/lib/db";
import { userFromBearer } from "@/lib/auth";
import { clickToken } from "@/lib/clicks";

// Extension polls this. Only ads with budget left, never the caller's own.
export async function GET(req: Request) {
  const u = await userFromBearer(req);
  if (!u) return Response.json({ error: "bad key" }, { status: 401 });
  const ads = await sql`
    SELECT id, text, placement, (link_url IS NOT NULL) AS link FROM campaigns
    WHERE status='active' AND user_id<>${u.uid} AND spent_micro < budget_cents*1000
    ORDER BY cpm_cents DESC LIMIT 30`;
  const t = clickToken(u.uid);
  return Response.json({ ads: ads.map((a) => ({ ...a, t })) });
}

import { sql, DEV_SHARE } from "@/lib/db";
import { userFromBearer } from "@/lib/auth";

const DAILY_CAP = 400; // ponytail: crude fraud brake. Replace with real scoring when money is at stake.

export async function POST(req: Request) {
  const u = await userFromBearer(req);
  if (!u) return Response.json({ error: "bad key" }, { status: 401 });
  const { campaignId } = (await req.json().catch(() => ({}))) as { campaignId?: number };
  const cid = Number(campaignId);
  if (!Number.isInteger(cid)) return Response.json({ counted: false });

  // One statement, so dedupe + charge + credit are atomic. Rules: ad live with budget, not your own,
  // one billable impression per dev per ad per 30s, DAILY_CAP per dev per day.
  // One impression costs cpm_cents micro (1/1000 cent); dev keeps DEV_SHARE.
  const [r] = await sql`
    WITH ok AS (
      SELECT c.id, c.cpm_cents FROM campaigns c
      WHERE c.id=${cid} AND c.status='active' AND c.spent_micro < c.budget_cents*1000 AND c.user_id<>${u.uid}
        AND NOT EXISTS (SELECT 1 FROM impressions WHERE dev_id=${u.uid} AND campaign_id=c.id AND ts > now() - interval '30 seconds')
        AND (SELECT count(*) FROM impressions WHERE dev_id=${u.uid} AND ts > now() - interval '1 day') < ${DAILY_CAP}
    ), ins AS (
      INSERT INTO impressions(campaign_id,dev_id,dev_micro)
      SELECT id, ${u.uid}, floor(cpm_cents * ${DEV_SHARE}::numeric)::int FROM ok RETURNING 1
    ), upd AS (
      UPDATE campaigns SET spent_micro = spent_micro + ok.cpm_cents, impressions = impressions + 1
      FROM ok WHERE campaigns.id = ok.id RETURNING 1
    )
    SELECT (SELECT count(*) FROM ins)::int AS n`;
  return Response.json({ counted: r.n === 1 });
}

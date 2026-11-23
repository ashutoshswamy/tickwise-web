import { createHmac, timingSafeEqual } from "node:crypto";
import { sql } from "./db";

// A click token proves which developer a /r/<id> link was minted for, without putting the API key in a URL.
const SECRET = process.env.CLICK_SECRET ?? process.env.FIREBASE_PRIVATE_KEY ?? "dev-click-secret";
const mac = (uid: string) => createHmac("sha256", SECRET).update(uid).digest("hex").slice(0, 24);

export const clickToken = (uid: string) => `${uid}.${mac(uid)}`;

export function uidFromToken(t: string | null): string | null {
  if (!t) return null;
  const i = t.lastIndexOf(".");
  if (i < 1) return null;
  const uid = t.slice(0, i), given = Buffer.from(t.slice(i + 1)), want = Buffer.from(mac(uid));
  return given.length === want.length && timingSafeEqual(given, want) ? uid : null;
}

// Counts the click (once per developer per ad per 5 minutes, never your own ad) and returns the destination
// with UTM tags, or null when the campaign has no live link.
export async function recordClick(campaignId: number, uid: string | null): Promise<string | null> {
  const [c] = await sql`SELECT id, link_url, user_id FROM campaigns WHERE id=${campaignId} AND status='active' AND link_url IS NOT NULL`;
  if (!c) return null;
  if (uid && c.user_id !== uid) {
    await sql`
      INSERT INTO clicks(campaign_id, dev_id)
      SELECT ${campaignId}, ${uid}
      WHERE EXISTS (SELECT 1 FROM users WHERE uid=${uid})
        AND NOT EXISTS (SELECT 1 FROM clicks WHERE campaign_id=${campaignId} AND dev_id=${uid} AND ts > now() - interval '5 minutes')`;
  }
  const url = new URL(c.link_url as string);
  url.searchParams.set("utm_source", "tickwise");
  url.searchParams.set("utm_medium", "spinner");
  url.searchParams.set("utm_campaign", String(campaignId));
  return url.toString();
}

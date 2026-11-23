import { neon } from "@neondatabase/serverless";

// Neon over HTTP: no pool to manage, safe in serverless. Schema lives in db/schema.sql.
export const sql = neon(process.env.DATABASE_URL ?? "postgres://missing");

export const DEV_SHARE = 0.7;
export const MIN_PAYOUT_CENTS = 1000;
export const MAX_AD_CHARS = 48;

// 1 micro = 1/1000 cent. One impression at CPM c cents costs c micro.
export type User = { uid: string; email: string; api_key: string; email_verified?: boolean };
export type Campaign = {
  id: number; text: string; cpm_cents: number; budget_cents: number;
  spent_micro: number; impressions: number; status: string; link_url?: string | null; clicks?: number; placement?: string;
};

export async function earnedCents(uid: string) {
  const [r] = await sql`SELECT COALESCE(SUM(dev_micro),0)::float8 m, COUNT(*)::int n FROM impressions WHERE dev_id=${uid}`;
  const [p] = await sql`SELECT COALESCE(SUM(cents),0)::int c FROM payouts WHERE user_id=${uid}`;
  return { total: r.m / 1000, impressions: r.n as number, available: r.m / 1000 - p.c };
}

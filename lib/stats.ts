import { cookies } from "next/headers";
import { sql } from "./db";
import { DAYS, hourLabel } from "./time";

// Hours and days are shown in the viewer's own time zone (set by TzSet from the browser).
export async function getTz() {
  const v = (await cookies()).get("tz")?.value ?? "UTC";
  return /^[A-Za-z_\/+\-0-9]{1,64}$/.test(v) ? v : "UTC";
}

export { DAYS, hourRange } from "./time";

export async function devStats(uid: string, tz: string) {
  const [k] = await sql`
    SELECT
      COALESCE(SUM(dev_micro) FILTER (WHERE (ts AT TIME ZONE ${tz})::date = (now() AT TIME ZONE ${tz})::date),0)::float8 AS today,
      COALESCE(SUM(dev_micro) FILTER (WHERE ts > now() - interval '7 days'),0)::float8 AS w7,
      COALESCE(SUM(dev_micro) FILTER (WHERE ts <= now() - interval '7 days' AND ts > now() - interval '14 days'),0)::float8 AS prev7,
      COUNT(*) FILTER (WHERE ts > now() - interval '7 days')::int AS imp7
    FROM impressions WHERE dev_id=${uid}`;
  const daily = (await sql`
    SELECT to_char(d, 'Mon DD') AS label, COALESCE(SUM(i.dev_micro),0)::float8 / 100000 AS value
    FROM generate_series((now() AT TIME ZONE ${tz})::date - 13, (now() AT TIME ZONE ${tz})::date, '1 day') d
    LEFT JOIN impressions i ON i.dev_id=${uid} AND (i.ts AT TIME ZONE ${tz})::date = d::date
    GROUP BY d ORDER BY d`) as { label: string; value: number }[];
  const cells = (await sql`
    SELECT EXTRACT(dow FROM ts AT TIME ZONE ${tz})::int AS dow, EXTRACT(hour FROM ts AT TIME ZONE ${tz})::int AS hr, COUNT(*)::int AS n
    FROM impressions WHERE dev_id=${uid} AND ts > now() - interval '30 days' GROUP BY 1,2`) as { dow: number; hr: number; n: number }[];
  const ads = (await sql`
    SELECT c.text, COUNT(*)::int AS n, SUM(i.dev_micro)::float8 AS micro, MAX(i.ts) AS last
    FROM impressions i JOIN campaigns c ON c.id=i.campaign_id
    WHERE i.dev_id=${uid} AND i.ts > now() - interval '30 days' GROUP BY c.id, c.text ORDER BY n DESC LIMIT 20`) as { text: string; n: number; micro: number; last: Date }[];
  const recent = (await sql`
    SELECT i.id, c.text, i.dev_micro AS micro, i.ts
    FROM impressions i JOIN campaigns c ON c.id=i.campaign_id WHERE i.dev_id=${uid} ORDER BY i.ts DESC LIMIT 12`) as { id: string; text: string; micro: number; ts: Date }[];
  return { k, daily, ...shape(cells), ads, recent };
}

export async function advStats(uid: string, tz: string, campaign?: number) {
  const cid = campaign ?? null;
  const [k] = await sql`
    SELECT
      COUNT(*)::int AS imp,
      COUNT(DISTINCT i.dev_id)::int AS devs,
      COALESCE(SUM(c.cpm_cents),0)::float8 AS spend_micro,
      COUNT(*) FILTER (WHERE i.ts > now() - interval '7 days')::int AS imp7,
      COUNT(*) FILTER (WHERE i.ts <= now() - interval '7 days' AND i.ts > now() - interval '14 days')::int AS prev7,
      COALESCE(SUM(c.cpm_cents) FILTER (WHERE i.ts > now() - interval '7 days'),0)::float8 AS spend7_micro
    FROM impressions i JOIN campaigns c ON c.id=i.campaign_id
    WHERE c.user_id=${uid} AND (${cid}::int IS NULL OR c.id=${cid}::int)`;
  const daily = (await sql`
    SELECT to_char(d, 'Mon DD') AS label, COUNT(i.id)::float8 AS value
    FROM generate_series((now() AT TIME ZONE ${tz})::date - 13, (now() AT TIME ZONE ${tz})::date, '1 day') d
    LEFT JOIN (SELECT i.id, i.ts FROM impressions i JOIN campaigns c ON c.id=i.campaign_id
               WHERE c.user_id=${uid} AND (${cid}::int IS NULL OR c.id=${cid}::int)) i
      ON (i.ts AT TIME ZONE ${tz})::date = d::date
    GROUP BY d ORDER BY d`) as { label: string; value: number }[];
  const cells = (await sql`
    SELECT EXTRACT(dow FROM i.ts AT TIME ZONE ${tz})::int AS dow, EXTRACT(hour FROM i.ts AT TIME ZONE ${tz})::int AS hr, COUNT(*)::int AS n
    FROM impressions i JOIN campaigns c ON c.id=i.campaign_id
    WHERE c.user_id=${uid} AND (${cid}::int IS NULL OR c.id=${cid}::int) AND i.ts > now() - interval '30 days' GROUP BY 1,2`) as { dow: number; hr: number; n: number }[];
  const [ck] = await sql`
    SELECT COUNT(*)::int AS clicks, COUNT(DISTINCT k.dev_id)::int AS clickers,
           COUNT(*) FILTER (WHERE k.ts > now() - interval '7 days')::int AS clicks7
    FROM clicks k JOIN campaigns c ON c.id=k.campaign_id
    WHERE c.user_id=${uid} AND (${cid}::int IS NULL OR c.id=${cid}::int)`;
  const clickDaily = (await sql`
    SELECT to_char(d, 'Mon DD') AS label, COUNT(k.id)::float8 AS value
    FROM generate_series((now() AT TIME ZONE ${tz})::date - 13, (now() AT TIME ZONE ${tz})::date, '1 day') d
    LEFT JOIN (SELECT k.id, k.ts FROM clicks k JOIN campaigns c ON c.id=k.campaign_id
               WHERE c.user_id=${uid} AND (${cid}::int IS NULL OR c.id=${cid}::int)) k
      ON (k.ts AT TIME ZONE ${tz})::date = d::date
    GROUP BY d ORDER BY d`) as { label: string; value: number }[];
  return { k, ck, clickDaily, daily, ...shape(cells) };
}

// Turn (weekday, hour, count) cells into a 24-bar chart, a 7x24 heatmap and the busiest hour.
function shape(cells: { dow: number; hr: number; n: number }[]) {
  const hours = Array.from({ length: 24 }, (_, h) => ({ label: hourLabel(h), value: 0 }));
  const heat = new Array(24 * 7).fill(0);
  const days = new Array(7).fill(0);
  for (const c of cells) { hours[c.hr].value += c.n; heat[c.hr * 7 + c.dow] = c.n; days[c.dow] += c.n; }
  const total = hours.reduce((a, b) => a + b.value, 0);
  const top = hours.reduce((m, h, i) => (h.value > hours[m].value ? i : m), 0);
  const topDay = days.reduce((m, v, i) => (v > days[m] ? i : m), 0);
  return { hours, heat, total, topHour: total ? top : null, topDay: total ? DAYS[topDay] : null };
}

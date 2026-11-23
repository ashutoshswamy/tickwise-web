import { AreaChart } from "@ashutoshswamy/smoui";
import { sql } from "@/lib/db";

// Units: spend and dev credits are micro-cents (1/1000 cent). Platform revenue = spend - developer credits (the 30%).
const dollars = (micro: number) => micro / 100000;
const usd = (c: number) => `$${(c / 100).toFixed(2)}`;
const money = (d: number) => `$${d.toFixed(2)}`;

export default async function Overview() {
  const [t] = await sql`
    SELECT COALESCE(SUM(c.cpm_cents),0)::float8 AS spend, COALESCE(SUM(i.dev_micro),0)::float8 AS dev, COUNT(*)::int AS n,
           COALESCE(SUM(c.cpm_cents) FILTER (WHERE i.ts > now() - interval '7 days'),0)::float8 AS spend7,
           COALESCE(SUM(i.dev_micro) FILTER (WHERE i.ts > now() - interval '7 days'),0)::float8 AS dev7
    FROM impressions i JOIN campaigns c ON c.id = i.campaign_id`;
  const [m] = await sql`
    SELECT COALESCE(SUM(budget_cents) FILTER (WHERE status IN ('active','paused')),0)::float8 AS collected,
           COALESCE(SUM(spent_micro) FILTER (WHERE status IN ('active','paused')),0)::float8 AS spent_paid
    FROM campaigns`;
  const [p] = await sql`
    SELECT COALESCE(SUM(cents) FILTER (WHERE status='requested'),0)::int AS requested,
           COALESCE(SUM(cents) FILTER (WHERE status='paid'),0)::int AS paid FROM payouts`;
  const daily = (await sql`
    SELECT to_char(d, 'Mon DD') AS label, COALESCE(SUM(c.cpm_cents - i.dev_micro),0)::float8 / 100000 AS value
    FROM generate_series(current_date - 13, current_date, '1 day') d
    LEFT JOIN impressions i ON i.ts >= d AND i.ts < d + interval '1 day'
    LEFT JOIN campaigns c ON c.id = i.campaign_id
    GROUP BY d ORDER BY d`) as { label: string; value: number }[];
  const revenue = dollars(t.spend - t.dev);
  const revenue7 = dollars(t.spend7 - t.dev7);
  const unspent = Math.max(0, m.collected / 100 - dollars(m.spent_paid));

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="display text-4xl md:text-5xl">Revenue</h1>
        <p className="mt-2 text-muted">Your 30% of every impression, before payment-processor fees. Updates live.</p>
      </div>

      {/* The numbers that matter, struck on a striker band. */}
      <section className="striker !h-auto rounded-2xl text-ground">
        <dl className="grid gap-8 p-6 sm:grid-cols-2 md:p-10 lg:grid-cols-4">
          <div><dt className="text-sm opacity-80">Platform revenue</dt><dd className="display mt-1 text-5xl text-sun">{money(revenue)}</dd></div>
          <div><dt className="text-sm opacity-80">Revenue, 7 days</dt><dd className="display mt-1 text-5xl text-sun">{money(revenue7)}</dd></div>
          <div><dt className="text-sm opacity-80">Advertiser spend</dt><dd className="display mt-1 text-5xl">{money(dollars(t.spend))}</dd></div>
          <div><dt className="text-sm opacity-80">Owed to developers</dt><dd className="display mt-1 text-5xl">{money(dollars(t.dev))}</dd></div>
        </dl>
        <p className="num px-6 pb-6 text-sm opacity-75 md:px-10">{t.n.toLocaleString()} impressions. 70% developers, 30% you; the 30% is spend minus developer credits.</p>
      </section>

      <div className="grid items-start gap-8 lg:grid-cols-[1.4fr_1fr]">
        <section className="panel p-6 md:p-8">
          <h2 className="display text-2xl">Revenue by day</h2>
          <div className="mt-4"><AreaChart data={daily} height={220} prefix="$" label="Platform revenue per day for the last 14 days" /></div>
        </section>

        <section className="panel p-6 md:p-8">
          <h2 className="display text-2xl">Cash position</h2>
          <dl className="num mt-5 grid gap-3 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Collected from advertisers</dt><dd className="font-semibold">{money(m.collected / 100)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Unspent advertiser balance</dt><dd className="font-semibold">{money(unspent)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Payout requests waiting</dt><dd className="font-semibold">{usd(p.requested)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Paid to developers</dt><dd className="font-semibold">{usd(p.paid)}</dd></div>
          </dl>
          <p className="mt-4 text-xs text-muted">Collected counts the budgets of paid campaigns. Test-mode campaigns are included until Dodo keys are set.</p>
        </section>
      </div>
    </div>
  );
}

import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { AreaChart, Badge, BarChart, EmptyState, KpiGrid, ProgressBar } from "@ashutoshswamy/smoui";
import { sql, type Campaign } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { advStats, getTz } from "@/lib/stats";
import { DAYS, hourRange } from "@/lib/time";
import { payCampaign, toggleCampaign } from "../actions";
import DeleteButton from "./delete-button";
import { WeekHeat } from "@/components/heat";

const usd = (c: number) => `$${(c / 100).toFixed(2)}`;
const errs: Record<string, string> = {
  cancel: "Checkout was cancelled. Your campaign is saved as unpaid.",
};
const placeLabel: Record<string, string> = { terminal: "Terminal", extension: "VS Code extension", both: "Terminal and VS Code extension" };
const tone = { active: "positive", paused: "warning", unpaid: "neutral" } as const;

export default async function Advertise({ searchParams }: { searchParams: Promise<{ e?: string; paid?: string; status?: string }> }) {
  const u = await requireUser();
  const { e, paid, status } = await searchParams;
  const tz = await getTz();
  const st = await advStats(u.uid, tz);
  const rows = (await sql`SELECT c.id,c.text,c.cpm_cents,c.budget_cents,c.spent_micro::float8 spent_micro,c.impressions,c.status,c.link_url,c.placement,(SELECT count(*) FROM clicks k WHERE k.campaign_id=c.id)::int AS clicks FROM campaigns c WHERE c.user_id=${u.uid} ORDER BY c.created DESC`) as Campaign[];
  const live = rows.filter((c) => c.status === "active").length;
  const delta = st.k.prev7 > 0 ? Math.round(((st.k.imp7 - st.k.prev7) / st.k.prev7) * 100) : undefined;

  return (
    <div className="grid gap-8">
        <div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="display text-4xl md:text-5xl">Campaigns</h1>
              <p className="mt-2 text-muted">Impressions, clicks and the hours your ads are seen. Updates live.</p>
            </div>
            <Link href="/dashboard/advertise/new" className="btn">New campaign</Link>
          </div>
          {paid && status === "failed" && <p role="alert" className="mt-4 rounded-xl bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">Payment failed, nothing was charged. Open your unpaid campaign below and try again.</p>}
          {paid && status !== "failed" && <p role="status" className="mt-4 rounded-xl bg-sun px-4 py-3 text-sm font-semibold text-ink">{paid === "test" ? "Campaign is live (test mode, no charge)." : "Payment received. Your campaign is live."}</p>}
          {e && <p role="alert" className="mt-4 rounded-xl bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">{errs[e] ?? "Something went wrong."}</p>}
        </div>

        <section className="panel p-6 md:p-8">
          <KpiGrid
            columns={3}
            items={[
              { label: "Total spend", value: st.k.spend_micro / 100000, prefix: "$", decimals: 2 },
              { label: "Impressions, 7 days", value: st.k.imp7, delta, data: st.daily.slice(-7).map((d) => d.value) },
              { label: "Developers reached", value: st.k.devs },
              { label: "Live campaigns", value: live },
              { label: "Clicks", value: st.ck.clicks, data: st.clickDaily.slice(-7).map((d) => d.value) },
              { label: "Click rate", value: st.k.imp ? (st.ck.clicks / st.k.imp) * 100 : 0, suffix: "%", decimals: 2 },
            ]}
          />
          <p className="num mt-4 text-sm text-muted">
            {usd(st.k.spend7_micro / 1000)} spent in the last 7 days, {st.k.imp.toLocaleString()} impressions in total. Developers are only counted, never identified.
          </p>
        </section>

        <section className="panel p-6 md:p-8">
          <h2 className="display text-2xl">Your campaigns</h2>
          {rows.length === 0 ? (
            <div className="mt-4"><EmptyState title="Nothing running" description="Create a campaign and it shows up here." /></div>
          ) : (
            <ul className="mt-5 grid gap-6">
              {rows.map((c) => {
                const spent = c.spent_micro / 1000;
                return (
                  <li key={c.id} className="grid gap-3 rounded-xl bg-ink/[0.04] p-4 md:p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <p className="truncate font-semibold">{c.text}</p>
                        <Badge size="sm" tone={tone[c.status as keyof typeof tone] ?? "neutral"}>{c.status}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/dashboard/advertise/${c.id}`} className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold hover:bg-ink/8">
                          Details <ArrowRightIcon className="size-3.5" strokeWidth={2} />
                        </Link>
                        {(c.status === "active" || c.status === "paused") && (
                          <form action={toggleCampaign}>
                            <input type="hidden" name="id" value={c.id} />
                            <button className="btn btn-ghost h-9 !px-4">{c.status === "active" ? "Pause" : "Resume"}</button>
                          </form>
                        )}
                      </div>
                    </div>
                    {c.status === "unpaid" && (
                      <details className="rounded-xl bg-panel p-4">
                        <summary className="cursor-pointer text-sm font-semibold">Complete payment</summary>
                        <p className="mt-3 text-sm font-semibold">Check your campaign before paying. You can't edit it after.</p>
                        <dl className="num mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                          <dt className="text-muted">Ad text</dt><dd className="break-words">{c.text}</dd>
                          <dt className="text-muted">Link</dt><dd className="break-all">{c.link_url ?? "None"}</dd>
                          <dt className="text-muted">Shown in</dt><dd>{placeLabel[c.placement ?? "both"]}</dd>
                          <dt className="text-muted">CPM</dt><dd>{usd(c.cpm_cents)}</dd>
                          <dt className="text-muted">Budget</dt><dd>{usd(c.budget_cents)} (about {Math.floor((c.budget_cents / c.cpm_cents) * 1000).toLocaleString()} impressions)</dd>
                        </dl>
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          <form action={payCampaign}>
                            <input type="hidden" name="id" value={c.id} />
                            <button className="btn h-9 !px-4">Looks right, pay {usd(c.budget_cents)}</button>
                          </form>
                          <DeleteButton id={c.id} text={c.text} />
                        </div>
                      </details>
                    )}
                    <ProgressBar value={Math.min(100, (spent / c.budget_cents) * 100)} label={`Budget spent on ${c.text}`} />
                    <p className="num text-sm text-muted">
                      {c.impressions.toLocaleString()} impressions, {(c.clicks ?? 0).toLocaleString()} clicks{c.impressions ? ` (${(((c.clicks ?? 0) / c.impressions) * 100).toFixed(2)}%)` : ""}. {usd(spent)} of {usd(c.budget_cents)} at {usd(c.cpm_cents)} CPM{c.link_url ? `. ${new URL(c.link_url).hostname}` : ""}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="panel p-6 md:p-8">
          <h2 className="display text-2xl">Impressions by day</h2>
          <p className="mt-1 text-sm text-muted">Last 14 days, in {tz.replace("_", " ")} time.</p>
          <div className="mt-4"><AreaChart data={st.daily} height={200} label="Impressions per day for the last 14 days" /></div>
        </section>

        <section className="panel p-6 md:p-8">
          <h2 className="display text-2xl">When developers see your ads</h2>
          {st.topHour === null ? (
            <div className="mt-4"><EmptyState title="No impressions yet" description="Delivery times show up here once developers start seeing your ads." /></div>
          ) : (
            <>
              <p className="mt-1 text-sm text-muted">
                Peak hour <span className="font-semibold text-ink">{hourRange(st.topHour)}</span>, peak day <span className="font-semibold text-ink">{st.topDay}</span>. Last 30 days.
              </p>
              <div className="mt-4"><BarChart data={st.hours} height={180} label="Impressions by hour of day" highlight={st.topHour} /></div>
              <div className="mt-6 overflow-x-auto">
                <p className="mb-3 text-sm text-muted">Weekday by hour. Columns run 12 AM to 11 PM, rows are {DAYS.join(", ")}.</p>
                <WeekHeat data={st.heat} />
              </div>
            </>
          )}
        </section>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { AreaChart, Badge, BarChart, EmptyState, ProgressBar } from "@ashutoshswamy/smoui";
import { sql, type Campaign } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { advStats, getTz } from "@/lib/stats";
import { hourRange } from "@/lib/time";

const usd = (c: number) => `$${(c / 100).toFixed(2)}`;

export default async function CampaignDetail({ params }: { params: Promise<{ id: string }> }) {
  const u = await requireUser();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [c] = (await sql`SELECT id,text,cpm_cents,budget_cents,spent_micro::float8 spent_micro,impressions,status,link_url FROM campaigns WHERE id=${id} AND user_id=${u.uid}`) as Campaign[];
  if (!c) notFound();
  const tz = await getTz();
  const st = await advStats(u.uid, tz, id);
  const spent = c.spent_micro / 1000;
  const rate = c.impressions ? ((st.ck.clicks / c.impressions) * 100).toFixed(2) : "0.00";

  return (
    <div>
      <Link href="/dashboard/advertise" className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold text-muted hover:bg-ink/8 hover:text-ink">
        <ArrowLeftIcon className="size-4" strokeWidth={2} /> All campaigns
      </Link>

      <div className="mt-4 grid items-start gap-6 lg:grid-cols-[24rem_1fr] lg:gap-8">
        {/* The campaign as its cover, with the headline numbers underneath. */}
        <aside className="grid gap-6 lg:sticky lg:top-24">
          <div className="cover" style={{ ["--c" as string]: "var(--sun)", ["--fg" as string]: "var(--ink)" }}>
            <div className="cover-flap" />
            <div className="p-6">
              <Badge tone={c.status === "active" ? "positive" : c.status === "paused" ? "warning" : "neutral"}>{c.status}</Badge>
              <h1 className="display mt-4 text-[2rem]">{c.text}</h1>
              <dl className="num mt-6 grid grid-cols-3 gap-3 text-sm">
                <div><dt className="font-sans text-xs opacity-75">Impressions</dt><dd className="mt-1 text-lg font-semibold">{c.impressions.toLocaleString()}</dd></div>
                <div><dt className="font-sans text-xs opacity-75">Clicks</dt><dd className="mt-1 text-lg font-semibold">{st.ck.clicks.toLocaleString()}</dd></div>
                <div><dt className="font-sans text-xs opacity-75">Click rate</dt><dd className="mt-1 text-lg font-semibold">{rate}%</dd></div>
              </dl>
            </div>
            <div className="striker" />
          </div>

          <div className="panel p-6">
            <h2 className="display text-2xl">Budget</h2>
            <div className="mt-4"><ProgressBar value={Math.min(100, (spent / c.budget_cents) * 100)} label="Budget spent" showValue /></div>
            <dl className="num mt-5 grid gap-2 text-sm">
              <div className="flex justify-between"><dt className="text-muted">Spent</dt><dd className="font-semibold">{usd(spent)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Left</dt><dd className="font-semibold">{usd(Math.max(0, c.budget_cents - spent))}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">CPM</dt><dd className="font-semibold">{usd(c.cpm_cents)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Developers reached</dt><dd className="font-semibold">{st.k.devs}</dd></div>
            </dl>
            <p className="mt-4 text-sm text-muted">
              {c.link_url ? <>Link: <span className="break-all font-medium text-ink">{c.link_url}</span>. {st.ck.clickers} developers clicked.</> : "No link on this campaign, so it cannot be clicked."}
            </p>
          </div>
        </aside>

        <div className="grid gap-8">
          <section className="panel p-6 md:p-8">
            <h2 className="display text-2xl">Impressions by day</h2>
            <div className="mt-4"><AreaChart data={st.daily} height={200} label="Impressions per day for the last 14 days" /></div>
          </section>
          <section className="panel p-6 md:p-8">
            <h2 className="display text-2xl">Clicks by day</h2>
            <div className="mt-4"><AreaChart data={st.clickDaily} height={160} label="Clicks per day for the last 14 days" /></div>
          </section>
          <section className="panel p-6 md:p-8">
            <h2 className="display text-2xl">When this ad is seen</h2>
            {st.topHour === null ? (
              <div className="mt-4"><EmptyState title="No impressions yet" description="Delivery times show up here once developers start seeing this ad." /></div>
            ) : (
              <>
                <p className="mt-1 text-sm text-muted">
                  Peak hour <span className="font-semibold text-ink">{hourRange(st.topHour)}</span>, peak day <span className="font-semibold text-ink">{st.topDay}</span>. Last 30 days.
                </p>
                <div className="mt-4"><BarChart data={st.hours} height={180} label="Impressions by hour of day" highlight={st.topHour} /></div>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

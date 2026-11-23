import { Badge, AreaChart, BarChart, DataTable, EmptyState } from "@ashutoshswamy/smoui";
import { sql, earnedCents, MIN_PAYOUT_CENTS } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { devStats, getTz } from "@/lib/stats";
import { DAYS, hourRange } from "@/lib/time";
import { FloatingInput } from "@ashutoshswamy/smoui";
import { requestPayout, savePayoutDetails } from "../actions";
import { unseal, vaultOn } from "@/lib/vault";
import { WeekHeat } from "@/components/heat";

const usd = (c: number) => `$${(c / 100).toFixed(2)}`;
const micro = (m: number) => `$${(m / 100000).toFixed(m > 0 && m < 1000 ? 4 : 2)}`;
const ago = (d: Date) => {
  const s = Math.max(1, Math.round((Date.now() - new Date(d).getTime()) / 1000));
  return s < 90 ? `${s}s ago` : s < 5400 ? `${Math.round(s / 60)}m ago` : s < 129600 ? `${Math.round(s / 3600)}h ago` : `${Math.round(s / 86400)}d ago`;
};

export default async function Earn({ searchParams }: { searchParams: Promise<{ e?: string; paid?: string; saved?: string }> }) {
  const u = await requireUser();
  const { e, paid, saved } = await searchParams;
  const tz = await getTz();
  const [s, st] = await Promise.all([earnedCents(u.uid), devStats(u.uid, tz)]);
  const payouts = (await sql`SELECT cents,status,ts FROM payouts WHERE user_id=${u.uid} ORDER BY ts DESC LIMIT 10`) as { cents: number; status: string; ts: Date }[];
  const [row] = (await sql`SELECT payout_details FROM users WHERE uid=${u.uid}`) as { payout_details: string | null }[];
  const bank = unseal(row?.payout_details);
  const canPay = s.available >= MIN_PAYOUT_CENTS;
  const avail = Math.max(0, s.available);
  const w7 = st.k.w7 / 100000, prev7 = st.k.prev7 / 100000;
  const delta = prev7 > 0 ? Math.round(((w7 - prev7) / prev7) * 100) : null;

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[22rem_1fr] lg:gap-8">
      {/* Left rail: the balance as a matchbook cover, then the extension credentials. */}
      <aside className="grid gap-6 lg:sticky lg:top-24">
        <div className="cover" style={{ ["--c" as string]: "var(--field)", ["--fg" as string]: "var(--on-field)" }}>
          <div className="cover-flap" />
          <div className="p-6">
            <p className="text-sm font-semibold opacity-85">Available to cash out</p>
            <p className="display mt-2 text-[4.25rem] leading-none" aria-live="polite">{usd(avail)}</p>
            <form action={requestPayout} className="mt-6">
              <button className={canPay ? "btn btn-sun w-full" : "btn btn-ghost w-full"} disabled={!canPay}>Request payout</button>
            </form>
            <p className="mt-3 text-sm opacity-85">Payouts start at {usd(MIN_PAYOUT_CENTS)} and arrive within 5 business days.</p>
            {e === "min" && <p role="alert" className="mt-3 rounded-xl bg-white/20 px-3 py-2 text-sm font-semibold">You need at least {usd(MIN_PAYOUT_CENTS)} available.</p>}
            {e === "nodetails" && <p role="alert" className="mt-3 rounded-xl bg-white/20 px-3 py-2 text-sm font-semibold">Add your bank details below first.</p>}
            {paid && <p role="status" className="mt-3 rounded-xl bg-white/20 px-3 py-2 text-sm font-semibold">Payout requested.</p>}
            <dl className="num mt-6 grid grid-cols-3 gap-3 text-sm">
              <div><dt className="font-sans text-xs opacity-75">Today</dt><dd className="mt-1 font-semibold">{micro(st.k.today)}</dd></div>
              <div><dt className="font-sans text-xs opacity-75">7 days</dt><dd className="mt-1 font-semibold">${w7.toFixed(2)}</dd></div>
              <div><dt className="font-sans text-xs opacity-75">Lifetime</dt><dd className="mt-1 font-semibold">{usd(s.total)}</dd></div>
            </dl>
            {delta !== null && <p className="mt-4 text-sm font-semibold">{delta >= 0 ? "Up" : "Down"} {Math.abs(delta)}% on the 7 days before.</p>}
          </div>
          <div className="striker" />
        </div>

        <div className="panel p-6">
          <h2 className="display text-2xl">Payout details</h2>
          <p className="mt-1 text-sm text-muted">
            {bank ? <>Saved: <span className="num text-ink">{bank.bank}, ending {bank.account.slice(-4)}</span>. Fill the form to replace it.</> : "Where we send your money. Stored encrypted, only the platform owner can read it."}
          </p>
          {e === "details" && <p role="alert" className="mt-3 rounded-xl bg-danger/10 px-3 py-2 text-sm font-semibold text-danger">Check the details. Names need 2+ characters, account and code letters, numbers, spaces or dashes only.</p>}
          {e === "vault" && <p role="alert" className="mt-3 rounded-xl bg-danger/10 px-3 py-2 text-sm font-semibold text-danger">Saving bank details is not set up on this server yet.</p>}
          {saved && <p role="status" className="mt-3 rounded-xl bg-sun px-3 py-2 text-sm font-semibold text-ink">Payout details saved.</p>}
          {vaultOn() && (
            <form action={savePayoutDetails} className="mt-5 grid gap-4">
              <FloatingInput label="Country" name="country" required maxLength={60} autoComplete="country-name" />
              <FloatingInput label="Account holder name" name="holder" required maxLength={100} autoComplete="off" />
              <FloatingInput label="Bank name" name="bank" required maxLength={100} autoComplete="off" />
              <FloatingInput label="Account number or IBAN" name="account" required maxLength={40} autoComplete="off" />
              <FloatingInput label="Bank code" name="code" required maxLength={20} autoComplete="off" hint="IFSC for India, SWIFT/BIC, routing number or sort code elsewhere." />
              <button className="btn w-full">Save payout details</button>
            </form>
          )}
        </div>
      </aside>

      <div className="grid gap-8">
        <div>
          <h1 className="display text-4xl md:text-5xl">Earnings</h1>
          <p className="mt-2 text-muted">
            {st.k.imp7.toLocaleString()} impressions in the last 7 days, {s.impressions.toLocaleString()} in total. Updates live.
          </p>
        </div>

        <section className="panel p-6 md:p-8">
          <h2 className="display text-2xl">By day</h2>
          <p className="mt-1 text-sm text-muted">Last 14 days, in {tz.replace("_", " ")} time.</p>
          <div className="mt-4"><AreaChart data={st.daily} height={200} prefix="$" label="Daily earnings in dollars for the last 14 days" /></div>
        </section>

        <section className="panel p-6 md:p-8">
          <h2 className="display text-2xl">When you are most active</h2>
          {st.topHour === null ? (
            <div className="mt-4"><EmptyState title="No activity yet" description="Once the extension reports impressions, your busiest hours show up here." /></div>
          ) : (
            <>
              <p className="mt-1 text-sm text-muted">
                Busiest hour <span className="font-semibold text-ink">{hourRange(st.topHour)}</span>, busiest day <span className="font-semibold text-ink">{st.topDay}</span>. Last 30 days.
              </p>
              <div className="mt-4"><BarChart data={st.hours} height={180} label="Impressions by hour of day" highlight={st.topHour} /></div>
              <div className="mt-6 overflow-x-auto">
                <p className="mb-3 text-sm text-muted">Weekday by hour. Columns run 12 AM to 11 PM, rows are {DAYS.join(", ")}.</p>
                <WeekHeat data={st.heat} />
              </div>
            </>
          )}
        </section>

        <section className="panel p-6 md:p-8">
          <h2 className="display text-2xl">Ads you have seen</h2>
          <p className="mt-1 text-sm text-muted">Last 30 days, most shown first.</p>
          <div className="mt-4">
            {st.ads.length === 0 ? (
              <EmptyState title="No ads shown yet" description="Ads appear here after your first impression." />
            ) : (
              <DataTable
                caption="Ads shown to you in the last 30 days"
                density="compact"
                columns={[
                  { key: "text", label: "Ad", width: "2.4fr" },
                  { key: "n", label: "Shown", type: "number", sortable: true, width: "90px" },
                  { key: "earned", label: "You earned", type: "number", sortable: true, width: "120px" },
                  { key: "last", label: "Last seen", width: "110px" },
                ]}
                rows={st.ads.map((a, i) => ({ id: String(i), text: a.text, n: a.n, earned: micro(a.micro), last: ago(a.last) }))}
              />
            )}
          </div>
        </section>

        <div className="grid gap-8 md:grid-cols-2">
          <section className="panel p-6 md:p-8">
            <h2 className="display text-2xl">Recent impressions</h2>
            {st.recent.length === 0 ? (
              <p className="mt-3 text-sm text-muted">Nothing yet.</p>
            ) : (
              <ul className="mt-4 grid gap-3 text-sm">
                {st.recent.map((r) => (
                  <li key={r.id} className="flex items-center justify-between gap-3">
                    <span className="min-w-0 truncate">{r.text}</span>
                    <span className="num shrink-0 text-muted">{ago(r.ts)} <span className="ml-1 font-semibold text-ink">+{micro(r.micro)}</span></span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="panel p-6 md:p-8">
            <h2 className="display text-2xl">Payouts</h2>
            {payouts.length === 0 ? (
              <p className="mt-3 text-sm text-muted">No payouts yet. Requests appear here once you pass the minimum.</p>
            ) : (
              <ul className="mt-4 grid gap-3 text-sm">
                {payouts.map((p) => (
                  <li key={String(p.ts)} className="flex items-center justify-between">
                    <span className="num font-semibold">{usd(p.cents)}</span>
                    <span className="flex items-center gap-3 text-muted">
                      {new Date(p.ts).toLocaleDateString()}
                      <Badge size="sm" tone={p.status === "paid" ? "positive" : "neutral"}>{p.status}</Badge>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

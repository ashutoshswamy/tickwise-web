import { EmptyState } from "@ashutoshswamy/smoui";
import { sql } from "@/lib/db";
import { unseal } from "@/lib/vault";
import { markPayoutPaid } from "../../dashboard/actions";

const usd = (c: number) => `$${(c / 100).toFixed(2)}`;
type Row = { id: number; cents: number; ts: Date; email: string; payout_details: string | null };

export default async function Payouts() {
  const queue = (await sql`
    SELECT p.id, p.cents, p.ts, us.email, us.payout_details FROM payouts p JOIN users us ON us.uid = p.user_id
    WHERE p.status='requested' ORDER BY p.ts`) as Row[];
  const done = (await sql`
    SELECT p.id, p.cents, p.ts, us.email, us.payout_details FROM payouts p JOIN users us ON us.uid = p.user_id
    WHERE p.status='paid' ORDER BY p.ts DESC LIMIT 25`) as Row[];

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="display text-4xl md:text-5xl">Payouts</h1>
        <p className="mt-2 text-muted">Send the money by hand, then mark it paid. Bank details are decrypted here and nowhere else.</p>
      </div>

      <section className="panel p-6 md:p-8">
        <h2 className="display text-2xl">To send</h2>
        {queue.length === 0 ? (
          <div className="mt-4"><EmptyState title="Nothing waiting" description="Developer payout requests appear here." /></div>
        ) : (
          <ul className="mt-5 grid gap-3 text-sm">
            {queue.map((q) => {
              const b = unseal(q.payout_details);
              return (
                <li key={q.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-ink/[0.04] px-4 py-3">
                  <span className="min-w-0 font-medium">
                    <span className="block truncate">{q.email}</span>
                    {b ? <span className="num block break-words text-xs font-normal text-muted">{b.country} · {b.holder} · {b.bank} · {b.account} · {b.code}</span> : <span className="block text-xs font-normal text-danger">No bank details saved</span>}
                  </span>
                  <span className="flex items-center gap-4">
                    <span className="num text-base font-semibold">{usd(q.cents)}</span>
                    <span className="num text-muted">{new Date(q.ts).toLocaleDateString()}</span>
                    <form action={markPayoutPaid}>
                      <input type="hidden" name="id" value={q.id} />
                      <button className="btn h-9 !px-4">Mark paid</button>
                    </form>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="panel p-6 md:p-8">
        <h2 className="display text-2xl">Recently paid</h2>
        {done.length === 0 ? (
          <p className="mt-3 text-sm text-muted">Nothing paid yet.</p>
        ) : (
          <ul className="num mt-5 grid gap-2 text-sm">
            {done.map((q) => (
              <li key={q.id} className="flex justify-between gap-3"><span className="truncate">{q.email}</span><span className="font-semibold">{usd(q.cents)}</span><span className="text-muted">{new Date(q.ts).toLocaleDateString()}</span></li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

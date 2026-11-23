import { Badge, EmptyState } from "@ashutoshswamy/smoui";
import { sql } from "@/lib/db";
import { adminSetCampaign } from "../../dashboard/actions";

const usd = (c: number) => `$${(c / 100).toFixed(2)}`;
const tone = { active: "positive", paused: "warning", unpaid: "neutral" } as const;
type Row = { id: number; text: string; link_url: string | null; email: string; status: string; impressions: number; budget_cents: number; spend: number };

export default async function Campaigns() {
  const rows = (await sql`
    SELECT c.id, c.text, c.link_url, us.email, c.status, c.impressions, c.budget_cents, c.spent_micro::float8 AS spend
    FROM campaigns c JOIN users us ON us.uid = c.user_id ORDER BY c.created DESC LIMIT 100`) as Row[];
  return (
    <div className="grid gap-8">
      <div>
        <h1 className="display text-4xl md:text-5xl">Campaigns</h1>
        <p className="mt-2 text-muted">Every ad on the platform. Pause one that breaks the rules, resume it when it is fixed.</p>
      </div>
      <section className="panel p-6 md:p-8">
        {rows.length === 0 ? (
          <EmptyState title="No campaigns yet" description="Campaigns show up here as advertisers create them." />
        ) : (
          <ul className="grid gap-3 text-sm">
            {rows.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-ink/[0.04] px-4 py-3">
                <span className="min-w-0">
                  <span className="flex items-center gap-2"><span className="truncate font-semibold">{c.text}</span><Badge size="sm" tone={tone[c.status as keyof typeof tone] ?? "neutral"}>{c.status}</Badge></span>
                  <span className="num block break-all text-xs text-muted">{c.email}{c.link_url ? ` · ${c.link_url}` : ""}</span>
                  <span className="num block text-xs text-muted">{c.impressions.toLocaleString()} impressions · {usd(c.spend / 1000)} of {usd(c.budget_cents)}</span>
                </span>
                {(c.status === "active" || c.status === "paused") && (
                  <form action={adminSetCampaign}>
                    <input type="hidden" name="id" value={c.id} />
                    <button className="btn btn-ghost h-9 !px-4">{c.status === "active" ? "Pause" : "Resume"}</button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

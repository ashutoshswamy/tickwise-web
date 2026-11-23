import { DataTable, EmptyState } from "@ashutoshswamy/smoui";
import { sql } from "@/lib/db";

type Row = { uid: string; email: string; created: Date; earned: number; campaigns: number; budget: number; bank: boolean };

export default async function Users() {
  const rows = (await sql`
    SELECT us.uid, us.email, us.created,
           (SELECT COALESCE(SUM(dev_micro),0)::float8 FROM impressions WHERE dev_id = us.uid) AS earned,
           (SELECT count(*)::int FROM campaigns WHERE user_id = us.uid) AS campaigns,
           (SELECT COALESCE(SUM(budget_cents) FILTER (WHERE status IN ('active','paused')),0)::float8 FROM campaigns WHERE user_id = us.uid) AS budget,
           (us.payout_details IS NOT NULL) AS bank
    FROM users us ORDER BY us.created DESC LIMIT 200`) as Row[];
  return (
    <div className="grid gap-8">
      <div>
        <h1 className="display text-4xl md:text-5xl">Users</h1>
        <p className="mt-2 text-muted">{rows.length} accounts. Earnings are developer credits, budget is paid advertiser budget.</p>
      </div>
      <section className="panel p-6 md:p-8">
        {rows.length === 0 ? (
          <EmptyState title="No users yet" description="Accounts show up here once people sign up." />
        ) : (
          <DataTable
            caption="All users"
            density="compact"
            columns={[
              { key: "email", label: "Email", width: "2fr" },
              { key: "joined", label: "Joined", width: "110px" },
              { key: "earned", label: "Earned", type: "number", sortable: true, width: "100px" },
              { key: "campaigns", label: "Campaigns", type: "number", sortable: true, width: "110px" },
              { key: "budget", label: "Paid budget", type: "number", sortable: true, width: "120px" },
              { key: "bank", label: "Bank saved", width: "100px" },
            ]}
            rows={rows.map((r) => ({
              id: r.uid, email: r.email, joined: new Date(r.created).toLocaleDateString(), earned: `$${(r.earned / 100000).toFixed(2)}`,
              campaigns: r.campaigns, budget: `$${(r.budget / 100).toFixed(2)}`, bank: r.bank ? "Yes" : "No",
            }))}
          />
        )}
      </section>
    </div>
  );
}

import { sql } from "@/lib/db";
import { currentUser, isAdmin, userFromBearer } from "@/lib/auth";

export const dynamic = "force-dynamic";

const TICK_MS = 2000;
const KEEPALIVE_MS = 15000;

// Server-Sent Events. Browser sends the session cookie, the extension sends its Bearer key.
// The server watches one cheap fingerprint of everything this user cares about and emits `change` when it moves.
// ponytail: Neon has no push channel to clients, so this polls the DB every 2s per open stream.
// Swap for Postgres LISTEN/NOTIFY on a direct (non-pooled) connection when connection counts matter.
export async function GET(req: Request) {
  const u = (await userFromBearer(req)) ?? (await currentUser());
  if (!u) return new Response("unauthorized", { status: 401 });

  const enc = new TextEncoder();
  let timer: ReturnType<typeof setInterval>;
  let beat: ReturnType<typeof setInterval>;

  const stream = new ReadableStream({
    async start(ctl) {
      let last: string | null = null;
      let busy = false;
      const send = (s: string) => { try { ctl.enqueue(enc.encode(s)); } catch {} };
      const close = () => { clearInterval(timer); clearInterval(beat); try { ctl.close(); } catch {} };
      req.signal.addEventListener("abort", close);

      const check = async () => {
        if (busy) return;
        busy = true;
        try {
          const [r] = await sql`
            SELECT md5(concat_ws('|',
              (SELECT COALESCE(max(id),0) FROM impressions WHERE dev_id=${u.uid}),
              (SELECT COALESCE(max(i.id),0) FROM impressions i JOIN campaigns c ON c.id=i.campaign_id WHERE c.user_id=${u.uid}),
              (SELECT COALESCE(string_agg(id::text||status||spent_micro::text, ',' ORDER BY id),'') FROM campaigns WHERE user_id=${u.uid}),
              (SELECT COALESCE(string_agg(id::text||status||(spent_micro < budget_cents*1000)::text, ',' ORDER BY id),'') FROM campaigns WHERE status='active' AND user_id<>${u.uid}),
              (SELECT count(*) FROM payouts WHERE user_id=${u.uid}),
              (SELECT COALESCE(max(k.id),0) FROM clicks k JOIN campaigns c ON c.id=k.campaign_id WHERE c.user_id=${u.uid})
            )) AS v`;
          let v = r.v as string;
          if (isAdmin(u)) {
            // platform-wide movement for the Revenue page
            const [a] = await sql`SELECT concat_ws('|', (SELECT COALESCE(max(id),0) FROM impressions), (SELECT count(*) FROM payouts), (SELECT COALESCE(sum(cents),0) FROM payouts WHERE status='paid'), (SELECT count(*) FROM campaigns)) AS a`;
            v += a.a;
          }
          if (last !== null && v !== last) send(`event: change\ndata: ${v.length}\n\n`);
          last = v;
        } catch {
          // transient DB error: try again next tick
        } finally {
          busy = false;
        }
      };

      send("retry: 3000\n\n");
      await check();
      send("event: ready\ndata: ok\n\n");
      timer = setInterval(check, TICK_MS);
      beat = setInterval(() => send(": keepalive\n\n"), KEEPALIVE_MS);
    },
    cancel() { clearInterval(timer); clearInterval(beat); },
  });

  return new Response(stream, {
    headers: { "content-type": "text/event-stream", "cache-control": "no-cache, no-transform", connection: "keep-alive", "x-accel-buffering": "no" },
  });
}

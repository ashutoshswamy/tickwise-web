import { Webhook } from "standardwebhooks";
import { sql } from "@/lib/db";

export async function POST(req: Request) {
  const key = process.env.DODO_PAYMENTS_WEBHOOK_KEY;
  if (!key) return new Response("dodo not configured", { status: 501 });
  const raw = await req.text();
  try {
    await new Webhook(key).verify(raw, {
      "webhook-id": req.headers.get("webhook-id") ?? "",
      "webhook-signature": req.headers.get("webhook-signature") ?? "",
      "webhook-timestamp": req.headers.get("webhook-timestamp") ?? "",
    });
  } catch {
    return new Response("bad signature", { status: 400 });
  }
  const ev = JSON.parse(raw) as { type: string; data?: { metadata?: { campaign_id?: string } } };
  // ponytail: amount is set server-side in the session, so no re-check here. Compare data.total_amount if you ever let clients pick it.
  const id = Number(ev.data?.metadata?.campaign_id);
  if (ev.type === "payment.succeeded" && Number.isInteger(id))
    await sql`UPDATE campaigns SET status='active' WHERE id=${id} AND status='unpaid'`;
  return new Response("ok");
}

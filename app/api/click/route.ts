import { userFromBearer } from "@/lib/auth";
import { recordClick } from "@/lib/clicks";

// The extension's status bar ad calls this when a developer clicks it. Same counting rules as the spinner link.
export async function POST(req: Request) {
  const u = await userFromBearer(req);
  if (!u) return Response.json({ error: "bad key" }, { status: 401 });
  const { campaignId } = (await req.json().catch(() => ({}))) as { campaignId?: number };
  const cid = Number(campaignId);
  if (!Number.isInteger(cid)) return Response.json({ error: "bad campaign" }, { status: 400 });
  const url = await recordClick(cid, u.uid);
  return url ? Response.json({ url }) : Response.json({ error: "no link" }, { status: 404 });
}

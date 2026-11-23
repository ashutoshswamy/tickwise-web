import { recordClick, uidFromToken } from "@/lib/clicks";

export const dynamic = "force-dynamic";

// The link inside the terminal spinner points here. We count the click for the developer the token was minted for,
// then send the browser on to the advertiser's page. A missing or forged token still redirects but is not counted.
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  const home = new URL("/", req.url);
  if (!Number.isInteger(id)) return Response.redirect(home, 302);
  const uid = uidFromToken(new URL(req.url).searchParams.get("t"));
  const dest = await recordClick(id, uid);
  return Response.redirect(dest ?? home, 302);
}

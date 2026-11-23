"use server";
import { redirect } from "next/navigation";
import { sql, earnedCents, MAX_AD_CHARS, MIN_PAYOUT_CENTS } from "@/lib/db";
import { dodo, dodoOn } from "@/lib/dodo";
import { randomBytes } from "node:crypto";
import { seal, vaultOn } from "@/lib/vault";
import { clearSession, isAdmin, requireUser } from "@/lib/auth";

export async function signOut() {
  await clearSession();
  redirect("/");
}

export async function createCampaign(fd: FormData) {
  const u = await requireUser();
  const text = String(fd.get("text") ?? "").trim().replace(/\s+/g, " ");
  const cpm = Math.round(Number(fd.get("cpm")) * 100);
  const budget = Math.round(Number(fd.get("budget")) * 100);
  if (!text || text.length > MAX_AD_CHARS) redirect("/dashboard/advertise/new?e=text");
  if (!(cpm >= 200) || !(budget >= 500)) redirect("/dashboard/advertise/new?e=money");
  // Required click-through link: http(s) only, so javascript: and data: URLs can never be stored.
  const rawLink = String(fd.get("link") ?? "").trim();
  let link = "";
  try {
    const url = new URL(/^https?:\/\//i.test(rawLink) ? rawLink : `https://${rawLink}`);
    if (!rawLink || !/^https?:$/.test(url.protocol) || rawLink.length > 300) throw new Error("bad");
    link = url.toString();
  } catch {
    redirect("/dashboard/advertise/new?e=link");
  }
  const placement = String(fd.get("placement"));
  if (!["terminal", "extension", "both"].includes(placement)) redirect("/dashboard/advertise/new?e=placement");

  const [{ id }] = await sql`INSERT INTO campaigns(user_id,text,cpm_cents,budget_cents,link_url,placement) VALUES(${u.uid},${text},${cpm},${budget},${link},${placement}) RETURNING id`;
  await checkout(id, u.email, budget);
}

// Shared by createCampaign and payCampaign. Always redirects.
async function checkout(id: number, email: string, budget: number): Promise<never> {
  const base = process.env.APP_URL ?? "http://localhost:3000";
  if (dodoOn()) {
    // PWYW product (min $5) so the amount is the advertiser's budget. Webhook flips status to active.
    const session = await dodo().checkoutSessions.create({
      product_cart: [{ product_id: process.env.DODO_PRODUCT_ID!, quantity: 1, amount: budget }],
      customer: { email },
      metadata: { campaign_id: String(id) },
      billing_currency: "USD", // ponytail: stops Dodo converting to INR for Indian customers; ignored if adaptive pricing is off
      return_url: `${base}/dashboard/advertise?paid=1`,
    });
    redirect(session.checkout_url!);
  }
  // ponytail: no Dodo keys = test mode, campaign goes live without charging. Set DODO_PAYMENTS_API_KEY + DODO_PRODUCT_ID for real checkout.
  await sql`UPDATE campaigns SET status='active' WHERE id=${id}`;
  redirect("/dashboard/advertise?paid=test");
}

// Retry payment for a saved unpaid campaign. Amount comes from the DB row, never the client.
export async function payCampaign(fd: FormData) {
  const u = await requireUser();
  const [c] = await sql`SELECT id,budget_cents FROM campaigns WHERE id=${Number(fd.get("id"))} AND user_id=${u.uid} AND status='unpaid'`;
  if (!c) redirect("/dashboard/advertise");
  await checkout(c.id, u.email, c.budget_cents);
}

// Unpaid campaigns are never served, so they have no impressions/clicks rows to orphan.
export async function deleteCampaign(fd: FormData) {
  const u = await requireUser();
  await sql`DELETE FROM campaigns WHERE id=${Number(fd.get("id"))} AND user_id=${u.uid} AND status='unpaid'`;
  redirect("/dashboard/advertise");
}

export async function toggleCampaign(fd: FormData) {
  const u = await requireUser();
  await sql`UPDATE campaigns SET status = CASE status WHEN 'active' THEN 'paused' WHEN 'paused' THEN 'active' ELSE status END
            WHERE id=${Number(fd.get("id"))} AND user_id=${u.uid}`;
  redirect("/dashboard/advertise");
}

// Where to send the money. Stored encrypted; only the admin page decrypts it.
export async function savePayoutDetails(fd: FormData) {
  const u = await requireUser();
  if (!vaultOn()) redirect("/dashboard/earn?e=vault");
  const f = (k: string) => String(fd.get(k) ?? "").trim().replace(/\s+/g, " ");
  const d = { country: f("country"), holder: f("holder"), bank: f("bank"), account: f("account"), code: f("code") };
  const ok = d.country.length >= 2 && d.country.length <= 60 && d.holder.length >= 2 && d.holder.length <= 100 && d.bank.length >= 2 && d.bank.length <= 100
    && /^[A-Za-z0-9 -]{4,40}$/.test(d.account) && /^[A-Za-z0-9 -]{3,20}$/.test(d.code);
  if (!ok) redirect("/dashboard/earn?e=details");
  await sql`UPDATE users SET payout_details=${seal(d)} WHERE uid=${u.uid}`;
  redirect("/dashboard/earn?saved=1");
}

// ponytail: payouts are recorded, then sent by hand. Dodo payouts only reach your own bank, so developers are paid outside the app.
export async function requestPayout() {
  const u = await requireUser();
  const cents = Math.floor((await earnedCents(u.uid)).available);
  if (cents < MIN_PAYOUT_CENTS) redirect("/dashboard/earn?e=min");
  const [d] = await sql`SELECT payout_details FROM users WHERE uid=${u.uid}`;
  if (!d?.payout_details) redirect("/dashboard/earn?e=nodetails");
  await sql`INSERT INTO payouts(user_id,cents) VALUES(${u.uid},${cents})`;
  redirect("/dashboard/earn?paid=1");
}

// Rotating the key signs the extension out until the new key is pasted in.
export async function regenerateKey() {
  const u = await requireUser();
  const key = "tw_" + randomBytes(20).toString("hex");
  await sql`UPDATE users SET api_key=${key} WHERE uid=${u.uid}`;
  return key;
}

// Admin only: record that a developer payout was sent (by hand, outside the app).
export async function markPayoutPaid(fd: FormData) {
  const u = await requireUser();
  if (!isAdmin(u)) redirect("/dashboard/earn");
  await sql`UPDATE payouts SET status='paid' WHERE id=${Number(fd.get("id"))} AND status='requested'`;
  redirect("/admin/payouts");
}

// Admin only: pause or resume any campaign (moderation).
export async function adminSetCampaign(fd: FormData) {
  const u = await requireUser();
  if (!isAdmin(u)) redirect("/dashboard/earn");
  await sql`UPDATE campaigns SET status = CASE status WHEN 'active' THEN 'paused' WHEN 'paused' THEN 'active' ELSE status END WHERE id=${Number(fd.get("id"))}`;
  redirect("/admin/campaigns");
}

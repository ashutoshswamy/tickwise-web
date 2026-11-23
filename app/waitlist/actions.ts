"use server";
import { sql } from "@/lib/db";

export type WaitlistState = { ok?: boolean; error?: string };

export async function join(_: WaitlistState, fd: FormData): Promise<WaitlistState> {
  const email = String(fd.get("email") ?? "").trim().toLowerCase();
  const role = fd.get("role") === "advertiser" ? "advertiser" : "developer";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return { error: "Enter a valid email address." };
  await sql`INSERT INTO waitlist(email,role) VALUES(${email},${role}) ON CONFLICT (email) DO NOTHING`;
  return { ok: true };
}

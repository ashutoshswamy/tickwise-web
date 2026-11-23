import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

// Bank details are encrypted (AES-256-GCM) before they reach the DB. PAYOUT_KEY = 64 hex chars (openssl rand -hex 32).
const HEX = /^[0-9a-f]{64}$/i;
export const vaultOn = () => HEX.test(process.env.PAYOUT_KEY ?? "");
const key = () => Buffer.from(process.env.PAYOUT_KEY!, "hex");

export type Bank = { country: string; holder: string; bank: string; account: string; code: string };

export function seal(o: Bank) {
  const iv = randomBytes(12);
  const c = createCipheriv("aes-256-gcm", key(), iv);
  const enc = Buffer.concat([c.update(JSON.stringify(o), "utf8"), c.final()]);
  return [iv, c.getAuthTag(), enc].map((b) => b.toString("base64")).join(".");
}

export function unseal(s: string | null | undefined): Bank | null {
  if (!s || !vaultOn()) return null;
  try {
    const [iv, tag, enc] = s.split(".").map((x) => Buffer.from(x, "base64"));
    const d = createDecipheriv("aes-256-gcm", key(), iv);
    d.setAuthTag(tag);
    return JSON.parse(Buffer.concat([d.update(enc), d.final()]).toString("utf8")) as Bank;
  } catch {
    return null;
  }
}

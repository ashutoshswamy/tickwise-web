import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { randomBytes } from "node:crypto";
import { sql, type User } from "./db";
import { adminAuth } from "./firebase-admin";
import { LEGAL_VERSION } from "./legal";

const COOKIE = "session";
const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 14; // Firebase session cookies cap at 14 days

// Called by /api/session after the browser signs in with Firebase.
import { waitlistOn } from "./waitlist";
export async function createSession(idToken: string, accepted = false) {
  const decoded = await adminAuth().verifyIdToken(idToken);
  if (!decoded.email) throw new Error("account has no email");
  // A brand-new account must come with acceptance of the Terms, Privacy and Cookie policies and the 18+ confirmation.
  const [known] = await sql`SELECT 1 FROM users WHERE uid=${decoded.uid}`;
  if (!known && waitlistOn()) throw new Error("waitlist");
  if (!known && !accepted) throw new Error("terms");
  await sql`INSERT INTO users(uid,email,api_key,email_verified,terms_accepted_at,terms_version) VALUES(${decoded.uid},${decoded.email},${"tw_" + randomBytes(20).toString("hex")},${decoded.email_verified === true},now(),${LEGAL_VERSION})
            ON CONFLICT (uid) DO UPDATE SET email=EXCLUDED.email, email_verified=EXCLUDED.email_verified`;
  const cookie = await adminAuth().createSessionCookie(idToken, { expiresIn: MAX_AGE_MS });
  (await cookies()).set(COOKIE, cookie, {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: MAX_AGE_MS / 1000,
  });
}
export async function clearSession() { (await cookies()).delete(COOKIE); }

export async function currentUser(): Promise<User | null> {
  const c = (await cookies()).get(COOKIE)?.value;
  if (!c) return null;
  try {
    const { uid } = await adminAuth().verifySessionCookie(c);
    const [u] = await sql`SELECT uid,email,api_key,email_verified FROM users WHERE uid=${uid}`;
    return (u as User) ?? null;
  } catch {
    return null;
  }
}
export async function requireUser() {
  const u = await currentUser();
  if (!u) redirect("/login");
  return u;
}

export async function userFromBearer(req: Request): Promise<User | null> {
  const k = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!k) return null;
  const [u] = await sql`SELECT uid,email,api_key,email_verified FROM users WHERE api_key=${k}`;
  return (u as User) ?? null;
}

// Platform owner(s): emails in ADMIN_EMAILS. The email must also be verified, otherwise anyone could sign up with an admin's address.
export const isAdmin = (u: { email: string; email_verified?: boolean } | null) =>
  !!u && u.email_verified === true && (process.env.ADMIN_EMAILS ?? "").toLowerCase().split(",").map((e) => e.trim()).filter(Boolean).includes(u.email.toLowerCase());

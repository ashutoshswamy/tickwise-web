import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { waitlistOn } from "@/lib/waitlist";
import WaitlistForm from "./form";

export const metadata: Metadata = { title: "Join the waitlist", alternates: { canonical: "/waitlist" } };

export default async function Waitlist() {
  // Flag off: nothing to wait for. Signed-in users have no use for the page either.
  if (!waitlistOn() || (await currentUser())) redirect("/");
  return (
    <AuthShell>
      <div className="grid gap-5">
        <div>
          <h2 className="display text-3xl">Tickwise is invite-only for now</h2>
          <p className="mt-2 text-muted">Leave your email and we will let you in as spots open.</p>
        </div>
        <WaitlistForm />
        <p className="text-sm text-muted">Already have an account? <Link href="/login" className="font-semibold underline">Sign in</Link></p>
      </div>
    </AuthShell>
  );
}

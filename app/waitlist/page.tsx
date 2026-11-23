import type { Metadata } from "next";
import { AuthShell } from "@/components/auth-shell";
import { redirect } from "next/navigation";
import { waitlistOn } from "@/lib/waitlist";
import WaitlistForm from "./form";

export const metadata: Metadata = { title: "Join the waitlist", alternates: { canonical: "/waitlist" } };

export default async function Waitlist() {
  if (!waitlistOn()) redirect("/");
  return (
    <AuthShell bare>
      <div className="grid gap-5">
        <div>
          <h2 className="display text-3xl">Tickwise is invite-only for now</h2>
          <p className="mt-2 text-muted">Leave your email and we will let you in as spots open.</p>
        </div>
        <WaitlistForm />
      </div>
    </AuthShell>
  );
}

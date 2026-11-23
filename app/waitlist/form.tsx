"use client";
import { useActionState } from "react";
import { join, type WaitlistState } from "./actions";

export default function WaitlistForm() {
  const [s, act, pending] = useActionState<WaitlistState, FormData>(join, {});
  if (s.ok) return <p role="status" className="text-lg font-semibold">You are on the list. We will email you when a spot opens.</p>;
  return (
    <form action={act} className="grid gap-4">
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" className="input" />
      </div>
      <fieldset className="flex gap-5 text-sm font-semibold">
        <label className="flex items-center gap-2"><input type="radio" name="role" value="developer" defaultChecked /> I want to earn</label>
        <label className="flex items-center gap-2"><input type="radio" name="role" value="advertiser" /> I want to advertise</label>
      </fieldset>
      <button className="btn w-full" disabled={pending}>{pending ? "Joining..." : "Join the waitlist"}</button>
      {s.error && <p role="alert" className="text-sm font-medium text-danger">{s.error}</p>}
    </form>
  );
}

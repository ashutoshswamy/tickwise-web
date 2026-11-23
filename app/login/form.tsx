"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, updateProfile,
} from "firebase/auth";
import Link from "next/link";
import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/outline";
import { SegmentedControl, SignInCard, SignUpCard } from "@ashutoshswamy/smoui";
import { clientAuth } from "@/lib/firebase-client";

const msg: Record<string, string> = {
  "auth/email-already-in-use": "That email already has an account. Switch to Sign in.",
  "auth/invalid-credential": "Email or password is wrong.",
  "auth/weak-password": "Use a password of at least 8 characters.",
  "auth/invalid-email": "Enter a valid email address.",
  "auth/popup-closed-by-user": "Google sign-in was closed before it finished.",
  "auth/popup-blocked": "Your browser blocked the Google popup. Allow popups for this site and try again.",
  "auth/unauthorized-domain": "This domain is not authorized in Firebase. Add it under Authentication > Settings > Authorized domains.",
  "auth/operation-not-allowed": "This sign-in method is not enabled in the Firebase console.",
  "app/terms": "There is no account for this login yet. Use Create account and accept the terms first.",
  "app/waitlist": "Tickwise is invite-only right now. Join the waitlist on the home page.",
  "auth/too-many-requests": "Too many attempts. Wait a minute and try again.",
};

type Cred = { user: { getIdToken(): Promise<string> } };

// Turns any failure into a message the smoui cards can show (they display the Error message and shake).
function explain(e: unknown): Error {
  const { code, detail } = e as { code?: string; detail?: string };
  if (code && msg[code]) return new Error(msg[code]);
  if (detail) return new Error(`Signed in, but the server could not start your session: ${detail}`);
  if (code) return new Error(`Sign-in failed (${code}).`);
  return new Error("Signed in, but the server could not start your session. Try again.");
}

export default function LoginForm({ next }: { next: string }) {
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [gErr, setGErr] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function finish(cred: Cred, accepted = false) {
    const r = await fetch("/api/session", { method: "POST", body: JSON.stringify({ idToken: await cred.user.getIdToken(), accepted }) });
    if (r.status === 403) {
      const j = (await r.json().catch(() => ({}))) as { error?: string };
      throw Object.assign(new Error(j.error), { code: j.error === "waitlist" ? "app/waitlist" : "app/terms" });
    }
    if (!r.ok) {
      // Firebase said yes but our server did not: surface why instead of a vague failure.
      const j = (await r.json().catch(() => ({}))) as { detail?: string };
      throw Object.assign(new Error("session"), { detail: j.detail });
    }
    router.push(next);
    router.refresh();
  }

  async function google() {
    setBusy(true); setGErr("");
    try { await finish(await signInWithPopup(clientAuth, new GoogleAuthProvider()), mode === "signup"); }
    catch (e) { setGErr(explain(e).message); setBusy(false); }
  }

  const providers = (
    <div className="grid gap-2">
      <button type="button" disabled={busy} onClick={google} className="btn btn-ghost w-full">
        <ArrowRightEndOnRectangleIcon className="size-5" strokeWidth={2} aria-hidden /> Continue with Google
      </button>
      {mode === "signup" && <p className="text-xs text-muted">By continuing with Google you confirm you are at least 18 and accept the <Link href="/terms" target="_blank" className="font-semibold underline">Terms</Link>, <Link href="/privacy" target="_blank" className="font-semibold underline">Privacy Policy</Link> and <Link href="/cookies" target="_blank" className="font-semibold underline">Cookie Policy</Link>.</p>}
      {gErr && <p role="alert" className="text-sm font-medium text-danger">{gErr}</p>}
    </div>
  );

  return (
    <div className="grid gap-5">
      <SegmentedControl
        className="auth-seg"
        label="Create an account or sign in"
        value={mode}
        onChange={(v) => { setMode(v as "signup" | "signin"); setGErr(""); }}
        options={[{ value: "signup", label: "Create account" }, { value: "signin", label: "Sign in" }]}
      />
      {mode === "signup" ? (
        <SignUpCard
          className="auth-card"
          title="Start earning"
          description="One account covers earning and advertising."
          providers={providers}
          minLength={8}
          terms={<>I am at least 18 years old, I accept the <Link href="/terms" target="_blank" className="font-semibold underline">Terms</Link>, <Link href="/privacy" target="_blank" className="font-semibold underline">Privacy Policy</Link> and <Link href="/cookies" target="_blank" className="font-semibold underline">Cookie Policy</Link>, and I understand Tickwise replaces my Claude Code spinner words with sponsor lines.</>}
          submitLabel="Create account"
          onSubmit={async ({ name, email, password }) => {
            try {
              const cred = await createUserWithEmailAndPassword(clientAuth, email, password);
              if (name) await updateProfile(cred.user, { displayName: name });
              await finish(cred, true);
            } catch (e) { throw explain(e); }
          }}
        />
      ) : (
        <SignInCard
          className="auth-card"
          title="Welcome back"
          description="Sign in to your earnings and campaigns."
          providers={providers}
          forgotHref="/login/reset"
          submitLabel="Sign in"
          onSubmit={async ({ email, password }) => {
            try { await finish(await signInWithEmailAndPassword(clientAuth, email, password)); }
            catch (e) { throw explain(e); }
          }}
        />
      )}
    </div>
  );
}

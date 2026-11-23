import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import ResetForm from "./form";

export default function Reset() {
  return (
    <AuthShell>
      <ResetForm />
      <p className="mt-5 text-center text-sm text-muted">
        Remembered it? <Link href="/login" className="font-semibold text-ink underline">Back to sign in</Link>
      </p>
    </AuthShell>
  );
}

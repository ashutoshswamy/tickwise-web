import type { Metadata } from "next";
import { AuthShell } from "@/components/auth-shell";
import LoginForm from "./form";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: true }, alternates: { canonical: "/login" } };

export default async function Login({ searchParams }: { searchParams: Promise<{ next?: string; state?: string }> }) {
  const { next, state } = await searchParams;
  // "vscode" sends you on to the extension hand-off page after login. state is the extension's nonce, shape-checked.
  const dest = next === "vscode" && /^[A-Za-z0-9_-]{16,128}$/.test(state ?? "") ? `/connect/vscode?state=${state}` : next === "advertise" ? "/dashboard/advertise" : "/dashboard/earn";
  return (
    <AuthShell>
      <LoginForm next={dest} />
    </AuthShell>
  );
}

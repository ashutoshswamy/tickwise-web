import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { currentUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Connect VS Code", robots: { index: false, follow: false } };

// Editors that register a URI scheme for VS Code extensions. Exact match only: never build a link from anything else.
const SCHEMES = ["vscode", "vscode-insiders", "vscodium", "cursor", "windsurf", "positron", "trae", "kiro"];
const EXT_ID = "tickwise.tickwise"; // publisher.name from extension/package.json

export default async function VscodeSignIn({ searchParams }: { searchParams: Promise<{ state?: string; scheme?: string }> }) {
  const { state = "", scheme = "vscode" } = await searchParams;
  if (!/^[A-Za-z0-9_-]{16,128}$/.test(state)) redirect("/dashboard/connect");
  const u = await currentUser();
  if (!u) redirect(`/login?next=vscode&state=${state}`);
  const s = SCHEMES.includes(scheme) ? scheme : "vscode";
  const href = `${s}://${EXT_ID}/auth?state=${state}&key=${u.api_key}`;
  return (
    <main className="mx-auto grid min-h-dvh max-w-xl content-center gap-6 px-4 py-10">
      <div>
        <h1 className="display text-4xl md:text-5xl">Connect VS Code</h1>
        <p className="mt-2 text-muted">Signed in as <span className="font-semibold text-ink">{u.email}</span>. Your editor asked to connect to this account.</p>
      </div>
      <section className="panel grid gap-4 p-6 md:p-8">
        <a href={href} className="btn btn-sun w-full">Open VS Code <ArrowTopRightOnSquareIcon className="size-[18px]" strokeWidth={2} /></a>
        <p className="text-sm text-muted">Your browser will ask to open the editor. If you did not start this from VS Code, close this page.</p>
      </section>
    </main>
  );
}

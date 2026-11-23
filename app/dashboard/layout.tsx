import type { Metadata } from "next";
import Link from "next/link";
import { UserMenu } from "@ashutoshswamy/smoui";
import { Logo } from "@/components/logo";
import { isAdmin, requireUser } from "@/lib/auth";
import { signOut } from "./actions";
import { DashNav } from "@/components/nav";
import { TzSet } from "@/components/tz-set";
import { LiveRefresh } from "@/components/live-refresh";
import { LegalLinks } from "@/components/legal";

export const metadata: Metadata = { title: "Dashboard", robots: { index: false, follow: false } };

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const u = await requireUser();
  return (
    <div className="min-h-dvh">
      {/* Top bar instead of a sidebar: the whole width belongs to the work. */}
      <header className="sticky top-0 z-30 bg-panel/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
          <Link href="/" className="flex items-center gap-2" aria-label="Tickwise home">
            <Logo size={32} /> <span className="display hidden text-2xl sm:inline">Tickwise</span>
          </Link>
          <DashNav admin={isAdmin(u)} />
          <UserMenu name={u.email.split("@")[0]} email={u.email} onSignOut={signOut} />
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10"><TzSet /><LiveRefresh />{children}</main>
      <footer className="mx-auto max-w-7xl px-4 pb-8 md:px-8"><LegalLinks className="text-muted" /></footer>
    </div>
  );
}

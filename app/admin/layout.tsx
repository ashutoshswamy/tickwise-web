import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Logo } from "@/components/logo";
import { currentUser, isAdmin } from "@/lib/auth";
import { AdminNav } from "@/components/admin-nav";
import { LiveRefresh } from "@/components/live-refresh";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

// Every /admin page sits behind this one check. Anyone who is not an allowed, verified email gets a plain 404.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const u = await currentUser();
  if (!u) redirect("/login");
  if (!isAdmin(u)) notFound();
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 bg-panel/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
          <Link href="/admin" className="flex items-center gap-2" aria-label="Tickwise admin">
            <Logo size={32} /> <span className="display hidden text-2xl sm:inline">Admin</span>
          </Link>
          <AdminNav />
          <Link href="/dashboard/earn" className="text-sm font-semibold text-muted hover:text-ink">Dashboard</Link>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10"><LiveRefresh />{children}</main>
    </div>
  );
}

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/payouts", label: "Payouts" },
  { href: "/admin/campaigns", label: "Campaigns" },
  { href: "/admin/users", label: "Users" },
];

export function AdminNav() {
  const path = usePathname();
  return (
    <nav className="flex gap-1" aria-label="Admin">
      {tabs.map(({ href, label }) => {
        const on = href === "/admin" ? path === href : path.startsWith(href);
        return (
          <Link key={href} href={href} aria-current={on ? "page" : undefined}
            className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${on ? "bg-pine text-sun" : "text-muted hover:bg-ink/8 hover:text-ink"}`}>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

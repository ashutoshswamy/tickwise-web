"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CurrencyDollarIcon, LinkIcon, MegaphoneIcon, PresentationChartLineIcon } from "@heroicons/react/24/outline";
import { CurrencyDollarIcon as CurrencyDollarSolid, LinkIcon as LinkSolid, MegaphoneIcon as MegaphoneSolid, PresentationChartLineIcon as PresentationChartLineSolid } from "@heroicons/react/24/solid";

const nav = [
  { href: "/dashboard/earn", label: "Earn", Icon: CurrencyDollarIcon, Solid: CurrencyDollarSolid },
  { href: "/dashboard/advertise", label: "Advertise", Icon: MegaphoneIcon, Solid: MegaphoneSolid },
  { href: "/dashboard/connect", label: "Connect", Icon: LinkIcon, Solid: LinkSolid },
];

// Top tabs. The active page is a filled pill.
export function DashNav({ admin = false }: { admin?: boolean }) {
  const path = usePathname();
  const items = admin ? [...nav, { href: "/admin", label: "Admin", Icon: PresentationChartLineIcon, Solid: PresentationChartLineSolid }] : nav;
  return (
    <nav className="flex gap-1" aria-label="Dashboard">
      {items.map(({ href, label, Icon, Solid }) => {
        const on = path.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={on ? "page" : undefined}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-colors ${on ? "bg-pine text-sun" : "text-muted hover:bg-ink/8 hover:text-ink"}`}
          >
            {on ? <Solid className="size-[18px]" /> : <Icon className="size-[18px]" strokeWidth={2} />}
            <span className="hidden sm:inline">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

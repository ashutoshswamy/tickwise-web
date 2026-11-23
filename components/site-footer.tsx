import Link from "next/link";
import { Logo } from "./logo";
import { CONTACT } from "@/lib/legal";
import { CookieSettings } from "./cookie-consent";

const cols = [
  { title: "Product", links: [["How it works", "/#how-it-works"], ["Earnings estimator", "/#earnings"], ["For developers", "/developers"], ["For advertisers", "/advertisers"], ["FAQ", "/#faq"]] },
  { title: "Get started", links: [["Start earning", "/login?next=earn"], ["Run an ad", "/login?next=advertise"], ["Sign in", "/login"]] },
  { title: "Legal", links: [["Terms of Service", "/terms"], ["Privacy Policy", "/privacy"], ["Cookie Policy", "/cookies"]] },
] as const;

export function SiteFooter() {
  return (
    <footer className="bg-ink text-ground" aria-label="Site footer">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 md:px-8 lg:grid-cols-[1.4fr_2fr]">
        <div>
          <Link href="/" className="flex items-center gap-2" aria-label="Tickwise home">
            <Logo size={32} /> <span className="display text-2xl">Tickwise</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed opacity-75">Sponsor lines for Claude Code. Developers earn while the agent thinks, advertisers reach builders mid-task.</p>
          {CONTACT && <p className="mt-4 text-sm"><a href={`mailto:${CONTACT}`} className="font-semibold underline-offset-4 hover:underline">{CONTACT}</a></p>}
        </div>
        <nav aria-label="Footer" className="grid gap-8 sm:grid-cols-3">
          {cols.map((c) => (
            <div key={c.title}>
              <h2 className="text-sm font-bold uppercase tracking-wider opacity-60">{c.title}</h2>
              <ul className="mt-4 grid gap-3 text-sm font-medium">
                {c.links.map(([label, href]) => (
                  <li key={href}><Link href={href} className="opacity-90 hover:underline hover:opacity-100">{label}</Link></li>
                ))}
                {c.title === "Legal" && <li><CookieSettings className="opacity-90 hover:underline hover:opacity-100" /></li>}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-xs opacity-70 md:px-8">
          <p>&copy; {new Date().getFullYear()} Tickwise. All rights reserved.</p>
          <p>Tickwise is an independent service and is not affiliated with, endorsed by or sponsored by Anthropic. Claude and Claude Code are trademarks of Anthropic.</p>
        </div>
      </div>
    </footer>
  );
}

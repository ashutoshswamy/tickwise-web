import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Logo } from "./logo";
import { CONTACT, LEGAL_DATE } from "@/lib/legal";
import { CookieSettings } from "./cookie-consent";
import { SiteFooter } from "./site-footer";

export function LegalLinks({ className = "" }: { className?: string }) {
  return (
    <nav aria-label="Legal" className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold ${className}`}>
      <Link href="/terms" className="hover:underline">Terms</Link>
      <Link href="/privacy" className="hover:underline">Privacy</Link>
      <Link href="/cookies" className="hover:underline">Cookies</Link>
      <CookieSettings className="hover:underline" />
    </nav>
  );
}

// Shared frame for the three legal pages. Headings and lists are styled here so the pages stay plain text.
export function LegalPage({ title, children, dated = true }: { title: string; children: React.ReactNode; dated?: boolean }) {
  return (
    <main className="min-h-dvh bg-ground">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-4 py-6 md:px-8">
        <Link href="/" className="flex items-center gap-2"><Logo size={32} /> <span className="display text-2xl">Tickwise</span></Link>
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink"><ArrowLeftIcon className="size-4" strokeWidth={2} /> Back</Link>
      </header>
      <article className="mx-auto max-w-3xl px-4 pb-20 md:px-8">
        <h1 className="display text-4xl md:text-6xl">{title}</h1>
        {dated && <p className="num mt-3 text-sm text-muted">Last updated {LEGAL_DATE}</p>}
        <div className="mt-8 grid gap-4 leading-relaxed [&_a]:font-semibold [&_a]:underline [&_h2]:display [&_h2]:mt-8 [&_h2]:text-2xl [&_li]:ml-5 [&_li]:list-disc [&_ul]:grid [&_ul]:gap-2">
          {children}
          <h2>Contact</h2>
          <p>{CONTACT ? <>Questions about this page: <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.</> : "Questions about this page: use the contact details on our website."}</p>
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}

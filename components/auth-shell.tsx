import Link from "next/link";
import { ArrowLeftIcon, EyeSlashIcon, ShieldCheckIcon, ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import { Logo } from "./logo";
import HeroFan from "./hero-fan";
import { LegalLinks } from "./legal";

const notes = [
  { t: "We never read your code", Icon: EyeSlashIcon },
  { t: "Plain text ads only", Icon: ShieldCheckIcon },
  { t: "Pause anytime, your spinner comes back", Icon: ArrowUturnLeftIcon },
];

// Shared frame for every auth screen: a vermilion matchbook panel on the left, the form on cool paper on the right.
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      <aside className="on-field relative hidden flex-col overflow-hidden bg-field text-onfield lg:flex">
        <Link href="/" className="flex items-center gap-2 px-12 pt-8">
          <Logo size={32} /> <span className="display text-2xl">Tickwise</span>
        </Link>
        <div className="px-12 pt-14">
          <h1 className="display max-w-[11ch] text-[clamp(2.75rem,4.4vw,4.5rem)]">Get paid while it thinks.</h1>
          <ul className="mt-8 grid gap-3 text-base font-medium">
            {notes.map(({ t, Icon }) => (
              <li key={t} className="flex items-center gap-3"><Icon className="size-5 shrink-0 text-sun" strokeWidth={2} /> {t}</li>
            ))}
          </ul>
        </div>
        <div className="mt-auto px-12 pb-6 pt-8"><HeroFan /></div>
        <div className="striker !h-10" />
      </aside>

      <section className="flex min-h-dvh flex-col bg-ground">
        <div className="on-field flex items-center justify-between bg-field px-4 py-4 text-onfield lg:hidden">
          <Link href="/" className="flex items-center gap-2"><Logo size={28} /> <span className="display text-xl">Tickwise</span></Link>
        </div>
        <div className="flex justify-end px-4 pt-4 md:px-8 md:pt-8">
          <Link href="/" className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-muted hover:bg-ink/8 hover:text-ink">
            <ArrowLeftIcon className="size-4" strokeWidth={2} /> Back to Tickwise
          </Link>
        </div>
        <div className="flex flex-1 justify-center px-4 pb-10 md:px-8">
          <div className="mt-[7vh] w-full max-w-[380px]">{children}</div>
        </div>
        <LegalLinks className="justify-center px-4 pb-6 text-muted" />
      </section>
    </main>
  );
}

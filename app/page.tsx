import Link from "next/link";
import {
  ArrowDownTrayIcon, ArrowRightIcon, ArrowUturnLeftIcon, BanknotesIcon, ChartBarIcon, CommandLineIcon,
  EyeSlashIcon, LinkIcon, ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { Logo } from "@/components/logo";
import { Counter, Reveal } from "@ashutoshswamy/smoui";
import HeroFan from "@/components/hero-fan";
import { Estimator } from "@/components/estimator";
import { Faq } from "@/components/faq";
import { SiteFooter } from "@/components/site-footer";
import { JsonLd } from "@/components/json-ld";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { waitlistOn } from "@/lib/waitlist";

const sticks = [
  { t: "Install", d: "Add the Tickwise extension to VS Code and paste your key. It takes under a minute.", Icon: ArrowDownTrayIcon, head: "var(--pine)", drop: "0rem" },
  { t: "Work", d: "Use Claude Code as usual. While it thinks, the spinner shows a sponsor line instead of a random verb.", Icon: CommandLineIcon, head: "var(--field)", drop: "3.5rem" },
  { t: "Cash out", d: "Earnings add up per impression. Request a payout once you pass $10.", Icon: BanknotesIcon, head: "var(--sun)", drop: "7rem" },
];

const promises = [
  { t: "Your code stays yours", d: "The extension only notices that session files changed. It never opens them.", Icon: EyeSlashIcon },
  { t: "Plain text, nothing else", d: "Ads are 48 characters, marked Ad. No images, no sound, no tracking pixels.", Icon: ShieldCheckIcon },
  { t: "Undo in one click", d: "Pause or uninstall and your original spinner words come back exactly as they were.", Icon: ArrowUturnLeftIcon },
];

export default async function Home() {
  const user = await currentUser();
  if (waitlistOn() && !user) redirect("/waitlist");
  return (
    <main>
      {/* HERO: a vermilion field with a fan of matchbook covers, closed off by a striker strip. */}
      <section className="on-field bg-field text-onfield">
        <header className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Logo size={32} /> <span className="display text-2xl">Tickwise</span>
          </Link>
          <nav className="flex items-center gap-2 text-sm font-semibold">
            <Link href="/login?next=advertise" className="hidden rounded-full px-4 py-2 hover:bg-white/15 sm:inline">Run an ad</Link>
            <Link href={user ? "/dashboard/earn" : "/login"} className="rounded-full bg-pine px-5 py-2.5 text-sun transition-opacity hover:opacity-90">
              {user ? "Dashboard" : "Sign in"}
            </Link>
          </nav>
        </header>

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-20 pt-8 md:px-8 lg:min-h-[34rem] lg:grid-cols-[1.05fr_1fr] [&>*]:min-w-0">
          <div className="relative z-10">
            <h1 className="display rise text-[clamp(2.9rem,6.3vw,5.75rem)]">
              Your agent is thinking.<br />Get paid for it.
            </h1>
            <p className="rise rise-2 mt-7 max-w-[44ch] text-lg font-medium opacity-95">
              Tickwise swaps Claude Code&apos;s spinner words for short text ads. Developers earn per impression. Advertisers reach builders mid-task.
            </p>
            <div className="rise rise-3 mt-9 flex flex-wrap items-center gap-5">
              <Link href="/login?next=earn" className="btn btn-sun">Start earning <ArrowRightIcon className="size-[18px]" strokeWidth={2} /></Link>
              <Link href="/login?next=advertise" className="inline-flex items-center gap-2 font-bold underline decoration-2 underline-offset-4">
                Run an ad <ArrowRightIcon className="size-4" strokeWidth={2} />
              </Link>
            </div>
          </div>
          <div className="rise rise-3"><HeroFan /></div>
        </div>
        <div className="striker !h-10" />
      </section>

      {/* HOW: three match sticks of different lengths, each topped with a coloured head. */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-24 md:px-8 lg:py-32">
        <h2 className="display max-w-[18ch] text-4xl md:text-6xl">Three steps. One is waiting.</h2>
        <Reveal stagger={0.1} effect="rise" direction="up">
          <ol className="mt-16 grid items-start gap-10 md:grid-cols-3 md:gap-6">
            {sticks.map(({ t, d, Icon, head, drop }) => (
              <li key={t} className="md:mt-[var(--drop)]" style={{ ["--drop" as string]: drop }}>
                <div className="mx-auto h-16 w-[78%] rounded-t-[999px]" style={{ background: head }} />
                <div className="panel rounded-t-none p-7 md:p-8">
                  <Icon className="size-8 text-serial" strokeWidth={1.75} />
                  <h3 className="display mt-8 text-4xl">{t}</h3>
                  <p className="mt-3 text-muted">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      {/* TERMS: the striker band, with the numbers struck in sun yellow. */}
      <section id="audiences" className="striker !h-auto text-ground">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 py-20 md:px-8 lg:grid-cols-2 lg:py-28">
          <div>
            <h2 className="display text-4xl md:text-5xl">For developers</h2>
            <p className="mt-4 max-w-[42ch] opacity-85">You keep 70% of what the advertiser pays, on every impression. There is no minimum usage and no fee to join.</p>
            <dl className="mt-10 grid grid-cols-2 gap-8">
              <div><dt className="text-sm opacity-75">Your share</dt><dd className="display mt-1 text-6xl text-sun md:text-7xl"><Counter to={70} suffix="%" tabular={false} /></dd></div>
              <div><dt className="text-sm opacity-75">Payout from</dt><dd className="display mt-1 text-6xl text-sun md:text-7xl"><Counter to={10} prefix="$" tabular={false} /></dd></div>
            </dl>
          </div>
          <div>
            <h2 className="display text-4xl md:text-5xl">For advertisers</h2>
            <p className="mt-4 max-w-[42ch] opacity-85">Pick a CPM, set a budget, pay by card. The ad goes live on checkout. Add a link and see every click.</p>
            <dl className="mt-10 grid grid-cols-2 gap-8">
              <div><dt className="text-sm opacity-75">Minimum CPM</dt><dd className="display mt-1 text-6xl text-sun md:text-7xl"><Counter to={2} prefix="$" decimals={2} tabular={false} /></dd></div>
              <div><dt className="text-sm opacity-75">Minimum budget</dt><dd className="display mt-1 text-6xl text-sun md:text-7xl"><Counter to={25} prefix="$" tabular={false} /></dd></div>
            </dl>
            <ul className="mt-8 grid gap-3 text-sm font-medium">
              <li className="flex items-center gap-3"><ChartBarIcon className="size-5 shrink-0 text-sun" strokeWidth={2} /> Live impressions and the hours your ads are seen</li>
              <li className="flex items-center gap-3"><LinkIcon className="size-5 shrink-0 text-sun" strokeWidth={2} /> Click tracking with UTM tags added for you</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="earnings" className="mx-auto max-w-7xl px-4 py-24 md:px-8 lg:py-32">
        <h2 className="display max-w-[16ch] text-4xl md:text-6xl">What the waiting is worth</h2>
        <div className="mt-12"><Estimator /></div>
      </section>

      <section className="bg-panel">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-24 md:px-8 lg:grid-cols-[1fr_1.2fr] lg:gap-24 lg:py-32">
          <div>
            <h2 className="display max-w-[14ch] text-4xl md:text-6xl">Built so you can trust it with your terminal</h2>
          </div>
          <ul className="grid gap-8">
            {promises.map(({ t, d, Icon }) => (
              <li key={t} className="flex gap-5">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-sun text-ink"><Icon className="size-6" strokeWidth={1.75} /></span>
                <div>
                  <h3 className="display text-2xl">{t}</h3>
                  <p className="mt-1.5 max-w-[46ch] text-muted">{d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="faq" className="mx-auto grid max-w-7xl gap-12 px-4 py-24 md:px-8 lg:grid-cols-[1fr_1.55fr] lg:gap-20 lg:py-32">
        <div className="lg:sticky lg:top-8 lg:self-start">
          <h2 className="display text-4xl md:text-5xl">Questions before you install</h2>
          <p className="mt-4 max-w-[36ch] text-muted">The short answers. Everything here is how the extension works today.</p>
          <div className="cover mt-8 max-w-sm" style={{ ["--c" as string]: "var(--pine)", ["--fg" as string]: "#f3f5ef" }}>
            <div className="cover-flap" />
            <p className="display p-6 text-2xl">Your prompts and code never leave your machine.</p>
            <div className="striker !h-8" />
          </div>
        </div>
        <Faq />
      </section>

      <footer className="on-field bg-field text-onfield">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-20 md:px-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h2 className="display max-w-[14ch] text-5xl md:text-7xl">The wait is already happening.</h2>
            <p className="mt-6 text-sm font-medium opacity-90">Tickwise is not affiliated with Anthropic.</p>
          </div>
          <Link href="/login" className="btn btn-sun">Start earning <ArrowRightIcon className="size-[18px]" strokeWidth={2} /></Link>
        </div>
        <div className="striker !h-10" />
      </footer>
      <SiteFooter />
      <JsonLd />
    </main>
  );
}

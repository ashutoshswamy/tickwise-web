import Link from "next/link";
import { LegalPage } from "@/components/legal";
import { CookieSettings } from "@/components/cookie-consent";

export const metadata = { title: "Cookie Policy", description: "The cookies Tickwise uses, which are essential, which are optional, and how to change your choice.", alternates: { canonical: "/cookies" } };

export default function Cookies() {
  return (
    <LegalPage title="Cookie Policy">
      <p>This page explains the cookies and similar storage the Tickwise website uses. It covers the website and dashboard only. The ads themselves appear in Claude Code, not in your browser, and use no cookies.</p>

      <h2>What we use</h2>
      <ul>
        <li><b>session</b> (essential): keeps you signed in. Set when you log in, expires after 14 days or when you sign out. It is HTTP-only. Without it you cannot use the dashboard.</li>
        <li><b>consent</b> (essential): remembers your cookie choice so we do not ask on every page. Lasts 12 months.</li>
        <li><b>tz</b> (optional, only if you choose Accept all): stores your time zone so charts show your local hours and days. Lasts 12 months. If you decline, charts use UTC.</li>
        <li><b>Browser storage for sign-in</b> (essential): our sign-in provider, Google Firebase, keeps sign-in state in your browser&apos;s local storage or IndexedDB. It is needed to log you in.</li>
      </ul>
      <p>We do not use advertising, analytics or tracking cookies, and we do not share cookie data with advertisers. Google or Dodo Payments may set their own cookies on their own pages, such as the Google sign-in pop-up or the payment checkout, under their own policies.</p>

      <h2>Your choices</h2>
      <p>Essential cookies cannot be switched off because the site needs them. You can accept or decline the optional cookie in the banner, and change your mind at any time: <CookieSettings className="font-semibold underline" />. Declining or withdrawing deletes the tz cookie. You can also clear cookies in your browser settings, which signs you out.</p>

      <p>More on how we handle personal data is in the <Link href="/privacy">Privacy Policy</Link>.</p>
    </LegalPage>
  );
}

import Link from "next/link";
import { LegalPage } from "@/components/legal";

export const metadata = { title: "Terms of Service", description: "The rules for using Tickwise as a developer or advertiser: eligibility (18+), earnings, payouts, ad content and liability.", alternates: { canonical: "/terms" } };

export default function Terms() {
  return (
    <LegalPage title="Terms of Service">
      <p>These Terms govern your use of Tickwise: the website, the dashboard and the Tickwise VS Code extension (together, the &quot;Service&quot;). By creating an account or using the Service you agree to them. If you do not agree, do not use the Service.</p>

      <h2>1. Who can use Tickwise</h2>
      <p>You must be at least 18 years old and able to enter a binding contract. By signing up you confirm that you are 18 or older. If you use Tickwise for a business, you confirm you can bind that business.</p>

      <h2>2. What Tickwise does</h2>
      <p>Tickwise connects advertisers with developers who use Claude Code. Developers install the extension, which replaces the spinner words Claude Code shows while it works with short text ads. Advertisers pay to show those ads. Developers earn a share of what advertisers spend. Tickwise is an independent service and is not affiliated with, endorsed by or sponsored by Anthropic.</p>

      <h2>3. Your account</h2>
      <ul>
        <li>Give accurate information and keep your login and API key private. You are responsible for activity under your account.</li>
        <li>One person, one account. Do not create accounts to game earnings or avoid a suspension.</li>
        <li>Tell us if you think your account or API key was compromised. You can rotate your key on the Connect page.</li>
      </ul>

      <h2>4. Developers</h2>
      <ul>
        <li>The extension changes your Claude Code spinner words (the <span className="num">spinnerVerbs</span> setting). Your original value is saved and restored when you pause, sign out or uninstall.</li>
        <li>The extension notices that files in your Claude Code projects folder changed, which tells it an agent is running. It does not read their contents.</li>
        <li>You earn 70% of the amount an advertiser pays for each impression we count. We decide what counts as a valid impression and may discard impressions we believe are fake, repeated or automated.</li>
        <li>Do not generate impressions or clicks artificially. That includes scripts, emulated sessions and clicking your own ads. We may withhold earnings and close accounts for fraud.</li>
        <li>Payouts start at $10. You must give us accurate payout details. We pay by hand, usually within 5 business days of a request, and may delay a payout to check for fraud or to meet legal duties. You are responsible for your own taxes. Fees charged by banks or intermediaries may reduce what you receive.</li>
      </ul>

      <h2>5. Advertisers</h2>
      <ul>
        <li>An ad is one line of plain text, up to 48 characters, with a required link. Ads are billed per 1,000 impressions (CPM) from the budget you pay at checkout. A campaign goes live after payment clears and stops when its budget is spent.</li>
        <li>Payments are handled by our payment provider, Dodo Payments. We do not see or store your card details. Prices are in US dollars and taxes may apply.</li>
        <li>You are responsible for your ad and the page it links to, and you confirm you have the rights to use them.</li>
        <li>Unspent budget on a campaign you pause or that has not run can be refunded on request, minus payment fees, unless we removed the campaign for breaking these Terms. Spent budget is not refundable.</li>
        <li>We do not guarantee any number of impressions, clicks or results. Delivery depends on how many developers are active.</li>
      </ul>

      <h2>6. Content rules</h2>
      <p>Ads and links must not be illegal, misleading, hateful, sexual, violent or harassing. They must not promote malware, phishing, scams, weapons, drugs, gambling or anything that harms developers, and must not impersonate a person or company, including Anthropic. The link must go to a page that matches the ad. We may pause or remove any campaign at any time, and may refuse any ad, at our discretion.</p>

      <h2>7. Acceptable use</h2>
      <p>Do not attack, overload or probe the Service, reverse engineer it beyond what the law allows, access other people&apos;s data, or use it to break the law or anyone&apos;s rights.</p>

      <h2>8. Your data</h2>
      <p>How we handle personal data is described in our <Link href="/privacy">Privacy Policy</Link>, and our use of cookies in the <Link href="/cookies">Cookie Policy</Link>.</p>

      <h2>9. Suspension and ending</h2>
      <p>You can stop using the Service and ask us to delete your account at any time. We can suspend or end your access if you break these Terms, if we suspect fraud or abuse, or if we need to by law. Earnings from valid impressions that are not tied to fraud remain payable after you leave, subject to the payout minimum.</p>

      <h2>10. Disclaimers</h2>
      <p>The Service is provided &quot;as is&quot; and &quot;as available&quot;. We do not promise it will be uninterrupted or error free, that ads will always show, or that Claude Code will keep supporting the settings the extension uses. Changes to Claude Code can break the extension.</p>

      <h2>11. Limit of liability</h2>
      <p>To the extent the law allows, Tickwise is not liable for indirect or consequential loss, lost profits or lost data. Our total liability for any claim relating to the Service is limited to the amount you paid us, or earned from us, in the 3 months before the claim. Nothing in these Terms limits liability that cannot be limited by law.</p>

      <h2>12. Changes</h2>
      <p>We may update these Terms. When we make a material change we will update the date at the top and, where required, ask you to accept again. Using the Service after a change means you accept it.</p>

      <h2>13. Governing law</h2>
      <p>These Terms are governed by the laws of India. Courts in India have jurisdiction over disputes, unless mandatory consumer law where you live says otherwise.</p>
    </LegalPage>
  );
}

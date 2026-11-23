import Link from "next/link";
import { LegalPage } from "@/components/legal";

export const metadata = { title: "Privacy Policy", description: "What personal data Tickwise collects, why, who it is shared with, how long it is kept and your rights.", alternates: { canonical: "/privacy" } };

export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy">
      <p>This policy explains what personal data Tickwise collects, why, who sees it, and your choices. We keep it to what we need to run the Service.</p>

      <h2>1. What we collect</h2>
      <ul>
        <li><b>Account data:</b> your email address, your name if you give one, and a sign-in identifier. If you use Google sign-in we receive the email and name Google shares. We never see your Google password.</li>
        <li><b>Terms acceptance:</b> when and which version of the Terms and policies you accepted, including your confirmation that you are 18 or older.</li>
        <li><b>API key and extension data:</b> your API key, and for each ad shown to you: the campaign, the time, and the amount earned. We also record clicks on ads. The extension notices that files in your Claude Code projects folder changed so it knows an agent is working. It does not open or send your prompts, code or files.</li>
        <li><b>Campaign data (advertisers):</b> your ad text, link, budget, CPM, and payment status.</li>
        <li><b>Payout details (developers):</b> country, account holder name, bank name, account number or IBAN and bank code, if you request payouts. These are stored encrypted and only visible to platform administrators who need them to pay you.</li>
        <li><b>Technical data:</b> basic server logs such as IP address, browser type and the pages requested, kept for security and debugging, and a time-zone cookie if you accept all cookies (see the <Link href="/cookies">Cookie Policy</Link>).</li>
      </ul>
      <p>We do not collect your card number. Card payments are taken by Dodo Payments.</p>

      <h2>2. Why we use it</h2>
      <ul>
        <li>To create your account, sign you in and keep the Service secure.</li>
        <li>To show ads, count impressions and clicks, bill advertisers and calculate developer earnings.</li>
        <li>To take payments and pay developers.</li>
        <li>To prevent fraud and abuse, and to meet legal and tax duties.</li>
        <li>To answer your questions and tell you about important changes to the Service or these policies.</li>
      </ul>
      <p>Where the law requires a legal basis, we rely on performing our contract with you, our legitimate interest in running and securing the Service, your consent (for the optional cookie), and legal obligations.</p>

      <h2>3. Who we share it with</h2>
      <p>We do not sell your personal data. We share it with companies that help us run the Service, only as far as they need to:</p>
      <ul>
        <li><b>Google Firebase:</b> sign-in and authentication.</li>
        <li><b>Neon:</b> database hosting.</li>
        <li><b>Dodo Payments:</b> advertiser payments.</li>
        <li><b>Our web hosting provider:</b> to serve the site.</li>
      </ul>
      <p>Advertisers see aggregate results for their campaigns (impressions and clicks). They are not told who you are. We may also disclose data if the law or a valid legal request requires it, or to protect the Service and its users.</p>

      <h2>4. International transfers</h2>
      <p>Our providers may process data in countries other than yours, including the United States. Where required, we rely on appropriate safeguards such as standard contractual clauses.</p>

      <h2>5. How long we keep it</h2>
      <ul>
        <li>Account data: while your account is open, then deleted or anonymised after you ask us to close it, except what we must keep.</li>
        <li>Impression, click and payment records: kept as needed for accounting and tax, normally up to 7 years.</li>
        <li>Payout details: until you replace or delete them, or your account is closed.</li>
        <li>Server logs: a short period, normally up to 90 days.</li>
      </ul>

      <h2>6. Your rights</h2>
      <p>Depending on where you live (for example under the GDPR, India&apos;s Digital Personal Data Protection Act or similar laws) you may have the right to access your data, correct it, delete it, object to or restrict some uses, receive a copy, withdraw consent, and complain to your data protection authority. To use any of these, contact us using the details below. We may need to confirm who you are first. You can also rotate your API key, pause or uninstall the extension, and change cookie choices at any time.</p>

      <h2>7. Security</h2>
      <p>We use encryption in transit, encrypt payout details at rest, and limit who can read them. No system is perfectly secure. Tell us at once if you think your account was compromised.</p>

      <h2>8. Children</h2>
      <p>Tickwise is only for people aged 18 and over. We do not knowingly collect data from anyone under 18. If you believe a minor has an account, contact us and we will delete it.</p>

      <h2>9. Changes</h2>
      <p>If we change this policy in a material way we will update the date above and, where required, tell you or ask for consent again.</p>
    </LegalPage>
  );
}

import Link from "next/link";
import { LegalPage } from "@/components/legal";

export const metadata = {
  title: "Advertise to developers using Claude Code",
  description: "Reach developers mid-task with a one-line text ad in the Claude Code spinner. Pay per 1,000 impressions from a $5 budget, with clicks and delivery hours reported.",
  alternates: { canonical: "/advertisers" },
};

export default function Advertisers() {
  return (
    <LegalPage title="Advertise to developers mid-task" dated={false}>
      <p>Tickwise puts your message in front of developers at the moment they are waiting for their AI agent to finish. One line of text, no banners, in the spinner they are already watching.</p>
      <p><Link href="/login?next=advertise" className="btn inline-flex">Run an ad</Link></p>

      <h2>How it works</h2>
      <ul>
        <li><b>Write one line.</b> Up to 48 characters of plain text plus a link. You see a live preview of how it looks in the terminal and the VS Code chat panel as you type.</li>
        <li><b>Set a CPM and budget.</b> Pay per 1,000 impressions. The minimum CPM is $2.00 and the minimum budget is $5. A higher CPM is shown first.</li>
        <li><b>Choose where it appears.</b> The terminal, the VS Code extension, or both. In supporting terminals the link is clickable.</li>
        <li><b>Pay and launch.</b> Pay by card at checkout. The ad goes live once the payment clears and stops when the budget is spent.</li>
      </ul>

      <h2>What you see</h2>
      <p>Your dashboard shows impressions, clicks, click rate, spend, how many developers you reached, and the hours and weekdays your ads are seen. Developers are counted, never identified.</p>

      <h2>Rules</h2>
      <p>Ads must be honest and legal and the link must match the ad. We review for abuse and can pause any campaign. See the <Link href="/terms">Terms of Service</Link> for content rules and refunds on unspent budget.</p>
    </LegalPage>
  );
}

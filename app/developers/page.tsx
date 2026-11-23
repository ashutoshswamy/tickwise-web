import Link from "next/link";
import { LegalPage } from "@/components/legal";

export const metadata = {
  title: "Earn money while Claude Code thinks",
  description: "Install the Tickwise VS Code extension and earn 70% of every ad impression shown in your Claude Code spinner. No prompts or code are read. Payouts from $10.",
  alternates: { canonical: "/developers" },
};

export default function Developers() {
  return (
    <LegalPage title="Earn while Claude Code thinks" dated={false}>
      <p>Every time Claude Code works on a task it shows a spinner with a changing word. Tickwise swaps those words for short sponsor lines and pays you for the time the agent spends working. You change nothing about how you code.</p>
      <p><Link href="/login?next=earn" className="btn btn-sun inline-flex">Start earning</Link></p>

      <h2>How it works</h2>
      <ul>
        <li><b>Install the extension.</b> Add Tickwise to VS Code and sign in with your browser or an API key from the Connect page. It takes under a minute.</li>
        <li><b>Work as usual.</b> While Claude Code runs in the terminal or in the VS Code extension, the spinner shows an ad line such as &quot;Ad: your text&quot;. In a supporting terminal an ad with a link is clickable with Cmd or Ctrl.</li>
        <li><b>Get paid.</b> Each counted impression credits you 70% of the CPM the advertiser pays. Watch it add up live on the Earn page and request a payout once you pass $10.</li>
      </ul>

      <h2>What you earn</h2>
      <p>Earnings depend on how long your agents work and what advertisers bid. At a $4 CPM and around three hours of agent time a day the earnings estimator on the home page shows what that adds up to over a working month. Ads with a higher CPM are shown first.</p>

      <h2>Your code stays yours</h2>
      <ul>
        <li>The extension does not read your prompts, your code or your files. It only notices that session files changed, which tells it an agent is running.</li>
        <li>Ads are one line of plain text, 48 characters at most, with a link. No images, scripts or tracking pixels.</li>
        <li>Pause, sign out or uninstall and your original spinner words are restored exactly as they were.</li>
      </ul>

      <h2>Works with</h2>
      <p>Claude Code in the terminal and in the Claude Code VS Code extension. Tickwise is an independent service and is not affiliated with Anthropic.</p>

      <h2>Getting paid</h2>
      <p>Request a payout from $10. Payouts are sent by hand, usually within 5 business days, to the bank details you save on the Earn page. Details are stored encrypted. Read the <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy Policy</Link> for the full rules.</p>
    </LegalPage>
  );
}

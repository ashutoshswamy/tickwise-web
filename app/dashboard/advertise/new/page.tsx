import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { requireUser } from "@/lib/auth";
import CampaignForm from "../form";

const errs: Record<string, string> = {
  text: "Ad text must be 1 to 48 characters.",
  money: "CPM must be at least $2.00 and budget at least $5.",
  link: "Add a valid link. Use a full web address starting with http or https.",
  placement: "Choose where your ad is shown.",
};

export default async function NewCampaign({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  await requireUser();
  const { e } = await searchParams;
  return (
    <div className="mx-auto grid max-w-xl gap-6">
      <div>
        <Link href="/dashboard/advertise" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink"><ArrowLeftIcon className="size-4" strokeWidth={2} /> Campaigns</Link>
        <h1 className="display mt-3 text-4xl md:text-5xl">New campaign</h1>
        <p className="mt-2 text-muted">Pay by card. The ad goes live on checkout.</p>
        {e && <p role="alert" className="mt-4 rounded-xl bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">{errs[e] ?? "Something went wrong."}</p>}
      </div>
      <section className="panel p-6 md:p-8"><CampaignForm /></section>
    </div>
  );
}

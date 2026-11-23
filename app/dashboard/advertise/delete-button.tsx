"use client";
import { Dialog } from "@ashutoshswamy/smoui";
import { deleteCampaign } from "../actions";

export default function DeleteButton({ id, text }: { id: number; text: string }) {
  return (
    <Dialog
      tone="danger"
      alert
      trigger="Delete campaign"
      triggerClassName="btn btn-ghost h-9 !px-4 text-danger"
      title="Delete this campaign?"
      description={`"${text}" is unpaid and will be removed for good. This can't be undone.`}
      confirmLabel="Delete"
      cancelLabel="Keep it"
      onConfirm={() => {
        const fd = new FormData();
        fd.set("id", String(id));
        return deleteCampaign(fd);
      }}
    />
  );
}

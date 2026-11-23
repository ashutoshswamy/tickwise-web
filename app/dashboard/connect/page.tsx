import { ApiKeyField, CopyButton, FloatingInput } from "@ashutoshswamy/smoui";
import { requireUser } from "@/lib/auth";
import { regenerateKey } from "../actions";

const base = process.env.APP_URL ?? "http://localhost:3000";

export default async function Connect() {
  const u = await requireUser();
  return (
    <div className="mx-auto grid max-w-xl gap-6">
      <div>
        <h1 className="display text-4xl md:text-5xl">Connect the extension</h1>
        <p className="mt-2 text-muted">In VS Code run <span className="num text-ink">Tickwise: Sign in</span> and paste these.</p>
      </div>
      <section className="panel grid gap-5 p-6 md:p-8">
        <FloatingInput label="Server" readOnly value={base} trailing={<CopyButton text={base} label="Copy" />} />
        <ApiKeyField value={u.api_key} onRegenerate={regenerateKey} meta="Treat this like a password. It credits impressions to your account. Rotating signs the extension out until you paste the new key." />
      </section>
    </div>
  );
}

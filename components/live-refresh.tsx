"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Re-renders the current dashboard page the moment the server reports a change, and shows whether the live link is up.
export function LiveRefresh() {
  const router = useRouter();
  const [up, setUp] = useState(false);
  useEffect(() => {
    const es = new EventSource("/api/stream");
    let t: ReturnType<typeof setTimeout>;
    es.addEventListener("ready", () => setUp(true));
    es.onerror = () => setUp(false);
    es.addEventListener("change", () => {
      clearTimeout(t);
      t = setTimeout(() => router.refresh(), 300); // batch bursts of impressions
    });
    return () => { clearTimeout(t); es.close(); };
  }, [router]);
  return (
    <span role="status" aria-live="polite" className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full bg-pine px-3.5 py-2 text-xs font-semibold text-sun shadow-lg">
      <span className={`size-2 rounded-full ${up ? "bg-[#4ade80]" : "bg-[#fbbf24]"}`} aria-hidden />
      {up ? "Live" : "Reconnecting"}
    </span>
  );
}

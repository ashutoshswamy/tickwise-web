"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export type Consent = "all" | "essential";
const read = (): Consent | null => {
  const v = document.cookie.split("; ").find((c) => c.startsWith("consent="))?.split("=")[1];
  return v === "all" || v === "essential" ? v : null;
};

export function setConsent(v: Consent) {
  document.cookie = `consent=${v}; path=/; max-age=31536000; samesite=lax`;
  if (v === "essential") document.cookie = "tz=; path=/; max-age=0"; // drop the optional cookie when consent is withdrawn
  window.dispatchEvent(new Event("consent"));
}

// Footer link that reopens the banner so people can change their choice.
export function CookieSettings({ className = "" }: { className?: string }) {
  return <button type="button" className={className} onClick={() => window.dispatchEvent(new Event("cookie-settings"))}>Cookie settings</button>;
}

export function CookieConsent() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(read() === null);
    const close = () => setOpen(false), show = () => setOpen(true);
    window.addEventListener("consent", close);
    window.addEventListener("cookie-settings", show);
    return () => { window.removeEventListener("consent", close); window.removeEventListener("cookie-settings", show); };
  }, []);
  if (!open) return null;
  return (
    <div role="dialog" aria-label="Cookie consent" aria-live="polite" className="panel fixed inset-x-4 bottom-4 z-50 p-5 shadow-lg md:left-auto md:right-6 md:max-w-md">
      <p className="display text-xl">Cookies</p>
      <p className="mt-2 text-sm text-muted">
        We always use a sign-in cookie to keep you logged in. With your OK we also remember your time zone so your charts show local hours. No ads or tracking cookies.
        See the <Link href="/cookies" className="font-semibold text-ink underline">Cookie Policy</Link>.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="btn btn-ghost h-10 flex-1 !px-4" onClick={() => setConsent("essential")}>Essential only</button>
        <button type="button" className="btn btn-sun h-10 flex-1 !px-4" onClick={() => setConsent("all")}>Accept all</button>
      </div>
    </div>
  );
}

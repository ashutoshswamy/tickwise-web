"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const allowed = () => document.cookie.split("; ").includes("consent=all");

// Stores the browser's time zone in a cookie so the server can bucket hours and days locally. Only with cookie consent.
export function TzSet() {
  const router = useRouter();
  const [ok, setOk] = useState(false);
  useEffect(() => {
    setOk(allowed());
    const h = () => setOk(allowed());
    window.addEventListener("consent", h);
    return () => window.removeEventListener("consent", h);
  }, []);
  useEffect(() => {
    if (!ok) return;
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && !document.cookie.split("; ").includes(`tz=${tz}`)) {
      document.cookie = `tz=${tz}; path=/; max-age=31536000; samesite=lax`;
      router.refresh();
    }
  }, [ok, router]);
  return null;
}

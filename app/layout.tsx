import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import { CookieConsent } from "@/components/cookie-consent";
import { SITE_DESC, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";

// Menlo is a system font (no web file), so it is a plain stack in globals.css.
const display = Bricolage_Grotesque({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-bricolage", display: "swap" });
const body = DM_Sans({ subsets: ["latin"], variable: "--font-dm", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME}: ${SITE_TAGLINE}`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESC,
  applicationName: SITE_NAME,
  keywords: ["Claude Code ads", "developer ads", "earn from Claude Code", "VS Code extension", "sponsor lines", "developer advertising", "AI agent spinner"],
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: SITE_NAME, url: "/", title: `${SITE_NAME}: ${SITE_TAGLINE}`, description: SITE_DESC, locale: "en_US" },
  twitter: { card: "summary_large_image", title: `${SITE_NAME}: ${SITE_TAGLINE}`, description: SITE_DESC },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

export const viewport: Viewport = { themeColor: "#f3f5ef", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable}`}>
      <body className="min-h-dvh">{children}<CookieConsent /></body>
    </html>
  );
}

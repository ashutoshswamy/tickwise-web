import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const alt = `${SITE_NAME}: ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Same type as the site: Bricolage Grotesque 800 for display, DM Sans for text (static woff from @fontsource, satori cannot read woff2).
const font = (pkg: string, file: string) => readFile(path.join(process.cwd(), "node_modules/@fontsource", pkg, "files", file));

export default async function OgImage() {
  const [display, body] = await Promise.all([
    font("bricolage-grotesque", "bricolage-grotesque-latin-800-normal.woff"),
    font("dm-sans", "dm-sans-latin-500-normal.woff"),
  ]);
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#d63a1e", color: "#fff8f2", fontFamily: "DM Sans" }}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between", padding: "64px 72px 48px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontFamily: "Bricolage Grotesque", fontSize: 48, letterSpacing: "-0.04em" }}>
          <svg width="72" height="72" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
            <rect width="256" height="256" rx="56" fill="#0d0d0d" />
            <rect x="52" y="56" width="152" height="40" rx="20" fill="#f3f5ef" />
            <rect x="108" y="56" width="40" height="144" rx="20" fill="#f3f5ef" />
          </svg>
          {SITE_NAME}
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontFamily: "Bricolage Grotesque", fontSize: 100, lineHeight: 0.95, letterSpacing: "-0.04em" }}>
          <div style={{ display: "flex" }}>Your agent is thinking.</div>
          <div style={{ display: "flex", color: "#ffc72c" }}>Get paid for it.</div>
        </div>
        <div style={{ display: "flex", fontSize: 32, opacity: 0.92 }}>Sponsor lines for Claude Code. Earn per impression.</div>
      </div>
      <div style={{ display: "flex", height: 40, background: "#12261e" }} />
    </div>,
    { ...size, fonts: [{ name: "Bricolage Grotesque", data: display, weight: 800, style: "normal" }, { name: "DM Sans", data: body, weight: 500, style: "normal" }] },
  );
}

import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Same mark as the VS Code extension icon (extension/images/icon.svg).
export default function Icon() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", borderRadius: 39, overflow: "hidden" }}>
    <svg width="180" height="180" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
      <rect width="256" height="256" fill="#0d0d0d"/>
      <rect x="52" y="56" width="152" height="40" rx="20" fill="#f3f5ef"/>
      <rect x="108" y="56" width="40" height="144" rx="20" fill="#f3f5ef"/>
    </svg>
    </div>,
    size,
  );
}

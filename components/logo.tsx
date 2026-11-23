// The Tickwise mark: a white T on black. One drawing everywhere: site, favicon and extension/images/icon.svg.
export function Logo({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" className={className} aria-hidden="true">
      <rect width="256" height="256" rx="56" fill="#0d0d0d" />
      <rect x="52" y="56" width="152" height="40" rx="20" fill="#f3f5ef" />
      <rect x="108" y="56" width="40" height="144" rx="20" fill="#f3f5ef" />
    </svg>
  );
}

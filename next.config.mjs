// same-origin-allow-popups: lets Firebase's Google popup talk back to this page without COOP console errors.
// Report-Only: logs violations without blocking. Watch the browser console on login and checkout in production,
// then rename the header to "Content-Security-Policy" to enforce it.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://apis.google.com https://www.gstatic.com https://www.google.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.googleusercontent.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.googleapis.com https://*.firebaseapp.com https://*.dodopayments.com",
  "frame-src https://accounts.google.com https://*.firebaseapp.com https://*.dodopayments.com",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'self'",
].join("; ");

const headers = [
  ...(process.env.NODE_ENV === "production" ? [{ key: "Content-Security-Policy-Report-Only", value: csp }] : []),
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

export default {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers }];
  },
};

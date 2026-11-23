import { NextResponse, type NextRequest } from "next/server";

// WAITLIST_ENABLED=true: /waitlist is the only thing served. Pages and /r/ links redirect there; /api answers 503.
export function proxy(req: NextRequest) {
  if (process.env.WAITLIST_ENABLED !== "true") return;
  if (req.nextUrl.pathname.startsWith("/api")) return Response.json({ error: "waitlist" }, { status: 503 });
  return NextResponse.redirect(new URL("/waitlist", req.url));
}

// Skip only the waitlist itself, Next internals and the metadata/asset routes.
export const config = {
  matcher: ["/((?!waitlist|_next|icon|apple-icon|opengraph-image|robots\\.txt|sitemap\\.xml|favicon\\.ico|.*\\..*).*)"],
};

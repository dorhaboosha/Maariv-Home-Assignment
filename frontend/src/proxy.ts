import { NextRequest, NextResponse } from "next/server";
import { TAG_REDIRECTS } from "./config/redirects";

/**
 * Next.js edge proxy (formerly "middleware") that intercepts requests to `/tags/:id`
 * and redirects specific tag IDs to their canonical pages on the external Maariv website.
 *
 * Why here instead of the page component?
 * Redirecting at the edge means the response is served before React ever runs —
 * no component is mounted, no data is fetched, and the user is sent to the destination
 * in a single round-trip with no visible loading state.
 *
 * The redirect map lives in `src/config/redirects.ts` so new entries can be added
 * without touching this routing logic (Open/Closed Principle).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Match only exact /tags/<numeric-id> paths — ignore sub-paths or non-numeric segments.
  const tagMatch = pathname.match(/^\/tags\/(\d+)$/);

  if (tagMatch) {
    const tagId = tagMatch[1];
    const target = TAG_REDIRECTS[tagId];

    if (target) {
      // 308 Permanent Redirect — tells browsers and crawlers this tag has moved permanently.
      return NextResponse.redirect(target, 308);
    }
  }

  // No redirect configured for this tag — let the request continue to the tag page component.
  return NextResponse.next();
}

/**
 * Limit the proxy to tag routes only so it does not add latency to every other request.
 */
export const config = {
  matcher: "/tags/:id*",
};

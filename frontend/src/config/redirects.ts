/**
 * Central redirect configuration for tag routes.
 *
 * - **Keys** — Tag IDs as strings (matches the capture group from `/tags/:id` in `proxy.ts`,
 *   and avoids `Number` coercion when reading from URL segments).
 * - **Values** — Absolute URLs on the external Maariv website where the tag "lives" permanently.
 *
 * Consumers:
 * - `src/proxy.ts` — edge redirect when a user navigates to `/tags/{id}` directly.
 * - `src/components/ArticlePage/ArticleTags.tsx` — renders an `<a href="...">` instead of
 *   `next/link` so the App Router does not prefetch RSC data for a route that immediately redirects.
 *
 * To add a new redirect, append one line here — no changes required in routing code.
 */
export const TAG_REDIRECTS: Record<string, string> = {
  // בנימין נתניהו — assignment requirement: redirect tag 33 to the canonical Maariv page.
  "33": "https://www.maariv.co.il/tags/%D7%91%D7%A0%D7%99%D7%9E%D7%99%D7%9F-%D7%A0%D7%AA%D7%A0%D7%99%D7%94%D7%95",
};

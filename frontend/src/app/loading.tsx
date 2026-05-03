/**
 * Global **loading** UI for the App Router.
 *
 * Next.js automatically wraps route segments in React Suspense and shows this file while:
 * - A Server Component for the matched route is still resolving (e.g. slow `fetch`), or
 * - The user navigates between routes and the next segment has not streamed yet.
 *
 * This is a minimal centered spinner — no data fetching here; keep it as light as possible.
 */
export default function Loading() {
  return (
    <div className="page-container flex items-center justify-center min-h-screen">
      {/*
        Spinning ring: full gray border + blue top segment — rotating the whole element
        creates the classic indeterminate loader without extra SVG or JS.
      */}
      <div
        className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"
        role="status"
        aria-label="טוען"
      />
    </div>
  );
}

/**
 * Route-level loading UI for `/tags/[id]`.
 *
 * Shown by Next.js while the Server Component in `page.tsx` is resolving (e.g. during `getTagById`).
 * Skeleton layout mirrors the real page: title bar + wide image placeholder.
 */
export default function TagLoading() {
  return (
    <div className="page-container flex flex-col gap-4 animate-pulse">
      {/* Approximates the <h1> line height — width is arbitrary ; real title length varies. */}
      <div className="h-7 bg-gray-200 rounded w-1/3" />
      {/* Matches aspect-video hero region when an image exists. */}
      <div className="h-48 bg-gray-200 rounded w-full" />
    </div>
  );
}

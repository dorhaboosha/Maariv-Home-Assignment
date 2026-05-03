/**
 * Route-level loading UI for `/article/[id]`.
 *
 * Shown while the Server Component in `page.tsx` is resolving (e.g. during `getArticleById`).
 * Skeleton blocks loosely mirror `ArticleContent`: title, description line, hero image, body paragraphs.
 */
export default function ArticleLoading() {
  return (
    <div className="page-container flex flex-col gap-4 animate-pulse">
      {/* Title — ~2xl heading; width is illustrative only. */}
      <div className="h-8 bg-gray-200 rounded w-3/4" />
      {/* Description — one shorter line under the title. */}
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      {/* Hero image — tall block standing in for aspect-video + next/image. */}
      <div className="h-64 bg-gray-200 rounded w-full" />
      {/* Body text — a few full-width lines with the last slightly shorter. */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
      </div>
    </div>
  );
}

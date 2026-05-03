import { notFound } from "next/navigation";
import Image from "next/image";
import { getTagById } from "../../../services/tagService";
import { logError } from "../../../services/loggerService";
import type { Tag } from "../../../types/tag";

interface TagPageProps {
  /** Dynamic segment from the URL (e.g. `/tags/17` → `"17"`). Typed as a Promise per Next.js 15+ App Router conventions. */
  params: Promise<{ id: string }>;
}

/**
 * Tag detail page — shows the tag name and optional hero image from `GET /api/tags/{id}`.
 *
 * - **Server Component** — fetches on the server with `cache: "no-store"` (via `apiClient`).
 * - **404** — calls `notFound()` when the API returns 404 so the global `not-found.tsx` renders.
 * - **Other errors** — logs to the backend via `logError`, then rethrows so Next can surface an error boundary.
 *
 * Note: Some tag IDs (e.g. `33`) are redirected at the edge by `src/proxy.ts` before this page runs;
 * those requests never hit this component.
 */
export default async function TagPage({ params }: TagPageProps) {
  const { id } = await params;

  let tag: Tag;
  try {
    tag = await getTagById(id);
  } catch (err: unknown) {
    // apiClient attaches HTTP status to thrown errors — branch for missing resource vs. real failure.
    const status = (err as { status?: number }).status;
    if (status === 404) {
      notFound();
    }
    logError("Failed to fetch tag", "TagPage", String(err));
    throw err;
  }

  return (
    <main className="page-container flex flex-col gap-5">
      <header className="pb-3">
        <h1 className="text-2xl md:text-3xl font-bold">
          {tag.tagName}
        </h1>
      </header>

      {tag.tagImage && (
        <div className="relative w-full aspect-video rounded overflow-hidden shadow-sm">
          <Image
            src={tag.tagImage}
            alt={tag.tagName}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
            priority
          />
        </div>
      )}
    </main>
  );
}

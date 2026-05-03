import Link from "next/link";
import type { ArticleTag } from "../../types/article";
import { TAG_REDIRECTS } from "../../config/redirects";

interface ArticleTagsProps {
  tags: ArticleTag[];
}

/**
 * Renders article tags as a comma-separated list of links.
 *
 * Tags listed in `TAG_REDIRECTS` open the external Maariv page in a **new tab** via a plain `<a>`.
 * Using `<a>` instead of `next/link` avoids the App Router prefetching RSC payloads for routes
 * that immediately redirect at the edge — which would spam the console with harmless errors.
 *
 * All other tags use `next/link` to `/tags/{tagId}` for fast client-side navigation.
 */
export default function ArticleTags({ tags }: ArticleTagsProps) {
  if (tags.length === 0) return null;

  return (
    <p className="text-sm">
      <span className="font-semibold">תגיות: </span>
      {tags.map((tag, index) => {
        const externalUrl = TAG_REDIRECTS[String(tag.tagId)];
        return (
          <span key={tag.tagId}>
            {externalUrl ? (
              <a
                href={externalUrl}
                className="underline text-blue-600 hover:text-blue-800 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {tag.tagName}
              </a>
            ) : (
              <Link
                href={`/tags/${tag.tagId}`}
                className="underline text-blue-600 hover:text-blue-800 transition-colors"
              >
                {tag.tagName}
              </Link>
            )}
            {index < tags.length - 1 && ", "}
          </span>
        );
      })}
    </p>
  );
}

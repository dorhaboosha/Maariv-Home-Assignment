import Link from "next/link";
import type { ArticleTag } from "../../types/article";
import { TAG_REDIRECTS } from "../../config/redirects";

interface ArticleTagsProps {
  tags: ArticleTag[];
}

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

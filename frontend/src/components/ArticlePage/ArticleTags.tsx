import Link from "next/link";
import type { ArticleTag } from "../../types/article";

interface ArticleTagsProps {
  tags: ArticleTag[];
}

export default function ArticleTags({ tags }: ArticleTagsProps) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Link key={tag.tagId} href={`/tags/${tag.tagId}`} className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors">
          {tag.tagName}
        </Link>
      ))}
    </section>
  );
}

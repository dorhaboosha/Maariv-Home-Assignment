import Image from "next/image";
import type { Article } from "../../types/article";

interface ArticleContentProps {
  article: Article;
}

export default function ArticleContent({ article }: ArticleContentProps) {
  return (
    <article className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold leading-snug">{article.title}</h1>

      <p className="text-lg text-gray-600">{article.description}</p>

      <time className="text-sm text-gray-400">{article.date}</time>

      {article.imageURL && (
        <figure className="flex flex-col gap-1">
          <div className="relative w-full aspect-video">
            <Image src={article.imageURL} alt={article.title} fill className="object-cover rounded" sizes="(max-width: 768px) 100vw, 800px"/>
          </div>
          {article.imageCredit && (
            <figcaption className="text-xs text-gray-400">
              {article.imageCredit}
            </figcaption>
          )}
        </figure>
      )}

      <p className="text-base leading-relaxed whitespace-pre-line">
        {article.body}
      </p>
    </article>
  );
}

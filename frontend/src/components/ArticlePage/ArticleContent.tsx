import Image from "next/image";
import type { Article } from "../../types/article";
import ShareButton from "./ShareButton";

interface ArticleContentProps {
  article: Article;
}

export default function ArticleContent({ article }: ArticleContentProps) {
  return (
    <article className="flex flex-col gap-5">
      <h1 className="text-2xl md:text-3xl font-bold leading-tight">
        {article.title}
      </h1>

      <p className="text-base md:text-lg leading-relaxed font-bold">
        {article.description}
      </p>

      <div className="flex items-center justify-between">
        <time dir="ltr" className="text-sm">{article.date}</time>
        <ShareButton />
      </div>

      {article.imageURL && (
        <figure className="flex flex-col gap-1">
          <div className="relative w-full aspect-video rounded overflow-hidden">
            <Image src={article.imageURL} alt={article.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 800px" priority />
          </div>
          {article.imageCredit && (
            <figcaption className="text-xs text-right">
              {article.imageCredit}
            </figcaption>
          )}
        </figure>
      )}

      <p className="text-base leading-loose whitespace-pre-line">
        {article.body}
      </p>
    </article>
  );
}

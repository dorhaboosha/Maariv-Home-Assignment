import { notFound } from "next/navigation";
import { getArticleById } from "../../../services/articleService";
import { logError } from "../../../services/loggerService";
import ArticleContent from "../../../components/ArticlePage/ArticleContent";
import ArticleTags from "../../../components/ArticlePage/ArticleTags";
import AdditionalArticlesLazy from "../../../components/ArticlePage/AdditionalArticlesLazy";
import ShareButton from "../../../components/ArticlePage/ShareButton";
import type { Article } from "../../../types/article";

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;

  let article: Article;
  try {
    article = await getArticleById(id);
  } catch (err: unknown) {
    const status = (err as { status?: number }).status;
    if (status === 404) notFound();
    logError("Failed to fetch article", "ArticlePage", String(err));
    throw err;
  }

  return (
    <main className="page-container flex flex-col gap-6">
      <ArticleContent article={article} />
      <ArticleTags tags={article.tags} />
      <AdditionalArticlesLazy excludeId={article.id} />
      <ShareButton />
    </main>
  );
}

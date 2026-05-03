import { notFound } from "next/navigation";
import { getArticleById } from "../../../services/articleService";
import { logError } from "../../../services/loggerService";
import ArticleContent from "../../../components/ArticlePage/ArticleContent";
import ArticleTags from "../../../components/ArticlePage/ArticleTags";
import AdditionalArticlesLazy from "../../../components/ArticlePage/AdditionalArticlesLazy";
import type { Article } from "../../../types/article";

interface ArticlePageProps {
  /** Dynamic segment from the URL (e.g. `/article/42` → `"42"`). Typed as a Promise per Next.js 15+ App Router conventions. */
  params: Promise<{ id: string }>;
}

/**
 * Article detail page — composes the main content, tag links, and lazy-loaded "more articles" section.
 *
 * - **Server Component** — initial article HTML is streamed from the server; `getArticleById` uses `cache: "no-store"`.
 * - **Render order** (assignment): main content → tags → additional articles (share lives inside `ArticleContent`).
 * - **404** — `notFound()` when the API returns 404 (`notFound` throws — code below does not run for that case).
 * - **Other errors** — `logError` then rethrow so a non-404 failure still surfaces as an error.
 *
 * `AdditionalArticlesLazy` is a Client Component: it defers its API call until the section scrolls into view.
 */
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
    </main>
  );
}

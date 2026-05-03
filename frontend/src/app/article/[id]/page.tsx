import { notFound } from "next/navigation";
import { getArticleById } from "../../../services/articleService";
import type { Article } from "../../../types/article";

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;

  let article: Article;
  try {
    article = await getArticleById(id);
  } 
  catch (err: unknown) {
    const status = (err as { status?: number }).status;
    if (status === 404) { 
      notFound();
    }
    
    throw err;
  }

  return (
    <main className="page-container">
      <p>{article.title}</p>
    </main>
  );
}

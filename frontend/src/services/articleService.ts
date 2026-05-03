import { apiClient } from "./apiClient";
import type { Article } from "../types/article";

/**
 * Fetches every article from the backend.
 * Used by the homepage to render the full article list.
 */
export async function getAllArticles(): Promise<Article[]> {
  return apiClient<Article[]>("/api/articles");
}

/**
 * Fetches a single article by its ID.
 * Throws with `status: 404` if the article does not exist, allowing the
 * caller to invoke `notFound()` and render the custom 404 page.
 *
 * @param id  The article ID (numeric string or number).
 */
export async function getArticleById(id: string | number): Promise<Article> {
  return apiClient<Article>(`/api/articles/${id}`);
}

/**
 * Fetches all articles except the one specified by `excludeId`.
 * Used by `AdditionalArticlesLazy` to populate the "כתבות נוספות" section
 * without repeating the article currently being viewed.
 *
 * @param excludeId  The ID of the article to omit from the results.
 */
export async function getAdditionalArticles(excludeId: string | number): Promise<Article[]> {
  return apiClient<Article[]>(`/api/articles/additional?excludeId=${excludeId}`);
}

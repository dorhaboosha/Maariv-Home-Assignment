import { apiClient } from "./apiClient";
import type { Article } from "../types/article";

export async function getAllArticles(): Promise<Article[]> {
  return apiClient<Article[]>("/api/articles");
}

export async function getArticleById(id: string | number): Promise<Article> {
  return apiClient<Article>(`/api/articles/${id}`);
}

export async function getAdditionalArticles(excludeId: string | number): Promise<Article[]> {
  return apiClient<Article[]>(`/api/articles/additional?excludeId=${excludeId}`);
}

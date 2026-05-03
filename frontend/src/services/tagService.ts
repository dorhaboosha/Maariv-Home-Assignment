import { apiClient } from "./apiClient";
import type { Tag } from "../types/tag";

export async function getTagById(id: string | number): Promise<Tag> {
  return apiClient<Tag>(`/api/tags/${id}`);
}

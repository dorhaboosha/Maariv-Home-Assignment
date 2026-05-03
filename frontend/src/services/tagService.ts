import { apiClient } from "./apiClient";
import type { Tag } from "../types/tag";

/**
 * Fetches a single tag by its ID.
 * Throws with `status: 404` if the tag does not exist, allowing the
 * caller to invoke `notFound()` and render the custom 404 page.
 *
 * @param id  The tag ID (numeric string or number).
 */
export async function getTagById(id: string | number): Promise<Tag> {
  return apiClient<Tag>(`/api/tags/${id}`);
}
